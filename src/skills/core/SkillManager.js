/**
 * 技能管理器
 * 安全地管理和执行所有技能
 */

import { SecureSkill } from './SecureSkill.js';
import { 
  SafeFileReadSkill, 
  SafeFileListSkill, 
  SafeFileSearchSkill 
} from '../security/SafeFileOperations.js';
import {
  SystemInfoSkill,
  ProcessListSkill,
  NetworkInfoSkill,
  PingTestSkill
} from '../security/SystemInfo.js';
import {
  WebSearchSkill,
  WikipediaSearchSkill,
  NewsSearchSkill
} from '../network/WebSearch.js';
import {
  AnalyzeSearchResultsSkill,
  CompareSourcesSkill
} from '../network/Analysis.js';
import {
  LaunchAppSkill,
  SearchInstalledAppsSkill,
  OpenUrlSkill
} from '../application/AppControl.js';
import {
  CodeGenerationSkill,
  CodeReviewSkill
} from '../advanced/CodeGeneration.js';
import {
  SafeFileWriteSkill,
  CreateProjectFilesSkill
} from '../advanced/SafeFileWrite.js';
import {
  BrowserAutomationSkill,
  WebPageExtractSkill,
  FollowTutorialSkill
} from '../browser/BrowserAutomation.js';
import {
  BrowserSearchSkill
} from '../browser/BrowserSearch.js';

export class SkillManager {
  constructor() {
    this.skills = new Map();
    this.executionHistory = [];
    this.initializeSkills();
  }

  /**
   * 初始化所有安全技能
   */
  initializeSkills() {
    const skills = [
      // 文件操作（只读）
      new SafeFileReadSkill(),
      new SafeFileListSkill(),
      new SafeFileSearchSkill(),
      // 文件操作（写入）
      new SafeFileWriteSkill(),
      new CreateProjectFilesSkill(),
      // 系统信息
      new SystemInfoSkill(),
      new ProcessListSkill(),
      new NetworkInfoSkill(),
      new PingTestSkill(),
      // 网络搜索
      new WebSearchSkill(),
      new WikipediaSearchSkill(),
      new NewsSearchSkill(),
      // 分析工具
      new AnalyzeSearchResultsSkill(),
      new CompareSourcesSkill(),
      // 应用控制
      new LaunchAppSkill(),
      new SearchInstalledAppsSkill(),
      new OpenUrlSkill(),
      // 代码生成
      new CodeGenerationSkill(),
      new CodeReviewSkill(),
      // 浏览器自动化
      new BrowserSearchSkill(),
      new BrowserAutomationSkill(),
      new WebPageExtractSkill(),
      new FollowTutorialSkill(),
    ];

    for (const skill of skills) {
      this.registerSkill(skill);
    }

    console.log(`[SkillManager] 已初始化 ${this.skills.size} 个安全技能`);
  }

  /**
   * 注册技能
   * @param {SecureSkill} skill - 技能实例
   */
  registerSkill(skill) {
    if (!(skill instanceof SecureSkill)) {
      throw new Error('技能必须继承 SecureSkill 类');
    }

    this.skills.set(skill.name, skill);
    console.log(`[SkillManager] 注册技能：${skill.name}`);
  }

  /**
   * 获取技能
   * @param {string} name - 技能名称
   * @returns {SecureSkill|undefined}
   */
  getSkill(name) {
    return this.skills.get(name);
  }

  /**
   * 获取所有技能列表
   * @returns {Array}
   */
  getAllSkills() {
    return Array.from(this.skills.values()).map(skill => ({
      name: skill.name,
      description: skill.description,
      category: skill.category,
      isSafe: skill.isSafe,
      readOnly: skill.readOnly,
      requiresConfirmation: skill.requiresConfirmation,
    }));
  }

  /**
   * 执行技能
   * @param {string} skillName - 技能名称
   * @param {object} params - 参数
   * @returns {Promise<any>}
   */
  async executeSkill(skillName, params = {}) {
    const skill = this.getSkill(skillName);
    
    if (!skill) {
      throw new Error(`技能不存在：${skillName}`);
    }

    try {
      // 记录执行历史
      const execution = {
        skill: skillName,
        params: skill.sanitizeParams(params),
        timestamp: new Date().toISOString(),
        status: 'running',
      };
      this.executionHistory.push(execution);

      // 执行技能
      const result = await skill.execute(params);

      // 更新执行状态
      execution.status = 'completed';
      execution.result = result;

      return result;
    } catch (error) {
      // 更新执行状态
      const execution = this.executionHistory[this.executionHistory.length - 1];
      if (execution) {
        execution.status = 'failed';
        execution.error = error.message;
      }

      throw error;
    }
  }

  /**
   * 获取执行历史
   * @param {number} limit - 限制数量
   * @returns {Array}
   */
  getExecutionHistory(limit = 10) {
    return this.executionHistory.slice(-limit);
  }

  /**
   * 清除执行历史
   */
  clearHistory() {
    this.executionHistory = [];
  }
}

// 导出单例
export const skillManager = new SkillManager();
