# 批量学习技能参数指引

## 🎉 概述

已为 `batch_learn_webpages`（批量学习）技能添加完整的参数指引，现在在属性面板中可以看到详细的参数说明、必填项标记和示例！

---

## ✅ 修改内容

### 1. 添加参数指引数据

**文件**: `src/components/Workflow/PropertiesPanel.jsx`

**新增参数指引**：
```javascript
'batch_learn_webpages': {
  urls: {
    label: 'URL 列表',
    description: '要批量学习的网页 URL 数组（最多 20 个）',
    required: true,  // 必填项
    isArray: true,
    examples: [
      '["https://dev.epicgames.com/.../cpp-basics", "https://dev.epicgames.com/.../cpp-classes"]'
    ]
  },
  options: {
    label: '学习选项',
    description: '可选的学习配置（timeout、title 等）',
    required: false,
    isObject: true,
    examples: [
      '{"timeout": 30000, "title": "C++ 教程"}'
    ]
  }
}
```

### 2. 添加默认配置

**文件**: `src/components/Workflow/PropertiesPanel.jsx`

**自动填充默认值**：
```javascript
else if (skill.name === 'batch_learn_webpages') {
  defaultConfig = {
    urls: JSON.stringify([
      'https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine',
      'https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-cpp-sample-project'
    ], null, 2),
    options: JSON.stringify({
      timeout: 30000
    }, null, 2)
  };
}
```

---

## 🎯 使用效果

### 属性面板显示

当用户选择 `batch_learn_webpages` 技能时，属性面板会显示：

#### 参数 1：URL 列表 ⭐ 必填

```
URL 列表 *
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[输入框]

ℹ️ 参数指引
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
要批量学习的网页 URL 数组（最多 20 个）

⚠️ 必填项

示例：
• ["https://dev.epicgames.com/.../cpp-basics", 
   "https://dev.epicgames.com/.../cpp-classes"]
```

#### 参数 2：学习选项（可选）

```
学习选项 (可选)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[输入框]

ℹ️ 参数指引
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
可选的学习配置（timeout、title 等）

示例：
• {"timeout": 30000, "title": "C++ 教程"}
```

---

## 📚 完整使用示例

### 工作流配置

```json
{
  "nodes": [
    {
      "id": "skill-1",
      "type": "skill",
      "name": "批量学习",
      "config": {
        "skill": "batch_learn_webpages",
        "urls": [
          "https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine",
          "https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-cpp-sample-project",
          "https://dev.epicgames.com/documentation/unreal-engine/gameplay-framework"
        ],
        "options": {
          "timeout": 30000,
          "title": "UE5 C++ 教程"
        }
      }
    },
    {
      "id": "skill-2",
      "type": "skill",
      "name": "保存学习报告",
      "config": {
        "skill": "safe_write_file",
        "path": "batch-learning-report.md",
        "content": "# 批量学习报告\n\n学习进度：${batch_learn_webpages.successCount}/${batch_learn_webpages.total}\n\n## 学习详情\n\n${batch_learn_webpages.results}"
      }
    }
  ]
}
```

---

## 🔧 参数说明

### urls（URL 列表）⭐ 必填

**类型**: `string[]`（字符串数组）

**作用**: 指定要批量学习的网页 URL 列表

**限制**:
- ✅ 最少 1 个 URL
- ✅ 最多 20 个 URL
- ✅ 必须是有效的 HTTP/HTTPS 链接

**格式要求**:
```javascript
// ✅ 正确格式（JSON 数组）
["https://example.com/1", "https://example.com/2"]

// ❌ 错误格式（不是数组）
"https://example.com/1, https://example.com/2"

// ❌ 错误格式（空数组）
[]
```

**示例**:
```javascript
[
  "https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine",
  "https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-cpp-sample-project",
  "https://dev.epicgames.com/documentation/unreal-engine/gameplay-framework"
]
```

---

### options（学习选项）⚙️ 可选

**类型**: `object`（对象）

**作用**: 配置学习的额外选项

**支持的选项**:

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `timeout` | number | 30000 | 访问超时时间（毫秒） |
| `title` | string | 自动生成 | 自定义文档标题前缀 |

**示例**:
```javascript
// 只设置超时时间
{
  "timeout": 30000
}

// 设置所有选项
{
  "timeout": 60000,
  "title": "C++ 教程"
}
```

---

## 📊 返回值

执行成功后，返回以下字段：

