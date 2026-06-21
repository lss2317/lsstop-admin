/**
 * 认证日志接口
 *
 * @module apis/login-log
 */
import request, { axiosInstance } from '@/utils/http';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import type {
  LoginLogSearchParams,
  LoginLogListResponse,
  LoginLogBatchDeleteParams
} from './types';

/**
 * 获取认证日志列表（分页）
 * @param params 搜索与分页参数
 */
export function fetchLoginLogList(params: LoginLogSearchParams) {
  return request.get<LoginLogListResponse>({
    url: '/login-log/list',
    params
  });
}

/**
 * 删除认证日志（支持单条/批量）
 * @param params 日志编号列表
 */
export function fetchDeleteLoginLog(params: LoginLogBatchDeleteParams) {
  return request.post<void>({
    url: '/login-log/delete',
    data: params
  });
}

/**
 * 导出认证日志（后端生成 Excel，返回 Blob）
 * 失败时弹出后端返回的错误提示，返回 null
 * @param params 搜索参数（不含分页）
 */
export async function fetchLoginLogExport(
  params: Omit<LoginLogSearchParams, 'current' | 'size'>
): Promise<Blob | null> {
  try {
    const res = await axiosInstance.get('/login-log/export', {
      params,
      responseType: 'blob'
    });
    if (res.data.type === 'application/json') {
      const text = await res.data.text();
      const json = JSON.parse(text);
      ElMessage.error(json.msg);
      return null;
    }
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      const text = await error.response.data.text();
      const json = JSON.parse(text);
      ElMessage.error(json.msg);
    }
    return null;
  }
}
