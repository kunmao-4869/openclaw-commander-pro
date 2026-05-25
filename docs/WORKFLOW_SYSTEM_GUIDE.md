# 智能工作流管理系统 v1.0

## 📋 系统简介

智能工作流管理系统是一个**项目工程化管理工具**，可以根据项目类型自动组织文件夹结构、管理学习资源和工程代码。

### 核心特性

1. **智能项目识别** - 自动分析项目类型（HarmonyOS、Unreal、Python、React 等）
2. **标准文件夹结构** - 自动创建 studying、project、img 等文件夹
3. **学习文档管理** - 将学习的内容自动保存到 studying 文件夹
4. **代码检索机制** - 优先检索 studying 中的示例代码
5. **图片资源管理** - 自动生成图片配置和使用说明
6. **工程化开发流程** - 从学习到项目的完整工作流

---

## 🎯 项目类型支持

### 1. HarmonyOS 应用开发
- **关键词**: harmonyos, 鸿蒙，arkts, arkui, hap
- **文件夹结构**:
  ```
  HarmonyOS/
  ├── studying/        # 学习文档和示例代码
  ├── project/         # 项目工程代码
  ├── img/            # 图片资源
  └── docs/           # 项目文档
  ```

### 2. Unreal Engine 游戏开发
- **关键词**: unreal, ue5, ue4, 游戏，game, c++, blueprint
- **文件夹结构**:
  ```
  UE_Project/
  ├── studying/        # 学习文档和示例代码
  ├── Source/         # 项目源代码
  ├── Documentation/Images/  # 图片资源
  └── Content/        # 游戏内容
  ```

### 3. Python 应用开发
- **关键词**: python, py, 脚本，自动化，数据分析
- **文件夹结构**:
  ```
  Python_Project/
  ├── studying/        # 学习文档和示例代码
  ├── src/            # 项目源代码
  ├── assets/images/  # 图片资源
  └── tests/          # 测试代码
  ```

### 4. React Web 应用
- **关键词**: react, 前端，web, javascript, typescript
- **文件夹结构**:
  ```
  React_App/
  ├── studying/        # 学习文档和示例代码
  ├── src/            # 项目源代码
  ├── public/images/  # 图片资源
  └── src/components/ # 组件目录
  ```

### 5. 自定义项目
- **关键词**: 其他未识别的项目类型
- **文件夹结构**:
  ```
  Project/
  ├── studying/        # 学习文档和示例代码
  ├── src/            # 项目源代码
  ├── assets/         # 资源文件
  └── docs/           # 项目文档
  ```

---

## 🚀 快速开始

### 方式 1：使用终端界面（推荐）

1. **启动终端代理**
   ```bash
   node terminal-agent.js
   ```

2. **创建智能工作流项目**
   ```
   创建一个 HarmonyOS 项目
   ```

3. **学习并保存文档**
   ```
   学习 https://developer.harmonyos.com/cn/docs 并保存到 studying
   ```

4. **检索学习代码**
   ```
   在 studying 中搜索 ArkTS 示例代码
   ```

5. **检查图片资源**
   ```
   查看 img 文件夹配置
   ```

### 方式 2：使用技能 API

```javascript
import ProjectWorkflowManager from './src/skills/advanced/ProjectWorkflowManager.js';

const workflowManager = new ProjectWorkflowManager();

// 1. 创建项目
const project = await workflowManager.createOrSelectProject(
  'HarmonyOS_Demo',
  '创建一个 HarmonyOS 鸿蒙应用，学习 ArkTS 开发'
);

// 2. 保存学习文档
await workflowManager.saveLearningDoc(
  project.name,
  'https://developer.harmonyos.com/cn/docs',
  learningResult
);

// 3. 检索代码
const searchResult = await workflowManager.searchInStudying('ArkTS');

// 4. 检查图片资源
const imgResult = await workflowManager.checkImgResources();
```

---

## 📖 完整工作流示例（以 HarmonyOS 为例）

### 步骤 1：创建项目文件夹结构

**用户输入**：
```
创建一个 HarmonyOS 文件夹，进入该文件夹，创建一个 studying 文件夹和 project 文件夹
```

**系统执行**：
```bash
📊 项目分析:
   类型：HarmonyOS 应用
   置信度：90.0%

✅ 项目创建成功：HarmonyOS_Demo
   根目录：F:\openclaw\projects\HarmonyOS\HarmonyOS_Demo
   
   文件夹结构:
   - root: HarmonyOS/
   - studying: studying/
   - project: project/
   - img: img/
   - docs: docs/
```

