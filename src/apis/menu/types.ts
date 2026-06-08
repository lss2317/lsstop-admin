/**
 * 菜单接口类型定义
 *
 * @module apis/menu/types
 */

/** 后端菜单项（对应 blog_menu 表） */
export interface BackendMenuItem {
  /** 菜单ID */
  id: number;
  /** 父级ID（0=顶级） */
  parentId: number;
  /** 类型：1-目录 2-菜单 3-按钮 4-内嵌 5-外链 */
  menuType: number;
  /** 路由 name（唯一标识） */
  name: string;
  /** 路由 path */
  path: string;
  /** 组件路径（如 dashboard/console） */
  component: string | null;
  /** 菜单标题 */
  title: string;
  /** 菜单图标 */
  icon: string | null;
  /** 排序 */
  sort: number;
  /** 是否在菜单中隐藏 */
  isHide: boolean;
  /** 是否在标签页中隐藏 */
  isHideTab: boolean;
  /** 是否缓存页面 */
  keepAlive: boolean;
  /** 是否全屏页面 */
  isFullPage: boolean;
  /** 是否一级菜单 */
  isFirstLevel: boolean;
  /** 是否固定标签页 */
  fixedTab: boolean;
  /** 外部链接URL */
  link: string | null;
  /** 是否iframe嵌入 */
  isIframe: boolean;
  /** 激活菜单路径（隐藏菜单用） */
  activePath: string | null;
  /** 权限标识（如 add） */
  authMark: string | null;
  /** 是否启用：0-禁用 1-启用 */
  isEnabled: number;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
  /** 子菜单（后端返回树形结构） */
  children?: BackendMenuItem[];
}

// ==================== 菜单管理页 ====================

/** 菜单管理列表响应（树形结构，无分页） */
export type MenuListResponse = BackendMenuItem[];

/** 菜单管理搜索参数 */
export interface MenuSearchParams {
  /** 关键词（模糊搜索：名称、路由、权限标识） */
  keyword?: string;
  /** 菜单类型：directory-目录 menu-菜单 button-按钮 iframe-内嵌 link-外链 */
  menuType?: string;
  /** 是否启用 */
  isEnabled?: number;
}
