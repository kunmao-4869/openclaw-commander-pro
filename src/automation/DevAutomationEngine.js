/**
 * 通用开发自动化引擎 - 控制任意 IDE 进行开发操作
 * 基于 IDEConnector 实现高级开发工作流
 */

import IDEConnector from './IDEConnector.js';

class DevAutomationEngine {
  constructor() {
    this.connector = new IDEConnector();
    this.currentProject = null;
    this.actionHistory = [];
  }

  /**
   * 自动模式：检测并连接任意已打开的 IDE
   */
  async autoConnect() {
    console.log('🚀 启动通用开发自动化模式...');
    return await this.connector.autoConnect();
  }

  /**
   * 手动连接到指定 IDE
   */
  async connectToIDE(ideKey) {
    return await this.connector.connect(ideKey);
  }

  /**
   * 创建新项目/文件
   */
  async createFile(filePath, content = '') {
    console.log(`📝 创建文件：${filePath}`);
    
    const fileName = filePath.split('/').pop();
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    
    // 打开新建文件对话框
    await this.connector.executeAction('new_file');
    
    // 输入文件名
    await this.sleep(500);
    await this.connector.sendKeys(fileName);
    await this.sleep(200);
    
    // 保存
    await this.connector.executeAction('save');
    
    // 写入内容
    if (content) {
      await this.writeContent(content);
    }
    
    this.recordAction('create_file', { filePath, content });
    return true;
  }

  /**
   * 在 IDE 中写入内容
   */
  async writeContent(content) {
    // 全选删除
    await this.connector.selectAll();
    await this.sleep(100);
    
    // 分段写入内容（避免一次性输入太多）
    const chunks = this.splitContent(content);
    for (const chunk of chunks) {
      await this.connector.sendKeys(chunk);
      await this.sleep(50);
    }
    
    // 保存
    await this.connector.executeAction('save');
    
    this.recordAction('write_content', { length: content.length });
    return true;
  }

