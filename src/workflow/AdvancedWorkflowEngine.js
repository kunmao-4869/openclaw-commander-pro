/**
 * 高级工作流编排器
 * 支持循环、子工作流、错误恢复、超时控制等高级功能
 */

import { WorkflowStep, ActionStep, ConditionStep, WorkflowEngine, WorkflowBuilder } from './WorkflowEngine.js';

/**
 * 循环步骤 - 重复执行直到满足条件
 */
export class LoopStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: 'loop'
    });
    this.loopSteps = config.loopSteps || []; // 循环体内的步骤
    this.condition = config.condition; // 循环继续的条件
    this.maxIterations = config.maxIterations || 10; // 最大循环次数
  }

  async execute(context) {
    console.log(`开始循环：${this.name} (最多 ${this.maxIterations} 次)`);
    
    let iteration = 0;
    const results = [];

    while (iteration < this.maxIterations) {
      // 检查循环条件
      if (this.condition && !(await this.condition(context, iteration))) {
        console.log(`循环条件不满足，终止循环 (已执行 ${iteration} 次)`);
        break;
      }

      console.log(`循环迭代 ${iteration + 1}/${this.maxIterations}`);
      
      // 执行循环体内的所有步骤
      for (const step of this.loopSteps) {
        const result = await step.execute(context);
        results.push({ iteration, step: step.id, result });
        
        if (!result.success) {
          console.error(`循环步骤失败：${step.name}`);
          return {
            success: false,
            error: `循环步骤失败：${step.name}`,
            iterations: iteration,
            results
          };
        }
      }

      iteration++;
    }

    return {
      success: true,
      iterations: iteration,
      results,
      nextStep: this.onSuccess
    };
  }
}

/**
 * 子工作流步骤 - 嵌套执行另一个工作流
 */
export class SubWorkflowStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: 'subworkflow'
    });
    this.workflowId = config.workflowId; // 子工作流 ID
    this.params = config.params || {}; // 传递给子工作流的参数
    this.workflowEngine = config.workflowEngine; // 工作流引擎实例
  }

  async execute(context) {
    console.log(`执行子工作流：${this.workflowId}`);
    
    if (!this.workflowEngine) {
      return {
        success: false,
        error: '工作流引擎未注入'
      };
    }

    try {
      // 解析参数
      const resolvedParams = {};
      for (const [key, value] of Object.entries(this.params)) {
        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          const ref = value.slice(2, -2);
          const [stepId, field] = ref.split('.');
          resolvedParams[key] = field 
            ? context.outputs[stepId]?.[field] 
            : context.outputs[stepId];
        } else {
          resolvedParams[key] = value;
        }
      }

      // 执行子工作流
      const result = await this.workflowEngine.executeWorkflow(this.workflowId, {
        ...context,
        ...resolvedParams,
        parentContext: context
      });

      return {
        success: true,
        result,
        nextStep: this.onSuccess
      };
    } catch (error) {
      console.error(`子工作流执行失败：${this.workflowId}`, error);
      return {
        success: false,
        error: error.message,
        nextStep: this.onFailure
      };
    }
  }
}

/**
 * 错误恢复步骤 - 捕获错误并执行恢复逻辑
 */
