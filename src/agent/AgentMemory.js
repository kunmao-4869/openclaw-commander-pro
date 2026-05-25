/**
 * Agent 记忆系统
 * 包含短期记忆、长期记忆和技能库
 */

class AgentMemory {
  constructor(options = {}) {
    // 短期记忆（最近的经验）
    this.shortTerm = [];
    this.shortTermLimit = options.shortTermLimit || 100;
    
    // 长期记忆（巩固的经验）
    this.longTerm = {
      successes: [],    // 成功经验
      failures: [],     // 失败经验
      patterns: {},     // 模式识别
      optimizations: [] // 优化方案
    };
    
    // 技能库
    this.skills = {};
    
    // 记忆权重
    this.weights = {
      recency: 0.3,    // 新近度权重
      frequency: 0.4,  // 频率权重
      success: 0.3     // 成功率权重
    };
    
    // 记忆统计
    this.stats = {
      totalExperiences: 0,
      successCount: 0,
      failureCount: 0,
      lastConsolidation: Date.now()
    };
  }

  /**
   * 记录经验（短期记忆）
   */
  remember(experience) {
    const memory = {
      id: this.generateId(),
      timestamp: Date.now(),
      action: experience.action,
      context: experience.context || {},
      result: experience.result,
      success: experience.success,
      emotions: experience.emotions || {}, // 模拟情感标记
      weight: 1.0 // 初始权重
    };
    
    this.shortTerm.push(memory);
    this.stats.totalExperiences++;
    
    if (experience.success) {
      this.stats.successCount++;
    } else {
      this.stats.failureCount++;
    }
    
    // 如果短期记忆过多，触发巩固
    if (this.shortTerm.length > this.shortTermLimit) {
      this.consolidate();
    }
    
    return memory.id;
  }

  /**
   * 巩固记忆（转移到长期记忆）
   */
  consolidate() {
    console.log('🧠 巩固记忆...');
    
    // 按权重排序
    const sorted = this.shortTerm.sort((a, b) => b.weight - a.weight);
    
    // 取前 50% 巩固到长期记忆
    const toConsolidate = sorted.slice(0, Math.floor(sorted.length / 2));
    
    toConsolidate.forEach(memory => {
      if (memory.success) {
        this.longTerm.successes.push(memory);
        this.updatePattern(memory);
      } else {
        this.longTerm.failures.push(memory);
        this.generateOptimization(memory);
      }
    });
    
    // 清理短期记忆
    this.shortTerm = sorted.slice(Math.floor(sorted.length / 2));
    this.stats.lastConsolidation = Date.now();
    
    console.log(`   ✅ 巩固了 ${toConsolidate.length} 条记忆`);
  }

  /**
   * 回忆（检索相关经验）
   */
  recall(pattern) {
    const memories = [];
    
    // 从短期记忆检索
    const shortTermMatches = this.shortTerm.filter(m => this.matchPattern(m, pattern));
    memories.push(...shortTermMatches);
    
    // 从长期记忆检索
    const longTermMatches = [
      ...this.longTerm.successes.filter(m => this.matchPattern(m, pattern)),
      ...this.longTerm.failures.filter(m => this.matchPattern(m, pattern))
    ];
    memories.push(...longTermMatches);
    
    // 按权重排序
    return memories.sort((a, b) => {
      const scoreA = this.calculateScore(a);
      const scoreB = this.calculateScore(b);
      return scoreB - scoreA;
    });
  }

  /**
   * 匹配模式
   */
  matchPattern(memory, pattern) {
    if (!pattern) return true;
    
    // 检查 action
    if (pattern.action && memory.action !== pattern.action) {
      return false;
    }
    
    // 检查 context
    if (pattern.context) {
      for (const [key, value] of Object.entries(pattern.context)) {
        if (memory.context[key] !== value) {
          return false;
        }
      }
    }
    
    // 检查 result
    if (pattern.result && memory.result !== pattern.result) {
      return false;
    }
    
    return true;
  }

  /**
   * 计算记忆得分
   */
  calculateScore(memory) {
    const now = Date.now();
    const age = now - memory.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 小时
    
    // 新近度得分
    const recencyScore = Math.max(0, 1 - age / maxAge);
    
    // 频率得分（简化版，计算出现次数）
    const frequencyScore = this.countOccurrences(memory.action);
    
    // 成功率得分
    const successScore = memory.success ? 1 : 0;
    
    return (
      recencyScore * this.weights.recency +
      frequencyScore * this.weights.frequency +
      successScore * this.weights.success
    );
  }

