# 🦾 Commander Pro Skills 中心

> 让 AI 像专家一样工作 - 标准化的能力包系统

## 📚 什么是 Skills?

**Skills** 是给 AI 准备的一套"能力包"或"岗位说明书"。它不仅仅是简单的提示词（Prompt），而是将完成某个特定任务所需的：

- 📖 **领域知识**
- 📋 **操作流程（SOP）**
- 🛠️ **工具脚本**
- 📚 **参考资料**

打包在一起的标准文件夹。当 AI 遇到特定任务时，就能像经验丰富的专家一样，按需加载这些资料，稳定、可靠地帮你干活。

---

## 📂 Skills 标准结构

```
skill-name/
├── SKILL.md          # 必选：说明书（元数据 + 执行指令）
├── scripts/          # 可选：可执行脚本
│   ├── tool-1.py
│   └── tool-2.sh
└── references/       # 可选：参考资料
    ├── guide-1.md
    └── template-2.md
```

### SKILL.md 核心内容

1. **元数据**: 名称、版本、分类、触发关键词
2. **描述**: 技能功能说明
3. **能力范围**: 支持/不支持的操作
4. **使用场景**: 典型应用场景
5. **操作流程（SOP）**: 标准化执行步骤
6. **参数规范**: 输入输出格式
7. **示例对话**: 使用示例
8. **相关文件**: 脚本和参考资料

---

## 🗂️ Skills 分类

### 🎯 通用提效类（适合所有人）

| Skill | 描述 | 优先级 |
|-------|------|--------|
| 📄 **[PDF Handler](general/pdf-handler/)** | 文档处理神器，支持读取、合并、拆分、OCR | ⭐⭐⭐⭐ |
| ✍️ **[Humanizer-zh](general/humanizer-zh/)** | 去 AI 味，让文字更自然 | ⭐⭐⭐⭐ |
| 🔍 **[Tavily Search](general/tavily-search/)** | AI 优化的结构化搜索 | ⭐⭐⭐⭐ |
| 📈 **[Self-Improving Agent](general/self-improving-agent/)** | 让 AI 越用越聪明 | ⭐⭐⭐⭐⭐ |

### 💻 编程与开发类（程序员/技术人必备）

| Skill | 描述 | 优先级 |
|-------|------|--------|
| 🚀 **[Superpowers](programming/superpowers/)** | 开发全流程方法论 | ⭐⭐⭐⭐⭐ |
| 🌐 **[Playwright](programming/playwright/)** | 浏览器自动化神器 | ⭐⭐⭐⭐ |
| 🔎 **[Code Review](programming/code-review/)** | 代码质量守护神 | ⭐⭐⭐⭐⭐ |
| 🎨 **[Frontend Design](programming/frontend-design/)** | 前端颜值救星 | ⭐⭐⭐⭐ |
| 🧪 **[TDD Skill](programming/tdd-skill/)** | 测试驱动开发 | ⭐⭐⭐⭐ |
| 🐙 **[GitHub](programming/github/)** | 代码仓库管理员 | ⭐⭐⭐⭐ |

### 📚 办公与知识管理类

| Skill | 描述 | 优先级 |
|-------|------|--------|
| 📝 **[Notion](office/notion/)** | 知识库与数据库管理 | ⭐⭐⭐ |
| 🪨 **[Obsidian](office/obsidian/)** | 笔记库管理 | ⭐⭐⭐ |
| 📋 **[Planning With Files](office/planning-with-files/)** | 项目规划持久化 | ⭐⭐⭐⭐ |

### 🛡️ 安全与风控类（强烈建议优先安装）

| Skill | 描述 | 优先级 |
|-------|------|--------|
| 🔒 **[Skill-Vetter](security/skill-vetter/)** | 安装前安全扫描 | ⭐⭐⭐⭐⭐ |
| 🛡️ **[Exec-Guard](security/exec-guard/)** | 运行时监控 | ⭐⭐⭐⭐⭐ |

---

## 🚀 快速开始

### 1. 安装 Skills

Skills 以文件夹形式存在，直接放入 `Skills/` 目录即可：

