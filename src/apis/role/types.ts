/**
 * 角色接口类型定义
 *
 * @module apis/role/types
 */

/** 角色状态 */
export type RoleStatus = 0 | 1; // 0-禁用 1-启用

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
  /** 记录列表 */
  records: RoleItem[];
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 总条数 */
  total: number;
}

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

/** 菜单权限树节点（精简版，仅用于权限配置弹窗） */
export interface MenuPermissionNode {
  /** 菜单ID */
  id: number;
  /** 唯一标识，作为 tree node-key */
  name: string;
  /** 菜单标题 */
  title: string;
  /** 子节点 */
  children?: MenuPermissionNode[];
}

/** 保存菜单权限参数 */
export interface SaveMenuPermissionParams {
  /** 角色ID */
  roleId: number;
  /** 选中的菜单 ID 列表（全选 + 半选合并） */
  menuIds: number[];
}

/** 接口权限树节点（用于接口权限配置弹窗） */
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

/** 保存接口权限参数 */
export interface SaveApiPermissionParams {
  /** 角色ID */
  roleId: number;
  /** 选中的接口 ID 列表（全选 + 半选合并） */
  apiIds: number[];
}
