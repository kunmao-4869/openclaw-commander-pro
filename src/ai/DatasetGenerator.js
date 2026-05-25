/**
 * 数据集生成器
 * 自动生成训练数据集用于提升 AI 能力
 */

import fs from 'fs';
import path from 'path';

class DatasetGenerator {
  constructor() {
    this.datasets = {
      code: [],           // 代码数据集
      search: [],         // 搜索数据集
      docs: [],           // 文档数据集
      bestPractices: [],  // 最佳实践
      errorCases: []      // 错误案例
    };
    
    this.outputDir = path.join(process.cwd(), 'datasets');
  }

  /**
   * 生成代码数据集
   */
  async generateCodeDataset() {
    console.log('\n📝 生成代码数据集...\n');
    
    const codeExamples = [
      {
        id: 'code_001',
        language: 'python',
        category: 'web_scraping',
        title: 'Python 网络爬虫示例',
        difficulty: 'intermediate',
        code: `
"""
网络爬虫示例
功能：获取网页内容，解析 HTML，提取数据
"""

import requests
from bs4 import BeautifulSoup
import json


class WebScraper:
    """网页爬虫类"""
    
    def __init__(self, base_url, delay=1):
        self.base_url = base_url
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0'
        })
    
    def fetch(self, url):
        """获取网页"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"请求失败：{e}")
            return None
    
    def parse(self, html):
        """解析 HTML"""
        soup = BeautifulSoup(html, 'html.parser')
        return soup
    
    def extract_links(self, soup):
        """提取链接"""
        links = []
        for a in soup.find_all('a', href=True):
            links.append({
                'text': a.get_text(strip=True),
                'href': a['href']
            })
        return links
    
    def extract_text(self, soup, selector='p'):
        """提取文本"""
        texts = []
        for elem in soup.select(selector):
            texts.append(elem.get_text(strip=True))
        return texts
    
    def save_to_json(self, data, filename):
        """保存数据"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"数据已保存到 {filename}")


def main():
    """主函数"""
    scraper = WebScraper('https://example.com')
    
    # 获取网页
    html = scraper.fetch('https://example.com')
    if not html:
        return
    
    # 解析
    soup = scraper.parse(html)
    
    # 提取数据
    links = scraper.extract_links(soup)
    texts = scraper.extract_text(soup)
    
    # 保存
    scraper.save_to_json({
        'links': links,
        'texts': texts
    }, 'scraped_data.json')
    
    print(f"提取了 {len(links)} 个链接，{len(texts)} 段文本")


if __name__ == "__main__":
    main()
`,
        tags: ['requests', 'beautifulsoup', '爬虫', '数据提取'],
        quality: 95,
        explanation: `
这个示例展示了：
1. 使用 requests 库发送 HTTP 请求
2. 使用 BeautifulSoup 解析 HTML
3. 提取链接和文本数据
4. 保存为 JSON 格式

最佳实践：
- 使用 Session 管理连接
- 设置 User-Agent 避免被屏蔽
- 添加错误处理
- 使用延时避免请求过快
`
      },
      
      {
        id: 'code_002',
        language: 'python',
        category: 'data_processing',
        title: 'Pandas 数据处理示例',
        difficulty: 'intermediate',
        code: `
"""
Pandas 数据处理示例
功能：读取 CSV、数据清洗、统计分析、导出结果
"""

import pandas as pd
import numpy as np
from datetime import datetime


class DataProcessor:
    """数据处理器"""
    
    def __init__(self, filepath):
        self.filepath = filepath
        self.df = None
    
    def load(self):
        """加载数据"""
        print(f"加载数据：{self.filepath}")
        self.df = pd.read_csv(self.filepath)
        print(f"加载完成：{len(self.df)} 行，{len(self.df.columns)} 列")
        return self
    
    def clean(self):
        """清洗数据"""
        print("\\n数据清洗...")
        
        # 删除空值
        before = len(self.df)
        self.df.dropna(inplace=True)
        after = len(self.df)
        print(f"删除空值：{before - after} 行")
        
        # 删除重复
        before = len(self.df)
        self.df.drop_duplicates(inplace=True)
        after = len(self.df)
        print(f"删除重复：{before - after} 行")
        
        return self
    
    def analyze(self):
        """统计分析"""
        print("\\n统计分析：")
        
        # 基本统计
        print("\\n数值列统计：")
        print(self.df.describe())
        
        # 相关性
        print("\\n相关性矩阵：")
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            print(self.df[numeric_cols].corr())
        
        return self
    
    def filter(self, column, condition):
        """过滤数据"""
        print(f"\\n过滤数据：{column} {condition}")
        self.df = self.df.query(f"{column} {condition}")
        return self
    
    def export(self, filename):
        """导出数据"""
        print(f"\\n导出数据到：{filename}")
        self.df.to_csv(filename, index=False, encoding='utf-8-sig')
        print("导出完成")
        return self
    
    def info(self):
        """显示信息"""
        print("\\n数据集信息：")
        print(self.df.info())
        return self


def main():
    """主函数"""
    # 创建示例数据
    data = {
        'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
        'age': [25, 30, 35, 40, 45],
        'salary': [50000, 60000, 75000, 80000, 90000],
        'department': ['HR', 'IT', 'IT', 'HR', 'IT']
    }
    
    # 保存为 CSV
    df_temp = pd.DataFrame(data)
    df_temp.to_csv('employees.csv', index=False)
    
    # 处理数据
    processor = DataProcessor('employees.csv')
    
    result = (processor
        .load()
        .info()
        .analyze()
        .export('processed_data.csv')
    )
    
    print("\\n数据处理完成！")


if __name__ == "__main__":
    main()
`,
        tags: ['pandas', '数据处理', '统计分析', 'CSV'],
        quality: 98,
        explanation: `
这个示例展示了：
1. 使用 Pandas 读取和写入 CSV
2. 数据清洗（删除空值、重复值）
3. 描述性统计分析
4. 链式调用设计模式

最佳实践：
- 方法链式调用，代码简洁
- 每个方法返回 self，支持链式
- 详细的日志输出
- 错误处理和数据验证
`
      },
      
      {
        id: 'code_003',
        language: 'javascript',
        category: 'api_development',
        title: 'Node.js REST API 示例',
        difficulty: 'advanced',
        code: `
/**
 * Node.js REST API 示例
 * 功能：创建 RESTful API，CRUD 操作，中间件，错误处理
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');

class RESTAPI {
  constructor(port = 3000) {
    this.port = port;
    this.app = express();
    this.items = new Map();
    
    // 中间件
    this.app.use(express.json());
    this.app.use(this.loggingMiddleware);
    this.app.use(this.errorHandler);
    
    // 路由
    this.setupRoutes();
  }
  
  // 日志中间件
  loggingMiddleware(req, res, next) {
    const timestamp = new Date().toISOString();
    console.log(\`[\${timestamp}] \${req.method} \${req.path}\`);
    next();
  }
  
  // 错误处理中间件
  errorHandler(err, req, res, next) {
    console.error('错误:', err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
  
  // 设置路由
  setupRoutes() {
    // 获取所有
    this.app.get('/api/items', (req, res) => {
      const items = Array.from(this.items.values());
      res.json({ success: true, data: items });
    });
    
    // 获取单个
    this.app.get('/api/items/:id', (req, res) => {
      const item = this.items.get(req.params.id);
      if (!item) {
        return res.status(404).json({ 
          success: false, 
          error: '未找到' 
        });
      }
      res.json({ success: true, data: item });
    });
    
    // 创建
    this.app.post('/api/items', (req, res) => {
      const id = uuidv4();
      const item = {
        id,
        ...req.body,
        createdAt: new Date().toISOString()
      };
      this.items.set(id, item);
      res.status(201).json({ success: true, data: item });
    });
    
    // 更新
    this.app.put('/api/items/:id', (req, res) => {
      const item = this.items.get(req.params.id);
      if (!item) {
        return res.status(404).json({ 
          success: false, 
          error: '未找到' 
        });
      }
      const updated = { ...item, ...req.body };
      this.items.set(req.params.id, updated);
      res.json({ success: true, data: updated });
    });
    
    // 删除
    this.app.delete('/api/items/:id', (req, res) => {
      const deleted = this.items.delete(req.params.id);
      res.json({ 
        success: deleted, 
        message: deleted ? '删除成功' : '未找到' 
      });
    });
  }
  
  // 启动服务器
  start() {
    this.app.listen(this.port, () => {
      console.log(\`服务器运行在 http://localhost:\${this.port}\`);
      console.log('API 端点:');
      console.log('  GET    /api/items     - 获取所有');
      console.log('  GET    /api/items/:id - 获取单个');
      console.log('  POST   /api/items     - 创建');
      console.log('  PUT    /api/items/:id - 更新');
      console.log('  DELETE /api/items/:id - 删除');
    });
  }
}

// 启动
const api = new RESTAPI(3000);
api.start();
`,
        tags: ['express', 'REST API', 'Node.js', 'CRUD'],
        quality: 96,
        explanation: `
这个示例展示了：
1. Express 框架创建 REST API
2. 完整的 CRUD 操作
3. 中间件（日志、错误处理）
4. UUID 生成唯一 ID

最佳实践：
- RESTful 设计风格
- 统一的响应格式
- 中间件处理横切关注点
- 适当的 HTTP 状态码
`
      },
      
      {
        id: 'code_004',
        language: 'python',
        category: 'automation',
        title: '文件自动化整理脚本',
        difficulty: 'beginner',
        code: `
"""
文件自动化整理脚本
功能：扫描目录，按类型分类，移动到对应文件夹
"""

import os
import shutil
from pathlib import Path
from datetime import datetime


class FileOrganizer:
    """文件整理器"""
    
    def __init__(self, directory):
        self.directory = Path(directory)
        self.stats = {
            'moved': 0,
            'skipped': 0,
            'errors': 0
        }
        
        # 文件类型映射
        self.categories = {
            'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
            'Documents': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.pptx'],
            'Videos': ['.mp4', '.avi', '.mkv', '.mov', '.wmv'],
            'Music': ['.mp3', '.wav', '.flac', '.aac'],
            'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
            'Code': ['.py', '.js', '.java', '.cpp', '.c', '.html', '.css']
        }
    
    def organize(self):
        """整理文件"""
        print(f"开始整理目录：{self.directory.absolute()}")
        print(f"时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\\n")
        
        # 扫描文件
        files = [f for f in self.directory.iterdir() if f.is_file()]
        print(f"找到 {len(files)} 个文件\\n")
        
        # 整理每个文件
        for file_path in files:
            self._process_file(file_path)
        
        # 显示统计
        self._show_stats()
    
    def _process_file(self, file_path):
        """处理单个文件"""
        try:
            ext = file_path.suffix.lower()
            category = self._find_category(ext)
            
            if category:
                target_dir = self.directory / category
                target_dir.mkdir(exist_ok=True)
                
                target_path = target_dir / file_path.name
                
                # 避免覆盖
                if target_path.exists():
                    target_path = self._rename_duplicate(target_path)
                
                shutil.move(str(file_path), str(target_path))
                self.stats['moved'] += 1
                print(f"✓ {file_path.name} -> {category}/")
            else:
                self.stats['skipped'] += 1
                print(f"⊘ {file_path.name} (未知类型)")
        
        except Exception as e:
            self.stats['errors'] += 1
            print(f"✗ {file_path.name}: {e}")
    
    def _find_category(self, ext):
        """查找文件类型对应的分类"""
        for category, extensions in self.categories.items():
            if ext in extensions:
                return category
        return None
    
    def _rename_duplicate(self, path):
        """重命名重复文件"""
        stem = path.stem
        suffix = path.suffix
        counter = 1
        
        while path.exists():
            new_name = f"{stem}_duplicate_{counter}{suffix}"
            path = path.parent / new_name
            counter += 1
        
        return path
    
    def _show_stats(self):
        """显示统计信息"""
        print("\\n" + "=" * 50)
        print("整理完成")
        print("=" * 50)
        print(f"移动文件：{self.stats['moved']}")
        print(f"跳过文件：{self.stats['skipped']}")
        print(f"错误：{self.stats['errors']}")
        print(f"总计：{self.stats['moved'] + self.stats['skipped'] + self.stats['errors']}")


def main():
    """主函数"""
    directory = input("要整理的目录（默认当前目录）：") or '.'
    
    if not os.path.isdir(directory):
        print(f"错误：'{directory}' 不是有效目录")
        return
    
    organizer = FileOrganizer(directory)
    organizer.organize()


if __name__ == "__main__":
    main()
`,
        tags: ['文件操作', '自动化', '脚本', '批量处理'],
        quality: 94,
        explanation: `
这个示例展示了：
1. 使用 pathlib 处理文件路径
2. 按扩展名分类文件
3. 自动创建目录结构
4. 处理文件名冲突

最佳实践：
- 使用 Path 对象而非字符串
- 详细的进度输出
- 完善的错误处理
- 统计信息展示
`
      }
    ];
    
    this.datasets.code = codeExamples;
    
    // 保存到文件
    const outputPath = path.join(this.outputDir, 'code_dataset.json');
    fs.writeFileSync(outputPath, JSON.stringify(codeExamples, null, 2), 'utf-8');
    
    console.log(`✅ 代码数据集已保存：${outputPath}`);
    console.log(`   样本数：${codeExamples.length}`);
    console.log(`   语言：Python, JavaScript`);
    console.log(`   类别：${[...new Set(codeExamples.map(e => e.category))].join(', ')}`);
    
    return codeExamples;
  }

