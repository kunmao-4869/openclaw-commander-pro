/**
 * 简单示例：在 IDE 中创建文件并写入代码
 */

import DevAutomationEngine from './src/automation/DevAutomationEngine.js';

async function simpleCodeWrite() {
  console.log('💻 简单示例：在 IDE 中编写代码\n');
  console.log('========================================\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    // 1. 连接 IDE
    console.log('📍 步骤 1: 连接 IDE');
    await engine.autoConnect();
    console.log('✅ 连接成功\n');
    
    // 2. 创建第一个文件
    console.log('📍 步骤 2: 创建第一个文件 - Hello.ts');
    await engine.connector.executeAction('new_file', { filename: 'Hello.ts' });
    await engine.sleep(500);
    
    const helloCode = `// Hello.ts - 简单的问候程序

function sayHello(name: string): void {
  console.log('你好，' + name + '!');
  console.log('欢迎使用自动化代码生成!');
}

function main(): void {
  sayHello('开发者');
  
  console.log('');
  console.log('功能演示:');
  console.log('1. 自动创建文件');
  console.log('2. 自动写入代码');
  console.log('3. 自动格式化');
  console.log('4. 自动保存');
}

main();
`;
    
    console.log('   正在写入代码...');
    await engine.writeContent(helloCode);
    await engine.sleep(300);
    
    // 格式化
    await engine.formatCode();
    await engine.sleep(300);
    
    // 保存
    await engine.executeStep({ action: 'save' });
    console.log('✅ Hello.ts 创建完成\n');
    
    // 3. 创建第二个文件
    console.log('📍 步骤 3: 创建第二个文件 - Calculator.ts');
    await engine.connector.executeAction('new_file', { filename: 'Calculator.ts' });
    await engine.sleep(500);
    
    const calcCode = `// Calculator.ts - 简单的计算器

class Calculator {
  private result: number = 0;
  
  add(num: number): Calculator {
    this.result += num;
    return this;
  }
  
  subtract(num: number): Calculator {
    this.result -= num;
    return this;
  }
  
  multiply(num: number): Calculator {
    this.result *= num;
    return this;
  }
  
  divide(num: number): Calculator {
    if (num === 0) {
      throw new Error('除数不能为零');
    }
    this.result /= num;
    return this;
  }
  
  getResult(): number {
    return this.result;
  }
  
  reset(): Calculator {
    this.result = 0;
    return this;
  }
}

// 使用示例
function main(): void {
  const calc = new Calculator();
  
  const result = calc
    .add(10)
    .multiply(5)
    .subtract(20)
    .divide(2)
    .getResult();
  
  console.log('计算结果:', result);
}

main();
`;
    
    console.log('   正在写入代码...');
    await engine.writeContent(calcCode);
    await engine.sleep(300);
    
    // 格式化
    await engine.formatCode();
    await engine.sleep(300);
    
    // 保存
    await engine.executeStep({ action: 'save' });
    console.log('✅ Calculator.ts 创建完成\n');
    
    // 4. 查看历史
    console.log('📍 步骤 4: 操作历史');
    const history = engine.getHistory();
    console.log('共执行 ' + history.length + ' 个操作');
    
    console.log('\n========================================');
    console.log('🎉 代码编写完成！');
    console.log('========================================\n');
    
    console.log('📁 已创建的文件:');
    console.log('  1. Hello.ts - 问候程序');
    console.log('  2. Calculator.ts - 计算器');
    
    console.log('\n💡 提示:');
    console.log('  - 在 IDE 中查看刚创建的文件');
    console.log('  - 可以运行这些 TypeScript 文件');
    console.log('  - 继续添加更多功能');
    
  } catch (error) {
    console.error('\n❌ 操作失败:', error.message);
  } finally {
    engine.disconnect();
    console.log('\n👋 已断开连接');
  }
}

// 运行示例
simpleCodeWrite().catch(console.error);
