# 智能工作流系统集成计划

## 📊 当前状态

### ✅ 已完成
1. **智能工作流管理系统** - 完整功能
   - `ProjectWorkflowManager.js` - 722 行
   - 支持 5 种项目类型
   - 4 个专用技能

2. **终端代理（Claude Code 风格）** - 完整功能
   - `TerminalAgent.js` - 已加载 11 个技能
   - 支持自然语言交互
   - 工作流技能已集成

3. **Web 界面** - 基础框架
   - Vite 服务器运行中
   - 终端面板组件存在
   - 工作流编辑器页面

### ❌ 未集成
1. **Web 界面缺少工作流功能**
   - 没有项目创建工作流 UI
   - 没有学习管理 UI
   - 没有代码检索 UI

2. **终端面板未连接真实功能**
   - 连接的是不存在的 WebSocket (端口 3004)
   - 没有使用 TerminalAgent
   - 没有使用 ProjectWorkflowManager

---

## 🎯 集成方案

### 方案 1：最小改动（推荐）⭐

**思路**：在现有 Web 界面中添加工作流管理页面

#### 需要创建的文件
1. `src/pages/WorkflowProjectPage.jsx` - 工作流项目管理页面
2. `src/components/Workflow/ProjectCreator.jsx` - 项目创建组件
3. `src/components/Workflow/StudyingManager.jsx` - 学习文档管理组件
4. `src/components/Workflow/ImgResourceManager.jsx` - 图片资源管理组件

#### 需要修改的文件
1. `src/App.jsx` - 添加路由
2. `src/components/Terminal/TerminalPanel.jsx` - 连接 TerminalAgent

#### 集成方式
```javascript
// TerminalPanel.jsx 修改
import { TerminalAgent } from '../../terminal/TerminalAgent.js';
import ProjectWorkflowManager from '../../skills/advanced/ProjectWorkflowManager.js';

// 在组件中初始化
const terminalAgent = new TerminalAgent();
const workflowManager = new ProjectWorkflowManager();

// 连接到终端输入
const handleCommand = async (cmd) => {
  const skills = terminalAgent.parseInput(cmd);
  if (skills.length > 0) {
    for (const skill of skills) {
      const result = await terminalAgent.executeSkill(skill);
      addOutput(JSON.stringify(result));
    }
  }
};
```

---

### 方案 2：完整重构（彻底）

**思路**：完全集成到现有工作流系统

#### 需要创建的文件
1. `src/workflow/WorkflowProjectEngine.js` - 工作流项目引擎
2. `src/components/Workflow/SmartProjectPanel.jsx` - 智能项目面板
3. `src/components/Workflow/LearningDocManager.jsx` - 学习文档管理器
4. `src/components/Workflow/CodeSearchPanel.jsx` - 代码检索面板

#### 需要修改的文件
1. `src/components/Workflow/WorkflowEditor.jsx` - 添加工作流模板
2. `src/components/Workflow/PropertiesPanel.jsx` - 添加工作流配置
3. `src/workflow/WorkflowTemplates.js` - 添加工作流项目模板

#### 添加的工作流模板
```javascript
{
  name: '智能工作流项目',
  description: '创建包含 studying/project/img 的项目',
  nodes: [
    {
      type: 'skill',
      skill: 'create_workflow_project',
      params: {
        projectName: '${input.projectName}',
        requirement: '${input.requirement}',
        projectType: '${input.projectType}'
      }
    },
    {
      type: 'skill',
      skill: 'save_to_studying',
      params: {
        url: '${input.learnUrl}'
      }
    },
    {
      type: 'skill',
      skill: 'search_studying_code',
      params: {
        query: '${input.searchQuery}'
      }
    }
  ]
}
```

---

### 方案 3：混合方案（平衡）⭐⭐⭐

**思路**：在终端面板中集成 TerminalAgent，在其他页面添加 UI

#### 步骤 1：集成终端代理
修改 `TerminalPanel.jsx` 使用 `TerminalAgent`

#### 步骤 2：添加快捷操作面板
在终端面板旁边添加快捷操作按钮：
- 创建 HarmonyOS 项目
- 创建 Unreal 项目
- 创建 Python 项目
- 创建 React 项目

#### 步骤 3：添加项目状态显示
在终端面板下方显示当前项目状态：
- 项目名称
- 项目类型
- 文件夹结构
- studying 文档列表

#### 步骤 4：添加学习管理面板
创建工作管理面板：
- 学习 URL 输入
- 代码检索输入
- 图片资源检查按钮