**实际创建的文件夹**：
```
F:\openclaw\projects\HarmonyOS\HarmonyOS_Demo/
├── studying/              # 学习文件夹
│   └── LEARNING_GUIDE.md  # 学习指南
├── project/               # 项目文件夹
│   └── hvigorfile.ts     # 项目配置
├── img/                   # 图片资源文件夹
│   └── README.md         # 图片配置说明
└── docs/                  # 文档文件夹
```

---

### 步骤 2：学习鸿蒙开发文档

**用户输入**：
```
学习 https://developer.harmonyos.com/cn/docs 并将学习文档保存到 studying 文件夹
```

**系统执行**：
```bash
📚 正在学习网页：https://developer.harmonyos.com/cn/docs
✅ 学习完成，提取了 5 个代码示例
📝 正在写入文件：studying/doc_1234567890.md
✅ 学习文档已保存：doc_1234567890.md
```

**生成的学习文档**：
```markdown
# 学习文档

## 来源
URL: https://developer.harmonyos.com/cn/docs
学习时间：2026-04-27T10:00:00.000Z

## 内容摘要

ArkTS 是 HarmonyOS 的开发语言，基于 TypeScript 扩展...

## 示例代码

### 代码示例 1

```typescript
@Entry
@Component
struct Index {
  @State message: string = 'Hello World';

  build() {
    Column() {
      Text(this.message)
        .fontSize(50)
        .fontWeight(FontWeight.Bold)
    }
  }
}
```

## 关键知识点

- ArkTS 基于 TypeScript
- 使用装饰器定义组件
- 声明式 UI 开发
```

---

### 步骤 3：检索学习代码

**用户输入**：
```
在 studying 文件夹中搜索 ArkTS 示例代码
```

**系统执行**：
```bash
🔍 正在 studying 文件夹中搜索：ArkTS
✅ 找到 1 个相关文档
   1. doc_1234567890.md
```

**系统逻辑**：
1. 遍历 studying 文件夹中的所有文档
2. 搜索包含关键词的内容
3. 返回匹配的文件列表和预览

---

### 步骤 4：在 project 文件夹中创建项目代码

**用户输入**：
```
基于学习的 ArkTS 代码，在 project 文件夹中创建首页组件
```

**系统执行**：
```bash
🤖 正在生成代码：基于学习的 ArkTS 代码创建首页组件
📝 正在写入文件：project/pages/Index.ets
✅ 文件已保存：project/pages/Index.ets
```

**生成的项目代码**：
```typescript
// project/pages/Index.ets
@Entry
@Component
struct Index {
  @State message: string = 'Hello HarmonyOS';

  build() {
    Column() {
      Text(this.message)
        .fontSize(50)
        .fontWeight(FontWeight.Bold)
        .fontColor('#007DFF')
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }
}
```

---

### 步骤 5：管理图片资源

**用户输入**：
```
检查图片资源配置
```

**系统执行**：
```bash
🖼️  正在检查图片资源...
✅ 图片文件夹：F:\openclaw\projects\HarmonyOS\HarmonyOS_Demo\img
   图片数量：0
   有配置文件：✅
⚠️  暂无图片，请参考 img/README.md 添加图片
```

**生成的图片配置说明**（`img/README.md`）：
```markdown
# 图片资源管理指南

## 📁 目录说明

本目录用于存放项目所需的所有图片资源。

## 📋 图片要求

### 1. 图片格式
- **推荐格式**: PNG, JPG, SVG
- **透明背景**: 使用 PNG 格式
- **矢量图标**: 使用 SVG 格式

### 2. 图片尺寸

#### HarmonyOS 应用图标
- 应用图标：512x512 px
- 通知栏图标：24x24 px
- 设置页图标：48x48 px

#### 通用图片
- 横幅图片：1920x480 px
- 卡片图片：400x300 px
- 头像图片：200x200 px

### 3. 命名规范
```
类型_用途_尺寸。格式
例如:
- icon_app_512.png
- banner_home_1920x480.jpg
- avatar_user_200.png
```

### 4. 风格要求
- **主色调**: 根据项目主题确定
- **风格**: 简洁现代 / 扁平化 / 拟物化
- **质量**: 高清，无压缩损失

## 📥 添加图片流程

1. 将图片放入此文件夹
2. 在下方记录图片信息
3. 系统会自动检测并更新代码引用

## 📝 已添加图片清单

| 文件名 | 用途 | 尺寸 | 添加时间 |
|--------|------|------|----------|
| (待添加) | - | - | - |

## 🔧 下一步

请用户将所需图片放入此文件夹，然后系统将：
1. 自动检测新图片
2. 更新代码中的图片引用
3. 生成图片预览和说明
```

