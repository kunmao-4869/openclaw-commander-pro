/**
 * Agent 学习引擎
 * 从经验中学习，不断优化行为
 */

import AgentMemory from './AgentMemory.js';

class LearningEngine {
  constructor(options = {}) {
    this.memory = new AgentMemory(options);
    
    // 学习率
    this.learningRate = options.learningRate || 0.1;
    
    // 探索率（尝试新方法的概率）
    this.explorationRate = options.explorationRate || 0.2;
    
    // 行为策略
    this.strategies = {};
    
    // 学习历史
    this.learningHistory = [];
    
    // 优化目标
    this.optimizationGoals = {
      minimizeFailures: true,
      maximizeSuccess: true,
      reduceTime: false,
      improveQuality: true
    };
  }

  /**
   * 从经验中学习
   */
  learn(experience) {
    console.log('📚 学习新经验...');
    
    // 记录到记忆
    const memoryId = this.memory.remember(experience);
    
    // 分析经验
    const analysis = this.analyzeExperience(experience);
    
    // 更新策略
    this.updateStrategy(experience, analysis);
    
    // 记录学习历史
    this.learningHistory.push({
      timestamp: Date.now(),
      action: experience.action,
      success: experience.success,
      improvement: analysis.improvement
    });
    
    console.log(`   ✅ 已学习：${experience.action} - ${experience.success ? '成功' : '失败'}`);
    
    return memoryId;
  }

  /**
   * 分析经验
   */
  analyzeExperience(experience) {
    const { action, context, result, success } = experience;
    
    // 成功分析
    if (success) {
      return {
        type: 'success',
        keyFactors: this.extractKeyFactors(context),
        improvement: 0.1, // 正向强化
        pattern: this.identifyPattern(experience)
      };
    }
    
    // 失败分析
    return {
      type: 'failure',
      rootCause: this.memory.analyzeFailure(experience),
      improvement: -0.2, // 负向强化
      suggestions: this.generateSuggestions(experience)
    };
  }

  /**
   * 提取关键因素
   */
  extractKeyFactors(context) {
    const factors = [];
    
    // 分析上下文中的关键信息
    for (const [key, value] of Object.entries(context)) {
      if (value !== null && value !== undefined) {
        factors.push({
          key,
          value,
          importance: this.calculateImportance(key, value)
        });
      }
    }
    
    return factors.sort((a, b) => b.importance - a.importance).slice(0, 3);
  }

  /**
   * 计算重要性
   */
  calculateImportance(key, value) {
    // 简单的重要性计算
    const importantKeys = ['ide', 'template', 'filename', 'content'];
    
    if (importantKeys.includes(key)) {
      return 1.0;
    }
    
    if (typeof value === 'object' && Object.keys(value).length > 0) {
      return 0.5;
    }
    
    return 0.2;
  }

  /**
   * 识别模式
   */
  identifyPattern(experience) {
    const { action, context } = experience;
    
    // 查找类似的经验
    const similarExperiences = this.memory.recall({ action });
    
    if (similarExperiences.length < 3) {
      return null;
    }
    
    // 提取共同特征
    const commonFeatures = {};
    similarExperiences.forEach(exp => {
      for (const [key, value] of Object.entries(exp.context || {})) {
        if (!commonFeatures[key]) {
          commonFeatures[key] = [];
        }
        commonFeatures[key].push(value);
      }
    });
    
    // 找出最常见的特征
    const pattern = {};
    for (const [key, values] of Object.entries(commonFeatures)) {
      const mostCommon = this.getMostCommon(values);
      if (mostCommon) {
        pattern[key] = mostCommon;
      }
    }
    
    return pattern;
  }

