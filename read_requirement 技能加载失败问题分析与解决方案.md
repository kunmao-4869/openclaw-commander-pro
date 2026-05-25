# read_requirement 技能加载失败问题分析与解决方案

## 📋 问题概述

**现象**：在 Commander Pro 应用中执行"根据需求文档生成项目"时，系统提示"技能不存在：read_requirement"

**错误日志**：
```
❌ **步骤 1**: 读取需求文档
   错误：技能不存在：read_requirement

❌ **步骤 2**: 生成项目代码
   错误：需要指定项目类型
```

## 🔍 问题根因分析

### 1. 代码实现层面 ✅（已解决）

**检查结果**：
- ✅ `ReadRequirementSkill` 类已创建：`src/skills/file/ReadRequirement.js`
- ✅ 技能已导入到 `TerminalAgent.js`：`import { ReadRequirementSkill } from '../skills/file/ReadRequirement.js'`
- ✅ 技能已注册到 `registerDefaultSkills()` 方法中
- ✅ 技能注册测试通过：`test-skill-registration.js` 显示技能已注册

**测试验证**：
```bash
cd f:\openclaw\commander-pro
node test-skill-registration.js

# 输出：
✅ 已注册 12 个技能
✅ read_requirement 技能已注册
   名称：read_requirement
   描述：读取项目需求文档（专门用于读取 .md 格式的需求文件，支持中文路径）
```

**结论**：代码实现正确，技能在 Node.js 环境中可以正常注册。

### 2. 前端应用层面 ⚠️（可能的问题）

**问题点**：
1. **浏览器缓存**：Vite 虽然有热重载，但某些情况下浏览器可能缓存旧代码
2. **应用重启**：应用需要完全重启才能加载新代码
3. **技能注册时机**：`registerDefaultSkills()` 在 `useEffect` 中异步调用，可能存在时序问题

**TerminalPanel.jsx 中的初始化逻辑**：
```javascript
useEffect(() => {
  const initWorkflowSystem = async () => {
    const agent = new TerminalAgent({...});
    await agent.registerDefaultSkills(); // ✅ 正确调用
    setTerminalAgent(agent);
  };
  initWorkflowSystem();
}, []);
```

### 3. 技能执行路径 🔍（关键问题）

**发现**：错误提示"技能不存在"可能来自两个地方：

#### 路径 A：TerminalAgent 执行
```javascript
// TerminalAgent.js:506
async executeSkill(skillCall) {
  const skill = this.skills.get(skillCall.skill);
  if (!skill) {
    this.printAssistant(`❌ 未找到技能：${skillCall.skill}`);
    return null;
  }
}
```

#### 路径 B：TaskPlanner + SkillManager 执行
```javascript
// taskPlanner.js:449
const result = await context.executeSkill(step.action, step.params);

// SkillsAPIClient.js:112-114
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message || 'Failed to execute skill');
}
```

**关键发现**：任务规划系统可能**不是通过 TerminalAgent 执行技能**，而是通过 **SkillsAPIClient** 调用后端 API！

### 4. 后端服务层面 ❌（主要问题）

**后端技能执行逻辑**（`server/routes/skills.js:191-234`）：
```javascript
router.post('/execute', async (req, res) => {
  const { skillName, action, params } = req.body;
  
  await ensureSkillsLoaded();
  const skill = skillsLoader.getSkillDetail(skillName);
  
  if (!skill) {
    return res.status(404).json({
      error: 'Skill not found'
    });
  }
  
  // TODO: 实现实际的 Skill 执行逻辑
  res.json({
    success: true,
    message: `Skill "${skillName}" executed...`
  });
});
```

**问题**：
1. 后端只有 SKILL.md 定义，**没有实际执行逻辑**
2. 后端的 `skillsLoader` 从 SKILL.md 文件加载技能元数据，但不加载实现类
3. 前端通过 API 调用后端时，后端返回"Skill not found"

### 5. 技能调用链路分析

**实际执行流程**：
```
用户输入
  ↓
AI 助手（大模型）
  ↓
TaskPlanner（任务规划）
  ↓
context.executeSkill() ← 这里使用哪个执行器？
  ↓
路径 A: TerminalAgent.executeSkill()  ✅ 可以执行
  或
路径 B: SkillsAPIClient.executeSkill() → HTTP → 后端 API  ❌ 无法执行
```

**关键问题**：TaskPlanner 使用的 `context.executeSkill` 来自哪里？

查看 `App.jsx`：
```javascript
// App.jsx:214, 223
executeSkill: skillManager.executeSkill.bind(skillManager),
```

**skillManager 是什么？** 需要进一步调查。

## 💡 解决方案

### 方案一：修复后端技能执行（推荐）⭐⭐⭐⭐⭐

