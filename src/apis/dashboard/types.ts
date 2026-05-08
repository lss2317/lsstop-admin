/**
 * 仪表盘接口类型定义
 */

/** 统计卡片项 */
export interface StatCardItem {
  /** 描述（如"总访问量"） */
  des: string;
  /** 数值 */
  num: number;
  /** 周环比变化（如"+20%"、"-12%"） */
  change: string;
}

/** 近七天评论统计 */
export interface CommentStat {
  /** 近7天每日评论数 */
  dailyCounts: number[];
  /** 待审核数 */
  pendingCount: number;
  /** 今日新增 */
  todayCount: number;
  /** 日均评论 */
  dailyAvg: number;
  /** 周同比（如"+15%"） */
  weekOverWeek: string;
}

/** 近十天访问量 */
export interface VisitOverview {
  /** 每日访问量 */
  dailyCounts: number[];
}

/** 最近评论项 */
export interface RecentCommentItem {
  /** 头像 */
  avatar: string;
  /** 昵称 */
  nickname: string;
  /** 评论内容 */
  content: string;
  /** 文章标题 */
  article: string;
  /** 时间描述（如"5分钟前"） */
  time: string;
}

/** 待审核统计 */
export interface PendingReview {
  /** 待审核评论数 */
  commentCount: number;
  /** 待审核留言数 */
  messageCount: number;
}

/** Console 主页聚合响应 */
export interface ConsoleData {
  /** 统计卡片列表 */
  statCards: StatCardItem[];
  /** 近七天评论统计 */
  commentStat: CommentStat;
  /** 近十天访问量 */
  visitOverview: VisitOverview;
  /** 最近评论（limit=5） */
  recentComments: RecentCommentItem[];
  /** 待审核统计 */
  pendingReview: PendingReview;
}

/** 独立访客趋势（近30天） */
export interface UniqueVisitorTrend {
  /** 每日独立访客数 */
  dailyCounts: number[];
}

/** 热门文章项 */
export interface TopArticleItem {
  /** 文章标题 */
  name: string;
  /** 浏览量 */
  viewCount: number;
}

/** 分类分布项 */
export interface CategoryItem {
  /** 分类名称 */
  name: string;
  /** 文章数量 */
  value: number;
}

/** 评论来源分布项 */
export interface CommentSourceItem {
  /** 来源名称（文章评论/友链评论/说说评论） */
  name: string;
  /** 评论数量 */
  value: number;
}

/** 互动趋势数据项 */
export interface InteractionTrendItem {
  /** 类型名称（评论/留言/点赞） */
  name: string;
  /** 近7天每日数据 */
  data: number[];
}

/** 标签热度项 */
export interface TagRadarItem {
  /** 标签名称 */
  name: string;
  /** 文章数量 */
  value: number;
}

/** Analysis 分析页聚合响应 */
export interface AnalysisData {
  /** 近30天独立访客趋势 */
  uniqueVisitorTrend: UniqueVisitorTrend;
  /** 热门文章 Top7 */
  topArticles: TopArticleItem[];
  /** 文章分类分布 */
  categoryDistribution: CategoryItem[];
  /** 评论来源分布 */
  commentSource: CommentSourceItem[];
  /** 近7天互动趋势 */
  interactionTrend: InteractionTrendItem[];
  /** 标签热度 */
  tagRadar: TagRadarItem[];
}
