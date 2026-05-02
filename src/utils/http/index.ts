/**
 * HTTP 请求封装模块
 * 基于 Axios 封装的 HTTP 请求工具，提供统一的请求/响应处理
 *
 * ## 主要功能
 *
 * - 请求/响应拦截器（自动添加 Token、统一错误处理）
 * - 401（账号或密码错误）直接抛出错误
 * - 40102（Token 过期）自动刷新 Token，刷新成功后重发失败请求，刷新失败则登出
 * - 统一的成功/错误消息提示
 * - 支持 GET/POST/PUT/DELETE 等常用方法
 *
 * @module utils/http
 * @author Art Design Pro Team
 */

import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/store/modules/user';
import { ApiStatus } from './status';
import { HttpError, handleError, showError, showSuccess } from './error';
import { $t } from '@/locales';
import { BaseResponse } from '@/types';

/** 扩展 Axios 请求配置，支持自定义标记 */
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    /** 标记是否为 Token 刷新后的重试请求，防止死循环 */
    _isRetry?: boolean;
  }
}

/** 请求配置常量 */
const REQUEST_TIMEOUT = 15000;
const LOGOUT_DELAY = 500;

/** 刷新接口路径（用于防护刷新接口自身触发重复刷新） */
const REFRESH_URL = '/auth/refresh';

/** Token 刷新状态 */
let isRefreshing = false;
type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};
let pendingRequests: PendingRequest[] = [];

/** 扩展 AxiosRequestConfig */
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean;
  showSuccessMessage?: boolean;
}

const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: '/api/admin',
  withCredentials: false
});

/** 请求拦截器 */
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    // FormData 时删除 Content-Type，让浏览器自动设置（包含 boundary）
    if (request.data instanceof FormData) {
      delete request.headers['Content-Type'];
    }

    // Token 正在刷新中，将新请求挂起，不发到服务端
    if (isRefreshing) {
      return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
        pendingRequests.push({
          resolve: (token: string) => {
            request.headers.set('Authorization', `Bearer ${token}`);
            resolve(request);
          },
          reject
        });
      });
    }

    const { accessToken } = useUserStore();
    if (accessToken) request.headers.set('Authorization', `Bearer ${accessToken}`);

    return request;
  },
  (error) => {
    showError(createHttpError($t('httpMsg.requestConfigError'), ApiStatus.error));
    return Promise.reject(error);
  }
);

/** 响应拦截器 */
axiosInstance.interceptors.response.use((response: AxiosResponse<BaseResponse>) => {
    const { code, msg } = response.data;
    if (code === ApiStatus.success) return response;

    // Token 过期且非重试请求且非刷新接口 → 尝试刷新
    if (
      code === ApiStatus.tokenExpired &&
      !response.config._isRetry &&
      !response.config.url?.includes(REFRESH_URL)
    ) {
      return handleTokenExpired().then((newToken) => {
        response.config.headers.set('Authorization', `Bearer ${newToken}`);
        response.config._isRetry = true;
        return axiosInstance.request(response.config);
      });
    }

    throw createHttpError(msg || $t('httpMsg.requestFailed'), code);
  },
  (error) => {
    const responseData = error.response?.data;

    // Token 过期且非重试请求且非刷新接口 → 尝试刷新
    if (
      responseData?.code === ApiStatus.tokenExpired &&
      error.config &&
      !error.config._isRetry &&
      !error.config.url?.includes(REFRESH_URL)
    ) {
      return handleTokenExpired().then((newToken) => {
        error.config.headers.set('Authorization', `Bearer ${newToken}`);
        error.config._isRetry = true;
        return axiosInstance.request(error.config);
      });
    }

    return Promise.reject(handleError(error));
  }
);

/** 统一创建HttpError */
function createHttpError(message: string, code: number) {
  return new HttpError(message, code);
}

