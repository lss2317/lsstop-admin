/**
 * 认证日志接口类型定义
 *
 * @module apis/login-log/types
 */

/** 认证日志列表项 */
export interface LoginLogItem {
  /** 日志编号 */
  logNumber: string;
  /** 用户ID */
  userId: string;
  /** 用户昵称 */
  nickname: string;
  /** 登录方式：1-邮箱 2-QQ 3-微博，退出登录时为null */
  loginType?: number;
  /** 操作时间 */
  loginTime: string;
  /** 登录IP */
  ipAddress: string;
  /** IP所在地 */
  ipRegion: string;
  /** 浏览器 */
  browser: string;
  /** 操作系统 */
  os: string;
  /** 操作来源：0-前台 1-后台 2-非法 */
  type: number;
  /** 操作结果：0-成功 1-失败 */
  state: number;
  /** 操作类型：1-登录 2-退出 3-注册 */
  actionType: number;
  /** 操作标识（登录时为邮箱/openId/uid，退出时为null） */
  loginIdentifier?: string;
  /** 操作信息（如：登录成功、注册成功、退出登录） */
  message: string;
}

/** 认证日志列表搜索参数 */
export interface LoginLogSearchParams {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 用户ID（模糊搜索） */
  userId?: string;
  /** 操作类型：1-登录 2-退出 3-注册 */
  actionType?: number;
  /** 操作结果：0-成功 1-失败 */
  state?: number;
  /** 操作来源：0-前台 1-后台 2-非法 */
  type?: number;
  /** 登录方式：1-邮箱 2-QQ 3-微博 */
  loginType?: number;
  /** 仅筛无用户ID的记录 */
  noUserId?: boolean;
}

/** 认证日志列表响应 */
export interface LoginLogListResponse {
  /** 记录列表 */
  records: LoginLogItem[];
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  size: number;
  /** 总条数 */
  total: number;
}

/** 批量删除请求参数 */
export interface LoginLogBatchDeleteParams {
  /** 日志编号列表 */
  logNumbers: string[];
}
