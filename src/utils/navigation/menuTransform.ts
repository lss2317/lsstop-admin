/**
 * 后端菜单数据转换工具
 *
 * ## 核心职责
 *
 * 1. 将后端 BackendMenuItem[] 转换为前端 AppRouteRecord[]（用于菜单渲染 + 路由注册）
 * 2. 路径规范化：子路由相对路径 → 绝对路径（如 console → /dashboard/console）
 * 3. 目录自动 redirect：推导到第一个可导航的子页面
 * 4. 组件字符串 → Vite 懒加载函数映射
 * 5. 按钮权限提取到 meta.authList
 */
import { h } from 'vue';
import { RouterView } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { BackendMenuItem } from '@/apis/menu/types';
import type { AppRouteRecord } from '@/types/router';
import { IframeRouteManager } from '@/router/core';

/**
 * Vite 预扫描所有 views 下的 .vue 文件
 * key 示例: /src/views/dashboard/console/index.vue
 */
const viewModules = import.meta.glob('/src/views/**/*.vue');

/**
 * 根据后端 component 字符串解析为懒加载函数
 * @param component 组件路径，如 "/dashboard/console"
 */
function resolveComponent(component: string | null): (() => Promise<any>) | undefined {
  if (!component) return undefined;

  // 去掉开头的 /，统一格式
  const cleanPath = component.startsWith('/') ? component.slice(1) : component;

  const candidates = [`/src/views/${cleanPath}/index.vue`, `/src/views/${cleanPath}.vue`];

  for (const path of candidates) {
    if (viewModules[path]) {
      return viewModules[path] as () => Promise<any>;
    }
  }

  console.error(`[menuTransform] 组件路径未找到: ${component}，尝试过: ${candidates.join(', ')}`);
  return createErrorComponent(component);
}

/**
 * 创建错误提示组件（组件路径找不到时的兜底）
 */
function createErrorComponent(componentPath: string): () => Promise<any> {
  return () =>
    Promise.resolve({
      render() {
        return h(
          'div',
          { class: 'route-error', style: 'padding:20px;color:red' },
          `组件未找到: ${componentPath}`
        );
      }
    });
}

/**
 * 拼接父子路径，将相对路径转为绝对路径
 * 参考 art-design-pro MenuProcessor.buildFullPath
 */
