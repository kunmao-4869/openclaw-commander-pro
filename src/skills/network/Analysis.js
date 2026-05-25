/**
 * AI 分析技能
 * 对搜索结果进行深度分析
 */

import { SecureSkill } from '../core/SecureSkill.js';
import { openClawClient } from '../../lib/openclaw.js';

export class AnalyzeSearchResultsSkill extends SecureSkill {
  constructor() {
    super({
      name: 'analyze_search_results',
      description: '分析搜索结果，提供深度见解',
      category: '分析工具',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
    
    this.model = 'qwen3:8b'; // 使用小模型进行分析
  }

  validate(params) {
    if (!params.query) {
      return { valid: false, error: '需要提供原始搜索词' };
    }

    // 允许 results 为空或不存在，AI 可以自主分析
    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      // 如果没有提供 results 或为空，AI 自主分析
      if (!params.results || params.results.length === 0) {
        const aiPrompt = `请对以下主题进行深入分析：

${params.query}

请从以下方面进行分析：
1. 核心概念和要点
2. 关键技术和方法
3. 应用场景
4. 最佳实践建议
5. 常见问题和解决方案

请提供详细的分析报告。`;

        const response = await openClawClient.chat(this.model, [
          {
            role: 'system',
            content: '你是一个专业的分析专家，善于深入分析技术问题并提供有价值的见解。'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ], {
          temperature: 0.5,
          maxTokens: 2048
        });

        return {
          success: true,
          analysis: response,
          resultsCount: 0,
          note: '自主分析（未提供搜索结果）'
        };
      }

      // 整理搜索结果
      const searchContext = params.results.map((r, i) => 
        `[${i + 1}] ${r.title || '无标题'}\n${r.text || r.snippet || r.summary || r.content || ''}\n`
      ).join('\n---\n');

      // 构建分析提示
      const analysisPrompt = `请对以下搜索结果进行深度分析：

搜索词：${params.query}

搜索结果：
${searchContext}

请提供：
1. 核心要点总结（3-5 个关键点）
2. 不同来源的观点对比
3. 信息的可信度评估
4. 可能遗漏的角度
5. 进一步研究的建议

请用清晰的结构化格式回答：`;

      // 使用大模型进行分析
      const model = params.model || 'qwen3:8b'; // 使用小模型提高速度
      const analysis = await openClawClient.chat(model, [
        { role: 'system', content: '你是一个专业的信息分析助手，擅长深度分析和批判性思考。' },
        { role: 'user', content: analysisPrompt }
      ], {
        temperature: 0.5,
        maxTokens: 2048,
        timeout: 180000 // 3 分钟超时
      });

      this.log('analyze_results', { query: params.query }, { 
        resultsCount: params.results.length,
        model,
      });
      
      return {
        success: true,
        query: params.query,
        analysis,
        sourcesCount: params.results.length,
        model,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.log('analyze_results_error', params, error.message);
      throw error;
    }
  }
}

export class CompareSourcesSkill extends SecureSkill {
  constructor() {
    super({
      name: 'compare_sources',
      description: '对比多个信息来源，识别差异和共识',
      category: '分析工具',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
    
    this.model = 'qwen3:30b'; // 使用大模型进行对比分析
  }

  validate(params) {
    if (!params.sources || !Array.isArray(params.sources)) {
      // 允许空数组，AI 会生成示例内容
      return { valid: true };
    }

    // 不强制要求至少 2 个来源，1 个也可以分析
    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      // 如果没有提供 sources 或为空，AI 自主分析
      if (!params.sources || params.sources.length === 0) {
        const aiPrompt = `请对以下主题进行多维度对比分析：

${params.topic || '不同技术方案'}

请从以下方面进行对比：
1. 各方案的优缺点
2. 适用场景
3. 性能对比
4. 推荐建议

请提供结构化的对比分析报告。`;

        const response = await openClawClient.chat(this.model, [
          {
            role: 'system',
            content: '你是一个专业的对比分析专家，善于从多个角度对比不同方案。'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ], {
          temperature: 0.5,
          maxTokens: 2048
        });

        return {
          success: true,
          comparison: response,
          sourcesCount: 0,
          note: '自主对比分析（未提供具体来源）'
        };
      }

      // 整理来源信息
      const sourcesText = params.sources.map((s, i) => 
        `来源 ${i + 1}: ${s.name || `来源${i + 1}`}\n内容：${s.content || s.text || s}\n`
      ).join('\n---\n');

      const comparePrompt = `请对比以下信息来源，分析它们的异同：

${sourcesText}

请提供：
1. 各来源的共识点
2. 各来源的分歧点
3. 可能的偏见或立场
4. 哪个来源更可信（及原因）
5. 综合结论

请用对比表格和文字说明相结合的方式回答：`;

      const comparison = await openClawClient.chat(params.model || 'qwen3:8b', [
        { role: 'system', content: '你是一个专业的信息对比分析助手。' },
        { role: 'user', content: comparePrompt }
      ], {
        temperature: 0.3,
        maxTokens: 2048,
        timeout: 180000
      });

      this.log('compare_sources', {}, { 
        sourcesCount: params.sources.length,
      });
      
      return {
        success: true,
        comparison,
        sourcesCount: params.sources.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.log('compare_sources_error', params, error.message);
      throw error;
    }
  }
}
