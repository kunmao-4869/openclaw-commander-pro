# 📚 基于学习文档生成代码 - 使用指南

## 🎯 功能概述

这个工作流可以让你**学习任何开发工具/框架的编码规范**，然后让 AI 根据学到的规范生成符合标准的代码。

---

## 🚀 支持的开发工具

### ✅ 已验证支持

| 开发工具 | 学习文档示例 | 生成代码类型 |
|---------|------------|------------|
| **Epic Games (UE5)** | Unreal Engine C++ 编码规范 | C++ Actor/Component |
| **IntelliJ IDEA** | Java/Kotlin 编码规范 | Java/Kotlin 类 |
| **DevEco Studio** | HarmonyOS 开发规范 | ArkTS/JS 应用 |
| **PyCharm** | Python PEP8 规范 | Python 模块/类 |
| **Visual Studio Code** | Web 开发规范 | TypeScript/JavaScript |
| **微信开发者工具** | 微信小程序开发规范 | WXML/WXSS/JS |
| **Android Studio** | Android 开发规范 | Kotlin/Java Activity |
| **Xcode** | iOS 开发规范 | Swift ViewController |

---

## 📝 使用流程

### 步骤 1：学习开发工具规范

使用 `learn_webpage` 技能学习官方文档：

```json
{
  "skill": "learn_webpage",
  "url": "官方文档 URL"
}
```

**学习文档示例**：

#### 1. IntelliJ IDEA (Java)
```
URL: https://jetbrains.com/idea/intellij-coding-guidelines
保存为：idea-java-guidelines.md
```

#### 2. DevEco Studio (HarmonyOS)
```
URL: https://developer.harmonyos.com/cn/docs/documentation/doc-guides/arkts-get-started-0000001504920217
保存为：deveco-arkts-guidelines.md
```

#### 3. PyCharm (Python)
```
URL: https://peps.python.org/pep-0008/
保存为：python-pep8-guidelines.md
```

#### 4. VS Code (TypeScript)
```
URL: https://google.github.io/styleguide/tsguide.html
保存为：typescript-guidelines.md
```

#### 5. 微信开发者工具
```
URL: https://developers.weixin.qq.com/miniprogram/dev/framework/
保存为：wechat-miniprogram-guidelines.md
```

---

### 步骤 2：读取学习文档

```json
{
  "skill": "safe_read_file",
  "path": "保存的学习文档文件名.md"
}
```

---

### 步骤 3：生成代码

```json
{
  "skill": "generate_project_code",
  "projectType": "项目类型",
  "techStack": "技术栈",
  "requirements": "具体需求",
  "learningResults": "${safe_read_file.content}"
}
```

---

### 步骤 4：保存代码

```json
{
  "skill": "safe_write_file",
  "path": "输出文件名",
  "content": "${generate_project_code.files[0].content}"
}
```

---

## 💡 实际应用示例

### 示例 1：生成 IntelliJ IDEA Java 代码

**工作流配置**：

```json
{
  "nodes": [
    {
      "id": "skill-read-1",
      "config": {
        "skill": "safe_read_file",
        "path": "idea-java-guidelines.md"
      }
    },
    {
      "id": "skill-code-1",
      "config": {
        "skill": "generate_project_code",
        "projectType": "Java 项目",
        "techStack": "Java 17, IntelliJ IDEA",
        "requirements": "创建一个用户服务类，实现用户注册、登录功能",
        "learningResults": "${safe_read_file.content}"
      }
    },
    {
      "id": "skill-write-1",
      "config": {
        "skill": "safe_write_file",
        "path": "UserService.java",
        "content": "${generate_project_code.files[0].content}"
      }
    }
  ]
}
```

**生成的代码**：

```java
/**
 * 用户服务类
 * 遵循 IntelliJ IDEA Java 编码规范
 */
@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 用户注册
     * @param user 用户信息
     * @return 注册结果
     */
    public boolean registerUser(User user) {
        if (user == null || user.getUsername() == null) {
            logger.warn("Invalid user data");
            return false;
        }
        
        // 检查用户名是否已存在
        if (userRepository.existsByUsername(user.getUsername())) {
            logger.error("Username already exists: {}", user.getUsername());
            return false;
        }
        
        // 加密密码
        user.setPassword(encodePassword(user.getPassword()));
        
        return userRepository.save(user) != null;
    }
    
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return 登录结果
     */
    public boolean login(String username, String password) {
        // 实现登录逻辑
        return true;
    }
    
    private String encodePassword(String password) {
        // 密码加密
        return password; // TODO: 实现加密
    }
}
```

