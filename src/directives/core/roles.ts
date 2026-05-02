/**
 * v-roles 角色权限指令
 *
 * 基于用户角色控制 DOM 元素的显示和隐藏
 *
 * ## 主要功能
 *
 * - 角色验证 - 检查用户是否拥有指定角色
 * - 多角色支持 - 支持单个角色或多个角色（满足其一即可）
 * - DOM 控制 - 无权限时自动移除元素
 * - 响应式更新 - 角色变化时自动更新元素状态
 */

import { useUserStore } from '@/store/modules/user';
import { App, Directive, DirectiveBinding } from 'vue';

export type RolesDirective = Directive<HTMLElement, string | string[]>;

function checkRolePermission(el: HTMLElement, binding: DirectiveBinding<string | string[]>): void {
  const userStore = useUserStore();
  const userRoles = userStore.getUserInfo.roles;

  // 如果用户角色为空或未定义，移除元素
  if (!userRoles?.length) {
    removeElement(el);
    return;
  }

  // 确保指令值为数组格式
  const requiredRoles = Array.isArray(binding.value) ? binding.value : [binding.value];

  // 检查用户是否具有所需角色之一
  const hasPermission = requiredRoles.some((role: string) => userRoles.includes(role));

  // 如果没有权限，安全地移除元素
  if (!hasPermission) {
    removeElement(el);
  }
}

function removeElement(el: HTMLElement): void {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

const rolesDirective: RolesDirective = {
  mounted: checkRolePermission,
  updated: checkRolePermission
};

export function setupRolesDirective(app: App): void {
  app.directive('roles', rolesDirective);
}