  /**
   * 分割内容以适应键盘输入
   */
  splitContent(content, chunkSize = 50) {
    const chunks = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.substring(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * 打开现有文件
   */
  async openFile(filePath) {
    console.log(`📂 打开文件：${filePath}`);
    await this.connector.executeAction('open_file', { filepath: filePath });
    this.recordAction('open_file', { filePath });
    return true;
  }

  /**
   * 编辑文件 - 查找并替换
   */
  async editFile(searchText, replaceText) {
    console.log(`✏️  编辑："${searchText}" → "${replaceText}"`);
    
    // 打开查找对话框
    await this.connector.executeAction('find', { query: searchText });
    await this.sleep(300);
    
    // 打开替换对话框
    await this.connector.executeAction('replace');
    await this.sleep(300);
    
    // 输入替换文本
    await this.connector.sendKeys(replaceText);
    await this.sleep(200);
    
    // 全部替换
    await this.connector.sendHotkey('alt', 'a');
    
    this.recordAction('edit_file', { searchText, replaceText });
    return true;
  }

  /**
   * 格式化代码
   */
  async formatCode() {
    console.log('🎨 格式化代码...');
    await this.connector.executeAction('format_code');
    this.recordAction('format_code', {});
    return true;
  }

  /**
   * 构建项目
   */
  async build() {
    console.log('🔨 构建项目...');
    await this.connector.executeAction('build');
    this.recordAction('build', {});
    return true;
  }

  /**
   * 运行项目
   */
  async run() {
    console.log('▶️  运行项目...');
    await this.connector.executeAction('run');
    this.recordAction('run', {});
    return true;
  }

  /**
   * 调试项目
   */
  async debug() {
    console.log('🐛 调试项目...');
    await this.connector.executeAction('debug');
    this.recordAction('debug', {});
    return true;
  }

  /**
   * 执行终端命令（如果 IDE 支持）
   */
  async runTerminalCommand(command) {
    console.log(`💻 执行终端命令：${command}`);
    
    // 打开终端
    await this.connector.executeAction('toggle_terminal');
    await this.sleep(500);
    
    // 输入命令
    await this.connector.sendKeys(command);
    await this.sleep(100);
    
    // 按回车执行
    await this.connector.sendHotkey('', 'enter');
    
    this.recordAction('run_terminal_command', { command });
    return true;
  }

  /**
   * 代码审查 - 使用 IDE 的检查功能
   */
  async codeReview() {
    console.log('🔍 执行代码审查...');
    
    // 快速修复/代码检查
    await this.connector.executeAction('quick_fix');
    
    this.recordAction('code_review', {});
    return true;
  }

  /**
   * 跳转到指定行
   */
  async goToLine(lineNumber) {
    console.log(`📍 跳转到第 ${lineNumber} 行`);
    await this.connector.executeAction('goto_line', { line: lineNumber });
    this.recordAction('goto_line', { lineNumber });
    return true;
  }

  /**
   * 复制选中内容
   */
  async copy() {
    await this.connector.copyToClipboard();
    this.recordAction('copy', {});
    return true;
  }

  /**
   * 粘贴内容
   */
  async paste() {
    await this.connector.pasteFromClipboard();
    this.recordAction('paste', {});
    return true;
  }

  /**
   * 撤销操作
   */
  async undo() {
    console.log('↩️  撤销操作');
    await this.connector.sendHotkey('ctrl', 'z');
    this.recordAction('undo', {});
    return true;
  }

  /**
   * 重做操作
   */
  async redo() {
    console.log('↪️  重做操作');
    await this.connector.sendHotkey('ctrl', 'y');
    this.recordAction('redo', {});
    return true;
  }

  /**
   * 执行完整开发工作流
   */
  async executeWorkflow(workflow) {
    console.log('⚙️  执行开发工作流:', workflow.name);
    
    for (const step of workflow.steps) {
      console.log(`\n📍 执行步骤：${step.action}`);
      
      try {
        await this.executeStep(step);
        console.log(`✅ 完成：${step.action}`);
      } catch (error) {
        console.error(`❌ 步骤失败：${step.action}`, error.message);
        if (workflow.stopOnError) {
          throw error;
        }
      }
      
      // 步骤间延迟
      if (step.delay) {
        await this.sleep(step.delay);
      }
    }
    
    console.log('\n🎉 工作流执行完成!');
    return true;
  }

  /**
   * 执行单个工作流步骤
   */
  async executeStep(step) {
    const { action, params } = step;
    
    switch (action) {
      case 'create_file':
        await this.createFile(params.filePath, params.content);
        break;
      
      case 'open_file':
        await this.openFile(params.filePath);
        break;
      
      case 'write_content':
        await this.writeContent(params.content);
        break;
      
      case 'edit_file':
        await this.editFile(params.searchText, params.replaceText);
        break;
      
      case 'format_code':
        await this.formatCode();
        break;
      
      case 'build':
        await this.build();
        break;
      
      case 'run':
        await this.run();
        break;
      
      case 'debug':
        await this.debug();
        break;
      
      case 'run_terminal_command':
        await this.runTerminalCommand(params.command);
        break;
      
      case 'code_review':
        await this.codeReview();
        break;
      
      case 'save':
        await this.connector.executeAction('save');
        break;
      
      case 'save_all':
        await this.connector.executeAction('save_all');
        break;
      
      case 'goto_line':
        await this.goToLine(params.lineNumber);
        break;
      
      case 'find':
        await this.connector.executeAction('find', params);
        break;
      
      case 'replace':
        await this.connector.executeAction('replace');
        break;
      
      case 'custom_keys':
        await this.connector.sendKeys(params.keys);
        break;
      
      default:
        throw new Error(`未知操作：${action}`);
    }
  }

  /**
   * 记录操作历史
   */
  recordAction(action, params) {
    this.actionHistory.push({
      timestamp: new Date().toISOString(),
      action,
      params,
      ide: this.connector.connectedIDE?.name
    });
  }

  /**
   * 获取操作历史
   */
  getHistory() {
    return this.actionHistory;
  }

  /**
   * 清除操作历史
   */
  clearHistory() {
    this.actionHistory = [];
  }

  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      connected: this.connector.getStatus(),
      project: this.currentProject,
      actionsExecuted: this.actionHistory.length
    };
  }

  /**
   * 延迟等待
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.connector.disconnect();
    console.log('👋 已断开所有连接');
  }
}

export default DevAutomationEngine;
