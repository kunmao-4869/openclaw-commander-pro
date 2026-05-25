# safe_write_file 技能使用指南

## 📝 技能简介

`safe_write_file` 是一个安全的文件写入技能，用于在工作流中创建和修改文件。

## 🔧 参数说明

### 1. path（文件路径）⭐ 必填

**作用**：指定要写入的文件路径

**支持的格式**：
- **相对路径**（推荐）：自动保存到 `projects` 目录
  - 示例：`UE5teaching.txt`
  - 示例：`docs/learning-notes.md`
  - 示例：`output/code-review.json`

- **绝对路径**：直接指定完整路径
  - 示例：`F:\openclaw\commander-pro\projects\output.txt`

**允许的目录**：
- `projects/` - 项目文件目录（推荐）
- `temp/` - 临时文件目录
- `output/` - 输出文件目录

---

### 2. content（文件内容）⭐ 必填

**作用**：指定要写入文件的内容

**支持的内容类型**：
- 纯文本
- Markdown 格式
- 代码（JSON、JavaScript、C++ 等）
- 模板变量（引用前一个技能的输出）

#### 🎯 模板变量使用指南

模板变量允许你引用前一个技能的输出结果，语法：`${变量名.字段名}`

**常用模板变量**：

| 变量名 | 说明 | 使用场景 |
|--------|------|----------|
| `${learn_webpage.learningDoc}` | 学习网页技能生成的**完整学习文档**（Markdown 格式） | ✅ **最常用**：保存学习总结 |
| `${learn_webpage.content}` | 学习网页技能提取的**原始网页内容** | 需要原始内容进行二次处理 |
| `${learn_webpage.summary}` | 学习网页技能的**内容摘要**（对象） | 需要自定义文档格式 |
| `${web_search.results}` | 网络搜索技能的**搜索结果数组** | 保存搜索结果列表 |
| `${searchResults}` | 搜索结果的**快捷访问** | 等同于 `web_search.results` |
| `${lastResult}` | 前一个技能的**完整返回对象** | 需要访问所有字段 |

**使用示例**：

```javascript
// 示例 1：保存学习文档（推荐）
{
  "skill": "safe_write_file",
  "path": "UE5-Learning.md",
  "content": "${learn_webpage.learningDoc}"
}

// 示例 2：保存搜索结果
{
  "skill": "safe_write_file",
  "path": "search-results.txt",
  "content": "${searchResults}"
}

// 示例 3：保存原始内容
{
  "skill": "safe_write_file",
  "path": "raw-content.txt",
  "content": "${learn_webpage.content}"
}

// 示例 4：自定义内容
{
  "skill": "safe_write_file",
  "path": "notes.md",
  "content": "# 我的学习笔记\n\n这是我自己写的内容...\n\n---\n\n${learn_webpage.summary}"
}
```

---

### 3. encoding（文件编码）⚙️ 可选

**作用**：指定文件的编码格式

**默认值**：`utf-8`

**支持的编码**：
- `utf-8`（推荐，适用于中文和大多数场景）
- `ascii`（仅英文）
- `base64`（二进制数据）

---

## 📚 常见使用场景

### 场景 1：保存学习文档（最常用）

```json
{
  "nodes": [
    {
      "id": "skill-1",
      "type": "skill",
      "name": "学习网页",
      "config": {
        "skill": "learn_webpage",
        "url": "https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine"
      }
    },
    {
      "id": "skill-2",
      "type": "skill",
      "name": "保存学习文档",
      "config": {
        "skill": "safe_write_file",
        "path": "UE5-CPP-Learning.md",
        "content": "${learn_webpage.learningDoc}"
      }
    }
  ]
}
```

**生成的文件**：`projects/UE5-CPP-Learning.md`

---

### 场景 2：保存搜索结果

```json
{
  "nodes": [
    {
      "id": "skill-1",
      "type": "skill",
      "name": "网络搜索",
      "config": {
        "skill": "web_search",
        "query": "虚幻 5 C++ 开发教程",
        "limit": 10
      }
    },
    {
      "id": "skill-2",
      "type": "skill",
      "name": "保存搜索结果",
      "config": {
        "skill": "safe_write_file",
        "path": "search-results.txt",
        "content": "${searchResults}"
      }
    }
  ]
}
```

**生成的文件**：`projects/search-results.txt`

---

### 场景 3：创建自定义笔记

```json
{
  "nodes": [
    {
      "id": "skill-1",
      "type": "skill",
      "name": "学习网页",
      "config": {
        "skill": "learn_webpage",
        "url": "https://example.com/tutorial"
      }
    },
    {
      "id": "skill-2",
      "type": "skill",
      "name": "创建笔记",
      "config": {
        "skill": "safe_write_file",
        "path": "my-notes.md",
        "content": "# 学习笔记\n\n学习时间：${learn_webpage.timestamp}\n\n来源：${learn_webpage.url}\n\n## 我的总结\n\n这里是我自己的总结内容...\n\n## 原始内容\n\n${learn_webpage.content}"
      }
    }
  ]
}
```

**生成的文件**：`projects/my-notes.md`

---

## ⚠️ 常见问题

### Q1: 文件被写入到错误的目录？

**问题**：文件被写入到 `server/projects/` 而不是 `projects/`

**原因**：后端服务的当前工作目录是 `server` 文件夹

**解决方案**：
1. 使用相对路径（推荐）：`path: "UE5teaching.txt"`
2. 使用绝对路径：`path: "F:\\openclaw\\commander-pro\\projects\\UE5teaching.txt"`

---

### Q2: 模板变量没有被解析？

**问题**：文件内容是 `${searchResults}` 而不是实际内容

**原因**：
1. 变量名错误（应该用 `${learn_webpage.learningDoc}` 而不是 `${searchResults}`）
2. 前一个技能没有返回预期的字段

**解决方案**：
1. 检查前一个技能的类型和返回字段
2. 使用正确的变量名（参考上面的表格）
3. 刷新页面重新加载工作流

---

### Q3: 如何查看前一个技能返回了什么字段？

**方法**：查看浏览器控制台的日志

```
📌 保存技能结果到上下文：learn_webpage {
  hasLearningDoc: true,
  hasResults: false,
  hasContent: true
}
```

这表示 `learn_webpage` 技能返回了以下字段：
- `learningDoc` ✅
- `content` ✅
- `summary` ✅
- `url` ✅
- `timestamp` ✅

---

## 🎯 最佳实践

1. **始终使用相对路径** - 让系统自动处理目录
2. **使用有意义的文件名** - 例如 `UE5-CPP-Learning.md` 而不是 `output.txt`
3. **选择合适的模板变量** - 根据需求选择 `learningDoc`、`content` 或 `summary`
4. **保存为 Markdown 格式** - 学习文档使用 `.md` 扩展名，便于阅读
5. **定期清理临时文件** - 使用 `temp/` 目录存放临时文件

---

## 📖 相关技能

- [`learn_webpage`](./LearnWebpage.md) - 学习网页内容并生成文档
- [`web_search`](./WebSearch.md) - 网络搜索
- [`safe_read_file`](./SafeFileOperations.md) - 读取文件内容
- [`batch_learn_webpages`](./LearnWebpage.md#批量学习) - 批量学习多个网页