/**
 * 处理 Token 过期：尝试用 refreshToken 刷新
 * - 第一个 40102 请求触发刷新，后续请求排队等待
 * - 刷新成功：更新 Token，释放所有排队请求
 * - 刷新失败：登出，拒绝所有排队请求
 * @returns Promise<string> 新的 accessToken
 */
function handleTokenExpired(): Promise<string> {
  if (isRefreshing) {
    // 刷新进行中，排队等待
    return new Promise<string>((resolve, reject) => {
      pendingRequests.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  const userStore = useUserStore();
  const currentRefreshToken = userStore.refreshToken;

  if (!currentRefreshToken) {
    // 无 refreshToken，直接登出
    flushPendingRequests(null);
    return Promise.reject(createHttpError($t('httpMsg.unauthorized'), ApiStatus.tokenExpired));
  }

  // 用独立 axios 调刷新接口，绕过拦截器避免死循环
  return axios
    .post<BaseResponse<{ accessToken: string; refreshToken: string }>>(
      '/api/admin' + REFRESH_URL,
      { refreshToken: currentRefreshToken },
      { headers: { 'Content-Type': 'application/json' }, timeout: REQUEST_TIMEOUT }
    )
    .then((res) => {
      const { code, data } = res.data;
      if (code === ApiStatus.success && data) {
        // 刷新成功，更新 Token
        userStore.setToken(data.accessToken, data.refreshToken);
        // 先重置状态再释放排队请求（避免释放后的重试请求被再次挂起）
        flushPendingRequests(data.accessToken);
        return data.accessToken;
      }
      // 业务码非成功，视为刷新失败
      flushPendingRequests(null);
      throw createHttpError($t('httpMsg.unauthorized'), ApiStatus.tokenExpired);
    })
    .catch((err) => {
      // 刷新接口请求失败（仅在未被 flushPendingRequests 处理时执行）
      if (isRefreshing) flushPendingRequests(null);
      throw err instanceof HttpError
        ? err
        : createHttpError($t('httpMsg.unauthorized'), ApiStatus.tokenExpired);
    });
}

/**
 * 统一释放排队请求并重置刷新状态
 * @param token 新 Token（非空=成功，null=失败）
 */
function flushPendingRequests(token: string | null) {
  // 先重置状态，确保释放后的请求不会被再次挂起
  isRefreshing = false;
  const requests = [...pendingRequests];
  pendingRequests = [];

  if (token) {
    requests.forEach((req) => req.resolve(token));
  } else {
    const error = createHttpError($t('httpMsg.unauthorized'), ApiStatus.tokenExpired);
    requests.forEach((req) => req.reject(error));
    showError(error, true);
    logOut();
  }
}

/** 退出登录函数 */
function logOut() {
  setTimeout(() => {
    useUserStore().logOut();
  }, LOGOUT_DELAY);
}

/** 请求函数 */
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
  try {
    const res = await axiosInstance.request<BaseResponse<T>>(config);

    // 显示成功消息
    if (config.showSuccessMessage && res.data.msg) {
      showSuccess(res.data.msg);
    }

    return res.data.data as T;
  } catch (error) {
    if (error instanceof HttpError && error.code !== ApiStatus.tokenExpired) {
      const showMsg = config.showErrorMessage !== false;
      showError(error, showMsg);
    }
    return Promise.reject(error);
  }
}

/** API方法集合 */
const api = {
  get<T>(config: ExtendedAxiosRequestConfig) {
    return request<T>({ ...config, method: 'GET' });
  },
  post<T>(config: ExtendedAxiosRequestConfig) {
    return request<T>({ ...config, method: 'POST' });
  },
  put<T>(config: ExtendedAxiosRequestConfig) {
    return request<T>({ ...config, method: 'PUT' });
  },
  del<T>(config: ExtendedAxiosRequestConfig) {
    return request<T>({ ...config, method: 'DELETE' });
  },
  request<T>(config: ExtendedAxiosRequestConfig) {
    return request<T>(config);
  }
};

export default api;