```bash
# 推荐：先安装安全类 Skills
cp -r security/skill-vetter ~/commander-pro/Skills/
cp -r security/exec-guard ~/commander-pro/Skills/

# 安装常用 Skills
cp -r general/humanizer-zh ~/commander-pro/Skills/
cp -r programming/superpowers ~/commander-pro/Skills/
```

### 2. 使用 Skills

Skills 会自动被 AI 识别和使用。你也可以主动触发：

```
# 直接使用
"帮我去掉这段文字的 AI 味"  → 触发 Humanizer-zh

# 指定 Skill
"用 Code Review 技能审查这段代码"

# 查看可用 Skills
"有哪些可用的技能？"
```

### 3. 开发自己的 Skills

参考现有 Skills 的结构，创建你自己的技能：

```bash
my-awesome-skill/
├── SKILL.md
├── scripts/
│   └── main.py
└── references/
    └── guide.md
```

---

## 📖 使用指南

### 技能触发方式

1. **自动触发**: AI 识别到相关任务自动使用
2. **手动指定**: 明确告诉 AI 使用哪个技能
3. **推荐触发**: AI 建议使用某个技能

### 技能组合

多个 Skills 可以协同工作：

```
Superpowers + Code Review → 完整开发流程
Tavily + Humanizer-zh → 调研 + 润色
Playwright + PDF Handler → 数据采集 + 报告生成
```

### 技能优先级

当多个 Skills 都适用时，按优先级执行：

1. ⭐⭐⭐⭐⭐ 极高优先级（如安全类）
2. ⭐⭐⭐⭐ 高优先级（如核心功能）
3. ⭐⭐⭐ 中优先级（如辅助功能）

---

## 🛡️ 安全提醒

⚠️ **安装 Skills 前必须检查**:

1. 使用 **Skill-Vetter** 扫描技能包
2. 检查作者信誉和评价
3. 在沙箱环境中测试
4. 阅读 SKILL.md 了解功能

🛡️ **运行时保护**:

- **Exec-Guard** 实时监控所有技能执行
- 任何危险操作都会被拦截
- 完整的审计日志

---

## 📊 技能统计

- **总计 Skills**: 13 个
  - 通用提效：4 个
  - 编程开发：6 个
  - 办公管理：3 个
  - 安全风控：2 个

- **推荐安装组合**:
  - 新手包：Humanizer-zh + PDF Handler + Tavily
  - 开发包：Superpowers + Code Review + TDD + GitHub
  - 安全包：Skill-Vetter + Exec-Guard（必装！）

---

## 🤝 贡献 Skills

欢迎贡献你自己的 Skills！请遵循以下规范：

1. 使用标准文件夹结构
2. 编写完整的 SKILL.md
3. 提供清晰的示例
4. 确保安全性
5. 添加适当的标签

提交方式：
```bash
git add Skills/my-awesome-skill/
git commit -m "feat: add my-awesome-skill"
git push
```

---

## 📚 相关资源

- [Skills 开发指南](docs/skill-development-guide.md)
- [SKILL.md 模板](templates/SKILL-template.md)
- [安全最佳实践](docs/security-best-practices.md)
- [示例 Skills 库](examples/)

---

## 🔄 更新日志

### v1.0.0 (2024-01-15)
- ✅ 首次发布 13 个核心 Skills
- ✅ 建立 Skills 标准规范
- ✅ 实现安全扫描和监控

---

## 💬 常见问题

**Q: Skills 是必须的吗？**  
A: 不是必须的，但强烈推荐使用。Skills 能让 AI 更专业、更稳定地完成特定任务。

**Q: 安装太多 Skills 会影响性能吗？**  
A: 不会。Skills 是按需加载的，只有触发时才会使用。

**Q: 如何禁用某个 Skill？**  
A: 将 Skills 文件夹移出 `Skills/` 目录即可。

**Q: Skills 会泄露我的数据吗？**  
A: 官方 Skills 经过严格审查。第三方 Skills 请使用 Skill-Vetter 扫描后再使用。

---

**让 AI 像专家一样工作！从安装 Skills 开始 🚀**
