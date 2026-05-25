# 如何在 IDE 中自动编写代码

## 🎯 功能概述

系统可以自动控制任意已打开的 IDE（DevEco Studio、IntelliJ IDEA、VS Code 等），在 IDE 中：
- ✅ 创建新文件
- ✅ 写入代码内容
- ✅ 格式化代码
- ✅ 保存文件
- ✅ 执行构建/运行

## 📝 基本用法

### 方法 1: 简单示例

```javascript
import DevAutomationEngine from './src/automation/DevAutomationEngine.js';

const engine = new DevAutomationEngine();

// 1. 连接 IDE
await engine.autoConnect();

// 2. 创建文件
await engine.connector.executeAction('new_file', { filename: 'MyApp.ts' });
await engine.sleep(500);

// 3. 写入代码
const code = `
function hello(): void {
  console.log('Hello World!');
}

hello();
`;

await engine.writeContent(code);

// 4. 格式化
await engine.formatCode();

// 5. 保存
await engine.executeStep({ action: 'save' });
```

### 方法 2: 使用封装函数

```javascript
async function createFile(engine, filename, content) {
  console.log('创建:', filename);
  
  // 新建文件
  await engine.connector.executeAction('new_file', { filename });
  await engine.sleep(500);
  
  // 写入内容
  await engine.writeContent(content);
  await engine.sleep(300);
  
  // 格式化
  await engine.formatCode();
  
  // 保存
  await engine.executeStep({ action: 'save' });
  
  console.log('✅', filename, '完成');
}

// 使用
await createFile(engine, 'App.ts', 'console.log("Hello");');
```

## 🚀 完整示例

### 示例 1: 创建 TypeScript 文件

```javascript
import DevAutomationEngine from './src/automation/DevAutomationEngine.js';

async function createTypeScriptFile() {
  const engine = new DevAutomationEngine();
  
  try {
    // 连接 IDE
    await engine.autoConnect();
    
    // 创建文件
    await engine.connector.executeAction('new_file', { filename: 'Demo.ts' });
    await engine.sleep(500);
    
    // 编写代码
    const code = `// Demo.ts - 演示文件

class Demo {
  private name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  run(): void {
    console.log('运行:' + this.name);
  }
}

const demo = new Demo('测试');
demo.run();
`;
    
    await engine.writeContent(code);
    await engine.sleep(300);
    
    // 格式化并保存
    await engine.formatCode();
    await engine.executeStep({ action: 'save' });
    
    console.log('✅ 文件创建完成');
    
  } catch (error) {
    console.error('失败:', error);
  } finally {
    engine.disconnect();
  }
}

createTypeScriptFile();
```

### 示例 2: 创建多个文件

```javascript
async function createMultipleFiles() {
  const engine = new DevAutomationEngine();
  
  await engine.autoConnect();
  
  // 文件列表
  const files = [
    {
      name: 'Utils.ts',
      content: `export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}`
    },
    {
      name: 'Logger.ts',
      content: `export class Logger {
  static log(message: string): void {
    console.log('[LOG]', message);
  }
  
  static error(message: string): void {
    console.error('[ERROR]', message);
  }
}`
    }
  ];
  
  // 循环创建
  for (const file of files) {
    console.log('创建:', file.name);
    
    await engine.connector.executeAction('new_file', { filename: file.name });
    await engine.sleep(500);
    await engine.writeContent(file.content);
    await engine.sleep(300);
    await engine.formatCode();
    await engine.sleep(300);
    await engine.executeStep({ action: 'save' });
    
    await engine.sleep(1000); // 文件间延迟
  }
  
  // 保存所有
  await engine.executeStep({ action: 'save_all' });
  
  engine.disconnect();
}
```

### 示例 3: 创建完整项目

```javascript
async function createProject() {
  const engine = new DevAutomationEngine();
  
  await engine.autoConnect();
  
  console.log('🚀 开始创建项目...\n');
  
  // 1. 创建数据模型
  await createFile(engine, 'Todo.ts', `
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export class TodoItem implements Todo {
  id: number;
  title: string;
  completed: boolean;
  
  constructor(title: string) {
    this.id = Date.now();
    this.title = title;
    this.completed = false;
  }
}
  `);
  
  // 2. 创建服务层
  await createFile(engine, 'TodoService.ts', `
