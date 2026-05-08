/**
 * 格式化工具函数
 */

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
