# 🎯 通用 IDE 自动化模式 - 快速参考卡

## 🚀 一分钟快速开始

```javascript
const DevAutomationEngine = require('./src/automation/DevAutomationEngine');
const engine = new DevAutomationEngine();

// 1. 自动连接任意已打开的 IDE
await engine.autoConnect();

// 2. 创建文件
await engine.createFile('main.ts', 'console.log("Hello");');

// 3. 执行操作
await engine.build();
await engine.run();
```

## 📱 支持的 IDE

| IDE | 连接代码 | 状态 |
|-----|---------|------|
| VS Code | `connectToIDE('vscode')` | ✅ |
| DevEco Studio | `connectToIDE('deveco')` | ✅ |
| IntelliJ IDEA | `connectToIDE('intellij')` | ✅ |
| PyCharm | `connectToIDE('pycharm')` | ✅ |
| WebStorm | `connectToIDE('webstorm')` | ✅ |
| Eclipse | `connectToIDE('eclipse')` | ✅ |

## 🔑 核心 API

### 连接
```javascript
await engine.autoConnect()              // 自动检测并连接
await engine.connectToIDE('vscode')     // 手动连接指定 IDE
engine.disconnect()                     // 断开连接
```

### 文件操作
```javascript
await engine.createFile('path/file.ts', 'content')  // 创建文件
await engine.openFile('path/file.ts')               // 打开文件
await engine.executeStep({ action: 'save' })        // 保存
```

### 编辑操作
```javascript
await engine.editFile('var ', 'let ')    // 查找替换
await engine.formatCode()                // 格式化
await engine.goToLine(50)                // 跳转行
```

### 构建运行
```javascript
await engine.build()                     // 构建
await engine.run()                       // 运行
await engine.debug()                     // 调试
```

## 💼 常用工作流

### 创建项目
```javascript
const workflow = {
  name: '创建项目',
  steps: [
    { action: 'auto_connect' },
    { action: 'create_file', params: { filePath: 'index.ts', content: '...' } },
    { action: 'save_all' }
  ]
};
await engine.executeWorkflow(workflow);
```

### 代码重构
```javascript
const workflow = {
  name: '代码重构',
  steps: [
    { action: 'auto_connect' },
    { action: 'open_file', params: { filePath: 'src/app.ts' } },
    { action: 'edit_file', params: { searchText: 'var ', replaceText: 'let ' } },
    { action: 'format_code' },
    { action: 'save' }
  ]
};
await engine.executeWorkflow(workflow);
```

### 构建测试
```javascript
const workflow = {
  name: '构建测试',
  steps: [
    { action: 'auto_connect' },
    { action: 'save_all' },
    { action: 'build', delay: 5000 },
    { action: 'run_terminal_command', params: { command: 'npm test' } }
  ]
};
await engine.executeWorkflow(workflow);
```

## 🎮 完整示例

### 示例 1: 自动化日常开发
```javascript
const DevAutomationEngine = require('./src/automation/DevAutomationEngine');
const engine = new DevAutomationEngine();

async function dailyDev() {
  // 自动连接 IDE
  await engine.autoConnect();
  
  // 创建新功能文件
  await engine.createFile('src/features/new-feature.ts', `
    export class NewFeature {
      init() {
        console.log('Feature initialized');
      }
    }
  `);
  
  // 格式化代码
  await engine.formatCode();
  
  // 保存
  await engine.executeStep({ action: 'save' });
  
  // 构建项目
  await engine.build();
  
  console.log('日常开发完成！');
}

dailyDev();
```

### 示例 2: 批量文件操作
```javascript
async function batchCreate() {
  await engine.autoConnect();
  
  const files = [
    { path: 'src/components/Header.tsx', content: '...' },
    { path: 'src/components/Footer.tsx', content: '...' },
    { path: 'src/components/Sidebar.tsx', content: '...' }
  ];
  
  for (const file of files) {
    await engine.createFile(file.path, file.content);
    await engine.sleep(500); // 等待 500ms
  }
  
  await engine.executeStep({ action: 'save_all' });
  console.log('批量创建完成！');
}

batchCreate();
```