**目标**：让后端 API 能够正确执行技能

**步骤**：

1. **在后端导入技能实现**
   ```javascript
   // server/index.js 或 server/routes/skills.js
   import { ReadRequirementSkill } from '../../src/skills/file/ReadRequirement.js';
   ```

2. **创建技能执行映射**
   ```javascript
   const skillImplementations = {
     'read_requirement': new ReadRequirementSkill(),
     'safe_read_file': new SafeFileReadSkill(),
     // ... 其他技能
   };
   ```

3. **修改执行逻辑**
   ```javascript
   router.post('/execute', async (req, res) => {
     const { skillName, action, params } = req.body;
     
     const skillInstance = skillImplementations[skillName];
     if (!skillInstance) {
       return res.status(404).json({ error: 'Skill not found' });
     }
     
     const result = await skillInstance.execute(params);
     res.json({ success: true, result });
   });
   ```

**优点**：
- ✅ 统一技能执行逻辑
- ✅ 前后端都能使用
- ✅ 符合架构设计

**缺点**：
- ⚠️ 需要修改后端代码
- ⚠️ 需要为每个技能创建后端实例

---

### 方案二：让 TaskPlanner 使用 TerminalAgent（次优）⭐⭐⭐⭐

**目标**：修改任务规划系统，使用 TerminalAgent 执行技能

**步骤**：

1. **在 TerminalAgent 中暴露 executeSkill 方法**
   ```javascript
   // TerminalAgent.js
   async executeSkill(skillName, params) {
     const skill = this.skills.get(skillName);
     if (!skill) {
       throw new Error(`技能不存在：${skillName}`);
     }
     return await skill.execute(params);
   }
   ```

2. **在 App.jsx 中使用 TerminalAgent 的执行器**
   ```javascript
   // App.jsx
   const skillManager = {
     executeSkill: async (skillName, params) => {
       if (terminalAgent) {
         return await terminalAgent.executeSkill(skillName, params);
       }
       // 回退到 SkillsAPIClient
       return await skillsAPIClient.executeSkill(skillName, 'execute', params);
     }
   };
   ```

**优点**：
- ✅ 不需要修改后端
- ✅ 利用已有的 TerminalAgent 技能系统

**缺点**：
- ⚠️ TerminalAgent 只在终端面板中存在，其他地方无法使用
- ⚠️ 架构不够清晰

---

### 方案三：创建全局 SkillExecutor（最佳架构）⭐⭐⭐⭐⭐

**目标**：创建统一的技能执行器，前后端共享

**步骤**：

1. **创建 SkillExecutor 类**
   ```javascript
   // src/skills/core/SkillExecutor.js
   export class SkillExecutor {
     constructor() {
       this.skills = new Map();
     }
     
     registerSkill(name, instance) {
       this.skills.set(name, instance);
     }
     
     async execute(name, params) {
       const skill = this.skills.get(name);
       if (!skill) {
         throw new Error(`技能不存在：${name}`);
       }
       return await skill.execute(params);
     }
   }
   
   export const skillExecutor = new SkillExecutor();
   ```

2. **在应用启动时注册所有技能**
   ```javascript
   // main.jsx 或 App.jsx
   import { skillExecutor } from './skills/core/SkillExecutor.js';
   import { ReadRequirementSkill } from './skills/file/ReadRequirement.js';
   
   skillExecutor.registerSkill('read_requirement', new ReadRequirementSkill());
   ```

3. **在 TaskPlanner 中使用**
   ```javascript
   // taskPlanner.js
   import { skillExecutor } from '../skills/core/SkillExecutor.js';
   
   const result = await skillExecutor.execute(step.action, step.params);
   ```

4. **在后端也使用同一个执行器**
   ```javascript
   // server/index.js
   import { skillExecutor } from '../src/skills/core/SkillExecutor.js';
   
   router.post('/api/skills/execute', async (req, res) => {
     const { skillName, params } = req.body;
     const result = await skillExecutor.execute(skillName, params);
     res.json({ success: true, result });
   });
   ```

**优点**：
- ✅ 架构清晰，职责分离
- ✅ 前后端共享同一套技能系统
- ✅ 易于扩展和维护

**缺点**：
- ⚠️ 需要重构代码
- ⚠️ 工作量较大

---

### 方案四：临时方案 - 修改任务规划（快速修复）⭐⭐⭐

**目标**：绕过技能执行，直接在任务规划中读取文件

**步骤**：

1. **修改 TaskPlanner，特殊处理读取需求**
   ```javascript
   // taskPlanner.js
   if (step.action === 'read_requirement') {
     const content = await fs.readFile(step.params.path, 'utf-8');
     return { success: true, content };
   }
   ```

**优点**：
- ✅ 快速修复
- ✅ 不需要大改架构

