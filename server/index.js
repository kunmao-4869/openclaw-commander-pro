/**
 * OpenClaw 本地服务
 * 处理需要 Node.js 环境的系统操作
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WebAppController } from './services/PuppeteerService.js';
import { UIAutomation } from './services/UIAutomationService.js';
import { browserService } from './services/BrowserService.js';
import skillsRouter from './routes/skills.js';
import { skillExecutor } from '../src/skills/core/SkillExecutor.js';
import { ReadRequirementSkill } from '../src/skills/file/ReadRequirement.js';
import { SafeFileReadSkill, SafeFileListSkill } from '../src/skills/security/SafeFileOperations.js';
import { SafeFileWriteSkill } from '../src/skills/advanced/SafeFileWrite.js';
import { CodeGenerationSkill, CodeReviewSkill } from '../src/skills/advanced/CodeGeneration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3003;

// 中间件
app.use(cors());
app.use(express.json());

// Skills API 路由
app.use('/api/skills', skillsRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      puppeteer: 'loaded',
      uiautomation: 'loaded'
    }
  });
});

// 启动应用
app.post('/api/launch', async (req, res) => {
  const { appName, appPath, args = [] } = req.body;
  
  if (!appName && !appPath) {
    return res.status(400).json({ error: '需要提供应用名称或路径' });
  }

  try {
    const { exec } = await import('child_process');
    const platform = process.platform;

    let command;
    
    // 如果提供了完整路径，直接使用
    if (appPath) {
      // 处理路径中的空格和特殊字符
      const escapedPath = appPath.replace(/"/g, '\\"');
      
      if (platform === 'win32') {
        // Windows: start "" "path" [args]
        const argsStr = args.length > 0 ? ' ' + args.join(' ') : '';
        command = `start "" "${escapedPath}"${argsStr}`;
      } else if (platform === 'darwin') {
        // macOS: open -a "path" [args]
        const argsStr = args.length > 0 ? ' --args ' + args.join(' ') : '';
        command = `open -a "${escapedPath}"${argsStr}`;
      } else {
        // Linux: "path" [args]
        const argsStr = args.length > 0 ? ' ' + args.join(' ') : '';
        command = `"${escapedPath}"${argsStr}`;
      }
    } else {
      // 使用应用名称启动
      const appMappings = {
        '抖音': 'douyin',
        'tiktok': 'tiktok',
        '哔哩哔哩': 'bilibili',
        'bilibili': 'bilibili',
        'chrome': 'chrome',
        'edge': 'msedge',
        'firefox': 'firefox',
        '微信': 'wechat',
        'qq': 'qq',
        'vscode': 'code',
        '网易云音乐': 'cloudmusic',
        'netease': 'cloudmusic',
        '豆包': 'doubao',
        'idea': 'idea64',
        'intellij': 'idea64',
        'trae': 'trae',
        'deveco': 'devecostudio64',
      };

      const actualApp = appMappings[appName.toLowerCase()] || appName;

      if (platform === 'win32') {
        command = `start "" "${actualApp}"`;
      } else if (platform === 'darwin') {
        command = `open -a "${actualApp}"`;
      } else {
        command = `xdg-open "${actualApp}"`;
      }
    }

    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    await execAsync(command, { timeout: 5000 });

    res.json({
      success: true,
      app: appName || appPath,
      message: `已启动应用：${appName || appPath}`,
    });
  } catch (error) {
    console.error('启动应用失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: `启动应用"${appName || appPath}"失败`,
    });
  }
});

// 搜索已安装应用
app.get('/api/apps', async (req, res) => {
  try {
    const { exec } = await import('child_process');
    const platform = process.platform;

    let command;
    let apps = [];

    if (platform === 'win32') {
      command = `powershell -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion, Publisher | Where-Object { $_.DisplayName -ne $null } | ConvertTo-Json"`;
      
      const { stdout } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 2,
        timeout: 10000,
      });

      try {
        const data = JSON.parse(stdout);
        apps = data.map(app => ({
          name: app.DisplayName,
          version: app.DisplayVersion || '未知',
          publisher: app.Publisher || '未知',
        })).slice(0, 100);
      } catch {
        apps = [];
      }
    }

    res.json({
      success: true,
      apps,
      total: apps.length,
      platform,
    });
  } catch (error) {
    console.error('获取应用列表失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      apps: [],
    });
  }
});

// 打开网址
app.post('/api/open-url', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: '需要提供网址' });
  }

  try {
    // 验证 URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return res.status(400).json({ error: '只支持 http/https 协议' });
    }

    const { exec } = await import('child_process');
    const platform = process.platform;

    let command;
    if (platform === 'win32') {
      command = `start "" "${url}"`;
    } else if (platform === 'darwin') {
      command = `open "${url}"`;
    } else {
      command = `xdg-open "${url}"`;
    }

    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    await execAsync(command, { timeout: 5000 });

    res.json({
      success: true,
      url,
      message: `已打开网址：${url}`,
    });
  } catch (error) {
    console.error('打开网址失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== 文件系统服务 ====================

// 列出目录内容
app.post('/api/fs/list', async (req, res) => {
  const { path, type = 'all' } = req.body;
  
  try {
    const fs = await import('fs/promises');
    const nodePath = await import('path');
    
    const targetPath = path || '.';
    
    // 安全检查：防止路径遍历攻击
    const resolvedPath = nodePath.default.resolve(targetPath);
    
    // 读取目录
    const entries = await fs.default.readdir(resolvedPath, { withFileTypes: true });
    
    const result = {
      success: true,
      currentPath: resolvedPath,
      directories: [],
      files: []
    };
    
    // 添加父目录选项（如果不是根目录）
    if (resolvedPath !== nodePath.default.dirname(resolvedPath)) {
      result.directories.push({
        name: '..',
        path: nodePath.default.dirname(resolvedPath),
        isParent: true
      });
    }
    
    // 过滤和分类条目
    for (const entry of entries) {
      // 跳过隐藏文件和 node_modules
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }
      
      const item = {
        name: entry.name,
        path: nodePath.default.join(resolvedPath, entry.name)
      };
      
      if (entry.isDirectory() && (type === 'all' || type === 'directories')) {
        result.directories.push(item);
      } else if (entry.isFile() && (type === 'all' || type === 'files')) {
        result.files.push(item);
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('列出目录失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      directories: [],
      files: []
    });
  }
});

// 保存文件
app.post('/api/file/save', async (req, res) => {
  const { filename, content, projectDir, encoding = 'utf-8' } = req.body;
  
  if (!filename) {
    return res.status(400).json({ 
      success: false,
      error: '需要提供文件名' 
    });
  }
  
  if (!content) {
    return res.status(400).json({ 
      success: false,
      error: '需要提供文件内容' 
    });
  }
  
  try {
    const fs = await import('fs/promises');
    const nodePath = await import('path');
    
    // 确定保存目录
    let saveDir;
    if (projectDir) {
      saveDir = nodePath.default.resolve(projectDir);
    } else {
      saveDir = nodePath.default.join(__dirname, '..', 'generated');
    }
    
    // 确保目录存在
    await fs.default.mkdir(saveDir, { recursive: true });
    
    // 构建完整路径
    const fullPath = nodePath.default.join(saveDir, filename);
    
    // 安全检查：确保路径在目标目录内
    const resolvedPath = nodePath.default.resolve(fullPath);
    if (!resolvedPath.startsWith(saveDir)) {
      return res.status(403).json({
        success: false,
        error: '不允许的路径'
      });
    }
    
    // 确保父目录存在
    const parentDir = nodePath.default.dirname(resolvedPath);
    await fs.default.mkdir(parentDir, { recursive: true });
    
    // 保存文件
    await fs.default.writeFile(resolvedPath, content, encoding);
    
    console.log(`✅ 文件已保存：${resolvedPath}`);
    
    res.json({ 
      success: true, 
      path: resolvedPath,
      message: '文件保存成功',
      size: content.length
    });
  } catch (error) {
    console.error('❌ 保存文件失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 扫描图片资源
app.post('/api/file/scan-images', async (req, res) => {
  const { path } = req.body;
  
  if (!path) {
    return res.status(400).json({ 
      success: false,
      error: '需要提供图片目录路径' 
    });
  }
  
  try {
    const fs = await import('fs/promises');
    const nodePath = await import('path');
    
    const resolvedPath = nodePath.default.resolve(path);
    
    // 检查目录是否存在
    await fs.default.access(resolvedPath);
    
    // 读取目录内容
    const files = await fs.default.readdir(resolvedPath);
    
    // 过滤出图片文件
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = nodePath.default.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    console.log(`🖼️  扫描到 ${imageFiles.length} 个图片文件`);
    
    res.json({ 
      success: true,
      path: resolvedPath,
      files: imageFiles,
      count: imageFiles.length
    });
  } catch (error) {
    console.error('❌ 扫描图片失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 读取文件
app.get('/api/file/read', async (req, res) => {
  const { path, encoding = 'utf-8' } = req.query;
  
  if (!path) {
    return res.status(400).json({ 
      success: false,
      error: '需要提供文件路径' 
    });
  }
  
  try {
    const fs = await import('fs/promises');
    const nodePath = await import('path');
    
    const resolvedPath = nodePath.default.resolve(path);
    
    // 检查文件是否存在
    await fs.default.access(resolvedPath);
    
    // 读取文件
    const content = await fs.default.readFile(resolvedPath, encoding);
    
    res.json({ 
      success: true,
      path: resolvedPath,
      content,
      size: content.length
    });
  } catch (error) {
    console.error('❌ 读取文件失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 删除文件
app.delete('/api/file/delete', async (req, res) => {
  const { path } = req.body;
  
  if (!path) {
    return res.status(400).json({ 
      success: false,
      error: '需要提供文件路径' 
    });
  }
  
  try {
    const fs = await import('fs/promises');
    const nodePath = await import('path');
    
    const resolvedPath = nodePath.default.resolve(path);
    
    // 检查文件是否存在
    await fs.default.access(resolvedPath);
    
    // 删除文件
    await fs.default.unlink(resolvedPath);
    
    console.log(`✅ 文件已删除：${resolvedPath}`);
    
    res.json({ 
      success: true,
      path: resolvedPath,
      message: '文件删除成功'
    });
  } catch (error) {
    console.error('❌ 删除文件失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 创建目录
app.post('/api/fs/mkdir', async (req, res) => {
  const { path } = req.body;
  
  if (!path) {
    return res.status(400).json({ 
      success: false,
      error: '需要提供目录路径' 
    });
  }
  
  try {
    const fs = await import('fs/promises');
    const nodePath = await import('path');
    
    const resolvedPath = nodePath.default.resolve(path);
    
    // 创建目录
    await fs.default.mkdir(resolvedPath, { recursive: true });
    
    console.log(`✅ 目录已创建：${resolvedPath}`);
    
    res.json({ 
      success: true,
      path: resolvedPath,
      message: '目录创建成功'
    });
  } catch (error) {
    console.error('❌ 创建目录失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ==================== Puppeteer Web 应用控制 ====================

// 打开 Web 应用
app.post('/api/webapp/open', async (req, res) => {
  try {
    const { appName, url } = req.body;
    const result = await WebAppController.openWebApp(appName, { url });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Web 应用搜索
app.post('/api/webapp/search', async (req, res) => {
  try {
    const { appName, query } = req.body;
    const result = await WebAppController.webAppSearch(appName, query);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 点击元素
app.post('/api/webapp/click', async (req, res) => {
  try {
    const { appName, selector } = req.body;
    const result = await WebAppController.webAppClick(appName, selector);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取页面内容
app.get('/api/webapp/content/:appName', async (req, res) => {
  try {
    const result = await WebAppController.webAppGetContent(req.params.appName);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 截图
app.post('/api/webapp/screenshot', async (req, res) => {
  try {
    const { appName, filename } = req.body;
    const result = await WebAppController.webAppScreenshot(appName, filename);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 关闭浏览器
app.post('/api/webapp/close', async (req, res) => {
  try {
    const { appName } = req.body;
    const result = await WebAppController.closeBrowser(appName);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取支持的 Web 应用
app.get('/api/webapp/list', (req, res) => {
  res.json({
    success: true,
    apps: WebAppController.getSupportedApps()
  });
});

// ==================== Browser Service 浏览器自动化服务 ====================

// 浏览器搜索
app.post('/api/browser/search', async (req, res) => {
  try {
    const { query, engine = 'bing' } = req.body;
    const result = await browserService.performSearch(query, engine);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 提取网页内容
app.post('/api/browser/extract', async (req, res) => {
  try {
    const { url, timeout, returnHtml } = req.body;
    const result = await browserService.extractPageContent(url, { timeout, returnHtml });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 浏览器截图
app.post('/api/browser/screenshot', async (req, res) => {
  try {
    const { url, outputPath } = req.body;
    const result = await browserService.screenshot(url, outputPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 点击元素
app.post('/api/browser/click', async (req, res) => {
  try {
    const { selector } = req.body;
    const result = await browserService.clickElement(selector);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 输入文本
app.post('/api/browser/type', async (req, res) => {
  try {
    const { selector, text } = req.body;
    const result = await browserService.typeText(selector, text);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 滚动页面
app.post('/api/browser/scroll', async (req, res) => {
  try {
    const { selector } = req.body;
    const result = await browserService.scrollTo(selector);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 关闭浏览器
app.post('/api/browser/close', async (req, res) => {
  try {
    await browserService.close();
    res.json({
      success: true,
      message: '浏览器已关闭'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== UI Automation 桌面应用控制 ====================

// 查找窗口
app.post('/api/ui/window/find', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await UIAutomation.getWindowHandle(title);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 激活窗口
app.post('/api/ui/window/activate', async (req, res) => {
  try {
    const { handle } = req.body;
    const result = await UIAutomation.activateWindow(handle);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 发送按键
app.post('/api/ui/keyboard/send', async (req, res) => {
  try {
    const { keys } = req.body;
    const result = await UIAutomation.sendKeys(keys);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 鼠标点击
app.post('/api/ui/mouse/click', async (req, res) => {
  try {
    const { x, y, button = 'left' } = req.body;
    const result = await UIAutomation.mouseClick(x, y, button);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 移动鼠标
app.post('/api/ui/mouse/move', async (req, res) => {
  try {
    const { x, y } = req.body;
    const result = await UIAutomation.mouseMove(x, y);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== 技能执行服务 ====================

// 通用技能执行端点
app.post('/api/skill/execute', async (req, res) => {
  const { skill, params = {} } = req.body;
  
  console.log(`🔧 执行服务端技能：${skill}`, params);
  
  try {
    // 动态导入技能
    const { lazySkillLoader } = await import('../src/skills/LazySkillLoader.js');
    const SkillClass = await lazySkillLoader.loadSkill(skill);
    
    if (!SkillClass) {
      return res.status(404).json({
        success: false,
        error: `技能 ${skill} 不存在`
      });
    }
    
    const skillInstance = new SkillClass();
    const result = await skillInstance.execute(params);
    
    console.log(`✅ 技能执行完成：${skill}`);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error(`❌ 技能执行失败：${skill}`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取前台窗口
app.get('/api/ui/window/foreground', async (req, res) => {
  try {
    const result = await UIAutomation.getForegroundWindow();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 设置窗口状态
app.post('/api/ui/window/state', async (req, res) => {
  try {
    const { handle, state } = req.body; // minimize, maximize, restore
    const result = await UIAutomation.setWindowState(handle, state);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 关闭窗口
app.post('/api/ui/window/close', async (req, res) => {
  try {
    const { handle } = req.body;
    const result = await UIAutomation.closeWindow(handle);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 服务器启动
app.listen(PORT, () => {
  // 注册技能到 SkillExecutor
  console.log('\n📝 注册技能到后端 SkillExecutor...');
  const codeReviewSkill = new CodeReviewSkill();
  const skills = [
    { name: 'read_requirement', instance: new ReadRequirementSkill() },
    { name: 'safe_read_file', instance: new SafeFileReadSkill() },
    { name: 'safe_list_directory', instance: new SafeFileListSkill() },
    { name: 'safe_write_file', instance: new SafeFileWriteSkill() },
    { name: 'generate_project_code', instance: new CodeGenerationSkill() },
    { name: 'review_code', instance: codeReviewSkill },
    { name: 'code_review', instance: codeReviewSkill } // 别名，兼容不同命名
  ];
  
  skillExecutor.registerSkills(skills);
  skillExecutor.markAsInitialized();
  
  console.log(`✅ 后端已注册 ${skillExecutor.getSkillCount()} 个技能`);
  console.log(`📋 技能列表：${skillExecutor.getRegisteredSkills().join(', ')}\n`);
  
  console.log(`
✅ OpenClaw 本地服务已启动：http://localhost:${PORT}
   健康检查：http://localhost:${PORT}/health
   启动应用：POST /api/launch
   应用列表：GET /api/apps
   打开网址：POST /api/open-url

📁 文件系统服务:
   列出目录：POST /api/fs/list
   保存文件：POST /api/file/save
   读取文件：GET /api/file/read
   删除文件：DELETE /api/file/delete
   创建目录：POST /api/fs/mkdir

📚 Skills API:
   获取所有 Skills: GET /api/skills
   获取分类列表：GET /api/skills/categories
   按分类获取：GET /api/skills/:category
   搜索 Skills: GET /api/skills/search/:keyword
   获取详情：GET /api/skills/:name/detail
   Function 定义：GET /api/skills/all/function-definitions
   执行 Skill: POST /api/skills/execute

🕸️  Puppeteer Web 应用控制:
   打开应用：POST /api/webapp/open
   搜索内容：POST /api/webapp/search
   点击元素：POST /api/webapp/click
   获取内容：GET /api/webapp/content/:appName
   截图：POST /api/webapp/screenshot
   关闭应用：POST /api/webapp/close

🖥️  UI Automation 桌面应用控制:
   查找窗口：POST /api/ui/window/find
   激活窗口：POST /api/ui/window/activate
   发送按键：POST /api/ui/keyboard/send
   鼠标点击：POST /api/ui/mouse/click
   移动鼠标：POST /api/ui/mouse/move
   获取前台窗口：GET /api/ui/window/foreground
   窗口状态：POST /api/ui/window/state
   关闭窗口：POST /api/ui/window/close

🌐 Browser Service 浏览器自动化服务:
   浏览器搜索：POST /api/browser/search
   提取网页内容：POST /api/browser/extract
   浏览器截图：POST /api/browser/screenshot
   点击元素：POST /api/browser/click
   输入文本：POST /api/browser/type
   滚动页面：POST /api/browser/scroll
   关闭浏览器：POST /api/browser/close
`);
});
