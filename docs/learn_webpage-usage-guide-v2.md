# learn_webpage 技能使用指南（支持代码提取）

## 🚀 新功能

**v2.0 新增代码块提取功能** - 现在可以自动提取网页中的示例代码，并在学习文档中保留！

## 📝 技能简介

`learn_webpage` 是一个强大的学习技能，用于：
- 访问并提取网页内容
- **自动提取网页中的示例代码块** ✨ NEW
- 分析章节结构和关键知识点
- 生成结构化的 Markdown 学习文档

## 🔧 参数说明

### url（网址）⭐ 必填

**作用**：要学习的网页 URL

**示例**：
```json
{
  "skill": "learn_webpage",
  "url": "https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine"
}
```

### options（选项）⚙️ 可选

**timeout**：访问超时时间（毫秒），默认 30000
**title**：自定义文档标题

---

## 📤 返回值

执行成功后，返回以下字段：

```javascript
{
  success: true,
  url: "https://...",
  content: "提取的网页文本内容",
  codeBlocks: [  // ✨ NEW: 提取的代码块数组
    {
      index: 0,
      language: "cpp",  // 检测的编程语言
      code: "// 示例代码内容...",
      length: 25  // 代码行数
    },
    // ... 更多代码块
  ],
  summary: {
    totalLength: 1234,
    totalLines: 56,
    keyPointsCount: 10,
    sections: [...],
    keyPoints: [...]
  },
  learningDoc: "# 学习文档：...\n\n## 基本信息...\n\n## 示例代码...\n\n...",
  timestamp: "2026-04-13T10:00:00.000Z"
}
```

---

## 📚 使用场景

### 场景 1：学习编程文档（带代码示例）

```json
{
  "nodes": [
    {
      "id": "skill-1",
      "type": "skill",
      "name": "学习 C++ 编程",
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

**生成的文档包含**：
- ✅ 基本信息（URL、时间、统计）
- ✅ 内容概览
- ✅ 章节结构
- ✅ 关键知识点
- ✅ **示例代码**（自动提取，带语法高亮标记）
- ✅ 完整内容

---

### 场景 2：只提取代码（用于本地开发）

如果你想**只保存代码块**，用于本地参考或复制：

```json
{
  "nodes": [
    {
      "id": "skill-1",
      "type": "skill",
      "name": "提取代码",
      "config": {
        "skill": "learn_webpage",
        "url": "https://dev.epicgames.com/documentation/unreal-engine/some-cpp-tutorial"
      }
    },
    {
      "id": "skill-2",
      "type": "skill",
      "name": "保存所有代码",
      "config": {
        "skill": "safe_write_file",
        "path": "extracted-code.cpp",
        "content": "${learn_webpage.codeBlocks.map(b => b.code).join('\\n\\n// ==========\\n\\n')}"
      }
    }
  ]
}
```

**注意**：上面的模板表达式可能不工作，因为模板系统不支持复杂表达式。

**替代方案**：使用 `content` 字段保存完整学习文档，然后手动提取代码部分。

---

### 场景 3：批量学习多个教程

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
          "https://dev.epicgames.com/.../cpp-basics",
          "https://dev.epicgames.com/.../cpp-classes",
          "https://dev.epicgames.com/.../cpp-macros"
        ]
      }
    },
    {
      "id": "skill-2",
      "type": "skill",
      "name": "保存汇总报告",
      "config": {
        "skill": "safe_write_file",
        "path": "batch-learning-report.md",
        "content": "# 批量学习报告\n\n学习进度：${batch_learn_webpages.successCount}/${batch_learn_webpages.total}\n\n详细文档见各个文件..."
      }
    }
  ]
}
```

---

## 💡 代码提取功能详解

### 工作原理

