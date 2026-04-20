import { AppRouteRecordRaw } from '@/utils/router';

/** 公开路由（无需登录即可访问） */
export const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forget-password',
  '/403',
  '/500'
];

/**
 * 静态路由配置
 *
 * 属性说明：
 * isHideTab: true 表示不在标签页中显示
 */
export const staticRoutes: AppRouteRecordRaw[] = [
  // 公开路由
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@views/auth/login/index.vue'),
    meta: { title: 'menus.login.title', isHideTab: true }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@views/auth/register/index.vue'),
    meta: { title: 'menus.register.title', isHideTab: true }
  },
  {
    path: '/auth/forget-password',
    name: 'ForgetPassword',
    component: () => import('@views/auth/forget-password/index.vue'),
    meta: { title: 'menus.forgetPassword.title', isHideTab: true }
  },
  {
    path: '/403',
    name: 'Exception403',
    component: () => import('@views/exception/403/index.vue'),
    meta: { title: '403', isHideTab: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Exception404',
    component: () => import('@views/exception/404/index.vue'),
    meta: { title: '404', isHideTab: true }
  },
  {
    path: '/500',
    name: 'Exception500',
    component: () => import('@views/exception/500/index.vue'),
    meta: { title: '500', isHideTab: true }
  },
  // 需要登录的布局路由（由 beforeEach 守卫保护）
  {
    path: '/',
    name: 'Layout',
    component: () => import('@views/index/index.vue'),
    redirect: '/home',
    meta: { title: '' },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@views/home/index.vue'),
        meta: { title: '首页' }
      }
    ]
  }
];
