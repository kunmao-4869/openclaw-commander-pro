# Playwright Skill

## 元数据

- **名称**: Playwright 浏览器自动化
- **版本**: 1.0.0
- **分类**: 编程开发
- **触发关键词**: Playwright, 浏览器自动化，网页测试，自动化操作
- **优先级**: 高

## 描述

浏览器自动化神器。赋予 AI"双手"，让它能自动打开网页、点击按钮、填写表单、截图等。无论是自动化测试还是批量处理网页操作，都能极大解放双手。

## 能力范围

✅ **支持的操作**:
- 打开网页并导航
- 点击按钮和链接
- 填写表单
- 截图和录屏
- 下载文件
- 处理弹窗
- 等待元素加载
- 执行 JavaScript
- 多浏览器支持（Chrome、Firefox、Safari）
- 移动端模拟

## 使用场景

1. **自动化测试**: E2E 测试、回归测试
2. **数据抓取**: 批量采集网页数据
3. **表单自动化**: 自动填写重复表单
4. **截图监控**: 定期检查页面状态
5. **流程自动化**: 重复性网页操作

## 快速示例

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 导航到页面
  await page.goto('https://example.com');
  
  // 点击按钮
  await page.click('text=Sign Up');
  
  // 填写表单
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'secure123');
  
  // 提交
  await page.click('button[type="submit"]');
  
  // 截图
  await page.screenshot({ path: 'result.png' });
  
  await browser.close();
})();
```

## 相关文件

- `scripts/playwright-automation.py` - 自动化脚本
- `references/selectors-guide.md` - 元素定位指南
