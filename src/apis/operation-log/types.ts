/**
 * 操作日志接口类型定义
 *
 * @module apis/operation-log/types
 */

/** 操作日志列表项 */
export interface OperationLogItem {
  /** 日志编号 */
  logNumber: string;
  /** 操作模块 */
  module: string;
  /** 操作类型 */
  operationType: string;
  /** 操作描述 */
  description: string;
  /** 请求路径 */
  requestUrl: string;
  /** 操作用户ID */
  userId: string;
  /** 操作人员昵称 */
  nickname: string;
  /** IP地址 */
  ipAddress: string;
  /** IP归属地 */
  ipRegion: string;
  /** 浏览器 */
  browser: string;
  /** 操作系统 */
  os: string;
  /** 操作状态：0-成功 1-失败 */
  state: number;
  /** 耗时（毫秒） */
  costTime: number;
  /** 创建时间 */
  createTime: string;
  /** 请求参数 */
  requestParam: string;
  /** 返回参数 */
  responseParam: string;
  /** 错误信息 */
  errorMsg?: string;
}

/** 操作日志列表搜索参数 */
export interface OperationLogSearchParams {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 系统模块（模糊搜索） */
  module?: string;
  /** 操作类型 */
  operationType?: string;
  /** 用户ID */
  userId?: string;
}

/** 操作日志列表响应 */
export interface OperationLogListResponse {
  /** 记录列表 */
  records: OperationLogItem[];
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 总条数 */
  total: number;
}

/** 批量删除请求参数 */
export interface BatchDeleteParams {
  /** 日志编号列表 */
  logNumbers: string[];
}
