/**
 * 演示如何在 IDE 中自动创建文件并编写代码
 */

import DevAutomationEngine from './src/automation/DevAutomationEngine.js';

async function demoWriteCodeInIDE() {
  console.log('💻 演示：自动在 IDE 中创建文件并编写代码\n');
  console.log('========================================\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    // 步骤 1: 连接到 IDE
    console.log('📍 步骤 1: 连接到 IDE（自动检测）');
    await engine.autoConnect();
    console.log('✅ 连接成功\n');
    
    // 步骤 2: 创建新文件
    console.log('📍 步骤 2: 创建新的 TypeScript 文件');
    const fileName = 'DemoApp.ts';
    console.log(`   文件名：${fileName}`);
    
    // 使用 IDE 的新建文件功能
    await engine.connector.executeAction('new_file', { filename: fileName });
    await engine.sleep(1000);
    console.log('✅ 文件已创建\n');
    
    // 步骤 3: 编写代码
    console.log('📍 步骤 3: 编写代码');
    const code = `/**
 * 演示应用类
 * 自动生成的代码
 */

export class DemoApp {
  private name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  /**
   * 运行应用
   */
  run(): void {
    console.log(\`应用 \${this.name} 正在运行...\\n\`);
    
    // 模拟一些操作
    this.initialize();
    this.processData();
    this.cleanup();
  }
  
  /**
   * 初始化
   */
  private initialize(): void {
    console.log('初始化组件...');
    // 初始化逻辑
  }
  
  /**
   * 处理数据
   */
  private processData(): void {
    console.log('处理数据...');
    const data = [1, 2, 3, 4, 5];
    
    data.forEach(item => {
      console.log(\`  处理项目：\${item}\`);
    });
  }
  
  /**
   * 清理资源
   */
  private cleanup(): void {
    console.log('清理资源...');
    console.log('\\n应用运行完成！');
  }
  
  /**
   * 获取应用名称
   */
  getName(): string {
    return this.name;
  }
}

// 主函数
function main(): void {
  console.log('=== 演示应用启动 ===\\n');
  
  const app = new DemoApp('MyAwesomeApp');
  app.run();
  
  console.log('\\n=== 演示结束 ===');
}

// 执行主函数
main();
`;
    
    console.log('   正在写入代码...');
    await engine.writeContent(code);
    console.log('✅ 代码写入完成\n');
    
    // 步骤 4: 格式化代码
    console.log('📍 步骤 4: 格式化代码');
    await engine.formatCode();
    console.log('✅ 格式化完成\n');
    
    // 步骤 5: 保存文件
    console.log('📍 步骤 5: 保存文件');
    await engine.executeStep({ action: 'save' });
    console.log('✅ 文件已保存\n');
    
    // 步骤 6: 创建第二个文件
    console.log('📍 步骤 6: 创建第二个文件（工具类）');
    await engine.connector.executeAction('new_file', { filename: 'Utils.ts' });
    await engine.sleep(500);
    
    const utilsCode = `/**
 * 工具函数库
 */

/**
 * 格式化日期
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return \`\${year}-\${month}-\${day}\`;
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成随机数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

console.log('Utils 模块已加载');
`;
    
    console.log('   正在写入工具代码...');
    await engine.writeContent(utilsCode);
    await engine.sleep(500);
    
    // 步骤 7: 格式化并保存
    console.log('📍 步骤 7: 格式化并保存');
    await engine.formatCode();
    await engine.sleep(500);
    await engine.executeStep({ action: 'save' });
    console.log('✅ 完成\n');
    
    // 步骤 8: 查看操作历史
    console.log('📍 步骤 8: 操作历史');
    const history = engine.getHistory();
    console.log(`共执行 ${history.length} 个操作:`);
    history.forEach((record, i) => {
      console.log(`  ${i + 1}. ${record.action}`);
    });
    
    console.log('\n========================================');
    console.log('🎉 代码编写完成！');
    console.log('========================================\n');
    
    console.log('📁 已创建的文件:');
    console.log('  1. DemoApp.ts - 演示应用类');
    console.log('  2. Utils.ts - 工具函数库');
    
    console.log('\n💡 下一步:');
    console.log('  - 在 IDE 中查看创建的文件');
    console.log('  - 运行代码查看效果');
    console.log('  - 修改代码并重新格式化');
    
  } catch (error) {
    console.error('\n❌ 操作失败:', error.message);
    console.log('\n💡 提示:');
    console.log('  - 确保 IDE 已打开并且窗口可见');
    console.log('  - 检查是否有权限创建文件');
    console.log('  - 如果代码写入太快，可以增加延迟时间');
  } finally {
    engine.disconnect();
    console.log('\n👋 已断开连接');
  }
}

// 运行演示
demoWriteCodeInIDE().catch(console.error);
