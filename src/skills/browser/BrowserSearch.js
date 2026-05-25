/**
 * 浏览器搜索技能
 * 使用 Puppeteer 真实浏览器进行搜索，绕过 API 限制
 */

import { SecureSkill } from '../core/SecureSkill.js';

const LOCAL_SERVICE_URL = 'http://localhost:3003';

export class BrowserSearchSkill extends SecureSkill {
  constructor() {
    super({
      name: 'browser_search',
      description: '使用真实浏览器搜索（绕过 API 限制，比 web_search 更稳定）',
      category: '浏览器控制',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.query) {
      return { valid: false, error: '需要提供搜索关键词' };
    }
    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const { query, engine = 'bing' } = params;
      
      // 构建搜索引擎 URL
      let searchUrl;
      if (engine === 'baidu') {
        searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
      } else if (engine === 'google') {
        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      } else {
        // 默认使用 Bing
        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      }

      console.log(`🔍 使用浏览器搜索：${query} (${engine})`);
      console.log(`URL: ${searchUrl}`);

      // 调用浏览器提取 API - 直接访问搜索结果页面
      const response = await fetch(`${LOCAL_SERVICE_URL}/api/browser/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: searchUrl,
          timeout: 30000
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '浏览器搜索失败');
      }

      const result = await response.json();
      
      // 解析搜索结果
      const searchResults = [];
      if (result.links && result.links.length > 0) {
        for (const link of result.links.slice(0, 10)) {
          searchResults.push({
            title: link.text || '搜索结果',
            text: result.text?.slice(0, 500) || '',
            url: link.href || searchUrl
          });
        }
      } else {
        // 如果没有 links，使用页面内容创建结果
        searchResults.push({
          title: result.title || query,
          text: result.text?.slice(0, 2000) || '',
          url: searchUrl
        });
      }
      
      this.log('browser_search', { query, engine }, { 
        resultsCount: searchResults.length 
      });
      
      return {
        success: true,
        query,
        engine,
        results: searchResults,
        total: searchResults.length,
        pageContent: result.text,
        pageTitle: result.title,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log('browser_search_error', params, error.message);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('浏览器服务未启动，请先运行：npm run server');
      }
      
      throw error;
    }
  }
}

export const browserSearchSkill = new BrowserSearchSkill();
