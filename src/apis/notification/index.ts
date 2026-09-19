/**
 * 系统通知相关接口。
 *
 * @module apis/notification
 */
import request from '@/utils/http';
import type { NotificationDetail, NotificationListParams, NotificationListResponse } from './types';

/** 获取通知分页列表 */
export function fetchNotificationList(params: NotificationListParams) {
  return request.get<NotificationListResponse>({
    url: '/notification/list',
    params
  });
}

/**
 * 获取右上角未读通知。
 *
 * <p>列表总数就是未读角标数量；后台轮询失败时保持静默并保留上一次数据。</p>
 */
export function fetchUnreadNotificationList(size = 8) {
  return request.get<NotificationListResponse>({
    url: '/notification/list',
    params: { current: 1, size, readStatus: 0 },
    showErrorMessage: false
  });
}

/** 获取通知详情 */
export function fetchNotificationDetail(notificationNo: string) {
  return request.get<NotificationDetail>({
    url: `/notification/detail/${notificationNo}`
  });
}

/** 将单条通知标记为已读 */
export function fetchMarkNotificationRead(notificationNo: string) {
  return request.put<void>({
    url: `/notification/read/${notificationNo}`
  });
}

/** 将全部未读通知标记为已读 */
export function fetchMarkAllNotificationsRead() {
  return request.put<void>({
    url: '/notification/read-all'
  });
}
