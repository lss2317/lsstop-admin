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

/**
 * 上传网站配置图片
 * @param file 图片文件
 * @returns 图片访问URL
 */
export function fetchUploadWebsiteConfigImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<string>({
    url: '/file/website-config',
    data: formData,
    showSuccessMessage: false
  });
}
