/**
 * AI 集成工作流快速启动脚本
 * 一键生成并创建项目
 */

import AIIntegrationWorkflow from './src/workflow/AIIntegrationWorkflow.js';

async function quickStart() {
  console.log('\\n🚀 AI 集成工作流 - 快速启动');
  console.log('========================================\\n');
  
  const workflow = new AIIntegrationWorkflow();
  
  try {
    // 选择模板类型
    const templates = [
      { type: 'typescript-class', name: 'TypeScript 类', options: { name: 'DataManager', methods: ['load', 'save', 'delete'] } },
      { type: 'harmonyos-component', name: 'HarmonyOS 组件', options: { name: 'WeatherCard' } },
      { type: 'react-component', name: 'React 组件', options: { name: 'UserCard' } },
      { type: 'nodejs-server', name: 'Node.js 服务器', options: { name: 'RestAPI', port: 3000 } }
    ];
    
    console.log('可用模板:\\n');
    templates.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.name}`);
    });
    console.log('\\n');
    
    // 默认使用第一个模板（TypeScript 类）
    console.log('📦 使用模板：TypeScript 类 - DataManager');
    console.log('   方法：load, save, delete\\n');
    
    // 执行工作流
    const success = await workflow.executeWorkflow({
      templateType: 'typescript-class',
      templateOptions: {
        name: 'DataManager',
        methods: ['load', 'save', 'delete', 'query']
      },
      generateDoc: true
    });
    
    if (success) {
      console.log('\\n✅ 项目创建成功！');
      console.log('\\n📁 生成的文件:');
      console.log('  - DataManager.ts (主类)');
      console.log('  - index.ts (入口文件)');
      console.log('  - README.md (项目文档)');
      console.log('\\n💡 下一步:');
      console.log('  1. 在 IDE 中查看生成的文件');
      console.log('  2. 运行代码测试功能');
      console.log('  3. 根据需要修改和扩展');
    } else {
      console.log('\\n❌ 项目创建失败');
      console.log('\\n💡 请检查:');
      console.log('  - IDE 是否已打开');
      console.log('  - 是否有写入权限');
      console.log('  - 查看错误日志');
    }
    
  } catch (error) {
    console.error('\\n❌ 错误:', error.message);
    console.error('\\n堆栈:', error.stack);
  }
}

// 运行快速启动
quickStart().catch(console.error);
