/**
 * WebSocket 终端服务
 * 提供真实的命令行执行功能
 */

import { WebSocketServer } from 'ws';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

const PORT = 3004;

// 危险命令黑名单
const DANGEROUS_COMMANDS = [
  'rm -rf /',
  'format C:',
  'del C:\\',
  'dd if=/dev/zero',
  ':(){:|:&};:', // fork bomb
  '> /dev/sda',
  'mkfs',
  'fdisk',
  'shutdown',
  'reboot',
  'halt',
  'poweroff'
];

// 安全工作目录白名单
const SAFE_DIRECTORIES = [
  process.cwd(),
  path.join(process.cwd(), 'projects'),
  path.join(process.cwd(), 'temp'),
  path.join(os.homedir(), 'Documents'),
  path.join(os.homedir(), 'Desktop')
];

// 命令执行超时（毫秒）
const COMMAND_TIMEOUT = 30000;

// 命令历史（全局）
const globalHistory = [];
const MAX_HISTORY = 100;

/**
 * 检查命令是否安全
 */
function isCommandSafe(command) {
  const trimmedCmd = command.trim().toLowerCase();

  // 检查危险命令
  for (const dangerous of DANGEROUS_COMMANDS) {
    if (trimmedCmd.includes(dangerous.toLowerCase())) {
      return {
        safe: false,
        reason: `危险命令检测：${dangerous}`
      };
    }
  }

  return { safe: true };
}

/**
 * 检查工作目录是否安全
 */
function isDirectorySafe(directory) {
  try {
    const resolved = path.resolve(directory);

    for (const safeDir of SAFE_DIRECTORIES) {
      const resolvedSafe = path.resolve(safeDir);
      if (resolved.startsWith(resolvedSafe) || resolved === resolvedSafe) {
        return { safe: true };
      }
    }

    return {
      safe: false,
      reason: '访问受限目录'
    };
  } catch (error) {
    return {
      safe: false,
      reason: `目录检查失败：${error.message}`
    };
  }
}

/**
 * WebSocket 终端服务
 */
