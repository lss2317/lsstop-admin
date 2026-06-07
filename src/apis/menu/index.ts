/**
 * 菜单相关接口
 *
 * @module apis/menu
 */
import request from '@/utils/http';
import type {
  BackendMenuItem,
  MenuListResponse,
  MenuSearchParams,
  MenuBatchDeleteParams
} from './types';

/**
 * 获取当前用户的菜单列表（树形结构）
 * 后端根据用户角色返回有权限的菜单
 */
export function fetchMenuList() {
  return request.get<BackendMenuItem[]>({
    url: '/menu/user'
  });
}

/**
 * 获取菜单管理列表（树形结构）
 * @param params 搜索参数
 */
export function fetchMenuAdminList(params?: MenuSearchParams) {
  return request.get<MenuListResponse>({
    url: '/menu/list',
    params
  });
}

/**
 * 新增菜单
 * @param data 菜单信息
 */
export function fetchAddMenu(data: Partial<BackendMenuItem>) {
  return request.post<void>({
    url: '/menu/add',
    data
  });
}

/**
 * 更新菜单
 * @param data 菜单信息（包含 id）
 */
export function fetchUpdateMenu(data: Partial<BackendMenuItem>) {
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

/**
 * 批量删除菜单
 * @param params 菜单ID列表
 */
export function fetchBatchDeleteMenu(params: MenuBatchDeleteParams) {
  return request.post<void>({
    url: '/menu/delete',
    data: params
  });
}
