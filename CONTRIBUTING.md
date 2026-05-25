# Contributing to OpenClaw Commander Pro

首先，感谢您考虑为 OpenClaw Commander Pro 做出贡献！🎉

## 📖 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [测试](#测试)
- [社区](#社区)

---

## 🤝 行为准则

本项目采用 [Contributor Covenant](https://www.contributor-covenant.org/) 行为准则。请保持尊重、包容的社区环境。

---

## 🚀 如何贡献

### 报告 Bug

1. 使用 GitHub Issues 的 [Bug Report](https://github.com/kunmao-4869/openclaw-commander-pro/issues/new?template=bug_report.md) 模板
2. 填写详细信息：
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（Node.js 版本、操作系统等）
   - 日志输出

### 提出新功能

1. 使用 GitHub Issues 的 [Feature Request](https://github.com/kunmao-4869/openclaw-commander-pro/issues/new?template=feature_request.md) 模板
2. 描述功能需求和使用场景
3. 等待社区讨论和 maintainer 反馈

### 提交代码

#### 第一次贡献？

如果您不熟悉 Git 或 GitHub：
- 阅读 [GitHub Flow](https://guides.github.com/introduction/flow/)
- 查看 [Good First Issues](https://github.com/kunmao-4869/openclaw-commander-pro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

#### 开始贡献

1. **Fork 仓库**
   - 点击右上角 "Fork" 按钮
   - 克隆到您的本地：`git clone https://github.com/YOUR_USERNAME/openclaw-commander-pro.git`

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/issue-123
   ```

3. **开发功能**
   - 遵循现有代码风格
   - 添加必要的注释
   - 编写测试用例

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **推送到远程**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 访问您的 fork 仓库
   - 点击 "Compare & pull request"
   - 填写 PR 描述

---

## 💻 开发环境设置

### 前置要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git
- Ollama (用于 AI 模型)

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/kunmao-4869/openclaw-commander-pro.git
cd openclaw-commander-pro

# 安装依赖
npm install

# 启动开发服务器
npm run server          # 后端
npm run dev             # 前端（新终端）

# 运行测试
npm test
```

---

## 📋 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（不添加功能或修复 bug）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

### 示例

```bash
feat: add HarmonyOS project generation support
fix: resolve file path encoding issue in read_requirement skill
docs: update README with installation instructions
refactor: simplify skill executor logic
```

---

## 🔀 Pull Request 流程

### PR 要求

1. **标题清晰**
   - 使用提交规范格式
   - 例如：`feat: add new skill registration system`

2. **描述完整**
   ```markdown
   ## 描述
   简要描述此 PR 的目的

   ## 相关 Issue
   Fixes #123

   ## 改动
   - 添加了...
   - 修改了...
   - 删除了...

   ## 测试
   - [x] 添加了单元测试
   - [x] 手动测试通过
   - [ ] 需要额外测试

   ## 截图（如适用）
   添加 UI 变动的截图
   ```

3. **代码质量**
   - 通过所有测试：`npm test`
   - 代码格式检查：`npm run lint`
   - 无 TypeScript 错误（如适用）

4. **文档更新**
   - 更新 README.md（如适用）
   - 添加/更新 JSDoc 注释
   - 更新 CHANGELOG.md（重大改动）

### 审查流程

1. **自动检查**
   - CI/CD 流水线运行
   - 代码质量检查
   - 测试覆盖率

2. **Maintainer 审查**
   - 代码审查
   - 功能验证
   - 提出改进建议

3. **合并**
   - 审查通过后合并
   - 关闭相关 Issue
   - 更新版本标签

---

## 🧪 测试

### 运行测试

```bash
# 所有测试
npm test

# 特定测试
npm run test:workflow
npm run test:performance
```

### 添加测试

在 `test/` 目录下添加测试文件：

```javascript
// test/example.test.js
import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
```

---

## 📚 代码风格指南

### JavaScript/TypeScript

- 使用 ES6+ 语法
- 使用 JSDoc 注释
- 遵循 Airbnb JavaScript Style Guide

### 示例

```javascript
/**
 * 技能执行器
 * 负责管理和执行所有注册的技能
 */
export class SkillExecutor {
  constructor() {
    this.skills = new Map();
    this.initialized = false;
  }

  /**
   * 注册技能
   * @param {string} name - 技能名称
   * @param {Skill} instance - 技能实例
   * @returns {boolean} 是否成功
   */
  registerSkill(name, instance) {
    if (!name || !instance) {
      console.error('[SkillExecutor] 注册失败');
      return false;
    }
    // ...
  }
}
```

---

## 🎯 贡献领域

我们欢迎以下类型的贡献：

### 核心功能
- 新技能开发
- AI 模型优化
- 工作流引擎改进

### 文档
- 翻译文档
- 补充示例
- 修复拼写错误

### 测试
- 单元测试
- 集成测试
- 性能测试

### UI/UX
- 界面优化
- 用户体验改进
- 响应式设计

### Bug 修复
- 报告 Bug
- 修复现有 Bug

---

## 🤔 常见问题

### Q: 如何开始第一次贡献？

A: 从 [Good First Issues](https://github.com/kunmao-4869/openclaw-commander-pro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 开始，这些是专门为新手准备的。

### Q: 我的 PR 多久会被审查？

A: 通常在 1-3 个工作日内。如果超过一周没有回应，请 @mention maintainer。

### Q: 如何联系社区？

A: 通过 GitHub Discussions 或 Issues。

---

## 🙏 致谢

感谢所有为 OpenClaw Commander Pro 做出贡献的开发者！

<a href="https://github.com/kunmao-4869/openclaw-commander-pro/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kunmao-4869/openclaw-commander-pro" />
</a>

---

**最后，再次感谢您的贡献！🎊**