---

## 🎯 终端技能命令

### 创建项目

```bash
# 创建 HarmonyOS 项目
创建一个 HarmonyOS 项目

# 创建 Unreal 项目
创建一个 Unreal Engine 游戏项目

# 创建 Python 项目
创建一个 Python 工具项目

# 创建 React 项目
创建一个 React 前端应用

# 创建工作流项目
创建一个工作流项目
```

### 学习管理

```bash
# 学习并保存
学习 https://url 并保存到 studying

# 检索代码
在 studying 中搜索 ArkTS 示例

# 查看学习文档
查看 studying 文件夹内容
```

### 资源管理

```bash
# 检查图片资源
检查 img 文件夹配置

# 查看图片
查看 img 文件夹中的图片
```

---

## 📊 技能列表

| 技能名称 | 描述 | 参数 |
|---------|------|------|
| `create_workflow_project` | 创建智能工作流项目 | projectName, requirement, projectType |
| `save_to_studying` | 保存学习文档到 studying 文件夹 | url, content |
| `search_studying_code` | 在 studying 文件夹中检索示例代码 | query |
| `check_img_resources` | 检查 img 文件夹中的图片资源 | - |

---

## 🔧 高级功能

### 1. 项目类型扩展

在 `ProjectWorkflowManager.js` 中添加新的项目类型：

```javascript
const PROJECT_TEMPLATES = {
  // 添加新的项目类型
  my_custom_type: {
    name: '我的自定义类型',
    description: '描述信息',
    folders: {
      root: 'MyProject',
      studying: 'studying',
      project: 'src',
      img: 'assets'
    },
    files: {
      imgConfig: 'assets/README.md',
      projectConfig: 'src/index.js',
      studyingGuide: 'studying/GUIDE.md'
    },
    keywords: ['关键词 1', '关键词 2'],
    extensions: ['.js', '.ts', '.md']
  }
};
```

### 2. 自定义学习路径

在 `studying/LEARNING_GUIDE.md` 中定义学习路径：

```markdown
## 📖 学习路径

### 第一阶段：基础知识
- [ ] 了解基本概念
- [ ] 学习开发环境配置
- [ ] 掌握基础语法

### 第二阶段：核心功能
- [ ] 学习核心 API
- [ ] 实践示例代码
- [ ] 理解最佳实践

### 第三阶段：项目实战
- [ ] 分析项目需求
- [ ] 设计项目架构
- [ ] 编写项目代码
```

### 3. 代码检索优化

系统会自动：
1. 优先检索 studying 文件夹
2. 分析代码结构和用法
3. 提取可复用的代码片段
4. 在 project 文件夹中应用

---

## 🎨 最佳实践

### 1. 项目命名
- 使用有意义的英文名称
- 避免空格和特殊字符
- 使用下划线或连字符分隔

### 2. 学习文档
- 及时保存学习的内容
- 添加关键知识点标注
- 整理示例代码片段

### 3. 图片资源
- 按照命名规范命名文件
- 记录图片用途和尺寸
- 定期清理无用图片

### 4. 代码组织
- studying 文件夹：学习示例、参考代码
- project 文件夹：正式项目代码
- 保持文件夹结构清晰

---

## 📚 相关文档

- [终端代理使用指南](./TERMINAL_AGENT_GUIDE.md)
- [技能系统架构](./SKILL_SYSTEM_ARCHITECTURE.md)
- [项目创建系统](./PROJECT_CREATOR_V1.md)

---

## 🚀 未来计划

- [ ] 支持更多项目类型模板
- [ ] 自动代码迁移（从 studying 到 project）
- [ ] 智能代码补全和建议
- [ ] 项目进度跟踪
- [ ] 团队协作支持
- [ ] 云端同步

---

**版本**: 1.0.0  
**更新时间**: 2026-04-27  
**作者**: Commander Pro Team
