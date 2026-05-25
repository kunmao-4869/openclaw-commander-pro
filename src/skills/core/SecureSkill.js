/**
 * 安全技能基类
 * 所有技能必须继承此类，确保安全性
 */

export class SecureSkill {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.isSafe = config.isSafe !== false; // 默认安全
    this.requiresConfirmation = config.requiresConfirmation || false;
    this.readOnly = config.readOnly !== false; // 默认只读
  }

  /**
   * 执行技能（必须由子类实现）
   * @param {object} params - 参数
   * @returns {Promise<any>} 执行结果
   */
  async execute(params) {
    throw new Error('子类必须实现 execute 方法');
  }

  /**
   * 验证参数
   * @param {object} params - 待验证参数
   * @returns {{valid: boolean, error?: string}}
   */
  validate(params) {
    return { valid: true };
  }

  /**
   * 检查路径是否安全（防止访问敏感目录）
   * @param {string} path - 文件路径
   * @returns {boolean}
   */
  isPathSafe(path) {
    if (!path) return false;
    
    // 禁止访问的目录
    const forbiddenPaths = [
      '/etc/',
      '/proc/',
      '/sys/',
      '/root/',
      '/boot/',
      'C:\\Windows\\',
      'C:\\Program Files\\',
      'C:\\Program Files (x86)\\',
      'C:\\Users\\Administrator\\',
    ];

    const normalizedPath = path.toLowerCase().replace(/\\/g, '/');
    
    for (const forbidden of forbiddenPaths) {
      if (normalizedPath.includes(forbidden.toLowerCase())) {
        console.warn(`[安全警告] 尝试访问禁止路径：${path}`);
        return false;
      }
    }

    return true;
  }

  /**
   * 日志记录
   * @param {string} action - 操作
   * @param {object} params - 参数
   * @param {any} result - 结果
   */
  log(action, params, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      skill: this.name,
      action,
      params: this.sanitizeParams(params),
      success: result !== undefined,
    };
    
    // 只在开发环境输出详细日志
    if (process.env.NODE_ENV === 'development') {
      console.log('[Skill Log]', logEntry);
    }
    
    return logEntry;
  }

  /**
   * 清理敏感参数
   * @param {object} params - 原始参数
   * @returns {object} 清理后的参数
   */
  sanitizeParams(params) {
    if (!params) return {};
    
    const sensitive = ['password', 'secret', 'token', 'key', 'auth'];
    const sanitized = { ...params };
    
    for (const key of sensitive) {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}
