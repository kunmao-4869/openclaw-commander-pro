/**
 * AI 驱动的工作流生成器
 * 使用自然语言理解自动生成工作流
 */

import { openClawClient } from '../lib/openclaw.js';
import { WorkflowBuilder, ActionStep, ConditionStep } from './WorkflowEngine.js';

// 可用技能映射表
const SKILL_MAPPINGS = {
  // 文件操作
  '文件': ['safe_read_file', 'safe_list_directory', 'safe_search_files'],
  '读取': ['safe_read_file'],
  '列出': ['safe_list_directory'],
  '搜索': ['safe_search_files', 'web_search', 'news_search'],
  
  // 系统信息
  '系统': ['get_system_info'],
  '进程': ['list_processes'],
  '网络': ['get_network_info', 'ping_test'],
  '检查': ['get_system_info', 'get_network_info'],
  
  // 网络搜索
  '搜索': ['web_search'],
  '新闻': ['news_search'],
  '维基百科': ['wikipedia_search'],
  '分析': ['analyze_search_results', 'compare_sources'],
  
  // 应用控制
  '启动': ['launch_application'],
  '打开': ['launch_application', 'open_url'],
  '应用': ['launch_application'],
  
  // 通用
  '帮助': ['web_search'],
  '查询': ['web_search'],
};

// 工作流模式模板
const WORKFLOW_PATTERNS = {
  // 诊断类工作流
  diagnosis: {
    keywords: ['诊断', '检查', '问题', '故障', '为什么'],
    steps: [
      { action: 'get_system_info', params: { detail_level: 'basic' } },
      { action: 'get_network_info', params: {} },
      { action: 'analyze_search_results', params: { query: '{{userInput}}' } }
    ]
  },
  
  // 研究类工作流
  research: {
    keywords: ['研究', '了解', '学习', '调查', '分析'],
    steps: [
      { action: 'web_search', params: { query: '{{researchTopic}}' } },
      { action: 'analyze_search_results', params: { query: '{{researchTopic}}' } },
      { action: 'compare_sources', params: { sources: '{{web_search.results}}' } }
    ]
  },
  
  // 启动类工作流
  launch: {
    keywords: ['启动', '打开', '运行', '启动应用'],
    steps: [
      { action: 'launch_application', params: { appName: '{{appName}}' } }
    ]
  },
  
  // 文件管理类
  fileManagement: {
    keywords: ['文件', '目录', '查找', '管理'],
    steps: [
      { action: 'safe_list_directory', params: { path: '{{filePath}}' } },
      { action: 'safe_search_files', params: { pattern: '{{filePattern}}' } }
    ]
  },
  
  // 新闻类
  news: {
    keywords: ['新闻', '最新消息', '动态'],
    steps: [
      { action: 'news_search', params: { query: '{{newsTopic}}' } },
      { action: 'analyze_search_results', params: { query: '{{newsTopic}}' } }
    ]
  }
};

export class AIWorkflowGenerator {
  constructor(options = {}) {
    this.model = options.model || 'qwen3:8b';
    this.skillManager = options.skillManager;
  }

  /**
   * 从自然语言生成工作流
   * @param {string} userInput - 用户输入的自然语言
   * @returns {Promise<Object>} 生成的工作流配置
   */
  async generateWorkflow(userInput) {
    console.log('[AIWorkflowGenerator] 开始生成工作流:', userInput);

    // 步骤 1: 理解用户意图
    const understanding = await this.understandIntent(userInput);
    console.log('[AIWorkflowGenerator] 意图理解:', understanding);

    // 步骤 2: 判断是否是复合任务
    let workflowConfig;
    if (understanding.isCompound || understanding.category === 'compound') {
      // 复合任务：使用特殊处理
      workflowConfig = this.handleCompoundTask(understanding);
    } else {
      // 单一任务：匹配工作流模式
      const pattern = this.matchPattern(understanding.category);
      if (pattern) {
        workflowConfig = this.generateFromPattern(pattern, understanding);
      } else {
        // 使用 AI 生成自定义工作流
        workflowConfig = await this.generateCustomWorkflow(userInput, understanding);
      }
    }

    // 步骤 3: 验证和优化
    const optimizedConfig = await this.optimizeWorkflow(workflowConfig, userInput);

    // 步骤 4: 创建 WorkflowBuilder 实例
    return this.buildWorkflow(optimizedConfig, userInput);
  }

