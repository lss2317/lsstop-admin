/**
 * 系统设置类型定义
 *
 * @module apis/setting/types
 */

/** 网站配置信息（对应后端 WebsiteConfigEntity，表中仅一条数据） */
export interface WebsiteConfigItem {
  /** 主键ID（更新配置时需携带） */
  id: number;
  /** 网站头像 */
  siteAvatar: string | null;
  /** 网站名称 */
  siteName: string | null;
  /** 网站作者 */
  siteAuthor: string | null;
  /** 网站介绍 */
  siteIntro: string | null;
  /** 关于我（Markdown 原文） */
  about: string | null;
  /** 网站创建时间 */
  siteStartTime: string | null;
  /** QQ链接 */
  qqUrl: string | null;
  /** GitHub链接 */
  githubUrl: string | null;
  /** Gitee链接 */
  giteeUrl: string | null;
  /** 用户默认头像 */
  defaultUserAvatar: string | null;
  /** 评论审核(1:是、0:否) */
  enableCommentReview: number;
  /** 留言审核(1:是、0:否) */
  enableMessageReview: number;
  /** websocket地址 */
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
