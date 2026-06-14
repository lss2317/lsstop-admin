/**
 * 用户接口类型定义
 *
 * 对应数据库表：blog_user / blog_user_auth / blog_user_profile / blog_user_role
 *
 * @module apis/user/types
 */

/** 用户状态：0-禁用 1-启用（对应 blog_user.status） */
export type UserStatus = 0 | 1;

/** 登录方式：1-邮箱 2-QQ 3-微博（对应 blog_user_auth.login_type） */
export type LoginType = 1 | 2 | 3;

/** 认证方式项 */
export interface AuthMethodItem {
  /** 登录方式 */
  loginType: LoginType;
  /** 登录标识（邮箱 / QQ openId / 微博 uid） */
  identifier: string;
}

/** 用户列表项（后端聚合 VO） */
export interface UserListItem {
  /** 用户UID（对应 blog_user.user_uid） */
  userUid: string;
  /** 昵称（对应 blog_user_profile.nickname） */
  nickname: string;
  /** 头像（对应 blog_user_profile.avatar） */
  avatar: string;
  /** 主要邮箱（blog_user_auth 中 login_type=1 的 identifier） */
  email: string | null;
  /** 状态：0-禁用 1-启用 */
  status: UserStatus;
  /** 最近登录时间 */
  lastLoginTime: string | null;
  /** 角色名称列表 */
  roles: string[];
  /** 创建时间 */
  createTime: string;
}

/** 用户详情（编辑弹窗用） */
export interface UserDetail {
  /** 用户UID */
  userUid: string;
  /** 昵称 */
  nickname: string;
  /** 头像 */
  avatar: string;
  /** 个人网站 */
  website: string | null;
  /** 个人简介 */
  intro: string | null;
  /** 状态 */
  status: UserStatus;
  /** 最近登录时间 */
  lastLoginTime: string | null;
  /** 认证方式列表 */
  authMethods: AuthMethodItem[];
  /** 角色ID列表 */
  roleIds: number[];
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/** 用户搜索参数 */
export interface UserSearchParams {
  /** 用户UID（精确搜索） */
  userUid?: string;
  /** 昵称（模糊搜索） */
  nickname?: string;
  /** 状态 */
  status?: UserStatus;
  /** 当前页 */
  current: number;
  /** 每页条数 */
  size: number;
}

/** 用户列表分页响应 */
export interface UserListResponse {
  /** 记录列表 */
  records: UserListItem[];
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 总条数 */
  total: number;
}

/** 新增/编辑用户表单参数 */
export interface UserFormParams {
  /** 用户UID */
  userUid: string;
  /** 昵称 */
  nickname: string;
  /** 头像 */
  avatar: string;
  /** 个人网站 */
  website?: string;
  /** 个人简介 */
  intro?: string;
  /** 状态 */
  status: UserStatus;
  /** 角色ID列表 */
  roleIds: number[];
}

/** 角色选项（弹窗下拉用） */
export interface RoleOption {
  /** 角色ID */
  id: number;
  /** 角色名称 */
  roleName: string;
}
