/**
 * 双模型协作任务规划系统
 * 小模型理解 + 规划 → 大模型审查 + 优化 → 小模型执行
 */

import { openClawClient } from '../lib/openclaw.js';
import { skillsAPIClient } from '../skills/SkillsAPIClient.js';

export class TaskPlanner {
  constructor(options = {}) {
    this.smallModel = options.smallModel || 'qwen3:8b';
    this.largeModel = options.largeModel || 'qwen3:30b';
    this.maxSteps = options.maxSteps || 10;
  }

  /**
   * 完整任务处理流程
   * 1. 小模型理解需求并制定初步规划
   * 2. 大模型审查并优化规划
   * 3. 小模型根据优化后的规划执行任务
   */
  async processTask(userRequest, context = {}) {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🎯 双模型协同任务处理系统启动                  ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
    
    console.log('📝 用户需求:', userRequest);
    console.log('📊 复杂度评估:', this.evaluateComplexity(userRequest));
    console.log('\n');
    
    // 步骤 1: 小模型理解需求并制定初步规划
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 步骤 1/3: 小模型需求分析与规划');
    console.log('   使用模型：qwen3:8b (5.2GB)');
    console.log('   职责：理解需求、分解任务、制定初步计划');
    console.log('═══════════════════════════════════════════════════\n');
    
    const preliminaryPlan = await this.understandAndPlan(userRequest, context);
    console.log('\n✅ 初步规划完成:');
    console.log('   任务类别:', preliminaryPlan.understanding?.category);
    console.log('   难度等级:', preliminaryPlan.understanding?.difficulty);
    console.log('   预计步骤:', preliminaryPlan.understanding?.estimatedSteps);
    console.log('\n');
    
    // 步骤 2: 大模型审查并优化规划
    console.log('═══════════════════════════════════════════════════');
    console.log('🧠 步骤 2/3: 大模型审查与优化');
    console.log('   使用模型：qwen3:30b (18GB)');
    console.log('   职责：审查规划、发现风险、优化步骤');
    console.log('═══════════════════════════════════════════════════\n');
    
    const optimizedPlan = await this.reviewAndOptimize(preliminaryPlan, userRequest);
    console.log('\n✅ 审查优化完成:');
    if (optimizedPlan.changes && optimizedPlan.changes.length > 0) {
      console.log('   优化内容:');
      optimizedPlan.changes.forEach((change, i) => {
        console.log(`   ${i+1}. ${change.type}: ${change.description}`);
      });
    } else {
      console.log('   规划良好，无需优化');
    }
    console.log('\n');
    
    // 步骤 3: 小模型根据优化后的规划执行任务
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 步骤 3/3: 小模型任务执行');
    console.log('   使用模型：qwen3:8b (5.2GB)');
    console.log('   职责：执行具体任务、调用技能、生成结果');
    console.log('═══════════════════════════════════════════════════\n');
    
    const executionResult = await this.executePlan(optimizedPlan, userRequest, context);
    console.log('\n✅ 任务执行完成:');
    console.log('   总步骤数:', executionResult.totalSteps);
    console.log('   成功步骤:', executionResult.successfulSteps);
    console.log('   失败步骤:', executionResult.failedSteps);
    console.log('\n');
    
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║  ✅ 任务处理完成                                ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
    
    return {
      preliminaryPlan,
      optimizedPlan,
      executionResult,
      modelsUsed: {
        planning: this.smallModel,
        review: this.largeModel,
        execution: this.smallModel
      }
    };
  }

