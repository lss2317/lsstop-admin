/**
 * 权限验证管理
 *
 * 提供统一的按钮级权限校验功能
 * 基于后端路由 meta.authList 进行权限判断
 */

import { useRoute } from 'vue-router';
import type { AppRouteRecord } from '@/types/router';

type AuthItem = NonNullable<AppRouteRecord['meta']['authList']>[number];

export const useAuth = () => {
  const route = useRoute();

  // 当前路由 meta 中的按钮权限列表（由 menuTransform 从 menuType=3 的按钮节点提取）
  const authList: AuthItem[] = Array.isArray(route.meta.authList)
    ? (route.meta.authList as AuthItem[])
    : [];

  /**
   * 检查是否拥有某权限标识
   * @param auth 权限标识（如 'article:add'）
   * @returns 是否有权限
   */
  const hasAuth = (auth: string): boolean => {
    return authList.some((item) => item?.authMark === auth);
  };

  return {
    hasAuth
  };
};
