# 🚀 Skills 快速开始指南

> 5 分钟上手，让 AI 像专家一样工作！

## 📦 第一步：查看可用 Skills

所有 Skills 都在 `Skills/` 文件夹中，按类别组织：

```
Skills/
├── general/      # 通用提效
├── programming/  # 编程开发
├── office/       # 办公管理
└── security/     # 安全风控
```

## 🛡️ 第二步：安装安全 Skills（强烈推荐！）

⚠️ **在安装任何其他 Skills 之前，先安装安全类 Skills！**

```bash
# 复制安全 Skills 到 Commander Pro
cp -r Skills/security/skill-vetter /path/to/commander-pro/Skills/
cp -r security/exec-guard /path/to/commander-pro/Skills/
```

这两个 Skills 会：
- **Skill-Vetter**: 在安装新 Skills 前自动扫描风险
- **Exec-Guard**: 运行时监控所有操作，防止恶意行为

## 🎯 第三步：选择你的 Starter Pack

根据你的需求，选择适合的 Skills 组合：

### 📝 文字工作者包
```
✅ Humanizer-zh     - 去 AI 味，让文字更自然
✅ PDF Handler      - 处理文档
✅ Tavily Search    - 搜集资料
```

### 💻 开发者包
```
✅ Superpowers      - 开发全流程指导
✅ Code Review      - 代码审查
✅ TDD              - 测试驱动开发
✅ GitHub           - 版本控制
```

### 📊 管理者包
```
✅ Notion           - 知识库管理
✅ Obsidian         - 笔记管理
✅ Planning Files   - 项目规划
```

### 🤖 效率达人包
```
✅ Self-Improving   - 让 AI 越用越聪明
✅ Playwright       - 浏览器自动化
```

## 📥 第四步：安装 Skills

### 方法 1：手动复制（推荐）

```bash
# 例如：安装 Humanizer-zh
cp -r Skills/general/humanizer-zh /path/to/commander-pro/Skills/
```

### 方法 2：使用安装脚本（待实现）

```bash
# 安装单个 Skill
skill install humanizer-zh

# 安装整个分类
skill install-category general

# 安装推荐包
skill install-bundle developer
```

## ✅ 第五步：验证安装

启动 Commander Pro，然后：

```
"有哪些可用的技能？"
```

AI 应该列出已安装的 Skills。

## 🎮 第六步：开始使用

### 自动触发

直接说你的需求，AI 会自动使用合适的 Skills：

```
"帮我去掉这段文字的 AI 味"
→ 自动使用 Humanizer-zh

"审查这段代码"
→ 自动使用 Code Review

"搜索最新的 AI 进展"
→ 自动使用 Tavily Search
```

### 手动指定

明确告诉 AI 使用哪个 Skill：

```
"用 Superpowers 的方法论规划这个项目"

"使用 PDF Handler 读取这个文档"

"用 Playwright 自动化这个流程"
```

## 📚 学习更多

### 查看 Skill 详情

每个 Skill 都有一个 `SKILL.md` 文件，包含：

- 功能说明
- 使用场景
- 操作流程
- 示例对话
- 参数规范

例如：
```bash
cat Skills/general/humanizer-zh/SKILL.md
```

### 阅读完整文档

- [Skills 总览](README.md) - 完整介绍
- [Skills 索引](INDEX.md) - 快速查找
- 各个 Skill 的 SKILL.md - 详细说明

## 🛠️ 开发自己的 Skills

想创建自己的 Skill？很简单：

1. **创建文件夹**
   ```bash
   mkdir -p Skills/my-awesome-skill
   ```

2. **编写 SKILL.md**
   - 参考现有 Skills 的格式
   - 包含元数据、描述、使用场景等

3. **添加脚本（可选）**
   ```bash
   mkdir scripts
   echo "你的脚本代码" > scripts/main.py
   ```

4. **添加参考资料（可选）**
   ```bash
   mkdir references
   echo "参考文档" > references/guide.md
   ```

5. **测试**
   - 放入 Skills 目录
   - 启动 Commander Pro 测试

## ⚠️ 安全提醒

### 安装前

✅ **必须做**:
- 使用 Skill-Vetter 扫描
- 检查作者信誉
- 阅读 SKILL.md
- 查看用户评价

❌ **不要做**:
- 安装未扫描的 Skills
- 使用来源不明的 Skills
- 忽略安全警告

### 使用时

✅ **最佳实践**:
- 在沙箱环境测试新 Skills
- 定期审查审计日志
- 及时更新 Skills
- 报告可疑行为

## 🆘 故障排查

### Skills 不工作？

1. **检查安装位置**
   ```bash
   ls Skills/
   # 应该看到各个 skill 文件夹
   ```

2. **检查 SKILL.md**
   ```bash
   cat Skills/your-skill/SKILL.md
   # 确保格式正确
   ```

3. **重启 Commander Pro**
   ```bash
   npm run dev
   ```

### 找不到某个 Skill？

1. **确认已安装**
   ```bash
   ls Skills/category/skill-name/
   ```

2. **检查触发词**
   - 查看 SKILL.md 中的"触发关键词"
   - 使用正确的触发词

3. **手动指定**
   ```
   "使用 [Skill 名称] 做 [任务]"
   ```

## 📊 推荐学习路径

### Week 1: 基础使用
- 安装安全 Skills
- 选择 1-2 个常用 Skills
- 熟悉基本用法

### Week 2: 进阶使用
- 安装更多 Skills
- 学习组合使用
- 阅读 SKILL.md 深入了解

### Week 3: 熟练使用
- 形成自己的工作流
- 根据需求选择 Skills
- 开始开发自定义 Skills

### Week 4: 专家级别
- 优化现有 Skills
- 贡献自己的 Skills
- 帮助其他人

## 🎯 下一步

现在你已经了解了基础知识，可以：

1. 📖 浏览 [Skills 索引](INDEX.md) 了解所有可用 Skills
2. 🛡️ 安装 [安全 Skills](security/) 保护自己
3. 🎯 选择适合你的 [Starter Pack](#第三步选择你的 starter-pack)
4. 🚀 开始使用 Skills 提升效率！

---

**祝你使用愉快！有问题随时查看各个 Skill 的详细文档。** 🎉