function buildFullPath(path: string, parentPath: string): string {
  if (!path) return '';
  // 外部链接直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // 已经是绝对路径，直接返回
  if (path.startsWith('/')) return path;
  // 拼接父路径
  if (parentPath) {
    return `${parentPath.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
  return `/${path}`;
}

/**
 * 判断路由是否可作为默认导航落点
 */
function isNavigableRoute(route: AppRouteRecord): boolean {
  return Boolean(
    route.path &&
      route.path !== '/' &&
      !route.meta?.link &&
      route.meta?.isIframe !== true &&
      !route.meta?.isHide
  );
}

/**
 * 为目录型菜单推导默认 redirect 地址（递归找第一个可导航子路由）
 * 参考 art-design-pro MenuProcessor.resolveDefaultRedirect
 */
function resolveDefaultRedirect(children?: AppRouteRecord[]): string | undefined {
  if (!children?.length) return undefined;

  for (const child of children) {
    if (isNavigableRoute(child)) return child.path;
    const nested = resolveDefaultRedirect(child.children);
    if (nested) return nested;
  }
  return undefined;
}

/**
 * 构建 meta 对象（后端字段 → 前端 RouteMeta）
 */
function buildMeta(item: BackendMenuItem): AppRouteRecord['meta'] {
  return {
    title: item.title,
    icon: item.icon ?? undefined,
    isHide: item.isHide,
    isHideTab: item.isHideTab,
    keepAlive: item.keepAlive,
    isFullPage: item.isFullPage,
    isFirstLevel: item.isFirstLevel,
    fixedTab: item.fixedTab,
    link: item.link ?? undefined,
    isIframe: item.isIframe,
    activePath: item.activePath ?? undefined,
    authMark: item.authMark ?? undefined
  };
}

/**
 * 将后端菜单树转换为前端 AppRouteRecord[]
 *
 * 同时完成：
 * - 路径规范化（相对 → 绝对）
 * - 按钮权限提取到 meta.authList
 * - 目录自动推导 redirect
 *
 * 返回的数据直接用于：
 * 1. 侧边栏菜单渲染
 * 2. getFirstMenuPath 推导首页
 * 3. 传入 transformToRouteRecords 生成路由记录
 */
export function transformMenuData(items: BackendMenuItem[], parentPath = ''): AppRouteRecord[] {
  return items.map((item) => {
    // 1. 路径规范化（iframe 菜单使用 /outside/iframe/{normalizedPath} 格式）
    const isIframeMenu = item.isIframe && !!item.link;
    const basePath = buildFullPath(item.path, parentPath);
    const fullPath = isIframeMenu ? `/outside/iframe/${basePath.replace(/^\//, '')}` : basePath;

    // 2. 基础转换
    const route: AppRouteRecord = {
      id: item.id,
      name: item.name,
      path: fullPath,
      // 目录类型（menuType=1）仅做逻辑分组，不对应实际组件，强制清空防止嵌套布局
      // iframe 菜单使用专用 iframe 视图组件
      component:
        item.menuType === 1 ? undefined : isIframeMenu ? '/outside' : (item.component ?? undefined),
      meta: buildMeta(item)
    };

    // 3. 递归处理子节点（过滤按钮）
    if (item.children?.length) {
      const menuChildren = item.children.filter((c) => c.menuType !== 3);
      if (menuChildren.length) {
        route.children = transformMenuData(menuChildren, fullPath);
      }

      // 提取按钮权限到 meta.authList
      const buttons = item.children.filter((c) => c.menuType === 3);
      if (buttons.length) {
        route.meta.authList = buttons.map((btn) => ({
          title: btn.title,
          authMark: btn.authMark ?? ''
        }));
      }
    }

    // 4. 目录自动推导 redirect
    if (item.menuType === 1 && !item.redirect && route.children?.length) {
      route.redirect = resolveDefaultRedirect(route.children);
    } else {
      route.redirect = item.redirect ?? undefined;
    }

    return route;
  });
}

/**
 * 将 AppRouteRecord[] 转换为 Vue Router 可注册的 RouteRecordRaw[]
 *
 * 核心工作：将 component 字符串通过 resolveComponent 映射为懒加载函数
 * 目录类型使用 RouterView 做透传容器
 * iframe 菜单注册到 IframeRouteManager 并使用 iframe 视图组件
 */
export function transformToRouteRecords(menuList: AppRouteRecord[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];
  const iframeManager = IframeRouteManager.getInstance();

  for (const item of menuList) {
    const hasChildren = item.children && item.children.length > 0;
    const isDirectory = hasChildren && !item.component;
    const isIframeRoute = item.meta?.isIframe && !!item.meta?.link;
    const component = isDirectory
      ? undefined
      : resolveComponent((item.component as string) ?? null);

    // 菜单页面必须有组件（iframe 路由除外，因为 resolveComponent 能解析到 iframe 视图）
    if (!isDirectory && !component && !isIframeRoute) {
      console.warn(`[menuTransform] 菜单 "${String(item.name)}" 缺少有效组件，已跳过`);
      continue;
    }

    const route = {
      name: item.name,
      path: item.path!,
      meta: { ...item.meta },
      component: component ?? {
        // 目录容器：只渲染子路由，不渲染自身页面
        name: `${String(item.name)}Container`,
        render: () => h(RouterView)
      },
      redirect: item.redirect ?? undefined,
      children: undefined as RouteRecordRaw[] | undefined
    };

    // iframe 路由注册到 IframeRouteManager
    if (isIframeRoute) {
      iframeManager.add(item);
    }

    // 递归处理子路由
    if (hasChildren) {
      route.children = transformToRouteRecords(item.children!);
    }

    routes.push(route as RouteRecordRaw);
  }

  return routes;
}
