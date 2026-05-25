/**
 * AI 驱动的 HarmonyOS 代码生成器
 * 基于实际需求和设计文档，使用大模型生成真正的代码
 * 不使用预设模板，每次都是 AI 创作
 */

import { openClawClient } from '../lib/openclaw.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export class AIHarmonyOSGenerator {
  constructor() {
    this.model = 'qwen3:30b'; // 使用大模型进行代码生成
    this.generatedModules = new Map();
  }

  /**
   * 读取并分析需求文档
   */
  async analyzeRequirement(requirementPath) {
    console.log(`\n📖 读取需求文档：${requirementPath}`);
    
    let requirementContent = '';
    try {
      requirementContent = readFileSync(requirementPath, 'utf-8');
    } catch (error) {
      throw new Error(`无法读取需求文档：${error.message}`);
    }
    
    console.log(`📊 需求文档长度：${requirementContent.length} 字符`);
    
    // 使用 AI 分析需求
    const analysisPrompt = `你是一个专业的 HarmonyOS 应用架构师。请分析以下项目需求文档，并提取关键信息：

需求文档内容：
${requirementContent}

请提取以下信息（JSON 格式）：
1. 项目名称和描述
2. 核心功能列表
3. 需要的页面列表（每个页面的名称、功能描述）
4. 每个页面需要的 UI 组件
5. 状态管理需求
6. 导航需求
7. 特殊要求（如动画、主题等）

只返回 JSON，不要其他内容。格式如下：
{
  "projectName": "项目名称",
  "description": "项目描述",
  "pages": [
    {
      "name": "页面名称",
      "filename": "页面文件名.ets",
      "description": "页面功能描述",
      "components": ["组件 1", "组件 2"],
      "features": ["功能 1", "功能 2"]
    }
  ],
  "commonFeatures": ["全局功能 1", "全局功能 2"]
}`;

    try {
      const analysisResult = await openClawClient.chat(this.model, [
        {
          role: 'system',
          content: '你是一个专业的 HarmonyOS 应用架构师，擅长分析需求并设计应用架构。'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ], {
        temperature: 0.3,
        maxTokens: 4096
      }, 'architecture');

      const analysis = JSON.parse(analysisResult.trim());
      console.log('✅ 需求分析完成');
      console.log(`   项目名称：${analysis.projectName}`);
      console.log(`   页面数量：${analysis.pages?.length || 0}`);
      
      return analysis;
    } catch (error) {
      console.error('❌ 需求分析失败:', error);
      throw error;
    }
  }

  /**
   * 生成单个页面的代码
   */
  async generatePage(pageInfo, projectAnalysis, outputPath) {
    console.log(`\n🎨 生成页面：${pageInfo.name} (${pageInfo.filename})`);
    
    const generationPrompt = `你是一个资深的 HarmonyOS 应用开发工程师。请根据以下需求和设计，编写完整的页面代码。

## 项目信息
- 项目名称：${projectAnalysis.projectName}
- 项目描述：${projectAnalysis.description}

## 当前页面信息
- 页面名称：${pageInfo.name}
- 文件名：${pageInfo.filename}
- 功能描述：${pageInfo.description}
- 需要的组件：${pageInfo.components?.join(', ') || '标准组件'}
- 特殊功能：${pageInfo.features?.join(', ') || '无'}

## 全局功能
${projectAnalysis.commonFeatures?.join(', ') || '标准功能'}

## 代码要求
1. 使用 ArkTS 语言
2. 使用 V2 装饰器（@Observed, @Watch 等）
3. 遵循 MVVM 架构模式
4. 代码要有详细的注释
5. 包含完整的生命周期方法
6. 实现真正的业务逻辑，不要 TODO 注释
7. 使用真实的资源引用（$r('app.media.xxx')）
8. 包含错误处理和用户反馈

请生成完整的 .ets 文件代码，包括：
- 导入语句
- 数据模型定义（使用@Observed）
- 组件定义（使用@Entry, @Component）
- 状态管理（使用@State, @Prop, @Link, @Watch）
- 生命周期方法
- UI 构建（build 方法）
- 业务逻辑方法

只返回代码，不要其他内容。`;

    try {
      console.log(`   🤖 使用模型：${this.model}`);
      console.log(`   📝 生成中...`);
      
      const code = await openClawClient.chat(this.model, [
        {
          role: 'system',
          content: '你是一个资深的 HarmonyOS 应用开发工程师，擅长编写高质量、可维护的 ArkTS 代码。'
        },
        {
          role: 'user',
          content: generationPrompt
        }
      ], {
        temperature: 0.7,
        maxTokens: 8192,
        timeout: 600000 // 10 分钟超时
      }, 'complex_code');

      // 保存代码
      const fullPath = join(outputPath, pageInfo.filename);
      writeFileSync(fullPath, code, 'utf-8');
      
      console.log(`   ✅ 代码生成完成`);
      console.log(`   📄 代码行数：${code.split('\n').length}`);
      console.log(`   💾 已保存到：${fullPath}`);
      
      this.generatedModules.set(pageInfo.filename, {
        code,
        path: fullPath,
        generatedAt: new Date().toISOString()
      });
      
      return {
        filename: pageInfo.filename,
        path: fullPath,
        code,
        lines: code.split('\n').length
      };
    } catch (error) {
      console.error(`   ❌ 生成失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 生成完整的项目
   */
  async generateProject(requirementPath, outputPath) {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║  AI 驱动的 HarmonyOS 项目生成器                  ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
    
    // 1. 分析需求
    const projectAnalysis = await this.analyzeRequirement(requirementPath);
    
    // 2. 创建输出目录
    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true });
      console.log(`📁 创建输出目录：${outputPath}`);
    }
    
    // 3. 生成每个页面
    const results = [];
    for (const pageInfo of projectAnalysis.pages) {
      try {
        const result = await this.generatePage(pageInfo, projectAnalysis, outputPath);
        results.push(result);
      } catch (error) {
        console.error(`❌ 页面 ${pageInfo.filename} 生成失败：${error.message}`);
        results.push({
          filename: pageInfo.filename,
          error: error.message
        });
      }
    }
    
    // 4. 生成项目总结
    const summary = {
      projectName: projectAnalysis.projectName,
      generatedAt: new Date().toISOString(),
      totalPages: projectAnalysis.pages.length,
      successfulPages: results.filter(r => !r.error).length,
      failedPages: results.filter(r => r.error).length,
      modules: results
    };
    
    // 保存总结
    const summaryPath = join(outputPath, 'generation-summary.json');
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
    
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║  ✅ 项目生成完成                              ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
    console.log(`📊 生成统计:`);
    console.log(`   总页面数：${summary.totalPages}`);
    console.log(`   成功：${summary.successfulPages}`);
    console.log(`   失败：${summary.failedPages}`);
    console.log(`   输出目录：${outputPath}`);
    console.log(`   总结文件：${summaryPath}\n`);
    
    return summary;
  }

  /**
   * 审查生成的代码质量
   */
  async reviewCode(code, pageInfo) {
    console.log(`\n🔍 审查代码：${pageInfo.filename}`);
    
    const reviewPrompt = `你是一个资深的代码审查专家。请审查以下 HarmonyOS 代码：

页面名称：${pageInfo.name}
文件名：${pageInfo.filename}

代码内容：
${code}

请从以下维度审查（JSON 格式）：
1. 代码质量评分（1-10）
2. 发现的优点
3. 发现的问题
4. 改进建议
5. 是否符合 HarmonyOS 最佳实践
6. 是否有 TODO 注释（不应该有）
7. 业务逻辑是否完整

只返回 JSON，格式如下：
{
  "quality": 8,
  "strengths": ["优点 1", "优点 2"],
  "issues": ["问题 1", "问题 2"],
  "suggestions": ["建议 1", "建议 2"],
  "bestPractices": true/false,
  "hasTODO": true/false,
  "logicComplete": true/false
}`;

    try {
      const review = await openClawClient.chat(this.model, [
        {
          role: 'system',
          content: '你是一个严格的代码审查专家，善于发现代码问题并提出改进建议。'
        },
        {
          role: 'user',
          content: reviewPrompt
        }
      ], {
        temperature: 0.2,
        maxTokens: 4096
      }, 'code_review');

      const reviewResult = JSON.parse(review.trim());
      
      console.log(`   质量评分：${reviewResult.quality}/10`);
      console.log(`   优点：${reviewResult.strengths?.length || 0}`);
      console.log(`   问题：${reviewResult.issues?.length || 0}`);
      console.log(`   最佳实践：${reviewResult.bestPractices ? '✅' : '❌'}`);
      console.log(`   逻辑完整：${reviewResult.logicComplete ? '✅' : '❌'}`);
      
      return reviewResult;
    } catch (error) {
      console.error('   ❌ 审查失败:', error);
      return null;
    }
  }
}

// 导出单例
export const aiHarmonyOSGenerator = new AIHarmonyOSGenerator();
