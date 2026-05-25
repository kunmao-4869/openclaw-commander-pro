# 🎯 OpenClaw 自主学习工作流 - 优化计划

## 📋 任务清单

### ✅ 已完成的任务

#### 1. 基础设施修复
- [x] 修复 AI 分析技能模型未定义问题
- [x] 增加超时时间配置（180 秒）
- [x] 优化模型选择（qwen3:8b 替代 30b）
- [x] 修复代码生成技能超时问题（300 秒）

#### 2. 工作流验证
- [x] 第一遍：自主学习（104.74 秒）
  - [x] 搜索 10 条信息
  - [x] 生成 1238 字分析报告
  - [x] 生成 1474 字对比报告
  - [x] 生成 JSON 项目框架
- [x] 第二遍：参考改进（73.08 秒）
  - [x] 学习 6 个参考文件
  - [x] 生成改进建议
  - [x] 生成改进版项目

#### 3. 文档输出
- [x] 完整工作流总结文档
- [x] 执行脚本（test-first-pass.js, test-second-pass.js）
- [x] 参考项目（HarmonyDrawGuess）

---

### 🔄 当前任务

#### 4. 明确分工边界
- [x] OpenClaw 专注于学习和信息收集
- [x] 代码生成交给命令模块 + 大模型
- [ ] 优化学习报告格式（便于大模型理解）

---

### 📝 待完成任务

#### 5. 学习报告格式优化 ⏳ **当前重点**
- [ ] 设计标准化的学习报告模板
- [ ] 提取关键技术要点（JSON 格式）
- [ ] 生成代码生成提示词（Prompt）
- [ ] 添加技术栈识别
- [ ] 添加最佳实践建议

#### 6. 命令模块集成
- [ ] 创建命令模块脚本
- [ ] 集成大模型调用（qwen3:8b/30b）
- [ ] 学习报告 → 代码生成
- [ ] 文件保存逻辑

#### 7. 错误处理和优化
- [ ] 添加重试机制
- [ ] 优化 JSON 解析
- [ ] 添加进度反馈
- [ ] 添加错误恢复

#### 8. 扩展应用场景
- [ ] Web 应用开发模板
- [ ] Node.js 后端模板
- [ ] Python 脚本模板
- [ ] 更多技术栈支持

---

## 🎯 核心优化方向

### 方向 1: 学习报告标准化

#### 当前问题
- 分析报告格式不统一
- 大模型难以理解关键信息
- 缺少结构化的技术要点

#### 解决方案
```javascript
// 标准化学习报告结构
{
  "project": {
    "name": "你画我猜",
    "type": "HarmonyOS",
    "description": "双人实时在线游戏"
  },
  "technologies": [
    {
      "name": "ArkTS",
      "version": "1.0",
      "purpose": "开发语言",
      "keyFeatures": ["@Entry", "@Component", "@State"]
    },
    {
      "name": "WebSocket",
      "purpose": "实时通信",
      "serverUrl": "ws://localhost:8080"
    }
  ],
  "architecture": {
    "pages": ["Index.ets", "GameRoom.ets"],
    "components": ["DrawingCanvas", "PlayerList", "Timer"],
    "utils": ["WebSocketManager", "WordBank"]
  },
  "requirements": [
    "双人实时在线",
    "一人画画一人猜",
    "WebSocket 通信",
    "Canvas 画布"
  ],
  "bestPractices": [
    "使用@Entry 和@Component 装饰器",
    "使用@State 状态管理",
    "模块化设计（高内聚低耦合）"
  ],
  "codeGenerationPrompt": "请根据以上技术要点，生成完整的鸿蒙项目代码..."
}
```

---

### 方向 2: 命令模块设计

#### 功能定位
```
输入：学习报告（JSON 格式）
处理：调用大模型 + 代码生成 Prompt
输出：完整项目代码
```

#### 实现方案
```javascript
// 命令模块脚本
import { readFileSync } from 'fs';
import { SkillManager } from './src/skills/core/SkillManager.js';

async function generateCodeFromReport(reportPath) {
  // 1. 读取学习报告
  const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
  
  // 2. 构建代码生成 Prompt
  const prompt = buildCodeGenerationPrompt(report);
  
  // 3. 调用大模型生成代码
  const code = await callLLM(prompt);
  
  // 4. 解析并保存文件
  await saveProject(code, report.outputDir);
}

function buildCodeGenerationPrompt(report) {
  return `
请根据以下技术要点生成完整的${report.project.type}项目代码：

## 项目信息
- 名称：${report.project.name}
- 描述：${report.project.description}

## 技术栈
${report.technologies.map(t => `- ${t.name}: ${t.purpose}`).join('\n')}

## 项目结构
${JSON.stringify(report.architecture, null, 2)}

## 功能需求
${report.requirements.map(r => `- ${r}`).join('\n')}

## 最佳实践
${report.bestPractices.map(b => `- ${b}`).join('\n')}

请生成完整的、可运行的代码，包含所有必要的文件。
`;
}
```

---

### 方向 3: 流程优化

#### 当前流程
```
搜索 → 分析 → 对比 → 生成报告 → （结束）
```

