/**
 * 自主学习引擎 - 不依赖 AI 分析
 * 通过浏览器搜索 + 规则引擎实现真正的自主学习
 */

import { SkillManager } from '../skills/core/SkillManager.js';

class AutonomousLearningEngine {
  constructor() {
    this.skillManager = new SkillManager();
    this.knowledge = [];
    this.decisionRules = this.initializeDecisionRules();
  }

  /**
   * 初始化决策规则（替代 AI 分析）
   */
  initializeDecisionRules() {
    return {
      // 规则 1: 如果搜索结果包含官方文档，优先提取
      officialDoc: {
        pattern: /developer\.harmonyos\.com|docs|documentation/i,
        priority: 10,
        action: 'extract_and_learn'
      },
      // 规则 2: 如果是教程类，详细学习
      tutorial: {
        pattern: /教程 | 指南 |guide|tutorial/i,
        priority: 8,
        action: 'follow_tutorial'
      },
      // 规则 3: 如果是代码示例，保存代码
      codeExample: {
        pattern: /代码 |example|sample|demo|github/i,
        priority: 9,
        action: 'save_code'
      },
      // 规则 4: 默认规则
      default: {
        priority: 1,
        action: 'extract_summary'
      }
    };
  }

  /**
   * 自主学习流程
   */
  async learn(topic, options = {}) {
    console.log(`🚀 开始自主学习：${topic}\n`);
    
    try {
      // 步骤 1: 浏览器搜索
      const searchResults = await this.search(topic);
      
      // 步骤 2: 智能筛选（规则引擎）
      const selectedLinks = this.selectLinks(searchResults, topic);
      
      // 步骤 3: 提取学习
      const knowledge = await this.extractKnowledge(selectedLinks);
      
      // 步骤 4: 生成项目
      const project = await this.generateProject(topic, knowledge, options);
      
      return {
        success: true,
        topic,
        searchResults,
        knowledge,
        project
      };
    } catch (error) {
      console.error('❌ 学习失败:', error.message);
      throw error;
    }
  }

  /**
   * 步骤 1: 搜索
   */
  async search(query) {
    console.log('📋 步骤 1: 搜索相关信息');
    
    const result = await this.skillManager.executeSkill('browser_search', {
      query,
      engine: 'bing'
    });
    
    console.log(`✅ 找到 ${result.total} 条结果\n`);
    return result;
  }

  /**
   * 步骤 2: 智能筛选链接（规则引擎替代 AI 分析）
   */
  selectLinks(searchResults, topic) {
    console.log('📋 步骤 2: 智能筛选链接');
    
    const links = searchResults.results || [];
    const selected = [];
    
    // 应用决策规则
    links.forEach(link => {
      const rule = this.matchRule(link, topic);
      const score = this.calculateScore(link, rule);
      
      selected.push({
        ...link,
        rule: rule.action,
        score
      });
    });
    
    // 按优先级排序
    selected.sort((a, b) => b.score - a.score);
    
    // 选择前 3 个
    const top3 = selected.slice(0, 3);
    console.log(`✅ 选择 ${top3.length} 个高价值链接\n`);
    
    top3.forEach((item, i) => {
      console.log(`${i + 1}. [${item.rule}] ${item.title?.substring(0, 50)}... (分数：${item.score})`);
    });
    
    return top3;
  }

  /**
   * 匹配规则
   */
  matchRule(link, topic) {
    const text = (link.title + ' ' + link.text + ' ' + link.url).toLowerCase();
    
    for (const key in this.decisionRules) {
      if (key === 'default') continue;
      
      const rule = this.decisionRules[key];
      if (rule.pattern.test(text)) {
        return rule;
      }
    }
    
    return this.decisionRules.default;
  }

  /**
   * 计算分数
   */
  calculateScore(link, rule) {
    let score = rule.priority;
    
    // 官方文档加分
    if (link.url.includes('developer.harmonyos.com')) {
      score += 5;
    }
    
    // 标题包含关键词加分
    if (link.title && (link.title.includes('教程') || link.title.includes('指南'))) {
      score += 3;
    }
    
    // 近期内容加分（如果有时间信息）
    if (link.text && (link.text.includes('2025') || link.text.includes('最新'))) {
      score += 2;
    }
    
    return score;
  }

