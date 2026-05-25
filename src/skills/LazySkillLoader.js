/**
 * 技能懒加载系统
 * 按需加载技能，减少初始加载时间
 */

/**
 * 技能模块映射
 * 技能名称 -> 动态导入函数
 */
const skillModules = {
  // 文件操作技能
  'safe_read_file': () => import('./security/SafeFileOperations.js'),
  'smart_read_file': () => import('./advanced/FileSystem.js'),
  'safe_write_file': () => import('./advanced/SafeFileWrite.js'),
  'smart_write_file': () => import('./advanced/SafeFileWrite.js'),
  'safe_search_files': () => import('./security/SafeFileOperations.js'),
  'advanced_search_files': () => import('./advanced/FileSystem.js'),
  'analyze_project_structure': () => import('./advanced/FileSystem.js'),
  'file_system_operations': () => import('./advanced/FileSystemOperations.js'),
  'batch_file_operations': () => import('./advanced/FileSystemOperations.js'),
  'read_requirement': () => import('./file/ReadRequirement.js'),

  // 应用控制技能
  'launch_application': () => import('./application/AppControl.js'),
  'close_application': () => import('./application/AppControl.js'),
  'list_applications': () => import('./application/AppControl.js'),

  // 网络技能
  'web_search': () => import('./network/WebSearch.js'),
  'ping_test': () => import('./network/Analysis.js'),
  'network_info': () => import('./network/Analysis.js'),

  // 系统技能
  'system_info': () => import('./security/SystemInfo.js'),
  'get_disk_usage': () => import('./security/SystemInfo.js'),
  'get_memory_usage': () => import('./security/SystemInfo.js'),
  'get_cpu_usage': () => import('./security/SystemInfo.js'),

  // 浏览器技能
  'browser_search': () => import('./browser/BrowserSearch.js'),
  'browser_screenshot': () => import('./browser/BrowserAutomation.js'),
  'browser_navigate': () => import('./browser/BrowserAutomation.js'),
  'browser_extract_content': () => import('./browser/BrowserAutomation.js'),

  // 学习技能
  'learn_webpage': () => import('./learning/LearnWebpage.js'),
  'batch_learn_webpages': () => import('./learning/LearnWebpage.js'),

  // 自动化控制技能
  'mouse_move': () => import('./automation/MouseKeyboardControl.js'),
  'keyboard_input': () => import('./automation/MouseKeyboardControl.js'),

  // 实用工具技能（已移除，这些文件不存在）
  // 'get_current_time': () => import('./utils/DateTime.js'),
  // 'calculate_expression': () => import('./utils/MathUtils.js'),
  // 'format_json': () => import('./utils/FormatUtils.js'),
  // 'base64_encode': () => import('./utils/FormatUtils.js'),
  // 'base64_decode': () => import('./utils/FormatUtils.js'),

  // 剪贴板技能（已移除，这些文件不存在）
  // 'get_clipboard': () => import('./utils/Clipboard.js'),
  // 'set_clipboard': () => import('./utils/Clipboard.js'),

  // 天气技能（已移除，这个文件不存在）
  // 'get_weather': () => import('./utils/Weather.js'),
};

/**
 * 已加载的技能缓存
 */
const loadedSkills = new Map();

/**
 * 技能类名映射
 */
const skillClassNames = {
  'safe_read_file': 'SafeFileReadSkill',
  'smart_read_file': 'FileSystem',
  'safe_write_file': 'SafeFileWriteSkill',
  'smart_write_file': 'SafeFileWriteSkill',
  'safe_search_files': 'SafeFileSearchSkill',
  'advanced_search_files': 'FileSystem',
  'analyze_project_structure': 'FileSystem',
  'file_system_operations': 'FileSystemOperationsSkill',
  'batch_file_operations': 'BatchFileOperationsSkill',
  'read_requirement': 'ReadRequirementSkill',
  'launch_application': 'LaunchAppSkill',
  'close_application': 'LaunchAppSkill',
  'list_applications': 'SearchInstalledAppsSkill',
  'web_search': 'WebSearchSkill',
  'ping_test': 'PingTestSkill',
  'network_info': 'NetworkInfoSkill',
  'system_info': 'SystemInfoSkill',
  'get_disk_usage': 'SystemInfoSkill',
  'get_memory_usage': 'SystemInfoSkill',
  'get_cpu_usage': 'SystemInfoSkill',
  'browser_search': 'BrowserSearchSkill',
  'browser_screenshot': 'BrowserScreenshotSkill',
  'browser_navigate': 'BrowserNavigateSkill',
  'browser_extract_content': 'BrowserExtractSkill',
  'mouse_move': 'MouseMoveSkill',
  'keyboard_input': 'KeyboardInputSkill',
  'learn_webpage': 'LearnWebpageSkill',
  'batch_learn_webpages': 'BatchLearnWebpagesSkill',
};