```javascript
{
  success: true,  // 是否全部成功
  total: 3,       // 总 URL 数量
  successCount: 3, // 成功数量
  failCount: 0,   // 失败数量
  results: [      // 详细结果数组
    {
      url: "https://...",
      success: true,
      result: {
        // 单个 learn_webpage 的返回值
        content: "...",
        codeBlocks: [...],
        summary: {...},
        learningDoc: "..."
      }
    },
    // ... 更多结果
  ]
}
```

---

## 🎯 使用场景

### 场景 1：学习系列教程

一次性学习多个相关教程页面：

```json
{
  "skill": "batch_learn_webpages",
  "urls": [
    "https://dev.epicgames.com/.../cpp-basics",
    "https://dev.epicgames.com/.../cpp-classes",
    "https://dev.epicgames.com/.../cpp-macros"
  ]
}
```

### 场景 2：学习多个示例代码

收集多个示例代码页面：

```json
{
  "skill": "batch_learn_webpages",
  "urls": [
    "https://github.com/.../example-1",
    "https://github.com/.../example-2",
    "https://github.com/.../example-3"
  ],
  "options": {
    "title": "示例代码合集"
  }
}
```

### 场景 3：学习文档并保存报告

```json
{
  "nodes": [
    {
      "id": "skill-1",
      "type": "skill",
      "name": "批量学习",
      "config": {
        "skill": "batch_learn_webpages",
        "urls": [
          "https://example.com/doc-1",
          "https://example.com/doc-2"
        ]
      }
    },
    {
      "id": "skill-2",
      "type": "skill",
      "name": "保存报告",
      "config": {
        "skill": "safe_write_file",
        "path": "learning-report.md",
        "content": "# 学习报告\n\n总进度：${batch_learn_webpages.successCount}/${batch_learn_webpages.total}\n\n## 学习详情\n\n${batch_learn_webpages.results}"
      }
    }
  ]
}
```

---

## ⚠️ 注意事项

### 1. URL 格式

**必须**是有效的 JSON 数组格式：
```javascript
// ✅ 正确
["https://example.com/1", "https://example.com/2"]

// ❌ 错误（缺少引号）
[https://example.com/1, https://example.com/2]

// ❌ 错误（不是数组）
"https://example.com/1, https://example.com/2"
```

### 2. 数量限制

- ✅ 最少：1 个 URL
- ✅ 最多：20 个 URL
- ❌ 超过 20 个会报错

### 3. 超时设置

- 默认超时：30 秒
- 如果网页加载慢，可以增加 timeout
- 建议不超过 60 秒

### 4. 内存使用

批量学习会占用较多内存：
- 学习 5 个页面：约 50-100MB
- 学习 10 个页面：约 100-200MB
- 学习 20 个页面：约 200-400MB

---

## 🎓 最佳实践

### 1. 分批学习

如果要学习很多页面，分批进行：

```javascript
// ✅ 推荐：分 2 批，每批 10 个
batch1: ["url1", "url2", ..., "url10"]
batch2: ["url11", "url12", ..., "url20"]

// ❌ 不推荐：一次 20 个
batch: ["url1", "url2", ..., "url20"]
```

### 2. 使用有意义的标题

```javascript
{
  "urls": [...],
  "options": {
    "title": "UE5 C++ 编程指南"  // 自定义标题
  }
}
```

### 3. 保存学习报告

始终保存学习报告，方便后续查看：

```json
{
  "skill": "safe_write_file",
  "path": "learning-report.md",
  "content": "# 学习报告\n\n时间：${batch_learn_webpages.timestamp}\n\n进度：${batch_learn_webpages.successCount}/${batch_learn_webpages.total}\n\n结果：${batch_learn_webpages.results}"
}
```

---

## 📝 总结

### 完成的改进

1. ✅ 添加 `urls` 参数指引（必填项）
2. ✅ 添加 `options` 参数指引（可选项）
3. ✅ 添加默认配置（自动填充示例）
4. ✅ 显示参数类型（数组、对象）
5. ✅ 显示参数限制（最多 20 个）

### 用户体验提升

- ✅ 属性面板显示详细指引
- ✅ 必填项标记 `*`
- ✅ 可选项标记 `(可选)`
- ✅ 显示示例格式
- ✅ 自动填充默认值

### 学习效率提升

- ✅ 一次学习多个页面
- ✅ 自动生成学习报告
- ✅ 支持自定义配置
- ✅ 错误提示清晰

---

**升级完成！** 🎉

现在批量学习技能有了完整的参数指引，用户可以轻松配置和使用！

---

*升级时间*: 2026-04-17  
*影响文件*: 1 个  
*新增指引*: 2 个参数  
*默认配置*: ✅ 是
