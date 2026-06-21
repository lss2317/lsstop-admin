/**
 * 操作日志接口
 *
 * @module apis/operation-log
 */
import request, { axiosInstance } from '@/utils/http';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import type {
  OperationLogSearchParams,
  OperationLogListResponse,
  BatchDeleteParams
} from './types';

/**
 * 获取操作日志列表（分页）
 * @param params 搜索与分页参数
 */
export function fetchOperationLogList(params: OperationLogSearchParams) {
  return request.get<OperationLogListResponse>({
    url: '/operation-log/list',
    params
  });
}

/**
 * 删除操作日志（支持单条/批量）
 * @param params 日志编号列表
 */
export function fetchDeleteOperationLog(params: BatchDeleteParams) {
  return request.post<void>({
    url: '/operation-log/delete',
    data: params
  });
}

/**
 * 导出操作日志（后端生成 Excel，返回 Blob）
 * 失败时弹出后端返回的错误提示，返回 null
 * @param params 搜索参数（不含分页）
 */
export async function fetchOperationLogExport(
  params: Omit<OperationLogSearchParams, 'current' | 'size'>
): Promise<Blob | null> {
  try {
    const res = await axiosInstance.get('/operation-log/export', {
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
