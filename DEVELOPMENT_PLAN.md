# 📋 OpenClaw Commander Pro 后续工作规划

**制定时间**: 2026-03-26  
**版本**: 2.0.0  
**规划周期**: 2-4 周

---

## 🎯 总体目标

**短期目标（1 周）**: 完善核心功能，达到 80% 完成度  
**中期目标（2 周）**: 实现高级特性，达到 90% 完成度  
**长期目标（4 周）**: 产品化包装，达到 95%+ 完成度

---

## 📅 第一阶段：完善核心功能（Week 1）

### 1.1 实现工作流技能回调 🔴 **最高优先级**

**问题**: 工作流引擎已实现，但未连接实际技能

**实现方案**:

```javascript
// src/workflow/WorkflowEngine.js
// 修改 executeSkill 回调

export class WorkflowEngine {
  constructor(options = {}) {
    this.skillManager = options.skillManager; // 注入技能管理器
    this.executeSkill = options.executeSkill || this.defaultExecuteSkill;
  }
  
  async defaultExecuteSkill(skillName, params) {
    if (!this.skillManager) {
      throw new Error('未注入技能管理器');
    }
    return await this.skillManager.executeSkill(skillName, params);
  }
}

// 使用示例
const engine = new WorkflowEngine({
  skillManager: skillManager
});
```

**具体任务**:
- [ ] 修改 WorkflowEngine 构造函数，接受 skillManager
- [ ] 实现技能执行回调
- [ ] 添加技能执行日志
- [ ] 编写工作流 + 技能集成测试
- [ ] 更新 WorkflowPanel，显示技能执行过程

**预计时间**: 4-6 小时  
**难度**: ⭐⭐⭐  
**测试用例**:
```javascript
// 测试项目初始化工作流
test('project_init workflow', async () => {
  const result = await workflowEngine.executeWorkflow('project_init', {
    projectPath: './test-project',
    projectName: 'test-app'
  });
  expect(result.status).toBe('completed');
  expect(result.stepsExecuted).toBe(6);
});
```

---

### 1.2 完善终端功能 🔴 **高优先级**

**目标**: 实现真实的命令行交互

**实现方案**:

```javascript
// src/components/Terminal/TerminalPanel.jsx
import { useEffect, useRef, useState } from 'react';

export default function TerminalPanel() {
  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  
  useEffect(() => {
    // 连接到本地 WebSocket 服务
    wsRef.current = new WebSocket('ws://localhost:3003/terminal');
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      addSystemMessage('终端已连接');
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOutput(prev => [...prev, data]);
    };
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
  
  const executeCommand = async (cmd) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'command',
        command: cmd
      }));
    }
  };
  
  return (
    <div className="terminal">
      <div className="output">
        {output.map((line, i) => (
          <div key={i} className={line.type}>
            {line.text}
          </div>
        ))}
      </div>
      <input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && executeCommand(command)}
        placeholder="$ 输入命令..."
      />
    </div>
  );
}
```

**后端 WebSocket 服务** (server/terminal.js):
```javascript
import { WebSocketServer } from 'ws';
import { exec } from 'child_process';

const wss = new WebSocketServer({ port: 3004 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'command') {
      exec(data.command, (error, stdout, stderr) => {
        ws.send(JSON.stringify({
          type: 'output',
          text: stdout || stderr || error.message,
          timestamp: Date.now()
        }));
      });
    }
  });
});
```

**具体任务**:
- [ ] 创建 TerminalPanel 组件
- [ ] 实现 WebSocket 终端服务
- [ ] 添加命令历史功能（上下箭头切换）
- [ ] 实现命令自动补全
- [ ] 添加安全过滤（危险命令拦截）
- [ ] 支持多终端标签页

**预计时间**: 8-10 小时  
**难度**: ⭐⭐⭐⭐  
**安全考虑**:
- 黑名单命令：`rm -rf /`, `format C:`, 等
- 路径限制：禁止访问系统目录
- 超时限制：命令执行最长 30 秒

---

### 1.3 添加项目管理功能 🟡 **中优先级**

**目标**: 实现项目导入、导出、配置管理

**数据结构**:
```javascript
// 项目配置
{
  id: 'project_123',
  name: 'My Project',
  path: '/path/to/project',
  createdAt: '2026-03-26',
  settings: {
    defaultModel: 'qwen3:8b',
    autoSave: true,
    workspace: ['src', 'tests']
  },
  conversations: [...],
  workflows: [...]
}
```