import { Todo, TodoItem } from './Todo';

export class TodoService {
  private todos: Todo[] = [];
  
  add(todo: Todo): void {
    this.todos.push(todo);
  }
  
  getAll(): Todo[] {
    return this.todos;
  }
}
  `);
  
  // 3. 创建主程序
  await createFile(engine, 'index.ts', `
import { TodoItem } from './Todo';
import { TodoService } from './TodoService';

const service = new TodoService();
service.add(new TodoItem('学习 TypeScript'));
service.add(new TodoItem('编写测试'));

console.log(service.getAll());
  `);
  
  // 4. 保存所有
  await engine.executeStep({ action: 'save_all' });
  
  console.log('\n✅ 项目创建完成！');
  
  engine.disconnect();
}

// 辅助函数
async function createFile(engine, filename, content) {
  console.log('   创建:', filename);
  await engine.connector.executeAction('new_file', { filename });
  await engine.sleep(500);
  await engine.writeContent(content);
  await engine.sleep(300);
  await engine.formatCode();
  await engine.sleep(300);
  await engine.executeStep({ action: 'save' });
  console.log('   ✅', filename);
}
```

## 💡 实用技巧

### 1. 控制写入速度

```javascript
// 分段写入大文件
const chunks = code.split('\n');
for (const chunk of chunks) {
  await engine.connector.sendKeys(chunk + '\n');
  await engine.sleep(50); // 每行延迟 50ms
}
```

### 2. 处理特殊情况

```javascript
// 如果文件已存在，先删除
await engine.connector.executeAction('find', { query: filename });
await engine.sleep(200);
await engine.connector.sendHotkey('ctrl', 'a');
await engine.sleep(100);
await engine.connector.sendHotkey('delete', '');

// 然后写入新内容
await engine.writeContent(newContent);
```

### 3. 添加延迟

```javascript
// 关键步骤之间添加延迟
await engine.sleep(1000); // 1 秒
await engine.sleep(2000); // 2 秒
```

### 4. 错误处理

```javascript
try {
  await engine.writeContent(code);
} catch (error) {
  console.error('写入失败:', error);
  
  // 重试
  await engine.sleep(1000);
  await engine.writeContent(code);
}
```

## 🔧 可用的操作

| 操作 | 说明 | 示例 |
|------|------|------|
| `new_file` | 创建新文件 | `executeAction('new_file', { filename: 'App.ts' })` |
| `writeContent` | 写入内容 | `writeContent(code)` |
| `format_code` | 格式化代码 | `formatCode()` |
| `save` | 保存 | `executeStep({ action: 'save' })` |
| `save_all` | 保存全部 | `executeStep({ action: 'save_all' })` |
| `find` | 查找 | `executeAction('find', { query: 'text' })` |
| `replace` | 替换 | `executeAction('replace')` |
| `goto_line` | 跳转行 | `executeStep({ action: 'goto_line', params: { lineNumber: 10 } })` |

## 📚 测试脚本

运行以下测试脚本来体验：

```bash
# 简单示例
node demo-simple-write.js

# 完整项目创建（需要修复语法）
node demo-create-project.js

# 快速测试
node test-ide-quick.js
```

## ⚠️ 注意事项

1. **确保 IDE 已打开** - 运行前先打开目标 IDE
2. **窗口不要最小化** - IDE 窗口需要可见
3. **适当的延迟** - 根据电脑性能调整延迟时间
4. **文件命名** - 确保文件名符合 IDE 要求
5. **代码格式** - 写入的代码应该是有效的语法

## 🎓 最佳实践

1. **小步快跑** - 先测试小段代码，再扩展到完整项目
2. **逐步验证** - 每步操作后检查是否成功
3. **添加日志** - 记录每个步骤便于调试
4. **错误恢复** - 设计重试机制
5. **合理延迟** - 给 IDE 足够的响应时间

## 📖 相关文档

- [UNIVERSAL_IDE_AUTOMATION.md](./UNIVERSAL_IDE_AUTOMATION.md) - 完整使用指南
- [SUPPORTED_IDES.md](./SUPPORTED_IDES.md) - 支持的 IDE 列表
- [ide-automation-examples.js](../examples/ide-automation-examples.js) - 更多示例

---

*最后更新：2026-04-15*
