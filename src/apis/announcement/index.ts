/**
 * 公告相关接口
 *
 * @module apis/announcement
 */
import request from '@/utils/http';
import type {
  AnnouncementListResponse,
  AnnouncementPayload,
  AnnouncementSearchParams,
  UpdateAnnouncementPayload
} from './types';

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

/**
 * 新增公告
 * @param data 公告表单数据
 */
export function fetchAddAnnouncement(data: AnnouncementPayload) {
  return request.post<void>({
    url: '/announcement/add',
    data
  });
}

/**
 * 编辑公告
 * @param data 公告表单数据
 */
export function fetchUpdateAnnouncement(data: UpdateAnnouncementPayload) {
  return request.put<void>({
    url: '/announcement/update',
    data
  });
}

/**
 * 删除公告
 * @param id 公告ID
 */
export function fetchDeleteAnnouncement(id: number) {
  return request.del<void>({
    url: `/announcement/delete/${id}`
  });
}