class TerminalService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
    this.clientWorkingDirs = new Map();
  }

  /**
   * 启动服务
   */
  start() {
    this.wss = new WebSocketServer({ port: PORT });

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();

      // 设置初始工作目录
      this.clientWorkingDirs.set(clientId, process.cwd());

      // 保存客户端
      this.clients.set(clientId, {
        ws,
        workingDirectory: process.cwd(),
        history: [],
        connectedAt: Date.now()
      });

      // 发送欢迎消息
      this.sendToClient(clientId, {
        type: 'connected',
        message: '终端已连接',
        workingDirectory: process.cwd(),
        clientId
      });

      // 处理消息
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(clientId, data);
        } catch (error) {
          this.sendToClient(clientId, {
            type: 'error',
            message: `消息解析失败：${error.message}`
          });
        }
      });

      // 处理错误
      ws.on('error', (error) => {
        console.error(`客户端 ${clientId} 错误:`, error);
      });

      // 处理关闭
      ws.on('close', () => {
        console.log(`客户端 ${clientId} 断开连接`);
        this.clients.delete(clientId);
        this.clientWorkingDirs.delete(clientId);
      });

      // 处理 pong（心跳）
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.isAlive = true;
        }
      });
    });

    // 定期检查客户端连接状态
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.isAlive) {
          client.ws.terminate();
          this.clients.delete(clientId);
          this.clientWorkingDirs.delete(clientId);
          return;
        }
        client.isAlive = false;
        client.ws.ping();
      });
    }, 30000);

    console.log(`✅ WebSocket 终端服务已启动：ws://localhost:${PORT}`);
  }

  /**
   * 生成客户端 ID
   */
  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 发送消息到客户端
   */
  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === 1) {
      client.ws.send(JSON.stringify(data));
    }
  }

  /**
   * 处理客户端消息
   */
  async handleMessage(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (data.type) {
      case 'command':
        await this.executeCommand(clientId, data.command, data.options || {});
        break;

      case 'changeDirectory':
        await this.changeDirectory(clientId, data.path);
        break;

      case 'getHistory':
        this.sendHistory(clientId);
        break;

      case 'clear':
        this.clearHistory(clientId);
        break;

      case 'ping':
        this.sendToClient(clientId, { type: 'pong' });
        break;

      default:
        this.sendToClient(clientId, {
          type: 'error',
          message: `未知消息类型：${data.type}`
        });
    }
  }

  /**
   * 执行命令
   */
  async executeCommand(clientId, command, options = {}) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 安全检查
    const safetyCheck = isCommandSafe(command);
    if (!safetyCheck.safe) {
      this.sendToClient(clientId, {
        type: 'error',
        message: safetyCheck.reason,
        command
      });
      return;
    }

    // 添加到历史
    this.addToHistory(clientId, command);
    this.addToGlobalHistory(command);

    // 记录命令
    this.sendToClient(clientId, {
      type: 'command',
      text: command,
      timestamp: Date.now(),
      workingDirectory: client.workingDirectory
    });

    // 执行命令
    try {
      const workingDir = client.workingDirectory || process.cwd();

      const result = await execAsync(command, {
        cwd: workingDir,
        timeout: options.timeout || COMMAND_TIMEOUT,
        maxBuffer: 1024 * 1024 * 10, // 10MB
        env: {
          ...process.env,
          LANG: 'zh_CN.UTF-8'
        }
      });

      // 发送输出
      if (result.stdout) {
        this.sendOutput(clientId, result.stdout, 'output');
      }

      if (result.stderr) {
        this.sendOutput(clientId, result.stderr, 'warning');
      }

      // 命令完成
      this.sendToClient(clientId, {
        type: 'commandComplete',
        exitCode: 0,
        timestamp: Date.now()
      });
    } catch (error) {
      // 错误处理
      const errorMessage = error.stderr || error.message;
      this.sendOutput(clientId, errorMessage, 'error');

      this.sendToClient(clientId, {
        type: 'commandComplete',
        exitCode: error.code || 1,
        error: error.message,
        timestamp: Date.now()
      });
    }
  }

  /**
   * 发送输出
   */
  sendOutput(clientId, text, type = 'output') {
    const lines = text.split('\n').filter(line => line.trim());

    lines.forEach(line => {
      this.sendToClient(clientId, {
        type,
        text: line,
        timestamp: Date.now()
      });
    });
  }

  /**
   * 更改工作目录
   */
  async changeDirectory(clientId, targetPath) {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      // 解析路径
      const resolvedPath = path.resolve(client.workingDirectory, targetPath);

      // 安全检查
      const safetyCheck = isDirectorySafe(resolvedPath);
      if (!safetyCheck.safe) {
        this.sendToClient(clientId, {
          type: 'error',
          message: safetyCheck.reason
        });
        return;
      }

      // 检查目录是否存在
      const fs = await import('fs/promises');
      try {
        await fs.access(resolvedPath);
      } catch {
        this.sendToClient(clientId, {
          type: 'error',
          message: `目录不存在：${resolvedPath}`
        });
        return;
      }

      // 更新工作目录
      client.workingDirectory = resolvedPath;
      this.clientWorkingDirs.set(clientId, resolvedPath);

      this.sendToClient(clientId, {
        type: 'directoryChanged',
        path: resolvedPath,
        timestamp: Date.now()
      });
    } catch (error) {
      this.sendToClient(clientId, {
        type: 'error',
        message: `更改目录失败：${error.message}`
      });
    }
  }

  /**
   * 发送历史
   */
  sendHistory(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    this.sendToClient(clientId, {
      type: 'history',
      history: client.history
    });
  }

  /**
   * 清除历史
   */
  clearHistory(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.history = [];
    this.sendToClient(clientId, {
      type: 'historyCleared',
      message: '历史已清除'
    });
  }

  /**
   * 添加到历史
   */
  addToHistory(clientId, command) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 不重复添加相同的命令
    if (client.history.length > 0 && client.history[client.history.length - 1] === command) {
      return;
    }

    client.history.push(command);
    if (client.history.length > 50) {
      client.history.shift();
    }
  }

  /**
   * 添加到全局历史
   */
  addToGlobalHistory(command) {
    globalHistory.push({
      command,
      timestamp: Date.now()
    });

    if (globalHistory.length > MAX_HISTORY) {
      globalHistory.shift();
    }
  }

  /**
   * 停止服务
   */
  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.wss) {
      this.wss.close();
    }

    console.log('✅ WebSocket 终端服务已停止');
  }

  /**
   * 获取服务状态
   */
  getStatus() {
    return {
      port: PORT,
      connectedClients: this.clients.size,
      globalHistoryCount: globalHistory.length
    };
  }
}

// 导出单例
export const terminalService = new TerminalService();

// 如果直接运行此文件
if (process.argv[1] && process.argv[1].includes('terminal.js')) {
  console.log('🚀 正在启动 WebSocket 终端服务...');
  terminalService.start();
}
