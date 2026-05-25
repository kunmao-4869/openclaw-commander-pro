# 🔄 工作流系统使用指南

## 📋 什么是工作流？

**工作流** 是多个技能的有序组合，可以自动执行复杂任务。通过工作流，你可以：

- ✅ **自动化** - 一键执行多个步骤
- ✅ **条件分支** - 根据结果智能决策
- ✅ **并行处理** - 同时执行多个任务
- ✅ **错误处理** - 自动处理异常情况

---

## 🎯 已实现的工作流

### 1. 项目初始化工作流
**ID**: `project_init`  
**步骤**: 6 步  
**用途**: 自动初始化新项目结构

**流程**:
```
1. 检查目录
2. 创建目录结构 (src, public, tests, docs)
3. 创建 package.json
4. 安装依赖 (npm install)
5. 初始化 Git
6. 创建 .gitignore
```

**使用示例**:
```javascript
// 执行工作流
workflowEngine.executeWorkflow('project_init', {
  projectPath: './my-project',
  projectName: 'my-app'
})
```

---

### 2. 代码质量检查工作流
**ID**: `code_quality`  
**步骤**: 4 步  
**用途**: 自动执行代码质量检查

**流程**:
```
1. ESLint 检查
2. TypeScript 检查
3. 运行测试
4. 生成质量报告
```

---

### 3. 文件备份工作流
**ID**: `file_backup`  
**步骤**: 5 步  
**用途**: 自动备份重要文件

**流程**:
```
1. 检查源文件
2. 创建备份目录
3. 复制文件
4. 验证备份完整性
5. 压缩备份
```

---

### 4. 网络诊断工作流
**ID**: `network_diagnosis`  
**步骤**: 6 步  
**用途**: 自动诊断网络问题

**流程**:
```
1. Ping 网关 (192.168.1.1)
2. Ping DNS (8.8.8.8)
3. Ping 外网 (www.baidu.com)
4. 路由跟踪
5. 获取网络配置
6. 生成诊断报告
```

---

### 5. 智能助手工作流 ⭐
**ID**: `smart_assistant`  
**步骤**: 动态（带条件分支）  
**用途**: 根据任务类型智能选择执行路径

**流程**:
```
1. 分析用户任务
   ↓
2. 判断任务类型
   ├─ 文件操作 → 执行文件操作
   ├─ 网络操作 → 执行网络操作
   └─ 其他 → 执行一般查询
```

**特点**:
- ✅ 条件分支
- ✅ 智能路由
- ✅ 动态决策

---

### 6. 数据分析工作流
**ID**: `data_analysis`  
**步骤**: 5 步  
**用途**: 自动分析数据并生成报告

**流程**:
```
1. 读取数据
2. 数据清洗（去重、去空）
3. 数据分析（统计指标）
4. 数据可视化（图表）
5. 生成分析报告
```

---

## 🛠️ 如何创建工作流

### 方法 1: 使用 WorkflowBuilder（推荐）

```javascript
import { WorkflowBuilder } from './workflow/WorkflowEngine'

const workflow = new WorkflowBuilder('my_workflow', '我的工作流')
  .withDescription('描述我的工作流功能')
  
  // 步骤 1: 检查文件
  .addAction('检查文件', 'check_file', {
    path: './data.txt'
  })
  
  // 步骤 2: 读取文件
  .addAction('读取文件', 'read_file', {
    path: './data.txt'
  })
  
  // 步骤 3: 处理数据
  .addAction('处理数据', 'process_data', {
    data: '{{read_file.content}}'  // 引用上一步的输出
  })
  
  // 步骤 4: 等待 1 秒
  .addWait(1000)
  
  // 步骤 5: 保存结果
  .addAction('保存结果', 'write_file', {
    path: './result.txt',
    content: '{{process_data.result}}'
  })
  
  .build()
```

---

### 方法 2: 手动创建步骤

