import request from '@/utils/http';
import type { LoginParams, LoginResponse, UserInfo } from './types';

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: LoginParams) {
  return request.post<LoginResponse>({
    url: '/auth/login/email',
    params
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
