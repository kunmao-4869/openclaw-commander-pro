/**
 * OpenClaw API 客户端
 * 直接连接 OpenClaw，支持双模型调用
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';

export class OpenClawClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || OLLAMA_BASE_URL;
    this.defaultTimeout = config.timeout || 120000; // 默认 2 分钟
  }

  /**
   * 根据任务复杂度计算超时时间
   * @param {string} prompt - 请求内容
   * @param {string} taskType - 任务类型
   * @returns {number} 超时时间（毫秒）
   */
  calculateTimeout(prompt, taskType = 'general') {
    const charCount = prompt.length;
    const wordCount = prompt.split(/\s+/).length;
    
    // 基础超时
    let timeout = this.defaultTimeout;
    
    // 根据任务类型调整
    const typeMultipliers = {
      'general': 1.0,
      'code_review': 1.5,
      'project_plan': 2.5,  // 增加 project_plan 的倍数
      'complex_code': 3.0,
      'architecture': 3.5
    };
    
    const multiplier = typeMultipliers[taskType] || 1.0;
    timeout *= multiplier;
    
    // 根据内容长度调整
    if (charCount > 5000) {
      timeout *= 1.5;
    }
    if (charCount > 10000) {
      timeout *= 2.5;  // 增加大内容的超时倍数
    }
    if (charCount > 20000) {
      timeout *= 3.5;  // 超大内容
    }
    
    // 最大不超过 15 分钟（900 秒）
    return Math.min(timeout, 900000);
  }

  /**
   * 发送聊天消息
   * @param {string} model - 模型名称 (qwen3:8b 或 qwen3:30b)
   * @param {Array} messages - 消息历史 [{role, content}]
   * @param {object} options - 可选配置
   * @param {string} taskType - 任务类型（用于计算超时）
   * @returns {Promise<string>} AI 回复
   */
  async chat(model, messages, options = {}, taskType = 'general') {
    const url = `${this.baseUrl}/api/chat`;
    
    // 模型角色映射
    const modelRoles = {
      'qwen3:8b': '🚀 小模型 (规划)',
      'qwen3:30b': '🧠 大模型 (审查)',
      'qwen2.5:7b': '💬 备用模型'
    };
    
    const modelRole = modelRoles[model] || `🤖 ${model}`;
    const prompt = messages.map(m => m.content).join('\n');
    const promptLength = prompt.length;
    
    console.log(`\n${modelRole} 正在处理任务...`);
    console.log(`   任务类型：${taskType}`);
    console.log(`   内容长度：${promptLength} 字符`);
    
    const payload = {
      model,
      messages,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        keep_alive: '1m', // 1 分钟后自动卸载模型，释放内存
        ...options,
      },
    };

    // 计算动态超时 - 优先使用显式 timeout 设置
    const timeout = options.timeout || this.calculateTimeout(prompt, taskType);
    
    console.log(`   超时设置：${timeout / 1000}秒`);
    console.log(`   内存优化：启用 1 分钟自动卸载\n`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message?.content || '';
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`请求超时（${timeout / 1000}秒），请重试或使用更小的模型`);
      }
      throw error;
    }
  }

  /**
   * 流式聊天（实时输出）
   * @param {string} model - 模型名称
   * @param {Array} messages - 消息历史
   * @param {function} onChunk - 接收数据块的回调
   * @param {object} options - 可选配置
   * @param {string} taskType - 任务类型
   * @returns {Promise<string>} 完整回复
   */
  async chatStream(model, messages, onChunk, options = {}, taskType = 'general') {
    const url = `${this.baseUrl}/api/chat`;
    
    const payload = {
      model,
      messages,
      stream: true,
      options: {
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        ...options,
      },
    };

    // 计算动态超时
    const prompt = messages.map(m => m.content).join('\n');
    const timeout = this.calculateTimeout(prompt, taskType);
    
    console.log(`🕐 流式请求超时设置：${timeout / 1000}秒 (任务类型：${taskType})`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              fullContent += data.message.content;
              onChunk?.(data.message.content);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }

      return fullContent;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`流式请求超时（${timeout / 1000}秒），请重试`);
      }
      throw error;
    }
  }

  /**
   * 检查模型是否可用
   * @param {string} model - 模型名称
   * @returns {Promise<boolean>}
   */
  async isModelAvailable(model) {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.models?.some(m => m.name === model) || false;
    } catch {
      return false;
    }
  }

  /**
   * 获取可用模型列表
   * @returns {Promise<Array>}
   */
  async getAvailableModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map(m => ({
        name: m.name,
        size: m.size,
        modifiedAt: m.modified_at,
      })) || [];
    } catch {
      return [];
    }
  }
}

// 导出单例
export const openClawClient = new OpenClawClient();
