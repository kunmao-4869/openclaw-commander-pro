/**
 * 终端对话系统 v1.0
 * 类似 Claude Code 的终端交互界面
 * 支持大模型对话、技能识别和自主执行
 */

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;

// 动态导入 Node.js 模块
let readline;
if (isNode) {
  readline = await import('readline');
}

import AutonomousProgrammer from '../ai/AutonomousProgrammer.js';
import { EnhancedAutonomousProgrammer } from '../ai/EnhancedAutonomousProgrammer.js';
import { ProjectCreator } from '../ai/ProjectCreator.js';
import { LearnWebpageSkill } from '../skills/learning/LearnWebpage.js';
import { SafeFileWriteSkill } from '../skills/advanced/SafeFileWrite.js';
import { SafeFileReadSkill, SafeFileListSkill } from '../skills/security/SafeFileOperations.js';
import { ReadRequirementSkill } from '../skills/file/ReadRequirement.js';
import ProjectWorkflowManager from '../skills/advanced/ProjectWorkflowManager.js';
import { skillExecutor } from '../skills/core/SkillExecutor.js';

export class TerminalAgent {
  constructor(options = {}) {
    this.apiBaseUrl = options.apiBaseUrl || 'http://localhost:3003';
    this.model = options.model || 'qwen2.5-coder';
    this.verbose = options.verbose ?? true;
    
    // 技能系统
    this.skills = new Map();
    
    // 对话历史
    this.conversationHistory = [];
    
    // 自主模式
    this.autonomousMode = options.autonomousMode ?? true;
    this.requireConfirmation = ['write_file', 'delete_file', 'execute_command'];
    
    // 创建 readline 接口（只在 Node.js 环境）
    if (isNode) {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }
    
    // AI 引擎
    this.programmer = new EnhancedAutonomousProgrammer();
    this.projectCreator = new ProjectCreator();
    this.workflowManager = new ProjectWorkflowManager();
    
    // 样式
    this.styles = {
      reset: '\x1b[0m',
      bold: '\x1b[1m',
      dim: '\x1b[2m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      red: '\x1b[31m',
      magenta: '\x1b[35m'
    };
  }

  /**
   * 注册默认技能
   */
  async registerDefaultSkills() {
    console.log('[TerminalAgent] 注册默认技能...');
    
    // 使用 SkillExecutor 作为主要技能来源
    if (skillExecutor && skillExecutor.isInitialized()) {
      console.log('[TerminalAgent] ✅ SkillExecutor 已初始化，使用全局技能');
      
      // 从 SkillExecutor 获取技能并包装
      const skillNames = skillExecutor.getRegisteredSkills();
      for (const skillName of skillNames) {
        this.skills.set(skillName, {
          name: skillName,
          description: '通过 SkillExecutor 执行',
          execute: async (params) => {
            this.print(`\n🚀 执行技能：${skillName}`, this.styles.cyan);
            const result = await skillExecutor.execute(skillName, params);
            this.print(`✅ 技能执行成功：${skillName}`, this.styles.green);
            return result;
          }
        });
      }
      
      console.log(`[TerminalAgent] ✅ 已从 SkillExecutor 注册 ${skillNames.length} 个技能`);
      return;
    }
    
    console.log('[TerminalAgent] ⚠️  SkillExecutor 未初始化，使用本地注册');
    
    // 如果 SkillExecutor 未初始化，使用本地注册（向后兼容）
    // 创建技能实例
    const learnSkill = new LearnWebpageSkill();
    const writeSkill = new SafeFileWriteSkill();
    const readSkill = new SafeFileReadSkill();
    const listSkill = new SafeFileListSkill();
    
    // 1. 学习网页技能
    this.skills.set('learn_webpage', {
      name: 'learn_webpage',
      description: '学习网页内容并提取代码示例',
      params: {
        url: { type: 'string', required: true, description: '网页 URL' }
      },
      execute: async (params) => {
        this.print(`\n📚 正在学习：${params.url}`, this.styles.cyan);
        const result = await learnSkill.execute(params);
        this.print(`✅ 学习完成，提取了 ${result.codeBlocks?.length || 0} 个代码示例`, this.styles.green);
        return result;
      }
    });

    // 2. 批量学习技能
    this.skills.set('batch_learn_webpages', {
      name: 'batch_learn_webpages',
      description: '批量学习多个网页',
      params: {
        urls: { type: 'array', required: true, description: 'URL 列表' },
        options: { type: 'object', required: false, description: '学习选项' }
      },
      execute: async (params) => {
        this.print(`\n📚 正在批量学习 ${params.urls.length} 个网页...`, this.styles.cyan);
        const results = [];
        for (const url of params.urls) {
          try {
            const result = await learnSkill.execute({ url });
            results.push(result);
          } catch (error) {
            this.print(`⚠️  ${url} 学习失败：${error.message}`, this.styles.yellow);
          }
        }
        const successCount = results.filter(r => r.success).length;
        this.print(`✅ 学习完成，成功：${successCount}/${params.urls.length}`, this.styles.green);
        return { results, successCount, total: params.urls.length };
      }
    });

    // 3. 文件写入技能
    this.skills.set('safe_write_file', {
      name: 'safe_write_file',
      description: '安全写入文件',
      params: {
        path: { type: 'string', required: true, description: '文件路径' },
        content: { type: 'string', required: true, description: '文件内容' }
      },
      execute: async (params) => {
        this.print(`\n📝 正在写入文件：${params.path}`, this.styles.cyan);
        const result = await writeSkill.execute(params);
        this.print(`✅ 文件已保存：${params.path}`, this.styles.green);
        return result;
      }
    });

    // 4. 文件读取技能
    this.skills.set('safe_read_file', {
      name: 'safe_read_file',
      description: '安全读取文件',
      params: {
        path: { type: 'string', required: true, description: '文件路径' }
      },
      execute: async (params) => {
        this.print(`\n📖 正在读取文件：${params.path}`, this.styles.cyan);
        const result = await readSkill.execute(params);
        this.print(`✅ 文件读取成功，共 ${result.content?.split('\n').length || 0} 行`, this.styles.green);
        return result;
      }
    });

    // 5. 安全浏览目录技能
    this.skills.set('safe_list_directory', {
      name: 'safe_list_directory',
      description: '浏览目录内容',
      params: {
        path: { type: 'string', required: true, description: '目录路径' }
      },
      execute: async (params) => {
        this.print(`\n📁 正在浏览目录：${params.path}`, this.styles.cyan);
        const result = await listSkill.execute(params);
        this.print(`✅ 目录内容：${result.files?.length || 0} 个文件/文件夹`, this.styles.green);
        return result;
      }
    });

    // 6. 读取需求文档技能
    const readRequirementSkill = new ReadRequirementSkill();
    this.skills.set('read_requirement', {
      name: 'read_requirement',
      description: '读取项目需求文档（专门用于读取 .md 格式的需求文件，支持中文路径）',
      params: {
        path: { type: 'string', required: true, description: '需求文档路径' },
        filePath: { type: 'string', required: false, description: '需求文档路径（备选）' }
      },
      execute: async (params) => {
        this.print(`\n📖 正在读取需求文档：${params.path || params.filePath}`, this.styles.cyan);
        const result = await readRequirementSkill.execute(params);
        this.print(`✅ 需求文档读取完成`, this.styles.green);
        this.print(`   标题：${result.title}`, this.styles.dim);
        this.print(`   大小：${result.size} 字节`, this.styles.dim);
        this.print(`   行数：${result.lines} 行`, this.styles.dim);
        return result;
      }
    });

    // 7. 代码生成技能
    this.skills.set('generate_code', {
      name: 'generate_code',
      description: '生成代码',
      params: {
        requirement: { type: 'string', required: true, description: '需求描述' },
        language: { type: 'string', required: false, description: '编程语言' },
        framework: { type: 'string', required: false, description: '框架' }
      },
      execute: async (params) => {
        this.print(`\n🤖 正在生成代码：${params.requirement}`, this.styles.cyan);
        const result = await this.programmer.enhancedProgram(params.requirement, {
          language: params.language,
          framework: params.framework
        });
        this.print(`✅ 代码生成完成，质量评分：${result.review?.quality || 100}/100`, this.styles.green);
        return result;
      }
    });

    // 7. 项目创建技能
    this.skills.set('create_project', {
      name: 'create_project',
      description: '创建完整项目',
      params: {
        projectName: { type: 'string', required: true, description: '项目名称' },
        requirement: { type: 'string', required: true, description: '项目需求' }
      },
      execute: async (params) => {
        this.print(`\n🚀 正在创建项目：${params.projectName}`, this.styles.cyan);
        const result = await this.projectCreator.createProject(params.projectName, params.requirement);
        this.print(`✅ 项目创建完成：${result.baseDir}`, this.styles.green);
        return result;
      }
    });

    // 8. 智能工作流管理技能
    this.skills.set('create_workflow_project', {
      name: 'create_workflow_project',
      description: '创建智能工作流项目（包含 studying、project、img 文件夹）',
      params: {
        projectName: { type: 'string', required: true, description: '项目名称' },
        requirement: { type: 'string', required: true, description: '项目需求描述' },
        projectType: { type: 'string', required: false, description: '项目类型（harmonyos/unreal/python/react/custom）' }
      },
      execute: async (params) => {
        this.print(`\n🔄 正在创建智能工作流项目：${params.projectName}`, this.styles.cyan);
        const result = await this.workflowManager.createOrSelectProject(params.projectName, params.requirement);
        this.print(`✅ 工作流项目创建完成`, this.styles.green);
        this.print(`   根目录：${result.rootDir}`, this.styles.dim);
        this.print(`   文件夹结构:`, this.styles.dim);
        for (const [name, folder] of Object.entries(result.config.folders)) {
          this.print(`     - ${name}: ${folder}/`, this.styles.dim);
        }
        
        // 🚀 自动触发代码生成
        this.print(`\n🤖 检测到项目创建，正在启动自主编程...`, this.styles.cyan);
        this.print(`   分析需求：${params.requirement.substring(0, 100)}...`, this.styles.dim);
        
        try {
          // 使用 AutonomousProgrammer 生成代码
          const codeResult = await this.programmer.program(params.requirement, {
            projectDir: result.rootDir,
            projectType: result.type,
            projectName: params.projectName
          });
          
          this.print(`\n✅ 代码生成完成`, this.styles.green);
          this.print(`   生成文件数：${codeResult.files?.length || 0}`, this.styles.dim);
          
          // 返回完整结果
          return {
            ...result,
            codeGenerated: true,
            codeResult
          };
        } catch (error) {
          this.print(`\n⚠️  代码生成失败：${error.message}`, this.styles.yellow);
          this.print(`   请手动执行编程命令`, this.styles.dim);
          
          return {
            ...result,
            codeGenerated: false,
            error: error.message
          };
        }
      }
    });

    // 9. 保存学习文档技能
    this.skills.set('save_to_studying', {
      name: 'save_to_studying',
      description: '保存学习文档到 studying 文件夹',
      params: {
        url: { type: 'string', required: true, description: '学习的网页 URL' },
        content: { type: 'string', required: false, description: '学习内容（可选，会自动从 URL 学习）' }
      },
      execute: async (params) => {
        if (!this.workflowManager.currentProject) {
          this.print(`⚠️  请先创建项目`, this.styles.yellow);
          return { success: false, error: '没有活动项目' };
        }
        
        this.print(`\n📚 正在学习并保存到 studying 文件夹...`, this.styles.cyan);
        
        // 如果没有提供内容，先从 URL 学习
        let learningResult = params.content;
        if (!learningResult && params.url) {
          const learnSkill = this.skills.get('learn_webpage');
          learningResult = await learnSkill.execute({ url: params.url });
        }
        
        // 保存到 studying 文件夹
        const result = await this.workflowManager.saveLearningDoc(
          this.workflowManager.currentProject.name,
          params.url,
          learningResult
        );
        
        this.print(`✅ 学习文档已保存：${result.docName}`, this.styles.green);
        return result;
      }
    });

    // 10. 检索学习代码技能
    this.skills.set('search_studying_code', {
      name: 'search_studying_code',
      description: '在 studying 文件夹中检索示例代码',
      params: {
        query: { type: 'string', required: true, description: '搜索关键词' }
      },
      execute: async (params) => {
        if (!this.workflowManager.currentProject) {
          this.print(`⚠️  请先创建项目`, this.styles.yellow);
          return { success: false, error: '没有活动项目' };
        }
        
        this.print(`\n🔍 正在 studying 文件夹中搜索：${params.query}`, this.styles.cyan);
        const result = await this.workflowManager.searchInStudying(params.query);
        
        if (result.total > 0) {
          this.print(`✅ 找到 ${result.total} 个相关文档`, this.styles.green);
          result.results.forEach((file, i) => {
            this.print(`   ${i + 1}. ${file.file}`, this.styles.dim);
          });
        } else {
          this.print(`⚠️  未找到相关文档，需要学习新内容`, this.styles.yellow);
        }
        
        return result;
      }
    });

    // 11. 检查图片资源技能
    this.skills.set('check_img_resources', {
      name: 'check_img_resources',
      description: '检查 img 文件夹中的图片资源',
      params: {},
      execute: async (params) => {
        if (!this.workflowManager.currentProject) {
          this.print(`⚠️  请先创建项目`, this.styles.yellow);
          return { success: false, error: '没有活动项目' };
        }
        
        this.print(`\n🖼️  正在检查图片资源...`, this.styles.cyan);
        const result = await this.workflowManager.checkImgResources();
        
        this.print(`✅ 图片文件夹：${result.imgDir}`, this.styles.green);
        this.print(`   图片数量：${result.totalImages}`, this.styles.dim);
        
        if (result.totalImages > 0) {
          result.images.forEach((img, i) => {
            this.print(`   ${i + 1}. ${img.name}`, this.styles.dim);
          });
        } else {
          this.print(`⚠️  暂无图片，请参考 img/README.md 添加图片`, this.styles.yellow);
        }
        
        return result;
      }
    });
  }

  /**
   * 打印带样式的消息
   */
  print(message, style = '') {
    console.log(`${style}${message}${this.styles.reset}`);
  }

  /**
   * 打印助手消息
   */
  printAssistant(message) {
    this.print(`\n${this.styles.bold}${this.styles.blue}🤖 助手${this.styles.reset}: ${message}`);
  }

  /**
   * 打印用户消息
   */
  printUser(message) {
    this.print(`\n${this.styles.bold}${this.styles.green}👤 用户${this.styles.reset}: ${message}`);
  }

  /**
   * 解析用户输入，识别技能调用
   */
  parseInput(input) {
    const lowerInput = input.toLowerCase();
    
    // 检测技能调用
    const skillCalls = [];
    
    // 检测学习网页
    if (lowerInput.includes('学习') && (lowerInput.includes('网页') || lowerInput.includes('网站') || input.includes('http'))) {
      const urlMatch = input.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        skillCalls.push({
          skill: 'learn_webpage',
          params: { url: urlMatch[0] }
        });
      }
    }
    
    // 检测批量学习
    if (lowerInput.includes('批量学习') || lowerInput.includes('学习多个')) {
      const urls = input.match(/https?:\/\/[^\s]+/g) || [];
      if (urls.length > 0) {
        skillCalls.push({
          skill: 'batch_learn_webpages',
          params: { urls }
        });
      }
    }
    
    // 检测文件写入
    if (lowerInput.includes('保存') || lowerInput.includes('写入') || lowerInput.includes('创建文件')) {
      const pathMatch = input.match(/[\w\-\\/]+\.(md|txt|cpp|h|js|py|json)/);
      if (pathMatch) {
        skillCalls.push({
          skill: 'safe_write_file',
          params: { path: pathMatch[0] }
        });
      }
    }
    
    // 检测代码生成
    if (lowerInput.includes('写一个') || lowerInput.includes('生成') || lowerInput.includes('创建')) {
      if (lowerInput.includes('代码') || lowerInput.includes('程序') || lowerInput.includes('游戏') || lowerInput.includes('工具')) {
        skillCalls.push({
          skill: 'generate_code',
          params: { requirement: input }
        });
      }
    }
    
    // 检测项目创建
    if (lowerInput.includes('项目') && (lowerInput.includes('创建') || lowerInput.includes('开发'))) {
      skillCalls.push({
        skill: 'create_project',
        params: { projectName: 'MyProject', requirement: input }
      });
    }
    
    // 检测智能工作流项目创建
    if ((lowerInput.includes('工作流') || lowerInput.includes('workflow')) && 
        (lowerInput.includes('项目') || lowerInput.includes('创建'))) {
      skillCalls.push({
        skill: 'create_workflow_project',
        params: { projectName: 'WorkflowProject', requirement: input }
      });
    }
    
    // 检测 HarmonyOS 项目
    if (lowerInput.includes('harmonyos') || lowerInput.includes('鸿蒙')) {
      if (lowerInput.includes('项目') || lowerInput.includes('创建')) {
        skillCalls.push({
          skill: 'create_workflow_project',
          params: { 
            projectName: 'HarmonyOS_App', 
            requirement: input,
            projectType: 'harmonyos'
          }
        });
      }
    }
    
    // 检测保存到 studying
    if ((lowerInput.includes('保存') || lowerInput.includes('学习')) && 
        (lowerInput.includes('studying') || lowerInput.includes('学习文件夹'))) {
      const urlMatch = input.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        skillCalls.push({
          skill: 'save_to_studying',
          params: { url: urlMatch[0] }
        });
      }
    }
    
