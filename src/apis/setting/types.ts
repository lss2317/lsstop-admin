/**
 * 系统设置类型定义
 *
 * @module apis/setting/types
 */

/** 个人博客配置 */
export interface WebsiteConfigItem {
  /** 主键ID（更新配置时需携带） */
  id: number;
  /** 博主头像（首页、侧栏和关于我页面使用） */
  siteAvatar: string | null;
  /** 博客名称 */
  siteName: string | null;
  /** 博主名称（文章作者和页脚使用） */
  siteAuthor: string | null;
  /** 博客简介（首页使用） */
  siteIntro: string | null;
  /** 关于我（Markdown 原文） */
  about: string | null;
  /** 博客创建时间（页脚年份和运行时间使用） */
  siteStartTime: string | null;
  /** QQ链接 */
  qqUrl: string | null;
  /** GitHub链接 */
  githubUrl: string | null;
  /** Gitee链接 */
  giteeUrl: string | null;
  /** 访客默认头像 */
  defaultUserAvatar: string | null;
  /** 评论审核(1:是、0:否) */
  enableCommentReview: number;
  /** 留言审核(1:是、0:否) */
  enableMessageReview: number;
  /** 聊天室WebSocket基础地址 */
  websocketUrl: string | null;
  /** 评论通知(1:是、0:否) */
  enableCommentEmailNotice: number;
  /** 评论审核通知(1:是、0:否) */
  enableCommentReviewNotice: number;
  /** 留言审核通知(1:是、0:否) */
  enableMessageReviewNotice: number;
  /** 评论命中敏感词处理(0:拦截,1:转审核,2:替换发布) */
  commentIllegalPolicy: number;
  /** 留言命中敏感词处理(0:拦截,1:转审核,2:替换发布) */
  messageIllegalPolicy: number;
}
