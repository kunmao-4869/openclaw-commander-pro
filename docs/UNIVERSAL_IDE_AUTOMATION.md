# 通用 IDE 自动化模式使用指南

## 🚀 什么是通用 IDE 自动化模式？

这是一种**智能开发模式**，可以：
1. ✅ **自动检测**并连接任意已打开的 IDE（DevEco Studio、VS Code、IntelliJ、PyCharm 等）
2. ✅ **自动控制** IDE 进行开发操作（创建文件、编辑代码、构建、运行等）
3. ✅ **工作流驱动** - 使用预定义或自定义工作流自动化整个开发过程

## 📋 支持的 IDE

| IDE | 状态 | 快捷键适配 |
|-----|------|-----------|
| DevEco Studio | ✅ 支持 | 已适配 |
| Visual Studio Code | ✅ 支持 | 已适配 |
| IntelliJ IDEA | ✅ 支持 | 已适配 |
| PyCharm | ✅ 支持 | 已适配 |
| WebStorm | ✅ 支持 | 已适配 |
| Eclipse | ✅ 支持 | 已适配 |

## 🔧 快速开始

### 1. 基本使用 - 自动连接

```javascript
const DevAutomationEngine = require('./src/automation/DevAutomationEngine');

const engine = new DevAutomationEngine();

// 自动检测并连接已打开的 IDE
await engine.autoConnect();

console.log('已连接:', engine.getStatus());
```

### 2. 创建文件

```javascript
// 创建新文件并写入内容
await engine.createFile('src/main.ts', `
console.log('Hello World');
`);
```

### 3. 编辑代码

```javascript
// 打开文件
await engine.openFile('src/main.ts');

// 查找并替换
await engine.editFile('var ', 'let ');

// 格式化代码
await engine.formatCode();

// 保存
await engine.executeStep({ action: 'save' });
```

### 4. 构建和运行

```javascript
// 构建项目
await engine.build();

// 运行项目
await engine.run();

// 调试
await engine.debug();
```

## 📖 完整工作流示例

### 示例 1: 自动创建项目

```javascript
const workflow = {
  name: '创建项目',
  steps: [
    { action: 'auto_connect' },
    { 
      action: 'create_file', 
      params: { 
        filePath: 'index.ts',
        content: 'console.log("Hello");'
      },
      delay: 1000
    },
    { action: 'save_all' }
  ]
};

await engine.executeWorkflow(workflow);
```

### 示例 2: 代码重构流程

```javascript
const workflow = {
  name: '代码重构',
  steps: [
    { action: 'auto_connect' },
    { action: 'open_file', params: { filePath: 'src/app.ts' } },
    { action: 'edit_file', params: { searchText: 'var ', replaceText: 'let ' } },
    { action: 'format_code' },
    { action: 'save' },
    { action: 'build' }
  ]
};

await engine.executeWorkflow(workflow);
```

## 🎯 可用的操作命令

### 文件操作
- `create_file` - 创建新文件
- `open_file` - 打开文件
- `save` - 保存
- `save_all` - 保存全部

### 编辑操作
- `write_content` - 写入内容
- `edit_file` - 查找替换
- `format_code` - 格式化代码
- `goto_line` - 跳转到行

### 构建运行
- `build` - 构建项目
- `run` - 运行项目
- `debug` - 调试
- `run_terminal_command` - 执行终端命令

### 其他操作
- `code_review` - 代码审查
- `copy` - 复制
- `paste` - 粘贴
- `undo` - 撤销
- `redo` - 重做

## 🔌 连接模式

### 模式 1: 自动连接（推荐）
```javascript
await engine.autoConnect();
// 自动检测系统中已打开的 IDE 并连接
```

### 模式 2: 手动指定
```javascript
await engine.connectToIDE('vscode');
// 可指定：'vscode', 'deveco', 'intellij', 'pycharm', 'webstorm', 'eclipse'
```

## 💡 实际应用场景

