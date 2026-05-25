# 🔌 Skills 集成指南

> 让大模型识别和调用 Skills 文件夹中的技能

## 📋 问题解答

**Q: Skills 文件夹创建完了，AI 能直接识别调用吗？**

**A: 不能直接调用，需要集成！** 

Skills 文件夹只是存储了技能的定义文档（SKILL.md），AI 大模型本身不会自动读取这些文件。你需要：

1. ✅ **加载器** - 读取 SKILL.md 并解析
2. ✅ **集成代码** - 将 Skills 注册到 AI 系统
3. ✅ **调用接口** - 让 AI 能够执行 Skills

---

## 🚀 快速集成方案

### 方案 1：使用 SkillsFolderLoader（推荐）

我已经创建了 `SkillsFolderLoader.js`，可以直接使用！

#### 步骤 1：在 App.jsx 中初始化

```javascript
// src/App.jsx
import { useEffect } from 'react';
import { skillsLoader } from './skills/SkillsFolderLoader.js';
import { aiAssistant } from './skills/SkillsIntegrationExample.js';

function App() {
  useEffect(() => {
    // 应用启动时加载 Skills
    aiAssistant.initializeSkills().then(success => {
      if (success) {
        console.log('✅ Skills 已就绪');
      }
    });
  }, []);

  // ... 其他代码
}
```

#### 步骤 2：发送给 LLM

```javascript
// 获取 Skills 定义
const tools = aiAssistant.getToolsForLLM();

// 发送给 OpenAI/GPT
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: '帮我搜索最新的 AI 进展' }],
  tools: tools,  // ← 这里！
  tool_choice: 'auto'
});
```

#### 步骤 3：处理 LLM 的 tool_calls

```javascript
if (response.choices[0].message.tool_calls) {
  for (const toolCall of response.choices[0].message.tool_calls) {
    const result = await aiAssistant.executeSkill(
      toolCall.function.name,
      toolCall.function.arguments.action,
      toolCall.function.arguments
    );
    
    console.log('Skill 执行结果:', result);
  }
}
```

---

### 方案 2：手动集成到现有 SkillManager

如果你的项目已经有 SkillManager，可以这样集成：

#### 修改 src/skills/core/SkillManager.js

```javascript
import { skillsLoader } from '../SkillsFolderLoader.js';

export class SkillManager {
  async initializeWithSkillsFolder() {
    // 先加载内置 Skills
    this.initializeSkills();
    
    // 再加载 Skills 文件夹
    try {
      await skillsLoader.loadAllSkills();
      const skillDefs = skillsLoader.getAllFunctionDefinitions();
      
      console.log(`✅ 从文件夹加载了 ${skillDefs.length} 个 Skills`);
      
      // 将 Skills 添加到现有系统
      for (const skillDef of skillDefs) {
        this.registerSkillFromDefinition(skillDef);
      }
    } catch (error) {
      console.warn('⚠️ Skills 文件夹加载失败:', error);
    }
  }
  
  registerSkillFromDefinition(definition) {
    // 将 SKILL.md 定义转换为 Skill 实例
    const skill = this.createSkillFromDefinition(definition);
    this.skills.set(skill.name, skill);
  }
}
```

---

## 📖 完整工作流程

### 1. Skills 文件夹结构

```
Skills/
├── general/
│   └── humanizer-zh/
│       └── SKILL.md
└── programming/
    └── code-review/
        └── SKILL.md
```

### 2. SKILL.md 内容

```markdown
# Humanizer-zh Skill

## 元数据
- **名称**: Humanizer-zh
- **触发关键词**: 去 AI 味，人性化，润色
- **优先级**: 高

## 描述
去"AI 味"神器...
```

### 3. 加载器解析

```javascript
// SkillsFolderLoader.js 自动解析
const skillDef = {
  name: 'Humanizer-zh',
  description: '去"AI 味"神器...',
  triggerKeywords: ['去 AI 味', '人性化', '润色'],
  priority: 'high'
};
```

### 4. 转换为 LLM Function

```javascript
{
  type: 'function',
  function: {
    name: 'humanizer_zh',
    description: '去"AI 味"神器...',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: '要润色的文本' },
        style: { type: 'string', enum: ['casual', 'formal'] }
      }
    }
  }
}
```

### 5. 发送给 LLM

```javascript
const messages = [
  {
    role: 'user',
    content: '帮我去掉这段话的 AI 味'
  }
];

const tools = [humanizer_zh_definition];

const response = await chat({ messages, tools });
```

### 6. LLM 返回 tool_call

```json
{
  "tool_calls": [{
    "function": {
      "name": "humanizer_zh",
      "arguments": {
        "text": "综上所述...",
        "action": "execute"
      }
    }
  }]
}
```

### 7. 执行 Skill

