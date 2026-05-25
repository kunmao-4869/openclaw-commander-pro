/**
 * Skills 文件夹加载器
 * 从 Skills/ 目录加载标准化的 Skills
 * 
 * 注意：此模块仅在 Node.js 环境运行（服务端）
 * 浏览器环境请使用 API 调用
 */

import fs from 'fs/promises';
import path from 'path';

// 获取 Skills 目录路径
// 在浏览器环境中，这个路径应该从服务端 API 获取
const getSkillsPath = () => {
  try {
    // 使用 process.cwd() 获取当前工作目录
    const cwd = process.cwd();
    // 如果 cwd 包含 commander-pro，则 Skills 就在当前目录
    const skillsPath = cwd.includes('commander-pro') 
      ? path.join(cwd, 'Skills')
      : path.join(cwd, '..', 'commander-pro', 'Skills');
    console.log('[SkillsLoader] 工作目录:', cwd);
    console.log('[SkillsLoader] Skills 路径:', skillsPath);
    return skillsPath;
  } catch (error) {
    // 如果失败，使用默认路径
    console.warn('[SkillsLoader] 使用默认路径 ./Skills');
    return './Skills';
  }
};

/**
 * Skill 定义类
 * 用于从 SKILL.md 创建 LLM 可用的技能定义
 */
export class SkillDefinition {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.triggerKeywords = config.triggerKeywords || [];
    this.priority = config.priority || 'medium';
    this.parameters = config.parameters || {};
    this.examples = config.examples || [];
  }

  /**
   * 转换为 LLM 可用的 function definition
   */
  toFunctionDefinition() {
    return {
      type: 'function',
      function: {
        name: this.transformName(this.name),
        description: this.description,
        parameters: {
          type: 'object',
          properties: {
            ...this.parameters,
            action: {
              type: 'string',
              description: '要执行的操作',
              enum: this.getAvailableActions()
            }
          },
          required: ['action']
        }
      }
    };
  }

  /**
   * 转换名称为合法的函数名
   */
  transformName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
  }

  /**
   * 获取可用操作列表
   */
  getAvailableActions() {
    // 从 SKILL.md 中提取可用操作
    return ['execute', 'help', 'examples'];
  }

  /**
   * 检查是否匹配关键词
   */
  matchesKeyword(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return (
      this.name.toLowerCase().includes(lowerKeyword) ||
      this.description.toLowerCase().includes(lowerKeyword) ||
      this.triggerKeywords.some(k => k.toLowerCase().includes(lowerKeyword))
    );
  }
}

/**
 * Skills 文件夹加载器
 */
export class SkillsFolderLoader {
  constructor(skillsPath) {
    this.skillsPath = skillsPath;
    this.skills = new Map();
    this.categories = new Map();
    this.loaded = false;
  }

  /**
   * 加载所有 Skills
   */
  async loadAllSkills() {
    console.log('[SkillsLoader] 开始加载 Skills...');

    try {
      // 检查 Skills 目录是否存在
      const skillsDir = path.resolve(this.skillsPath);
      const stats = await fs.stat(skillsDir);
      
      if (!stats.isDirectory()) {
        throw new Error('Skills 路径不是目录');
      }

      // 读取分类目录
      const categories = await fs.readdir(skillsDir);
      
      for (const category of categories) {
        // 跳过非目录文件
        if (category.endsWith('.md') || category.endsWith('.json')) {
          continue;
        }

        const categoryPath = path.join(skillsDir, category);
        const categoryStats = await fs.stat(categoryPath);
        
        if (!categoryStats.isDirectory()) {
          continue;
        }

        // 加载该分类下的所有 Skills
        await this.loadCategorySkills(category, categoryPath);
      }

      this.loaded = true;
      console.log(`[SkillsLoader] ✅ 成功加载 ${this.skills.size} 个 Skills`);
      
      return this.skills;
    } catch (error) {
      console.error('[SkillsLoader] 加载失败:', error);
      throw error;
    }
  }

  /**
   * 加载分类下的 Skills
   */
  async loadCategorySkills(categoryName, categoryPath) {
    try {
      const skills = await fs.readdir(categoryPath);
      
      for (const skill of skills) {
        const skillPath = path.join(categoryPath, skill);
        const skillStats = await fs.stat(skillPath);
        
        if (!skillStats.isDirectory()) {
          continue;
        }

        // 读取 SKILL.md
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        
        try {
          await fs.access(skillMdPath);
          const skillMd = await fs.readFile(skillMdPath, 'utf-8');
          
          // 解析 SKILL.md
          const skillDef = this.parseSkillMd(skillMd, categoryName, skill);
          
          if (skillDef) {
            this.skills.set(skillDef.name, skillDef);
            
            // 添加到分类
            if (!this.categories.has(categoryName)) {
              this.categories.set(categoryName, []);
            }
            this.categories.get(categoryName).push(skillDef.name);
            
            console.log(`  ✅ 加载 Skill: ${skillDef.name}`);
          }
        } catch (error) {
          console.warn(`  ⚠️ 跳过 ${skill}: 缺少 SKILL.md`);
        }
      }
    } catch (error) {
      console.error(`[SkillsLoader] 加载分类 ${categoryName} 失败:`, error);
    }
  }

