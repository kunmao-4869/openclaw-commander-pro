/**
 * AI 集成工作流使用示例
 * 演示如何结合 AI 生成和学习文档自动创建代码
 */

import AIIntegrationWorkflow from './src/workflow/AIIntegrationWorkflow.js';

async function example1_TypeScriptClass() {
  console.log('\\n========================================');
  console.log('示例 1: 生成 TypeScript 类');
  console.log('========================================\\n');
  
  const workflow = new AIIntegrationWorkflow();
  
  await workflow.executeWorkflow({
    templateType: 'typescript-class',
    templateOptions: {
      name: 'UserService',
      methods: ['create', 'update', 'delete', 'findById']
    },
    generateDoc: true
  });
}

async function example2_HarmonyOSComponent() {
  console.log('\\n========================================');
  console.log('示例 2: 生成 HarmonyOS 组件');
  console.log('========================================\\n');
  
  const workflow = new AIIntegrationWorkflow();
  
  await workflow.executeWorkflow({
    templateType: 'harmonyos-component',
    templateOptions: {
      name: 'Counter',
      type: 'ets'
    },
    generateDoc: true
  });
}

async function example3_ReactComponent() {
  console.log('\\n========================================');
  console.log('示例 3: 生成 React 组件');
  console.log('========================================\\n');
  
  const workflow = new AIIntegrationWorkflow();
  
  await workflow.executeWorkflow({
    templateType: 'react-component',
    templateOptions: {
      name: 'TodoList'
    },
    generateDoc: true
  });
}

async function example4_NodeJSServer() {
  console.log('\\n========================================');
  console.log('示例 4: 生成 Node.js 服务器');
  console.log('========================================\\n');
  
  const workflow = new AIIntegrationWorkflow();
  
  await workflow.executeWorkflow({
    templateType: 'nodejs-server',
    templateOptions: {
      name: 'APIServer',
      port: 8080
    },
    generateDoc: true
  });
}

async function example5_CustomTemplate() {
  console.log('\\n========================================');
  console.log('示例 5: 自定义模板');
  console.log('========================================\\n');
  
  const workflow = new AIIntegrationWorkflow();
  
  // 自定义代码生成
  const customCode = {
    name: '自定义项目',
    files: [
      {
        filename: 'main.ts',
        content: `/**
 * 主程序入口
 * 自定义生成的代码
 */

import { Application } from './Application';
import { Logger } from './utils/Logger';

function main(): void {
  console.log('应用程序启动...');
  
  const logger = new Logger();
  logger.info('初始化应用');
  
  const app = new Application();
  app.initialize();
  app.run();
  
  logger.info('应用运行中');
}

main();
`
      },
      {
        filename: 'Application.ts',
        content: `/**
 * 应用类
 */

export class Application {
  private initialized: boolean = false;
  
  initialize(): void {
    console.log('初始化应用...');
    this.initialized = true;
  }
  
  run(): void {
    if (!this.initialized) {
      throw new Error('请先初始化应用');
    }
    console.log('应用运行中...');
  }
  
  getStatus(): string {
    return this.initialized ? '运行中' : '未初始化';
  }
}
`
      },
      {
        filename: 'utils/Logger.ts',
        content: `/**
 * 日志工具类
 */

export class Logger {
  private prefix: string;
  
  constructor(prefix: string = 'LOG') {
    this.prefix = prefix;
  }
  
  info(message: string): void {
    console.log(\`[\${this.prefix}] [INFO] \${message}\`);
  }
  
  error(message: string): void {
    console.error(\`[\${this.prefix}] [ERROR] \${message}\`);
  }
  
  warn(message: string): void {
    console.warn(\`[\${this.prefix}] [WARN] \${message}\`);
  }
}
`
      }
    ]
  };
  
  // 设置自定义代码
  workflow.generatedCode = customCode;
  
  // 在 IDE 中创建
  await workflow.createFilesInIDE();
  
  // 生成文档
  await workflow.generateProjectDoc();
  
  console.log('\\n✅ 自定义项目创建完成');
}

async function runAllExamples() {
  console.log('🚀 AI 集成工作流示例演示');
  console.log('========================================');
  console.log('请选择要运行的示例:');
  console.log('1. TypeScript 类 (UserService)');
  console.log('2. HarmonyOS 组件 (Counter)');
  console.log('3. React 组件 (TodoList)');
  console.log('4. Node.js 服务器 (APIServer)');
  console.log('5. 自定义项目');
  console.log('0. 运行所有示例');
  console.log('========================================\\n');
  
  // 取消注释以运行特定示例
  // await example1_TypeScriptClass();
  // await example2_HarmonyOSComponent();
  // await example3_ReactComponent();
  // await example4_NodeJSServer();
  // await example5_CustomTemplate();
  
  console.log('💡 提示：取消注释相应的示例函数来运行');
}

// 如果直接运行
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}

export {
  example1_TypeScriptClass,
  example2_HarmonyOSComponent,
  example3_ReactComponent,
  example4_NodeJSServer,
  example5_CustomTemplate
};
