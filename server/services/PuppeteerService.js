/**
 * Puppeteer 浏览器控制服务
 * 用于控制 Web 应用（抖音、微信网页版等）
 */

import puppeteer from 'puppeteer-core';

// 浏览器配置
const BROWSER_CONFIG = {
  // 使用 Edge 的可执行路径（因为用户已安装）
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920,1080'
  ]
};

// 常用 Web 应用配置
const WEB_APPS = {
  'douyin': {
    name: '抖音网页版',
    url: 'https://www.douyin.com',
    selectors: {
      searchInput: 'input[placeholder*="搜索"]',
      searchButton: 'button[type="submit"]',
      videoItem: '.video-item',
      loginButton: '.login-button'
    }
  },
  'wechat': {
    name: '微信网页版',
    url: 'https://wx.qq.com',
    selectors: {
      chatItem: '.chat-item',
      messageInput: '.message-input',
      sendButton: '.send-button'
    }
  },
  'bilibili': {
    name: '哔哩哔哩',
    url: 'https://www.bilibili.com',
    selectors: {
      searchInput: '#search-input',
      searchButton: '#search-button',
      videoItem: '.video-item'
    }
  }
};

// 浏览器实例管理
const browserInstances = new Map();

/**
 * 获取或创建浏览器实例
 */
async function getBrowser(appName) {
  if (browserInstances.has(appName)) {
    const browser = browserInstances.get(appName);
    // 检查浏览器是否还活着
    try {
      await browser.version();
      return browser;
    } catch (e) {
      browserInstances.delete(appName);
    }
  }

  // 创建新的浏览器实例
  const browser = await puppeteer.launch({
    ...BROWSER_CONFIG,
    headless: false, // 显示浏览器窗口
    defaultViewport: { width: 1920, height: 1080 }
  });

  browserInstances.set(appName, browser);
  
  // 监听浏览器关闭
  browser.on('disconnected', () => {
    browserInstances.delete(appName);
  });

  return browser;
}

/**
 * 关闭浏览器实例
 */
async function closeBrowser(appName) {
  const browser = browserInstances.get(appName);
  if (browser) {
    await browser.close();
    browserInstances.delete(appName);
    return { success: true, message: '浏览器已关闭' };
  }
  return { success: false, message: '浏览器未打开' };
}

/**
 * 打开 Web 应用
 */
export async function openWebApp(appName, options = {}) {
  try {
    const appConfig = WEB_APPS[appName.toLowerCase()];
    
    if (!appConfig) {
      // 如果是自定义 URL
      if (options.url) {
        const browser = await getBrowser('custom');
        const page = await browser.newPage();
        await page.goto(options.url, { waitUntil: 'networkidle2' });
        return {
          success: true,
          message: `已打开网址：${options.url}`,
          browser: 'custom',
          url: options.url
        };
      }
      
      return {
        success: false,
        error: `不支持的 Web 应用：${appName}`
      };
    }

    const browser = await getBrowser(appName);
    const pages = await browser.pages();
    let page = pages[0];
    
    if (!page) {
      page = await browser.newPage();
    }

    // 导航到应用
    await page.goto(appConfig.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    return {
      success: true,
      message: `已打开 ${appConfig.name}`,
      browser: appName,
      url: appConfig.url,
      title: await page.title()
    };
  } catch (error) {
    console.error('打开 Web 应用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 在 Web 应用中搜索
 */
export async function webAppSearch(appName, query) {
  try {
    const appConfig = WEB_APPS[appName.toLowerCase()];
    
    if (!appConfig) {
      return {
        success: false,
        error: `不支持的 Web 应用：${appName}`
      };
    }

    const browsers = await getBrowser(appName);
    const pages = await browsers.pages();
    
    if (pages.length === 0) {
      return {
        success: false,
        error: '请先打开应用'
      };
    }

    const page = pages[0];
    const selectors = appConfig.selectors;

    // 等待搜索框出现
    await page.waitForSelector(selectors.searchInput, { timeout: 5000 });
    
    // 清空搜索框
    await page.click(selectors.searchInput);
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    
    // 输入搜索词
    await page.type(selectors.searchInput, query, { delay: 50 });
    
    // 点击搜索按钮或按 Enter
    if (selectors.searchButton) {
      await page.click(selectors.searchButton);
    } else {
      await page.keyboard.press('Enter');
    }

    // 等待搜索结果
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // 获取搜索结果
    const results = await page.evaluate((selector) => {
      const items = document.querySelectorAll(selector);
      return Array.from(items).slice(0, 10).map(item => ({
        title: item.textContent.trim(),
        link: item.querySelector('a')?.href || ''
      }));
    }, selectors.videoItem || selectors.searchResult);

    return {
      success: true,
      message: `已搜索 "${query}"`,
      results: results,
      count: results.length
    };
  } catch (error) {
    console.error('Web 应用搜索失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 点击页面元素
 */
export async function webAppClick(appName, selector) {
  try {
    const browsers = await getBrowser(appName);
    const pages = await browsers.pages();
    
    if (pages.length === 0) {
      return {
        success: false,
        error: '请先打开应用'
      };
    }

    const page = pages[0];
    await page.click(selector);
    
    return {
      success: true,
      message: `已点击元素：${selector}`
    };
  } catch (error) {
    console.error('Web 应用点击失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 获取页面内容
 */
export async function webAppGetContent(appName) {
  try {
    const browsers = await getBrowser(appName);
    const pages = await browsers.pages();
    
    if (pages.length === 0) {
      return {
        success: false,
        error: '请先打开应用'
      };
    }

    const page = pages[0];
    const content = await page.content();
    const title = await page.title();
    const url = page.url();

    return {
      success: true,
      title,
      url,
      content: content.substring(0, 1000) // 只返回前 1000 字符
    };
  } catch (error) {
    console.error('获取页面内容失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 截图
 */
export async function webAppScreenshot(appName, filename = 'screenshot.png') {
  try {
    const browsers = await getBrowser(appName);
    const pages = await browsers.pages();
    
    if (pages.length === 0) {
      return {
        success: false,
        error: '请先打开应用'
      };
    }

    const page = pages[0];
    const screenshot = await page.screenshot({ 
      fullPage: true,
      path: filename
    });

    return {
      success: true,
      message: '截图已保存',
      path: filename
    };
  } catch (error) {
    console.error('截图失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 关闭所有浏览器
 */
export async function closeAllBrowsers() {
  const promises = [];
  for (const [appName, browser] of browserInstances.entries()) {
    promises.push(browser.close());
  }
  await Promise.all(promises);
  browserInstances.clear();
  
  return {
    success: true,
    message: '已关闭所有浏览器'
  };
}

// 导出 API
export const WebAppController = {
  openWebApp,
  webAppSearch,
  webAppClick,
  webAppGetContent,
  webAppScreenshot,
  closeBrowser,
  closeAllBrowsers,
  getSupportedApps: () => Object.keys(WEB_APPS)
};
