/**
 * 系统设置相关接口
 *
 * 配置表仅一条数据，因此只有「获取」与「保存」两个接口
 *
 * @module apis/setting
 */
import request from '@/utils/http';
import type { WebsiteConfigItem } from './types';

/**
 * 获取系统配置（表中仅一条数据）
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
 * 上传配置图片（网站头像、用户默认头像）
 * @param file 裁剪后的图片文件
 * @returns 图片URL
 */
export function fetchUploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<string>({
    url: '/file/upload',
    data: formData,
    showSuccessMessage: false
  });
}
