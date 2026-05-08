/**
 * 仪表盘相关接口
 *
 * @module apis/dashboard
 */
import request from '@/utils/http';
import type { ConsoleData, AnalysisData } from './types';

/**
 * 获取主页（控制台）聚合数据
 * 包含：统计卡片、评论统计、访问量、最近评论、待审核
 */
export function fetchConsoleData() {
  return request.get<ConsoleData>({
    url: '/dashboard/console'
  });
}

/**
 * 获取分析页聚合数据
 * 包含：访问趋势、热门文章、分类分布、评论来源、互动趋势、标签热度
 */
export function fetchAnalysisData() {
  return request.get<AnalysisData>({
    url: '/dashboard/analysis'
  });
}