```javascript
import { ActionStep, ConditionStep, WorkflowEngine } from './workflow/WorkflowEngine'

const workflow = {
  id: 'my_workflow',
  name: '我的工作流',
  description: '手动创建的工作流',
  startStep: 'step1',
  steps: new Map()
}

// 添加步骤
workflow.steps.set('step1', new ActionStep({
  id: 'step1',
  name: '第一步',
  action: 'check_file',
  params: { path: './data.txt' },
  onSuccess: 'step2',
  onFailure: 'error_handler'
}))

workflow.steps.set('step2', new ActionStep({
  id: 'step2',
  name: '第二步',
  action: 'read_file',
  params: { path: './data.txt' }
}))

// 注册并执行
const engine = new WorkflowEngine()
engine.registerWorkflow(workflow)
engine.executeWorkflow('my_workflow')
```

---

## 📊 工作流执行状态

### 状态类型
- **running** - 正在执行
- **completed** - 执行完成
- **failed** - 执行失败

### 监控执行

```javascript
// 获取执行状态
const status = engine.getExecutionStatus('workflow_id')

console.log(status)
// {
//   status: 'running',
//   context: {
//     currentStep: 'step2',
//     outputs: {...},
//     history: [...]
//   }
// }
```

---

## 🔧 高级功能

### 1. 参数引用

在工作流中引用之前步骤的输出：

```javascript
.addAction('步骤 2', 'action2', {
  input: '{{step1.output}}'  // 引用 step1 的输出
})
```

### 2. 条件分支

根据条件执行不同路径：

```javascript
.addCondition('是否成功', 
  (context) => context.outputs.step1.success,
  'success_path',  // 条件为 true 时的下一步
  'failure_path'   // 条件为 false 时的下一步
)
```

### 3. 并行执行

同时执行多个步骤：

```javascript
import { ParallelStep } from './workflow/WorkflowEngine'

const parallelStep = new ParallelStep({
  id: 'parallel',
  name: '并行执行',
  steps: [
    new ActionStep({ action: 'task1' }),
    new ActionStep({ action: 'task2' }),
    new ActionStep({ action: 'task3' })
  ]
})
```

### 4. 错误处理

```javascript
.addAction('危险操作', 'risky_operation', {
  params: {...},
  onSuccess: 'next_step',
  onFailure: 'error_handler'  // 失败时跳转到错误处理
})
```

---

## 🎯 在 UI 中使用

### 1. 访问工作流中心

在 Commander Pro 中：
1. 点击左侧边栏的 **工作流** 标签
2. 选择要执行的工作流
3. 点击 **执行** 按钮

### 2. 查看执行状态

- **运行中** - 蓝色旋转图标
- **已完成** - 绿色对勾
- **失败** - 红色叉号

### 3. 查看执行历史

执行历史会显示：
- 工作流名称
- 执行状态
- 耗时或错误信息
- 执行时间

---

## 📝 最佳实践

### 1. 命名规范
```javascript
// ✅ 好的命名
'project_init'
'code_quality_check'
'file_backup_daily'

// ❌ 避免
'workflow1'
'test'
'abc'
```

### 2. 错误处理
```javascript
// 始终定义 onFailure
new ActionStep({
  action: 'risky_op',
  onFailure: 'handle_error'  // ✅
})
```

### 3. 参数验证
```javascript
// 在步骤中验证参数
async execute(context) {
  if (!context.params.path) {
    throw new Error('缺少必需参数：path')
  }
  // ...
}
```

### 4. 日志记录
```javascript
// 记录关键步骤
console.log(`开始执行：${this.name}`)
console.log(`参数：`, resolvedParams)
console.log(`结果：`, result)
```

---

## 🔮 未来规划

### v2.1
- [ ] 工作流编辑器（可视化）
- [ ] 工作流市场（分享）
- [ ] 定时执行
- [ ] 触发器支持

### v2.5
- [ ] 子工作流
- [ ] 循环支持
- [ ] 变量存储
- [ ] 条件嵌套

### v3.0
- [ ] AI 自动生成工作流
- [ ] 工作流优化建议
- [ ] 性能分析
- [ ] 协作编辑

---

## 📚 相关文档

- [架构设计](./ARCHITECTURE.md)
- [技能系统](./SKILLS_GUIDE.md)
- [API 参考](./API_REFERENCE.md) (待创建)

---

**最后更新**: 2026-03-17  
**版本**: 2.0.0  
**工作流数量**: 6 个  
**状态**: 已实现 ✅
