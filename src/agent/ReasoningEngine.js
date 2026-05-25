/**
 * Agent 推理引擎
 * 分析问题、生成解决方案、做出决策
 */

class ReasoningEngine {
  constructor(options = {}) {
    // 知识库
    this.knowledgeBase = {
      facts: {},      // 事实
      rules: [],      // 规则
      cases: []       // 案例
    };
    
    // 推理模式
    this.reasoningMode = options.reasoningMode || 'hybrid'; // 'deductive', 'inductive', 'hybrid'
    
    // 置信度阈值
    this.confidenceThreshold = options.confidenceThreshold || 0.7;
    
    // 推理历史
    this.reasoningHistory = [];
  }

  /**
   * 分析问题
   */
  analyze(problem) {
    console.log('🔍 分析问题...');
    
    const analysis = {
      problem: problem,
      type: this.identifyProblemType(problem),
      rootCause: this.findRootCause(problem),
      constraints: this.identifyConstraints(problem),
      goals: this.identifyGoals(problem)
    };
    
    console.log(`   问题类型：${analysis.type}`);
    console.log(`   根本原因：${analysis.rootCause}`);
    
    return analysis;
  }

  /**
   * 识别问题类型
   */
  identifyProblemType(problem) {
    const { action, error, context } = problem;
    
    // 环境类问题
    if (error && (error.includes('未检测到') || error.includes('不存在'))) {
      return 'environment';
    }
    
    // 权限类问题
    if (error && (error.includes('权限') || error.includes('拒绝'))) {
      return 'permission';
    }
    
    // 格式类问题
    if (error && (error.includes('格式') || error.includes('语法') || error.includes('无效'))) {
      return 'format';
    }
    
    // 资源类问题
    if (error && (error.includes('内存') || error.includes('空间') || error.includes('资源'))) {
      return 'resource';
    }
    
    // 逻辑类问题
    if (error && (error.includes('逻辑') || error.includes('预期'))) {
      return 'logic';
    }
    
    // 未知类型
    return 'unknown';
  }

  /**
   * 查找根本原因
   */
  findRootCause(problem) {
    const { error, context } = problem;
    
    if (!error) {
      return '无错误信息';
    }
    
    // 5 Why 分析法（简化版）
    const causes = [];
    
    // Why 1
    if (error.includes('未检测到')) {
      causes.push('目标对象不存在或未启动');
      
      // Why 2
      if (context && !context.ready) {
        causes.push('环境未准备就绪');
        
        // Why 3
        causes.push('可能缺少前置条件');
      }
    }
    
    if (error.includes('权限')) {
      causes.push('权限不足');
      causes.push('可能需要管理员权限或配置');
    }
    
    if (error.includes('格式')) {
      causes.push('输入格式不符合要求');
      causes.push('可能需要验证或转换数据');
    }
    
    return causes.join(' → ');
  }

  /**
   * 识别约束条件
   */
  identifyConstraints(problem) {
    const constraints = [];
    
    // 时间约束
    if (problem.deadline) {
      constraints.push({
        type: 'time',
        value: problem.deadline
      });
    }
    
    // 资源约束
    if (problem.resources) {
      constraints.push({
        type: 'resource',
        value: problem.resources
      });
    }
    
    // 质量约束
    if (problem.quality) {
      constraints.push({
        type: 'quality',
        value: problem.quality
      });
    }
    
    return constraints;
  }

  /**
   * 识别目标
   */
  identifyGoals(problem) {
    const goals = [];
    
    // 主要目标
    goals.push({
      type: 'primary',
      description: `解决${problem.type || '当前'}问题`,
      priority: 1
    });
    
    // 次要目标
    goals.push({
      type: 'secondary',
      description: '防止问题再次发生',
      priority: 2
    });
    
    goals.push({
      type: 'secondary',
      description: '优化解决方案',
      priority: 3
    });
    
    return goals;
  }

