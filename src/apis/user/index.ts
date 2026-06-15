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
  RoleOption,
  MenuPermissionNode,
  ApiPermissionNode,
  SaveUserMenuPermissionParams,
  SaveUserApiPermissionParams
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
  LoginType,
  MenuPermissionNode,
  ApiPermissionNode
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

/**
 * 获取全量菜单权限树（用于权限配置弹窗）
 */
export function fetchMenuPermissionTree() {
  return request.get<MenuPermissionNode[]>({
    url: '/role/menu-permission/tree'
  });
}

/**
 * 获取用户有效菜单权限 ID 列表
 * @param userUid 用户UID
 */
export function fetchUserMenuPermission(userUid: string) {
  return request.get<number[]>({
    url: '/user/menu-permission',
    params: { userUid }
  });
}

/**
 * 保存用户菜单权限
 * @param data 权限保存参数
 */
export function fetchSaveUserMenuPermission(data: SaveUserMenuPermissionParams) {
  return request.put<void>({
    url: '/user/menu-permission',
    data
  });
}

/**
 * 获取全量接口权限树（用于权限配置弹窗）
 */
export function fetchApiPermissionTree() {
  return request.get<ApiPermissionNode[]>({
    url: '/role/api-permission/tree'
  });
}

/**
 * 获取用户有效接口权限 ID 列表
 * @param userUid 用户UID
 */
export function fetchUserApiPermission(userUid: string) {
  return request.get<number[]>({
    url: '/user/api-permission',
    params: { userUid }
  });
}

/**
 * 保存用户接口权限
 * @param data 权限保存参数
 */
