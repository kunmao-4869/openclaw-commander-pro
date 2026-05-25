#!/usr/bin/env node

/**
 * 终端对话助手演示脚本
 * 展示核心功能
 */

import TerminalAgent from './src/terminal/TerminalAgent.js';

async function demo() {
  console.log('\n' + '='.repeat(80));
  console.log('🎬 终端对话助手功能演示');
  console.log('='.repeat(80));
  
  const agent = new TerminalAgent({
    apiBaseUrl: 'http://localhost:3003',
    autonomousMode: true,
    verbose: true
  });
  
  // 演示 1：显示帮助
  console.log('\n' + '-'.repeat(80));
  console.log('📖 演示 1：显示帮助信息');
  console.log('-'.repeat(80));
  agent.showHelp();
  
  // 演示 2：技能识别
  console.log('\n' + '-'.repeat(80));
  console.log('🔍 演示 2：技能识别测试');
  console.log('-'.repeat(80));
  
  const testInputs = [
    '学习 https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine',
    '批量学习 https://url1.com https://url2.com',
    '用 C++ 写一个猜数字游戏',
    '创建一个 Python 工具项目',
    '保存到 output.md'
  ];
  
  for (const input of testInputs) {
    console.log(`\n输入：${input}`);
    const skills = agent.parseInput(input);
    console.log(`识别到 ${skills.length} 个技能:`);
    skills.forEach(skill => {
      console.log(`  - ${skill.skill}: ${JSON.stringify(skill.params)}`);
    });
  }
  
  // 演示 3：技能列表
  console.log('\n' + '-'.repeat(80));
  console.log('📋 演示 3：已注册技能');
  console.log('-'.repeat(80));
  
  console.log(`\n共注册 ${agent.skills.size} 个技能:`);
  for (const [name, skill] of agent.skills) {
    console.log(`\n  ${agent.styles.bold}${name}${agent.styles.reset}`);
    console.log(`    ${skill.description}`);
    const params = Object.entries(skill.params).map(([k, v]) => 
      `${k}${v.required ? ' ⭐' : ' ⚙️'}`
    ).join(', ');
    console.log(`    参数：${params}`);
  }
  
  // 演示 4：样式显示
  console.log('\n' + '-'.repeat(80));
  console.log('🎨 演示 4：样式效果');
  console.log('-'.repeat(80));
  
  agent.print('\n正常文本');
  agent.print('粗体文本', agent.styles.bold);
  agent.print('绿色文本', agent.styles.green);
  agent.print('黄色文本', agent.styles.yellow);
  agent.print('蓝色文本', agent.styles.blue);
  agent.print('青色文本', agent.styles.cyan);
  agent.print('红色文本', agent.styles.red);
  agent.print('紫色文本', agent.styles.magenta);
  
  // 演示 5：助手和用户消息
  console.log('\n' + '-'.repeat(80));
  console.log('💬 演示 5：对话样式');
  console.log('-'.repeat(80));
  
  agent.printUser('用 C++ 写一个游戏');
  agent.printAssistant('正在生成代码...');
  
  // 总结
  console.log('\n' + '='.repeat(80));
  console.log('✅ 演示完成！');
  console.log('='.repeat(80));
  console.log('\n启动方式:');
  console.log('  node terminal-agent.js');
  console.log('\n功能特性:');
  console.log('  ✅ 自然语言交互');
  console.log('  ✅ 智能技能识别');
  console.log('  ✅ 自主高效执行');
  console.log('  ✅ 安全可靠');
  console.log('  ✅ 实时反馈');
  console.log('');
}

demo().catch(console.error);
