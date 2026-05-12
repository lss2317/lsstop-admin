// ==================== Console ====================

/** 统计卡片 */
export interface StatCardItem {
  /** 卡片标识（"totalVisits" | "totalUsers" | "totalComments" | "totalMessages"） */
  key: 'totalVisits' | 'totalUsers' | 'totalComments' | 'totalMessages';
  /** 数值 */
  num: number;
}

/** 日统计点 */
export interface ConsoleDailyItem {
  /** 日期（yyyy-MM-dd） */
  date: string;
  /** 当日数值 */
  count: number;
}

/** 评论统计（近7天） */
export interface CommentStat {
  /** 每日评论数 */
  dailyStats: ConsoleDailyItem[];
  /** 7天总数 */
  totalCount: number;
  /** 今日新增 */
  todayCount: number;
  /** 日均评论 */
  dailyAvg: number;
  /** 周同比，如 "+15%" */
  weekOverWeek: string;
}

/** 访问量（近10天） */
export interface VisitOverview {
  /** 每日访问量 */
  dailyStats: ConsoleDailyItem[];
}

/** 最近评论 */
export interface RecentCommentItem {
  /** 头像 */
  avatar: string;
  /** 昵称 */
  nickname: string;
  /** 评论内容 */
  content: string;
  /** 1=文章 2=友链 3=说说 */
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
  /** 文章数 */
  articleCount: number;
  /** 分类数 */
  categoryCount: number;
  /** 标签数 */
  tagCount: number;
  /** 友链数 */
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

// ==================== Analysis ====================

/** 日统计点 */
export interface AnalysisDailyItem {
  /** yyyy-MM-dd */
  date: string;
  /** 当日数值 */
  count: number;
}

/** 独立访客趋势（近30天） */
export interface UniqueVisitorTrend {
  /** 每日独立访客数 */
  dailyStats: AnalysisDailyItem[];
}

/** 热门文章 */
export interface TopArticleItem {
  /** 文章标题 */
  name: string;
  /** 浏览量 */
  viewCount: number;
}

/** 分类分布 */
export interface CategoryItem {
  /** 分类名 */
  name: string;
  /** 文章数 */
  value: number;
}

/** 评论来源分布 */
export interface CommentSourceItem {
  /** 评论目标类型：1=文章 2=友链 3=说说 */
  targetType: 1 | 2 | 3;
  /** 评论数 */
  value: number;
}

/** 单日互动数据 */
export interface DailyInteraction {
  /** yyyy-MM-dd */
  date: string;
  /** 评论数 */
  comment: number;
  /** 留言数 */
  message: number;
  /** 点赞数 */
  like: number;
}

/** 互动趋势（近7天） */
export interface InteractionTrend {
  /** 每日互动数据 */
  dailyData: DailyInteraction[];
}

/** 标签热度 */
export interface TagRadarItem {
  /** 标签名 */
  name: string;
  /** 文章数 */
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