1. **访问网页** - 使用 Puppeteer 浏览器自动化访问目标网页
2. **提取 HTML** - 获取完整的 HTML 内容（包括代码块的 `<pre><code>` 标签）
3. **解析代码块** - 使用正则表达式提取所有 `<pre>` 标签内的内容
4. **清理代码** - 去除 HTML 标签，还原 HTML 实体（`&lt;` → `<` 等）
5. **检测语言** - 尝试从 CSS class 中检测编程语言（如 `language-cpp`）
6. **生成文档** - 将代码块插入到学习文档的"示例代码"章节

### 支持的代码格式

技能会自动识别以下格式的代码块：

```html
<!-- 标准格式 -->
<pre><code>class MyClass {}</code></pre>

<!-- 带语言标识 -->
<pre class="language-cpp"><code>class MyClass {}</code></pre>

<!-- 带高亮 class -->
<pre class="highlight cpp"><code>class MyClass {}</code></pre>
```

### 代码块在文档中的格式

生成的 Markdown 文档中，代码块会以这种格式呈现：

```markdown
## 示例代码

### 代码块 1 (cpp)

```cpp
class MyActor : public AActor
{
    GENERATED_BODY()
    
public:
    virtual void BeginPlay() override;
};
```

### 代码块 2 (cpp)

```cpp
void MyActor::BeginPlay()
{
    Super::BeginPlay();
    // 初始化代码
}
```
```

---

## 🎯 最佳实践

### 1. 选择合适的文档

**推荐**：
- ✅ 官方文档（如 Epic Games、Microsoft Docs）
- ✅ 技术教程网站
- ✅ API 参考文档
- ✅ GitHub Wiki

**不推荐**：
- ❌ 动态加载的网站（可能需要等待）
- ❌ 需要登录才能访问的网站
- ❌ 视频网站（如 YouTube、Bilibili）

### 2. 验证提取的代码

提取后，**务必检查**：
- ✅ 代码是否完整（没有被截断）
- ✅ 代码格式是否正确
- ✅ 是否包含了所有重要的示例

### 3. 本地开发参考

提取的代码可以用于：
- 📝 本地参考和学习
- 🔧 快速复制示例代码进行测试
- 📚 创建个人代码库

**注意**：不要直接复制粘贴到生产环境，需要：
- 理解代码的作用
- 根据项目需求进行调整
- 遵守开源许可证

---

## ⚠️ 常见问题

### Q1: 为什么没有提取到代码？

**可能原因**：
1. 网页没有使用 `<pre><code>` 标签
2. 代码块是图片格式
3. 网站阻止了自动化访问

**解决方案**：
- 检查网页源代码，确认代码块的 HTML 结构
- 尝试其他类似的文档网站
- 使用后端服务的调试模式查看提取的 HTML

### Q2: 提取的代码格式混乱？

**可能原因**：
- 网页使用了特殊的代码高亮插件
- HTML 实体没有被正确还原

**解决方案**：
- 检查生成的 Markdown 文档中的代码部分
- 手动清理格式（如果问题严重）
- 报告 bug，我们会改进解析逻辑

### Q3: 如何只保存代码，不要其他内容？

**方法**：使用模板变量访问 `codeBlocks` 字段

```json
{
  "skill": "safe_write_file",
  "path": "code-only.cpp",
  "content": "${learn_webpage.codeBlocks}"
}
```

但这会输出 JSON 格式。更好的方法是：
1. 生成完整的学习文档
2. 手动复制"示例代码"章节
3. 或者编写自定义的后处理脚本

### Q4: 代码块太多，文档太长怎么办？

**解决方案**：
1. 使用 `options` 参数限制提取的代码块数量
2. 在学习文档中只保留关键代码
3. 将代码块单独保存为文件

---

## 📖 相关技能

- [`safe_write_file`](./safe_write_file-usage-guide.md) - 保存学习文档
- [`batch_learn_webpages`](./LearnWebpage.md) - 批量学习
- [`web_search`](./WebSearch.md) - 搜索相关文档

---

## 🔮 未来计划

- [ ] 支持提取内联代码（`<code>` 标签，不是代码块）
- [ ] 支持提取代码片段并自动分类
- [ ] 支持生成代码注释和说明
- [ ] 支持导出为 IDE 项目格式
