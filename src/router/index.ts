import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import { staticRoutes } from './routes/staticRoutes';
import { configureNProgress } from '@/utils/router';
import { resetPendingLoading, setupBeforeEachGuard } from './guards/beforeEach';
import { setupAfterEachGuard } from './guards/afterEach';
import { loadingService } from '@/utils/ui';

// 创建路由实例
export const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes // 静态路由
});

// 初始化路由
export function initRouter(app: App<Element>): void {
  configureNProgress(); // 顶部进度条
  setupBeforeEachGuard(router); // 路由前置守卫
  setupAfterEachGuard(router); // 路由后置守卫

  // 捕获懒加载页面等路由级错误，避免页面无反馈地停留在原路由
  router.onError((error, to) => {
    NProgress.done();
    loadingService.hideLoading();
    resetPendingLoading();
    console.error(`[RouterError] 页面加载失败: ${to.fullPath}`, error);
    ElMessage.error('页面加载失败，请刷新后重试');
  });

  app.use(router);
}
