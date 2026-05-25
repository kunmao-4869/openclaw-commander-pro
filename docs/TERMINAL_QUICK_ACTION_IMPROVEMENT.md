# 终端面板需求输入功能说明

## 📋 功能改进

### 改进前的问题
- ❌ 快捷操作按钮只能创建文件夹
- ❌ 无法输入具体项目需求
- ❌ 用户体验差

### 改进后的功能
- ✅ 点击按钮弹出需求输入对话框
- ✅ 可以详细描述项目需求
- ✅ 交互体验优秀

---

## 🎯 使用方式

### 方式 1：快捷操作按钮（推荐）⭐

#### 步骤 1：点击快捷按钮
在终端面板下方找到"⚡ 快捷操作"区域，点击任意项目类型按钮：
- 📱 HarmonyOS 项目
- 🎮 Unreal 游戏
- 🐍 Python 工具
- ⚛️ React 应用

#### 步骤 2：填写需求描述
弹出对话框后，在文本框中输入项目需求：
```
例如：
- 开发一个猜数字游戏
- 开发一个计算器应用
- 开发一个待办事项管理
- 开发一个天气查询应用
```

#### 步骤 3：确认创建
点击"✅ 确认创建"按钮，系统会：
1. 自动识别项目类型
2. 创建智能工作流项目
3. 生成文件夹结构
4. 显示项目状态

---

## 💬 示例场景

### 场景 1：创建 HarmonyOS 游戏项目

**操作**：
1. 点击"📱 HarmonyOS 项目"
2. 输入需求："开发一个猜数字游戏，包含界面和提示功能"
3. 点击"确认创建"

**结果**：
```
🤖 识别到 1 个技能调用
  → 执行技能：create_workflow_project
📊 项目分析：HarmonyOS 应用 (90.0%)
✅ 项目创建成功
  项目名称：HarmonyOS_App
  项目类型：harmonyos
  文件夹结构:
    - studying: studying/
    - project: project/
    - img: img/
```

### 场景 2：创建 Unreal 游戏项目

**操作**：
1. 点击"🎮 Unreal 游戏"
2. 输入需求："开发一个第一人称射击游戏，包含地图和敌人"
3. 点击"确认创建"

### 场景 3：创建 Python 工具

**操作**：
1. 点击"🐍 Python 工具"
2. 输入需求："开发一个文件批量重命名工具"
3. 点击"确认创建"

### 场景 4：创建 React 应用

**操作**：
1. 点击"⚛️ React 应用"
2. 输入需求："开发一个个人博客网站"
3. 点击"确认创建"

---

## 🎨 界面布局

### 快捷操作区域
```
┌─────────────────────────────────────┐
│ ⚡ 快捷操作                         │
├─────────────────────────────────────┤
│ [📱 HarmonyOS 项目] [🎮 Unreal 游戏]│
│ [🐍 Python 工具]   [⚛️ React 应用]  │
└─────────────────────────────────────┘
```

### 需求输入对话框
```
┌───────────────────────────────────┐
│ 📱 创建 HarmonyOS 项目             │
├───────────────────────────────────┤
│ 项目需求描述                       │
│ ┌───────────────────────────────┐ │
│ │ 开发一个猜数字游戏...          │ │
│ │                               │ │
│ │                               │ │
│ └───────────────────────────────┘ │
│                                   │
│ 💡 提示：描述越详细，生成的项目   │
│    越符合你的需求                 │
│                                   │
│ [✅ 确认创建]  [❌ 取消]          │
└───────────────────────────────────┘
```

---

## 🔧 技术实现

### 状态管理
```javascript
const [showProjectInput, setShowProjectInput] = useState(false)
const [projectType, setProjectType] = useState('harmonyos')
const [projectRequirement, setProjectRequirement] = useState('')
```

### 处理函数
```javascript
// 打开需求输入对话框
const handleQuickAction = (type, defaultRequirement) => {
  setProjectType(type)
  setProjectRequirement(defaultRequirement)
  setShowProjectInput(true)
}

// 确认创建项目
const confirmCreateProject = () => {
  const command = `创建一个${projectType}项目，需求：${projectRequirement}`
  executeCommand(command)
  setShowProjectInput(false)
}

// 取消创建
const cancelCreateProject = () => {
  setShowProjectInput(false)
  setProjectRequirement('')
}
```

---

## 📊 功能对比

| 功能 | 改进前 | 改进后 |
|------|--------|--------|
| 快捷按钮 | ❌ 只能创建文件夹 | ✅ 弹出需求输入框 |
| 需求输入 | ❌ 无法输入 | ✅ 可以详细描述 |
| 交互体验 | ⚠️ 差 | ✅ 优秀 |
| 用户满意度 | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 💡 使用技巧

### 1. 需求描述要具体
**好的示例**：
```
开发一个猜数字游戏，包含以下功能：
- 随机生成 1-100 的数字
- 用户输入猜测
- 提示"太大了"或"太小了"
- 记录猜测次数
- 游戏结束后显示统计
```

**不好的示例**：
```
做一个游戏
```

### 2. 可以指定技术栈
```
使用 ArkTS 开发一个 HarmonyOS 应用，实现天气预报功能
```

### 3. 可以指定功能模块
```
开发一个 Python 工具，包含：
- 文件选择对话框
- 批量处理功能
- 进度条显示
- 结果导出
```

---

## 🎯 完整流程

### 1. 点击快捷按钮
```
👆 用户点击"📱 HarmonyOS 项目"
```

### 2. 填写需求
```
📝 输入："开发一个猜数字游戏"
```

### 3. 确认创建
```
✅ 点击"确认创建"按钮
```

### 4. 系统处理
```
🤖 识别技能：create_workflow_project
📊 分析项目：HarmonyOS 应用
✅ 创建项目结构
📁 显示项目状态
```

### 5. 后续操作
```
📚 学习文档：学习 https://url 并保存到 studying
🔍 检索代码：在 studying 中搜索示例
💻 编写项目：在 project 文件夹中创建代码
```

---

## ✅ 优势

### 1. 交互友好
- ✅ 弹出对话框，聚焦输入
- ✅ 清晰的提示和引导
- ✅ 确认/取消操作

### 2. 需求明确
- ✅ 可以详细描述需求
- ✅ 系统准确理解意图
- ✅ 生成符合需求的项目

### 3. 流程完整
- ✅ 从需求到创建一气呵成
- ✅ 自动创建文件夹结构
- ✅ 实时显示项目状态

---

## 🔗 相关文档

- [`TERMINAL_PANEL_IMPROVEMENT.md`](file:///f:/openclaw/commander-pro/docs/TERMINAL_PANEL_IMPROVEMENT.md) - 终端面板改进报告
- [`WORKFLOW_SYSTEM_GUIDE.md`](file:///f:/openclaw/commander-pro/docs/WORKFLOW_SYSTEM_GUIDE.md) - 工作流系统指南

---

**版本**: 1.0.4  
**更新时间**: 2026-04-27  
**作者**: Commander Pro Team