  /**
   * 步骤 3: 提取知识
   */
  async extractKnowledge(links) {
    console.log('\n📋 步骤 3: 提取知识');
    
    const knowledge = [];
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      console.log(`\n提取 ${i + 1}/${links.length}: ${link.url}`);
      
      try {
        const content = await this.skillManager.executeSkill('extract_webpage_content', {
          url: link.url
        });
        
        // 规则化知识提取
        const extracted = this.extractKeyInfo(content, link.rule);
        
        knowledge.push({
          url: link.url,
          title: content.title,
          type: link.rule,
          ...extracted
        });
        
        console.log(`✅ 提取成功：${extracted.summary}`);
      } catch (error) {
        console.log(`⚠️  提取失败：${error.message}`);
      }
    }
    
    console.log('\n✅ 知识提取完成');
    return knowledge;
  }

  /**
   * 规则化知识提取（替代 AI 分析）
   */
  extractKeyInfo(content, type) {
    const text = content.content || content.text || '';
    
    // 根据类型提取关键信息
    const extractors = {
      'extract_and_learn': this.extractOfficialDoc.bind(this),
      'follow_tutorial': this.extractTutorial.bind(this),
      'save_code': this.extractCode.bind(this),
      'extract_summary': this.extractSummary.bind(this)
    };
    
    const extractor = extractors[type] || extractors.extractSummary;
    return extractor(text);
  }

  /**
   * 提取官方文档信息
   */
  extractOfficialDoc(text) {
    // 提取关键概念
    const concepts = [];
    const matches = text.match(/(ArkTS|ArkUI|WebSocket|Canvas|组件|开发)/g);
    if (matches) {
      concepts.push(...new Set(matches));
    }
    
    return {
      summary: `官方文档，包含 ${concepts.length} 个关键技术点`,
      concepts,
      technologies: concepts,
      codeSnippets: this.extractCodeSnippets(text)
    };
  }

  /**
   * 提取教程信息
   */
  extractTutorial(text) {
    // 提取步骤
    const steps = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      if (/^\d+[\.,]|步骤 | 第一步 | 首先 | 然后 | 最后/i.test(line)) {
        steps.push(line.trim());
      }
    });
    
    return {
      summary: `教程，包含 ${steps.length} 个步骤`,
      steps: steps.slice(0, 10),
      hasCode: /代码|example|function|class|import/i.test(text)
    };
  }

  /**
   * 提取代码
   */
  extractCode(text) {
    const codeSnippets = this.extractCodeSnippets(text);
    
    return {
      summary: `代码示例，包含 ${codeSnippets.length} 个代码片段`,
      codeSnippets,
      hasImplementation: codeSnippets.length > 0
    };
  }

  /**
   * 通用摘要
   */
  extractSummary(text) {
    // 提取前 200 字作为摘要
    const summary = text.substring(0, 200).replace(/\s+/g, ' ').trim();
    
    return {
      summary: summary + '...',
      length: text.length,
      keywords: this.extractKeywords(text)
    };
  }

  /**
   * 提取代码片段
   */
  extractCodeSnippets(text) {
    const snippets = [];
    const codeBlocks = text.match(/```[\s\S]*?```/g) || [];
    
    codeBlocks.forEach(block => {
      const code = block.replace(/```/g, '').trim();
      if (code.length > 50) {
        snippets.push(code);
      }
    });
    
    return snippets;
  }

  /**
   * 提取关键词
   */
  extractKeywords(text) {
    const words = text.match(/[A-Za-z0-9\u4e00-\u9fa5]{2,}/g) || [];
    const wordCount = {};
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * 步骤 4: 生成项目
   */
  async generateProject(topic, knowledge, options) {
    console.log('\n📋 步骤 4: 生成项目');
    
    // 基于知识生成项目结构
    const projectStructure = this.createProjectStructure(topic, knowledge);
    
    // 生成代码
    const codeFiles = this.generateCodeFiles(topic, knowledge, projectStructure);
    
    // 保存文件
    const savedFiles = await this.saveProject(codeFiles, options.outputDir);
    
    console.log('✅ 项目生成完成');
    return {
      structure: projectStructure,
      files: savedFiles
    };
  }

  /**
   * 创建项目结构（基于规则）
   */
  createProjectStructure(topic, knowledge) {
    // 检测技术栈
    const technologies = this.detectTechnologies(knowledge);
    
    // 基于技术栈生成结构
    const structures = {
      'HarmonyOS': {
        'entry/src/main/ets/pages/': ['Index.ets', 'MainPage.ets'],
        'entry/src/main/ets/components/': [],
        'entry/src/main/ets/utils/': [],
        'entry/src/main/': ['module.json5']
      },
      'Web': {
        'src/': ['index.html', 'App.js', 'style.css'],
        'src/components/': [],
        'src/utils/': []
      }
    };
    
    const structure = structures[technologies[0]] || structures.Web;
    
    // 添加组件（基于知识）
    knowledge.forEach(k => {
      if (k.type === 'extract_and_learn' && k.concepts) {
        k.concepts.forEach(concept => {
          if (concept.includes('Component') || concept.includes('组件')) {
            const componentName = concept.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '') + '.ets';
            if (structure['entry/src/main/ets/components/']) {
              structure['entry/src/main/ets/components/'].push(componentName);
            }
          }
        });
      }
    });
    
    return structure;
  }

  /**
   * 检测技术栈
   */
  detectTechnologies(knowledge) {
    const techs = [];
    
    knowledge.forEach(k => {
      if (k.concepts) {
        k.concepts.forEach(c => {
          if (c.includes('ArkTS') || c.includes('ArkUI')) {
            techs.push('HarmonyOS');
          }
          if (c.includes('React') || c.includes('Vue')) {
            techs.push('Web');
          }
        });
      }
    });
    
    return [...new Set(techs)];
  }

  /**
   * 生成代码文件
   */
  generateCodeFiles(topic, knowledge, structure) {
    const files = [];
    
    // 为每个目录生成文件
    Object.entries(structure).forEach(([dir, fileNames]) => {
      fileNames.forEach(fileName => {
        const content = this.generateFileContent(topic, knowledge, dir, fileName);
        files.push({
          path: dir + fileName,
          content
        });
      });
    });
    
    return files;
  }

  /**
   * 生成文件内容（基于模板）
   */
  generateFileContent(topic, knowledge, dir, fileName) {
    const templates = {
      'Index.ets': this.generateIndexPage.bind(this),
      'module.json5': this.generateModuleConfig.bind(this),
      '.ets': this.generateComponent.bind(this)
    };
    
    for (const [key, generator] of Object.entries(templates)) {
      if (fileName.endsWith(key)) {
        return generator(topic, knowledge, fileName);
      }
    }
    
    // 默认模板
    return `// ${fileName}\n// 自动生成于 ${new Date().toISOString()}\n// 主题：${topic}\n`;
  }

  /**
   * 生成主页面
   */
  generateIndexPage(topic, knowledge, fileName) {
    return `/**
 * ${topic} - 主页面
 * 自动生成于 ${new Date().toISOString()}
 */
@Entry
@Component
struct Index {
  build() {
    Column() {
      Text('${topic}')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
    }
    .width('100%')
    .height('100%')
  }
}
`;
  }

  /**
   * 生成模块配置
   */
  generateModuleConfig() {
    return `{
  "module": {
    "name": "entry",
    "type": "entry",
    "description": "Auto-generated module",
    "mainElement": "EntryAbility",
    "deviceTypes": ["phone", "tablet"]
  }
}
`;
  }

  /**
   * 生成组件
   */
  generateComponent(topic, knowledge, fileName) {
    const componentName = fileName.replace('.ets', '');
    return `/**
 * ${componentName} 组件
 * 自动生成于 ${new Date().toISOString()}
 */
@Entry
@Component
struct ${componentName} {
  build() {
    Column() {
      Text('${componentName}')
    }
  }
}
`;
  }

  /**
   * 保存项目
   */
  async saveProject(files, outputDir) {
    const savedFiles = [];
    
    for (const file of files) {
      console.log(`📝 保存：${file.path}`);
      
      try {
        await this.skillManager.executeSkill('safe_write_file', {
          path: file.path,
          content: file.content,
          overwrite: true
        });
        
        savedFiles.push(file.path);
        console.log(`✅ 成功`);
      } catch (error) {
        console.log(`❌ 失败：${error.message}`);
      }
    }
    
    return savedFiles;
  }
}

// 导出
export { AutonomousLearningEngine };
