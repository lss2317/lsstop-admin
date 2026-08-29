/**
 * 公告相关接口
 *
 * @module apis/announcement
 */
import request from '@/utils/http';
import type { AnnouncementListResponse, AnnouncementSearchParams } from './types';

/**
 * 获取后台公告列表（分页）
 * @param params 搜索与分页参数
 */
export function fetchAnnouncementList(params: AnnouncementSearchParams) {
  return request.get<AnnouncementListResponse>({
    url: '/announcement/list',
    params
  });
}