  /**
   * 理解用户意图
   */
  async understandIntent(userInput) {
    const prompt = `分析用户需求，提取关键信息。

用户输入：${userInput}

请分析并以 JSON 格式返回：
{
  "category": "任务类别（diagnosis/research/launch/fileManagement/news/compound）",
  "intent": "用户的核心意图",
  "entities": {
    "appName": "应用名称（如果有，如抖音、网易云音乐、微信等）",
    "filePath": "文件路径（如果有）",
    "searchQuery": "搜索关键词（如果有）",
    "researchTopic": "研究主题（如果有）",
    "newsTopic": "新闻主题（如果有）",
    "other": "其他关键信息"
  },
  "parameters": {
    // 推断出的参数
  },
  "confidence": 0.0-1.0,  // 置信度
  "isCompound": true/false  // 是否是复合任务（多个动作）
}

示例 1: "启动抖音"
{
  "category": "launch",
  "intent": "启动应用程序",
  "entities": { "appName": "抖音" },
  "parameters": {},
  "confidence": 0.95,
  "isCompound": false
}

示例 2: "启动抖音并查看热门视频"
{
  "category": "compound",
  "intent": "启动应用并搜索内容",
  "entities": { "appName": "抖音", "searchQuery": "热门视频" },
  "parameters": {},
  "confidence": 0.90,
  "isCompound": true
}

只返回 JSON，不要其他内容。`;

    try {
      const response = await openClawClient.chat(this.model, [
        {
          role: 'system',
          content: '你是一个专业的意图识别助手，擅长从自然语言中提取结构化信息。'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        temperature: 0.3,
        maxTokens: 1024
      });

      const understanding = JSON.parse(response.trim());
      return understanding;
    } catch (error) {
      console.error('[AIWorkflowGenerator] 意图理解失败:', error);
      // 返回默认理解
      return {
        category: 'other',
        intent: userInput,
        entities: {},
        parameters: {},
        confidence: 0.5,
        isCompound: false
      };
    }
  }

  /**
   * 匹配工作流模式
   */
  matchPattern(category) {
    for (const [patternName, pattern] of Object.entries(WORKFLOW_PATTERNS)) {
      if (patternName === category) {
        return pattern;
      }
    }
    return null;
  }

  /**
   * 从模式生成工作流
   */
  generateFromPattern(pattern, understanding) {
    const steps = pattern.steps.map(step => ({
      ...step,
      params: this.fillParameters(step.params, understanding)
    }));

    return {
      steps,
      category: understanding.category,
      confidence: understanding.confidence
    };
  }

  /**
   * 处理复合任务（多个动作）
   */
  handleCompoundTask(understanding) {
    const steps = [];

    // 如果有应用名称，添加启动应用步骤
    if (understanding.entities.appName) {
      steps.push({
        action: 'launch_application',
        name: `启动 ${understanding.entities.appName}`,
        params: {
          appName: understanding.entities.appName
        },
        description: `启动应用程序：${understanding.entities.appName}`
      });
    }

    // 如果有搜索查询，添加搜索步骤
    if (understanding.entities.searchQuery) {
      steps.push({
        action: 'web_search',
        name: `搜索 "${understanding.entities.searchQuery}"`,
        params: {
          query: understanding.entities.searchQuery
        },
        description: `搜索相关内容：${understanding.entities.searchQuery}`
      });
    }

    // 如果有研究主题，添加研究步骤
    if (understanding.entities.researchTopic) {
      steps.push(
        {
          action: 'web_search',
          name: `搜索 "${understanding.entities.researchTopic}"`,
          params: { query: understanding.entities.researchTopic },
          description: '搜索相关信息'
        },
        {
          action: 'analyze_search_results',
          name: '分析搜索结果',
          params: { query: understanding.entities.researchTopic },
          description: '分析搜索结果'
        }
      );
    }

    return {
      steps,
      category: 'compound',
      confidence: understanding.confidence,
      isCompound: true
    };
  }

  /**
   * 填充参数
   */
  fillParameters(templateParams, understanding) {
    const params = {};
    
    for (const [key, value] of Object.entries(templateParams)) {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        // 提取变量名
        const varName = value.slice(2, -2);
        // 从理解结果中获取值
        params[key] = understanding.entities[varName] || understanding.parameters[varName] || '';
      } else {
        params[key] = value;
      }
    }
    
    // 特殊处理：如果参数为空但有实体匹配
    if (!params.appName && understanding.entities.appName) {
      params.appName = understanding.entities.appName;
    }
    
    return params;
  }

