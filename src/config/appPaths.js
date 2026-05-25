/**
 * 常用应用程序路径配置
 * 用于 launch_application 技能快速启动应用
 */

export const appPaths = {
  // 音乐类
  'netease-music': {
    name: '网易云音乐',
    path: 'C:\\Program Files (x86)\\Netease\\CloudMusic\\cloudmusic.exe',
    category: '音乐',
    icon: 'music'
  },
  
  // 短视频类
  'douyin': {
    name: '抖音',
    path: 'E:\\抖音\\douyin\\douyin.exe',
    category: '娱乐',
    icon: 'video'
  },
  
  // AI 助手类
  'doubao': {
    name: '豆包',
    path: 'C:\\Users\\Perfo\\AppData\\Local\\Doubao\\Application\\Doubao.exe',
    category: 'AI 助手',
    icon: 'bot'
  },
  
  // 开发工具类
  'intellij-idea': {
    name: 'IntelliJ IDEA',
    path: 'E:\\IDEA\\25.3\\IntelliJ IDEA 2025.3.3\\bin\\idea64.exe',
    category: '开发工具',
    icon: 'code'
  },
  
  'devecostudio': {
    name: 'DevEco Studio',
    path: 'E:\\DevEco\\Dev Eco6.0.1\\DevEco Studio\\bin\\devecostudio64.exe',
    category: '开发工具',
    icon: 'code'
  },
  
  // 浏览器类
  'edge': {
    name: 'Microsoft Edge',
    path: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--profile-directory=Default'],
    category: '浏览器',
    icon: 'globe'
  },
  
  'trae': {
    name: 'Trae CN',
    path: 'E:\\Trae\\Trae CN\\Trae CN.exe',
    category: '编辑器',
    icon: 'code'
  },
  
  // 社交类
  'qq': {
    name: 'QQ',
    path: 'C:\\Program Files\\Tencent\\QQNT\\QQ.exe',
    category: '社交',
    icon: 'message'
  },
  
  'wechat': {
    name: '微信',
    path: 'C:\\Program Files\\Tencent\\Weixin\\Weixin.exe',
    category: '社交',
    icon: 'message'
  }
};

/**
 * 根据应用名称或 ID 查找应用路径
 * @param {string} appName - 应用名称或 ID
 * @returns {object|null} 应用配置对象或 null
 */
export function findAppPath(appName) {
  if (!appName) return null;
  
  const normalizedName = appName.toLowerCase().trim();
  
  // 直接匹配 ID
  if (appPaths[normalizedName]) {
    return appPaths[normalizedName];
  }
  
  // 匹配中文名称
  for (const [id, config] of Object.entries(appPaths)) {
    if (config.name.toLowerCase() === normalizedName || 
        config.name.includes(normalizedName) ||
        normalizedName.includes(config.name.toLowerCase())) {
      return config;
    }
  }
  
  // 匹配关键词
  const keywords = {
    '网易': 'netease-music',
    '云音乐': 'netease-music',
    'music': 'netease-music',
    '抖音': 'douyin',
    '豆包': 'doubao',
    'idea': 'intellij-idea',
    'intellij': 'intellij-idea',
    'edge': 'edge',
    'trae': 'trae',
    'qq': 'qq',
    '微信': 'wechat',
    'weixin': 'wechat',
    'dev': 'devecostudio',
    'deveco': 'devecostudio'
  };
  
  for (const [keyword, id] of Object.entries(keywords)) {
    if (normalizedName.includes(keyword)) {
      return appPaths[id];
    }
  }
  
  return null;
}

/**
 * 获取所有已配置的应用列表
 * @returns {Array} 应用列表
 */
export function getAllApps() {
  return Object.entries(appPaths).map(([id, config]) => ({
    id,
    ...config
  }));
}

/**
 * 按类别分组获取应用
 * @returns {Object} 按类别分组的应用对象
 */
export function getAppsByCategory() {
  const categories = {};
  
  for (const [id, config] of Object.entries(appPaths)) {
    if (!categories[config.category]) {
      categories[config.category] = [];
    }
    categories[config.category].push({
      id,
      ...config
    });
  }
  
  return categories;
}
