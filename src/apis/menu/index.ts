/**
 * 菜单相关接口
 *
 * @module apis/menu
 */
import request from '@/utils/http';
import type { BackendMenuItem, MenuItem, MenuSearchParams } from './types';

/**
 * 获取当前用户的菜单列表（树形结构）
 * 后端根据用户角色返回有权限的菜单
 */
export function fetchMenuList() {
  return request.get<BackendMenuItem[]>({
    url: '/menu/user'
  });
}

// ==================== 菜单管理 ====================

/**
 * 获取菜单管理列表（分页）
 * @param params 搜索与分页参数
 */
export function fetchMenuAdminList(params: MenuSearchParams) {
  return request.get<Api.Common.PaginatedResponse<MenuItem>>({
    url: '/menu/list',
    params
  });
}

/**
 * 新增菜单
 * @param data 菜单信息
 */
export function fetchAddMenu(data: Partial<MenuItem>) {
  return request.post<void>({
    url: '/menu/add',
    data
  });
}

/**
 * 更新菜单
 * @param data 菜单信息（包含 id）
 */
export function fetchUpdateMenu(data: Partial<MenuItem>) {
  return request.put<void>({
    url: '/menu/update',
    data
  });
}

/**
 * 删除菜单
 * @param id 菜单ID
 */
export function fetchDeleteMenu(id: number) {
  return request.del<void>({
    url: `/menu/delete/${id}`
  });
}
