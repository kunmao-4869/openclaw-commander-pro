# GitHub Skill

## 元数据

- **名称**: GitHub 仓库管理
- **版本**: 1.0.0
- **分类**: 编程开发
- **触发关键词**: GitHub, Git, 仓库管理，Issue, PR, 代码提交
- **优先级**: 高

## 描述

代码仓库全能管理员。让 AI 直接操作 GitHub 仓库，比如创建 Issue、提交/审查 PR、搜索代码历史等。把许多需要在终端和网页间切换的操作转为自然语言对话。

## 能力范围

✅ **支持的操作**:
- 创建/管理 Issue
- 提交/审查 PR
- 代码搜索
- 分支管理
- Release 发布
- 项目看板管理
- Code Review
- 自动化工作流

## 常用命令

```bash
# 创建 Issue
github issue create --title "Bug: 登录失败" --label bug

# 创建 PR
github pr create --title "feat: 添加用户认证" --body "实现 OAuth 登录"

# 搜索代码
github search code "function login" --repo user/repo

# 查看 PR 状态
github pr status

# 合并 PR
github pr merge 123 --merge --delete-branch
```

## 相关文件

- `scripts/github-cli-wrapper.py` - GitHub CLI 封装
- `references/github-workflows.md` - GitHub 工作流指南
