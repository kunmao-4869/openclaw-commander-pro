/**
 * 通用 IDE 自动化使用示例
 * 演示如何连接和控制任意开发软件
 */

const DevAutomationEngine = require('./src/automation/DevAutomationEngine');

async function demo1_AutoConnect() {
  console.log('=== 示例 1: 自动连接任意已打开的 IDE ===\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    // 自动检测并连接已打开的 IDE
    const connected = await engine.autoConnect();
    console.log('✅ 已连接到:', connected.name);
    
    // 获取状态
    const status = engine.getStatus();
    console.log('状态:', status);
    
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
  }
}

async function demo2_CreateProject() {
  console.log('\n=== 示例 2: 自动创建项目文件 ===\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    // 连接到 IDE
    await engine.connectToIDE('vscode'); // 或 'deveco', 'intellij', 'pycharm'
    
    // 创建项目文件
    await engine.createFile('src/main.ts', `
// 主程序入口
import { Application } from './application';

function main() {
  console.log('应用程序启动');
  const app = new Application();
  app.run();
}

main();
    `);
    
    await engine.createFile('src/application.ts', `
// 应用类
export class Application {
  run() {
    console.log('应用运行中...');
  }
}
    `);
    
    // 格式化代码
    await engine.formatCode();
    
    console.log('✅ 项目创建完成');
    
  } catch (error) {
    console.error('❌ 创建失败:', error.message);
  } finally {
    engine.disconnect();
  }
}

async function demo3_EditAndBuild() {
  console.log('\n=== 示例 3: 编辑代码并构建 ===\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    await engine.autoConnect();
    
    // 打开文件
    await engine.openFile('src/main.ts');
    
    // 编辑代码：查找并替换
    await engine.editFile('console.log', 'console.info');
    
    // 格式化
    await engine.formatCode();
    
    // 保存
    await engine.executeStep({ action: 'save' });
    
    // 构建项目
    await engine.build();
    
    console.log('✅ 编辑和构建完成');
    
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
  } finally {
    engine.disconnect();
  }
}

async function demo4_ExecuteWorkflow() {
  console.log('\n=== 示例 4: 执行预定义工作流 ===\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    // 定义工作流
    const workflow = {
      name: '快速开发流程',
      steps: [
        { action: 'auto_connect' },
        { 
          action: 'create_file', 
          params: { 
            filePath: 'index.html',
            content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>'
          },
          delay: 1000
        },
        { 
          action: 'create_file', 
          params: { 
            filePath: 'style.css',
            content: 'body { font-family: Arial; margin: 0; padding: 20px; }'
          },
          delay: 1000
        },
        { action: 'save_all' }
      ]
    };
    
    // 执行工作流
    await engine.executeWorkflow(workflow);
    
    console.log('✅ 工作流执行完成');
    
  } catch (error) {
    console.error('❌ 工作流失败:', error.message);
  } finally {
    engine.disconnect();
  }
}

async function demo5_MultiIDE() {
  console.log('\n=== 示例 5: 多 IDE 切换控制 ===\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    // 连接到 VS Code
    console.log('连接到 VS Code...');
    await engine.connectToIDE('vscode');
    await engine.createFile('test-vscode.txt', 'From VS Code');
    
    // 断开
    engine.disconnect();
    
    // 连接到 DevEco Studio
    console.log('连接到 DevEco Studio...');
    await engine.connectToIDE('deveco');
    await engine.createFile('test-deveco.ets', 'From DevEco');
    
    console.log('✅ 多 IDE 操作完成');
    
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
  } finally {
    engine.disconnect();
  }
}

async function demo6_TerminalCommand() {
  console.log('\n=== 示例 6: 执行终端命令 ===\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    await engine.autoConnect();
    
    // 在终端执行命令
    await engine.runTerminalCommand('npm install');
    await engine.sleep(5000);
    
    await engine.runTerminalCommand('npm run build');
    
    console.log('✅ 终端命令执行完成');
    
  } catch (error) {
    console.error('❌ 命令执行失败:', error.message);
  } finally {
    engine.disconnect();
  }
}

// 运行所有示例
async function runAllDemos() {
  console.log('🚀 通用 IDE 自动化示例演示');
  console.log('========================\n');
  
  // 取消注释以运行相应示例
  // await demo1_AutoConnect();
  // await demo2_CreateProject();
  // await demo3_EditAndBuild();
  // await demo4_ExecuteWorkflow();
  // await demo5_MultiIDE();
  // await demo6_TerminalCommand();
  
  console.log('\n💡 提示：取消注释相应的 demo 函数来运行示例');
}

// 如果直接运行此文件
if (require.main === module) {
  runAllDemos().catch(console.error);
}

module.exports = {
  demo1_AutoConnect,
  demo2_CreateProject,
  demo3_EditAndBuild,
  demo4_ExecuteWorkflow,
  demo5_MultiIDE,
  demo6_TerminalCommand,
  runAllDemos
};
