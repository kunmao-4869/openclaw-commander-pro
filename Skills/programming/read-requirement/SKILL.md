# Read Requirement Skill

## 元数据

- **名称**: Read Requirement（读取需求文档）
- **版本**: 1.0.0
- **分类**: 编程开发
- **触发关键词**: 读取需求，读取文档，需求文档，根据...生成，读取文件
- **优先级**: 高

## 描述

专门用于读取项目需求文档的技能。支持读取 .md 格式的需求文件，支持中文路径，支持 Windows 系统，自动移除路径中的空格，安全性检查（只能读取 projects 目录下的文件）。

## 参数

- **path**: string (必填) - 需求文档的路径
- **filePath**: string (可选) - 需求文档的路径（备选参数名）

## 使用示例

### 示例 1：读取需求文档并生成项目

用户：根据"F:\openclaw\projects\HarmonyOS\HarmonyOS_Demo\docs\智慧客房 APP 项目需求.md"生成项目

技能调用：
```json
{
  "skill": "read_requirement",
  "action": "execute",
  "params": {
    "path": "F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房 APP 项目需求.md"
  }
}
```

预期输出：
```json
{
  "success": true,
  "path": "F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房 APP 项目需求.md",
  "content": "智慧客房控制 APP 界面，整体为 5 个页面的设计稿...",
  "title": "智慧客房 APP 项目需求",
  "size": 1469,
  "lines": 62
}
```

## 注意事项

1. 只能读取 .md 格式的文件
2. 路径必须包含 projects 目录（安全限制）
3. 文件大小限制在 500KB 以内
4. 自动移除路径中的多余空格
5. 支持中文路径和特殊字符

## 相关文件

实现文件：src/skills/file/ReadRequirement.js
