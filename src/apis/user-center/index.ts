/**
 * 个人中心相关接口
 *
 * @module apis/user-center
 */
import request from '@/utils/http';
import type { ChangePasswordParams, UpdateProfileParams } from './types';

export type { ChangePasswordParams, UpdateProfileParams } from './types';

/**
 * 更新个人资料
 * @param data 个人资料参数
 */
export function fetchUpdateProfile(data: UpdateProfileParams) {
  return request.put<void>({
    url: '/user/profile',
    data
  });
}

/**
 * 修改密码（需旧密码验证）
 * @param data 修改密码参数
 */
export function fetchChangePassword(data: ChangePasswordParams) {
  return request.put<void>({
    url: '/user/change-password',
    data
  });
}
