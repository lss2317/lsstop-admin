import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import NProgress from 'nprogress';
import { useSettingStore } from '@/store/modules/setting';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';
import { setWorktab } from '@/utils/navigation';
import { setPageTitle } from '@/utils/router';
import { publicPaths, staticRoutes } from '../routes/staticRoutes';
import type { AppRouteRecord } from '@/types/router';

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

/** 从静态路由中提取 Layout 子路由作为菜单 */
function buildMenuFromRoutes(): AppRouteRecord[] {
  const layoutRoute = staticRoutes.find((r) => r.name === 'Layout');
  return (layoutRoute?.children as AppRouteRecord[]) ?? [];
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

      // 登录后初始化菜单（只执行一次）
      if (userStore.isLogin && !menuInited) {
        menuInited = true;
        const menuStore = useMenuStore();
        menuStore.setMenuList(buildMenuFromRoutes());
      }

      setWorktab(to);
      setPageTitle(to);
      next();
    }
  );
}
