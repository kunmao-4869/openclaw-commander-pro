# 🤖 AI 驱动智能工作流系统

## 📊 系统概述

这是一个创新的 AI 驱动工作流生成系统，能够理解自然语言并自动生成可执行的工作流。

### 核心特性
- ✨ **自然语言理解**：用日常语言描述任务，AI 自动生成工作流
- 🎯 **智能推荐**：根据关键词匹配推荐工作流模式
- 🔧 **参数自动推断**：AI 自动识别和填充所需参数
- 💬 **对话式交互**：通过对话不断完善工作流
- ⚡ **即时执行**：生成的工作流可立即执行

---

## 🚀 使用指南

### 方法 1：AI 对话生成（推荐）

1. **打开工作流标签页**
2. **点击"AI 生成工作流"按钮**（右上角，紫色渐变）
3. **在对话框中描述任务**，例如：

```
帮我诊断网络问题
```

```
研究最新的人工智能发展趋势
```

```
启动抖音并查看热门视频
```

```
查找项目中的所有 JavaScript 文件
```

4. **AI 会理解你的需求并生成工作流**
5. **点击"执行工作流"按钮**立即运行

### 方法 2：使用预定义模板

1. 在工作流标签页选择预设工作流
2. 点击"执行"按钮
3. 查看执行结果

---

## 🧠 AI 工作原理

### 1️⃣ 意图理解
AI 使用 qwen3:8b 模型分析用户输入：
```javascript
用户输入："帮我诊断网络问题"

AI 理解：
{
  "category": "diagnosis",
  "intent": "诊断网络问题",
  "entities": {},
  "parameters": {},
  "confidence": 0.95
}
```

### 2️⃣ 模式匹配
系统根据意图匹配预定义的工作流模式：

**诊断模式**：
```javascript
{
  keywords: ['诊断', '检查', '问题', '故障', '为什么'],
  steps: [
    { action: 'get_system_info', params: { detail_level: 'basic' } },
    { action: 'get_network_info', params: {} },
    { action: 'analyze_search_results', params: { query: '{{userInput}}' } }
  ]
}
```

### 3️⃣ 参数填充
AI 自动推断参数：
```javascript
// 从用户输入中提取
"启动抖音" → { appName: "抖音" }
"研究 AI 发展" → { researchTopic: "AI 发展" }
"查找 JS 文件" → { filePattern: "*.js" }
```

### 4️⃣ 工作流生成
创建可执行的 WorkflowBuilder 实例：
```javascript
const workflow = new WorkflowBuilder(...)
  .addAction('获取系统信息', 'get_system_info', {...})
  .addAction('获取网络信息', 'get_network_info', {...})
  .addAction('分析结果', 'analyze_search_results', {...})
  .build();
```

---

## 📋 支持的工作流类型

### 1. 🔍 诊断类（Diagnosis）
**关键词**：诊断、检查、问题、故障、为什么

**示例**：
- "帮我诊断网络问题"
- "检查系统状态"
- "为什么电脑这么卡"

**生成步骤**：
1. 获取系统信息
2. 获取网络信息
3. 分析搜索结果

### 2. 📚 研究类（Research）
**关键词**：研究、了解、学习、调查、分析

**示例**：
- "研究最新 AI 发展趋势"
- "了解量子计算"
- "调查市场动态"

**生成步骤**：
1. Web 搜索
2. 分析搜索结果
3. 比较来源

### 3. 🚀 启动类（Launch）
**关键词**：启动、打开、运行

**示例**：
- "启动抖音"
- "打开网易云音乐"
- "运行 IDEA"

**生成步骤**：
1. 启动应用

### 4. 📁 文件管理类（FileManagement）
**关键词**：文件、目录、查找、管理

**示例**：
- "查找项目中的所有 JS 文件"
- "列出文档目录"
- "管理我的文件"

**生成步骤**：
1. 列出目录
2. 搜索文件

### 5. 📰 新闻类（News）
**关键词**：新闻、最新消息、动态

**示例**：
- "查看最新科技新闻"
- "今天的热点新闻"
- "AI 领域最新动态"

**生成步骤**：
1. 新闻搜索
2. 分析结果

---

## 🎯 使用技巧

### ✅ 最佳实践

1. **描述要具体**
   - ❌ "帮我查一下"
   - ✅ "搜索最新的人工智能新闻"

2. **包含关键信息**
   - ❌ "启动应用"
   - ✅ "启动网易云音乐"

3. **指定参数**
   - ❌ "查找文件"
   - ✅ "查找 src 目录下所有的 JSX 文件"

### 💡 高级用法

1. **多步骤任务**
   ```
   先检查系统状态，如果有问题就搜索解决方案
   ```

