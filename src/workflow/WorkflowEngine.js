/**
 * 工作流引擎核心
 * 支持顺序执行、条件分支、并行执行、错误处理
 */

/**
 * 工作流步骤类型
 */
export const StepType = {
  ACTION: 'action',      // 执行动作
  CONDITION: 'condition', // 条件判断
  PARALLEL: 'parallel',   // 并行执行
  LOOP: 'loop',          // 循环
  WAIT: 'wait'           // 等待
}

/**
 * 工作流步骤基类
 */
export class WorkflowStep {
  constructor(config) {
    this.id = config.id || `step_${Date.now()}`
    this.name = config.name
    this.type = config.type
    this.description = config.description
    this.onSuccess = config.onSuccess // 下一步 ID
    this.onFailure = config.onFailure // 失败时下一步 ID
  }
  
  /**
   * 执行步骤（子类实现）
   */
  async execute(context) {
    throw new Error('子类必须实现 execute 方法')
  }
  
  /**
   * 获取步骤定义
   */
  getDefinition() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      description: this.description
    }
  }
}

/**
 * 动作步骤 - 执行技能或函数
 */
export class ActionStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: StepType.ACTION
    })
    this.action = config.action // 技能名称或函数
    this.params = config.params || {}
    this.transformOutput = config.transformOutput // 输出转换函数
  }
  
  async execute(context) {
    try {
      console.log(`执行动作：${this.name}`)
      
      // 解析参数（支持引用之前的输出）
      const resolvedParams = this.resolveParams(context)
      
      // 执行动作
      let result
      if (typeof this.action === 'function') {
        result = await this.action(resolvedParams, context)
      } else {
        // 假设是技能名称
        result = await context.executeSkill(this.action, resolvedParams)
      }
      
      // 转换输出
      if (this.transformOutput) {
        result = this.transformOutput(result, context)
      }
      
      // 存储结果到上下文
      context.outputs[this.id] = result
      
      return {
        success: true,
        result,
        nextStep: this.onSuccess
      }
    } catch (error) {
      console.error(`动作失败：${this.name}`, error)
      context.errors[this.id] = error
      
      return {
        success: false,
        error: error.message,
        nextStep: this.onFailure
      }
    }
  }
  
  /**
   * 解析参数（支持引用）
   */
  resolveParams(context) {
    const resolved = {}
    
    for (const [key, value] of Object.entries(this.params)) {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        // 引用之前的输出：{{step_id.output_field}}
        const ref = value.slice(2, -2)
        const [stepId, field] = ref.split('.')
        
        if (context.outputs[stepId]) {
          resolved[key] = field 
            ? context.outputs[stepId][field]
            : context.outputs[stepId]
        } else {
          resolved[key] = value // 保持原值
        }
      } else {
        resolved[key] = value
      }
    }
    
    return resolved
  }
}

/**
 * 条件步骤 - 根据条件分支
 */
export class ConditionStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: StepType.CONDITION
    })
    this.condition = config.condition // 条件函数
    this.branches = config.branches || {} // { true: stepId, false: stepId }
  }
  
  async execute(context) {
    try {
      console.log(`评估条件：${this.name}`)
      
      const result = await this.condition(context)
      const branch = result ? 'true' : 'false'
      
      return {
        success: true,
        result,
        nextStep: this.branches[branch]
      }
    } catch (error) {
      console.error(`条件评估失败：${this.name}`, error)
      
      return {
        success: false,
        error: error.message,
        nextStep: this.onFailure
      }
    }
  }
}

/**
 * 并行步骤 - 同时执行多个子步骤
 */
export class ParallelStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: StepType.PARALLEL
    })
    this.steps = config.steps || [] // 子步骤数组
  }
  
  async execute(context) {
    try {
      console.log(`并行执行 ${this.steps.length} 个步骤`)
      
      const results = await Promise.all(
        this.steps.map(step => step.execute(context))
      )
      
      const success = results.every(r => r.success)
      
      return {
        success,
        results,
        nextStep: this.onSuccess
      }
    } catch (error) {
      console.error(`并行执行失败：${this.name}`, error)
      
      return {
        success: false,
        error: error.message,
        nextStep: this.onFailure
      }
    }
  }
}

/**
 * 等待步骤 - 延迟执行
 */
export class WaitStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: StepType.WAIT
    })
    this.duration = config.duration || 1000 // 毫秒
  }
  
  async execute(context) {
    console.log(`等待 ${this.duration}ms`)
    
    await new Promise(resolve => setTimeout(resolve, this.duration))
    
    return {
      success: true,
      nextStep: this.onSuccess
    }
  }
}

/**
 * 工作流执行引擎
 */
export class WorkflowEngine {
  constructor(options = {}) {
    this.workflows = new Map()
    this.executing = new Map()
    
    // 注入技能管理器（从外部传入）
    this.skillManager = options.skillManager || null
    
    // 默认技能执行器
    this.executeSkill = options.executeSkill || this.defaultExecuteSkill.bind(this)
  }
  
  /**
   * 注册工作流
   */
  registerWorkflow(workflow) {
    this.workflows.set(workflow.id, workflow)
    console.log(`✅ 工作流已注册：${workflow.name}`)
  }
  