export function fetchSaveUserApiPermission(data: SaveUserApiPermissionParams) {
  return request.put<void>({
    url: '/user/api-permission',
    data
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
  { id: 4, roleName: '运营人员' },
  { id: 5, roleName: '审核员' },
  { id: 6, roleName: '财务' },
  { id: 7, roleName: '客服' },
  { id: 8, roleName: '数据分析师' },
  { id: 9, roleName: '技术支持' },
  { id: 10, roleName: '访客' }
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
export function mockFetchUserList(
  params: UserSearchParams = { current: 1, size: 20 }
): Promise<UserListResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...MOCK_USER_LIST];

      if (params.userUid) {
        filtered = filtered.filter((u) => u.userUid === params.userUid);
      }
      if (params.nickname) {
        filtered = filtered.filter((u) => u.nickname.includes(params.nickname!));
      }
      if (params.email) {
        filtered = filtered.filter((u) => (u.email || '').includes(params.email!));
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

/** 模拟全量菜单权限树 */
const MOCK_MENU_PERMISSION_TREE: MenuPermissionNode[] = [
  {
    id: 1,
    name: 'dashboard',
    title: '控制台',
    children: [
      { id: 101, name: 'dashboard-index', title: '首页' },
      { id: 102, name: 'dashboard-analytics', title: '分析页' }
    ]
  },
  {
    id: 2,
    name: 'content',
    title: '内容管理',
    children: [
      {
        id: 201,
        name: 'article',
        title: '文章管理',
        children: [
          { id: 2011, name: 'article-list', title: '文章列表' },
          { id: 2012, name: 'article-add', title: '新增文章' },
          { id: 2013, name: 'article-edit', title: '编辑文章' },
          { id: 2014, name: 'article-delete', title: '删除文章' }
        ]
      },
      {
        id: 202,
        name: 'talk',
        title: '说说管理',
        children: [
          { id: 2021, name: 'talk-list', title: '说说列表' },
          { id: 2022, name: 'talk-add', title: '新增说说' },
          { id: 2023, name: 'talk-delete', title: '删除说说' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'system',
    title: '系统管理',
    children: [
      {
        id: 301,
        name: 'user',
        title: '用户管理',
        children: [
          { id: 3011, name: 'user-list', title: '用户列表' },
          { id: 3012, name: 'user-add', title: '新增用户' },
          { id: 3013, name: 'user-edit', title: '编辑用户' },
          { id: 3014, name: 'user-delete', title: '删除用户' }
        ]
      },
      {
        id: 302,
        name: 'role',
        title: '角色管理',
        children: [
          { id: 3021, name: 'role-list', title: '角色列表' },
          { id: 3022, name: 'role-add', title: '新增角色' },
          { id: 3023, name: 'role-edit', title: '编辑角色' },
          { id: 3024, name: 'role-delete', title: '删除角色' }
        ]
      },
      {
        id: 303,
        name: 'menu',
        title: '菜单管理',
        children: [
          { id: 3031, name: 'menu-list', title: '菜单列表' },
          { id: 3032, name: 'menu-add', title: '新增菜单' },
          { id: 3033, name: 'menu-edit', title: '编辑菜单' },
          { id: 3034, name: 'menu-delete', title: '删除菜单' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'log',
    title: '日志审计',
    children: [
      {
        id: 401,
        name: 'login-log',
        title: '登录日志',
        children: [
          { id: 4011, name: 'login-log-list', title: '日志列表' },
          { id: 4012, name: 'login-log-export', title: '导出日志' }
        ]
      },
      {
        id: 402,
        name: 'operation-log',
        title: '操作日志',
        children: [
          { id: 4021, name: 'operation-log-list', title: '日志列表' },
          { id: 4022, name: 'operation-log-export', title: '导出日志' }
        ]
      }
    ]
  }
];

/** 模拟全量接口权限树 */
const MOCK_API_PERMISSION_TREE: ApiPermissionNode[] = [
  {
    id: 1,
    name: '用户管理',
    children: [
      { id: 101, name: '获取用户列表', method: 'GET', path: '/user/list' },
      { id: 102, name: '获取用户详情', method: 'GET', path: '/user/detail/:id' },
      { id: 103, name: '新增用户', method: 'POST', path: '/user/add' },
      { id: 104, name: '编辑用户', method: 'PUT', path: '/user/update' },
      { id: 105, name: '删除用户', method: 'DELETE', path: '/user/delete/:id' }
    ]
  },
  {
    id: 2,
    name: '角色管理',
    children: [
      { id: 201, name: '获取角色列表', method: 'GET', path: '/role/list' },
      { id: 202, name: '新增角色', method: 'POST', path: '/role/add' },
      { id: 203, name: '编辑角色', method: 'PUT', path: '/role/update' },
      { id: 204, name: '删除角色', method: 'DELETE', path: '/role/delete/:id' }
    ]
  },
  {
    id: 3,
    name: '菜单管理',
    children: [
      { id: 301, name: '获取菜单树', method: 'GET', path: '/menu/tree' },
      { id: 302, name: '新增菜单', method: 'POST', path: '/menu/add' },
      { id: 303, name: '编辑菜单', method: 'PUT', path: '/menu/update' },
      { id: 304, name: '删除菜单', method: 'DELETE', path: '/menu/delete/:id' }
    ]
  },
  {
    id: 4,
    name: '日志管理',
    children: [
      { id: 401, name: '获取登录日志', method: 'GET', path: '/login-log/list' },
      { id: 402, name: '导出登录日志', method: 'GET', path: '/login-log/export' },
      { id: 403, name: '获取操作日志', method: 'GET', path: '/operation-log/list' },
      { id: 404, name: '导出操作日志', method: 'GET', path: '/operation-log/export' }
    ]
  }
];

/**
 * 模拟获取全量菜单权限树
 */
export function mockFetchMenuPermissionTree(): Promise<MenuPermissionNode[]> {
  return Promise.resolve(JSON.parse(JSON.stringify(MOCK_MENU_PERMISSION_TREE)));
}

/**
 * 模拟获取用户有效菜单权限 ID 列表
 */
export function mockFetchUserMenuPermission(userUid: string): Promise<number[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟：不同用户有不同权限
      if (userUid === 'a1b2c3d4e5f6g7h8')
        resolve([
          101, 102, 2011, 2012, 2013, 2014, 2021, 2022, 3011, 3012, 3013, 3014, 3021, 3022, 3023,
          3024, 3031, 3032, 3033, 3034, 4011, 4021
        ]);
      else if (userUid === 'i9j0k1l2m3n4o5p6') resolve([101, 2011, 2012, 2013, 2021, 3011]);
      else if (userUid === 'q7r8s9t0u1v2w3x4') resolve([101, 2011, 2021, 3011, 4011, 4021]);
      else resolve([]);
    }, 300);
  });
}

/**
 * 模拟保存用户菜单权限
 */
export function mockFetchSaveUserMenuPermission(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}

/**
 * 模拟获取全量接口权限树
 */
export function mockFetchApiPermissionTree(): Promise<ApiPermissionNode[]> {
  return Promise.resolve(JSON.parse(JSON.stringify(MOCK_API_PERMISSION_TREE)));
}

/**
 * 模拟获取用户有效接口权限 ID 列表
 */
export function mockFetchUserApiPermission(userUid: string): Promise<number[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userUid === 'a1b2c3d4e5f6g7h8')
        resolve([
          101, 102, 103, 104, 105, 201, 202, 203, 204, 301, 302, 303, 304, 401, 402, 403, 404
        ]);
      else if (userUid === 'i9j0k1l2m3n4o5p6') resolve([101, 102, 201, 202, 303, 304]);
      else if (userUid === 'q7r8s9t0u1v2w3x4') resolve([101, 201, 301, 401, 402]);
      else resolve([]);
    }, 300);
  });
}

/**
 * 模拟保存用户接口权限
 */
export function mockFetchSaveUserApiPermission(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}

/**
 * 模拟新增用户
 */
export function mockFetchAddUser(_data: UserFormParams): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}

/**
 * 模拟更新用户
 */
export function mockFetchUpdateUser(_data: UserFormParams): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}

/**
 * 模拟重置用户密码
 */
export function mockFetchResetPassword(_userUid: string, _password: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}
