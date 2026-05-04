/**
 * 路由全局前置守卫
 *
 * @module router/guards/beforeEach
 */
import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import NProgress from 'nprogress';
import { useSettingStore } from '@/store/modules/setting';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';
import { setWorktab } from '@/utils/navigation';
import { setPageTitle } from '@/utils/router';
import { publicPaths } from '../routes/staticRoutes';
import { fetchMenuList } from '@/apis/menu';
import { transformMenuData, transformToRouteRecords } from '@/utils/navigation/menuTransform';

let pendingLoading = false;
let menuInited = false;

export function getPendingLoading(): boolean {
  return pendingLoading;
}

export function resetPendingLoading(): void {
  pendingLoading = false;
}

export function getRouteInitFailed(): boolean {
  return false;
}

export function resetRouteInitState(): void {
  menuInited = false;
}

export function resetRouterState(_delay: number): void {
  setTimeout(() => {
    menuInited = false;
    const menuStore = useMenuStore();
    menuStore.setMenuList([]);
  }, _delay);
}

/** 路由全局前置守卫 */
export function setupBeforeEachGuard(router: Router): void {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const settingStore = useSettingStore();
      const userStore = useUserStore();

      // 启动进度条
      if (settingStore.showNprogress) {
        NProgress.start();
      }

      // 未登录且访问的不是公开路由 → 跳转到登录页
      const isPublic = publicPaths.some((p) => to.path.startsWith(p)) || to.name === 'Exception404';

      if (!userStore.isLogin && !isPublic) {
        next({ name: 'Login', query: { redirect: to.fullPath } });
        return;
      }

      // 登录后初始化（只执行一次）：获取用户信息 + 从接口构建菜单 + 动态注册路由
      if (userStore.isLogin && !menuInited) {
        menuInited = true;
        try {
          // 1. 获取用户信息
          await userStore.fetchUserInfoAction();

          // 2. 从接口获取菜单数据
          const backendMenus = await fetchMenuList();

          // 3. 转换为前端菜单数据（路径规范化 + 自动redirect + 按钮权限提取）
          const menuList = transformMenuData(backendMenus);

          // 4. 转换为 Vue Router 路由记录并动态注册
          const routeRecords = transformToRouteRecords(menuList);
          const menuStore = useMenuStore();

          // 注册动态路由到 Layout 下
          const removeFns = routeRecords.map((route) => router.addRoute('Layout', route));
          menuStore.addRemoveRouteFns(removeFns);

          // 5. 设置菜单列表（同时自动推导 homePath）
          menuStore.setMenuList(menuList);

          // 动态路由刚注册，需要重定向以确保匹配
          // 如果用户访问的是根路径 '/'，则跳转到首页
          if (to.path === '/') {
            next({ path: menuStore.getHomePath(), replace: true });
          } else {
            next({ ...to, replace: true });
          }
          return;
        } catch {
          // 请求失败由 HTTP 层统一处理（错误提示、token 过期自动登出）
          // 这里只需重置初始化标志，避免卡死在守卫中
          menuInited = false;
          return;
        }
      }

      // 已登录且已初始化，如果访问根路径则跳转首页
      if (userStore.isLogin && to.path === '/') {
        const menuStore = useMenuStore();
        const homePath = menuStore.getHomePath();
        if (homePath && homePath !== '/') {
          next({ path: homePath, replace: true });
          return;
        }
      }

      setWorktab(to);
      setPageTitle(to);
      next();
    }
  );
}
