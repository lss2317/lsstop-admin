export class StorageConfig {
  /** 存储键前缀 */
  static readonly STORAGE_PREFIX = 'lsstop-';

  /** 主题键名（index.html中使用了，如果修改，需要同步修改） */
  static readonly THEME_KEY = 'lsstop-theme';

  /** 访问令牌键名 */
  static readonly ACCESS_TOKEN_KEY = 'lsstop-access-token';

  /** 刷新令牌键名 */
  static readonly REFRESH_TOKEN_KEY = 'lsstop-refresh-token';

  /** 工作标签页状态持久化键名 */
  static readonly WORKTAB_KEY = 'lsstop-worktab';

  /** 响应式布局切换时暂存桌面端菜单类型 */
  static readonly RESPONSIVE_MENU_TYPE_KEY = 'lsstop-responsive-menu-type';

  /** 记住密码-邮箱 */
  static readonly REMEMBER_EMAIL_KEY = 'lsstop-remember-email';

  /** 记住密码-密码 */
  static readonly REMEMBER_PASSWORD_KEY = 'lsstop-remember-password';

  /**
   * 生成存储键名
   * @param storeId 存储ID
   */
  static generateStorageKey(storeId: string): string {
    return `${this.STORAGE_PREFIX}${storeId}`;
  }

  /**
   * 创建存储键匹配的正则表达式
   * @param storeId 存储ID
   */
  static createKeyPattern(storeId: string): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}${storeId}$`);
  }
}
