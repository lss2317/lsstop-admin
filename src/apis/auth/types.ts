import type { RoleBrief } from '@/apis/user';

/** 登录参数 */
export interface LoginParams {
  /** 邮箱 */
  email: string;
  /** 密码 */
  password: string;
}

/** 登录响应 */
export interface LoginResponse {
  /** 用户id */
  userId: string | null;
  /** 昵称 */
  nickname: string | null;
  /** 头像 */
  avatar: string | null;
  /** 个人网站 */
  website: string | null;
  /** 个人简介 */
  intro: string | null;
  /** accessToken */
  accessToken: string;
  /** refreshToken */
  refreshToken: string;
}

/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  userId: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 头像URL */
  avatar: string;
  /** 个人简介 */
  intro: string;
  /** 个人网站 */
  website: string;
  /** 创建时间 */
  createTime: string;
  /** 是否绑定QQ */
  qqBound: boolean;
  /** 是否绑定微博 */
  weiboBound: boolean;
  /** 角色列表 */
  roles: RoleBrief[];
}
