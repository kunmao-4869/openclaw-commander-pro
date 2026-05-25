/**
 * Skill 系统核心架构
 * 插件化、可扩展、深度化的技能系统
 */

/**
 * Skill 基类
 * 所有技能都需要继承这个类
 */
export class Skill {
  constructor(config) {
    this.name = config.name
    this.description = config.description
    this.category = config.category
    this.parameters = config.parameters
    this.permissions = config.permissions || []
    this.enabled = true
  }
  
  /**
   * 验证参数
   */
  validateParams(args) {
    for (const [key, value] of Object.entries(args)) {
      const param = this.parameters[key]
      if (!param) continue
      
      if (param.required && value === undefined) {
        throw new Error(`缺少必需参数：${key}`)
      }
      
      if (value !== undefined && param.type) {
        const actualType = typeof value
        if (actualType !== param.type) {
          throw new Error(`参数 ${key} 类型错误，期望 ${param.type}，得到 ${actualType}`)
        }
      }
    }
    return true
  }
  
  /**
   * 执行技能（子类必须实现）
   */
  async execute(args) {
    throw new Error('子类必须实现 execute 方法')
  }
  
  /**
   * 获取技能定义（用于 LLM）
   */
  getDefinition() {
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: 'object',
          properties: this.parameters,
          required: Object.keys(this.parameters).filter(k => this.parameters[k].required)
        }
      }
    }
  }
}

/**
 * 技能管理器
 * 管理所有技能的注册、加载、执行
 */
export class SkillManager {
  constructor() {
    this.skills = new Map()
    this.categories = new Map()
    this.plugins = new Map()
  }
  
  /**
   * 注册技能
   */
  registerSkill(skill) {
    if (!(skill instanceof Skill)) {
      throw new Error('必须注册 Skill 实例')
    }
    
    this.skills.set(skill.name, skill)
    
    // 添加到分类
    if (!this.categories.has(skill.category)) {
      this.categories.set(skill.category, [])
    }
    this.categories.get(skill.category).push(skill.name)
    
    console.log(`✅ 技能已注册：${skill.name} (${skill.category})`)
  }
  
  /**
   * 批量注册技能
   */
  registerSkills(skillList) {
    skillList.forEach(skill => this.registerSkill(skill))
  }
  
  /**
   * 获取技能
   */
  getSkill(name) {
    return this.skills.get(name)
  }
  
  /**
   * 执行技能
   */
  async executeSkill(name, args) {
    const skill = this.getSkill(name)
    
    if (!skill) {
      throw new Error(`技能不存在：${name}`)
    }
    
    if (!skill.enabled) {
      throw new Error(`技能已禁用：${name}`)
    }
    
    // 验证参数
    skill.validateParams(args)
    
    // 执行技能
    try {
      const result = await skill.execute(args)
      return {
        success: true,
        data: result,
        skill: name,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        skill: name,
        timestamp: new Date().toISOString()
      }
    }
  }
  
  /**
   * 获取所有技能定义
   */
  getAllDefinitions() {
    return Array.from(this.skills.values())
      .filter(skill => skill.enabled)
      .map(skill => skill.getDefinition())
  }
  
  /**
   * 按分类获取技能
   */
  getSkillsByCategory(category) {
    const skillNames = this.categories.get(category) || []
    return skillNames.map(name => this.getSkill(name))
  }
  
  /**
   * 获取所有分类
   */
  getCategories() {
    return Array.from(this.categories.keys())
  }
  
  /**
   * 启用/禁用技能
   */
  toggleSkill(name, enabled) {
    const skill = this.getSkill(name)
    if (skill) {
      skill.enabled = enabled
      console.log(`技能 ${name} 已${enabled ? '启用' : '禁用'}`)
    }
  }
  
  /**
   * 加载插件
   */
  loadPlugin(plugin) {
    if (plugin.register) {
      plugin.register(this)
      this.plugins.set(plugin.name, plugin)
      console.log(`✅ 插件已加载：${plugin.name}`)
    }
  }
}

// 导出单例
export const skillManager = new SkillManager()
