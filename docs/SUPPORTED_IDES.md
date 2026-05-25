# 支持的 IDE 列表

## ✅ 已测试通过的 IDE

### 1. DevEco Studio
- **用途**: HarmonyOS 应用开发
- **进程名**: `devecostudio64.exe`
- **测试状态**: ✅ 完全支持
- **支持操作**:
  - ✅ 自动检测和连接
  - ✅ 文件创建/打开/保存
  - ✅ 代码格式化
  - ✅ 构建和运行
  - ✅ 查找/替换
  - ✅ 跳转到行
  - ✅ 代码审查

**测试命令**:
```bash
node test-ide-quick.js
```

### 2. IntelliJ IDEA
- **用途**: Java/Kotlin 开发
- **进程名**: `idea64.exe`
- **测试状态**: ✅ 完全支持
- **支持操作**:
  - ✅ 自动检测和连接
  - ✅ 文件创建/打开/保存
  - ✅ 代码格式化 (Ctrl+Alt+L)
  - ✅ 构建和运行
  - ✅ 查找/替换
  - ✅ 跳转到行 (Ctrl+G)
  - ✅ 代码审查 (Alt+Enter)
  - ✅ 保存所有 (Ctrl+Shift+S)

**测试命令**:
```bash
node test-intellij.js
```

### 3. Visual Studio Code
- **用途**: 通用代码编辑器
- **进程名**: `Code.exe`
- **测试状态**: ⭕ 支持但未测试
- **支持操作**:
  - ✅ 自动检测和连接
  - ✅ 文件操作
  - ✅ 代码格式化 (Shift+Alt+F)
  - ✅ 终端集成 (Ctrl+`)
  - ✅ 查找/替换
  - ✅ 快速修复 (Ctrl+.)

**测试命令**:
```bash
# 先打开 VS Code，然后运行
node test-all-ides.js
```

### 4. PyCharm
- **用途**: Python 开发
- **进程名**: `pycharm64.exe`
- **测试状态**: ⭕ 支持但未测试
- **支持操作**:
  - ✅ 自动检测和连接
  - ✅ 文件操作
  - ✅ 代码格式化 (Ctrl+Alt+L)
  - ✅ 运行/调试
  - ✅ 重构功能

### 5. WebStorm
- **用途**: JavaScript/前端开发
- **进程名**: `webstorm64.exe`
- **测试状态**: ⭕ 支持但未测试
- **支持操作**:
  - ✅ 自动检测和连接
  - ✅ 文件操作
  - ✅ 代码格式化
  - ✅ 运行/调试
  - ✅ 前端框架支持

### 6. Eclipse
- **用途**: Java IDE
- **进程名**: `eclipse.exe`
- **测试状态**: ⭕ 支持但未测试
- **支持操作**:
  - ✅ 自动检测和连接
  - ✅ 文件操作
  - ✅ 代码格式化 (Ctrl+Shift+F)
  - ✅ 构建/运行

## 🎯 如何测试其他 IDE

### 方法 1: 使用通用测试脚本
```bash
# 测试所有已打开的 IDE
node test-all-ides.js
```

### 方法 2: 手动指定 IDE
```javascript
import DevAutomationEngine from './src/automation/DevAutomationEngine.js';

const engine = new DevAutomationEngine();

// 连接特定 IDE
await engine.connectToIDE('vscode');     // VS Code
await engine.connectToIDE('pycharm');    // PyCharm
await engine.connectToIDE('webstorm');   // WebStorm
await engine.connectToIDE('eclipse');    // Eclipse
await engine.connectToIDE('intellij');   // IntelliJ IDEA
await engine.connectToIDE('deveco');     // DevEco Studio

// 执行操作
await engine.executeStep({ action: 'save' });
await engine.executeStep({ action: 'format_code' });
```

### 方法 3: 自动连接
```javascript
// 自动检测并连接第一个找到的 IDE
await engine.autoConnect();
```

## 📊 IDE 快捷键对照表

| 操作 | DevEco Studio | IntelliJ IDEA | VS Code | PyCharm |
|------|--------------|---------------|---------|---------|
| 保存 | Ctrl+S | Ctrl+S | Ctrl+S | Ctrl+S |
| 保存所有 | Ctrl+Shift+S | Ctrl+Shift+S | Ctrl+Shift+S | Ctrl+Shift+S |
| 格式化 | Ctrl+Alt+L | Ctrl+Alt+L | Shift+Alt+F | Ctrl+Alt+L |
| 查找 | Ctrl+F | Ctrl+F | Ctrl+F | Ctrl+F |
| 替换 | Ctrl+H | Ctrl+H | Ctrl+H | Ctrl+H |
| 跳转行 | Ctrl+G | Ctrl+G | Ctrl+G | Ctrl+G |
| 运行 | Shift+F10 | Shift+F10 | F5 | Shift+F10 |
| 调试 | Shift+F9 | Shift+F9 | F5 | Shift+F9 |
| 快速修复 | Alt+Enter | Alt+Enter | Ctrl+. | Alt+Enter |

## 🔧 添加新 IDE 支持

要添加新的 IDE 支持，只需在 `IDEConnector.js` 中添加配置：

```javascript
this.supportedIDEs = {
  'myide': {
    name: 'My Custom IDE',
    processNames: ['myide.exe'],
    windowTitles: ['My IDE'],
    defaultPath: 'C:\\Program Files\\My IDE'
  }
};
```

## 📝 测试报告

### 2026-04-15 测试结果

| IDE | 检测 | 连接 | 保存 | 格式化 | 查找 | 状态 |
|-----|------|------|------|--------|------|------|
| DevEco Studio | ✅ | ✅ | ✅ | ✅ | ✅ | 完全支持 |
| IntelliJ IDEA | ✅ | ✅ | ✅ | ✅ | ✅ | 完全支持 |
| VS Code | ⭕ | - | - | - | - | 未运行 |
| PyCharm | ⭕ | - | - | - | - | 未运行 |
| WebStorm | ⭕ | - | - | - | - | 未运行 |
| Eclipse | ⭕ | - | - | - | - | 未运行 |

**图例**:
- ✅: 测试通过
- ⭕: 支持但未运行
- ❌: 测试失败
- -: 未测试

## 🚀 使用建议

1. **自动模式** (推荐): 使用 `autoConnect()` 自动连接已打开的 IDE
2. **手动模式**: 使用 `connectToIDE('ide-key')` 连接特定 IDE
3. **多 IDE 切换**: 可以在不同 IDE 之间切换控制
4. **工作流自动化**: 使用预定义工作流或自定义工作流

## 💡 提示

- 确保 IDE 窗口已打开且未最小化
- 某些操作可能需要 IDE 窗口处于活动状态
- 如果连接失败，尝试手动指定 IDE 类型
- 查看 [UNIVERSAL_IDE_AUTOMATION.md](./UNIVERSAL_IDE_AUTOMATION.md) 了解更多用法

---

*最后更新：2026-04-15*
