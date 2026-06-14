/**
 * 用户相关接口
 *
 * @module apis/user
 */
import request from '@/utils/http';
import avatarImg from '@/assets/images/avatar/avatar.webp';
import type {
  UserSearchParams,
  UserListResponse,
  UserListItem,
  UserDetail,
  UserFormParams,
  RoleOption
} from './types';

export type {
  UserListItem,
  UserSearchParams,
  UserListResponse,
  UserDetail,
  UserFormParams,
  AuthMethodItem,
  RoleOption,
  UserStatus,
  LoginType
} from './types';

// ============================================================
// 真实 API
// ============================================================

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
 * 获取用户详情
 * @param userUid 用户UID
 */
export function fetchUserDetail(userUid: string) {
  return request.get<UserDetail>({
    url: `/user/detail/${userUid}`
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
 * @param data 用户信息（包含 userUid）
 */
export function fetchUpdateUser(data: UserFormParams) {
  return request.put<void>({
    url: '/user/update',
    data
  });
}

/**
 * 删除用户（软删除）
 * @param userUid 用户UID
 */
export function fetchDeleteUser(userUid: string) {
  return request.del<void>({
    url: `/user/delete/${userUid}`
  });
}

/**
 * 获取所有角色（弹窗下拉用）
 */
export function fetchAllRoles() {
  return request.get<RoleOption[]>({
    url: '/role/all'
  });
}

// ============================================================
// Mock 数据（开发阶段使用）
// ============================================================

/** 模拟头像 */
const AVATAR = avatarImg;

/** 模拟用户数据 */
const MOCK_USER_LIST: UserListItem[] = [
  {
    userUid: 'a1b2c3d4e5f6g7h8',
    nickname: '张三',
    avatar: AVATAR,
    email: 'zhangsan@example.com',
    status: 1,
    lastLoginTime: '2025-06-14 10:30:00',
    roles: ['管理员', '编辑者', '运营人员'],
    createTime: '2025-01-15 08:00:00'
  },
  {
    userUid: 'i9j0k1l2m3n4o5p6',
    nickname: '李四',
    avatar: AVATAR,
    email: 'lisi@example.com',
    status: 1,
    lastLoginTime: '2025-06-13 14:20:00',
    roles: ['编辑者'],
    createTime: '2025-02-20 09:30:00'
  },
  {
    userUid: 'q7r8s9t0u1v2w3x4',
    nickname: '王五',
    avatar: AVATAR,
    email: null,
    status: 0,
    lastLoginTime: '2025-05-01 16:45:00',
    roles: ['观察者'],
    createTime: '2025-03-10 11:00:00'
  },
  {
    userUid: 'y5z6a7b8c9d0e1f2',
    nickname: '赵六',
    avatar: AVATAR,
    email: 'zhaoliu@example.com',
    status: 1,
    lastLoginTime: '2025-06-14 08:15:00',
    roles: ['运营人员'],
    createTime: '2025-04-05 13:20:00'
  },
  {
    userUid: 'g3h4i5j6k7l8m9n0',
    nickname: '孙七',
    avatar: AVATAR,
    email: 'sunqi@example.com',
    status: 1,
    lastLoginTime: null,
    roles: ['观察者', '运营人员'],
    createTime: '2025-05-18 10:00:00'
  },
  {
    userUid: 'o1p2q3r4s5t6u7v8',
    nickname: '周八',
    avatar: AVATAR,
    email: null,
    status: 0,
    lastLoginTime: '2025-06-01 09:00:00',
    roles: [],
    createTime: '2025-06-01 09:00:00'
  }
];

/** 模拟角色列表 */
export const MOCK_ROLE_LIST: RoleOption[] = [
  { id: 1, roleName: '管理员' },
  { id: 2, roleName: '编辑者' },
  { id: 3, roleName: '观察者' },
  { id: 4, roleName: '运营人员' }
];

/** 模拟用户详情 */
const MOCK_USER_DETAILS: Record<string, UserDetail> = {
  a1b2c3d4e5f6g7h8: {
    userUid: 'a1b2c3d4e5f6g7h8',
    nickname: '张三',
    avatar: AVATAR,
    website: 'https://zhangsan.dev',
    intro: '全栈开发者，热爱开源',
    status: 1,
    lastLoginTime: '2025-06-14 10:30:00',
    authMethods: [
      { loginType: 1, identifier: 'zhangsan@example.com' },
      { loginType: 2, identifier: 'QQ_123456' }
    ],
    roleIds: [1, 2],
    createTime: '2025-01-15 08:00:00',
    updateTime: '2025-06-14 10:30:00'
  },
  i9j0k1l2m3n4o5p6: {
    userUid: 'i9j0k1l2m3n4o5p6',
    nickname: '李四',
    avatar: AVATAR,
    website: null,
    intro: '前端工程师',
    status: 1,
    lastLoginTime: '2025-06-13 14:20:00',
    authMethods: [{ loginType: 1, identifier: 'lisi@example.com' }],
    roleIds: [2],
    createTime: '2025-02-20 09:30:00',
    updateTime: '2025-06-13 14:20:00'
  },
  q7r8s9t0u1v2w3x4: {
    userUid: 'q7r8s9t0u1v2w3x4',
    nickname: '王五',
    avatar: AVATAR,
    website: null,
    intro: null,
    status: 0,
    lastLoginTime: '2025-05-01 16:45:00',
    authMethods: [{ loginType: 3, identifier: 'weibo_uid_789' }],
    roleIds: [3],
    createTime: '2025-03-10 11:00:00',
    updateTime: '2025-06-10 08:00:00'
  },
  y5z6a7b8c9d0e1f2: {
    userUid: 'y5z6a7b8c9d0e1f2',
    nickname: '赵六',
    avatar: AVATAR,
    website: 'https://zhaoliu.cc',
    intro: '运营推广',
    status: 1,
    lastLoginTime: '2025-06-14 08:15:00',
    authMethods: [{ loginType: 1, identifier: 'zhaoliu@example.com' }],
    roleIds: [4],
    createTime: '2025-04-05 13:20:00',
    updateTime: '2025-06-14 08:15:00'
  },
  g3h4i5j6k7l8m9n0: {
    userUid: 'g3h4i5j6k7l8m9n0',
    nickname: '孙七',
    avatar: AVATAR,
    website: null,
    intro: null,
    status: 1,
    lastLoginTime: null,
    authMethods: [{ loginType: 2, identifier: 'QQ_987654' }],
    roleIds: [3, 4],
    createTime: '2025-05-18 10:00:00',
    updateTime: '2025-05-18 10:00:00'
  },
  o1p2q3r4s5t6u7v8: {
    userUid: 'o1p2q3r4s5t6u7v8',
    nickname: '周八',
    avatar: AVATAR,
    website: null,
    intro: null,
    status: 0,
    lastLoginTime: '2025-06-01 09:00:00',
    authMethods: [],
    roleIds: [],
    createTime: '2025-06-01 09:00:00',
    updateTime: '2025-06-01 09:00:00'
  }
};

/**
 * 模拟获取用户列表
 */
export function mockFetchUserList(params: UserSearchParams = { current: 1, size: 20 }): Promise<UserListResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...MOCK_USER_LIST];

      if (params.userUid) {
        filtered = filtered.filter((u) => u.userUid === params.userUid);
      }
      if (params.nickname) {
        filtered = filtered.filter((u) => u.nickname.includes(params.nickname!));
      }
      if (params.status !== undefined) {
        filtered = filtered.filter((u) => u.status === params.status);
      }

      const current = params.current || 1;
      const size = params.size || 20;
      const total = filtered.length;
      const start = (current - 1) * size;
      const records = filtered.slice(start, start + size);

      resolve({ records, current, size, total });
    }, 500);
  });
}

/**
 * 模拟获取用户详情
 */
export function mockFetchUserDetail(userUid: string): Promise<UserDetail> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const detail = MOCK_USER_DETAILS[userUid];
      if (detail) {
        resolve({ ...detail });
      } else {
        reject(new Error('用户不存在'));
      }
    }, 300);
  });
}
