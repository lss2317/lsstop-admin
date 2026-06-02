/**
 * 角色相关接口
 *
 * @module apis/role
 */
import request from '@/utils/http';
import type { RoleSearchParams, RoleListResponse, RoleFormParams } from './types';

// ==================== 实力 Mock 数据 ====================

/** Mock 角色列表 */
const mockRoleList: RoleFormParams[] = [
  {
    id: 1,
    roleName: '超级管理员',
    roleCode: 'R_SUPER',
    description: '系统超级管理员',
    isEnabled: 1
  },
  {
    id: 2,
    roleName: '管理员',
    roleCode: 'R_ADMIN',
    description: '系统管理员',
    isEnabled: 1
  },
  {
    id: 3,
    roleName: '普通用户',
    roleCode: 'R_USER',
    description: '默认注册用户',
    isEnabled: 1
  },
  {
    id: 7,
    roleName: '演示管理员',
    roleCode: 'R_DEMO_ADMIN',
    description: '演示站管理员，仅用于功能演示',
    isEnabled: 1
  }
];

/** 当前自增 ID */
let mockIdCounter = 8;

/**
 * 模拟获取角色列表（分页）
 */
function mockFetchRoleList(params: RoleSearchParams): RoleListResponse {
  const { roleName, roleCode, isEnabled, current = 1, size = 10 } = params;

  // 过滤数据
  let filtered = mockRoleList.filter((item) => {
    if (roleName && !item.roleName.includes(roleName)) return false;
    if (roleCode && !item.roleCode.includes(roleCode)) return false;
    if (isEnabled !== undefined && item.isEnabled !== isEnabled) return false;
    return true;
  });

  // 分页
  const total = filtered.length;
  const start = (current - 1) * size;
  const end = start + size;
  const list = filtered.slice(start, end);

  // 返回带时间戳的数据
  return {
    records: list.map((item) => ({
      id: item.id!,
      roleName: item.roleName,
      roleCode: item.roleCode,
      description: item.description,
      isEnabled: item.isEnabled,
      createTime: '2026-04-08 04:13:13'
    })),
    current,
    size,
    total
  };
}

/**
 * 模拟新增角色
 */
function mockFetchAddRole(data: RoleFormParams): void {
  mockRoleList.push({
    id: mockIdCounter++,
    roleName: data.roleName,
    roleCode: data.roleCode,
    description: data.description,
    isEnabled: data.isEnabled
  });
}

/**
 * 模拟编辑角色
 */
function mockFetchEditRole(data: RoleFormParams): void {
  const index = mockRoleList.findIndex((item) => item.id === data.id);
  if (index !== -1) {
    mockRoleList[index] = {
      id: data.id!,
      roleName: data.roleName,
      roleCode: data.roleCode,
      description: data.description,
      isEnabled: data.isEnabled
    };
  }
}

/**
 * 模拟删除角色
 */
function mockFetchDeleteRole(id: number): void {
  const index = mockRoleList.findIndex((item) => item.id === id);
  if (index !== -1) {
    mockRoleList.splice(index, 1);
  }
}

// ==================== 真实 API 接口（暂时注释，后端准备好后取消注释） ====================

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