export class RecoveryStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: 'recovery'
    });
    this.primaryStep = config.primaryStep; // 主要步骤
    this.recoverySteps = config.recoverySteps || []; // 恢复步骤
    this.maxRetries = config.maxRetries || 3; // 最大重试次数
    this.retryDelay = config.retryDelay || 1000; // 重试延迟（毫秒）
  }

  async execute(context) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`执行主要步骤：${this.primaryStep.name} (尝试 ${attempt}/${this.maxRetries})`);
        
        const result = await this.primaryStep.execute(context);
        
        if (result.success) {
          console.log(`主要步骤执行成功`);
          return {
            success: true,
            result,
            attempt,
            nextStep: this.onSuccess
          };
        }
        
        lastError = new Error(result.error || '步骤执行失败');
        console.warn(`主要步骤失败，准备重试...`);
        
      } catch (error) {
        lastError = error;
        console.error(`主要步骤异常：${error.message}`);
      }

      // 如果不是最后一次尝试，等待后重试
      if (attempt < this.maxRetries) {
        console.log(`等待 ${this.retryDelay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }

    // 所有重试都失败了，执行恢复步骤
    console.log(`所有重试失败，执行恢复逻辑...`);
    
    for (const recoveryStep of this.recoverySteps) {
      try {
        const recoveryResult = await recoveryStep.execute(context);
        console.log(`恢复步骤执行：${recoveryStep.name}`, recoveryResult.success ? '成功' : '失败');
      } catch (error) {
        console.error(`恢复步骤失败：${recoveryStep.name}`, error);
      }
    }

    return {
      success: false,
      error: lastError?.message || '未知错误',
      attempts: this.maxRetries,
      nextStep: this.onFailure
    };
  }
}

/**
 * 超时控制步骤 - 为子步骤添加超时限制
 */
export class TimeoutStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: 'timeout'
    });
    this.wrappedStep = config.wrappedStep; // 被包装的步骤
    this.timeout = config.timeout || 30000; // 超时时间（毫秒）
  }

  async execute(context) {
    console.log(`执行步骤（超时 ${this.timeout}ms）：${this.wrappedStep.name}`);
    
    return new Promise((resolve) => {
      let completed = false;

      // 设置超时定时器
      const timeoutId = setTimeout(() => {
        if (!completed) {
          console.error(`步骤执行超时：${this.wrappedStep.name}`);
          completed = true;
          resolve({
            success: false,
            error: `步骤执行超时 (${this.timeout}ms)`,
            nextStep: this.onFailure
          });
        }
      }, this.timeout);

      // 执行步骤
      this.wrappedStep.execute(context)
        .then(result => {
          if (!completed) {
            clearTimeout(timeoutId);
            completed = true;
            resolve(result);
          }
        })
        .catch(error => {
          if (!completed) {
            clearTimeout(timeoutId);
            completed = true;
            resolve({
              success: false,
              error: error.message,
              nextStep: this.onFailure
            });
          }
        });
    });
  }
}

/**
 * 数据聚合步骤 - 合并多个步骤的输出
 */
export class AggregateStep extends WorkflowStep {
  constructor(config) {
    super({
      ...config,
      type: 'aggregate'
    });
    this.sourceSteps = config.sourceSteps || []; // 来源步骤 ID 列表
    this.aggregateFn = config.aggregateFn || this.defaultAggregate; // 聚合函数
  }

  defaultAggregate(outputs, sourceSteps) {
    // 默认聚合：简单合并所有输出
    const result = {};
    for (const stepId of sourceSteps) {
      if (outputs[stepId]) {
        result[stepId] = outputs[stepId];
      }
    }
    return result;
  }

  async execute(context) {
    console.log(`聚合 ${this.sourceSteps.length} 个步骤的输出`);
    
    try {
      const aggregated = this.aggregateFn(context.outputs, this.sourceSteps);
      
      context.outputs[this.id] = aggregated;
      
      return {
        success: true,
        result: aggregated,
        nextStep: this.onSuccess
      };
    } catch (error) {
      console.error(`数据聚合失败`, error);
      return {
        success: false,
        error: error.message,
        nextStep: this.onFailure
      };
    }
  }
}

/**
 * 高级工作流构建器 - 支持复杂编排
 */
export class AdvancedWorkflowBuilder extends WorkflowBuilder {
  constructor(id, name) {
    super(id, name);
    this.errorHandlers = new Map();
  }

  /**
   * 添加循环步骤
   */
  addLoop(name, loopSteps, condition, maxIterations = 10) {
    const stepId = `loop_${Date.now()}`;
    
    const step = new LoopStep({
      id: stepId,
      name,
      loopSteps,
      condition,
      maxIterations
    });
    
    this.workflow.steps.set(stepId, step);
    
    if (this.lastStepId) {
      const lastStep = this.workflow.steps.get(this.lastStepId);
      lastStep.onSuccess = stepId;
    } else {
      this.workflow.startStep = stepId;
    }
    
    this.lastStepId = stepId;
    return this;
  }

  /**
   * 添加子工作流步骤
   */
  addSubWorkflow(name, workflowId, params = {}, workflowEngine = null) {
    const stepId = `subworkflow_${Date.now()}`;
    
    const step = new SubWorkflowStep({
      id: stepId,
      name,
      workflowId,
      params,
      workflowEngine
    });
    
    this.workflow.steps.set(stepId, step);
    
    if (this.lastStepId) {
      const lastStep = this.workflow.steps.get(this.lastStepId);
      lastStep.onSuccess = stepId;
    } else {
      this.workflow.startStep = stepId;
    }
    
    this.lastStepId = stepId;
    return this;
  }

  /**
   * 添加带错误恢复的步骤
   */
  addRecoveryStep(name, primaryStep, recoverySteps = [], options = {}) {
    const stepId = `recovery_${Date.now()}`;
    
    const step = new RecoveryStep({
      id: stepId,
      name,
      primaryStep,
      recoverySteps,
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000
    });
    
    this.workflow.steps.set(stepId, step);
    
    if (this.lastStepId) {
      const lastStep = this.workflow.steps.get(this.lastStepId);
      lastStep.onSuccess = stepId;
    } else {
      this.workflow.startStep = stepId;
    }
    
    this.lastStepId = stepId;
    return this;
  }

  /**
   * 添加超时控制
   */
  addTimeout(name, wrappedStep, timeout = 30000) {
    const stepId = `timeout_${Date.now()}`;
    
    const step = new TimeoutStep({
      id: stepId,
      name,
      wrappedStep,
      timeout
    });
    
    this.workflow.steps.set(stepId, step);
    
    if (this.lastStepId) {
      const lastStep = this.workflow.steps.get(this.lastStepId);
      lastStep.onSuccess = stepId;
    } else {
      this.workflow.startStep = stepId;
    }
    
    this.lastStepId = stepId;
    return this;
  }

  /**
   * 添加数据聚合
   */
  addAggregate(name, sourceSteps, aggregateFn = null) {
    const stepId = `aggregate_${Date.now()}`;
    
    const step = new AggregateStep({
      id: stepId,
      name,
      sourceSteps,
      aggregateFn
    });
    
    this.workflow.steps.set(stepId, step);
    
    if (this.lastStepId) {
      const lastStep = this.workflow.steps.get(this.lastStepId);
      lastStep.onSuccess = stepId;
    } else {
      this.workflow.startStep = stepId;
    }
    
    this.lastStepId = stepId;
    return this;
  }

  /**
   * 为步骤注册错误处理器
   */
  onError(stepId, handler) {
    this.errorHandlers.set(stepId, handler);
    return this;
  }
}

/**
 * 高级工作流引擎 - 支持复杂编排
 */
export class AdvancedWorkflowEngine extends WorkflowEngine {
  constructor(options = {}) {
    super(options);
    this.subWorkflows = new Map();
  }

  /**
   * 注册子工作流
   */
  registerSubWorkflow(workflowId, workflow) {
    this.subWorkflows.set(workflowId, workflow);
    console.log(`✅ 子工作流已注册：${workflowId}`);
  }

  /**
   * 执行工作流（增强版）
   */
  async executeWorkflow(workflowId, initialContext = {}) {
    const workflow = this.workflows.get(workflowId) || this.subWorkflows.get(workflowId);
    
    if (!workflow) {
      throw new Error(`工作流不存在：${workflowId}`);
    }
    
    console.log(`🚀 [Advanced] 开始执行工作流：${workflow.name}`);
    
    // 注入当前引擎引用到子工作流步骤
    this.injectEngineReference(workflow);
    
    return await super.executeWorkflow(workflowId, initialContext);
  }

  /**
   * 注入引擎引用到所有子工作流步骤
   */
  injectEngineReference(workflow) {
    for (const step of workflow.steps.values()) {
      if (step instanceof SubWorkflowStep) {
        step.workflowEngine = this;
      }
    }
  }
}

// 导出工具函数
export const WorkflowUtils = {
  /**
   * 创建条件函数（字符串表达式）
   */
  createCondition(expression) {
    return async (context) => {
      // 安全的表达式求值
      const evalContext = {
        outputs: context.outputs,
        errors: context.errors,
        Math,
        Date
      };
      
      // 使用 Function 构造器安全求值
      const fn = new Function('ctx', `with(ctx) { return ${expression}; }`);
      return fn(evalContext);
    };
  },

  /**
   * 创建聚合函数
   */
  createAggregate(fn) {
    return fn;
  },

  /**
   * 创建循环条件
   */
  createLoopCondition(maxIterations, checkFn) {
    return async (context, iteration) => {
      if (iteration >= maxIterations) return false;
      return await checkFn(context, iteration);
    };
  }
};

// 导出单例
export const advancedWorkflowEngine = new AdvancedWorkflowEngine();
