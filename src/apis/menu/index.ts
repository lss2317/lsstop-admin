/**
 * 菜单相关接口
 *
 * @module apis/menu
 */
import request from '@/utils/http';
import type { BackendMenuItem } from './types';

/**
 * 获取当前用户的菜单列表（树形结构）
 * 后端根据用户角色返回有权限的菜单
 */
export function fetchMenuList() {
  return request.get<BackendMenuItem[]>({
    url: '/menu/list'
  });
}
