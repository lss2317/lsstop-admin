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
  BatchDeleteParams
} from './types';

// ==================== 实力 Mock 数据 ====================

/** Mock 角色列表 */
const mockRoleList: RoleFormParams[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'R_SUPER',
    description: '系统超级管理员',
    status: 1
  },
  {
    id: 2,
    name: '管理员',
    code: 'R_ADMIN',
    description: '系统管理员',
    status: 1
  },
  {
    id: 3,
    name: '普通用户',
    code: 'R_USER',
    description: '默认注册用户',
    status: 1
  },
  {
    id: 7,
    name: '演示管理员',
    code: 'R_DEMO_ADMIN',
    description: '演示站管理员，仅用于功能演示',
    status: 1
  }
];

/** 当前自增 ID */
let mockIdCounter = 8;

/**
 * 模拟获取角色列表（分页）
 */
function mockFetchRoleList(params: RoleSearchParams): RoleListResponse {
  const { name, code, status, current = 1, size = 10 } = params;

  // 过滤数据
  let filtered = mockRoleList.filter((item) => {
    if (name && !item.name.includes(name)) return false;
    if (code && !item.code.includes(code)) return false;
    if (status !== undefined && item.status !== status) return false;
    return true;
  });

  // 分页
  const total = filtered.length;
  const start = (current - 1) * size;
  const end = start + size;
  const list = filtered.slice(start, end);

  // 返回带时间戳的数据
  return {
    list: list.map((item) => ({
      id: item.id!,
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status,
      createTime: '2026-04-08 04:13:13',
      updateTime: '2026-05-25 22:56:26'
    })),
    total
  };
}

/**
 * 模拟新增角色
 */
function mockFetchAddRole(data: RoleFormParams): void {
  mockRoleList.push({
    id: mockIdCounter++,
    name: data.name,
    code: data.code,
    description: data.description,
    status: data.status
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
      name: data.name,
      code: data.code,
      description: data.description,
      status: data.status
    };
  }
}

/**
 * 模拟删除角色
 */
function mockFetchDeleteRole(params: BatchDeleteParams): void {
  const idsToDelete = new Set(params.ids);
  const index = mockRoleList.findIndex((item) => idsToDelete.has(item.id!));
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
  // 使用实力 mock 数据
  return Promise.resolve(mockFetchRoleList(params));

  // return request.get<RoleListResponse>({
  //   url: '/role/list',
  //   params
  // });
}

/**
 * 新增角色
 * @param data 角色信息
 */
export function fetchAddRole(data: RoleFormParams) {
  // 使用实力 mock 数据
  mockFetchAddRole(data);
  return Promise.resolve();

  // return request.post<void>({
  //   url: '/role/add',
  //   data
  // });
}

/**
 * 编辑角色
 * @param data 角色信息（包含id）
 */
export function fetchEditRole(data: RoleFormParams) {
  // 使用实力 mock 数据
  mockFetchEditRole(data);
  return Promise.resolve();

  // return request.post<void>({
  //   url: '/role/edit',
  //   data
  // });
}

/**
 * 删除角色（支持单条/批量）
 * @param params 角色ID列表
 */
export function fetchDeleteRole(params: BatchDeleteParams) {
  // 使用实力 mock 数据
  mockFetchDeleteRole(params);
  return Promise.resolve();

  // return request.post<void>({
  //   url: '/role/delete',
  //   data: params
  // });
}
