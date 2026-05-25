# 智能工作流管理系统 - 完整调用方式指南

## 📋 概述

智能工作流管理系统提供 **4 种调用方式**，适用于不同的使用场景。

---

## 🎯 调用方式对比

| 方式 | 适用场景 | 难度 | 灵活性 |
|------|---------|------|--------|
| 终端界面 | 个人快速开发 | ⭐ | ⭐⭐⭐⭐ |
| Web 界面 | 可视化操作、团队协作 | ⭐ | ⭐⭐⭐⭐⭐ |
| JavaScript API | 集成到其他项目 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 工作流编排 | 复杂任务、批量处理 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 方式 1：终端界面调用（最简单）

### 适用场景
- ✅ 个人快速开发
- ✅ 自然语言交互
- ✅ 命令行爱好者

### 使用方式

```bash
# 1. 启动终端
node terminal-agent.js

# 2. 自然语言对话
创建一个 HarmonyOS 项目
学习 https://url 并保存到 studying
在 studying 中搜索 ArkTS 代码
检查图片资源配置
```

### 优点
- 🎯 最简单的使用方式
- 💬 自然语言交互
- ⚡ 快速执行

### 缺点
- 🖥️ 需要命令行环境
- 📝 不支持可视化操作

---

## 方式 2：Web 界面调用（推荐）

### 适用场景
- ✅ 可视化操作
- ✅ 团队协作
- ✅ 不熟悉命令行的用户
- ✅ 需要图形化界面展示

### 使用方式

#### 步骤 1：启动 Web 服务器

```bash
# 使用 Node.js 简单服务器
npx http-server ./commander-pro -p 8080

# 或使用 Python
cd commander-pro
python -m http.server 8080
```

#### 步骤 2：打开浏览器

访问：`http://localhost:8080/web-interface.html`

#### 步骤 3：图形化操作

界面包含：
- 🏗️ **项目创建面板** - 填写表单创建项目
- 📚 **学习管理面板** - 学习文档、检索代码
- 📊 **项目状态面板** - 实时显示项目信息
- 📝 **操作日志面板** - 查看所有操作记录
- ⚡ **快速操作按钮** - 一键创建常见项目

### 界面功能

#### 1. 创建项目
- 输入项目名称
- 选择项目类型（HarmonyOS/Unreal/Python/React）
- 填写需求描述
- 点击"创建智能工作流项目"

#### 2. 学习管理
- 输入学习网页 URL
- 点击"学习并保存到 studying"
- 输入关键词检索代码
- 点击"检索 studying 代码"

#### 3. 资源管理
- 查看项目状态
- 检查图片资源
- 查看文件夹结构

#### 4. 快速操作
- 📱 HarmonyOS 项目 - 一键创建
- 🎮 Unreal 游戏 - 一键创建
- 🐍 Python 工具 - 一键创建
- ⚛️ React 应用 - 一键创建

### 优点
- 🎨 美观的图形界面
- 👥 适合团队协作
- 📊 实时状态展示
- 🖱️ 点击式操作

### 缺点
- 🌐 需要启动 Web 服务器
- 🔧 需要浏览器环境

---

## 方式 3：JavaScript API 调用

### 适用场景
- ✅ 集成到其他项目
- ✅ 自动化脚本
- ✅ 自定义工作流
- ✅ 批量处理

### 使用方式

#### 基础示例

```javascript
import ProjectWorkflowManager from './src/skills/advanced/ProjectWorkflowManager.js';

// 1. 创建管理器实例
const workflowManager = new ProjectWorkflowManager({
  baseDir: './projects'
});

// 2. 创建项目
const project = await workflowManager.createOrSelectProject(
  'HarmonyOS_Demo',
  '开发一个 HarmonyOS 应用，学习 ArkTS 和 ArkUI'
);

console.log('项目已创建:', project.name);
console.log('项目类型:', project.type);
console.log('根目录:', project.rootDir);

// 3. 保存学习文档
const learningResult = {
  learningDoc: '# ArkTS 学习文档\n...',
  codeBlocks: [
    {
      language: 'typescript',
      code: '@Entry\n@Component\nstruct Index {...}',
      length: 12
    }
  ],
  summary: {
    keyPoints: ['ArkTS 基于 TypeScript', '使用装饰器']
  }
};

await workflowManager.saveLearningDoc(
  project.name,
  'https://developer.harmonyos.com',
  learningResult
);

// 4. 检索学习代码
const searchResult = await workflowManager.searchInStudying('@Entry');
console.log('找到', searchResult.total, '个相关文档');

// 5. 检查图片资源
const imgResult = await workflowManager.checkImgResources();
console.log('图片文件夹:', imgResult.imgDir);
console.log('图片数量:', imgResult.totalImages);
```

#### 进阶示例：批量创建项目

```javascript
// 批量创建多个项目
const projects = [
  { name: 'HarmonyOS_App1', type: 'harmonyos', requirement: '应用 1' },
  { name: 'HarmonyOS_App2', type: 'harmonyos', requirement: '应用 2' },
  { name: 'UE_Game1', type: 'unreal', requirement: '游戏 1' }
];

for (const proj of projects) {
  const project = await workflowManager.createOrSelectProject(
    proj.name,
    proj.requirement
  );
  console.log(`✅ ${proj.name} 创建成功`);
}
```

#### 集成到现有系统

```javascript
// 在现有系统中调用
class MyApplication {
  async createProject(name, type) {
    const workflowManager = new ProjectWorkflowManager();
    
    // 创建项目
    const project = await workflowManager.createOrSelectProject(name, type);
    
    // 集成到你的系统
    this.projects.push(project);
    this.notifyUser(`项目 ${project.name} 已创建`);
    
    return project;
  }
  
  async learnFromUrl(url) {
    // 学习网页
    const learningResult = await this.fetchAndParse(url);
    
    // 保存到 studying
    await workflowManager.saveLearningDoc(
      this.currentProject.name,
      url,
      learningResult
    );
  }
}
```

