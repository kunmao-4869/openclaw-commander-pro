# 🏗️ OpenClaw Commander Pro 架构设计

## 📋 项目概述

**OpenClaw Commander Pro** 是下一代 AI 指挥中心，采用双模型混合思考系统，直连 OpenClaw，提供深度化、多元化的技能系统。

---

## 🎯 核心特性

### 1. 双模型混合思考系统
- **Qwen3 8B**: 快速响应，适合简单任务
- **Qwen3 30B**: 强大推理，适合复杂任务
- **智能路由**: 根据任务复杂度自动选择模型
- **无缝切换**: 用户可手动切换模型

### 2. 直连 OpenClaw
- 绕过 Ollama Adapter，直接调用 OpenClaw API
- 更低的延迟
- 更高的吞吐量
- 原生支持所有 OpenClaw 功能

### 3. 深度化 Skill 系统
- **插件化架构**: 动态加载技能
- **分类管理**: 9 大类技能
- **权限控制**: 细粒度的权限管理
- **热更新**: 无需重启添加新技能

### 4. 现代化 UI
- **多标签页**: 对话、技能、项目、终端、分析、设置
- **响应式设计**: 适配各种屏幕
- **暗色主题**: 护眼专业
- **流畅动画**: 优秀的用户体验

---

## 🏛️ 架构分层

```
┌─────────────────────────────────────────┐
│          UI Layer (React + Tailwind)    │
│  ┌─────────────────────────────────┐   │
│  │  App.jsx - 主应用容器            │   │
│  │  - 顶部导航栏                   │   │
│  │  - 侧边栏                       │   │
│  │  - 多标签页系统                 │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│       State Management (Zustand)        │
│  ┌─────────────────────────────────┐   │
│  │  modelStore.js - 模型状态       │   │
│  │  chatStore.js - 聊天状态        │   │
│  │  skillStore.js - 技能状态       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         Core Business Logic             │
│  ┌─────────────────────────────────┐   │
│  │  SkillSystem.js - 技能核心      │   │
│  │  - Skill 基类                   │   │
│  │  - SkillManager 管理器          │   │
│  │  - 插件系统                     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│          Skills Layer                   │
│  ┌─────────────────────────────────┐   │
│  │  FileSystem.js - 文件技能       │   │
│  │  Network.js - 网络技能          │   │
│  │  Process.js - 进程技能          │   │
│  │  SystemControl.js - 系统控制    │   │
│  │  Utilities.js - 工具技能        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         OpenClaw API Layer              │
│  ┌─────────────────────────────────┐   │
│  │  openclawClient.js - API 客户端  │   │
│  │  - WebSocket 连接               │   │
│  │  - REST API 调用                │   │
│  │  - 认证管理                     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 📁 项目结构

```
commander-pro/
├── src/
│   ├── App.jsx                    # 主应用组件
│   ├── main.jsx                   # 入口文件
│   ├── index.css                  # 全局样式
│   │
│   ├── store/                     # 状态管理
│   │   ├── modelStore.js          # 模型状态
│   │   ├── chatStore.js           # 聊天状态
│   │   └── skillStore.js          # 技能状态
│   │
│   ├── skills/                    # 技能系统
│   │   ├── core/
│   │   │   └── SkillSystem.js     # 技能核心
│   │   ├── advanced/
│   │   │   ├── FileSystem.js      # 文件技能
│   │   │   ├── Network.js         # 网络技能
│   │   │   └── Process.js         # 进程技能
│   │   └── index.js               # 技能导出
│   │
│   ├── api/                       # API 层
│   │   ├── openclawClient.js      # OpenClaw 客户端
│   │   └── types.js               # API 类型
│   │
│   ├── components/                # UI 组件
│   │   ├── Chat/
│   │   ├── Skills/
│   │   ├── Projects/
│   │   └── Settings/
│   │
│   └── utils/                     # 工具函数
│       ├── modelRouter.js         # 模型路由
│       └── helpers.js             # 辅助函数
│
├── package.json                   # 依赖配置
├── vite.config.js                 # Vite 配置
├── tailwind.config.js             # Tailwind 配置
└── README.md                      # 项目说明
```

---

## 🔄 数据流

### 1. 用户发送消息流程

```
用户输入
  ↓
ChatPanel 组件
  ↓
chatStore.addMessage('user', content)
  ↓
modelStore.smartSelectModel(content)  // 智能选择模型
  ↓
openclawClient.sendMessage({
  model,
  messages,
  skills: skillManager.getAllDefinitions()
})
  ↓
OpenClaw API
  ↓
WebSocket / REST
  ↓
接收响应
  ↓
chatStore.addMessage('assistant', response)
  ↓
UI 更新
```

### 2. 技能执行流程

```
AI 返回 tool_calls
  ↓
