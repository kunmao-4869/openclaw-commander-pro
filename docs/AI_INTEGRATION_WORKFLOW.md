# AI 集成工作流使用指南

## 🚀 什么是 AI 集成工作流？

AI 集成工作流是一个**智能代码生成系统**，可以：
1. 📖 读取学习文档，提取知识点
2. 🤖 使用 AI 模板生成相关代码
3. 💻 自动在 IDE 中创建文件并写入代码
4. 📄 生成项目文档（README）

## 🎯 支持的代码模板

### 1. TypeScript 类
生成完整的 TypeScript 类，包含：
- 类定义和构造函数
- 状态管理
- 方法实现
- 使用示例

**示例**:
```javascript
await workflow.executeWorkflow({
  templateType: 'typescript-class',
  templateOptions: {
    name: 'UserService',
    methods: ['create', 'update', 'delete', 'findById']
  }
});
```

### 2. HarmonyOS 组件
生成 ArkTS 组件，包含：
- @Component 装饰器
- @State 状态变量
- 生命周期方法
- UI 构建

**示例**:
```javascript
await workflow.executeWorkflow({
  templateType: 'harmonyos-component',
  templateOptions: {
    name: 'WeatherCard'
  }
});
```

### 3. React 组件
生成 React 函数组件，包含：
- Hooks (useState)
- 事件处理
- JSX 结构
- 样式

**示例**:
```javascript
await workflow.executeWorkflow({
  templateType: 'react-component',
  templateOptions: {
    name: 'TodoList'
  }
});
```

### 4. Node.js 服务器
生成 HTTP 服务器，包含：
- 路由处理
- API 端点
- 错误处理
- package.json

**示例**:
```javascript
await workflow.executeWorkflow({
  templateType: 'nodejs-server',
  templateOptions: {
    name: 'RestAPI',
    port: 3000
  }
});
```

## 📝 使用方法

### 方法 1: 快速启动

```bash
# 运行快速启动脚本
node demo-ai-workflow.js
```

### 方法 2: 使用示例脚本

```bash
# 运行示例（需要先取消注释）
node examples/ai-workflow-examples.js
```

### 方法 3: 自定义代码

```javascript
import AIIntegrationWorkflow from './src/workflow/AIIntegrationWorkflow.js';

const workflow = new AIIntegrationWorkflow();

// 自定义代码
workflow.generatedCode = {
  name: '我的项目',
  files: [
    {
      filename: 'main.ts',
      content: 'console.log("Hello");'
    }
  ]
};

// 在 IDE 中创建
await workflow.createFilesInIDE();
```

## 🔧 完整工作流示例

### 示例 1: 创建 TypeScript 服务类

```javascript
import AIIntegrationWorkflow from './src/workflow/AIIntegrationWorkflow.js';

async function createService() {
  const workflow = new AIIntegrationWorkflow();
  
  await workflow.executeWorkflow({
    templateType: 'typescript-class',
    templateOptions: {
      name: 'ProductService',
      methods: [
        'getAll',
        'getById',
        'create',
        'update',
        'delete',
        'search'
      ]
    },
    generateDoc: true
  });
}

createService();
```

**生成的文件**:
- `ProductService.ts` - 服务类
- `index.ts` - 入口文件
- `README.md` - 项目文档

### 示例 2: 创建 HarmonyOS 应用

```javascript
async function createHarmonyOSApp() {
  const workflow = new AIIntegrationWorkflow();
  
  await workflow.executeWorkflow({
    templateType: 'harmonyos-component',
    templateOptions: {
      name: 'NewsCard',
      type: 'ets'
    },
    generateDoc: true
  });
}

createHarmonyOSApp();
```

**生成的文件**:
- `NewsCard.ets` - 组件
- `pages/Index.ets` - 主页面
- `README.md` - 项目文档

### 示例 3: 创建完整项目