### API 完整参考

#### ProjectWorkflowManager

```javascript
// 构造函数
const manager = new ProjectWorkflowManager(options);

// options 配置
{
  baseDir: './projects'  // 项目根目录
}

// 方法
await manager.createOrSelectProject(projectName, requirement);
await manager.saveLearningDoc(projectName, url, learningResult);
await manager.searchInStudying(query);
await manager.checkImgResources();
const status = manager.getProjectStatus();
const analysis = manager.analyzeProjectType(requirement);
```

### 优点
- 🔌 灵活集成
- 🤖 自动化处理
- 📦 可打包为库
- ⚙️ 完全控制

### 缺点
- 💻 需要编程知识
- 🔧 需要配置环境

---

## 方式 4：工作流编排调用

### 适用场景
- ✅ 复杂任务
- ✅ 多步骤流程
- ✅ 批量处理
- ✅ 定时任务

### 使用方式

#### 完整工作流示例

```javascript
import ProjectWorkflowManager from './src/skills/advanced/ProjectWorkflowManager.js';
import { LearnWebpageSkill } from './src/skills/learning/LearnWebpage.js';

class WorkflowOrchestrator {
  constructor() {
    this.workflowManager = new ProjectWorkflowManager();
    this.learnSkill = new LearnWebpageSkill();
  }
  
  // 完整开发流程
  async fullDevelopmentFlow(projectName, urls, requirements) {
    console.log('🚀 开始完整开发流程');
    
    // 步骤 1: 创建项目
    console.log('📁 步骤 1: 创建项目');
    const project = await this.workflowManager.createOrSelectProject(
      projectName,
      requirements
    );
    
    // 步骤 2: 学习所有文档
    console.log('📚 步骤 2: 学习文档');
    for (const url of urls) {
      console.log(`  学习：${url}`);
      const result = await this.learnSkill.execute({ url });
      await this.workflowManager.saveLearningDoc(
        project.name,
        url,
        result
      );
    }
    
    // 步骤 3: 检索关键代码
    console.log('🔍 步骤 3: 检索关键代码');
    const keywords = this.extractKeywords(requirements);
    for (const keyword of keywords) {
      const searchResult = await this.workflowManager.searchInStudying(keyword);
      console.log(`  ${keyword}: ${searchResult.total} 个结果`);
    }
    
    // 步骤 4: 检查资源
    console.log('🖼️  步骤 4: 检查资源');
    const imgResult = await this.workflowManager.checkImgResources();
    console.log(`  图片：${imgResult.totalImages} 张`);
    
    // 步骤 5: 生成报告
    console.log('📊 步骤 5: 生成报告');
    this.generateReport(project);
    
    console.log('✅ 开发流程完成');
    return project;
  }
  
  extractKeywords(requirement) {
    // 从需求中提取关键词
    return ['@Entry', '@Component', '@State'];
  }
  
  generateReport(project) {
    // 生成项目报告
    console.log('项目报告生成中...');
  }
}

// 使用示例
const orchestrator = new WorkflowOrchestrator();
await orchestrator.fullDevelopmentFlow(
  'HarmonyOS_Demo',
  [
    'https://developer.harmonyos.com/docs/1',
    'https://developer.harmonyos.com/docs/2',
    'https://developer.harmonyos.com/docs/3'
  ],
  '开发一个 HarmonyOS 应用'
);
```

### 优点
- 🔄 自动化完整流程
- 📋 多步骤编排
- ⏰ 可定时执行
- 📊 批量处理

### 缺点
- 🧩 复杂度较高
- 📝 需要编写编排逻辑

---

## 🎯 选择建议

### 个人开发者
- **推荐**: 终端界面
- **理由**: 简单快速，自然语言交互

### 团队项目
- **推荐**: Web 界面
- **理由**: 可视化操作，适合协作

### 集成开发
- **推荐**: JavaScript API
- **理由**: 灵活集成，完全控制

### 自动化任务
- **推荐**: 工作流编排
- **理由**: 批量处理，定时执行

---

## 📖 快速开始示例

### 5 分钟快速体验

```bash
# 方式 1：终端（最快）
node terminal-agent.js
# 输入：创建一个 HarmonyOS 项目

# 方式 2：Web 界面
npx http-server ./commander-pro -p 8080
# 浏览器打开：http://localhost:8080/web-interface.html

# 方式 3：API 调用
node -e "
import('./src/skills/advanced/ProjectWorkflowManager.js').then(async ({ default: Manager }) => {
  const m = new Manager();
  const p = await m.createOrSelectProject('Test', '测试项目');
  console.log('项目已创建:', p.name);
});
"
```

---

## 🔗 相关资源

- [终端使用指南](./TERMINAL_AGENT_GUIDE.md)
- [完整系统文档](./WORKFLOW_SYSTEM_GUIDE.md)
- [API 参考文档](./API_REFERENCE.md)
- [Web 界面源码](./web-interface.html)

---

## 💡 最佳实践

### 1. 选择合适的调用方式
- 个人使用 → 终端
- 团队协作 → Web
- 集成开发 → API
- 批量处理 → 工作流

### 2. 组合使用
可以同时使用多种方式：
- 终端快速创建项目
- Web 界面查看状态
- API 自动化处理

### 3. 项目管理
- 为不同项目类型使用不同的调用方式
- 定期备份项目配置
- 使用版本控制管理代码

---

**版本**: 1.0.0  
**更新时间**: 2026-04-27  
**作者**: Commander Pro Team
