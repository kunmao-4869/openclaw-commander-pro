/**
 * Agent 元认知系统
 * 监控、反思和改进自己的行为
 */

import AgentMemory from './AgentMemory.js';
import LearningEngine from './LearningEngine.js';
import ReasoningEngine from './ReasoningEngine.js';

class MetaCognition {
  constructor(options = {}) {
    // 组件引用
    this.memory = options.memory || new AgentMemory();
    this.learning = options.learning || new LearningEngine();
    this.reasoning = options.reasoning || new ReasoningEngine();
    
    // 自我监控指标
    this.selfMonitoring = {
      performance: [],
      confidence: [],
      errors: [],
      improvements: []
    };
    
    // 自我认知
    this.selfKnowledge = {
      strengths: [],      // 优势
      weaknesses: [],     // 劣势
      capabilities: {},   // 能力评估
      limitations: []     // 局限性
    };
    
    // 改进目标
    this.improvementGoals = [];
    
    // 反思历史
    this.reflectionHistory = [];
  }

  /**
   * 自我监控
   */
  monitor() {
    console.log('👁️ 自我监控...');
    
    const status = {
      timestamp: Date.now(),
      performance: this.assessPerformance(),
      confidence: this.assessConfidence(),
      knowledge: this.assessKnowledge(),
      errors: this.getRecentErrors(),
      resourceUsage: this.assessResourceUsage()
    };
    
    // 记录监控结果
    selfMonitoring.performance.push(status.performance);
    selfMonitoring.confidence.push(status.confidence);
    
    console.log(`   性能评分：${status.performance.score}/100`);
    console.log(`   置信度：${(status.confidence * 100).toFixed(1)}%`);
    
    return status;
  }

  /**
   * 评估性能
   */
  assessPerformance() {
    const learningStats = this.learning.getProgress();
    const reasoningStats = this.reasoning.getStats();
    
    // 计算综合评分
    const factors = {
      successRate: parseFloat(learningStats.successRate) || 0,
      reasoningSuccess: parseFloat(reasoningStats.successRate) || 0,
      patternsLearned: Math.min(learningStats.patternsLearned * 2, 20),
      optimizations: Math.min(learningStats.optimizationsFound * 3, 20)
    };
    
    const score = Math.min(100, 
      factors.successRate * 0.4 + 
      factors.reasoningSuccess * 0.3 + 
      factors.patternsLearned + 
      factors.optimizations
    );
    
    return {
      score: score.toFixed(1),
      factors,
      trend: learningStats.learningTrend
    };
  }

  /**
   * 评估置信度
   */
  assessConfidence() {
    const avgReasoningConfidence = this.reasoning.calculateAvgConfidence();
    const learningProgress = this.learning.getProgress();
    
    // 基于成功率和经验数量
    const experienceFactor = Math.min(1.0, learningProgress.totalExperiences / 100);
    const successFactor = (parseFloat(learningProgress.successRate) || 50) / 100;
    
    return (
      avgReasoningConfidence * 0.4 +
      experienceFactor * 0.3 +
      successFactor * 0.3
    );
  }

  /**
   * 评估知识水平
   */
  assessKnowledge() {
    const memoryStats = this.memory.getStats();
    
    return {
      experiences: memoryStats.totalExperiences,
      patterns: memoryStats.patternCount,
      strategies: Object.keys(this.learning.strategies).length,
      cases: this.reasoning.knowledgeBase.cases.length
    };
  }

  /**
   * 获取近期错误
   */
  getRecentErrors() {
    const failures = this.memory.longTerm.failures;
    
    return failures
      .slice(-10)
      .map(f => ({
        action: f.action,
        error: f.result,
        timestamp: f.timestamp
      }));
  }

  /**
   * 评估资源使用
   */
  assessResourceUsage() {
    // 简化版：评估内存中的记忆数量
    const memoryStats = this.memory.getStats();
    
    return {
      memoryItems: memoryStats.shortTermCount + 
                   memoryStats.longTermSuccessCount + 
                   memoryStats.longTermFailureCount,
      efficiency: 'normal' // 可以进一步优化
    };
  }