```javascript
async function createFullProject() {
  const workflow = new AIIntegrationWorkflow();
  
  // 1. 生成服务器
  await workflow.executeWorkflow({
    templateType: 'nodejs-server',
    templateOptions: {
      name: 'BlogAPI',
      port: 8080
    }
  });
  
  // 2. 生成前端组件
  await workflow.executeWorkflow({
    templateType: 'react-component',
    templateOptions: {
      name: 'BlogPost'
    }
  });
}

createFullProject();
```

## 💡 实际应用场景

### 场景 1: 从学习文档生成代码

```javascript
const workflow = new AIIntegrationWorkflow();

// 1. 加载学习文档
await workflow.loadLearningDocument('harmonyos-guides.md');

// 2. 分析文档
const analysis = workflow.analyzeDocument();

// 3. 根据分析结果生成代码
await workflow.generateCodeFromTemplate('harmonyos-component', {
  name: analysis.topics[0]
});

// 4. 在 IDE 中创建
await workflow.createFilesInIDE();
```

### 场景 2: 批量生成 CRUD 操作

```javascript
const entities = ['User', 'Product', 'Order', 'Category'];

for (const entity of entities) {
  await workflow.executeWorkflow({
    templateType: 'typescript-class',
    templateOptions: {
      name: `${entity}Service`,
      methods: ['create', 'read', 'update', 'delete']
    }
  });
}
```

### 场景 3: 生成测试代码

```javascript
await workflow.executeWorkflow({
  templateType: 'typescript-class',
  templateOptions: {
    name: 'UserServiceTest',
    methods: ['testCreate', 'testUpdate', 'testDelete']
  }
});
```

## 🎮 运行步骤

### 步骤 1: 准备 IDE
确保已打开一个支持的 IDE：
- DevEco Studio
- IntelliJ IDEA
- VS Code
- PyCharm
- WebStorm

### 步骤 2: 运行脚本

```bash
node demo-ai-workflow.js
```

### 步骤 3: 查看结果

脚本会自动：
1. ✅ 连接 IDE
2. ✅ 创建文件
3. ✅ 写入代码
4. ✅ 格式化
5. ✅ 保存

### 步骤 4: 在 IDE 中查看

在 IDE 中查看生成的文件，运行测试。

## 📊 工作流程图

```
开始
  ↓
选择模板类型
  ↓
生成代码 (AI 模板)
  ↓
连接 IDE
  ↓
创建文件
  ↓
写入代码
  ↓
格式化
  ↓
保存
  ↓
生成文档
  ↓
完成
```

## 🔍 故障排除

### 问题 1: 未检测到 IDE
**解决**:
- 确保 IDE 已打开
- 检查 IDE 进程是否运行
- 尝试手动指定 IDE：`connectToIDE('vscode')`

### 问题 2: 文件创建失败
**解决**:
- 检查 IDE 窗口是否可见
- 确保有写入权限
- 增加延迟时间

### 问题 3: 代码格式不正确
**解决**:
- 检查模板代码格式
- 确保 IDE 格式化功能正常
- 手动格式化一次

## 📚 相关文档

- [UNIVERSAL_IDE_AUTOMATION.md](./UNIVERSAL_IDE_AUTOMATION.md) - IDE 自动化指南
- [HOW_TO_WRITE_CODE.md](./HOW_TO_WRITE_CODE.md) - 代码编写指南
- [SUPPORTED_IDES.md](./SUPPORTED_IDES.md) - 支持的 IDE 列表

## 🎓 最佳实践

1. **先测试小例子** - 从简单模板开始
2. **逐步扩展** - 成功后再创建复杂项目
3. **自定义模板** - 根据需求修改模板
4. **保存模板** - 将常用模板保存
5. **版本控制** - 使用 Git 管理生成的代码

## 🚀 下一步

- [ ] 添加更多模板类型
- [ ] 集成真实 AI API
- [ ] 支持从 URL 学习
- [ ] 添加代码审查功能
- [ ] 支持多文件项目结构

---

*最后更新：2026-04-15*