2. **组合任务**
   ```
   启动抖音，然后搜索编程教程
   ```

3. **条件任务**
   ```
   如果网络正常就下载文件，否则先诊断网络
   ```

---

## 🔧 技术架构

### 核心组件

1. **AIWorkflowGenerator** ([`src/workflow/AIWorkflowGenerator.js`](file:///f:/openclaw/commander-pro/src/workflow/AIWorkflowGenerator.js))
   - 意图理解
   - 模式匹配
   - 工作流生成
   - 参数推断

2. **AIWorkflowCreator** ([`src/components/Workflow/AIWorkflowCreator.jsx`](file:///f:/openclaw/commander-pro/src/components/Workflow/AIWorkflowCreator.jsx))
   - 对话界面
   - 消息管理
   - 工作流预览
   - 执行控制

3. **WorkflowPanel** (更新)
   - 集成 AI 生成器
   - 显示 AI 生成按钮
   - 管理工作流状态

### 数据流

```
用户输入
  ↓
AI 意图理解
  ↓
模式匹配 / AI 生成
  ↓
参数填充
  ↓
工作流构建
  ↓
执行工作流
  ↓
返回结果
```

---

## 📊 示例对话

### 示例 1：网络诊断

**用户**：帮我诊断网络问题

**AI**：
```
我为你生成了一个工作流！✨

工作流名称：AI 生成的工作流：帮我诊断网络问题...
步骤数：3 个步骤
置信度：95%

[执行工作流] 按钮
```

**执行结果**：
```
✅ 工作流执行完成！

执行时间：2345ms
完成步骤：3/3
状态：成功
```

### 示例 2：研究任务

**用户**：研究最新的人工智能发展趋势

**AI**：
```
我为你生成了一个工作流！✨

工作流名称：AI 生成的工作流：研究最新的人工智能...
步骤数：3 个步骤
置信度：92%

推荐工作流类型：research (3 匹配)

[执行工作流] 按钮
```

---

## 🚧 未来规划

### 短期（已完成✅）
- ✅ 自然语言理解
- ✅ 工作流模式匹配
- ✅ 参数自动推断
- ✅ 对话式界面

### 中期（规划中）
- [ ] 可视化工作流编辑器
- [ ] 工作流保存和分享
- [ ] 执行历史记录
- [ ] 性能优化建议

### 长期（愿景）
- [ ] 工作流市场
- [ ] 社区分享
- [ ] 机器学习优化
- [ ] 自动错误恢复

---

## 🎓 学习资源

### 相关文件
- AI 工作流生成器：[`src/workflow/AIWorkflowGenerator.js`](file:///f:/openclaw/commander-pro/src/workflow/AIWorkflowGenerator.js)
- AI 创建器组件：[`src/components/Workflow/AIWorkflowCreator.jsx`](file:///f:/openclaw/commander-pro/src/components/Workflow/AIWorkflowCreator.jsx)
- 工作流面板：[`src/components/Workflow/WorkflowPanel.jsx`](file:///f:/openclaw/commander-pro/src/components/Workflow/WorkflowPanel.jsx)
- 工作流引擎：[`src/workflow/WorkflowEngine.js`](file:///f:/openclaw/commander-pro/src/workflow/WorkflowEngine.js)

### 技能列表
- 文件操作：`safe_read_file`, `safe_list_directory`, `safe_search_files`
- 系统信息：`get_system_info`, `list_processes`, `get_network_info`, `ping_test`
- 网络搜索：`web_search`, `wikipedia_search`, `news_search`
- 分析工具：`analyze_search_results`, `compare_sources`
- 应用控制：`launch_application`, `search_installed_apps`, `open_url`

---

## ⚠️ 注意事项

1. **AI 模型依赖**
   - 需要 Ollama 服务运行
   - 使用 qwen3:8b 模型
   - 确保模型已正确安装

2. **技能可用性**
   - 生成的工作流依赖实际存在的技能
   - 某些技能需要 Node.js 环境
   - 文件操作技能在浏览器中受限

3. **置信度**
   - AI 生成的置信度显示在结果中
   - 低置信度时建议手动选择模板
   - 可以通过多轮对话提高准确度

---

## 🎉 开始使用

1. **启动服务**
   ```bash
   npm run server  # 后端服务
   npm run dev     # 前端服务
   ```

2. **访问工作流标签页**
   - 点击 "AI 生成工作流" 按钮
   - 描述你的任务
   - 执行生成的工作流！

**祝你使用愉快！** 🚀

---

**完成时间**: 2026-04-02
**版本**: v1.0.0
**状态**: ✅ 已完成并可用
