import request from '@/utils/http';
import type { LoginParams, LoginResponse, UserInfo } from './types';

/**
 * 登录
 * @returns 登录响应
 * @param data
 */
export function fetchLogin(data: LoginParams) {
  return request.post<LoginResponse>({
    url: '/auth/login/email',
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

/**
 * 退出登录
 * @param refreshToken 刷新令牌
 */
export function fetchLogout(refreshToken: string) {
  return request.post({
    url: '/auth/logout',
    data: { refreshToken }
  });
}
