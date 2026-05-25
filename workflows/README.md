# 工作流配置文件目录

这个文件夹用于存放可复用的工作流配置文件（`.json` 格式）。

## 📁 用途

- 保存常用的工作流配置
- 分享和导入工作流模板
- 版本控制工作流设计

## 📝 使用方法

### 保存工作流
1. 在工作流编辑器中设计好工作流
2. 点击编辑器右上角的"保存"按钮（💾 图标）
3. 选择保存到 `workflows` 目录
4. 输入文件名，例如：`learn-ue5-docs.json`

### 加载工作流
1. 点击工作流编辑器右上角的"加载"按钮（📁 图标）
2. 从 `workflows` 目录选择要加载的文件
3. 点击"打开"

## 📂 推荐的文件命名

- `learn-*.json` - 学习类工作流（如：`learn-ue5-cpp.json`）
- `search-*.json` - 搜索类工作流（如：`search-docs.json`）
- `code-*.json` - 代码相关的工作流（如：`code-review.json`）
- `file-*.json` - 文件操作工作流（如：`file-batch-process.json`）

## 🎯 示例工作流

### learn-ue5-cpp.json
学习虚幻引擎 C++ 编程文档的工作流

```json
{
  "name": "学习 UE5 C++ 编程",
  "nodes": [
    {
      "id": "skill-1",
      "type": "skill",
      "name": "学习网页",
      "config": {
        "skill": "learn_webpage",
        "url": "https://dev.epicgames.com/..."
      }
    },
    {
      "id": "skill-2",
      "type": "skill",
      "name": "保存文档",
      "config": {
        "skill": "safe_write_file",
        "path": "UE5-Learning.md",
        "content": "${learn_webpage.learningDoc}"
      }
    }
  ]
}
```

## 💡 提示

- 工作流文件是标准 JSON 格式，可以用任何文本编辑器编辑
- 可以在不同的 OpenClaw Commander Pro 实例之间共享工作流文件
- 建议定期备份这个文件夹
