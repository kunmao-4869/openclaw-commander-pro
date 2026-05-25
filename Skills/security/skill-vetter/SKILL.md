# Skill-Vetter Skill

## 元数据

- **名称**: Skill-Vetter（技能审查员）
- **版本**: 1.0.0
- **分类**: 安全与风控
- **触发关键词**: 安全检查，代码扫描，恶意检测，技能审核
- **优先级**: 极高 ⚠️ **强烈推荐优先安装**

## 描述

在安装任何新的第三方 Skill 前，自动扫描其代码，检查是否有可疑行为。相当于给 AI 装了一个"杀毒软件"，防止恶意技能损害系统或窃取数据。

## 安全检查项

### 🔍 静态代码分析

1. **危险函数调用**
   - `eval()` / `exec()` - 代码执行
   - `os.system()` - 系统命令
   - `subprocess.Popen()` - 进程创建
   - `__import__()` - 动态导入

2. **网络访问**
   - 未授权的外网请求
   - 敏感数据外传
   - 可疑的 API 调用

3. **文件系统**
   - 敏感目录访问
   - 批量文件操作
   - 隐藏文件创建

4. **环境变量**
   - 读取敏感变量
   - 修改系统配置
   - 权限提升尝试

### 🛡️ 行为分析

```python
# 危险模式检测
dangerous_patterns = {
    'crypto_miner': ['hashlib', 'socket', 'threading'],
    'data_stealer': ['keylogger', 'clipboard', 'screenshot'],
    'backdoor': ['reverse_shell', 'bind_shell', 'c2_beacon'],
    'ransomware': ['encrypt_files', 'bitcoin_address', 'ransom_note']
}
```

## 扫描流程

```
1. 接收 Skill 包
   ↓
2. 解压并分析结构
   ↓
3. 静态代码扫描
   ↓
4. 依赖关系检查
   ↓
5. 行为模式匹配
   ↓
6. 生成安全报告
   ↓
7. 给出安装建议
```

## 风险等级

| 等级 | 标识 | 说明 | 建议 |
|------|------|------|------|
| 安全 | ✅ | 无风险 | 可放心安装 |
| 低风险 | 🟢 | 轻微问题 | 注意观察 |
| 中风险 | 🟡 | 可疑行为 | 谨慎安装 |
| 高风险 | 🟠 | 明确风险 | 不建议安装 |
| 危险 | 🔴 | 恶意代码 | 禁止安装 |

## 扫描报告示例

```markdown
## Skill 安全扫描报告

**技能名称**: awesome-skill
**版本**: 1.0.0
**扫描时间**: 2024-01-15 10:30:00

### 综合评级：🟡 中风险

### 检测到的问题

#### ⚠️ 警告 (3 个)

1. **使用 eval() 函数**
   - 位置：src/main.py:45
   - 风险：可能执行任意代码
   - 建议：改用 ast.literal_eval()

2. **网络请求无验证**
   - 位置：src/fetcher.py:23
   - 风险：可能泄露数据
   - 建议：添加 SSL 验证

3. **访问敏感目录**
   - 位置：src/utils.py:78
   - 风险：可能读取隐私文件
   - 建议：限制访问范围

### 依赖检查
✅ 所有依赖都是官方包
✅ 无已知漏洞

### 建议
⚠️ 建议作者修复上述问题后再安装
❓ 如确需使用，请在沙箱环境中运行
```

## 相关文件

- `scripts/skill-scanner.py` - 技能扫描脚本
- `scripts/dependency-checker.py` - 依赖检查
- `references/security-patterns.md` - 安全模式库
- `database/known-vulnerabilities.db` - 已知漏洞库

## 自动化集成

```bash
# 安装前自动扫描
skill-vetter scan ./new-skill.zip

# 批量扫描
skill-vetter scan-all ./skills/

# 生成报告
skill-vetter report --format=html
```

## 注意事项

⚠️ **重要提醒**:
- 安装任何第三方 Skill 前必须扫描
- 即使扫描通过也要在沙箱测试
- 定期更新病毒库
- 报告问题给 Skill 作者

💡 **最佳实践**:
- 优先使用官方认证 Skill
- 查看 Skill 作者信誉
- 阅读用户评价
- 检查更新频率
