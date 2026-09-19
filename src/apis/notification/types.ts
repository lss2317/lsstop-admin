/** 通知分类：1-异常告警 2-安全告警 3-系统通知 */
export type NotificationCategory = 1 | 2 | 3;

/** 通知级别：1-普通 2-警告 3-错误 4-严重 */
export type NotificationLevel = 1 | 2 | 3 | 4;

/** 通知阅读状态：0-未读 1-已读 */
export type NotificationReadStatus = 0 | 1;

/** 通知列表搜索参数 */
export interface NotificationListParams {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 通知分类 */
  category?: NotificationCategory;
  /** 事件类型 */
  eventType?: string;
  /** 通知级别 */
  level?: NotificationLevel;
  /** 阅读状态 */
  readStatus?: NotificationReadStatus;
  /** 来源类型 */
  sourceType?: string;
  /** 标题或内容关键词 */
  keyword?: string;
  /** 最近发生时间起点，ISO 8601 格式 */
  startTime?: string;
  /** 最近发生时间终点，ISO 8601 格式 */
  endTime?: string;
}

/** 通知列表项 */
export interface NotificationListItem {
  /** 通知唯一编号 */
  notificationNo: string;
  /** 通知分类 */
  category: NotificationCategory;
  /** 事件类型 */
  eventType: string;
  /** 通知级别 */
  level: NotificationLevel;
  /** 标题 */
  title: string;
  /** 摘要 */
  content: string;
  /** 来源类型 */
  sourceType: string | null;
  /** 来源追踪编号 */
  sourceId: string | null;
  /** 聚合发生次数 */
  occurrenceCount: number;
  /** 阅读时间，为 null 时表示未读 */
  readTime: string | null;
  /** 首次发生时间 */
  firstOccurredTime: string;
  /** 最近发生时间 */
  lastOccurredTime: string;
}

/** 通知详情 */
export interface NotificationDetail extends NotificationListItem {
  /** 已脱敏的 JSON 扩展诊断数据 */
  extra: string | null;
  /** 创建时间 */
  createTime: string;
}

/** 通知分页响应 */
export interface NotificationListResponse {
  records: NotificationListItem[];
  current: number;
  size: number;
  total: number;
}