chatStore.parseToolCalls(tool_calls)
  ↓
skillManager.executeSkill(skillName, args)
  ↓
Skill.validateParams(args)  // 参数验证
  ↓
Skill.execute(args)  // 执行技能
  ↓
安全检查 (权限、路径等)
  ↓
执行结果
  ↓
chatStore.addMessage('tool', result)
  ↓
发送给 AI 继续处理
```

---

## 🧠 双模型混合思考系统

### 模型选择策略

```javascript
function analyzeTaskComplexity(task) {
  // 1. 关键词分析
  const keywords = {
    high: ['推理', '证明', '分析', '复杂', '优化', '重构'],
    medium: ['代码', '生成', '解释', '比较'],
    low: ['是什么', '定义', '简单', '快速']
  }
  
  // 2. 长度分析
  const length = task.length
  
  // 3. 上下文分析
  const contextDepth = conversationHistory.length
  
  // 4. 综合评分
  let score = 5
  if (length > 100) score += 1
  if (length > 500) score += 2
  if (contextDepth > 10) score += 1
  
  // 关键词加分
  keywords.high.forEach(kw => {
    if (task.includes(kw)) score += 3
  })
  
  // 决策
  if (score > 7) return 'qwen3:30b'
  if (score < 4) return 'qwen3:8b'
  return 'qwen3:8b'  // 默认用 8B
}
```

### 模型切换 UI

```jsx
<ModelSwitcher>
  <Button 
    active={currentModel === 'qwen3:8b'}
    onClick={() => setCurrentModel('qwen3:8b')}
  >
    <Zap /> 8B 快速
  </Button>
  
  <Button 
    active={currentModel === 'qwen3:30b'}
    onClick={() => setCurrentModel('qwen3:30b')}
  >
    <Brain /> 30B 强大
  </Button>
  
  <Toggle
    checked={autoSelectModel}
    onChange={toggleAutoSelect}
  >
    智能选择
  </Toggle>
</ModelSwitcher>
```

---

## 🛡️ 安全架构

### 1. 权限控制

```javascript
class Skill {
  constructor(config) {
    this.permissions = config.permissions || []
    // ['read', 'write', 'execute', 'network']
  }
}

// 权限检查
function checkPermission(skill, action) {
  if (!skill.permissions.includes(action)) {
    throw new Error(`权限不足：${action}`)
  }
}
```

### 2. 路径沙箱

```javascript
function safePath(userPath, workDir) {
  const resolved = path.resolve(workDir, userPath)
  if (!resolved.startsWith(workDir)) {
    throw new Error('路径超出沙箱范围')
  }
  return resolved
}
```

### 3. 只读模式

```javascript
const readOnlySkills = [
  'smart_read_file',
  'advanced_search_files',
  'analyze_project_structure'
]

if (config.readOnlyMode && !readOnlySkills.includes(skillName)) {
  throw new Error('只读模式下禁止写操作')
}
```

---

## 🚀 性能优化

### 1. 懒加载技能

```javascript
// 按需加载技能
const loadSkill = async (skillName) => {
  const module = await import(`../skills/${skillName}.js`)
  return module.default
}
```

### 2. 消息分页

```javascript
// 只加载最近 50 条消息
const PAGE_SIZE = 50
const messages = allMessages.slice(-PAGE_SIZE)
```

### 3. WebSocket 复用

```javascript
// 单例 WebSocket 连接
let wsInstance = null

function getWebSocket() {
  if (!wsInstance) {
    wsInstance = new WebSocket(url)
  }
  return wsInstance
}
```

---

## 📊 监控与日志

### 1. 性能监控

```javascript
const metrics = {
  responseTime: [],
  skillUsage: {},
  modelUsage: {
    'qwen3:8b': 0,
    'qwen3:30b': 0
  },
  errorRate: 0
}
```

### 2. 审计日志

```javascript
auditLogger.log({
  timestamp: new Date().toISOString(),
  action: 'skill_execute',
  skill: 'smart_read_file',
  user: 'user123',
  success: true,
  duration: 120
})
```

---

## 🔮 未来扩展

### 短期 (v2.1)
- [ ] 完成所有高级技能
- [ ] 实现 WebSocket 实时通信
- [ ] 添加技能市场
- [ ] 优化模型路由算法

### 中期 (v2.5)
- [ ] 支持多模态（图片、语音）
- [ ] 实现技能工作流
- [ ] 添加协作功能
- [ ] 云端同步

### 长期 (v3.0)
- [ ] 插件生态系统
- [ ] AI 自主学习能力
- [ ] 分布式部署
- [ ] 企业级功能

---

**版本**: 2.0.0  
**架构**: 微前端 + 插件化  
**状态**: 开发中 🚀
