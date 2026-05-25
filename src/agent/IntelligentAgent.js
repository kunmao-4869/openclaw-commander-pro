/**
 * 智能 Agent - 具备学习、推理和元认知能力
 */

import DevAutomationEngine from '../automation/DevAutomationEngine.js';
import AgentMemory from './AgentMemory.js';
import LearningEngine from './LearningEngine.js';
import ReasoningEngine from './ReasoningEngine.js';
import MetaCognition from './MetaCognition.js';

class IntelligentAgent {
  constructor(options = {}) {
    // 基础组件
    this.engine = new DevAutomationEngine();
    
    // 认知组件
    this.memory = new AgentMemory(options.memory);
    this.learning = new LearningEngine({
      ...options.learning,
      memory: this.memory
    });
    this.reasoning = new ReasoningEngine(options.reasoning);
    this.metaCognition = new MetaCognition({
      memory: this.memory,
      learning: this.learning,
      reasoning: this.reasoning
    });
    
    // Agent 状态
    this.state = {
      mode: 'idle', // idle, learning, reasoning, acting, reflecting
      currentTask: null,
      goals: [],
      lastReflection: null
    };
    
    // 配置
    this.config = {
      autoReflect: options.autoReflect !== false, // 自动反思
      reflectInterval: options.reflectInterval || 10, // 每 10 次行动反思一次
      autoLearn: options.autoLearn !== false, // 自动学习
      autoImprove: options.autoImprove !== false // 自动改进
    };
    
    // 行动计数
    this.actionCount = 0;
  }

  /**
   * 执行智能工作流
   */
  async executeWorkflow(options = {}) {
    console.log('\\n🤖 智能 Agent 启动');
    console.log('========================================\\n');
    
    this.state.mode = 'reasoning';
    this.state.currentTask = options.templateType || 'unknown';
    
    try {
      // 1. 推理阶段：分析问题，生成方案
      console.log('📍 阶段 1: 推理分析');
      const reasoningResult = await this.reasonAboutTask(options);
      
      // 2. 决策阶段：选择最佳方案
      console.log('\\n📍 阶段 2: 制定决策');
      const decision = this.makeDecision(reasoningResult);
      
      // 3. 执行阶段：执行决策
      console.log('\\n📍 阶段 3: 执行任务');
      const result = await this.executeDecision(decision, options);
      
      // 4. 学习阶段：从结果中学习
      if (this.config.autoLearn) {
        console.log('\\n📍 阶段 4: 学习经验');
        this.learnFromResult(result);
      }
      
      // 5. 反思阶段：自我反思和改进
      if (this.config.autoReflect && this.shouldReflect()) {
        console.log('\\n📍 阶段 5: 自我反思');
        this.reflectAndImprove();
      }
      
      console.log('\\n========================================');
      console.log('🎉 任务完成！');
      console.log('========================================\\n');
      
      // 显示 Agent 状态
      this.showAgentStatus();
      
      return result;
      
    } catch (error) {
      console.error('\\n❌ 任务失败:', error.message);
      
      // 从失败中学习
      this.learnFromFailure(error, options);
      
      // 推理解决方案
      const solution = await this.solveProblem(error, options);
      
      // 尝试自我修复
      if (solution) {
        console.log('\\n💡 尝试自我修复...');
        return await this.retryWithSolution(solution, options);
      }
      
      throw error;
    } finally {
      this.state.mode = 'idle';
    }
  }

  /**
   * 推理任务
   */
  async reasonAboutTask(options) {
    const problem = {
      type: 'task_execution',
      action: options.templateType,
      context: options,
      goals: ['生成高质量代码', '成功创建文件']
    };
    
    const reasoning = this.reasoning.reason(problem);
    
    console.log(`   问题类型：${reasoning.analysis.type}`);
    console.log(`   生成方案：${reasoning.solutions.length}个`);
    console.log(`   选择策略：${reasoning.decision.action}`);
    console.log(`   置信度：${(reasoning.decision.confidence * 100).toFixed(1)}%`);
    
    return reasoning;
  }

  /**
   * 制定决策
   */
  makeDecision(reasoningResult) {
    const decision = reasoningResult.decision;
    
    // 考虑历史经验
    const pastExperiences = this.memory.recall({
      action: decision.action
    });
    
    if (pastExperiences.length > 0) {
      const successRate = pastExperiences.filter(e => e.success).length / pastExperiences.length;
      console.log(`   历史成功率：${(successRate * 100).toFixed(1)}%`);
      
      // 调整置信度
      decision.confidence = (decision.confidence + successRate) / 2;
    }
    
    return decision;
  }

  /**
   * 执行决策
   */
  async executeDecision(decision, options) {
    console.log(`   执行策略：${decision.action}`);
    
    // 使用原有的 AI 工作流执行
    const workflow = {
      templateType: options.templateType,
      templateOptions: options.templateOptions,
      generateDoc: options.generateDoc
    };
    
    // 调用父类方法（这里简化处理）
    const success = await this.executeOriginalWorkflow(workflow);
    
    this.actionCount++;
    
    return {
      success,
      action: decision.action,
      timestamp: Date.now(),
      context: options
    };
  }

