/**
 * 接口权限类型定义
 *
 * @module apis/api-permission/types
 */

/** 接口权限项（对应 blog_api_permission 表） */
export interface ApiPermissionItem {
  /** 权限ID */
  id: number;
  /** 父级权限ID（0=顶级） */
  parentId: number;
  /** 接口路径（目录节点为NULL） */
  requestUrl: string | null;
  /** 请求方法（目录节点为NULL） */
  requestMethod: string | null;
  /** 权限描述 */
  description: string | null;
  /** 排序 */
  sort: number;
  /** 是否启用：0-禁用 1-启用 */
  isEnabled: number;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
  /** 子节点（后端返回树形结构） */
  children?: ApiPermissionItem[];
}

/** 接口权限列表响应（树形结构，无分页） */
export type ApiPermissionListResponse = ApiPermissionItem[];

/** 接口权限搜索参数 */
export interface ApiPermissionSearchParams {
  /** 关键词（模糊搜索：描述、接口路径） */
  keyword?: string;
  /** 请求方法 */
  requestMethod?: string;
  /** 是否启用 */
  isEnabled?: number;
}