**实现方案**:
```javascript
// src/store/projectStore.js
export const useProjectStore = create((set) => ({
  projects: [],
  currentProjectId: null,
  
  // 创建项目
  createProject: (name, path) => {
    const project = {
      id: `proj_${Date.now()}`,
      name,
      path,
      createdAt: new Date().toISOString(),
      settings: {
        defaultModel: 'qwen3:8b',
        autoSave: true
      }
    };
    set((state) => ({
      projects: [project, ...state.projects],
      currentProjectId: project.id
    }));
    return project;
  },
  
  // 导入项目
  importProject: async (file) => {
    const content = await file.text();
    const project = JSON.parse(content);
    set((state) => ({
      projects: [project, ...state.projects]
    }));
  },
  
  // 导出项目
  exportProject: (projectId) => {
    const project = get().projects.find(p => p.id === projectId);
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: 'application/json'
    });
    // 下载逻辑...
  },
  
  // 删除项目
  deleteProject: (projectId) => {
    set((state) => ({
      projects: state.projects.filter(p => p.id !== projectId)
    }));
  }
}));
```

**UI 组件** (ProjectsPanel.jsx):
```jsx
export default function ProjectsPanel() {
  const { projects, createProject, importProject, exportProject } = useProjectStore();
  
  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">项目管理</h2>
        <div className="space-x-2">
          <button onClick={() => createProject('新项目', './new-project')}>
            新建项目
          </button>
          <button onClick={() => document.getElementById('import').click()}>
            导入项目
          </button>
          <input
            id="import"
            type="file"
            accept=".json"
            onChange={(e) => importProject(e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onExport={() => exportProject(project.id)}
            onDelete={() => deleteProject(project.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

**具体任务**:
- [ ] 创建 projectStore
- [ ] 实现项目 CRUD 操作
- [ ] 创建 ProjectsPanel UI
- [ ] 实现项目导入/导出
- [ ] 添加项目切换功能
- [ ] 项目配置持久化（localStorage/IndexedDB）

**预计时间**: 6-8 小时  
**难度**: ⭐⭐⭐

---

## 📅 第二阶段：优化与增强（Week 2）

### 2.1 添加错误边界和异常处理 🟡 **重要**

**实现方案**:
```javascript
// src/components/ErrorBoundary.jsx
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // 发送错误报告
    reportError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>出错了</h1>
          <p>很抱歉，应用遇到了错误。</p>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre>{this.state.error?.toString()}</pre>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**任务**:
- [ ] 创建 ErrorBoundary 组件
- [ ] 包裹根组件
- [ ] 实现错误报告机制
- [ ] 添加友好的错误提示 UI

---

### 2.2 性能优化 🟡 **重要**

**优化点 1**: 虚拟滚动（消息列表）
```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={messages.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <MessageItem style={style} message={messages[index]} />
  )}
</FixedSizeList>
```

**优化点 2**: 消息缓存
```javascript
import { useMemo } from 'react';

const MessageList = ({ messages }) => {
  const renderedMessages = useMemo(() => 
    messages.map(msg => <Message key={msg.id} {...msg} />),
    [messages] // 只在 messages 变化时重新渲染
  );
  
  return <div>{renderedMessages}</div>;
};
```

**优化点 3**: 技能懒加载
```javascript
// src/skills/index.js
export const loadSkill = async (skillName) => {
  const skillMap = {
    'safe_read_file': () => import('./security/SafeFileOperations'),
    'web_search': () => import('./network/WebSearch'),
    // ...
  };
  
  if (skillMap[skillName]) {
    const module = await skillMap[skillName]();
    return module[getSkillClassName(skillName)];
  }
};
```

**任务**:
- [ ] 安装 react-window
- [ ] 实现虚拟滚动
- [ ] 添加 useMemo/useCallback 优化
- [ ] 实现技能懒加载
- [ ] 添加性能监控

---

### 2.3 添加单元测试 🟡 **重要**

**测试框架**: Vitest（与 Vite 集成最好）

**安装**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**配置文件** (vitest.config.js):
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
});
```

**测试示例**:
```javascript
// src/skills/__tests__/SecureSkill.test.js
import { describe, it, expect } from 'vitest';
import { SecureSkill } from '../core/SecureSkill';

class TestSkill extends SecureSkill {
  async execute(params) {
    return { success: true, params };
  }
}