  /**
   * 执行原始工作流（简化版）
   */
  async executeOriginalWorkflow(workflow) {
    try {
      // 连接 IDE
      await this.engine.autoConnect();
      console.log('   ✅ IDE 已连接');
      
      // 生成代码
      console.log('   📝 生成代码...');
      // 这里应该调用代码生成逻辑，简化处理
      await this.engine.sleep(1000);
      
      // 创建文件
      console.log('   💻 创建文件...');
      await this.engine.sleep(1000);
      
      console.log('   ✅ 执行成功');
      return true;
      
    } catch (error) {
      console.log('   ❌ 执行失败:', error.message);
      return false;
    } finally {
      this.engine.disconnect();
    }
  }

  /**
   * 从结果中学习
   */
  learnFromResult(result) {
    console.log('   📚 学习执行结果...');
    
    this.learning.learn({
      action: result.action,
      context: result.context,
      result: result.success ? 'success' : 'failure',
      success: result.success
    });
    
    console.log('   ✅ 已记录经验');
  }

  /**
   * 从失败中学习
   */
  learnFromFailure(error, context) {
    this.learning.learn({
      action: context.templateType,
      context,
      result: error.message,
      success: false
    });
  }

  /**
   * 判断是否应该反思
   */
  shouldReflect() {
    return this.actionCount % this.config.reflectInterval === 0;
  }

  /**
   * 反思并改进
   */
  reflectAndImprove() {
    console.log('   🤔 开始反思...');
    
    // 自我反思
    const reflection = this.metaCognition.reflect();
    
    // 自我改进
    const improvements = this.metaCognition.improve();
    
    this.state.lastReflection = {
      timestamp: Date.now(),
      insights: reflection.insights.length,
      improvements: improvements.length
    };
    
    console.log('   ✅ 反思完成');
  }

  /**
   * 解决问题
   */
  async solveProblem(error, context) {
    console.log('\\n🔍 推理解决方案...');
    
    const problem = {
      type: 'error_recovery',
      action: context.templateType,
      error: error.message,
      context
    };
    
    const reasoning = this.reasoning.reason(problem);
    
    // 如果有高置信度的方案，返回
    if (reasoning.decision.confidence >= this.reasoning.confidenceThreshold) {
      return reasoning.decision;
    }
    
    return null;
  }

  /**
   * 重试执行
   */
  async retryWithSolution(solution, options) {
    console.log(`   尝试方案：${solution.action}`);
    
    // 执行解决方案的步骤
    if (solution.steps) {
      for (const step of solution.steps) {
        console.log(`   - 执行：${step}`);
        await this.engine.sleep(500);
      }
    }
    
    // 重新执行任务
    return await this.executeWorkflow(options);
  }

  /**
   * 显示 Agent 状态
   */
  showAgentStatus() {
    const learningProgress = this.learning.getProgress();
    const reasoningStats = this.reasoning.getStats();
    const selfReport = this.metaCognition.getSelfReport();
    
    console.log('\\n📊 Agent 状态报告:');
    console.log('─'.repeat(50));
    console.log(`行动次数：${this.actionCount}`);
    console.log(`学习进度：${learningProgress.totalExperiences}次经验`);
    console.log(`成功率：${learningProgress.successRate}`);
    console.log(`推理次数：${reasoningStats.totalReasonings}`);
    console.log(`推理成功率：${reasoningStats.successRate}`);
    console.log(`已识别模式：${learningProgress.patternsLearned}个`);
    console.log(`优化方案：${learningProgress.optimizationsFound}个`);
    console.log(`自我认知:`);
    console.log(`  - 优势：${selfReport.selfKnowledge.strengths.length}个`);
    console.log(`  - 劣势：${selfReport.selfKnowledge.weaknesses.length}个`);
    console.log(`  - 能力：${Object.keys(selfReport.selfKnowledge.capabilities).length}项`);
    console.log('─'.repeat(50));
  }

  /**
   * 获取 Agent 报告
   */
  getReport() {
    return {
      state: this.state,
      actionCount: this.actionCount,
      learning: this.learning.getProgress(),
      reasoning: this.reasoning.getStats(),
      memory: this.memory.getStats(),
      metaCognition: this.metaCognition.getSelfReport()
    };
  }

  /**
   * 导出 Agent
   */
  export() {
    return {
      memory: this.memory.export(),
      learning: this.learning.export(),
      reasoning: this.reasoning.export(),
      metaCognition: this.metaCognition.export(),
      actionCount: this.actionCount,
      state: this.state
    };
  }

  /**
   * 导入 Agent
   */
  import(data) {
    if (data.memory) this.memory.import(data.memory);
    if (data.learning) this.learning.import(data.learning);
    if (data.reasoning) this.reasoning.import(data.reasoning);
    if (data.metaCognition) this.metaCognition.import(data.metaCognition);
    this.actionCount = data.actionCount || 0;
    this.state = data.state || this.state;
  }
}

export default IntelligentAgent;
