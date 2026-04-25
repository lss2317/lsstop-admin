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
  accessToken?: string;
  /** refreshToken */
  refreshToken?: string;
}

/** 用户信息 */
export interface UserInfo {
  buttons: string[];
  roles: string[];
  userId: number;
  userName: string;
  email: string;
  avatar?: string;
}
