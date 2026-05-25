# Planning With Files Skill

## 元数据

- **名称**: Planning With Files（文件化项目规划）
- **版本**: 1.0.0
- **分类**: 办公与知识管理
- **触发关键词**: 项目规划，文件持久化，跨 Session, 进度跟踪
- **优先级**: 中

## 描述

大项目救星。能实现项目规划的持久化，跨 Session 不丢进度。如果你经常处理大项目，它能解决 AI 遗忘上下文的问题，不用反复复盘进度。

## 核心价值

**问题**: AI 记不住 long-running 项目的上下文
**解决**: 用文件持久化项目状态，AI 每次读取最新进度

## 文件结构

```
project-name/
├── .project-state.json    # 项目状态
├── plans/                 # 规划文档
│   ├── roadmap.md
│   ├── milestones.md
│   └── tasks.md
├── decisions/             # 决策记录
│   ├── adr-001.md
│   └── adr-002.md
├── meeting-notes/         # 会议记录
└── progress/              # 进度报告
```

## 使用流程

1. **项目启动**: 创建项目状态文件
2. **每次对话**: AI 读取最新状态
3. **任务完成**: 更新进度文件
4. **决策记录**: 保存重要决策
5. **定期回顾**: 生成进度报告

## 相关文件

- `scripts/project-state-manager.py` - 项目状态管理
- `templates/project-template/` - 项目模板
