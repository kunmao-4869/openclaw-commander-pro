/**
 * 全局技能执行器
 * 统一管理所有技能的注册和执行，前后端共享
 */

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;

export class SkillExecutor {
  constructor() {
    this.skills = new Map();
    this.initialized = false;
  }

  /**
   * 注册技能
   * @param {string} name - 技能名称
   * @param {object} instance - 技能实例
   */
  registerSkill(name, instance) {
    if (!name || !instance) {
      console.error(`[SkillExecutor] 注册失败：技能名称或实例为空`, { name, instance });
      return false;
    }

    if (this.skills.has(name)) {
      console.warn(`[SkillExecutor] 技能 ${name} 已存在，将被覆盖`);
    }

    this.skills.set(name, {
      instance,
      registeredAt: new Date().toISOString(),
      isAsync: instance.execute.constructor.name === 'AsyncFunction'
    });

    console.log(`[SkillExecutor] ✅ 技能已注册：${name}`);
    return true;
  }

  /**
   * 批量注册技能
   * @param {Array} skills - 技能数组 [{name, instance}]
   */
  registerSkills(skills) {
    const results = [];
    for (const { name, instance } of skills) {
      results.push({
        name,
        success: this.registerSkill(name, instance)
      });
    }
    return results;
  }

  /**
   * 执行技能
   * @param {string} name - 技能名称
   * @param {object} params - 技能参数
   * @returns {Promise<any>} 技能执行结果
   */
  async execute(name, params = {}) {
    if (!this.skills.has(name)) {
      const error = new Error(`技能不存在：${name}`);
      error.code = 'SKILL_NOT_FOUND';
      throw error;
    }

    const skillData = this.skills.get(name);
    const skillInstance = skillData.instance;

    try {
      console.log(`[SkillExecutor] 🚀 执行技能：${name}`, { params });
      
      const result = await skillInstance.execute(params);
      
      console.log(`[SkillExecutor] ✅ 技能执行成功：${name}`);
      return result;
    } catch (error) {
      console.error(`[SkillExecutor] ❌ 技能执行失败：${name}`, error);
      error.code = 'SKILL_EXECUTION_ERROR';
      error.skillName = name;
      throw error;
    }
  }

  /**
   * 获取技能信息
   * @param {string} name - 技能名称
   * @returns {object|null} 技能信息
   */
  getSkillInfo(name) {
    if (!this.skills.has(name)) {
      return null;
    }

    const skillData = this.skills.get(name);
    return {
      name,
      registeredAt: skillData.registeredAt,
      isAsync: skillData.isAsync,
      hasInstance: !!skillData.instance
    };
  }

  /**
   * 获取所有已注册的技能列表
   * @returns {Array<string>} 技能名称列表
   */
  getRegisteredSkills() {
    return Array.from(this.skills.keys());
  }

  /**
   * 检查技能是否已注册
   * @param {string} name - 技能名称
   * @returns {boolean} 是否已注册
   */
  hasSkill(name) {
    return this.skills.has(name);
  }

  /**
   * 获取技能数量
   * @returns {number} 技能数量
   */
  getSkillCount() {
    return this.skills.size;
  }

  /**
   * 清空所有技能（用于测试或重新加载）
   */
  clearSkills() {
    console.log(`[SkillExecutor] 🗑️ 清空所有技能，当前数量：${this.skills.size}`);
    this.skills.clear();
    this.initialized = false;
  }

  /**
   * 初始化标记
   */
  markAsInitialized() {
    this.initialized = true;
    console.log(`[SkillExecutor] ✅ 初始化完成，已注册 ${this.skills.size} 个技能`);
  }

  /**
   * 检查是否已初始化
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * 导出技能状态（用于调试）
   */
  exportState() {
    const skills = [];
    for (const [name, data] of this.skills.entries()) {
      skills.push({
        name,
        registeredAt: data.registeredAt,
        isAsync: data.isAsync
      });
    }
    return {
      initialized: this.initialized,
      skillCount: this.skills.size,
      skills
    };
  }
}

/**
 * 创建全局单例实例
 */
export const skillExecutor = new SkillExecutor();

/**
 * 便捷函数：注册技能
 */
export function registerSkill(name, instance) {
  return skillExecutor.registerSkill(name, instance);
}

/**
 * 便捷函数：执行技能
 */
export async function executeSkill(name, params) {
  return skillExecutor.execute(name, params);
}

/**
 * 便捷函数：获取已注册技能列表
 */
export function getRegisteredSkills() {
  return skillExecutor.getRegisteredSkills();
}

// 默认导出
export default skillExecutor;
