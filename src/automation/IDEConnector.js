/**
 * 通用 IDE 连接器 - 支持任意开发软件的自动连接与控制
 * 支持：DevEco Studio, VS Code, IntelliJ IDEA, PyCharm, WebStorm, Eclipse 等
 */

import { exec, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

class IDEConnector {
  constructor() {
    this.connectedIDE = null;
    this.windowHandle = null;
    this.supportedIDEs = {
      'deveco': {
        name: 'DevEco Studio',
        processNames: ['devecostudio64.exe', 'idea64.exe', 'deveco.exe'],
        windowTitles: ['DevEco Studio', 'canvasDraw_frame'],
        defaultPath: 'C:\\Program Files\\DevEco Studio'
      },
      'vscode': {
        name: 'Visual Studio Code',
        processNames: ['Code.exe'],
        windowTitles: ['Visual Studio Code'],
        defaultPath: 'C:\\Users\\%USER%\\AppData\\Local\\Programs\\Microsoft VS Code'
      },
      'intellij': {
        name: 'IntelliJ IDEA',
        processNames: ['idea64.exe'],
        windowTitles: ['IntelliJ IDEA'],
        defaultPath: 'C:\\Program Files\\JetBrains\\IntelliJ IDEA'
      },
      'pycharm': {
        name: 'PyCharm',
        processNames: ['pycharm64.exe'],
        windowTitles: ['PyCharm'],
        defaultPath: 'C:\\Program Files\\JetBrains\\PyCharm'
      },
      'webstorm': {
        name: 'WebStorm',
        processNames: ['webstorm64.exe'],
        windowTitles: ['WebStorm'],
        defaultPath: 'C:\\Program Files\\JetBrains\\WebStorm'
      },
      'eclipse': {
        name: 'Eclipse',
        processNames: ['eclipse.exe'],
        windowTitles: ['Eclipse'],
        defaultPath: 'C:\\eclipse'
      }
    };
  }

  /**
   * 检测系统中已安装的 IDE
   */
  async detectInstalledIDEs() {
    const installed = [];
    
    for (const [key, ide] of Object.entries(this.supportedIDEs)) {
      const isInstalled = await this.checkIDEInstalled(ide);
      if (isInstalled) {
        installed.push({
          key,
          ...ide,
          status: 'installed'
        });
      }
    }
    
    return installed;
  }

  /**
   * 检查特定 IDE 是否已安装
   */
  async checkIDEInstalled(ide) {
    return new Promise((resolve) => {
      // 检查默认安装路径
      const defaultPath = ide.defaultPath.replace('%USER%', process.env.USERNAME || '');
      
      fs.access(defaultPath, fs.constants.F_OK, (err) => {
        if (!err) {
          resolve(true);
          return;
        }
        
        // 检查进程是否在运行
        this.findIDEProcess(ide.key).then((running) => {
          resolve(running);
        });
      });
    });
  }

  /**
   * 查找正在运行的 IDE 进程
   */
  async findIDEProcess(ideKey) {
    const ide = this.supportedIDEs[ideKey];
    if (!ide) return false;
    
    return new Promise((resolve) => {
      exec('tasklist /FO CSV', (error, stdout) => {
        if (error) {
          resolve(false);
          return;
        }
        
        const running = ide.processNames.some(processName => 
          stdout.toLowerCase().includes(processName.toLowerCase())
        );
        
        resolve(running);
      });
    });
  }

  /**
   * 自动检测并连接已打开的 IDE
   */
  async autoConnect() {
    console.log('🔍 正在检测已打开的 IDE...');
    
    for (const [key, ide] of Object.entries(this.supportedIDEs)) {
      const isRunning = await this.findIDEProcess(key);
      if (isRunning) {
        console.log(`✅ 发现运行中的 IDE: ${ide.name}`);
        return await this.connect(key);
      }
    }
    
    throw new Error('未检测到任何已打开的 IDE，请先启动一个支持的 IDE');
  }

  /**
   * 连接到指定的 IDE
   */
  async connect(ideKey) {
    const ide = this.supportedIDEs[ideKey];
    if (!ide) {
      throw new Error(`不支持的 IDE: ${ideKey}`);
    }
    
    console.log(`🔌 正在连接到 ${ide.name}...`);
    
    // 检查 IDE 是否运行
    const isRunning = await this.findIDEProcess(ideKey);
    if (!isRunning) {
      throw new Error(`${ide.name} 未运行，请先启动该 IDE`);
    }
    
    // 获取窗口句柄
    this.windowHandle = await this.findWindowHandle(ide);
    
    if (!this.windowHandle) {
      throw new Error(`无法获取 ${ide.name} 的窗口句柄`);
    }
    
    this.connectedIDE = {
      key: ideKey,
      ...ide
    };
    
    console.log(`✅ 成功连接到 ${ide.name}`);
    return this.connectedIDE;
  }

  /**
   * 查找 IDE 的窗口句柄（使用 PowerShell）
   */
  async findWindowHandle(ide) {
    return new Promise((resolve) => {
      // 使用简单的 PowerShell 命令获取窗口标题
      const psScript = `Get-Process | Where-Object { $_.ProcessName -eq '${ide.processNames[0].replace('.exe', '')}' } | Select-Object -First 1 | ForEach-Object { $_.MainWindowTitle }`;
      
      exec(`powershell -Command "${psScript}"`, (error, stdout) => {
        if (error) {
          console.log('查找窗口句柄错误:', error);
          resolve(null);
          return;
        }
        const result = stdout.trim();
        console.log('查找到的窗口句柄:', result || '未找到');
        // 如果有窗口标题，返回它；否则返回第一个窗口标题
        if (result && result !== '' && result !== 'null') {
          resolve(result);
        } else if (ide.windowTitles && ide.windowTitles.length > 0) {
          resolve(ide.windowTitles[0]);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * 激活 IDE 窗口（将其带到前台）
   */
  async activateWindow() {
    if (!this.connectedIDE) {
      throw new Error('未连接到任何 IDE');
    }
    
    return new Promise((resolve, reject) => {
      const psScript = `
        $wshell = New-Object -ComObject wscript.shell;
        $wshell.AppActivate("${this.windowHandle}")
      `;
      
      exec(`powershell -Command "${psScript}"`, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  }

  /**
   * 发送键盘输入到 IDE
   */
  async sendKeys(keys, options = {}) {
    if (!this.connectedIDE) {
      throw new Error('未连接到任何 IDE');
    }
    
    const { delay = 100, activate = true } = options;
    
    if (activate) {
      await this.activateWindow();
    }
    
    // 等待窗口激活
    await this.sleep(200);
    
    // 使用 PowerShell 发送按键
    return new Promise((resolve, reject) => {
      const psScript = `
        $wshell = New-Object -ComObject wscript.shell;
        $wshell.SendKeys("${this.escapeKeys(keys)}")
      `;
      
      exec(`powershell -Command "${psScript}"`, (error) => {
        if (error) {
          reject(error);
          return;
        }
        setTimeout(() => resolve(true), delay);
      });
    });
  }

  /**
   * 发送快捷键组合
   */
  async sendHotkey(modifier, key) {
    const hotkeys = {
      'ctrl': '^',
      'alt': '%',
      'shift': '+',
      'win': '#'
    };
    
    const modifierKey = hotkeys[modifier.toLowerCase()] || '';
    const fullHotkey = modifierKey ? `${modifierKey}${key}` : key;
    
    return await this.sendKeys(fullHotkey);
  }

  /**
   * 执行通用 IDE 操作
   */
  async executeAction(action, params = {}) {
    const actions = {
      'new_file': async () => {
        await this.sendHotkey('ctrl', 'n');
        if (params.filename) {
          await this.sleep(100);
          await this.sendKeys(params.filename);
          await this.sendHotkey('ctrl', 's');
        }
      },
      
      'open_file': async () => {
        await this.sendHotkey('ctrl', 'o');
        if (params.filepath) {
          await this.sleep(100);
          await this.sendKeys(params.filepath);
          await this.sendHotkey('enter', '');
        }
      },
      
      'save': async () => {
        await this.sendHotkey('ctrl', 's');
      },
      
      'save_all': async () => {
        await this.sendHotkey('ctrl', 'shift', 's');
      },
      
      'build': async () => {
        if (this.connectedIDE.key === 'deveco') {
          await this.sendHotkey('alt', 'b');
        } else if (this.connectedIDE.key === 'vscode') {
          await this.sendHotkey('ctrl', 'shift', 'b');
        } else {
          await this.sendHotkey('ctrl', 'f9');
        }
      },
      
      'run': async () => {
        if (this.connectedIDE.key === 'deveco') {
          await this.sendHotkey('shift', 'f10');
        } else if (this.connectedIDE.key === 'vscode') {
          await this.sendHotkey('f5');
        } else {
          await this.sendHotkey('shift', 'f10');
        }
      },
      
      'debug': async () => {
        await this.sendHotkey('shift', 'f9');
      },
      
      'find': async () => {
        await this.sendHotkey('ctrl', 'f');
        if (params.query) {
          await this.sleep(100);
          await this.sendKeys(params.query);
        }
      },
      
      'replace': async () => {
        await this.sendHotkey('ctrl', 'h');
      },
      
      'goto_line': async () => {
        await this.sendHotkey('ctrl', 'g');
        if (params.line) {
          await this.sleep(100);
          await this.sendKeys(params.line.toString());
          await this.sendHotkey('enter', '');
        }
      },
      
      'format_code': async () => {
        if (this.connectedIDE.key === 'vscode') {
          await this.sendHotkey('shift', 'alt', 'f');
        } else {
          await this.sendHotkey('ctrl', 'alt', 'l');
        }
      },
      
      'toggle_terminal': async () => {
        if (this.connectedIDE.key === 'vscode') {
          await this.sendHotkey('ctrl', '`');
        }
      },
      
      'quick_fix': async () => {
        if (this.connectedIDE.key === 'vscode') {
          await this.sendHotkey('ctrl', '.');
        } else {
          await this.sendHotkey('alt', 'enter');
        }
      }
    };
    
    if (!actions[action]) {
      throw new Error(`不支持的操作：${action}`);
    }
    
    console.log(`⚡ 执行操作：${action}`);
    await actions[action]();
    return true;
  }

  /**
   * 在 IDE 中打开项目
   */
  async openProject(projectPath) {
    if (!this.connectedIDE) {
      throw new Error('未连接到任何 IDE');
    }
    
    console.log(`📂 正在打开项目：${projectPath}`);
    
    // 不同 IDE 打开项目的方式
    if (this.connectedIDE.key === 'vscode') {
      await this.executeAction('new_file');
      await this.sendKeys(`${projectPath}`);
    } else {
      // 使用命令行打开
      await this.openWithCommandLine(projectPath);
    }
    
    return true;
  }

  /**
   * 使用命令行打开 IDE
   */
  async openWithCommandLine(args = '') {
    const ide = this.connectedIDE;
    if (!ide) {
      throw new Error('未连接到任何 IDE');
    }
    
    const commands = {
      'deveco': 'deveco',
      'vscode': 'code',
      'intellij': 'idea',
      'pycharm': 'pycharm',
      'webstorm': 'webstorm',
      'eclipse': 'eclipse'
    };
    
    const cmd = commands[ide.key];
    if (!cmd) {
      throw new Error(`未知 IDE 命令：${ide.key}`);
    }
    
    return new Promise((resolve, reject) => {
      exec(`${cmd} "${args}"`, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  }

  /**
   * 从剪贴板读取内容并粘贴到 IDE
   */
  async pasteFromClipboard() {
    await this.sendHotkey('ctrl', 'v');
  }

  /**
   * 复制选中内容到剪贴板
   */
  async copyToClipboard() {
    await this.sendHotkey('ctrl', 'c');
  }

  /**
   * 选中全部内容
   */
  async selectAll() {
    await this.sendHotkey('ctrl', 'a');
  }

  /**
   * 延迟等待
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 转义特殊按键字符
   */
  escapeKeys(keys) {
    const specialChars = ['+', '^', '%', '~', '(', ')', '{', '}', '[', ']'];
    return keys.split('').map(char => {
      if (specialChars.includes(char)) {
        return `{${char}}`;
      }
      return char;
    }).join('');
  }

  /**
   * 断开连接
   */
  disconnect() {
    console.log('🔌 断开 IDE 连接');
    this.connectedIDE = null;
    this.windowHandle = null;
  }

  /**
   * 获取当前连接状态
   */
  getStatus() {
    return {
      connected: !!this.connectedIDE,
      ide: this.connectedIDE ? this.connectedIDE.name : null,
      window: this.windowHandle
    };
  }
}

export default IDEConnector;
