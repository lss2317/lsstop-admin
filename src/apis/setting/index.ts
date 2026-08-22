/**
 * 系统设置相关接口
 *
 * @module apis/setting
 */
import request from '@/utils/http';
import type { WebsiteConfigItem } from './types';

/**
 * 获取系统配置
 */
export function fetchSettingInfo() {
  return request.get<WebsiteConfigItem | null>({
    url: '/setting/info',
    showSuccessMessage: false
  });
}

/**
 * 保存系统配置
 * @param data 配置信息
 */
export function fetchUpdateSetting(data: WebsiteConfigItem) {
  return request.put<void>({
    url: '/setting/update',
    data
  });
}