  /**
   * 自我反思
   */
  reflect() {
    console.log('\\n🤔 自我反思...');
    
    const reflection = {
      timestamp: Date.now(),
      whatWentWell: [],
      whatWentWrong: [],
      patterns: [],
      insights: [],
      actionItems: []
    };
    
    // 分析成功经验
    const successes = this.memory.longTerm.successes.slice(-20);
    successes.forEach(s => {
      if (s.weight > 0.8) {
        reflection.whatWentWell.push({
          action: s.action,
          context: s.context,
          key: this.extractKeySuccessFactor(s)
        });
      }
    });
    
    // 分析失败教训
    const failures = this.memory.longTerm.failures.slice(-20);
    failures.forEach(f => {
      reflection.whatWentWrong.push({
        action: f.action,
        error: f.result,
        lesson: this.extractLesson(f)
      });
    });
    
    // 识别模式
    reflection.patterns = this.identifyBehaviorPatterns();
    
    // 生成洞察
    reflection.insights = this.generateInsights(reflection);
    
    // 制定改进行动
    reflection.actionItems = this.generateActionItems(reflection);
    
    // 记录反思
    this.reflectionHistory.push(reflection);
    
    // 更新自我认知
    this.updateSelfKnowledge(reflection);
    
    console.log(`   发现 ${reflection.whatWentWell.length} 个成功经验`);
    console.log(`   发现 ${reflection.whatWentWrong.length} 个改进点`);
    console.log(`   生成 ${reflection.insights.length} 个洞察`);
    
    return reflection;
  }

  /**
   * 提取成功关键因素
   */
  extractKeySuccessFactor(success) {
    // 分析成功的共同特征
    const contexts = this.memory.longTerm.successes
      .filter(s => s.action === success.action)
      .map(s => s.context);
    
    if (contexts.length === 0) return '未知';
    
    // 找出最常见的特征
    const commonKeys = {};
    contexts.forEach(ctx => {
      Object.keys(ctx).forEach(key => {
        commonKeys[key] = (commonKeys[key] || 0) + 1;
      });
    });
    
    const mostCommon = Object.entries(commonKeys).sort((a, b) => b[1] - a[1])[0];
    return mostCommon ? mostCommon[0] : '时机恰当';
  }

  /**
   * 提取教训
   */
  extractLesson(failure) {
    const analysis = this.memory.analyzeFailure(failure);
    return analysis.solution || '需要进一步分析';
  }

  /**
   * 识别行为模式
   */
  identifyBehaviorPatterns() {
    const patterns = [];
    
    // 分析高频行为
    const actionCounts = {};
    [...this.memory.longTerm.successes, ...this.memory.longTerm.failures]
      .forEach(m => {
        actionCounts[m.action] = (actionCounts[m.action] || 0) + 1;
      });
    
    Object.entries(actionCounts).forEach(([action, count]) => {
      if (count >= 5) {
        const successes = this.memory.longTerm.successes.filter(m => m.action === action).length;
        const rate = successes / count;
        
        patterns.push({
          action,
          frequency: count,
          successRate: (rate * 100).toFixed(1) + '%',
          trend: rate > 0.7 ? 'positive' : rate < 0.3 ? 'negative' : 'neutral'
        });
      }
    });
    
    return patterns;
  }

  /**
   * 生成洞察
   */
  generateInsights(reflection) {
    const insights = [];
    
    // 基于成功模式
    if (reflection.whatWentWell.length > 0) {
      insights.push({
        type: 'strength',
        description: '在特定条件下表现优秀',
        evidence: reflection.whatWentWell.length,
        suggestion: '继续强化这些优势'
      });
    }
    
    // 基于失败模式
    const errorTypes = {};
    reflection.whatWentWrong.forEach(w => {
      const type = this.reasoning.memory.analyzeFailure({ result: w.error }).type;
      errorTypes[type] = (errorTypes[type] || 0) + 1;
    });
    
    const mostCommonError = Object.entries(errorTypes).sort((a, b) => b[1] - a[1])[0];
    if (mostCommonError) {
      insights.push({
        type: 'weakness',
        description: `${mostCommonError[0]}类错误频发`,
        evidence: mostCommonError[1],
        suggestion: `重点改进${mostCommonError[0]}处理能力`
      });
    }
    
    // 基于学习趋势
    const learningProgress = this.learning.getProgress();
    if (learningProgress.learningTrend === 'improving') {
      insights.push({
        type: 'progress',
        description: '学习效果良好，持续进步中',
        evidence: learningProgress.successRate,
        suggestion: '保持当前学习策略'
      });
    }
    
    return insights;
  }

