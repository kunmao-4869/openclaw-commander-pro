# Tavily Search Skill

## 元数据

- **名称**: Tavily Search
- **版本**: 1.0.0
- **分类**: 通用提效
- **触发关键词**: Tavily, 搜索，资料搜集，竞品分析，调研
- **优先级**: 高

## 描述

专为 AI 优化的结构化搜索引擎。与传统搜索引擎不同，Tavily 提供结构化、可信赖的搜索结果，比传统搜索引擎更适合 AI 处理。适合快速搜集资料、做竞品分析、市场调研等场景。

## 能力范围

✅ **支持的操作**:
- 智能搜索（理解搜索意图）
- 结构化结果提取
- 多来源信息整合
- 事实核查
- 竞品分析
- 市场调研
- 最新信息查询

❌ **不支持的操作**:
- 访问付费墙内容
- 搜索深网内容
- 实时社交媒体动态

## 使用场景

1. **资料搜集**: 快速找到权威来源的信息
2. **竞品分析**: 搜集竞争对手信息
3. **市场调研**: 获取行业数据和趋势
4. **事实核查**: 验证信息准确性
5. **学术研究**: 查找论文和参考资料
6. **新闻追踪**: 获取最新行业动态

## 操作流程（SOP）

### 1. 基础搜索

```
用户：帮我搜索一下量子计算的最新进展
AI:
  1. 理解搜索意图（技术进展）
  2. 构建搜索查询
  3. 调用 Tavily API
  4. 整合多个来源
  5. 返回结构化结果
```

### 2. 竞品分析

```
用户：分析一下 A 公司和 B 公司的产品差异
AI:
  1. 分别搜索两家公司
  2. 搜索产品对比信息
  3. 提取关键参数
  4. 制作对比表格
  5. 给出分析结论
```

### 3. 深度调研

```
用户：我要做新能源汽车的市场调研
AI:
  1. 市场规模搜索
  2. 主要玩家搜索
  3. 技术趋势搜索
  4. 政策环境搜索
  5. 整合为完整报告
```

## 参数规范

```json
{
  "query": "搜索关键词",
  "searchType": "general|news|academic|technical",
  "maxResults": 10,
  "timeRange": "day|week|month|year|all",
  "includeDomains": ["example.com"],
  "excludeDomains": ["spam.com"],
  "factCheck": true
}
```

## 搜索结果结构

```markdown
## 搜索结果：[查询主题]

### 📊 核心发现
- 关键点 1
- 关键点 2
- 关键点 3

### 📰 信息来源
1. **来源 1** (可信度：高)
   - 标题
   - 摘要
   - URL

2. **来源 2** (可信度：中)
   - 标题
   - 摘要
   - URL

### 🔍 事实核查
- ✅ 已验证：事实 1
- ⚠️ 待确认：事实 2
- ❌ 虚假信息：事实 3

### 📈 数据摘要
| 指标 | 数值 | 来源 |
|------|------|------|
| 市场规模 | XXX | 来源 1 |
| 增长率 | XX% | 来源 2 |
```

## 示例对话

**用户**: 帮我搜索一下 2024 年 AI 大模型的最新进展

**AI**: 正在使用 Tavily 搜索最新信息...

## 📊 核心发现

1. **多模态能力突破**: GPT-4V、Gemini 等模型在视觉理解上取得重大进展
2. **长上下文**: Claude 支持 200K token 上下文，能处理整本书
3. **推理能力提升**: o1 等模型在数学和逻辑推理上接近人类专家水平
4. **小型化趋势**: 7B-70B 参数模型性能接近超大模型，适合本地部署
5. **Agent 能力**: AI 能自主完成复杂任务，如编程、数据分析

## 📰 信息来源

1. **TechCrunch** (可信度：高)
   - 标题：AI Models in 2024: What's New
   - 摘要：年度 AI 模型技术盘点
   - URL: techcrunch.com/ai-2024-review

2. **MIT Technology Review** (可信度：高)
   - 标题：The State of AI in 2024
   - 摘要：MIT 年度 AI 报告
   - URL: technologyreview.com/ai-state-2024

3. **ArXiv** (可信度：高)
   - 标题：Recent Advances in Large Language Models
   - 摘要：最新学术论文综述
   - URL: arxiv.org/abs/2024.xxxxx

## 🔍 事实核查

- ✅ 已验证：GPT-4 支持 128K 上下文
- ✅ 已验证：Gemini Ultra 在多个基准测试中超越 GPT-4
- ⚠️ 待确认：某公司声称的 1T 参数模型

## 📈 关键数据

| 模型 | 参数量 | 上下文 | 发布公司 |
|------|--------|--------|----------|
| GPT-4 Turbo | ~1T | 128K | OpenAI |
| Gemini Ultra | 未公开 | 32K | Google |
| Claude 3 | 未公开 | 200K | Anthropic |

需要我详细搜索某个具体方向吗？

## 相关文件

- `scripts/tavily-search.py` - Tavily 搜索脚本
- `scripts/fact-check.py` - 事实核查脚本
- `references/search-operators.md` - 搜索技巧参考

## 注意事项

⚠️ **使用限制**:
- 免费版本有搜索次数限制
- 某些专业数据库无法访问
- 实时性不如 Twitter 等社交媒体

💡 **最佳实践**:
- 使用具体、明确的搜索词
- 添加时间范围获取最新信息
- 交叉验证重要信息
- 优先选择权威来源

## API 配置

```python
# 需要配置 Tavily API Key
TAVILY_API_KEY = "your_api_key_here"

# 搜索配置
SEARCH_CONFIG = {
    "search_depth": "advanced",  # basic / advanced
    "include_answer": True,
    "include_raw_content": False,
    "max_results": 10
}
```

## 与传统搜索对比

| 特性 | Tavily | Google | Bing |
|------|--------|--------|------|
| 结构化输出 | ✅ | ❌ | ❌ |
| AI 优化 | ✅ | 部分 | 部分 |
| 事实核查 | ✅ | ❌ | ❌ |
| 来源可信度评分 | ✅ | ❌ | ❌ |
| 免费额度 | 1000 次/月 | 无限 | 无限 |
