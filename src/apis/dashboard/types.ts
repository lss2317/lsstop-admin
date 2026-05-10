/**
 * 仪表盘接口类型定义
 */

/** 统计卡片项 */
export interface StatCardItem {
  /** 卡片标识（"totalVisits" | "totalUsers" | "totalComments" | "totalMessages"） */
  key: 'totalVisits' | 'totalUsers' | 'totalComments' | 'totalMessages';
  /** 数值 */
  num: number;
}

/** 每日统计项 */
export interface DailyStatItem {
  /** 日期（yyyy-MM-dd 格式） */
  date: string;
  /** 当日数值 */
  count: number;
}

/** 近七天评论统计 */
export interface CommentStat {
  /** 近7天每日评论数 */
  dailyStats: DailyStatItem[];
  /** 7天评论总数 */
  totalCount: number;
  /** 今日新增 */
  todayCount: number;
  /** 日均评论 */
  dailyAvg: number;
  /** 周同比（如"+15%"） */
  weekOverWeek: string;
}

/** 近十天访问量 */
export interface VisitOverview {
  /** 近10天每日访问量 */
  dailyStats: DailyStatItem[];
}

/** 最近评论项 */
export interface RecentCommentItem {
  /** 头像 */
  avatar: string;
  /** 昵称 */
  nickname: string;
  /** 评论内容 */
  content: string;
  /** 评论目标类型：1=文章, 2=友链, 3=说说 */
  targetType: 1 | 2 | 3;
  /** 目标名称（文章标题/说说内容摘要；友链时为空字符串） */
  targetName: string;
  /** 评论时间（ISO 8601 格式） */
  createdAt: string;
}

/** 待审核统计 */
export interface PendingReview {
  /** 待审核评论数 */
  commentCount: number;
  /** 待审核留言数 */
  messageCount: number;
}

/** 内容概览 */
export interface ContentOverview {
  /** 文章总数 */
  articleCount: number;
  /** 分类总数 */
  categoryCount: number;
  /** 标签总数 */
  tagCount: number;
  /** 友链总数 */
  friendLinkCount: number;
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
  /** 内容概览 */
  contentOverview: ContentOverview;
}

/** 独立访客趋势（近30天） */
export interface UniqueVisitorTrend {
  /** 近30天每日独立访客数 */
  dailyStats: DailyStatItem[];
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

/** 互动趋势 */
export interface InteractionTrend {
  /** 日期列表（yyyy-MM-dd 格式） */
  dates: string[];
  /** 各类型趋势数据 */
  items: InteractionTrendItem[];
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
  interactionTrend: InteractionTrend;
  /** 标签热度 */
  tagRadar: TagRadarItem[];
}