  /**
   * 解析 SKILL.md 文件
   */
  parseSkillMd(content, category, folderName) {
    try {
      // 提取元数据
      const metadata = this.extractMetadata(content);
      
      if (!metadata) {
        return null;
      }

      // 创建 Skill 定义
      const skillDef = new SkillDefinition({
        name: metadata['名称'] || folderName,
        description: this.extractDescription(content),
        category: category,
        triggerKeywords: this.extractKeywords(metadata['触发关键词']),
        priority: this.mapPriority(metadata['优先级']),
        parameters: this.extractParameters(content),
        examples: this.extractExamples(content)
      });

      return skillDef;
    } catch (error) {
      console.error(`[SkillsLoader] 解析 SKILL.md 失败:`, error);
      return null;
    }
  }

  /**
   * 提取元数据
   */
  extractMetadata(content) {
    const metadata = {};
    const lines = content.split('\n');
    
    let inMetadata = false;
    
    for (const line of lines) {
      // 检测元数据区域
      if (line.includes('## 元数据')) {
        inMetadata = true;
        continue;
      }
      
      if (inMetadata) {
        if (line.startsWith('## ')) {
          break;
        }
        
        const match = line.match(/^- \*\*(.+?)\*\*: (.+)$/);
        if (match) {
          metadata[match[1].trim()] = match[2].trim();
        }
      }
    }
    
    return Object.keys(metadata).length > 0 ? metadata : null;
  }

  /**
   * 提取描述
   */
  extractDescription(content) {
    const match = content.match(/## 描述\s*\n\n([\s\S]+?)(?=\n## |\n$)/);
    if (match) {
      return match[1].trim().split('\n')[0];
    }
    return '执行某个技能操作';
  }

  /**
   * 提取关键词
   */
  extractKeywords(keywordStr) {
    if (!keywordStr) return [];
    
    return keywordStr
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
  }

  /**
   * 映射优先级
   */
  mapPriority(priorityStr) {
    if (!priorityStr) return 'medium';
    
    const map = {
      '极高': 'critical',
      '高': 'high',
      '中': 'medium',
      '低': 'low'
    };
    
    return map[priorityStr] || 'medium';
  }

  /**
   * 提取参数
   */
  extractParameters(content) {
    // 简化版本，实际应该解析参数规范部分
    return {
      query: {
        type: 'string',
        description: '查询内容或操作参数'
      }
    };
  }

  /**
   * 提取示例
   */
  extractExamples(content) {
    const examples = [];
    const matches = content.match(/## 示例对话([\s\S]*?)(?=\n## |\n$)/);
    
    if (matches) {
      const exampleText = matches[1];
      // 简单提取，实际可以更复杂
      examples.push(exampleText.trim());
    }
    
    return examples;
  }

  /**
   * 获取所有 Skills 定义（用于 LLM）
   */
  getAllFunctionDefinitions() {
    const definitions = [];
    
    for (const skill of this.skills.values()) {
      definitions.push(skill.toFunctionDefinition());
    }
    
    return definitions;
  }

  /**
   * 根据关键词查找 Skills
   */
  findSkillsByKeyword(keyword) {
    const matched = [];
    
    for (const skill of this.skills.values()) {
      if (skill.matchesKeyword(keyword)) {
        matched.push(skill);
      }
    }
    
    return matched;
  }

  /**
   * 获取分类列表
   */
  getCategories() {
    return Array.from(this.categories.keys());
  }

  /**
   * 获取某个分类的 Skills
   */
  getSkillsByCategory(category) {
    return this.categories.get(category) || [];
  }

  /**
   * 获取 Skill 详情
   */
  getSkillDetail(name) {
    return this.skills.get(name);
  }

  /**
   * 获取加载状态
   */
  getStatus() {
    return {
      loaded: this.loaded,
      totalSkills: this.skills.size,
      categories: this.getCategories(),
      skillsByCategory: Object.fromEntries(this.categories)
    };
  }
}

/**
 * 创建全局 Skills 加载器实例
 */
export const skillsLoader = new SkillsFolderLoader(getSkillsPath());

/**
 * 便捷函数：加载并获取所有 function definitions
 */
export async function loadSkillsForLLM() {
  if (!skillsLoader.loaded) {
    await skillsLoader.loadAllSkills();
  }
  
  return skillsLoader.getAllFunctionDefinitions();
}

/**
 * 便捷函数：查找匹配的 Skills
 */
export function findMatchingSkills(keyword) {
  return skillsLoader.findSkillsByKeyword(keyword);
}