describe('SecureSkill', () => {
  it('should validate path correctly', () => {
    const skill = new TestSkill({ name: 'test' });
    expect(skill.isPathSafe('C:/safe/path')).toBe(true);
    expect(skill.isPathSafe('C:/Windows/System32')).toBe(false);
  });
  
  it('should sanitize sensitive params', () => {
    const skill = new TestSkill({ name: 'test' });
    const sanitized = skill.sanitizeParams({
      username: 'user',
      password: 'secret123'
    });
    expect(sanitized.password).toBe('[REDACTED]');
  });
});

// 测试技能管理器
describe('SkillManager', () => {
  it('should register and execute skill', async () => {
    const manager = new SkillManager();
    const result = await manager.executeSkill('test_skill', { param: 'value' });
    expect(result.success).toBe(true);
  });
});
```

**任务**:
- [ ] 配置 Vitest
- [ ] 编写技能系统测试（目标覆盖率 80%）
- [ ] 编写 Store 测试
- [ ] 编写工作流引擎测试
- [ ] 添加 CI/CD 集成

---

## 📅 第三阶段：高级特性（Week 3-4）

### 3.1 工作流可视化编辑器 🔵 **可选但很酷**

**技术选型**: React Flow

**实现方案**:
```javascript
import ReactFlow, { addEdge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', type: 'action', data: { label: '检查目录' }, position: { x: 250, y: 5 } },
  { id: '2', type: 'action', data: { label: '创建结构' }, position: { x: 250, y: 100 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' }
];

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  return (
    <div style={{ height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

---

### 3.2 技能市场 🔵 **可选**

**设计**:
```javascript
// 技能包格式
{
  "name": "github-tools",
  "version": "1.0.0",
  "skills": [
    {
      "name": "search_repos",
      "description": "搜索 GitHub 仓库",
      "code": "...",
      "dependencies": ["node-fetch"]
    }
  ]
}

// 技能市场 API
GET /api/skills/market - 获取技能列表
POST /api/skills/install - 安装技能
DELETE /api/skills/:name - 卸载技能
```

---

### 3.3 协作功能 🔵 **可选**

**实时协作编辑**:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3003');

// 广播对话更新
socket.emit('conversation:update', {
  conversationId,
  message
});

// 接收他人更新
socket.on('conversation:message', (message) => {
  addMessage(message);
});
```

---

## 📊 已有功能优化建议

### 1. 对话系统优化

**当前问题**: 消息过多时性能下降

**优化建议**:
- ✅ 虚拟滚动（已在 2.2 规划）
- ✅ 消息分页加载
- ✅ 对话压缩（长期对话自动摘要）

**实现**:
```javascript
// 对话摘要
const summarizeConversation = async (messages) => {
  const summary = await openClawClient.chat('qwen3:8b', [{
    role: 'user',
    content: `请总结以下对话的核心内容：\n${messages.map(m => m.content).join('\n')}`
  }]);
  return summary;
};
```

---

### 2. 技能系统优化

**当前问题**: 
- 技能检测依赖 AI，可能不准确
- 技能参数需要手动解析

**优化建议**:

**方案 1**: 规则 + AI 混合检测
```javascript
const detectSkillCall = async (message) => {
  // 先尝试规则匹配（快速、准确）
  const rules = {
    '打开.*': 'launch_application',
    '搜索.*文件': 'safe_search_files',
    'ping.*': 'ping_test',
  };
  
  for (const [pattern, skillName] of Object.entries(rules)) {
    if (new RegExp(pattern).test(message)) {
      return { skill: skillName, params: extractParams(message, pattern) };
    }
  }
  
  // 规则不匹配时使用 AI
  return aiDetectSkillCall(message);
};
```

**方案 2**: 技能参数模板
```javascript
// 技能定义中添加参数模板
{
  name: 'launch_application',
  paramTemplate: {
    appName: {
      type: 'string',
      required: true,
      extract: /打开 (.+?)(?:，|。|$)/
    }
  }
}
```

---

### 3. 模型选择优化

**当前问题**: 复杂度分析基于关键词，不够准确

**优化建议**:

**多维度评分**:
```javascript
function analyzeTaskComplexity(task) {
  let score = 5;
  
  // 1. 关键词匹配（权重 30%）
  const keywords = {
    high: ['推理', '证明', '分析'],
    medium: ['代码', '生成'],
    low: ['是什么', '定义']
  };
  // ...
  
  // 2. 任务长度（权重 20%）
  if (task.length > 200) score += 2;
  
  // 3. 上下文深度（权重 30%）
  const contextDepth = getCurrentContextDepth();
  score += contextDepth;
  
  // 4. 历史表现（权重 20%）
  const historicalAccuracy = getModelAccuracy(task);
  if (historicalAccuracy < 0.7) score += 1;
  
  return {
    score,
    weights: {
      keywords: 0.3,
      length: 0.2,
      context: 0.3,
      history: 0.2
    }
  };
}
```

---

### 4. 工作流系统优化

**当前问题**: 
- 错误处理不够友好
- 无法暂停/恢复

**优化建议**:

**增强的错误处理**:
```javascript
export class WorkflowEngine {
  async executeWorkflow(workflowId, params) {
    const workflow = this.getWorkflow(workflowId);
    const context = { params, outputs: {}, errors: [] };
    
    try {
      for (const step of workflow.steps) {
        try {
          await step.execute(context);
        } catch (error) {
          // 记录错误
          context.errors.push({
            stepId: step.id,
            error: error.message,
            canRetry: step.retryable
          });
          
          // 决定是否继续
          if (step.onFailure) {
            // 执行错误处理步骤
            await this.executeStep(step.onFailure, context);
          } else if (step.required) {
            // 关键步骤失败，停止工作流
            throw error;
          }
        }
      }
    } catch (error) {
      // 工作流级别错误处理
      await this.handleWorkflowError(workflow, error, context);
      throw error;
    }
  }
  
  // 暂停功能
  async pauseWorkflow(workflowId) {
    const execution = this.executions.get(workflowId);
    if (execution) {
      execution.paused = true;
      execution.pausedAt = Date.now();
    }
  }
  
  // 恢复功能
  async resumeWorkflow(workflowId) {
    const execution = this.executions.get(workflowId);
    if (execution && execution.paused) {
      execution.paused = false;
      await this.executeFromStep(execution.currentStep, execution.context);
    }
  }
}
```

---

### 5. 本地服务优化

**当前问题**: 
- 只有一个 HTTP 服务
- WebSocket 未使用

**优化建议**:

**服务拆分**:
```
server/
├── index.js (HTTP API - port 3003)
├── websocket.js (WebSocket - port 3004)
└── terminal.js (终端服务 - port 3005)
```

**添加服务监控**:
```javascript
// server/monitor.js
import { totalmem, freemem, cpus } from 'os';

app.get('/api/monitor', (req, res) => {
  res.json({
    memory: {
      total: totalmem(),
      free: freemem(),
      usage: (totalmem() - freemem()) / totalmem() * 100
    },
    cpu: cpus().map(cpu => ({
      model: cpu.model,
      speed: cpu.speed,
      usage: cpu.times
    })),
    uptime: process.uptime()
  });
});
```

---

## 📈 优先级排序

### P0 - 必须完成（Week 1）
1. ✅ 工作流技能回调
2. ✅ 终端功能基础实现
3. ✅ 项目管理 CRUD

### P1 - 重要（Week 2）
4. ✅ 错误边界
5. ✅ 性能优化（虚拟滚动）
6. ✅ 单元测试框架

### P2 - 有价值（Week 3）
7. ⭐ 工作流可视化编辑器
8. ⭐ 技能系统优化（规则+AI）
9. ⭐ 模型选择优化

### P3 - 锦上添花（Week 4）
10. 🔵 技能市场
11. 🔵 协作功能
12. 🔵 服务监控

---

## 🎯 成功指标

### Week 1 结束
- [ ] 工作流可以实际执行技能
- [ ] 终端可以执行命令
- [ ] 可以创建/导入/导出项目
- **完成度**: 80%

### Week 2 结束
- [ ] 应用稳定，无崩溃
- [ ] 消息列表流畅（1000+ 条消息）
- [ ] 核心功能测试覆盖率 80%
- **完成度**: 90%

### Week 3-4 结束
- [ ] 可视化工作流编辑器
- [ ] 智能技能检测
- [ ] 性能监控面板
- **完成度**: 95%+

---

## 📝 实施建议

1. **每日站会**: 记录进度和阻塞
2. **小步快跑**: 每个功能拆分为小任务
3. **测试先行**: 先写测试再实现功能
4. **代码审查**: 每个 PR 至少一人 review
5. **文档同步**: 功能完成立即更新文档

---

**制定人**: AI 助手  
**最后更新**: 2026-03-26  
**下次回顾**: 2026-04-02