    // 检测代码检索
    if ((lowerInput.includes('检索') || lowerInput.includes('搜索') || lowerInput.includes('查找')) && 
        (lowerInput.includes('studying') || lowerInput.includes('学习代码'))) {
      skillCalls.push({
        skill: 'search_studying_code',
        params: { query: input }
      });
    }
    
    // 检测图片资源检查
    if ((lowerInput.includes('图片') || lowerInput.includes('资源') || lowerInput.includes('img')) && 
        (lowerInput.includes('检查') || lowerInput.includes('查看'))) {
      skillCalls.push({
        skill: 'check_img_resources',
        params: {}
      });
    }
    
    return skillCalls;
  }

  /**
   * 确认危险操作
   */
  async confirmAction(skillName, params) {
    if (!this.requireConfirmation.includes(skillName)) {
      return true;
    }
    
    this.print(`\n${this.styles.yellow}⚠️  确认操作${this.styles.reset}`, this.styles.yellow);
    this.print(`技能：${skillName}`);
    this.print(`参数：${JSON.stringify(params, null, 2)}`);
    
    return new Promise((resolve) => {
      this.rl.question(`${this.styles.cyan}是否继续？(y/n): ${this.styles.reset}`, (answer) => {
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }

  /**
   * 执行技能
   */
  async executeSkill(skillCall) {
    const skill = this.skills.get(skillCall.skill);
    if (!skill) {
      this.printAssistant(`❌ 未找到技能：${skillCall.skill}`);
      return null;
    }
    
    // 确认危险操作
    const confirmed = await this.confirmAction(skillCall.skill, skillCall.params);
    if (!confirmed) {
      this.printAssistant('❌ 操作已取消');
      return null;
    }
    
    try {
      // 执行技能
      const result = await skill.execute(skillCall.params);
      return result;
    } catch (error) {
      this.printAssistant(`❌ 执行失败：${error.message}`);
      return null;
    }
  }

  /**
   * 处理用户输入
   */
  async processInput(input) {
    // 添加到对话历史
    this.conversationHistory.push({
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    });
    
    // 解析技能调用
    const skillCalls = this.parseInput(input);
    
    if (skillCalls.length > 0) {
      // 执行识别到的技能
      this.printAssistant(`识别到 ${skillCalls.length} 个技能调用，开始执行...`);
      
      const results = [];
      for (const skillCall of skillCalls) {
        const result = await this.executeSkill(skillCall);
        results.push(result);
      }
      
      // 添加结果到对话历史
      this.conversationHistory.push({
        role: 'assistant',
        content: `执行了 ${skillCalls.length} 个技能`,
        results,
        timestamp: new Date().toISOString()
      });
      
      return results;
    } else {
      // 普通对话，调用大模型
      this.printAssistant('正在思考...');
      
      // TODO: 调用大模型 API
      const response = "我理解了你的需求。你可以使用以下命令：\n" +
                       "- 学习网页：'学习 https://example.com'\n" +
                       "- 生成代码：'用 C++ 写一个游戏'\n" +
                       "- 创建项目：'创建一个 Python 工具项目'";
      
      this.printAssistant(response);
      
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      });
      
      return response;
    }
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    this.print(`\n${this.styles.bold}=== 终端助手帮助 ===${this.styles.reset}`, this.styles.bold);
    this.print(`\n${this.styles.cyan}可用技能:${this.styles.reset}`);
    
    for (const [name, skill] of this.skills) {
      this.print(`\n  ${this.styles.bold}${name}${this.styles.reset}`);
      this.print(`    ${skill.description}`);
      this.print(`    参数:`);
      for (const [param, config] of Object.entries(skill.params)) {
        const required = config.required ? '⭐必填' : '⚙️可选';
        this.print(`      - ${param}: ${config.description} ${this.styles.dim}(${required})${this.styles.reset}`);
      }
    }
    
    this.print(`\n${this.styles.cyan}示例命令:${this.styles.reset}`);
    this.print(`  学习 https://example.com`);
    this.print(`  用 C++ 写一个游戏`);
    this.print(`  创建一个 Python 工具项目`);
    this.print(`  批量学习 https://url1.com https://url2.com`);
    
    this.print(`\n${this.styles.cyan}控制命令:${this.styles.reset}`);
    this.print(`  help     - 显示帮助`);
    this.print(`  clear    - 清空屏幕`);
    this.print(`  history  - 显示对话历史`);
    this.print(`  exit     - 退出程序`);
  }

  /**
   * 显示欢迎信息
   */
  showWelcome() {
    this.print(`\n${this.styles.bold}${this.styles.cyan}╔════════════════════════════════════════╗${this.styles.reset}`);
    this.print(`${this.styles.bold}${this.styles.cyan}║${this.styles.reset}  ${this.styles.bold}终端对话助手 v1.0${this.styles.reset}                ${this.styles.bold}${this.styles.cyan}║${this.styles.reset}`);
    this.print(`${this.styles.bold}${this.styles.cyan}║${this.styles.reset}  类似 Claude Code 的交互体验           ${this.styles.bold}${this.styles.cyan}║${this.styles.reset}`);
    this.print(`${this.styles.bold}${this.styles.cyan}╚════════════════════════════════════════╝${this.styles.reset}`);
    this.print(`\n${this.styles.green}✅ 已加载 ${this.skills.size} 个技能${this.styles.reset}`);
    this.print(`${this.styles.green}✅ 自主模式：${this.autonomousMode ? '开启' : '关闭'}${this.styles.reset}`);
    this.print(`\n输入 ${this.styles.yellow}help${this.styles.reset} 查看帮助，输入 ${this.styles.yellow}exit${this.styles.reset} 退出\n`);
  }

  /**
   * 启动终端对话（只在 Node.js 环境可用）
   */
  async start() {
    // 只在 Node.js 环境启动 readline
    if (!isNode) {
      console.warn('TerminalAgent.start() 只在 Node.js 环境可用');
      return;
    }
    
    // 注册技能
    await this.registerDefaultSkills();
    
    this.showWelcome();
    
    const prompt = () => {
      this.rl.question(`${this.styles.bold}${this.styles.magenta}❯${this.styles.reset} `, async (input) => {
        const trimmedInput = input.trim();
        
        if (!trimmedInput) {
          prompt();
          return;
        }
        
        // 控制命令
        if (trimmedInput.toLowerCase() === 'exit' || trimmedInput.toLowerCase() === 'quit') {
          this.printAssistant('再见！');
          this.rl.close();
          process.exit(0);
        }
        
        if (trimmedInput.toLowerCase() === 'help') {
          this.showHelp();
          prompt();
          return;
        }
        
        if (trimmedInput.toLowerCase() === 'clear') {
          console.clear();
          this.showWelcome();
          prompt();
          return;
        }
        
        if (trimmedInput.toLowerCase() === 'history') {
          this.print(`\n${this.styles.bold}对话历史:${this.styles.reset}`);
          this.conversationHistory.forEach((msg, i) => {
            const role = msg.role === 'user' ? '👤' : '🤖';
            const time = new Date(msg.timestamp).toLocaleTimeString();
            this.print(`  [${time}] ${role} ${msg.content.substring(0, 50)}...`);
          });
          prompt();
          return;
        }
        
        // 处理用户输入
        this.printUser(trimmedInput);
        await this.processInput(trimmedInput);
        
        prompt();
      });
    };
    
    prompt();
  }
}

// 导出
export default TerminalAgent;
