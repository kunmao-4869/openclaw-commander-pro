/**
 * 网络搜索技能
 * 安全的只读网络搜索，不泄露用户数据
 */

import { SecureSkill } from '../core/SecureSkill.js';

export class WebSearchSkill extends SecureSkill {
  constructor() {
    super({
      name: 'web_search',
      description: '网络搜索（只读，获取实时信息）',
      category: '网络工具',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.query) {
      return { valid: false, error: '缺少搜索关键词' };
    }

    if (params.query.length > 200) {
      return { valid: false, error: '搜索关键词过长（最大 200 字符）' };
    }

    // 防止注入攻击
    const forbiddenChars = ['<', '>', '"', "'", '&'];
    for (const char of forbiddenChars) {
      if (params.query.includes(char)) {
        return { valid: false, error: '搜索词包含非法字符' };
      }
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const query = encodeURIComponent(params.query);
      const limit = params.limit || 10;
      
      // 尝试使用多个备选 API
      const apis = [
        // 1. DuckDuckGo（首选，但可能超时）
        {
          url: `https://api.duckduckgo.com/?q=${query}&format=json&no_redirect=1`,
          name: 'duckduckgo'
        },
        // 2. 备用：使用后端浏览器搜索（避免 CORS）
        {
          url: 'http://localhost:3003/api/browser/search',
          name: 'backend-browser',
          method: 'POST',
          body: { query: params.query, engine: 'bing' }
        }
      ];

      let results = [];
      let source = 'unknown';

      // 尝试第一个 API（DuckDuckGo）
      try {
        const response = await fetch(apis[0].url, {
          headers: {
            'User-Agent': 'OpenClaw-Commander/1.0',
          },
          signal: AbortSignal.timeout(5000) // 5 秒超时
        });

        if (response.ok) {
          const data = await response.json();
          results = this.parseDuckDuckGo(data, limit);
          source = 'duckduckgo';
        }
      } catch (fetchError) {
        console.warn('DuckDuckGo API 失败，尝试备选方案');
      }

      // 如果 DuckDuckGo 失败，使用后端浏览器搜索作为备选
      if (results.length === 0) {
        console.log('🔄 使用后端浏览器搜索备选方案');
        try {
          const backendApi = apis[1];
          const response = await fetch(backendApi.url, {
            method: backendApi.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendApi.body),
            signal: AbortSignal.timeout(15000) // 15 秒超时（浏览器搜索较慢）
          });

          if (response.ok) {
            const data = await response.json();
            results = data.results || [];
            source = 'backend-browser';
          }
        } catch (backendError) {
          console.warn('后端浏览器搜索失败:', backendError.message);
          throw new Error('所有搜索方式都失败了，请检查后端服务是否运行');
        }
      }

      if (results.length === 0) {
        throw new Error('未找到搜索结果');
      }

      this.log('web_search', { query: params.query, source }, { results: results.length });
      
      return {
        success: true,
        query: params.query,
        results,
        total: results.length,
        source,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.log('web_search_error', params, error.message);
      throw new Error(`网络搜索失败：${error.message}`);
    }
  }

  // 解析 DuckDuckGo 结果
  parseDuckDuckGo(data, limit) {
    const results = [];
    
    // 添加摘要
    if (data.AbstractText) {
      results.push({
        title: data.Heading || '摘要',
        text: data.AbstractText,
        url: data.AbstractURL || '',
        type: 'abstract',
      });
    }
    
    // 添加相关主题
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      for (const topic of data.RelatedTopics.slice(0, limit)) {
        if (topic.FirstURL) {
          results.push({
            title: topic.Text?.split(' - ')[0] || '相关内容',
            text: topic.Text || '',
            url: topic.FirstURL,
            type: 'related',
            icon: topic.Icon?.URL || '',
          });
        }
      }
    }
    
    return results;
  }

  // 解析必应搜索结果（简化版）
  parseBingResults(html, limit) {
    const results = [];
    // 实际项目中应使用更完善的 HTML 解析器
    // 这里返回一个提示，说明使用了必应搜索
    results.push({
      title: '必应搜索结果',
      text: '已切换到必应搜索引擎，建议在实际项目中集成必应 API',
      url: 'https://cn.bing.com/',
      type: 'info',
    });
    return results;
  }
}

export class WikipediaSearchSkill extends SecureSkill {
  constructor() {
    super({
      name: 'wikipedia_search',
      description: '维基百科搜索（只读，获取百科知识）',
      category: '网络工具',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.query) {
      return { valid: false, error: '缺少搜索关键词' };
    }

    if (params.query.length > 100) {
      return { valid: false, error: '搜索关键词过长' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const query = encodeURIComponent(params.query);
      const limit = params.limit || 5;
      
      // 维基百科 API
      const url = `https://zh.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*&srlimit=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'OpenClaw-Commander/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`维基百科 API 返回错误：${response.status}`);
      }

      const data = await response.json();
      
      const results = data.query?.search?.map(item => ({
        title: item.title,
        snippet: item.snippet,
        url: `https://zh.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
        timestamp: item.timestamp,
        wordCount: item.wordcount,
      })) || [];

      this.log('wikipedia_search', { query: params.query }, { results: results.length });
      
      return {
        success: true,
        query: params.query,
        results,
        total: results.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.log('wikipedia_search_error', params, error.message);
      throw error;
    }
  }
}

export class NewsSearchSkill extends SecureSkill {
  constructor() {
    super({
      name: 'news_search',
      description: '新闻搜索（只读，获取最新新闻）',
      category: '网络工具',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.query) {
      return { valid: false, error: '缺少搜索关键词' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const query = encodeURIComponent(params.query);
      
      // 使用 Google News RSS（需要解析）
      // 这里使用一个简单的替代方案
      const url = `https://api.duckduckgo.com/?q=${query}+news&format=json&no_redirect=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'OpenClaw-Commander/1.0',
        },
      });

      const data = await response.json();
      
      const results = [];
      
      if (data.RelatedTopics) {
        for (const topic of data.RelatedTopics.slice(0, 10)) {
          if (topic.FirstURL && topic.Text) {
            results.push({
              title: topic.Text.split(' - ')[0] || '新闻',
              summary: topic.Text,
              url: topic.FirstURL,
              source: 'DuckDuckGo News',
            });
          }
        }
      }

      this.log('news_search', { query: params.query }, { results: results.length });
      
      return {
        success: true,
        query: params.query,
        results,
        total: results.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.log('news_search_error', params, error.message);
      throw error;
    }
  }
}
