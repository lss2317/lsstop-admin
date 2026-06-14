/**
 * 用户接口类型定义
 *
 * @module apis/user/types
 */

/** 用户状态值 */
export type UserStatus = '1' | '2' | '3' | '4'; // 1-在线 2-离线 3-异常 4-注销

/** 用户列表项 */
export interface UserListItem {
  /** 用户ID */
  id: number;
  /** 用户名 */
  userName: string;
  /** 邮箱 */
  userEmail: string;
  /** 性别 */
  userGender: string;
  /** 手机号 */
  userPhone: string;
  /** 状态 */
  status: string;
  /** 创建时间 */
  createTime: string;
  /** 头像 */
  avatar: string;
  /** 角色列表 */
  userRoles: string[];
}

/** 用户搜索参数 */
export interface UserSearchParams {
  /** 用户名（模糊搜索） */
  userName?: string;
  /** 手机号 */
  userPhone?: string;
  /** 邮箱 */
  userEmail?: string;
  /** 性别 */
  userGender?: string;
  /** 状态 */
  status?: string;
  /** 当前页 */
  current?: number;
  /** 每页条数 */
  size?: number;
}

/** 用户列表分页响应 */
export interface PaginatedUserResponse {
  /** 记录列表 */
  records: UserListItem[];
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 总条数 */
  total: number;
}

/** 角色列表项（用于新增/编辑弹窗） */
export interface RoleItem {
  /** 角色编码 */
  roleCode: string;
  /** 角色名称 */
  roleName: string;
}
