/**
 * v-auth 权限指令
 *
 * 基于权限标识控制 DOM 元素的显示和隐藏
 *
 * ## 主要功能
 *
 * - 权限验证 - 根据路由 meta 中的权限列表验证用户权限
 * - DOM 控制 - 无权限时自动移除元素
 * - 响应式更新 - 权限变化时自动更新元素状态
 */

import { router } from '@/router';
import { App, Directive, DirectiveBinding } from 'vue';

export type AuthDirective = Directive<HTMLElement, string>;

function checkAuthPermission(el: HTMLElement, binding: DirectiveBinding<string>): void {
  // 获取当前路由的权限列表
  const authList = (router.currentRoute.value.meta.authList as Array<{ authMark: string }>) || [];

  // 检查是否有对应的权限标识
  const hasPermission = authList.some((item) => item.authMark === binding.value);

  // 如果没有权限，移除元素
  if (!hasPermission) {
    removeElement(el);
  }
}

function removeElement(el: HTMLElement): void {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

const authDirective: AuthDirective = {
  mounted: checkAuthPermission,
  updated: checkAuthPermission
};

export function setupAuthDirective(app: App): void {
  app.directive('auth', authDirective);
}
