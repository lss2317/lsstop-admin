/**
 * API 接口类型定义模块
 *
 * 提供所有后端接口的类型定义
 *
 * ## 主要功能
 *
 * - 通用类型（分页参数、响应结构等）
 * - 系统管理类型（用户、角色等）
 * - 全局命名空间声明
 *
 * ## 使用场景
 *
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 接口文档类型同步
 *
 * ## 使用方式
 *
 * ```typescript
 * import type { PaginationParams, CommonSearchParams } from '@/types/common';
 * const params: PaginationParams = { current: 1, size: 10, total: 100 }
 * ```
 *
 * @module types/api/api
 * @author Art Design Pro Team
 */

declare namespace Api {
  /** 通用类型 */
  namespace Common {
    /** 分页参数 */
    interface PaginationParams {
      /** 当前页码 */
      current: number;
      /** 每页条数 */
      size: number;
      /** 总条数 */
      total: number;
    }

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<PaginationParams, 'current' | 'size'>;

    /** 分页响应基础结构 */
    interface PaginatedResponse<T = any> {
      records: T[];
      current: number;
      size: number;
      total: number;
    }

    /** 启用状态 */
    type EnableStatus = '1' | '2';
  }
}
