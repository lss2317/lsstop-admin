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
