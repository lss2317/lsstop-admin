/**
 * 角色相关接口
 *
 * @module apis/role
 */
import request from '@/utils/http';
import type {
  RoleSearchParams,
  RoleListResponse,
  RoleFormParams,
  MenuPermissionNode,
  SaveMenuPermissionParams,
  ApiPermissionNode,
  SaveApiPermissionParams
} from './types';

/**
 * 获取角色列表（分页）
 * @param params 搜索与分页参数
 */
export function fetchRoleList(params: RoleSearchParams) {
  return request.get<RoleListResponse>({
    url: '/role/list',
    params
  });
}

/**
 * 新增角色
 * @param data 角色信息
 */
export function fetchAddRole(data: RoleFormParams) {
  return request.post<void>({
    url: '/role/add',
    data
  });
}

/**
 * 更新角色
 * @param data 角色信息（包含id）
 */
export function fetchUpdateRole(data: RoleFormParams) {
  return request.put<void>({
    url: '/role/update',
    data
  });
}

/**
 * 删除角色
 * @param id 角色ID
 */
export function fetchDeleteRole(id: number) {
  return request.del<void>({
    url: `/role/delete/${id}`
  });
}

/**
 * 获取全量菜单树（用于权限配置弹窗）
 * 返回所有菜单及按钮权限节点，不受角色限制
 */
export function fetchMenuPermissionTree() {
  return request.get<MenuPermissionNode[]>({
    url: '/role/menu-permission/tree'
  });
}

/**
 * 获取角色已有的菜单权限 ID 列表（弹窗打开时调用）
 * @param roleId 角色ID
 */
export function fetchRoleMenuPermission(roleId: number) {
  return request.get<number[]>({
    url: '/role/menu-permission',
    params: { roleId }
  });
}

/**
 * 保存角色的菜单权限
 * @param data 菜单权限保存参数
 */
export function fetchSaveMenuPermission(data: SaveMenuPermissionParams) {
  return request.put<void>({
    url: '/role/menu-permission',
    data
  });
}

/**
 * 获取全量接口权限树（用于接口权限配置弹窗）
 * 返回所有接口权限节点，不受角色限制
 */
export function fetchApiPermissionTree() {
  return request.get<ApiPermissionNode[]>({
    url: '/role/api-permission/tree'
  });
}

/**
 * 获取角色已有的接口权限 ID 列表（弹窗打开时调用）
 * @param roleId 角色ID
 */
export function fetchRoleApiPermission(roleId: number) {
  return request.get<number[]>({
    url: '/role/api-permission',
    params: { roleId }
  });
}

/**
 * 保存角色的接口权限
 * @param data 接口权限保存参数
 */
export function fetchSaveApiPermission(data: SaveApiPermissionParams) {
  return request.put<void>({
    url: '/role/api-permission',
    data
  });
}
