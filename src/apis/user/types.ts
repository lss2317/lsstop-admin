/**
 * 用户接口类型定义
 *
 * @module apis/user/types
 */

/** 用户状态：0-禁用 1-启用 */
export type UserStatus = 0 | 1;

/** 角色简要信息（列表嵌入用） */
export interface RoleBrief {
  /** 角色ID */
  id: number;
  /** 角色名称 */
  roleName: string;
}

/** 用户列表项（后端聚合 VO） */
export interface UserListItem {
  /** 用户ID */
  userId: string;
  /** 昵称 */
  nickname: string;
  /** 头像 */
  avatar: string;
  /** 邮箱 */
  email: string | null;
  /** 个人网站 */
  website: string | null;
  /** 个人简介 */
  intro: string | null;
  /** 是否绑定QQ */
  qqBound: boolean;
  /** 是否绑定微博 */
  weiboBound: boolean;
  /** 状态：0-禁用 1-正常 */
  status: UserStatus;
  /** 最近登录时间 */
  lastLoginTime: string | null;
  /** 角色列表 */
  roles: RoleBrief[];
}

/** 用户搜索参数 */
export interface UserSearchParams {
  /** 用户ID */
  userId?: string;
  /** 昵称（模糊搜索） */
  nickname?: string;
  /** 邮箱（模糊搜索） */
  email?: string;
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
  /** 用户ID（编辑时后端从路径获取，新增时后端自动生成） */
  userId?: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 密码（仅新增时使用） */
  password?: string;
  /** 确认密码（仅新增时使用） */
  confirmPassword?: string;
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

// ============================================================
// 用户权限调整相关类型
// ============================================================

/** 菜单权限树节点（与角色模块复用同一结构） */
export interface MenuPermissionNode {
  /** 菜单ID */
  id: number;
  /** 唯一标识 */
  name: string;
  /** 菜单标题 */
  title: string;
  /** 子节点 */
  children?: MenuPermissionNode[];
}

/** 接口权限树节点（与角色模块复用同一结构） */
export interface ApiPermissionNode {
  /** 接口ID */
  id: number;
  /** 接口名称 */
  name: string;
  /** 接口路径 */
  path?: string;
  /** HTTP 方法 */
  method?: string;
  /** 子节点 */
  children?: ApiPermissionNode[];
}

/** 保存用户菜单权限参数 */
export interface SaveUserMenuPermissionParams {
  /** 用户ID */
  userId: string;
  /** 选中的菜单 ID 列表 */
  menuIds: number[];
}

/** 保存用户接口权限参数 */
export interface SaveUserApiPermissionParams {
  /** 用户ID */
  userId: string;
  /** 选中的接口 ID 列表 */
  apiIds: number[];
}
