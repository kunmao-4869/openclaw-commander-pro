# Exec-Guard Skill

## 元数据

- **名称**: Exec-Guard（执行守卫）
- **版本**: 1.0.0
- **分类**: 安全与风控
- **触发关键词**: 执行监控，命令防护，运行时安全，操作审计
- **优先级**: 极高 ⚠️ **强烈推荐优先安装**

## 描述

运行时监控系统，防止 Skill 在执行过程中调用危险命令。守住安全的第一道防线，即使恶意代码绕过了静态检查，也能在执行时被拦截。

## 核心功能

### 🛡️ 实时监控

1. **命令拦截**
   - 拦截所有系统调用
   - 白名单机制
   - 实时风险评估

2. **行为审计**
   - 记录所有操作
   - 生成审计日志
   - 异常行为告警

3. **沙箱隔离**
   - 限制资源访问
   - 网络访问控制
   - 文件系统隔离

### 🚫 禁止的命令

```python
# 高危命令黑名单
BLOCKED_COMMANDS = [
    'rm -rf /',           # 删除根目录
    'dd if=/dev/zero',    # 磁盘擦除
    'mkfs',               # 格式化
    'chmod 777',          # 危险权限
    'curl | bash',        # 远程执行
    'wget | sh',          # 远程执行
    'nc -e /bin/bash',    # 反弹 shell
    'python -c "import socket..."'  # 网络后门
]

# 限制的资源
RESOURCE_LIMITS = {
    'cpu_time': 60,       # 60 秒
    'memory': '512MB',    # 内存限制
    'disk_io': '10MB/s',  # 磁盘 IO
    'network': False      # 禁止网络
}
```

## 监控流程

```
Skill 执行请求
   ↓
命令解析
   ↓
风险评估
   ↓
[高风险] → 拦截并告警
   ↓
[低风险] → 白名单检查
   ↓
[通过] → 执行并记录
   ↓
[拒绝] → 返回错误
```

## 审计报告

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "skill_name": "data-processor",
  "action": "execute_command",
  "command": "ls -la /home/user",
  "risk_level": "medium",
  "decision": "allowed",
  "reason": "在允许范围内",
  "user": "alice",
  "session_id": "sess_12345"
}
```

## 告警级别

| 级别 | 颜色 | 触发条件 | 响应 |
|------|------|----------|------|
| 信息 | 🔵 | 正常操作 | 记录日志 |
| 警告 | 🟡 | 可疑操作 | 用户确认 |
| 严重 | 🟠 | 危险操作 | 立即拦截 |
| 致命 | 🔴 | 恶意攻击 | 拦截 + 封禁 |

## 相关文件

- `scripts/runtime-monitor.py` - 运行时监控
- `scripts/command-interceptor.py` - 命令拦截
- `scripts/audit-logger.py` - 审计日志
- `references/whitelist-commands.md` - 命令白名单
- `database/risk-signatures.db` - 风险特征库

## 配置示例

```yaml
# exec-guard 配置
security:
  mode: strict  # strict|moderate|permissive
  
  whitelist:
    - 'ls'
    - 'cat'
    - 'grep'
    - 'find'
  
  blacklist:
    - 'rm -rf'
    - 'curl | bash'
    - 'wget | sh'
  
  limits:
    max_cpu_time: 60
    max_memory: 512MB
    allow_network: false
  
  audit:
    enabled: true
    log_path: /var/log/exec-guard/
    retention_days: 30
```

## 与其他安全技能协同

- ✅ **Skill-Vetter**: 静态 + 动态双重检查
- ✅ **Self-Improving Agent**: 学习新的攻击模式
- ✅ **Code-Review**: 代码审查时识别安全隐患

## 注意事项

⚠️ **重要提醒**:
- 定期更新黑名单
- 审查审计日志
- 及时调整白名单
- 沙箱环境测试新 Skill

💡 **最佳实践**:
- 最小权限原则
- 默认拒绝策略
- 异常行为告警
- 定期安全演练

## 快速启动

```bash
# 启动监控
exec-guard start

# 查看状态
exec-guard status

# 查看审计日志
exec-guard logs --today

# 添加白名单
exec-guard whitelist add "my-command"

# 生成报告
exec-guard report --weekly
```
