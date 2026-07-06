/**
 * 个人中心接口类型定义
 *
 * @module apis/user-center/types
 */

/** 修改密码参数（个人中心用，需旧密码验证） */
export interface ChangePasswordParams {
  /** 旧密码 */
  oldPassword: string;
  /** 新密码 */
  newPassword: string;
}

/** 更新个人资料参数 */
export interface UpdateProfileParams {
  /** 昵称 */
  nickname: string;
  /** 个人网站 */
  website?: string;
  /** 个人简介 */
  intro?: string;
}

/** 发送验证码参数 */
export interface SendChangeEmailCodeParams {
  /** 邮箱地址 */
  email: string;
  /** 1-登录 2-注册 3-找回密码 4-修改邮箱 */
  purpose: number;
}

/** 修改邮箱参数 */
export interface ChangeEmailParams {
  /** 新邮箱 */
  newEmail: string;
  /** 验证码 */
  code: string;
}
