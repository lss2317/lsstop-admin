/**
 * 接口权限相关接口
 *
 * @module apis/api-permission
 */
import request from '@/utils/http';
import type {
  ApiPermissionItem,
  ApiPermissionListResponse,
  ApiPermissionSearchParams
} from './types';

/**
 * 获取接口权限列表（树形结构）
 * @param params 搜索参数
 */
export function fetchApiPermissionList(params?: ApiPermissionSearchParams) {
  return request.get<ApiPermissionListResponse>({
    url: '/api-permission/list',
    params
  });
}

/**
 * 新增接口权限
 * @param data 权限信息
 */
export function fetchAddApiPermission(data: Partial<ApiPermissionItem>) {
  return request.post<void>({
    url: '/api-permission/add',
    data
  });
}

/**
 * 更新接口权限
 * @param data 权限信息（包含 id）
 */
export function fetchUpdateApiPermission(data: Partial<ApiPermissionItem>) {
  return request.put<void>({
    url: '/api-permission/update',
    data
  });
}

/**
 * 删除接口权限
 * @param id 权限ID
 */
export function fetchDeleteApiPermission(id: number) {
  return request.del<void>({
    url: `/api-permission/delete/${id}`
  });
}