**缺点**：
- ❌ 硬编码，不符合架构设计
- ❌ 不可扩展
- ❌ 不推荐

---

## 🎯 推荐方案

**首选**：方案三（创建全局 SkillExecutor）
- 最符合架构设计
- 长期可维护性最好
- 前后端统一

**次选**：方案一（修复后端技能执行）
- 实现简单
- 快速见效
- 适合当前紧急需求

**临时**：方案四（仅用于测试）
- 不推荐用于生产环境

---

## 📝 实施计划

### 阶段一：快速修复（方案一）

**时间**：30 分钟

**任务**：
1. 在 `server/index.js` 中导入 `ReadRequirementSkill`
2. 创建技能实例映射
3. 修改 `/api/skills/execute` 路由
4. 测试验证

**验收标准**：
- ✅ 在应用中执行"读取需求文档"成功
- ✅ 需求文档内容正确返回

### 阶段二：架构优化（方案三）

**时间**：2-3 小时

**任务**：
1. 创建 `SkillExecutor` 类
2. 迁移所有技能到 SkillExecutor
3. 更新 TaskPlanner 使用 SkillExecutor
4. 更新后端 API 使用 SkillExecutor
5. 更新 TerminalAgent 使用 SkillExecutor
6. 全面测试

**验收标准**：
- ✅ 所有技能在前后端都能正常执行
- ✅ 代码架构清晰
- ✅ 易于添加新技能

---

## 📊 测试验证

### 测试用例 1：Node.js 环境技能注册
```bash
cd f:\openclaw\commander-pro
node test-skill-registration.js

# 预期输出：
✅ read_requirement 技能已注册
```

### 测试用例 2：应用中使用技能
```
在 Commander Pro 终端输入：
读取"F:\openclaw\projects\HarmonyOS\HarmonyOS_Demo\docs\智慧客房 APP 项目需求.md"

# 预期输出：
📖 正在读取需求文档...
✅ 需求文档读取完成
   标题：智慧客房 APP 项目需求
   大小：1469 字节
   行数：62 行
```

### 测试用例 3：完整流程
```
在 Commander Pro 终端输入：
根据"F:\openclaw\projects\HarmonyOS\HarmonyOS_Demo\docs\智慧客房 APP 项目需求.md"生成项目

# 预期输出：
✅ 步骤 1: 读取需求文档 - 成功
✅ 步骤 2: 生成项目代码 - 成功
✅ 项目创建完成
```

---

## 🔧 相关文件清单

### 已修改文件
1. `src/skills/file/ReadRequirement.js` - 技能实现
2. `src/skills/LazySkillLoader.js` - 技能注册映射
3. `src/terminal/TerminalAgent.js` - 技能注册到终端
4. `src/lib/taskPlanner.js` - 任务规划器技能列表
5. `Skills/programming/read-requirement/SKILL.md` - 后端技能定义

### 需要修改的文件（方案一）
1. `server/index.js` 或 `server/routes/skills.js` - 添加技能执行逻辑
2. `server/skillImplementations.js`（新建）- 技能实例映射

### 需要修改的文件（方案三）
1. `src/skills/core/SkillExecutor.js`（新建）- 统一技能执行器
2. `src/main.jsx` 或 `src/App.jsx` - 注册技能到执行器
3. `src/lib/taskPlanner.js` - 使用 SkillExecutor
4. `server/index.js` - 使用 SkillExecutor
5. `src/terminal/TerminalAgent.js` - 使用 SkillExecutor

---

## 📌 经验总结

### 问题根源
1. **技能注册不完整**：只在前端注册，后端没有实现
2. **执行路径不清晰**：TaskPlanner 使用哪个执行器不明确
3. **前后端分离**：前端有实现，后端只有元数据

### 架构反思
1. **技能执行应该统一**：前后端共享同一套执行逻辑
2. **技能注册应该集中**：避免多处注册导致不一致
3. **技能调用应该透明**：调用方不关心技能在哪里执行

### 最佳实践
1. **创建核心执行器**：SkillExecutor 统一管理所有技能
2. **技能即服务**：技能应该是独立的服务，可以在任何地方调用
3. **前后端一致**：同一技能在前后端应该有相同的实现和行为

---

## 🚀 下次上线检查清单

- [ ] 技能实现文件已创建
- [ ] 技能已注册到 SkillExecutor
- [ ] 前端可以执行技能
- [ ] 后端可以执行技能
- [ ] TaskPlanner 使用 SkillExecutor
- [ ] TerminalAgent 使用 SkillExecutor
- [ ] 所有测试用例通过
- [ ] 性能测试通过
- [ ] 文档已更新

---

*文档创建时间：2026-05-15*
*最后更新：2026-05-15*
