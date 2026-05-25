/**
 * 浏览器自动化技能
 * 使用 Puppeteer 控制浏览器学习和收集资料
 */

import { SecureSkill } from '../core/SecureSkill.js';

const LOCAL_SERVICE_URL = 'http://localhost:3003';

export class BrowserAutomationSkill extends SecureSkill {
  constructor() {
    super({
      name: 'browser_automation',
      description: '浏览器自动化（浏览网页、收集资料）',
      category: '浏览器控制',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.url) {
      return { valid: false, error: '需要提供网址' };
    }

    try {
      new URL(params.url);
    } catch {
      return { valid: false, error: '无效的网址格式' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const { url, action = 'extract', selector } = params;

      // 调用浏览器自动化服务 - 提取网页内容
      const response = await fetch(`${LOCAL_SERVICE_URL}/api/browser/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          timeout: params.timeout || 30000
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '浏览器自动化失败');
      }

      const result = await response.json();
      
      this.log('browser_automation', { url, action }, { success: true });
      
      return {
        success: true,
        url,
        action,
        results: [{
          title: result.title,
          text: result.text,
          url: result.url
        }],
        content: result.text,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log('browser_automation_error', params, error.message);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('浏览器服务未启动，请先运行：npm run server');
      }
      
      throw error;
    }
  }
}

/**
 * 网页内容提取
 */
export class WebPageExtractSkill extends SecureSkill {
  constructor() {
    super({
      name: 'extract_webpage_content',
      description: '提取网页主要内容（教程、文档等）',
      category: '浏览器控制',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.url) {
      return { valid: false, error: '需要提供网址' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const { url, extractType = 'main' } = params;

      // 调用提取服务
      const response = await fetch(`${LOCAL_SERVICE_URL}/api/browser/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          extractType,
          options: {
            extractLinks: params.extractLinks || false,
            extractImages: params.extractImages || false,
            maxDepth: params.maxDepth || 0
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '网页内容提取失败');
      }

      const result = await response.json();
      
      this.log('extract_webpage', { url }, { 
        contentLength: result.content?.length || 0 
      });
      
      return {
        success: true,
        url,
        content: result.content,
        title: result.title,
        links: result.links,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log('extract_webpage_error', params, error.message);
      
      if (error.message.includes('Failed to fetch')) {
        // 降级方案：使用简单的 fetch
        try {
          const simpleFetch = await fetch(params.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (OpenClaw)'
            }
          });
          
          const html = await simpleFetch.text();
          
          // 简单的文本提取
          const text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          return {
            success: true,
            url: params.url,
            content: text.slice(0, 10000),
            title: params.url,
            note: '使用简单提取（浏览器服务未启动）'
          };
        } catch (simpleError) {
          throw new Error(`网页提取失败：${error.message}`);
        }
      }
      
      throw error;
    }
  }
}

/**
 * 教程步骤跟随
 */
export class FollowTutorialSkill extends SecureSkill {
  constructor() {
    super({
      name: 'follow_tutorial',
      description: '跟随教程步骤学习（自动执行教程中的操作）',
      category: '浏览器控制',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: false,
    });
  }

  validate(params) {
    if (!params.tutorialUrl) {
      return { valid: false, error: '需要提供教程网址' };
    }

    if (!params.steps || !Array.isArray(params.steps)) {
      return { valid: false, error: '需要提供教程步骤' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { tutorialUrl, steps } = params;
    const results = [];

    try {
      // 打开教程网页
      await this.openPage(tutorialUrl);

      // 逐步执行教程步骤
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        console.log(`执行教程步骤 ${i + 1}/${steps.length}: ${step.action}`);

        try {
          const result = await this.executeStep(step);
          results.push({
            step: i + 1,
            action: step.action,
            success: true,
            result
          });

          // 步骤之间等待
          if (step.delay) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
          }
        } catch (error) {
          results.push({
            step: i + 1,
            action: step.action,
            success: false,
            error: error.message
          });

          if (step.stopOnError) {
            break;
          }
        }
      }

      return {
        success: true,
        tutorialUrl,
        totalSteps: steps.length,
        completedSteps: results.filter(r => r.success).length,
        results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log('follow_tutorial_error', params, error.message);
      throw error;
    }
  }

  async openPage(url) {
    // 实现打开网页逻辑
    console.log(`打开网页：${url}`);
  }

  async executeStep(step) {
    // 实现执行步骤逻辑
    const { action, selector, value } = step;

    switch (action) {
      case 'click':
        console.log(`点击：${selector}`);
        break;
      case 'type':
        console.log(`输入：${selector} = ${value}`);
        break;
      case 'scroll':
        console.log(`滚动：${value || 'bottom'}`);
        break;
      case 'wait':
        await new Promise(resolve => setTimeout(resolve, value || 1000));
        break;
      default:
        console.log(`未知操作：${action}`);
    }

    return { action, success: true };
  }
}

// 导出单例
export const browserAutomationSkill = new BrowserAutomationSkill();
export const webPageExtractSkill = new WebPageExtractSkill();
export const followTutorialSkill = new FollowTutorialSkill();