/**
 * 技能懒加载器
 */
class LazySkillLoader {
  constructor() {
    this.loadingPromises = new Map();
  }

  /**
   * 加载技能
   * @param {string} skillName - 技能名称
   * @returns {Promise<Class>} 技能类
   */
  async loadSkill(skillName) {
    // 如果已经加载过，直接返回
    if (loadedSkills.has(skillName)) {
      return loadedSkills.get(skillName);
    }

    // 如果正在加载，返回加载 Promise
    if (this.loadingPromises.has(skillName)) {
      return this.loadingPromises.get(skillName);
    }

    // 开始加载
    const loadPromise = this._loadSkillInternal(skillName);
    this.loadingPromises.set(skillName, loadPromise);

    try {
      const skillClass = await loadPromise;
      loadedSkills.set(skillName, skillClass);
      return skillClass;
    } finally {
      this.loadingPromises.delete(skillName);
    }
  }

  /**
   * 内部加载逻辑
   */
  async _loadSkillInternal(skillName) {
    const importFn = skillModules[skillName];

    if (!importFn) {
      throw new Error(`技能不存在：${skillName}`);
    }

    try {
      // 动态导入模块
      const module = await importFn();

      // 获取技能类
      const className = skillClassNames[skillName];

      if (!className) {
        throw new Error(`技能类名未定义：${skillName}`);
      }

      const skillClass = module[className];

      if (!skillClass) {
        throw new Error(`技能类 ${className} 在模块中不存在`);
      }

      return skillClass;
    } catch (error) {
      console.error(`加载技能失败：${skillName}`, error);
      throw new Error(`加载技能 ${skillName} 失败：${error.message}`);
    }
  }

  /**
   * 批量预加载技能
   * @param {string[]} skillNames - 要预加载的技能名称列表
   */
  async preloadSkills(skillNames) {
    const promises = skillNames.map(name =>
      this.loadSkill(name).catch(error => {
        console.warn(`预加载技能失败：${name}`, error);
        return null;
      })
    );

    await Promise.all(promises);
  }

  /**
   * 获取已加载的技能列表
   */
  getLoadedSkills() {
    return Array.from(loadedSkills.keys());
  }

  /**
   * 清除技能缓存
   * @param {string[]} skillNames - 要清除的技能名称列表，不传则清除所有
   */
  clearCache(skillNames) {
    if (skillNames) {
      skillNames.forEach(name => loadedSkills.delete(name));
    } else {
      loadedSkills.clear();
    }
  }

  /**
   * 检查技能是否已加载
   */
  isLoaded(skillName) {
    return loadedSkills.has(skillName);
  }

  /**
   * 获取加载状态
   */
  getLoadingStatus() {
    return {
      loaded: Array.from(loadedSkills.keys()),
      loading: Array.from(this.loadingPromises.keys()),
      total: Object.keys(skillModules).length
    };
  }
}

/**
 * 导出单例
 */
export const lazySkillLoader = new LazySkillLoader();

/**
 * 便捷函数：加载并创建技能实例
 */
export async function loadSkillInstance(skillName, config = {}) {
  const SkillClass = await lazySkillLoader.loadSkill(skillName);
  return new SkillClass(config);
}

/**
 * 便捷函数：预加载常用技能
 */
export function preloadCommonSkills() {
  const commonSkills = [
    'safe_read_file',
    'safe_write_file',
    'web_search',
    'system_info',
    'launch_application'
  ];

  return lazySkillLoader.preloadSkills(commonSkills);
}