  /**
   * 生成解决方案
   */
  generateSolutions(analysis) {
    console.log('💡 生成解决方案...');
    
    const solutions = [];
    
    // 基于规则的解决方案
    const ruleBased = this.generateRuleBasedSolutions(analysis);
    solutions.push(...ruleBased);
    
    // 基于案例的解决方案
    const caseBased = this.generateCaseBasedSolutions(analysis);
    solutions.push(...caseBased);
    
    // 创造性解决方案
    const creative = this.generateCreativeSolutions(analysis);
    solutions.push(...creative);
    
    // 评估每个方案
    solutions.forEach(sol => {
      sol.confidence = this.evaluateSolution(sol, analysis);
      sol.feasibility = this.assessFeasibility(sol);
      sol.risk = this.assessRisk(sol);
    });
    
    // 排序
    solutions.sort((a, b) => {
      const scoreA = sol => sol.confidence * 0.4 + sol.feasibility * 0.4 - sol.risk * 0.2;
      return scoreA(b) - scoreA(a);
    });
    
    console.log(`   生成了 ${solutions.length} 个解决方案`);
    
    return solutions;
  }

  /**
   * 基于规则生成方案
   */
  generateRuleBasedSolutions(analysis) {
    const solutions = [];
    
    // 定义规则
    const rules = [
      {
        if: (p) => p.type === 'environment',
        then: {
          action: 'check_environment',
          steps: [
            '检查目标是否已启动',
            '检查配置是否正确',
            '尝试重新启动'
          ]
        }
      },
      {
        if: (p) => p.type === 'permission',
        then: {
          action: 'request_permission',
          steps: [
            '检查当前权限级别',
            '申请必要权限',
            '使用替代方案'
          ]
        }
      },
      {
        if: (p) => p.type === 'format',
        then: {
          action: 'validate_and_fix',
          steps: [
            '验证输入格式',
            '查找格式要求',
            '修正格式错误'
          ]
        }
      },
      {
        if: (p) => p.type === 'resource',
        then: {
          action: 'optimize_resources',
          steps: [
            '释放不必要的资源',
            '优化资源使用',
            '增加资源配额'
          ]
        }
      }
    ];
    
    // 匹配规则
    rules.forEach(rule => {
      if (rule.if(analysis)) {
        solutions.push({
          type: 'rule_based',
          action: rule.then.action,
          steps: rule.then.steps,
          source: '规则库'
        });
      }
    });
    
    return solutions;
  }

  /**
   * 基于案例生成方案
   */
  generateCaseBasedSolutions(analysis) {
    const solutions = [];
    
    // 查找类似案例
    const similarCases = this.findSimilarCases(analysis);
    
    similarCases.forEach(case_ => {
      solutions.push({
        type: 'case_based',
        action: case_.solution.action,
        steps: case_.solution.steps,
        source: '历史案例',
        successRate: case_.successRate
      });
    });
    
    return solutions;
  }

  /**
   * 查找类似案例
   */
  findSimilarCases(analysis) {
    // 简化版：返回预定义案例
    const cases = [
      {
        problem: { type: 'environment' },
        solution: {
          action: 'restart_service',
          steps: ['停止服务', '清理缓存', '重新启动']
        },
        successRate: 0.85
      },
      {
        problem: { type: 'permission' },
        solution: {
          action: 'run_as_admin',
          steps: ['以管理员身份运行', '检查 UAC 设置']
        },
        successRate: 0.90
      }
    ];
    
    return cases.filter(c => c.problem.type === analysis.type);
  }

  /**
   * 创造性解决方案
   */
  generateCreativeSolutions(analysis) {
    const solutions = [];
    
    // 头脑风暴式方案
    solutions.push({
      type: 'creative',
      action: 'workaround',
      steps: [
        '寻找替代方案',
        '绕过问题点',
        '实现相同目标'
      ],
      source: '创新思维'
    });
    
    solutions.push({
      type: 'creative',
      action: 'decompose',
      steps: [
        '分解问题',
        '逐个解决子问题',
        '整合解决方案'
      ],
      source: '分治法'
    });
    
    solutions.push({
      type: 'creative',
      action: 'ask_help',
      steps: [
        '查找文档',
        '搜索类似问题',
        '寻求社区帮助'
      ],
      source: '外部资源'
    });
    
    return solutions;
  }

  /**
   * 评估解决方案
   */
  evaluateSolution(solution, analysis) {
    let confidence = 0.5;
    
    // 基于来源
    if (solution.source === '规则库') {
      confidence += 0.2;
    } else if (solution.source === '历史案例') {
      confidence += (solution.successRate || 0.5) * 0.3;
    } else if (solution.source === '创新思维') {
      confidence += 0.1;
    }
    
    // 基于步骤数量（步骤越少越可靠）
    if (solution.steps && solution.steps.length <= 3) {
      confidence += 0.1;
    }
    
    return Math.min(1.0, confidence);
  }