  /**
   * 执行工作流
   */
  async executeWorkflow(workflowId, initialContext = {}) {
    const workflow = this.workflows.get(workflowId)
    
    if (!workflow) {
      throw new Error(`工作流不存在：${workflowId}`)
    }
    
    console.log(`🚀 开始执行工作流：${workflow.name}`)
    
    // 使用外部传入的 executeSkill 或者默认的
    const executeSkillFn = initialContext.executeSkill || this.executeSkill.bind(this)
    
    const context = {
      workflowId,
      startTime: Date.now(),
      outputs: {},
      errors: {},
      currentStep: null,
      ...initialContext,
      executeSkill: executeSkillFn
    }
    
    this.executing.set(workflowId, { status: 'running', context })
    
    try {
      // 从第一步开始执行
      let currentStepId = workflow.startStep
      let stepCount = 0
      const maxSteps = 100 // 防止无限循环
      
      while (currentStepId && stepCount < maxSteps) {
        const step = workflow.steps.get(currentStepId)
        
        if (!step) {
          throw new Error(`步骤不存在：${currentStepId}`)
        }
        
        context.currentStep = step.id
        stepCount++
        
        console.log(`📍 执行步骤 ${stepCount}: ${step.name}`)
        
        // 执行步骤
        const result = await step.execute(context)
        
        // 记录执行历史
        context.history = context.history || []
        context.history.push({
          stepId: step.id,
          stepName: step.name,
          success: result.success,
          timestamp: Date.now()
        })
        
        // 确定下一步
        currentStepId = result.nextStep
      }
      
      if (stepCount >= maxSteps) {
        throw new Error('超过最大步骤数，可能陷入无限循环')
      }
      
      // 执行完成
      const executionResult = {
        success: true,
        workflowId,
        workflowName: workflow.name,
        duration: Date.now() - context.startTime,
        stepsExecuted: stepCount,
        outputs: context.outputs,
        errors: context.errors
      }
      
      this.executing.set(workflowId, { status: 'completed', result: executionResult })
      
      console.log(`✅ 工作流完成：${workflow.name} (${stepCount} 步，${executionResult.duration}ms)`)
      
      return executionResult
    } catch (error) {
      console.error(`❌ 工作流失败：${workflow.name}`, error)
      
      const executionResult = {
        success: false,
        workflowId,
        workflowName: workflow.name,
        duration: Date.now() - context.startTime,
        error: error.message
      }
      
      this.executing.set(workflowId, { status: 'failed', error })
      
      throw error
    }
  }
  
  /**
   * 默认技能执行器
   */
  async defaultExecuteSkill(skillName, params) {
    console.log(`[WorkflowEngine] 执行技能：${skillName}`, params)

    // 如果注入了 skillManager，使用它执行
    if (this.skillManager) {
      try {
        const result = await this.skillManager.executeSkill(skillName, params)
        return {
          success: true,
          result,
          skill: skillName
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
          skill: skillName
        }
      }
    }

    // 否则返回模拟结果
    return {
      success: true,
      message: '技能执行器未注入',
      skill: skillName,
      params
    }
  }
  
  /**
   * 执行技能（由外部提供）
   */
  async executeSkill(skillName, params) {
    // 这个方法由外部注入或默认实现
    return this.defaultExecuteSkill(skillName, params)
  }
  
  /**
   * 获取执行状态
   */
  getExecutionStatus(workflowId) {
    return this.executing.get(workflowId)
  }
}

/**
 * 工作流构建器 - 流式 API
 */
export class WorkflowBuilder {
  constructor(id, name) {
    this.workflow = {
      id,
      name,
      description: '',
      startStep: null,
      steps: new Map()
    }
    this.lastStepId = null
  }
  
  /**
   * 添加描述
   */
  withDescription(desc) {
    this.workflow.description = desc
    return this
  }
  
  /**
   * 添加动作步骤
   */
  addAction(name, action, params = {}) {
    const stepId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const step = new ActionStep({
      id: stepId,
      name,
      action,
      params
    })
    
    this.workflow.steps.set(stepId, step)
    
    // 连接上一步
    if (this.lastStepId) {
      const lastStep = this.workflow.steps.get(this.lastStepId)
      lastStep.onSuccess = stepId
    } else {
      this.workflow.startStep = stepId
    }
    
    this.lastStepId = stepId
    return this
  }
  
  /**
   * 添加条件步骤
   */
  addCondition(name, condition, trueStepId, falseStepId) {
    const stepId = `condition_${Date.now()}`
    
    const step = new ConditionStep({
      id: stepId,
      name,
      condition,
      branches: {
        true: trueStepId,
        false: falseStepId
      }
    })
    
    this.workflow.steps.set(stepId, step)
    
    if (this.lastStepId) {
      const lastStep = this.workflow.steps.get(this.lastStepId)
      lastStep.onSuccess = stepId
    } else {
      this.workflow.startStep = stepId
    }
    
    this.lastStepId = stepId
    return this
  }
  
  /**
   * 添加等待步骤
   */
  addWait(duration) {
    const stepId = `wait_${Date.now()}`
    
    const step = new WaitStep({
      id: stepId,
      name: `等待 ${duration}ms`,
      duration
    })
    
    this.workflow.steps.set(stepId, step)
    
    if (this.lastStepId) {
      const lastStep = this.workflow.steps.get(this.lastStepId)
      lastStep.onSuccess = stepId
    }
    
    this.lastStepId = stepId
    return this
  }
  
  /**
   * 完成构建
   */
  build() {
    return this.workflow
  }
}

// 导出单例
export const workflowEngine = new WorkflowEngine()
