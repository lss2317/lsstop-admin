/**
 * 格式化工具函数
 */

import EmojiList from '@/utils/constants/emoji';

/**
 * 将日期时间格式化为相对时间描述
 * @param dateStr ISO 8601 格式的时间字符串
 * @returns 相对时间描述（如"5分钟前"、"2小时前"、"3天前"）
 */
export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  if (months < 12) return `${months}个月前`;
  return `${years}年前`;
}

/**
 * 将 yyyy-MM-dd 格式的日期转换为 M/D 短格式
 * @param dateStr yyyy-MM-dd 格式的日期字符串
 * @returns M/D 格式（如 "5/1"、"12/31"）
 */
export function formatDateShort(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${Number(month)}/${Number(day)}`;
}

/**
 * HTML特殊字符转义，防止XSS攻击
 * @param str 原始字符串
 * @returns 转义后的安全字符串
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 将表情文本转换为图片标签
 * 先转义HTML特殊字符防止XSS，再将 [微笑] 等标记替换为 <img> 标签
 * @param content 原始评论内容
 * @returns 包含表情图片标签的HTML字符串
 */
export function parseEmoji(content: string): string {
  if (!content) return '';
  const escaped = escapeHtml(content);
  return escaped.replace(/\[([^\]]+)]/g, (match) => {
    const url = EmojiList[match];
    return url ? `<img src="${url}" alt="${match}" class="comment-emoji" />` : match;
  });
}
