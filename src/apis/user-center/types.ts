/**
 * 个人中心接口类型定义
 *
 * @module apis/user-center/types
 */

import type { RoleBrief } from '@/apis/user';

/** 当前用户详情（个人中心用） */
export interface UserProfileInfo {
  /** 用户ID */
  userId: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 头像URL */
  avatar: string;
  /** 个人网站 */
  website: string | null;
  /** 个人简介 */
  intro: string | null;
  /** 最近登录时间 */
  lastLoginTime: string | null;
  /** 创建时间 */
  createTime: string;
  /** 是否绑定QQ */
  qqBound: boolean;
  /** 是否绑定微博 */
  weiboBound: boolean;
  /** 角色列表 */
  roles: RoleBrief[];
}

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
  /** 邮箱 */
  email: string;
  /** 头像URL */
  avatar: string;
  /** 个人网站 */
  website?: string;
  /** 个人简介 */
  intro?: string;
}
