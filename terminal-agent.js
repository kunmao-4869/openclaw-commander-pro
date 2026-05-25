#!/usr/bin/env node

/**
 * 终端对话助手启动脚本
 * 类似 Claude Code 的终端交互体验
 */

import TerminalAgent from './src/terminal/TerminalAgent.js';

// 解析命令行参数
const args = process.argv.slice(2);
const options = {
  apiBaseUrl: 'http://localhost:3003',
  model: 'qwen2.5-coder',
  verbose: true,
  autonomousMode: true
};

// 解析参数
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--api' && args[i + 1]) {
    options.apiBaseUrl = args[i + 1];
    i++;
  } else if (args[i] === '--model' && args[i + 1]) {
    options.model = args[i + 1];
    i++;
  } else if (args[i] === '--no-auto') {
    options.autonomousMode = false;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
终端对话助手 v1.0

用法：node terminal-agent.js [选项]

选项:
  --api <url>      API 服务器地址 (默认：http://localhost:3003)
  --model <name>   使用的模型 (默认：qwen2.5-coder)
  --no-auto        关闭自主模式（需要确认所有操作）
  --help, -h       显示帮助信息

示例:
  node terminal-agent.js
  node terminal-agent.js --api http://localhost:3003
  node terminal-agent.js --no-auto
`);
    process.exit(0);
  }
}

// 创建并启动终端助手
const agent = new TerminalAgent(options);
agent.start();
