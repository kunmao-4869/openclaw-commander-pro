/**
 * Puppeteer 浏览器自动化服务
 * 用于真实浏览器操作、网页内容提取、搜索学习
 */

import puppeteer from 'puppeteer';

class BrowserService {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  // 初始化浏览器
  async init() {
    if (!this.browser) {
      try {
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--disable-blink-features=AutomationControlled',
            '--proxy-server=direct://',
            '--proxy-bypass-list=*'
          ]
        });
        console.log('✅ Puppeteer 浏览器已启动');
      } catch (error) {
        console.error('❌ 启动浏览器失败:', error.message);
        throw new Error(`无法启动浏览器：${error.message}`);
      }
    }
  }

  // 获取或创建新页面（每次操作都使用新页面，避免 frame 分离问题）
  async getNewPage() {
    await this.init();
    
    // 关闭旧页面（如果有）
    if (this.page) {
      try {
        await this.page.close();
      } catch (error) {
        // 忽略关闭错误
      }
    }
    
    // 创建新页面
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 800 });
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    return this.page;
  }

  // 验证页面是否可用
  async ensurePage() {
    if (!this.page) {
      return await this.getNewPage();
    }
    
    // 检查页面是否仍然有效
    try {
      await this.page.evaluate('1');
      return this.page;
    } catch (error) {
      // 页面已损坏，创建新页面
      console.log('⚠️  页面已损坏，重新创建...');
      return await this.getNewPage();
    }
  }

  // 关闭浏览器
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      console.log('🚫 浏览器已关闭');
    }
  }

  // 访问网页并提取内容
  async extractPageContent(url, options = {}) {
    const page = await this.ensurePage();
    
    try {
      console.log(`🌐 访问网页：${url}`);
      
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: options.timeout || 30000
      });

      // 提取主要内容
      const returnHtml = options.returnHtml || false;  // 先在外部获取值
      const content = await page.evaluate((returnHtmlFlag) => {
        // 移除不需要的元素
        const selectorsToRemove = [
          'script', 'style', 'nav', 'footer', 'header',
          '.ads', '.advertisement', '.sidebar',
          '#ads', '#sidebar', '#navigation'
        ];
        
        selectorsToRemove.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // 获取主要内容区域
        const mainContent = document.querySelector('main') || 
                           document.querySelector('article') ||
                           document.querySelector('.content') ||
                           document.querySelector('#content') ||
                           document.body;

        // 提取文本
        const title = document.title;
        const text = mainContent.innerText || '';
        
        // 提取完整 HTML（用于代码块提取）
        const html = mainContent.innerHTML || '';
        
        // 提取链接
        const links = Array.from(document.querySelectorAll('a[href]'))
          .slice(0, 20)
          .map(a => ({
            text: a.innerText?.trim() || '',
            href: a.href
          }))
          .filter(l => l.text.length > 0 && l.href.startsWith('http'));

        return {
          title,
          text: text.slice(0, 50000), // 限制长度
          html: returnHtmlFlag ? html : undefined,  // 只在请求时返回 HTML
          links
        };
      }, returnHtml);  // 传递参数到浏览器环境

      console.log(`✅ 内容提取成功，长度：${content.text.length}`);
      
      const result = {
        success: true,
        url,
        ...content
      };
      
      // 如果请求了 HTML，添加额外信息
      if (options.returnHtml) {
        result.htmlLength = content.html?.length || 0;
      }
      
      return result;
    } catch (error) {
      console.error('❌ 提取内容失败:', error.message);
      
      // 如果是 frame 分离错误，尝试重试
      if (error.message.includes('detached') || error.message.includes('Frame')) {
        console.log('⚠️  检测到 Frame 分离，尝试重试...');
        this.page = null; // 重置页面
        return await this.extractPageContent(url, options); // 重试
      }
      
      throw error;
    }
  }

  // 执行搜索（使用搜索引擎）
  async performSearch(query, engine = 'bing') {
    const page = await this.ensurePage();
    
    // 尝试不同的搜索引擎
    const engines = engine === 'baidu' ? ['baidu', 'bing'] : ['bing', 'baidu'];
    
    for (const searchEngine of engines) {
      try {
        const result = await this.performSearchWithEngine(page, query, searchEngine);
        return result;
      } catch (error) {
        console.warn(`❌ ${searchEngine} 搜索失败：`, error.message);
        // 继续尝试下一个搜索引擎
      }
    }
    
    throw new Error('所有搜索引擎都失败了');
  }
  
  // 使用指定引擎执行搜索
  async performSearchWithEngine(page, query, engine = 'bing') {
    let searchUrl;
    
    if (engine === 'bing') {
      searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    } else if (engine === 'baidu') {
      searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
    } else {
      searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    }

    console.log(`🔍 搜索：${query} (${engine})`);
    
    await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 等待搜索结果加载
    try {
      await page.waitForSelector('#b_results, .b_algo', { timeout: 5000 });
    } catch (error) {
      console.warn('⚠️  等待搜索结果超时，尝试继续提取');
    }

    // 提取搜索结果
    const results = await page.evaluate(() => {
      const items = [];
      
      // Bing 搜索结果 - 使用更准确的选择器
      const bingResults = document.querySelectorAll('li.b_algo, .b_algo');
      
      bingResults.forEach(item => {
        // 标题通常在 h2 标签内的 a 标签
        const titleEl = item.querySelector('h2 a');
        // 描述通常在 .b_caption 或 .b_caption p 中
        const descEl = item.querySelector('.b_caption p') || item.querySelector('.b_caption');
        
        if (titleEl && titleEl.href) {
          items.push({
            title: titleEl.innerText?.trim() || titleEl.textContent?.trim() || '',
            text: descEl?.innerText?.trim() || descEl?.textContent?.trim() || '',
            url: titleEl.href || ''
          });
        }
      });

      // 如果 Bing 结果太少，尝试百度
      if (items.length < 5) {
        const baiduResults = document.querySelectorAll('.result.c-container, .c-container');
        baiduResults.forEach(item => {
          const titleEl = item.querySelector('.t a');
          const descEl = item.querySelector('.c-abstract, .c-showcont');
          
          if (titleEl && titleEl.href) {
            items.push({
              title: titleEl.innerText?.trim() || titleEl.textContent?.trim() || '',
              text: descEl?.innerText?.trim() || descEl?.textContent?.trim() || '',
              url: titleEl.href || ''
            });
          }
        });
      }

      return items.slice(0, 10);
    });

    console.log(`✅ 搜索完成，找到 ${results.length} 条结果`);
    
    // 输出调试信息
    if (results.length > 0) {
      console.log('📊 搜索结果示例:', {
        title: results[0]?.title?.substring(0, 50),
        text: results[0]?.text?.substring(0, 100) || '(空)',
        url: results[0]?.url
      });
    }
    
    return {
      success: true,
      query,
      engine,
      results
    };
  }

  // 截图
  async screenshot(url, outputPath) {
    const page = await this.ensurePage();
    
    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await page.screenshot({
        path: outputPath,
        fullPage: true
      });

      console.log(`📸 截图已保存：${outputPath}`);
      
      return {
        success: true,
        path: outputPath
      };
    } catch (error) {
      console.error('❌ 截图失败:', error.message);
      
      if (error.message.includes('detached') || error.message.includes('Frame')) {
        console.log('⚠️  检测到 Frame 分离，尝试重试...');
        this.page = null;
        return await this.screenshot(url, outputPath);
      }
      
      throw error;
    }
  }

  // 点击元素
  async clickElement(selector) {
    const page = await this.ensurePage();

    try {
      await page.click(selector);
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      
      console.log(`👆 已点击：${selector}`);
      
      return {
        success: true,
        selector
      };
    } catch (error) {
      console.error('❌ 点击失败:', error.message);
      
      if (error.message.includes('detached') || error.message.includes('Frame')) {
        console.log('⚠️  检测到 Frame 分离，尝试重试...');
        this.page = null;
        return await this.clickElement(selector);
      }
      
      throw error;
    }
  }

  // 输入文本
  async typeText(selector, text) {
    const page = await this.ensurePage();

    try {
      await page.type(selector, text);
      console.log(`⌨️  已输入：${text} 到 ${selector}`);
      
      return {
        success: true,
        selector,
        text
      };
    } catch (error) {
      console.error('❌ 输入失败:', error.message);
      
      if (error.message.includes('detached') || error.message.includes('Frame')) {
        console.log('⚠️  检测到 Frame 分离，尝试重试...');
        this.page = null;
        return await this.typeText(selector, text);
      }
      
      throw error;
    }
  }

  // 滚动页面
  async scrollTo(selector) {
    const page = await this.ensurePage();

    try {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, selector);
      
      console.log(`📜 已滚动到：${selector}`);
      
      return {
        success: true,
        selector
      };
    } catch (error) {
      console.error('❌ 滚动失败:', error.message);
      
      if (error.message.includes('detached') || error.message.includes('Frame')) {
        console.log('⚠️  检测到 Frame 分离，尝试重试...');
        this.page = null;
        return await this.scrollTo(selector);
      }
      
      throw error;
    }
  }
}

// 导出单例
export const browserService = new BrowserService();