#### 优化后流程
```
搜索 → 分析 → 对比 → 生成报告 → 调用大模型 → 生成代码 → 保存文件
  ↑                                                                   ↓
  └────────────────────── 可选迭代优化 ───────────────────────────────┘
```

#### 关键改进点
1. **自动化程度提升** - 学习完成后自动调用大模型
2. **迭代优化** - 支持多轮改进
3. **质量检查** - 添加代码审查步骤
4. **错误恢复** - 失败时自动重试

---

### 方向 4: 性能优化

#### 当前性能
- 第一遍：104.74 秒
- 第二遍：73.08 秒
- 总计：177.82 秒

#### 优化目标
- 第一遍：60 秒以内（⬇️ 43%）
- 第二遍：40 秒以内（⬇️ 45%）
- 总计：100 秒以内（⬇️ 44%）

#### 优化策略
1. **并行执行** - 搜索和分析可以部分并行
2. **缓存机制** - 缓存已分析的网页内容
3. **智能跳过** - 相似内容不重复分析
4. **模型优化** - 使用更快的模型（如 qwen2.5:7b）

---

### 方向 5: 质量提升

#### 当前问题
- JSON 解析失败率高
- 代码生成不完整
- 缺少文件保存逻辑

#### 解决方案
1. **改进 JSON 提取**
```javascript
// 使用正则表达式提取 JSON 代码块
const jsonMatch = response.match(/```json([\s\S]*?)```/);
if (jsonMatch) {
  return JSON.parse(jsonMatch[1]);
}

// 尝试提取第一个 JSON 对象
const firstJson = response.match(/\{[\s\S]*?\}/);
if (firstJson) {
  return JSON.parse(firstJson[0]);
}
```

2. **添加代码审查**
```javascript
const review = await skillManager.executeSkill('review_code', {
  code: generatedCode,
  language: 'ArkTS',
  checklist: [
    '语法正确性',
    '功能完整性',
    '代码规范',
    '性能优化'
  ]
});
```

3. **文件保存逻辑**
```javascript
for (const file of project.files) {
  await skillManager.executeSkill('safe_write_file', {
    path: `${outputDir}/${file.path}`,
    content: file.content,
    overwrite: true
  });
}
```

---

## 📊 优先级排序

### 🔥 高优先级（本周完成）
1. **学习报告格式优化** - 直接影响代码生成质量
2. **命令模块集成** - 实现完整工作流的关键
3. **JSON 解析优化** - 提高成功率

### 📌 中优先级（本月完成）
4. **错误处理和重试** - 提高稳定性
5. **性能优化** - 提升用户体验
6. **代码审查集成** - 提高代码质量

### 🎯 低优先级（未来规划）
7. **扩展技术栈** - 支持更多场景
8. **机器学习优化** - 长期优化方向
9. **工作流可视化** - 提升易用性

---

## 🎯 成功标准

### 阶段 1: 基础功能（本周）
- [ ] 学习报告格式标准化
- [ ] 命令模块可以调用大模型
- [ ] 成功生成可运行的项目代码
- [ ] JSON 解析成功率 > 90%

### 阶段 2: 稳定性提升（本月）
- [ ] 错误重试机制完善
- [ ] 性能提升 40%
- [ ] 代码审查集成
- [ ] 用户反馈机制

### 阶段 3: 扩展应用（下月）
- [ ] 支持 3+ 种技术栈
- [ ] 模板库建设
- [ ] 知识库积累
- [ ] 文档完善

---

## 💡 创新点思考

### 1. 双模型协作
```
OpenClaw (qwen3:8b)  →  学习分析  →  技术报告
                                        ↓
                              命令模块 (qwen3:30b)  →  代码生成
```

### 2. 迭代学习
```
第一遍：生成初稿
   ↓
代码审查 → 发现问题
   ↓
第二遍：针对性学习
   ↓
改进版本
```

### 3. 知识积累（暂缓）
```
⚠️ 暂缓实施原因：
- 关键词提取可能不准确
- 知识结构化难度大
- 可能引入噪声影响后续学习

替代方案：
- 使用学习报告文件作为临时知识存储
- 通过参考项目文件提供上下文
- 依赖大模型的上下文理解能力
```

---

## 🚀 下一步行动

### 立即执行（今天）
1. ✅ 设计学习报告标准格式
2. ✅ 创建命令模块脚本框架
3. ✅ 优化 JSON 解析逻辑

### 本周完成
4. 集成测试（学习 → 代码生成）
5. 修复发现的问题
6. 编写使用文档

### 下周开始
7. 扩展其他技术栈
8. 性能优化
9. 用户测试

---

## 📝 备注

### 技术债务
- JSON 解析逻辑需要重构
- 错误处理不够完善
- 缺少单元测试

### 已知限制
- 依赖本地 AI 服务（Ollama）
- 代码生成质量受模型影响
- 复杂项目需要多遍迭代

### 未来展望
- 支持更多 AI 后端（Ollama、vLLM、TGI）
- 支持云端模型（GPT-4、Claude）
- 支持分布式执行（多机协作）

---

**最后更新时间**: 2026-04-03
**状态**: 进行中
**负责人**: OpenClaw 团队