  /**
   * 步骤 1: 小模型理解需求并制定初步规划
   */
  async understandAndPlan(userRequest, context) {
    // 检测是否是编程任务
    const isProgrammingTask = this.detectProgrammingTask(userRequest);
    
    // 如果是编程任务，直接使用自主编程引擎
    if (isProgrammingTask) {
      console.log('[TaskPlanner] 检测到编程任务，使用自主编程引擎');
      return this.createProgrammingPlan(userRequest);
    }
    
    // 获取可用技能列表
    const availableSkills = [
      // 浏览器自动化技能（优先使用！）
      'browser_search', 'browser_automation', 'extract_webpage_content',
      // 文件操作（优先使用 read_requirement 读取需求文档）
      'read_requirement', 'safe_read_file', 'safe_list_directory', 'safe_search_files',
      // 系统信息
      'get_system_info', 'list_processes', 'get_network_info', 'ping_test',
      // 网络搜索（备用）
      'web_search', 'wikipedia_search', 'news_search',
      // 分析工具
      'analyze_search_results', 'compare_sources',
      // 应用控制
      'launch_application', 'search_installed_apps', 'open_url',
      // 编程技能
      'autonomous_programming'
    ];
    
    const prompt = `你是一个智能任务规划助手。请理解用户需求，并制定详细的执行计划。

用户需求：${userRequest}

可用技能列表（只能使用这些技能，不能创造新技能）：
**浏览器自动化技能（优先使用，可绕过网络限制）：**
- browser_automation: 浏览器自动化（操作真实浏览器搜索）
- extract_webpage_content: 提取网页内容（使用浏览器访问网页）

**传统搜索技能（浏览器不可用时备用）：**
- web_search: 网络搜索（使用 API，可能超时）
- wikipedia_search: 维基百科搜索
- news_search: 新闻搜索

**分析技能：**
- analyze_search_results: 分析搜索结果
- compare_sources: 对比多个来源

**系统技能：**
- get_system_info: 获取系统信息
- list_processes: 列出进程
- get_network_info: 获取网络信息
- ping_test: Ping 测试

**应用控制：**
- launch_application: 启动应用
- search_installed_apps: 搜索已安装应用
- open_url: 打开网址

**文件操作：**
- safe_read_file: 读取文件
- safe_list_directory: 列出目录
- safe_search_files: 搜索文件

**重要优先级（必须遵守）**：
1. ⭐⭐⭐ 搜索信息时，必须优先使用 browser_search（浏览器搜索，不会超时）
2. ⭐⭐ 访问网页提取内容使用 extract_webpage_content
3. ⭐ 浏览器不可用时，再使用 web_search 等 API
4. 只使用上面列出的技能名称，不能使用不存在的技能
5. 为每个步骤设置合理的 params
6. 如果技能执行失败，尝试使用其他替代技能

正确使用示例：
- 搜索：browser_search，参数：{query: "关键词", engine: "bing"}
- 提取：extract_webpage_content，参数：{url: "网址"}
- 分析：analyze_search_results，参数：{query: "主题", results: []}

错误的技能名称（不能使用）：
- null, undefined, create_project, generate_code

示例 1 - 启动应用：
用户：打开抖音
规划：{
  "understanding": {"coreNeed": "启动抖音应用", "category": "应用控制", "difficulty": "简单", "estimatedSteps": 1},
  "plan": [{"step": 1, "name": "启动抖音", "action": "launch_application", "params": {"appName": "抖音"}, "description": "启动抖音应用程序", "expectedOutput": "应用已启动"}],
  "riskAssessment": {"hasRisk": false, "riskLevel": "低", "risks": []}
}

示例 2 - 网络搜索：
用户：搜索最新 AI 新闻
规划：{
  "understanding": {"coreNeed": "搜索 AI 相关新闻", "category": "网络搜索", "difficulty": "简单", "estimatedSteps": 1},
  "plan": [{"step": 1, "name": "搜索新闻", "action": "news_search", "params": {"query": "AI 人工智能"}, "description": "搜索最新 AI 新闻", "expectedOutput": "新闻列表"}],
  "riskAssessment": {"hasRisk": false, "riskLevel": "低", "risks": []}
}

请以 JSON 格式返回规划（严格遵循上述示例格式）：
{
  "understanding": {
    "coreNeed": "核心需求描述",
    "category": "任务类别",
    "difficulty": "简单/中等/复杂",
    "estimatedSteps": 数字
  },
  "plan": [
    {
      "step": 1,
      "name": "步骤名称",
      "action": "技能名称（必须从上面的列表选择，或 null）",
      "params": {"参数名": "参数值"},
      "description": "步骤描述",
      "expectedOutput": "预期输出"
    }
  ],
  "riskAssessment": {
    "hasRisk": true/false,
    "riskLevel": "低/中/高",
    "risks": ["风险 1", "风险 2"]
  }
}

只返回 JSON，不要其他内容。`;

    try {
      const response = await openClawClient.chat(this.smallModel, [
        {
          role: 'system',
          content: '你是一个专业的任务规划助手，擅长分解复杂任务并制定可执行的计划。'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        temperature: 0.3,
        maxTokens: 2048
      });

      // 解析 JSON
      const plan = JSON.parse(response.trim());
      
      // 验证规划
      if (!plan.plan || !Array.isArray(plan.plan)) {
        throw new Error('规划格式不正确');
      }

      // 限制步骤数量
      if (plan.plan.length > this.maxSteps) {
        plan.plan = plan.plan.slice(0, this.maxSteps);
        plan.understanding.estimatedSteps = this.maxSteps;
      }

      return plan;
    } catch (error) {
      console.error('[TaskPlanner] 理解规划失败:', error);
      throw new Error(`理解需求失败：${error.message}`);
    }
  }

  /**
   * 步骤 2: 大模型审查并优化规划
   */
  async reviewAndOptimize(preliminaryPlan, userRequest) {
    const prompt = `你是一个经验丰富的任务审查专家。请审查以下任务规划，并提出优化建议。

用户需求：${userRequest}

初步规划：
${JSON.stringify(preliminaryPlan, null, 2)}

请审查：
1. 规划是否完整？是否遗漏了重要步骤？
2. 步骤顺序是否合理？
3. 是否有更优的实现方式？
4. 是否存在风险？如何规避？
5. 是否可以合并某些步骤以提高效率？

**可用技能列表（只能使用这些技能名称）**：

**文件读取（优先使用）：**
- read_requirement: 读取项目需求文档（专门用于读取 .md 格式的需求文件，支持中文路径）
- safe_read_file: 安全读取文件（通用文件读取）

**代码生成：**
- generate_project_code: 生成项目代码
- code_review: 代码审查

**文件操作：**
- safe_read_file: 读取文件
- safe_list_directory: 列出目录
- safe_search_files: 搜索文件
- safe_write_file: 写入文件
- create_project_files: 创建项目文件

**网络搜索：**
- browser_search: 浏览器搜索（推荐）
- web_search: API 搜索
- news_search: 新闻搜索
- extract_webpage_content: 提取网页内容

**分析工具：**
- analyze_search_results: 分析搜索结果
- compare_sources: 比较来源

**应用控制：**
- launch_application: 启动应用
- search_installed_apps: 搜索已安装应用
- open_url: 打开网址

**系统信息：**
- get_system_info: 获取系统信息
- list_processes: 列出进程
- get_network_info: 获取网络信息
- ping_test: Ping 测试

**重要约束**：
1. action 字段必须使用上面列出的技能名称，或者为 null（使用 AI 对话）
2. 不能使用不存在的技能名称（如 requirement_refinement_and_architecture_design）
3. 如果需要使用自主编程功能，action 设置为 "autonomous_programming"
4. 保持步骤简洁，每个步骤只完成一个明确的任务

请输出优化后的规划（JSON 格式）：
{
  "review": {
    "completeness": "完整性评价（1-10 分）",
    "efficiency": "效率评价（1-10 分）",
    "safety": "安全性评价（1-10 分）",
    "issues": ["发现的问题 1", "发现的问题 2"],
    "suggestions": ["优化建议 1", "优化建议 2"]
  },
  "optimizedPlan": {
    "understanding": { ... }, // 更新后的理解
    "plan": [ ... ], // 优化后的步骤（每个步骤的 action 必须是上面列出的技能名称或 null）
    "riskAssessment": { ... } // 更新后的风险评估
  },
  "changes": [
    {
      "type": "添加/删除/修改/合并",
      "description": "修改描述",
      "reason": "修改原因"
    }
  ]
}

只返回 JSON，不要其他内容。`;

    try {
      const response = await openClawClient.chat(this.largeModel, [
        {
          role: 'system',
          content: '你是一个严格的任务审查专家，善于发现规划中的问题并提出优化建议。'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        temperature: 0.2,
        maxTokens: 4096,
        timeout: 600000  // 显式设置 10 分钟超时
      }, 'project_plan'); // 使用 project_plan 任务类型，超时时间更长

      const reviewedPlan = JSON.parse(response.trim());
      
      // 如果没有优化，使用原规划
      if (!reviewedPlan.optimizedPlan) {
        reviewedPlan.optimizedPlan = preliminaryPlan;
        reviewedPlan.changes = [];
      }

      return reviewedPlan;
    } catch (error) {
      console.error('[TaskPlanner] 审查优化失败:', error);
      // 审查失败时返回原规划
      return {
        review: {
          note: '审查过程出错，使用原规划',
          error: error.message
        },
        optimizedPlan: preliminaryPlan,
        changes: []
      };
    }
  }

  /**
   * 步骤 3: 小模型根据优化后的规划执行任务
   */
  async executePlan(optimizedPlan, userRequest, context) {
    const plan = optimizedPlan.optimizedPlan || optimizedPlan;
    const results = [];
    let hasError = false;
    let successfulSteps = 0;

    console.log(`[TaskPlanner] 开始执行任务，共${plan.plan.length}个步骤`);

    for (let i = 0; i < plan.plan.length; i++) {
      const step = plan.plan[i];
      
      console.log(`[TaskPlanner] 执行步骤 ${i + 1}/${plan.plan.length}:`, step.name);

      try {
        // 通过 SkillsAPIClient 调用后端 API 执行技能
        if (step.action === 'autonomous_programming') {
          // 特殊处理自主编程技能
          console.log(`[TaskPlanner] 🤖 自主编程技能：${step.action}`);
          const AutonomousProgrammer = (await import('../ai/AutonomousProgrammer.js')).default;
          const programmer = new AutonomousProgrammer();
          
          const result = await programmer.program(
            step.params.requirement,
            {
              framework: step.params.framework,
              language: step.params.language,
              projectName: step.params.projectName
            }
          );
          
          // 处理模块化结果
          if (result.modular) {
            // 模块化生成模式
            results.push({
              step: step.step,
              name: step.name,
              status: result.success ? 'success' : 'failed',
              result: {
                modular: true,
                modules: result.modules,
                summary: result.summary,
                success: result.success,
                error: result.error
              },
              output: step.expectedOutput
            });
            
            context[`step_${step.step}_result`] = result;
          } else {
            // 单次生成模式
            results.push({
              step: step.step,
              name: step.name,
              status: 'success',
              result: {
                code: result.code,
                filename: result.filename,
                quality: result.review?.quality || 0,
                understanding: result.understanding,
                design: result.design
              },
              output: step.expectedOutput
            });
            
            context[`step_${step.step}_result`] = result;
          }
          successfulSteps++;
        } else if (step.action) {
          // 普通技能调用
          console.log(`[TaskPlanner] 🚀 通过后端 API 执行技能：${step.action}`);
          const result = await skillsAPIClient.executeSkill(step.action, 'execute', step.params);
          
          results.push({
            step: step.step,
            name: step.name,
            status: 'success',
            result,
            output: step.expectedOutput
          });
          
          context[`step_${step.step}_result`] = result;
          successfulSteps++;
        } else if (!step.action) {
          // action 为 null，使用 AI 对话回答
          const aiResponse = await openClawClient.chat(this.smallModel, [
            {
              role: 'system',
              content: '你是一个友好的 AI 助手，请简洁地回答用户的问题。'
            },
            {
              role: 'user',
              content: userRequest
            }
          ], {
            temperature: 0.7,
            maxTokens: 1024
          });
          
          results.push({
            step: step.step,
            name: step.name,
            status: 'success',
            result: {
              response: aiResponse,
              type: 'ai_chat'
            },
            output: step.expectedOutput
          });
        } else {
          // 没有技能执行器，模拟执行
          results.push({
            step: step.step,
            name: step.name,
            status: 'simulated',
            message: '技能执行器未提供',
            output: step.expectedOutput
          });
        }
      } catch (error) {
        hasError = true;
        results.push({
          step: step.step,
          name: step.name,
          status: 'failed',
          error: error.message
        });

        // 如果是关键步骤失败，停止执行
        if (step.critical) {
          console.error(`[TaskPlanner] 关键步骤 ${step.name} 失败，停止执行`);
          break;
        }
      }
    }

    // 生成执行总结
    const summary = {
      totalSteps: plan.plan.length,
      executedSteps: results.length,
      successfulSteps: results.filter(r => r.status === 'success').length,
      failedSteps: results.filter(r => r.status === 'failed').length,
      simulatedSteps: results.filter(r => r.status === 'simulated').length,
      hasError,
      results,
      finalOutput: this.generateFinalOutput(results, plan)
    };

    return summary;
  }

  /**
   * 检测是否是编程任务
   */
  detectProgrammingTask(userRequest) {
    const programmingKeywords = [
      '写一个', '写个', '编写', '开发', '创建', '生成',
      '代码', '程序', '项目', '游戏',
      'C++', 'Python', 'JavaScript', 'Java',
      '虚幻', 'Unreal', 'Unity', '鸿蒙', 'HarmonyOS',
      'RPG', '游戏模式', 'GameMode'
    ];
    
    const lowerRequest = userRequest.toLowerCase();
    const matchCount = programmingKeywords.filter(kw => 
      lowerRequest.includes(kw.toLowerCase())
    ).length;
    
    // 匹配 2 个以上关键词认为是编程任务
    return matchCount >= 2;
  }

  /**
   * 创建编程任务计划
   */
  createProgrammingPlan(userRequest) {
    return {
      understanding: {
        coreNeed: userRequest,
        category: '编程开发',
        difficulty: '复杂',
        estimatedSteps: 1
      },
      plan: [
        {
          step: 1,
          name: '自主编程',
          action: 'autonomous_programming',
          params: {
            requirement: userRequest
          },
          description: '使用自主编程引擎生成代码',
          expectedOutput: '完整的代码文件'
        }
      ],
      riskAssessment: {
        hasRisk: false,
        riskLevel: '低',
        risks: []
      }
    };
  }

  /**
   * 生成最终输出
   */
  generateFinalOutput(results, plan) {
    const successfulResults = results.filter(r => r.status === 'success');
    
    if (successfulResults.length === 0) {
      return '任务未执行成功';
    }

    // 合并所有成功步骤的结果
    const outputs = successfulResults.map(r => 
      `步骤 ${r.step} (${r.name}): ${JSON.stringify(r.result, null, 2)}`
    );

    return outputs.join('\n\n---\n\n');
  }

  /**
   * 评估任务复杂度（用于决定是否需要大模型审查）
   */
  evaluateComplexity(userRequest) {
    const keywords = {
      high: ['复杂', '多步骤', '分析', '优化', '重构', '设计'],
      medium: ['创建', '修改', '查询', '比较'],
      low: ['简单', '快速', '基本', '查看']
    };

    let score = 0;
    keywords.high.forEach(kw => {
      if (userRequest.includes(kw)) score += 3;
    });
    keywords.medium.forEach(kw => {
      if (userRequest.includes(kw)) score += 1;
    });
    keywords.low.forEach(kw => {
      if (userRequest.includes(kw)) score -= 1;
    });

    // 长度因素
    if (userRequest.length > 100) score += 2;
    if (userRequest.length > 500) score += 3;

    return {
      score,
      level: score >= 5 ? 'high' : score >= 2 ? 'medium' : 'low',
      needReview: score >= 3 // 复杂度>=3 需要大模型审查
    };
  }
}

/**
 * 简化的任务执行（适用于简单任务）
 * 只使用小模型，跳过审查步骤
 */
export async function quickExecute(userRequest, context = {}) {
  const planner = new TaskPlanner();
  
  // 评估复杂度
  const complexity = planner.evaluateComplexity(userRequest);
  
  if (complexity.needReview) {
    // 复杂任务，使用完整流程
    return await planner.processTask(userRequest, context);
  } else {
    // 简单任务，直接执行
    const plan = await planner.understandAndPlan(userRequest, context);
    const result = await planner.executePlan(plan, userRequest, context);
    return {
      plan,
      result,
      quickMode: true,
      model: planner.smallModel
    };
  }
}

// 导出单例
export const taskPlanner = new TaskPlanner();
