#!/usr/bin/env node

/**
 * 智能工作流系统快速演示
 * 展示 HarmonyOS 项目完整工作流
 */

import ProjectWorkflowManager from './src/skills/advanced/ProjectWorkflowManager.js';
import TerminalAgent from './src/terminal/TerminalAgent.js';

async function demo() {
  console.log('\n' + '='.repeat(80));
  console.log('🎬 智能工作流系统演示 - HarmonyOS 项目开发');
  console.log('='.repeat(80));
  
  // 演示 1：项目类型识别
  console.log('\n' + '-'.repeat(80));
  console.log('📊 演示 1：项目类型智能识别');
  console.log('-'.repeat(80));
  
  const workflowManager = new ProjectWorkflowManager();
  
  const examples = [
    '我想开发一个鸿蒙应用',
    '创建一个 Unreal 游戏项目',
    '学习 Python 数据分析',
    '开发 React 网站'
  ];
  
  console.log('\n项目类型识别示例:');
  for (const example of examples) {
    const result = workflowManager.analyzeProjectType(example);
    console.log(`\n   输入："${example}"`);
    console.log(`   → 识别为：${result.config.name} (置信度：${(result.confidence * 100).toFixed(1)}%)`);
  }
  
  // 演示 2：创建智能工作流项目
  console.log('\n' + '-'.repeat(80));
  console.log('🏗️  演示 2：创建 HarmonyOS 智能工作流项目');
  console.log('-'.repeat(80));
  
  const project = await workflowManager.createOrSelectProject(
    'HarmonyOS_Demo',
    '开发一个 HarmonyOS 鸿蒙应用，学习 ArkTS 和 ArkUI 框架'
  );
  
  console.log('\n✅ 项目结构创建完成:');
  console.log(`\n   📁 ${project.rootDir}`);
  for (const [name, folder] of Object.entries(project.config.folders)) {
    const icon = name === 'studying' ? '📚' : name === 'project' ? '💻' : name === 'img' ? '🖼️' : '📄';
    console.log(`      ${icon} ${folder}/`);
  }
  
  // 演示 3：模拟学习并保存文档
  console.log('\n' + '-'.repeat(80));
  console.log('📚 演示 3：学习官方文档并保存到 studying 文件夹');
  console.log('-'.repeat(80));
  
  const mockLearningResult = {
    learningDoc: `# HarmonyOS ArkTS 开发文档

## 概述

ArkTS 是 HarmonyOS 的官方开发语言，基于 TypeScript 扩展。

## 核心概念

### 1. 装饰器
- @Entry: 页面入口
- @Component: 组件定义
- @State: 状态管理

### 2. UI 构建
声明式 UI 开发模式

## 示例代码

\`\`\`typescript
@Entry
@Component
struct Index {
  @State message: string = 'Hello World';

  build() {
    Column() {
      Text(this.message)
        .fontSize(50)
    }
  }
}
\`\`\`
`,
    codeBlocks: [
      {
        index: 0,
        language: 'typescript',
        code: `@Entry
@Component
struct Index {
  @State message: string = 'Hello World';

  build() {
    Column() {
      Text(this.message)
        .fontSize(50)
    }
  }
}`,
        length: 12
      }
    ],
    summary: {
      keyPoints: [
        'ArkTS 基于 TypeScript',
        '使用装饰器定义组件和状态',
        '声明式 UI 开发'
      ]
    }
  };
  
  const savedDoc = await workflowManager.saveLearningDoc(
    'HarmonyOS_Demo',
    'https://developer.harmonyos.com/cn/docs/documentation-000000178193450',
    mockLearningResult
  );
  
  console.log(`\n✅ 学习文档已保存:`);
  console.log(`   📄 文件名：${savedDoc.docName}`);
  console.log(`   📂 路径：${savedDoc.docPath}`);
  console.log(`   📊 提取代码块：${mockLearningResult.codeBlocks.length} 个`);
  
  // 演示 4：检索学习代码
  console.log('\n' + '-'.repeat(80));
  console.log('🔍 演示 4：在 studying 文件夹中检索示例代码');
  console.log('-'.repeat(80));
  
  const searchResult = await workflowManager.searchInStudying('@Entry');
  console.log(`\n🔍 搜索关键词："@Entry"`);
  console.log(`✅ 找到 ${searchResult.total} 个相关文档`);
  
  if (searchResult.results.length > 0) {
    searchResult.results.forEach((file, i) => {
      console.log(`\n   📄 ${i + 1}. ${file.file}`);
      console.log(`      预览：${file.preview.substring(0, 100)}...`);
    });
  }
  
  // 演示 5：检查图片资源配置
  console.log('\n' + '-'.repeat(80));
  console.log('🖼️  演示 5：检查图片资源配置');
  console.log('-'.repeat(80));
  
  const imgResult = await workflowManager.checkImgResources();
  console.log(`\n📂 图片文件夹：${imgResult.imgDir}`);
  console.log(`📊 图片数量：${imgResult.totalImages}`);
  console.log(`📝 配置文件：${imgResult.hasConfig ? '✅ 已生成' : '❌ 未生成'}`);
  
  console.log(`\n📋 图片配置说明:`);
  console.log(`   - 应用图标：512x512 px`);
  console.log(`   - 通知栏图标：24x24 px`);
  console.log(`   - 设置页图标：48x48 px`);
  console.log(`   - 推荐格式：PNG, JPG, SVG`);
  
  // 演示 6：终端技能识别
  console.log('\n' + '-'.repeat(80));
  console.log('💬 演示 6：终端技能识别演示');
  console.log('-'.repeat(80));
  
  const agent = new TerminalAgent();
  await agent.registerDefaultSkills();
  
  const testInputs = [
    '创建一个 HarmonyOS 工作流项目',
    '学习 https://harmonyos.com 并保存到 studying',
    '在 studying 中搜索 ArkTS 代码',
    '检查 img 文件夹的图片资源'
  ];
  
  console.log('\n终端命令识别示例:\n');
  for (const input of testInputs) {
    console.log(`👤 用户：${input}`);
    const skills = agent.parseInput(input);
    if (skills.length > 0) {
      skills.forEach(skill => {
        console.log(`   🤖 识别技能：${skill.skill}`);
        console.log(`      参数：${JSON.stringify(skill.params, null, 2)}`);
      });
    } else {
      console.log(`   🤖 未识别到技能`);
    }
    console.log('');
  }
  
  // 演示 7：项目状态
  console.log('\n' + '-'.repeat(80));
  console.log('📊 演示 7：查看项目状态');
  console.log('-'.repeat(80));
  
  const status = workflowManager.getProjectStatus();
  console.log(`\n✅ 当前项目状态:`);
  console.log(`   项目名称：${status.name}`);
  console.log(`   项目类型：${status.type}`);
  console.log(`   根目录：${status.rootDir}`);
  console.log(`\n   文件夹结构:`);
  for (const [name, folder] of Object.entries(status.structure)) {
    console.log(`     - ${name}: ${folder}/`);
  }
  
  // 总结
  console.log('\n' + '='.repeat(80));
  console.log('✅ 演示完成！');
  console.log('='.repeat(80));
  
  console.log('\n📊 功能总结:');
  console.log('  ✅ 智能项目识别 - 自动分析项目类型');
  console.log('  ✅ 标准文件夹结构 - studying、project、img 自动创建');
  console.log('  ✅ 学习文档管理 - 自动保存到 studying 文件夹');
  console.log('  ✅ 代码检索机制 - 优先检索学习文件夹');
  console.log('  ✅ 图片资源管理 - 配置文件和使用说明');
  console.log('  ✅ 终端技能识别 - 自然语言交互');
  
  console.log('\n🎯 使用方式:');
  console.log('  1. 启动终端：node terminal-agent.js');
  console.log('  2. 创建项目：创建一个 HarmonyOS 项目');
  console.log('  3. 学习文档：学习 https://url 并保存到 studying');
  console.log('  4. 检索代码：在 studying 中搜索示例代码');
  console.log('  5. 检查资源：查看 img 文件夹配置');
  
  console.log('\n📖 详细文档：docs/WORKFLOW_SYSTEM_GUIDE.md');
  console.log('');
}

demo().catch(console.error);
