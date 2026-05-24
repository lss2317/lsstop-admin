/**
 * 操作日志接口
 *
 * @module apis/operation-log
 */
import request from '@/utils/http';
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
 * 删除单条操作日志
 * @param logNumber 日志编号
 */
export function fetchDeleteOperationLog(logNumber: string) {
  return request.post<void>({
    url: '/operation-log/delete',
    data: { logNumber }
  });
}

/**
 * 批量删除操作日志
 * @param params 日志编号列表
 */
export function fetchBatchDeleteOperationLog(params: BatchDeleteParams) {
  return request.post<void>({
    url: '/operation-log/batch-delete',
    data: params
  });
}
