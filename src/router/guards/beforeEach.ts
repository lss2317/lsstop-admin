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
import { loadingService } from '@/utils/ui';
import { publicPaths } from '../routes/staticRoutes';
import { fetchMenuList } from '@/apis/menu';
import { transformMenuData, transformToRouteRecords } from '@/utils/navigation/menuTransform';

let pendingLoading = false;
let menuInited = false;
let menuInitPromise: Promise<void> | null = null;

/**
 * 初始化当前用户菜单与动态路由。
 *
 * 初始化期间的所有导航共享同一个 Promise，避免重复请求和重复注册路由。
 * 只有用户信息、菜单和动态路由全部处理成功后，才会标记为初始化完成。
 */
function ensureMenuInitialized(router: Router): Promise<void> {
  if (menuInited) {
    return Promise.resolve();
  }

  if (menuInitPromise) {
    return menuInitPromise;
  }

  pendingLoading = true;
  loadingService.showLoading();

  menuInitPromise = (async () => {
    const userStore = useUserStore();
    const menuStore = useMenuStore();

    // 1. 获取用户信息
    await userStore.fetchUserInfoAction();

    // 2. 从接口获取菜单数据
    const backendMenus = await fetchMenuList();

    // 3. 转换为前端菜单数据（路径规范化 + 自动redirect + 按钮权限提取）
    const menuList = transformMenuData(backendMenus);

    // 4. 转换为 Vue Router 路由记录并动态注册
    const routeRecords = transformToRouteRecords(menuList);
    const removeFns = routeRecords.map((route) => router.addRoute('Layout', route));
    menuStore.addRemoveRouteFns(removeFns);

    // 5. 设置菜单列表（同时自动推导 homePath）
    menuStore.setMenuList(menuList);

    menuInited = true;
  })().finally(() => {
    menuInitPromise = null;
  });

  return menuInitPromise;
}

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
      // 动态路由注册前，合法业务地址会暂时命中 Exception404，因此不能按 isPublic 跳过初始化。
      // 仅在初始化失败跳转到 500 页后暂停重试，用户点击“返回首页”时会再次初始化。
      if (userStore.isLogin && !menuInited && to.name !== 'Exception500') {
        try {
          await ensureMenuInitialized(router);
          const menuStore = useMenuStore();

          // 动态路由刚注册，用 path 重新解析（不能用 ...to，否则会携带旧的 name 如 Exception404）
          const targetPath = to.path === '/' ? menuStore.getHomePath() : to.fullPath;
          next({ path: targetPath, replace: true });
          return;
        } catch (error) {
          // 请求失败由 HTTP 层统一处理（错误提示、token 过期自动登出）
          // 显式结束当前导航并进入错误页，避免导航一直处于 pending 状态
          menuInited = false;
          pendingLoading = false;
          loadingService.hideLoading();
          console.error('[RouterInitError] 用户菜单和动态路由初始化失败', error);
          next({ name: 'Exception500', replace: true });
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
