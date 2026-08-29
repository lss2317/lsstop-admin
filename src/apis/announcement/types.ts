/**
 * 公告接口类型定义
 *
 * @module apis/announcement/types
 */

/** 公告类型：1-弹窗公告 2-首页展示 3-全部展示 */
export type AnnouncementType = 1 | 2 | 3;

/** 公告启用状态：0-禁用 1-启用 */
export type AnnouncementEnabledStatus = 0 | 1;

/** 公告列表搜索参数 */
export interface AnnouncementSearchParams {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 公告标题关键词 */
  keyword?: string;
  /** 公告类型 */
  type?: AnnouncementType;
  /** 是否启用 */
  isEnabled?: AnnouncementEnabledStatus;
}

/** 公告列表项 */
export interface AnnouncementItem {
  /** 公告ID */
  id: number;
  /** 公告标题 */
  title: string;
  /** 公告内容 */
  content: string;
  /** 公告类型 */
  type: AnnouncementType;
  /** 显示优先级 */
  priority: number;
  /** 是否启用 */
  isEnabled: AnnouncementEnabledStatus;
  /** 生效开始时间 */
  startTime: string | null;
  /** 生效结束时间 */
  endTime: string | null;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/** 公告分页列表响应 */
export interface AnnouncementListResponse {
  /** 记录列表 */
  records: AnnouncementItem[];
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 总条数 */
  total: number;
}
