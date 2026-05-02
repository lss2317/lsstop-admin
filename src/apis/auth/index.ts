import request from '@/utils/http';
import type {
  LoginParams,
  LoginResponse,
  RefreshTokenParams,
  RefreshTokenResponse,
  UserInfo
} from './types';

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(data: LoginParams) {
  return request.post<LoginResponse>({
    url: '/auth/login/email',
    data
  });
}

/**
 * 刷新Token
 * @param params 刷新Token参数
 * @returns 新的访问令牌和刷新令牌
 */
export function fetchRefreshToken(data: RefreshTokenParams) {
  return request.post<RefreshTokenResponse>({
    url: '/auth/refresh',
    data
  });
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  return request.get<UserInfo>({
    url: '/user/info'
  });
}
