/**
 * 应用程序控制技能
 * 启动、管理本地应用程序
 */

import { SecureSkill } from '../core/SecureSkill.js';
import { findAppPath, getAllApps } from '../../config/appPaths.js';

const LOCAL_SERVICE_URL = 'http://localhost:3003';

export class LaunchAppSkill extends SecureSkill {
  constructor() {
    super({
      name: 'launch_application',
      description: '启动本地应用程序（支持：网易云音乐、抖音、豆包、IntelliJ IDEA、DevEco Studio、Edge 浏览器、Trae、QQ、微信）',
      category: '应用控制',
      isSafe: true,
      requiresConfirmation: true, // 需要用户确认
      readOnly: false,
    });
  }

  validate(params) {
    if (!params.appName) {
      return { valid: false, error: '需要提供应用名称' };
    }

    // 检查是否找到了对应的应用
    const appConfig = findAppPath(params.appName);
    if (!appConfig) {
      return { 
        valid: false, 
        error: `未找到应用"${params.appName}"的配置，支持的应用：${getAllApps().map(a => a.name).join('、')}` 
      };
    }

    return { valid: true, appConfig };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const appConfig = validation.appConfig;

    try {
      // 调用本地服务
      const response = await fetch(`${LOCAL_SERVICE_URL}/api/launch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appName: appConfig.name,
          appPath: appConfig.path,
          args: appConfig.args || [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '启动失败');
      }

      const result = await response.json();
      
      this.log('launch_app', { app: appConfig.name }, { success: true });
      
      return {
        success: true,
        message: `已启动 ${appConfig.name}`,
        app: appConfig.name,
        path: appConfig.path,
        ...result
      };
    } catch (error) {
      this.log('launch_app_error', params, error.message);
      
      // 如果服务未启动，提供友好提示
      if (error.message.includes('Failed to fetch')) {
        throw new Error('本地服务未启动，请先运行：npm run server');
      }
      
      throw error;
    }
  }

  getSuggestions(appName) {
    const appConfig = findAppPath(appName);
    if (appConfig) {
      return `已找到 ${appConfig.name}，路径：${appConfig.path}`;
    }
    
    const suggestions = {
      '抖音': '可以在 Microsoft Store 搜索"抖音"安装，或访问官网下载桌面版',
      'bilibili': '可以在 Microsoft Store 搜索"哔哩哔哩"安装',
      '微信': '可以在 Microsoft Store 搜索"微信"安装',
    };
    
    return suggestions[appName] || `请确认"${appName}"已正确安装`;
  }
}

export class SearchInstalledAppsSkill extends SecureSkill {
  constructor() {
    super({
      name: 'search_installed_apps',
      description: '搜索已安装的应用程序',
      category: '应用控制',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  async execute(params) {
    try {
      const response = await fetch(`${LOCAL_SERVICE_URL}/api/apps`);
      
      if (!response.ok) {
        throw new Error('获取应用列表失败');
      }

      const result = await response.json();
      this.log('search_apps', {}, { count: result.apps?.length || 0 });
      
      return result;
    } catch (error) {
      this.log('search_apps_error', {}, error.message);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('本地服务未启动，请先运行：npm run server');
      }
      
      throw error;
    }
  }
}

export class OpenUrlSkill extends SecureSkill {
  constructor() {
    super({
      name: 'open_url',
      description: '在浏览器中打开网址',
      category: '应用控制',
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

    const url = new URL(params.url);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: '只支持 http/https 协议' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const response = await fetch(`${LOCAL_SERVICE_URL}/api/open-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: params.url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '打开网址失败');
      }

      const result = await response.json();
      this.log('open_url', { url: params.url }, { success: true });
      
      return result;
    } catch (error) {
      this.log('open_url_error', params, error.message);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('本地服务未启动，请先运行：npm run server');
      }
      
      throw error;
    }
  }
}