  /**
   * 更新模式识别
   */
  updatePattern(memory) {
    const action = memory.action;
    
    if (!this.longTerm.patterns[action]) {
      this.longTerm.patterns[action] = {
        count: 0,
        successCount: 0,
        contexts: [],
        avgWeight: 0
      };
    }
    
    const pattern = this.longTerm.patterns[action];
    pattern.count++;
    if (memory.success) pattern.successCount++;
    pattern.contexts.push(memory.context);
    pattern.avgWeight = (pattern.avgWeight + memory.weight) / 2;
  }

  /**
   * 生成优化方案
   */
  generateOptimization(memory) {
    const optimization = {
      id: this.generateId(),
      timestamp: Date.now(),
      action: memory.action,
      problem: memory.result,
      context: memory.context,
      suggestion: this.analyzeFailure(memory)
    };
    
    this.longTerm.optimizations.push(optimization);
  }

  /**
   * 分析失败原因
   */
  analyzeFailure(memory) {
    const { action, context, result } = memory;
    
    // 简单的失败分析
    if (result.includes('未检测到')) {
      return {
        type: 'environment',
        message: '环境检测失败，请确保目标已准备就绪',
        solution: '检查目标环境是否已启动'
      };
    }
    
    if (result.includes('权限') || result.includes('拒绝')) {
      return {
        type: 'permission',
        message: '权限不足',
        solution: '检查是否有足够的权限'
      };
    }
    
    if (result.includes('格式') || result.includes('语法')) {
      return {
        type: 'format',
        message: '格式错误',
        solution: '检查输入格式是否正确'
      };
    }
    
    return {
      type: 'unknown',
      message: '未知错误',
      solution: '查看错误日志，手动排查'
    };
  }

  /**
   * 计数出现次数
   */
  countOccurrences(action) {
    let count = 0;
    
    this.shortTerm.forEach(m => {
      if (m.action === action) count++;
    });
    
    this.longTerm.successes.forEach(m => {
      if (m.action === action) count++;
    });
    
    this.longTerm.failures.forEach(m => {
      if (m.action === action) count++;
    });
    
    return count / 100; // 归一化
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      shortTermCount: this.shortTerm.length,
      longTermSuccessCount: this.longTerm.successes.length,
      longTermFailureCount: this.longTerm.failures.length,
      patternCount: Object.keys(this.longTerm.patterns).length,
      optimizationCount: this.longTerm.optimizations.length,
      successRate: this.stats.totalExperiences > 0 
        ? (this.stats.successCount / this.stats.totalExperiences * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * 获取最佳实践
   */
  getBestPractices(action) {
    const successes = this.longTerm.successes.filter(m => m.action === action);
    
    if (successes.length === 0) {
      return [];
    }
    
    // 返回权重最高的 3 个成功经验
    return successes
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(m => ({
        context: m.context,
        result: m.result,
        weight: m.weight
      }));
  }

  /**
   * 获取常见错误
   */
  getCommonErrors(action) {
    const failures = this.longTerm.failures.filter(m => m.action === action);
    
    if (failures.length === 0) {
      return [];
    }
    
    // 统计错误类型
    const errorTypes = {};
    failures.forEach(f => {
      const type = this.analyzeFailure(f).type;
      errorTypes[type] = (errorTypes[type] || 0) + 1;
    });
    
    return Object.entries(errorTypes)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        type,
        count,
        percentage: (count / failures.length * 100).toFixed(1) + '%'
      }));
  }

  /**
   * 生成 ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 导出记忆
   */
  export() {
    return {
      shortTerm: this.shortTerm,
      longTerm: this.longTerm,
      skills: this.skills,
      stats: this.stats
    };
  }

  /**
   * 导入记忆
   */
  import(data) {
    if (data.shortTerm) this.shortTerm = data.shortTerm;
    if (data.longTerm) this.longTerm = data.longTerm;
    if (data.skills) this.skills = data.skills;
    if (data.stats) this.stats = data.stats;
  }

  /**
   * 清空记忆
   */
  clear() {
    this.shortTerm = [];
    this.longTerm = {
      successes: [],
      failures: [],
      patterns: {},
      optimizations: []
    };
    this.skills = {};
  }
}

export default AgentMemory;