  /**
   * 生成自定义工作流（使用 AI）
   */
  async generateCustomWorkflow(userInput, understanding) {
    const availableSkills = this.skillManager ? 
      this.skillManager.getAllSkills().map(s => s.name) :
      Object.values(SKILL_MAPPINGS).flat();

    const prompt = `根据用户需求生成工作流步骤。

用户需求：${userInput}

可用技能列表：${availableSkills.join(', ')}

请生成工作流步骤（JSON 数组格式）：
[
  {
    "action": "技能名称（必须从上面的列表选择）",
    "params": {
      "参数名": "参数值或 {{variable}}"
    },
    "name": "步骤描述",
    "description": "详细说明"
  }
]

如果没有合适的技能，返回空数组 []。
只返回 JSON 数组，不要其他内容。`;

    try {
      const response = await openClawClient.chat(this.model, [
        {
          role: 'system',
          content: '你是一个专业的工作流生成助手，擅长组合技能完成复杂任务。'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        temperature: 0.5,
        maxTokens: 2048
      });

      const steps = JSON.parse(response.trim());
      
      return {
        steps,
        category: understanding.category,
        confidence: understanding.confidence,
        isCustom: true
      };
    } catch (error) {
      console.error('[AIWorkflowGenerator] 自定义工作流生成失败:', error);
      return {
        steps: [],
        category: 'other',
        confidence: 0
      };
    }
  }

  /**
   * 优化工作流
   */
  async optimizeWorkflow(workflowConfig, userInput) {
    // 简单的优化：添加错误处理步骤
    if (workflowConfig.steps && workflowConfig.steps.length > 0) {
      // 为关键步骤添加错误处理
      workflowConfig.steps.forEach(step => {
        step.retryCount = 1; // 失败时重试 1 次
        step.timeout = 30000; // 30 秒超时
      });
    }

    return workflowConfig;
  }

  /**
   * 构建 WorkflowBuilder 实例
   */
  buildWorkflow(config, userInput) {
    if (!config.steps || config.steps.length === 0) {
      return null;
    }

    const builder = new WorkflowBuilder(
      `ai_${Date.now()}`,
      `AI 生成的工作流：${userInput.slice(0, 30)}...`
    );

    let previousStepId = null;

    // 添加步骤
    for (const stepConfig of config.steps) {
      const stepId = `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const step = new ActionStep({
        id: stepId,
        name: stepConfig.name || stepConfig.action,
        action: stepConfig.action,
        params: stepConfig.params || {},
        description: stepConfig.description || ''
      });

      builder.workflow.steps.set(stepId, step);

      // 连接上一步
      if (previousStepId) {
        builder.workflow.steps.get(previousStepId).onSuccess = stepId;
      } else {
        builder.workflow.startStep = stepId;
      }

      previousStepId = stepId;
    }

    builder.lastStepId = previousStepId;
    return builder.build();
  }

  /**
   * 获取推荐的工作流类型
   */
  getRecommendations(userInput) {
    const recommendations = [];

    for (const [patternName, pattern] of Object.entries(WORKFLOW_PATTERNS)) {
      const matchScore = pattern.keywords.reduce((score, keyword) => {
        return userInput.includes(keyword) ? score + 1 : score;
      }, 0);

      if (matchScore > 0) {
        recommendations.push({
          pattern: patternName,
          score: matchScore,
          description: `基于"${pattern.keywords.join('、')}"等关键词匹配`
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }
}

// 导出单例
export const aiWorkflowGenerator = new AIWorkflowGenerator();