---

### 示例 2：生成 DevEco Studio ArkTS 代码

**工作流配置**：

```json
{
  "nodes": [
    {
      "id": "skill-read-1",
      "config": {
        "skill": "safe_read_file",
        "path": "deveco-arkts-guidelines.md"
      }
    },
    {
      "id": "skill-code-1",
      "config": {
        "skill": "generate_project_code",
        "projectType": "HarmonyOS 应用",
        "techStack": "HarmonyOS 4.0, ArkTS",
        "requirements": "创建一个简单的计数器页面，包含加减按钮和计数显示",
        "learningResults": "${safe_read_file.content}"
      }
    },
    {
      "id": "skill-write-1",
      "config": {
        "skill": "safe_write_file",
        "path": "CounterPage.ets",
        "content": "${generate_project_code.files[0].content}"
      }
    }
  ]
}
```

**生成的代码**：

```typescript
// CounterPage.ets
// 遵循 HarmonyOS ArkTS 开发规范

import router from '@ohos.router';

@Entry
@Component
struct CounterPage {
  @State count: number = 0;
  @State buttonText: string = '点击计数';

  build() {
    Column() {
      // 计数显示
      Text(`计数：${this.count}`)
        .fontSize(36)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 50, bottom: 20 })

      // 加按钮
      Button('增加')
        .width('80%')
        .height(50)
        .backgroundColor('#007DFF')
        .onClick(() => {
          this.count++;
          this.buttonText = '已增加';
        })
        .margin({ bottom: 10 })

      // 减按钮
      Button('减少')
        .width('80%')
        .height(50)
        .backgroundColor('#FF6B6B')
        .onClick(() => {
          if (this.count > 0) {
            this.count--;
            this.buttonText = '已减少';
          }
        })

      // 状态文本
      Text(this.buttonText)
        .fontSize(18)
        .fontColor('#666666')
        .margin({ top: 20 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
```

---

### 示例 3：生成 PyCharm Python 代码

**工作流配置**：

```json
{
  "nodes": [
    {
      "id": "skill-read-1",
      "config": {
        "skill": "safe_read_file",
        "path": "python-pep8-guidelines.md"
      }
    },
    {
      "id": "skill-code-1",
      "config": {
        "skill": "generate_project_code",
        "projectType": "Python 项目",
        "techStack": "Python 3.11, PyCharm",
        "requirements": "创建一个数据处理类，实现 CSV 文件读取、数据清洗、统计分析功能",
        "learningResults": "${safe_read_file.content}"
      }
    },
    {
      "id": "skill-write-1",
      "config": {
        "skill": "safe_write_file",
        "path": "data_processor.py",
        "content": "${generate_project_code.files[0].content}"
      }
    }
  ]
}
```

**生成的代码**：

```python
"""
数据处理器模块
遵循 PEP 8 编码规范
"""

import csv
from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class DataRecord:
    """数据记录类"""
    id: int
    name: str
    value: float


class DataProcessor:
    """数据处理类，实现 CSV 文件处理功能"""

    def __init__(self, file_path: str) -> None:
        """
        初始化数据处理器

        Args:
            file_path: CSV 文件路径
        """
        self.file_path = file_path
        self.data: List[DataRecord] = []

    def read_csv(self) -> bool:
        """
        读取 CSV 文件

        Returns:
            读取成功返回 True，否则返回 False
        """
        try:
            with open(self.file_path, 'r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    record = DataRecord(
                        id=int(row['id']),
                        name=row['name'],
                        value=float(row['value'])
                    )
                    self.data.append(record)
            return True
        except (FileNotFoundError, ValueError) as e:
            print(f"Error reading CSV: {e}")
            return False

    def clean_data(self) -> None:
        """清洗数据，移除无效记录"""
        self.data = [
            record for record in self.data
            if record.name and record.value >= 0
        ]

    def calculate_statistics(self) -> Dict[str, float]:
        """
        计算统计数据

        Returns:
            包含统计信息的字典
        """
        if not self.data:
            return {}

        values = [record.value for record in self.data]
        return {
            'count': len(values),
            'mean': sum(values) / len(values),
            'min': min(values),
            'max': max(values),
        }


def main() -> None:
    """主函数"""
    processor = DataProcessor('data.csv')
    if processor.read_csv():
        processor.clean_data()
        stats = processor.calculate_statistics()
        print(f"Statistics: {stats}")


if __name__ == '__main__':
    main()
```