```javascript
const result = await executeSkill('humanizer_zh', {
  text: '综上所述...',
  action: 'execute'
});

// 调用实际的脚本或 API
// 例如：python scripts/humanizer.py --text "综上所述..."
```

---

## 🔧 实际集成到 Commander Pro

### 修改 src/App.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { aiAssistant } from './skills/SkillsIntegrationExample.js';

export default function App() {
  const [skillsReady, setSkillsReady] = useState(false);

  useEffect(() => {
    // 初始化 Skills
    aiAssistant.initializeSkills().then(() => {
      setSkillsReady(true);
    });
  }, []);

  const handleSendMessage = async (message) => {
    // 使用 Skills 处理消息
    const response = await aiAssistant.processMessage(message);
    return response;
  };

  return (
    <div>
      {skillsReady && <div>✅ Skills 已就绪</div>}
      {/* ... 其他 UI */}
    </div>
  );
}
```

### 修改后端服务 server/index.js

```javascript
import { skillsLoader } from './skills/SkillsFolderLoader.js';

// 启动时加载 Skills
await skillsLoader.loadAllSkills();

// API 端点：获取 Skills 列表
app.get('/api/skills', (req, res) => {
  res.json(skillsLoader.getStatus());
});

// API 端点：执行 Skill
app.post('/api/skills/execute', async (req, res) => {
  const { skillName, action, params } = req.body;
  
  try {
    const result = await executeSkill(skillName, action, params);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 📊 Skills 调用流程

```
用户消息
  ↓
AI 分析意图
  ↓
匹配 Skills（关键词匹配）
  ↓
构建带 tools 的 prompt
  ↓
发送给 LLM
  ↓
LLM 返回 tool_calls
  ↓
执行对应的 Skill
  ↓
返回结果给用户
```

---

## 🎯 实际示例

### 示例 1：使用 Humanizer-zh

**用户**: "帮我去掉这段文字的 AI 味：综上所述，本项目具有显著优势"

**系统处理**:
1. 关键词匹配：`去 AI 味` → 匹配 `humanizer_zh`
2. 发送给 LLM 带 tool definition
3. LLM 返回：`tool_call: humanizer_zh({text: "...", action: "execute"})`
4. 执行：调用 `scripts/humanizer.py`
5. 返回："总的来说，这个项目很有优势"

### 示例 2：使用 Code Review

**用户**: "审查这段代码的安全性"

**系统处理**:
1. 关键词：`审查`、`代码` → 匹配 `code_review`
2. LLM 调用：`code_review({code: "...", action: "security_check"})`
3. 执行：调用 `scripts/code-reviewer.py --security`
4. 返回审查报告

---

## ⚠️ 注意事项

### 1. Skills 不会自动执行

- ❌ Skills 文件夹创建完 ≠ AI 会自动使用
- ✅ 需要代码集成和调用

### 2. 需要实际的执行脚本

SKILL.md 只是文档，实际功能需要：

```
skill-name/
├── SKILL.md          # 文档定义
├── scripts/          # 实际执行的代码
│   └── main.py
└── references/       # 参考资料
```

### 3. 权限和安全

- 文件操作需要权限控制
- 系统命令需要沙箱
- 网络请求需要白名单

### 4. 建议的集成顺序

1. ✅ 先集成 **Skill-Vetter**（安全检查）
2. ✅ 再集成 **Exec-Guard**（运行监控）
3. ✅ 最后集成其他功能 Skills

---

## 📚 相关文件

- [`SkillsFolderLoader.js`](file:///f:/openclaw/commander-pro/src/skills/SkillsFolderLoader.js) - Skills 加载器
- [`SkillsIntegrationExample.js`](file:///f:/openclaw/commander-pro/src/skills/SkillsIntegrationExample.js) - 集成示例
- [`Skills/README.md`](file:///f:/openclaw/commander-pro/Skills/README.md) - Skills 总览
- [`Skills/QUICKSTART.md`](file:///f:/openclaw/commander-pro/Skills/QUICKSTART.md) - 快速开始

---

## 🚀 下一步

1. **测试加载器**
   ```bash
   node -e "import('./src/skills/SkillsFolderLoader.js').then(m => m.skillsLoader.loadAllSkills())"
   ```

2. **集成到 App**
   - 修改 App.jsx
   - 添加初始化代码
   - 测试 Skills 调用

3. **创建执行脚本**
   - 为每个 Skill 创建实际执行的脚本
   - 放在 `Skills/{category}/{skill}/scripts/`

4. **测试完整流程**
   - 用户消息 → 匹配 Skills → LLM → 执行 → 返回

---

**总结**：Skills 文件夹创建完后，需要编写加载器和集成代码，AI 才能识别和调用。我已经提供了完整的加载器和集成示例，可以直接使用！🎉