### 示例 3: 代码质量检查
```javascript
async function codeQuality() {
  await engine.autoConnect();
  
  // 打开要检查的文件
  await engine.openFile('src/app.ts');
  
  // 执行代码审查
  await engine.executeStep({ action: 'code_review' });
  
  // 格式化
  await engine.formatCode();
  
  // 保存
  await engine.executeStep({ action: 'save' });
  
  console.log('代码质量检查完成！');
}

codeQuality();
```

## ⚡ 快捷命令

```javascript
// 保存
await engine.executeStep({ action: 'save' });

// 保存全部
await engine.executeStep({ action: 'save_all' });

// 撤销
await engine.executeStep({ action: 'undo' });

// 重做
await engine.executeStep({ action: 'redo' });

// 全选
await engine.copy();  // 先全选并复制

// 粘贴
await engine.paste();

// 查找
await engine.executeAction('find', { query: 'searchText' });

// 替换
await engine.executeAction('replace');
```

## 🔧 实用技巧

### 1. 添加延迟
```javascript
await engine.sleep(1000);  // 等待 1 秒
```

### 2. 错误处理
```javascript
try {
  await engine.autoConnect();
} catch (error) {
  console.error('连接失败:', error.message);
}
```

### 3. 获取状态
```javascript
const status = engine.getStatus();
console.log('当前状态:', status);
```

### 4. 查看历史
```javascript
const history = engine.getHistory();
history.forEach(record => {
  console.log(`${record.action} - ${record.timestamp}`);
});
```

## 📊 完整工作流 JSON 示例

```json
{
  "name": "完整开发流程",
  "description": "从创建到运行的完整流程",
  "stopOnError": true,
  "steps": [
    {
      "action": "auto_connect",
      "description": "自动连接 IDE"
    },
    {
      "action": "create_file",
      "params": {
        "filePath": "src/main.ts",
        "content": "console.log('Hello');"
      },
      "delay": 1000
    },
    {
      "action": "create_file",
      "params": {
        "filePath": "src/utils.ts",
        "content": "export function helper() {}"
      },
      "delay": 1000
    },
    {
      "action": "format_code"
    },
    {
      "action": "save_all"
    },
    {
      "action": "build",
      "delay": 5000
    },
    {
      "action": "run"
    }
  ]
}
```

## 🐛 常见问题

**Q: 无法检测到 IDE？**  
A: 确保 IDE 已打开且窗口可见，或尝试手动连接：`connectToIDE('vscode')`

**Q: 按键输入不正确？**  
A: 增加延迟时间，确保 IDE 窗口处于活动状态

**Q: 快捷键不工作？**  
A: 查看 IDEConnector.js 中的快捷键映射配置

**Q: 如何支持新 IDE？**  
A: 在 IDEConnector.js 的 supportedIDEs 中添加新 IDE 配置

## 📚 相关文件

- 核心引擎：[`src/automation/DevAutomationEngine.js`](file:///f:/openclaw/commander-pro/src/automation/DevAutomationEngine.js)
- IDE 连接器：[`src/automation/IDEConnector.js`](file:///f:/openclaw/commander-pro/src/automation/IDEConnector.js)
- 使用示例：[`examples/ide-automation-examples.js`](file:///f:/openclaw/commander-pro/examples/ide-automation-examples.js)
- 测试脚本：[`test/test-ide-automation.js`](file:///f:/openclaw/commander-pro/test/test-ide-automation.js)
- 工作流模板：[`workflows/universal-dev-automation.json`](file:///f:/openclaw/commander-pro/workflows/universal-dev-automation.json)
- 完整文档：[`docs/UNIVERSAL_IDE_AUTOMATION.md`](file:///f:/openclaw/commander-pro/docs/UNIVERSAL_IDE_AUTOMATION.md)

## 🎯 运行测试

```bash
# 运行测试套件
node test/test-ide-automation.js

# 运行示例
node examples/ide-automation-examples.js
```

---

**提示**: 使用时请确保目标 IDE 已打开并准备好接收自动化操作！

*最后更新：2026-04-15*
