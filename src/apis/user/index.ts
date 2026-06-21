/**
 * 用户相关接口
 *
 * @module apis/user
 */
import request from '@/utils/http';
import type {
  UserSearchParams,
  UserListResponse,
  UserFormParams,
  RoleOption,
  SaveUserMenuPermissionParams,
  SaveUserApiPermissionParams,
  ResetPasswordParams
} from './types';

export type {
  UserListItem,
  UserSearchParams,
  UserListResponse,
  UserFormParams,
  RoleOption,
  RoleBrief,
  UserStatus
} from './types';

/**
 * 获取用户列表（分页）
 * @param params 搜索与分页参数
 */
export function fetchUserList(params: UserSearchParams) {
  return request.get<UserListResponse>({
    url: '/user/list',
    params
  });
}

/**
 * 获取所有角色（弹窗下拉用）
 */
export function fetchRoleOptions() {
  return request.get<RoleOption[]>({
    url: '/role/options'
  });
}

/**
 * 新增用户
 * @param data 用户信息
 */
export function fetchAddUser(data: UserFormParams) {
  return request.post<void>({
    url: '/user/add',
    data
  });
}

/**
 * 更新用户
 * @param data 用户信息（包含 userId）
 */
export function fetchUpdateUser(data: UserFormParams) {
  return request.put<void>({
    url: '/user/update',
    data
  });
}

/**
 * 删除用户（软删除）
 * @param userId 用户ID
 */
export function fetchDeleteUser(userId: string) {
  return request.del<void>({
    url: `/user/delete/${userId}`
  });
}

/**
 * 获取用户有效菜单权限 ID 列表
 * @param userId 用户ID
 */
export function fetchUserMenuPermission(userId: string) {
  return request.get<number[]>({
    url: '/user/menu-permission',
    params: { userId }
  });
}

/**
 * 保存用户菜单权限
 * @param data 菜单权限保存参数
 */
export function fetchSaveUserMenuPermission(data: SaveUserMenuPermissionParams) {
  return request.put<void>({
    url: '/user/menu-permission',
    data
  });
}

/**
 * 获取用户有效接口权限 ID 列表
 * @param userId 用户ID
 */
export function fetchUserApiPermission(userId: string) {
  return request.get<number[]>({
    url: '/user/api-permission',
    params: { userId }
  });
}

/**
 * 保存用户接口权限
 * @param data 接口权限保存参数
 */
export function fetchSaveUserApiPermission(data: SaveUserApiPermissionParams) {
  return request.put<void>({
    url: '/user/api-permission',
    data
  });
}

/**
 * 上传用户头像
 * @param file 裁剪后的图片文件
 * @returns 新头像URL
 */
export function fetchUploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<string>({
    url: '/file/avatar',
    data: formData,
    showSuccessMessage: false
  });
}

/**
 * 重置用户密码
 * @param data 重置密码参数
 */
export function fetchResetPassword(data: ResetPasswordParams) {
  return request.put<void>({
    url: '/user/reset-password',
    data
  });
}
