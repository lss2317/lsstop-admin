/**
 * 个人中心相关接口
 *
 * @module apis/user-center
 */
import request from '@/utils/http';
import type {
  ChangePasswordParams,
  UpdateProfileParams,
  SendChangeEmailCodeParams,
  ChangeEmailParams
} from './types';

export type {
  ChangePasswordParams,
  UpdateProfileParams,
  SendChangeEmailCodeParams,
  ChangeEmailParams
} from './types';

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

/**
 * 发送验证码
 * @param data 验证码参数
 */
export function fetchSendChangeEmailCode(data: SendChangeEmailCodeParams) {
  return request.post<void>({
    url: '/auth/code',
    data
  });
}

/**
 * 修改邮箱
 * @param data 修改邮箱参数
 */
export function fetchChangeEmail(data: ChangeEmailParams) {
  return request.put<void>({
    url: '/user/email',
    data
  });
}
