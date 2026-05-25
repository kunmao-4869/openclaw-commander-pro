import { create } from 'zustand'

/**
 * 双模型混合思考系统状态管理
 * 智能路由：简单任务用 8B，复杂任务用 30B
 */

export const useModelStore = create((set, get) => ({
  // 当前选择的模型
  currentModel: 'qwen3:8b',
  
  // 模型配置 - 双模型协同
  models: {
    small: {
      name: 'qwen3:8b',
      displayName: 'Qwen3 8B (快速)',
      description: '快速响应，适合需求分析和任务规划',
      size: '5.2GB',
      role: 'planning',
      capabilities: ['需求理解', '任务分解', '快速响应', '计划制定'],
      recommended: ['简单任务', '需求分析', '任务规划', '代码实现']
    },
    large: {
      name: 'qwen3:30b',
      displayName: 'Qwen3 30B (强大)',
      description: '强大推理，适合任务审查和优化',
      size: '18GB',
      role: 'review',
      capabilities: ['复杂推理', '风险审查', '深度分析', '优化建议'],
      recommended: ['复杂问题', '代码审查', '架构设计', '风险评估']
    }
  },
  
  // 模型状态
  modelStatus: {
    'qwen3:8b': {
      available: true,
      loaded: false,
      memoryUsage: 5.2,
      lastUsed: null,
      role: '规划'
    },
    'qwen3:30b': {
      available: true,
      loaded: false,
      memoryUsage: 18,
      lastUsed: null,
      role: '审查'
    }
  },
  
  // 自动模型选择
  autoSelectModel: true,
  
  // 设置当前模型
  setCurrentModel: (modelName) => set({ currentModel: modelName }),
  
  // 切换模型
  toggleModel: () => {
    const current = get().currentModel
    set({ currentModel: current === 'qwen3:8b' ? 'qwen3:30b' : 'qwen3:8b' })
  },
  
  // 智能选择模型（根据任务复杂度）
  smartSelectModel: (taskComplexity) => {
    const { autoSelectModel } = get()
    if (!autoSelectModel) return get().currentModel
    
    // 任务复杂度分析
    const complexity = analyzeTaskComplexity(taskComplexity)
    
    if (complexity.score > 7) {
      set({ currentModel: 'qwen3:30b' })
      return 'qwen3:30b'
    } else {
      set({ currentModel: 'qwen3:8b' })
      return 'qwen3:8b'
    }
  },
  
  // 更新模型状态
  updateModelStatus: (modelName, status) => set((state) => ({
    modelStatus: {
      ...state.modelStatus,
      [modelName]: {
        ...state.modelStatus[modelName],
        ...status,
        lastUsed: new Date().toISOString()
      }
    }
  })),
  
  // 切换自动选择
  toggleAutoSelect: () => set((state) => ({
    autoSelectModel: !state.autoSelectModel
  }))
}))

/**
 * 分析任务复杂度
 * @param {string} task - 用户任务描述
 * @returns {object} 复杂度评分
 */
function analyzeTaskComplexity(task) {
  const keywords = {
    high: ['推理', '证明', '分析', '复杂', '优化', '重构', '设计', '创造'],
    medium: ['代码', '生成', '解释', '比较', '总结'],
    low: ['是什么', '定义', '简单', '快速', '基本']
  }
  
  let score = 5
  let category = 'medium'
  
  // 关键词匹配
  keywords.high.forEach(kw => {
    if (task.includes(kw)) {
      score += 3
      category = 'high'
    }
  })
  
  keywords.medium.forEach(kw => {
    if (task.includes(kw)) {
      score += 1
    }
  })
  
  keywords.low.forEach(kw => {
    if (task.includes(kw)) {
      score -= 2
      category = 'low'
    }
  })
  
  // 长度因素
  if (task.length > 100) score += 1
  if (task.length > 500) score += 2
  
  return { score, category }
}
