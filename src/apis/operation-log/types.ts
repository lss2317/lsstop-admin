/**
 * 操作日志接口类型定义
 *
 * @module apis/operation-log/types
 */

/** 操作日志列表项（与 blog_operation_log 表字段一一对应） */
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
  /** 操作用户ID（16位唯一标识） */
  userId: string;
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
