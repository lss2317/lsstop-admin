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

/** 刷新Token参数 */
export interface RefreshTokenParams {
  /** 刷新令牌 */
  refreshToken: string;
}

/** 刷新Token响应 */
export interface RefreshTokenResponse {
  /** 访问令牌，用于接口鉴权 */
  accessToken: string;
  /** 刷新令牌，用于获取新的访问令牌 */
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
}
