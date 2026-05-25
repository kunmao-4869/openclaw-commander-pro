# 智能工作流系统 - 快速参考卡片

## 🚀 启动方式

```bash
node terminal-agent.js
```

---

## 💬 常用命令

### 创建项目

```
创建一个 HarmonyOS 项目
创建一个 Unreal Engine 游戏
创建一个 Python 工具
创建一个 React 应用
创建一个工作流项目
```

### 学习管理

```
学习 https://url 并保存到 studying
在 studying 中搜索 ArkTS 代码
查看 studying 文件夹内容
```

### 资源管理

```
检查 img 文件夹配置
查看图片资源
```

---

## 📁 文件夹结构

```
ProjectName/
├── studying/        # 📚 学习文件夹
│   ├── LEARNING_GUIDE.md
│   ├── doc_xxx.md   # 学习文档
│   └── examples/    # 示例代码
├── project/         # 💻 工程文件夹
│   └── (项目代码)
├── img/            # 🖼️ 图片文件夹
│   └── README.md   # 配置说明
└── docs/           # 📄 文档文件夹
```

---

## 🎯 项目类型

| 类型 | 关键词 | 根目录 |
|------|--------|--------|
| HarmonyOS | harmonyos, 鸿蒙，arkts | HarmonyOS/ |
| Unreal | unreal, ue5, ue4, 游戏 | UE_Project/ |
| Python | python, py, 脚本 | Python_Project/ |
| React | react, 前端，web | React_App/ |
| 自定义 | 其他 | Project/ |

---

## 🔧 技能列表

| 技能 | 功能 | 参数 |
|------|------|------|
| create_workflow_project | 创建智能工作流项目 | projectName, requirement, projectType |
| save_to_studying | 保存学习文档 | url, content |
| search_studying_code | 检索学习代码 | query |
| check_img_resources | 检查图片资源 | - |

---

## 📊 完整工作流

```
1. 创建项目 → create_workflow_project
2. 学习文档 → save_to_studying
3. 检索代码 → search_studying_code
4. 编写项目 → (在 project 文件夹中创建)
5. 管理图片 → check_img_resources
```

---

## 📖 示例对话

### 示例 1：HarmonyOS 项目开发

```
👤 用户：创建一个 HarmonyOS 项目
🤖 系统：✅ 项目创建成功
          - studying/ (学习文件夹)
          - project/ (工程文件夹)
          - img/ (图片文件夹)

👤 用户：学习 https://developer.harmonyos.com 并保存到 studying
🤖 系统：✅ 学习文档已保存
          📄 studying/doc_xxx.md

👤 用户：在 studying 中搜索 ArkTS 示例
🤖 系统：✅ 找到 1 个相关文档
          📄 doc_xxx.md

👤 用户：基于学习的代码，创建首页组件
🤖 系统：✅ 代码已保存到 project/pages/Index.ets
```

### 示例 2：Unreal 游戏开发

```
👤 用户：创建一个 Unreal Engine 游戏项目
🤖 系统：✅ 项目创建成功
          类型：Unreal Engine 游戏
          文件夹：studying/, Source/, Content/

👤 用户：学习 C++ 游戏开发并保存
🤖 系统：✅ 学习文档已保存

👤 用户：搜索 GameMode 示例
🤖 系统：✅ 找到相关文档
```

---

## ⚡ 快捷键

- `help` - 显示帮助
- `clear` - 清空屏幕
- `history` - 查看历史
- `exit` - 退出程序

---

## 📚 相关文档

- [完整使用指南](./WORKFLOW_SYSTEM_GUIDE.md)
- [完成报告](./WORKFLOW_SYSTEM_COMPLETE.md)
- [终端代理指南](./TERMINAL_AGENT_GUIDE.md)

---

## 🎯 最佳实践

✅ **项目命名**：使用有意义的英文名称  
✅ **及时学习**：学习后立即保存到 studying  
✅ **代码检索**：编写前先检索示例  
✅ **图片规范**：按命名规则存放图片  
✅ **结构清晰**：保持文件夹整洁  

---

## 🔮 未来扩展

- [ ] 更多项目类型支持
- [ ] 自动代码迁移
- [ ] 智能代码补全
- [ ] 学习进度跟踪
- [ ] 团队协作支持

---

**快速开始**: `node terminal-agent.js`  
**详细文档**: `docs/WORKFLOW_SYSTEM_GUIDE.md`  
**测试脚本**: `test-workflow.js` / `demo-workflow.js`

---

**版本**: 1.0.0 | **更新时间**: 2026-04-27
