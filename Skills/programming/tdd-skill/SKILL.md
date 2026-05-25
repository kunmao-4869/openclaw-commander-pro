# TDD Skill

## 元数据

- **名称**: TDD（测试驱动开发）
- **版本**: 1.0.0
- **分类**: 编程开发
- **触发关键词**: TDD, 测试驱动，单元测试，红绿重构
- **优先级**: 高

## 描述

测试驱动开发技能。让 AI 严格遵循"红 - 绿 - 重构"的 TDD 流程，先写失败的测试用例，再写最小通过代码，最后引导重构，帮助团队形成规范。

## TDD 流程

### 🔄 红 - 绿 - 重构循环

```
1. 🔴 红：写一个失败的测试
   ↓
2. 🟢 绿：写最简单的代码让测试通过
   ↓
3. 🔄 重构：优化代码，保持测试通过
   ↓
4. 重复循环
```

## 核心原则

1. **测试先行**: 先写测试，再写实现
2. **小步快跑**: 每次只添加一个小功能
3. **简单至上**: 写刚好能通过测试的代码
4. **持续重构**: 保持代码整洁
5. **测试即文档**: 测试描述代码行为

## 实践示例

```javascript
// 1. 🔴 写测试
test('should add two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

// 2. 🟢 写实现
function add(a, b) {
  return a + b;
}

// 3. 🔄 重构（如有必要）
// 添加类型检查和错误处理
function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Parameters must be numbers');
  }
  return a + b;
}
```

## 相关文件

- `scripts/tdd-helper.py` - TDD 辅助脚本
- `references/testing-patterns.md` - 测试模式