  /**
   * 获取最常见的值
   */
  getMostCommon(values) {
    const counts = {};
    values.forEach(v => {
      const str = JSON.stringify(v);
      counts[str] = (counts[str] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(counts));
    const mostCommon = Object.keys(counts).find(k => counts[k] === maxCount);
    
    return mostCommon ? JSON.parse(mostCommon) : null;
  }

  /**
   * 更新策略
   */
  updateStrategy(experience, analysis) {
    const { action } = experience;
    
    if (!this.strategies[action]) {
      this.strategies[action] = {
        successCount: 0,
        failureCount: 0,
        bestContext: {},
        avoidContext: [],
        confidence: 0.5
      };
    }
    
    const strategy = this.strategies[action];
    
    if (experience.success) {
      strategy.successCount++;
      strategy.bestContext = {
        ...strategy.bestContext,
        ...experience.context
      };
      strategy.confidence = Math.min(1.0, strategy.confidence + this.learningRate);
    } else {
      strategy.failureCount++;
      strategy.avoidContext.push(experience.context);
      strategy.confidence = Math.max(0.0, strategy.confidence - this.learningRate * 2);
    }
  }

  /**
   * 生成改进建议
   */
  generateSuggestions(experience) {
    const suggestions = [];
    
    // 基于失败类型生成建议
    const failureAnalysis = this.memory.analyzeFailure(experience);
    
    suggestions.push({
      type: failureAnalysis.type,
      message: failureAnalysis.message,
      action: failureAnalysis.solution,
      priority: 'high'
    });
    
    // 查找类似的成功经验
    const similarSuccess = this.memory.recall({
      action: experience.action,
      result: 'success'
    });
    
    if (similarSuccess.length > 0) {
      suggestions.push({
        type: 'reference',
        message: '参考成功经验',
        example: similarSuccess[0].context,
        priority: 'medium'
      });
    }
    
    // 生成优化建议
    const optimizations = this.memory.longTerm.optimizations.filter(
      o => o.action === experience.action
    );
    
    optimizations.forEach(opt => {
      suggestions.push({
        type: 'optimization',
        message: opt.suggestion.message,
        action: opt.suggestion.solution,
        priority: 'low'
      });
    });
    
    return suggestions;
  }

  /**
   * 选择最佳行动
   */
  chooseAction(actions, context) {
    // 探索 vs 利用
    if (Math.random() < this.explorationRate) {
      // 探索：随机选择
      return actions[Math.floor(Math.random() * actions.length)];
    }
    
    // 利用：选择成功率最高的
    const scores = actions.map(action => {
      const strategy = this.strategies[action];
      if (!strategy) {
        return { action, score: 0.5 }; // 未知行动，中等分数
      }
      
      const total = strategy.successCount + strategy.failureCount;
      const successRate = total > 0 
        ? strategy.successCount / total 
        : 0.5;
      
      return {
        action,
        score: successRate * strategy.confidence
      };
    });
    
    scores.sort((a, b) => b.score - a.score);
    return scores[0].action;
  }

  /**
   * 获取优化建议
   */
  getOptimizations(action) {
    return this.memory.longTerm.optimizations
      .filter(opt => opt.action === action)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map(opt => ({
        problem: opt.problem,
        suggestion: opt.suggestion
      }));
  }

  /**
   * 预测成功率
   */
  predictSuccess(action, context) {
    const strategy = this.strategies[action];
    
    if (!strategy) {
      return 0.5; // 未知行动，50% 成功率
    }
    
    const total = strategy.successCount + strategy.failureCount;
    if (total === 0) {
      return 0.5;
    }
    
    const baseRate = strategy.successCount / total;
    
    // 检查上下文是否匹配最佳实践
    const contextMatch = this.checkContextMatch(context, strategy.bestContext);
    
    return baseRate * contextMatch * strategy.confidence;
  }

  /**
   * 检查上下文匹配度
   */
  checkContextMatch(current, best) {
    if (!best || Object.keys(best).length === 0) {
      return 1.0;
    }
    
    let matchCount = 0;
    let totalCount = 0;
    
    for (const key of Object.keys(best)) {
      totalCount++;
      if (current[key] === best[key]) {
        matchCount++;
      }
    }
    
    return totalCount > 0 ? matchCount / totalCount : 1.0;
  }

  /**
   * 获取学习进度
   */
  getProgress() {
    const stats = this.memory.getStats();
    
    return {
      totalExperiences: stats.totalExperiences,
      successRate: stats.successRate,
      patternsLearned: stats.patternCount,
      optimizationsFound: stats.optimizationCount,
      strategiesDeveloped: Object.keys(this.strategies).length,
      learningTrend: this.calculateLearningTrend()
    };
  }

  /**
   * 计算学习趋势
   */
  calculateLearningTrend() {
    if (this.learningHistory.length < 10) {
      return 'insufficient_data';
    }
    
    const recent = this.learningHistory.slice(-10);
    const successCount = recent.filter(h => h.success).length;
    
    if (successCount > 7) {
      return 'improving';
    } else if (successCount < 3) {
      return 'declining';
    } else {
      return 'stable';
    }
  }

  /**
   * 导出学习数据
   */
  export() {
    return {
      memory: this.memory.export(),
      strategies: this.strategies,
      learningHistory: this.learningHistory,
      parameters: {
        learningRate: this.learningRate,
        explorationRate: this.explorationRate
      }
    };
  }

  /**
   * 导入学习数据
   */
  import(data) {
    if (data.memory) this.memory.import(data.memory);
    if (data.strategies) this.strategies = data.strategies;
    if (data.learningHistory) this.learningHistory = data.learningHistory;
    if (data.parameters) {
      this.learningRate = data.parameters.learningRate;
      this.explorationRate = data.parameters.explorationRate;
    }
  }
}

export default LearningEngine;