  /**
   * 生成搜索数据集
   */
  async generateSearchDataset() {
    console.log('\n🔍 生成搜索数据集...\n');
    
    const searchExamples = [
      {
        id: 'search_001',
        query: 'Python 读取 CSV 文件',
        intent: 'learn_how_to',
        results: [
          {
            title: 'Python CSV 模块官方文档',
            url: 'https://docs.python.org/3/library/csv.html',
            type: 'official_doc',
            relevance: 100,
            content: 'Python 内置 csv 模块，用于读写 CSV 文件。使用 csv.reader() 读取，csv.writer() 写入。'
          },
          {
            title: 'Pandas 读取 CSV 教程',
            url: 'https://pandas.pydata.org/docs/user_guide/io.html',
            type: 'tutorial',
            relevance: 95,
            content: '使用 pandas.read_csv() 可以更便捷地读取 CSV，直接返回 DataFrame，支持多种参数。'
          },
          {
            title: 'Python 读取 CSV 的三种方法',
            url: 'https://example.com/python-read-csv',
            type: 'blog',
            relevance: 90,
            content: '1. csv 模块 2. pandas 3. numpy.loadtxt()，根据场景选择合适方法。'
          }
        ],
        bestAnswer: {
          method: 'pandas.read_csv()',
          code: `import pandas as pd\ndf = pd.read_csv('file.csv')\nprint(df.head())`,
          explanation: '对于数据分析场景，推荐使用 pandas，功能强大且易用'
        }
      },
      
      {
        id: 'search_002',
        query: 'JavaScript 数组去重',
        intent: 'solve_problem',
        results: [
          {
            title: 'MDN - Set',
            url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set',
            type: 'official_doc',
            relevance: 100,
            content: 'Set 是 ES6 新增的数据结构，成员唯一，可用于数组去重。'
          },
          {
            title: 'JavaScript 数组去重的 5 种方法',
            url: 'https://example.com/js-array-unique',
            type: 'tutorial',
            relevance: 95,
            content: '1. Set 2. filter 3. reduce 4. forEach 5. 双重循环'
          }
        ],
        bestAnswer: {
          method: 'Set + 展开运算符',
          code: `const unique = [...new Set(array)];`,
          explanation: '最简洁的方法，性能好，代码可读性强'
        }
      },
      
      {
        id: 'search_003',
        query: 'Python 异常处理最佳实践',
        intent: 'learn_best_practice',
        results: [
          {
            title: 'Python 异常处理官方指南',
            url: 'https://docs.python.org/3/tutorial/errors.html',
            type: 'official_doc',
            relevance: 100,
            content: '使用 try-except-finally，捕获特定异常，避免裸 except。'
          },
          {
            title: 'Python 异常处理 7 个最佳实践',
            url: 'https://example.com/python-exception-best-practices',
            type: 'tutorial',
            relevance: 95,
            content: '1. 捕获特定异常 2. 使用 finally 清理资源 3. 自定义异常 4. 记录异常日志...'
          }
        ],
        bestAnswer: {
          method: 'try-except-else-finally',
          code: `try:
    result = risky_operation()
except SpecificError as e:
    logger.error(f"操作失败：{e}")
    raise
else:
    return result
finally:
    cleanup_resources()`,
          explanation: '完整的异常处理结构，包含错误处理、成功分支和资源清理'
        }
      }
    ];
    
    this.datasets.search = searchExamples;
    
    const outputPath = path.join(this.outputDir, 'search_dataset.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchExamples, null, 2), 'utf-8');
    
    console.log(`✅ 搜索数据集已保存：${outputPath}`);
    console.log(`   样本数：${searchExamples.length}`);
    console.log(`   意图类型：${[...new Set(searchExamples.map(s => s.intent))].join(', ')}`);
    
    return searchExamples;
  }

  /**
   * 生成文档数据集
   */
  async generateDocsDataset() {
    console.log('\n📚 生成文档数据集...\n');
    
    const docExamples = [
      {
        id: 'doc_001',
        source: 'Python 官方文档',
        topic: '列表推导式',
        url: 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions',
        content: `
# 列表推导式

列表推导式提供了一种简洁的方式来创建列表。

## 基本语法

[expression for item in iterable]

## 示例

# 创建平方列表
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 添加条件
even_squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# 嵌套循环
pairs = [(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]
`,
        keyPoints: [
          '列表推导式比 for 循环更简洁',
          '可以包含条件过滤',
          '支持嵌套循环',
          '适用于简单转换，复杂逻辑仍用 for 循环'
        ],
        examples: [
          { code: '[x*2 for x in range(5)]', output: '[0, 2, 4, 6, 8]' },
          { code: '[x for x in range(10) if x > 5]', output: '[6, 7, 8, 9]' }
        ]
      },
      
      {
        id: 'doc_002',
        source: 'MDN Web Docs',
        topic: 'JavaScript Promise',
        url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        content: `
# Promise

Promise 对象代表一个异步操作的最终完成或失败。

## 状态

- pending: 初始状态
- fulfilled: 成功完成
- rejected: 失败

## 基本用法

const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (success) {
    resolve(value);
  } else {
    reject(error);
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
`,
        keyPoints: [
          'Promise 有三种状态',
          '状态一旦改变不可逆',
          'then() 处理成功，catch() 处理失败',
          '支持链式调用'
        ],
        examples: [
          { 
            code: 'Promise.resolve(42).then(x => console.log(x))', 
            output: '42' 
          }
        ]
      },
      
      {
        id: 'doc_003',
        source: 'Express.js 官方文档',
        topic: '中间件',
        url: 'https://expressjs.com/en/guide/using-middleware.html',
        content: `
# Express 中间件

中间件函数可以执行以下操作：

1. 执行任何代码
2. 修改请求和响应对象
3. 结束请求 - 响应循环
4. 调用下一个中间件

## 使用示例

// 应用级中间件
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// 路由级中间件
app.use('/api', apiRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
`,
        keyPoints: [
          '中间件是 Express 的核心',
          '必须调用 next() 传递控制',
          '错误处理中间件有 4 个参数',
          '中间件按定义顺序执行'
        ],
        examples: []
      }
    ];
    
    this.datasets.docs = docExamples;
    
    const outputPath = path.join(this.outputDir, 'docs_dataset.json');
    fs.writeFileSync(outputPath, JSON.stringify(docExamples, null, 2), 'utf-8');
    
    console.log(`✅ 文档数据集已保存：${outputPath}`);
    console.log(`   样本数：${docExamples.length}`);
    console.log(`   来源：${[...new Set(docExamples.map(d => d.source))].join(', ')}`);
    
    return docExamples;
  }

  /**
   * 生成最佳实践数据集
   */
  async generateBestPracticesDataset() {
    console.log('\n⭐ 生成最佳实践数据集...\n');
    
    const bestPractices = [
      {
        id: 'bp_001',
        category: 'Python 编码规范',
        title: 'PEP 8 编码规范要点',
        practices: [
          {
            rule: '缩进使用 4 个空格',
            good: 'def function():\\n    pass',
            bad: 'def function():\\n  pass  # 2 个空格',
            explanation: 'PEP 8 明确规定使用 4 个空格缩进'
          },
          {
            rule: '函数名使用小写 + 下划线',
            good: 'def calculate_total():',
            bad: 'def calculateTotal():  # 驼峰命名',
            explanation: 'Python 函数命名约定使用 snake_case'
          },
          {
            rule: '类名使用大驼峰',
            good: 'class UserProfile:',
            bad: 'class user_profile:  # 小写',
            explanation: '类名使用 PascalCase'
          },
          {
            rule: '一行不超过 79 个字符',
            good: 'long_string = (\\n    "line 1"\\n    "line 2"\\n)',
            bad: 'long_string = "line 1 line 2 line 3 ..."  # 太长',
            explanation: '保持代码可读性'
          }
        ]
      },
      
      {
        id: 'bp_002',
        category: 'JavaScript 最佳实践',
        title: '现代 JavaScript 编程规范',
        practices: [
          {
            rule: '优先使用 const，需要重新赋值时用 let',
            good: 'const PI = 3.14;\\nlet count = 0;',
            bad: 'var PI = 3.14;  // 使用 var',
            explanation: 'const 和 let 是块级作用域'
          },
          {
            rule: '使用箭头函数',
            good: 'const add = (a, b) => a + b;',
            bad: 'function add(a, b) { return a + b; }',
            explanation: '箭头函数更简洁，this 绑定更清晰'
          },
          {
            rule: '使用模板字符串',
            good: 'const msg = \`Hello, \${name}!\`;',
            bad: "const msg = 'Hello, ' + name + '!';",
            explanation: '模板字符串更易读'
          }
        ]
      },
      
      {
        id: 'bp_003',
        category: '代码审查清单',
        title: '代码审查检查项',
        practices: [
          {
            rule: '代码是否有清晰的注释',
            checklist: [
              '函数有文档字符串',
              '复杂逻辑有注释说明',
              '魔法数字有命名常量'
            ]
          },
          {
            rule: '错误处理是否完善',
            checklist: [
              '捕获特定异常',
              '记录错误日志',
              '有适当的错误提示'
            ]
          },
          {
            rule: '代码是否可测试',
            checklist: [
              '函数职责单一',
              '依赖可注入',
              '无副作用'
            ]
          }
        ]
      }
    ];
    
    this.datasets.bestPractices = bestPractices;
    
    const outputPath = path.join(this.outputDir, 'best_practices_dataset.json');
    fs.writeFileSync(outputPath, JSON.stringify(bestPractices, null, 2), 'utf-8');
    
    console.log(`✅ 最佳实践数据集已保存：${outputPath}`);
    console.log(`   样本数：${bestPractices.length}`);
    console.log(`   类别：${bestPractices.map(bp => bp.category).join(', ')}`);
    
    return bestPractices;
  }

  /**
   * 生成错误案例数据集
   */
  async generateErrorCasesDataset() {
    console.log('\n⚠️  生成错误案例数据集...\n');
    
    const errorCases = [
      {
        id: 'error_001',
        category: 'Python 常见错误',
        title: '可变默认参数陷阱',
        error: {
          code: `def append_item(item, list=[]):
    list.append(item)
    return list

# 问题
print(append_item(1))  # [1]
print(append_item(2))  # [1, 2] 期望 [2]`,
          problem: '默认参数在函数定义时只求值一次',
          consequence: '多次调用共享同一个列表对象'
        },
        solution: {
          code: `def append_item(item, list=None):
    if list is None:
        list = []
    list.append(item)
    return list`,
          explanation: '使用 None 作为默认值，在函数内部创建新列表'
        },
        lesson: '永远不要用可变对象作为默认参数'
      },
      
      {
        id: 'error_002',
        category: 'JavaScript 常见错误',
        title: '异步代码中的闭包问题',
        error: {
          code: `for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);  // 输出 5 次 5，期望 0,1,2,3,4
  }, 1000);
}`,
          problem: 'var 是函数作用域，所有循环共享同一个 i',
          consequence: 'setTimeout 回调执行时 i 已经变成 5'
        },
        solution: {
          code: `// 方法 1: 使用 let
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);  // 0,1,2,3,4
  }, 1000);
}

// 方法 2: 使用 IIFE
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(() => {
      console.log(j);
    }, 1000);
  })(i);
}`,
          explanation: 'let 创建块级作用域，或使用 IIFE 创建独立作用域'
        },
        lesson: '在循环中使用异步函数时，优先使用 let 而非 var'
      },
      
      {
        id: 'error_003',
        category: '数据库操作错误',
        title: 'SQL 注入漏洞',
        error: {
          code: `# 危险！用户输入直接拼接到 SQL
username = input("Username: ")
query = f"SELECT * FROM users WHERE username = '{username}'"
cursor.execute(query)`,
          problem: '用户输入未经过滤直接拼接到 SQL 语句',
          consequence: "攻击者可输入 \"' OR '1'='1\" 绕过认证"
        },
        solution: {
          code: `# 使用参数化查询
username = input("Username: ")
query = "SELECT * FROM users WHERE username = ?"
cursor.execute(query, (username,))`,
          explanation: '参数化查询会自动转义用户输入'
        },
        lesson: '永远不要拼接 SQL，始终使用参数化查询'
      }
    ];
    
    this.datasets.errorCases = errorCases;
    
    const outputPath = path.join(this.outputDir, 'error_cases_dataset.json');
    fs.writeFileSync(outputPath, JSON.stringify(errorCases, null, 2), 'utf-8');
    
    console.log(`✅ 错误案例数据集已保存：${outputPath}`);
    console.log(`   样本数：${errorCases.length}`);
    console.log(`   类别：${errorCases.map(e => e.category).join(', ')}`);
    
    return errorCases;
  }

  /**
   * 生成所有数据集
   */
  async generateAllDatasets() {
    console.log('🚀 开始生成数据集...\n');
    console.log('=' .repeat(70));
    
    // 创建输出目录
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    // 生成各个数据集
    await this.generateCodeDataset();
    await this.generateSearchDataset();
    await this.generateDocsDataset();
    await this.generateBestPracticesDataset();
    await this.generateErrorCasesDataset();
    
    // 输出总结
    console.log('\n' + '='.repeat(70));
    console.log('📊 数据集生成完成总结');
    console.log('='.repeat(70));
    
    const totalSamples = 
      this.datasets.code.length +
      this.datasets.search.length +
      this.datasets.docs.length +
      this.datasets.bestPractices.length +
      this.datasets.errorCases.length;
    
    console.log(`\\n生成数据集类型：5 种`);
    console.log(`总样本数：${totalSamples}`);
    console.log(`输出目录：${this.outputDir}`);
    
    console.log('\\n详细统计:');
    console.log(`  📝 代码数据集：${this.datasets.code.length} 个样本`);
    console.log(`  🔍 搜索数据集：${this.datasets.search.length} 个样本`);
    console.log(`  📚 文档数据集：${this.datasets.docs.length} 个样本`);
    console.log(`  ⭐ 最佳实践：${this.datasets.bestPractices.length} 个类别`);
    console.log(`  ⚠️  错误案例：${this.datasets.errorCases.length} 个案例`);
    
    console.log('\\n✅ 所有数据集已保存到 datasets/ 目录');
    console.log('='.repeat(70));
    
    return {
      success: true,
      totalSamples,
      datasets: this.datasets,
      outputDir: this.outputDir
    };
  }
}

// 导出
export default DatasetGenerator;