---

## 🚀 推荐实施方案 3

### 优点
- ✅ 改动最小
- ✅ 保留现有功能
- ✅ 快速集成
- ✅ 用户体验好

### 实施步骤

#### 第 1 步：修改 TerminalPanel.jsx
```javascript
// 导入 TerminalAgent
import TerminalAgent from '../../terminal/TerminalAgent.js';

// 初始化
useEffect(() => {
  const agent = new TerminalAgent({
    apiBaseUrl: 'http://localhost:3003',
    autonomousMode: true
  });
  await agent.registerDefaultSkills();
  
  // 重写命令处理
  const handleCommand = async (cmd) => {
    const skills = agent.parseInput(cmd);
    if (skills.length > 0) {
      addOutput(`识别到 ${skills.length} 个技能`, 'system');
      for (const skill of skills) {
        addOutput(`执行技能：${skill.skill}`, 'info');
        const result = await agent.executeSkill(skill);
        addOutput(JSON.stringify(result, null, 2), 'success');
      }
    } else {
      // 普通命令
      const result = await executeCommand(cmd);
      addOutput(result, 'output');
    }
  };
}, []);
```

#### 第 2 步：添加快捷操作组件
```jsx
// 在 TerminalPanel 中添加
<div className="p-2 border-t">
  <h4 className="text-sm font-semibold mb-2">快捷操作</h4>
  <div className="grid grid-cols-2 gap-2">
    <button onClick={() => handleCommand('创建一个 HarmonyOS 项目')}>
      📱 HarmonyOS 项目
    </button>
    <button onClick={() => handleCommand('创建一个 Unreal 项目')}>
      🎮 Unreal 游戏
    </button>
    <button onClick={() => handleCommand('创建一个 Python 项目')}>
      🐍 Python 工具
    </button>
    <button onClick={() => handleCommand('创建一个 React 项目')}>
      ⚛️ React 应用
    </button>
  </div>
</div>
```

#### 第 3 步：添加项目状态显示
```jsx
// 在 TerminalPanel 中添加
{currentProject && (
  <div className="p-2 border-t bg-gray-50">
    <h4 className="text-sm font-semibold mb-2">当前项目</h4>
    <div className="text-xs">
      <div>项目名称：{currentProject.name}</div>
      <div>项目类型：{currentProject.type}</div>
      <div>根目录：{currentProject.rootDir}</div>
      <div className="mt-2">
        <strong>文件夹结构:</strong>
        <pre className="mt-1 text-xs">
          {Object.entries(currentProject.structure)
            .map(([k, v]) => `  ${k}: ${v}/`)
            .join('\n')}
        </pre>
      </div>
    </div>
  </div>
)}
```

---

## 📋 具体任务列表

### 高优先级（立即实施）
- [ ] 修改 `TerminalPanel.jsx` 连接 TerminalAgent
- [ ] 添加快捷操作按钮
- [ ] 添加项目状态显示
- [ ] 测试终端技能调用

### 中优先级（后续实施）
- [ ] 创建独立的工作流项目管理页面
- [ ] 添加学习文档管理 UI
- [ ] 添加代码检索 UI
- [ ] 添加图片资源管理 UI

### 低优先级（可选）
- [ ] 添加项目可视化结构图
- [ ] 添加学习进度跟踪
- [ ] 添加团队协作功能
- [ ] 添加云端同步

---

## 🎯 立即可用的功能

### 终端中（已可用）
```bash
node terminal-agent.js

# 可用命令
创建一个 HarmonyOS 项目
学习 https://url 并保存到 studying
在 studying 中搜索 ArkTS 代码
检查图片资源配置
```

### Web 界面中（需要集成）
集成后可用：
- ✅ 终端面板直接调用技能
- ✅ 快捷操作按钮
- ✅ 项目状态实时显示
- ✅ 学习文档管理
- ✅ 代码检索
- ✅ 图片资源管理

---

## 🔗 相关文件

### 核心功能
- `src/skills/advanced/ProjectWorkflowManager.js` - 工作流管理器
- `src/terminal/TerminalAgent.js` - 终端代理

### 需要修改
- `src/components/Terminal/TerminalPanel.jsx` - 终端面板
- `src/App.jsx` - 应用路由

### 需要创建
- `src/components/Workflow/SmartProjectPanel.jsx` - 智能项目面板
- `src/components/Workflow/LearningManager.jsx` - 学习管理器

---

**建议立即实施方案 3（混合方案），可以快速将功能集成到 Web 界面！**
