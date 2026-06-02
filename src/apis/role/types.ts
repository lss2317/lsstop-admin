/**
 * 角色接口类型定义
 *
 * @module apis/role/types
 */

/** 角色状态 */
export type RoleStatus = 0 | 1; // 0-禁用 1-启用

/** 角色列表项（对应 blog_role 表） */
export interface RoleItem {
  /** 角色ID */
  id: number;
  /** 角色名称 */
  roleName: string;
  /** 角色编码 */
  roleCode: string;
  /** 角色描述 */
  description: string;
  /** 是否启用：0-禁用 1-启用 */
  isEnabled: RoleStatus;
  /** 创建时间 */
  createTime: string;
}

/** 角色列表搜索参数 */
export interface RoleSearchParams {
  /** 角色名称（模糊搜索） */
  roleName?: string;
  /** 角色编码 */
  roleCode?: string;
  /** 是否启用 */
  isEnabled?: RoleStatus;
  /** 当前页 */
  current: number;
  /** 每页条数 */
  size: number;
}

/** 角色列表响应 */
export interface RoleListResponse {
  /** 角色列表 */
  list: RoleItem[];
  /** 总条数 */
  total: number;
}

/** 新增/编辑角色参数 */
export interface RoleFormParams {
  /** 角色ID（编辑时传入） */
  id?: number;
  /** 角色名称 */
  roleName: string;
  /** 角色编码 */
  roleCode: string;
  /** 角色描述 */
  description: string;
  /** 是否启用 */
  isEnabled: RoleStatus;
}

/** 批量删除参数 */
export interface BatchDeleteParams {
  /** 角色ID列表 */
  ids: number[];
}