  /**
   * 生成改进行动
   */
  generateActionItems(reflection) {
    const actions = [];
    
    // 针对常见问题
    const commonErrors = this.memory.getCommonErrors('');
    commonErrors.slice(0, 3).forEach(err => {
      actions.push({
        priority: 'high',
        action: `减少${err.type}类错误`,
        steps: [
          '分析错误原因',
          '制定预防措施',
          '实施改进方案'
        ],
        metric: `降低${err.percentage}的发生率`
      });
    });
    
    // 基于洞察
    reflection.insights.forEach(insight => {
      if (insight.type === 'weakness') {
        actions.push({
          priority: 'medium',
          action: insight.suggestion,
          steps: ['学习相关知识', '练习相关技能', '总结经验'],
          metric: '提高成功率'
        });
      }
    });
    
    return actions;
  }

  /**
   * 更新自我认知
   */
  updateSelfKnowledge(reflection) {
    // 更新优势
    reflection.whatWentWell.forEach(w => {
      if (!this.selfKnowledge.strengths.includes(w.action)) {
        this.selfKnowledge.strengths.push(w.action);
      }
    });
    
    // 更新劣势
    reflection.whatWentWrong.forEach(w => {
      const action = w.action;
      if (!this.selfKnowledge.weaknesses.includes(action)) {
        this.selfKnowledge.weaknesses.push(action);
      }
    });
    
    // 更新能力评估
    const patterns = reflection.patterns;
    patterns.forEach(p => {
      this.selfKnowledge.capabilities[p.action] = {
        frequency: p.frequency,
        successRate: p.successRate,
        trend: p.trend
      };
    });
    
    // 更新局限性
    const lowSuccessActions = patterns.filter(p => parseFloat(p.successRate) < 50);
    lowSuccessActions.forEach(p => {
      if (!this.selfKnowledge.limitations.includes(p.action)) {
        this.selfKnowledge.limitations.push(p.action);
      }
    });
  }

  /**
   * 自我改进
   */
  improve() {
    console.log('\\n🚀 自我改进...');
    
    const improvements = [];
    
    // 1. 调整学习率
    const learningProgress = this.learning.getProgress();
    if (learningProgress.learningTrend === 'declining') {
      this.learning.learningRate *= 1.2; // 提高学习率
      improvements.push({
        type: 'parameter',
        change: '提高学习率',
        reason: '学习进度下降'
      });
    }
    
    // 2. 调整探索率
    const reasoningStats = this.reasoning.getStats();
    if (parseFloat(reasoningStats.successRate) < 50) {
      this.learning.explorationRate *= 1.1; // 增加探索
      improvements.push({
        type: 'strategy',
        change: '增加探索',
        reason: '推理成功率低'
      });
    }
    
    // 3. 优化记忆
    const memoryStats = this.memory.getStats();
    if (memoryStats.shortTermCount > 200) {
      this.memory.consolidate(); // 强制巩固
      improvements.push({
        type: 'optimization',
        change: '巩固记忆',
        reason: '短期记忆过多'
      });
    }
    
    improvements.forEach(imp => {
      console.log(`   ✅ ${imp.change}: ${imp.reason}`);
    });
    
    return improvements;
  }

  /**
   * 获取自我报告
   */
  getSelfReport() {
    const monitoring = this.monitor();
    const reflection = this.reflect();
    
    return {
      timestamp: Date.now(),
      performance: monitoring.performance,
      selfKnowledge: this.selfKnowledge,
      recentReflections: this.reflectionHistory.slice(-5),
      improvementGoals: this.improvementGoals,
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * 生成建议
   */
  generateRecommendations() {
    const recommendations = [];
    
    const learningProgress = this.learning.getProgress();
    
    // 基于成功率
    if (parseFloat(learningProgress.successRate) < 60) {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        message: '成功率较低，建议增加学习和反思频率'
      });
    }
    
    // 基于经验数量
    if (learningProgress.totalExperiences < 20) {
      recommendations.push({
        type: 'experience',
        priority: 'medium',
        message: '经验不足，建议多实践以积累经验'
      });
    }
    
    // 基于优化
    if (learningProgress.optimizationsFound === 0) {
      recommendations.push({
        type: 'optimization',
        priority: 'low',
        message: '尚未发现优化点，建议深入分析失败案例'
      });
    }
    
    return recommendations;
  }

  /**
   * 导出元认知数据
   */
  export() {
    return {
      selfKnowledge: this.selfKnowledge,
      reflectionHistory: this.reflectionHistory,
      improvementGoals: this.improvementGoals,
      monitoring: selfMonitoring
    };
  }

  /**
   * 导入元认知数据
   */
  import(data) {
    if (data.selfKnowledge) this.selfKnowledge = data.selfKnowledge;
    if (data.reflectionHistory) this.reflectionHistory = data.reflectionHistory;
    if (data.improvementGoals) this.improvementGoals = data.improvementGoals;
  }
}

export default MetaCognition;