---

### 示例 4：生成微信开发者工具代码

**工作流配置**：

```json
{
  "nodes": [
    {
      "id": "skill-read-1",
      "config": {
        "skill": "safe_read_file",
        "path": "wechat-miniprogram-guidelines.md"
      }
    },
    {
      "id": "skill-code-1",
      "config": {
        "skill": "generate_project_code",
        "projectType": "微信小程序",
        "techStack": "微信小程序原生框架",
        "requirements": "创建一个商品列表页面，展示商品图片、名称、价格，支持点击查看详情",
        "learningResults": "${safe_read_file.content}"
      }
    },
    {
      "id": "skill-write-1",
      "config": {
        "skill": "safe_write_file",
        "path": "pages/product-list/product-list.wxml",
        "content": "${generate_project_code.files[0].content}"
      }
    }
  ]
}
```

**生成的代码**：

```xml
<!--pages/product-list/product-list.wxml-->
<!-- 遵循微信小程序开发规范 -->

<view class="container">
  <!-- 搜索栏 -->
  <view class="search-bar">
    <input 
      class="search-input" 
      placeholder="搜索商品" 
      bindinput="onSearchInput"
      confirm-type="search"
      bindconfirm="onSearch"
    />
  </view>

  <!-- 商品列表 -->
  <view class="product-list">
    <view 
      class="product-item" 
      wx:for="{{productList}}" 
      wx:key="id"
      bindtap="onProductTap"
      data-id="{{item.id}}"
    >
      <!-- 商品图片 -->
      <image 
        class="product-image" 
        src="{{item.image}}" 
        mode="aspectFill"
      />
      
      <!-- 商品信息 -->
      <view class="product-info">
        <text class="product-name">{{item.name}}</text>
        <text class="product-price">¥{{item.price}}</text>
        <text class="product-sales">已售 {{item.sales}}</text>
      </view>
    </view>
  </view>

  <!-- 加载更多 -->
  <view 
    class="load-more" 
    wx:if="{{hasMore}}"
    bindtap="loadMore"
  >
    <text>加载更多</text>
  </view>
</view>
```

---

## 🎯 快速开始

### 方法 1：使用通用模板

1. 加载工作流：`generate-code-universal.json`
2. 修改参数：
   - `learningDocPath`: 学习文档路径
   - `projectType`: 项目类型
   - `techStack`: 技术栈
   - `requirements`: 具体需求
   - `outputFilePath`: 输出文件路径

### 方法 2：手动创建

按照上面的示例，根据你的需求创建工作流。

---

## 📖 学习资源

### 官方文档链接

- **Epic Games**: https://dev.epicgames.com/documentation
- **IntelliJ IDEA**: https://jetbrains.com/idea/intellij-coding-guidelines
- **DevEco Studio**: https://developer.harmonyos.com
- **PyCharm**: https://peps.python.org/pep-0008/
- **VS Code**: https://code.visualstudio.com/docs
- **微信开发者工具**: https://developers.weixin.qq.com/miniprogram/dev/framework/

---

## 💡 最佳实践

### 1. 学习多个相关文档

```
学习基础规范 → basics.md
学习组件开发 → components.md
学习项目结构 → structure.md

组合使用：
"learningResults": "基础：${basics.content}\n组件：${components.content}\n结构：${structure.content}"
```

### 2. 验证生成的代码

```json
{
  "skill": "review_code",
  "code": "${generate_project_code.files[0].content}",
  "standards": "${safe_read_file.content}"
}
```

### 3. 迭代优化

```
学习 → 生成 → 审查 → 修改 → 再生成
```

---

## 🔧 常见问题

### Q: 如何学习本地文档？

A: 使用 `safe_read_file` 读取本地文档，然后传给 `generate_project_code`。

### Q: 生成的代码不符合规范怎么办？

A: 重新学习文档，确保学习文档包含详细的规范说明。

### Q: 可以一次生成多个文件吗？

A: 可以，`generate_project_code` 返回 `files` 数组，遍历保存即可。

---

现在你可以为**任何开发工具**生成符合规范的代码了！🚀
