/**
 * 用户相关接口
 *
 * @module apis/user
 */
import avatarImg from '@/assets/images/avatar/avatar.webp';
import type { UserSearchParams, PaginatedUserResponse, UserListItem, RoleItem } from './types';

export type { UserListItem, UserSearchParams, PaginatedUserResponse, RoleItem } from './types';

/** 模拟角色列表 */
export const MOCK_ROLE_LIST: RoleItem[] = [
  { roleCode: 'admin', roleName: '管理员' },
  { roleCode: 'editor', roleName: '编辑者' },
  { roleCode: 'viewer', roleName: '观察者' },
  { roleCode: 'operator', roleName: '运营人员' }
];

/** 模拟用户头像 */
const AVATAR = avatarImg;

/** 模拟用户数据 */
const MOCK_USER_LIST: UserListItem[] = [
  {
    id: 1,
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    userGender: '男',
    userPhone: '13800138001',
    status: '1',
    createTime: '2025-06-01 10:30:00',
    avatar: AVATAR,
    userRoles: ['admin', 'editor']
  },
  {
    id: 2,
    userName: '李四',
    userEmail: 'lisi@example.com',
    userGender: '男',
    userPhone: '13800138002',
    status: '1',
    createTime: '2025-06-02 14:20:00',
    avatar: AVATAR,
    userRoles: ['editor']
  },
  {
    id: 3,
    userName: '王五',
    userEmail: 'wangwu@example.com',
    userGender: '男',
    userPhone: '13800138003',
    status: '2',
    createTime: '2025-06-03 09:15:00',
    avatar: AVATAR,
    userRoles: ['viewer']
  },
  {
    id: 4,
    userName: '赵六',
    userEmail: 'zhaoliu@example.com',
    userGender: '女',
    userPhone: '13800138004',
    status: '1',
    createTime: '2025-06-04 16:45:00',
    avatar: AVATAR,
    userRoles: ['operator']
  },
  {
    id: 5,
    userName: '孙七',
    userEmail: 'sunqi@example.com',
    userGender: '女',
    userPhone: '13800138005',
    status: '3',
    createTime: '2025-06-05 11:00:00',
    avatar: AVATAR,
    userRoles: ['viewer', 'operator']
  },
  {
    id: 6,
    userName: '周八',
    userEmail: 'zhouba@example.com',
    userGender: '男',
    userPhone: '13800138006',
    status: '4',
    createTime: '2025-06-06 08:30:00',
    avatar: AVATAR,
    userRoles: []
  },
  {
    id: 7,
    userName: '吴九',
    userEmail: 'wujiu@example.com',
    userGender: '女',
    userPhone: '13800138007',
    status: '1',
    createTime: '2025-06-07 13:10:00',
    avatar: AVATAR,
    userRoles: ['admin']
  },
  {
    id: 8,
    userName: '郑十',
    userEmail: 'zhengshi@example.com',
    userGender: '男',
    userPhone: '13800138008',
    status: '2',
    createTime: '2025-06-08 15:55:00',
    avatar: AVATAR,
    userRoles: ['editor', 'operator']
  },
  {
    id: 9,
    userName: '陈一一',
    userEmail: 'chenyiyi@example.com',
    userGender: '女',
    userPhone: '13800138009',
    status: '1',
    createTime: '2025-06-09 10:00:00',
    avatar: AVATAR,
    userRoles: ['viewer']
  },
  {
    id: 10,
    userName: '刘十二',
    userEmail: 'liushier@example.com',
    userGender: '男',
    userPhone: '13800138010',
    status: '1',
    createTime: '2025-06-10 17:30:00',
    avatar: AVATAR,
    userRoles: ['admin', 'editor', 'operator']
  },
  {
    id: 11,
    userName: '黄十三',
    userEmail: 'huangshisan@example.com',
    userGender: '女',
    userPhone: '13800138011',
    status: '2',
    createTime: '2025-06-11 09:45:00',
    avatar: AVATAR,
    userRoles: ['operator']
  },
  {
    id: 12,
    userName: '林十四',
    userEmail: 'linshisi@example.com',
    userGender: '男',
    userPhone: '13800138012',
    status: '1',
    createTime: '2025-06-12 12:20:00',
    avatar: AVATAR,
    userRoles: ['editor']
  }
];

/**
 * 模拟获取用户列表接口
 * 支持分页和搜索过滤
 */
export function mockFetchUserList(params: UserSearchParams = {}): Promise<PaginatedUserResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...MOCK_USER_LIST];

      if (params.userName) {
        filtered = filtered.filter((u) => u.userName.includes(params.userName!));
      }
      if (params.userPhone) {
        filtered = filtered.filter((u) => u.userPhone.includes(params.userPhone!));
      }
      if (params.userEmail) {
        filtered = filtered.filter((u) => u.userEmail.includes(params.userEmail!));
      }
      if (params.userGender) {
        filtered = filtered.filter((u) => u.userGender === params.userGender);
      }
      if (params.status) {
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
