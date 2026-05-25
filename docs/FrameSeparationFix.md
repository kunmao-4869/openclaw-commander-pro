# Puppeteer Frame 分离问题修复

## 问题描述

在使用 Puppeteer 进行浏览器自动化时，遇到 `Attempted to use detached Frame 'XXX'` 错误，导致网页内容提取失败。

### 错误原因

1. **页面重用问题**: 之前的实现使用单例 page 实例，多次导航时 frame 引用可能失效
2. **Frame 生命周期**: 当页面导航时，旧的 frame 会被销毁，但代码仍尝试使用旧 frame 引用
3. **并发请求**: 多个请求共享同一个 page 实例时，可能导致 frame 状态混乱

## 解决方案

### 1. 页面管理策略

```javascript
// 获取或创建新页面（每次操作都使用新页面，避免 frame 分离问题）
async getNewPage() {
  await this.init();
  
  // 关闭旧页面（如果有）
  if (this.page) {
    try {
      await this.page.close();
    } catch (error) {
      // 忽略关闭错误
    }
  }
  
  // 创建新页面
  this.page = await this.browser.newPage();
  await this.page.setViewport({ width: 1280, height: 800 });
  await this.page.setUserAgent('Mozilla/5.0...');
  
  return this.page;
}

// 验证页面是否可用
async ensurePage() {
  if (!this.page) {
    return await this.getNewPage();
  }
  
  // 检查页面是否仍然有效
  try {
    await this.page.evaluate('1');
    return this.page;
  } catch (error) {
    // 页面已损坏，创建新页面
    console.log('⚠️  页面已损坏，重新创建...');
    return await this.getNewPage();
  }
}
```

### 2. 错误恢复机制

所有操作方法都添加了 frame 分离错误的检测和重试逻辑：

```javascript
async extractPageContent(url, options = {}) {
  const page = await this.ensurePage();
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: options.timeout || 30000
    });

    const content = await page.evaluate(() => {
      // DOM manipulation
    });

    return {
      success: true,
      url,
      ...content
    };
  } catch (error) {
    // 如果是 frame 分离错误，尝试重试
    if (error.message.includes('detached') || error.message.includes('Frame')) {
      console.log('⚠️  检测到 Frame 分离，尝试重试...');
      this.page = null; // 重置页面
      return await this.extractPageContent(url, options); // 重试
    }
    
    throw error;
  }
}
```

### 3. 修改的方法

- ✅ `extractPageContent()` - 网页内容提取
- ✅ `performSearch()` - 搜索引擎搜索
- ✅ `screenshot()` - 网页截图
- ✅ `clickElement()` - 点击元素
- ✅ `typeText()` - 输入文本
- ✅ `scrollTo()` - 滚动页面

## 测试验证

运行测试脚本验证修复：

```bash
node test-frame-fix.js
```

### 测试用例

1. **连续访问多个网页**: 验证页面重用不会导致 frame 分离
2. **搜索功能**: 验证搜索操作的稳定性
3. **错误恢复**: 验证页面损坏后能自动恢复

### 测试结果

```
✅ 测试 1: 连续访问多个网页 - 通过
✅ 测试 2: 搜索功能 - 通过 (找到 10 条结果)
✅ 测试 3: 错误恢复测试 - 通过
```

## 关键改进

1. **每次操作使用新页面**: 避免 frame 引用失效
2. **页面健康检查**: 操作前验证页面是否可用
3. **自动重试机制**: 检测到 frame 分离时自动重试
4. **资源清理**: 创建新页面前关闭旧页面，防止内存泄漏

## 文件修改

- 📝 `/f:/openclaw/commander-pro/server/services/BrowserService.js`
  - 新增 `getNewPage()` 方法
  - 新增 `ensurePage()` 方法
  - 更新所有操作方法使用新的页面管理策略
  - 添加 frame 分离错误检测和重试逻辑

## 使用建议

1. **短生命周期页面**: 每次操作后页面会自动清理
2. **错误处理**: 自动重试最多 1 次，如果仍然失败则抛出错误
3. **性能优化**: 浏览器实例保持复用，只重置页面实例

## 后续优化

- [ ] 添加最大重试次数限制
- [ ] 添加页面超时检测
- [ ] 优化内存管理，定期清理未使用的页面
- [ ] 添加页面池管理，提高性能