### 场景 1: 批量创建文件
```javascript
const files = [
  { path: 'src/index.ts', content: '...' },
  { path: 'src/utils.ts', content: '...' },
  { path: 'src/config.ts', content: '...' }
];

for (const file of files) {
  await engine.createFile(file.path, file.content);
  await engine.sleep(500);
}
```

### 场景 2: 代码标准化
```javascript
// 将所有 var 改为 let/const
await engine.editFile('var ', 'let ');

// 格式化所有代码
await engine.formatCode();

// 保存
await engine.save_all();
```

### 场景 3: 自动化测试
```javascript
// 打开测试文件
await engine.openFile('test/app.test.ts');

// 运行测试
await engine.runTerminalCommand('npm test');

// 查看结果
await engine.sleep(5000);
```

## 📊 工作流 JSON 格式

```json
{
  "name": "我的工作流",
  "description": "工作流描述",
  "stopOnError": true,
  "steps": [
    {
      "action": "auto_connect"
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
      "action": "build"
    }
  ]
}
```

## 🎮 使用预定义工作流

```javascript
// 加载预定义工作流
const workflows = require('./workflows/universal-dev-automation.json');

// 执行工作流
await engine.executeWorkflow(workflows.workflows[0]);
```

## ⚙️ 高级配置

### 自定义 IDE 配置
```javascript
const connector = new IDEConnector();

// 添加自定义 IDE 支持
connector.supportedIDEs['myide'] = {
  name: 'My Custom IDE',
  processNames: ['myide.exe'],
  windowTitles: ['My IDE'],
  defaultPath: 'C:\\Program Files\\My IDE'
};
```

### 操作历史记录
```javascript
// 获取操作历史
const history = engine.getHistory();
console.log('已执行的操作:', history);

// 清除历史
engine.clearHistory();
```

## 🔍 故障排除

### 问题 1: 无法检测到 IDE
**解决方案：**
- 确保 IDE 已经打开并且窗口可见
- 检查 IDE 进程是否在运行
- 尝试手动指定 IDE：`connectToIDE('vscode')`

### 问题 2: 按键输入不正确
**解决方案：**
- 增加步骤间的延迟：`delay: 1000`
- 确保 IDE 窗口处于活动状态
- 检查是否有其他程序干扰

### 问题 3: 快捷键不工作
**解决方案：**
- 不同 IDE 快捷键可能不同
- 查看 IDEConnector.js 中的快捷键映射
- 可以自定义快捷键配置

## 📚 API 参考

### DevAutomationEngine

| 方法 | 描述 | 参数 |
|------|------|------|
| `autoConnect()` | 自动连接 IDE | 无 |
| `connectToIDE(ideKey)` | 连接到指定 IDE | ideKey: 'vscode', 'deveco' 等 |
| `createFile(filePath, content)` | 创建文件 | filePath: 文件路径，content: 内容 |
| `openFile(filePath)` | 打开文件 | filePath: 文件路径 |
| `editFile(search, replace)` | 查找替换 | search: 查找文本，replace: 替换文本 |
| `formatCode()` | 格式化代码 | 无 |
| `build()` | 构建项目 | 无 |
| `run()` | 运行项目 | 无 |
| `debug()` | 调试 | 无 |
| `executeWorkflow(workflow)` | 执行工作流 | workflow: 工作流对象 |
| `getStatus()` | 获取状态 | 无 |
| `disconnect()` | 断开连接 | 无 |

## 🎓 最佳实践

1. **总是使用延迟** - 在操作之间添加适当的延迟
2. **错误处理** - 使用 try-catch 包裹操作
3. **及时断开** - 使用完毕后调用 `disconnect()`
4. **记录历史** - 使用 `getHistory()` 跟踪操作
5. **测试工作流** - 先在小范围测试工作流

## 📝 示例代码

完整示例请查看：
- [`examples/ide-automation-examples.js`](file:///f:/openclaw/commander-pro/examples/ide-automation-examples.js)
- [`workflows/universal-dev-automation.json`](file:///f:/openclaw/commander-pro/workflows/universal-dev-automation.json)

## 🚀 开始使用

```bash
# 运行示例
node examples/ide-automation-examples.js
```

---

*最后更新：2026-04-15*