  /**
   * 评估可行性
   */
  assessFeasibility(solution) {
    // 简化版可行性评估
    const factors = [
      solution.steps && solution.steps.length <= 5 ? 0.2 : 0,
      solution.type === 'rule_based' ? 0.3 : 0.1,
      solution.confidence > 0.7 ? 0.3 : 0.1
    ];
    
    return factors.reduce((a, b) => a + b, 0);
  }

  /**
   * 评估风险
   */
  assessRisk(solution) {
    let risk = 0.3;
    
    // 创造性方案风险较高
    if (solution.type === 'creative') {
      risk += 0.2;
    }
    
    // 步骤越多风险越高
    if (solution.steps && solution.steps.length > 5) {
      risk += 0.2;
    }
    
    return Math.min(1.0, risk);
  }

  /**
   * 做出决策
   */
  makeDecision(solutions) {
    console.log('🎯 做出决策...');
    
    // 过滤掉置信度低的方案
    const viable = solutions.filter(s => s.confidence >= this.confidenceThreshold);
    
    if (viable.length === 0) {
      // 没有足够好的方案，返回最好的
      console.log('   ⚠️ 没有达到置信度阈值的方案，选择最佳可用方案');
      return solutions[0];
    }
    
    // 选择得分最高的
    const best = viable[0];
    console.log(`   ✅ 选择方案：${best.action} (置信度：${(best.confidence * 100).toFixed(1)}%)`);
    
    return best;
  }

  /**
   * 执行推理
   */
  reason(problem) {
    console.log('\\n🧠 开始推理...');
    
    // 1. 分析问题
    const analysis = this.analyze(problem);
    
    // 2. 生成解决方案
    const solutions = this.generateSolutions(analysis);
    
    // 3. 做出决策
    const decision = this.makeDecision(solutions);
    
    // 4. 记录推理历史
    this.reasoningHistory.push({
      timestamp: Date.now(),
      problem,
      analysis,
      solutions: solutions.length,
      decision,
      outcome: null // 待执行后填写
    });
    
    return {
      analysis,
      solutions,
      decision,
      reasoningPath: this.generateReasoningPath(analysis, decision)
    };
  }

  /**
   * 生成推理路径
   */
  generateReasoningPath(analysis, decision) {
    return [
      `识别问题类型：${analysis.type}`,
      `分析根本原因：${analysis.rootCause}`,
      `生成 ${decision.type} 解决方案`,
      `选择行动：${decision.action}`,
      `置信度：${(decision.confidence * 100).toFixed(1)}%`
    ];
  }

  /**
   * 学习推理结果
   */
  learnOutcome(decision, success, outcome) {
    // 更新最近的推理记录
    const lastReasoning = this.reasoningHistory[this.reasoningHistory.length - 1];
    if (lastReasoning) {
      lastReasoning.outcome = {
        success,
        outcome,
        timestamp: Date.now()
      };
    }
    
    // 添加到案例库
    this.knowledgeBase.cases.push({
      problem: lastReasoning?.problem,
      solution: decision,
      successRate: success ? 1.0 : 0.0,
      timestamp: Date.now()
    });
  }

  /**
   * 获取推理统计
   */
  getStats() {
    const total = this.reasoningHistory.length;
    const successful = this.reasoningHistory.filter(r => r.outcome?.success).length;
    
    return {
      totalReasonings: total,
      successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
      avgConfidence: this.calculateAvgConfidence(),
      commonProblems: this.getCommonProblems()
    };
  }

  /**
   * 计算平均置信度
   */
  calculateAvgConfidence() {
    if (this.reasoningHistory.length === 0) {
      return 0;
    }
    
    const sum = this.reasoningHistory.reduce((acc, r) => acc + (r.decision?.confidence || 0), 0);
    return (sum / this.reasoningHistory.length).toFixed(2);
  }

  /**
   * 获取常见问题
   */
  getCommonProblems() {
    const counts = {};
    
    this.reasoningHistory.forEach(r => {
      const type = r.problem?.type || 'unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
  }
}

export default ReasoningEngine;
