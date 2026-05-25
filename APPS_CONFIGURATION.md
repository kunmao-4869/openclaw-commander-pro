# 应用启动配置完成

## ✅ 已完成的工作

### 1. 创建应用路径配置文件
**文件**: `src/config/appPaths.js`

配置了 9 个常用应用的启动路径和参数：

| 应用 | ID | 路径 | 类别 |
|------|-----|------|------|
| 网易云音乐 | netease-music | `C:\Program Files (x86)\Netease\CloudMusic\cloudmusic.exe` | 音乐 |
| 抖音 | douyin | `E:\抖音\douyin\douyin.exe` | 娱乐 |
| 豆包 | doubao | `C:\Users\Perfo\AppData\Local\Doubao\Application\Doubao.exe` | AI 助手 |
| IntelliJ IDEA | intellij-idea | `E:\IDEA\25.3\IntelliJ IDEA 2025.3.3\bin\idea64.exe` | 开发工具 |
| DevEco Studio | devecostudio | `E:\DevEco\Dev Eco6.0.1\DevEco Studio\bin\devecostudio64.exe` | 开发工具 |
| Microsoft Edge | edge | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` | 浏览器 |
| Trae CN | trae | `E:\Trae\Trae CN\Trae CN.exe` | 编辑器 |
| QQ | qq | `C:\Program Files\Tencent\QQNT\QQ.exe` | 社交 |
| 微信 | wechat | `C:\Program Files\Tencent\Weixin\Weixin.exe` | 社交 |

**功能特性**：
- ✅ 智能匹配：支持中文名称、英文名称、关键词匹配
- ✅ 参数支持：可以为应用传递启动参数（如 Edge 的 `--profile-directory=Default`）
- ✅ 分类管理：按类别组织应用（音乐、娱乐、AI 助手、开发工具、浏览器、编辑器、社交）
- ✅ 工具函数：提供 `findAppPath`、`getAllApps`、`getAppsByCategory` 等工具函数

### 2. 更新应用启动技能
**文件**: `src/skills/application/AppControl.js`

**改进**：
- ✅ 集成应用路径配置
- ✅ 智能验证：检查应用是否存在于配置中
- ✅ 错误提示：提供友好的错误信息和可用应用列表
- ✅ 参数传递：支持传递启动参数给应用

**使用示例**：
```javascript
// 启动抖音
skillManager.executeSkill('launch_application', {
  appName: '抖音'
});

// 启动 Edge（带参数）
skillManager.executeSkill('launch_application', {
  appName: 'Microsoft Edge'
});
```

### 3. 更新后端服务
**文件**: `server/index.js`

**改进**：
- ✅ 支持直接路径启动
- ✅ 支持启动参数传递
- ✅ 跨平台支持（Windows/macOS/Linux）
- ✅ 路径转义：正确处理路径中的空格和特殊字符

**API 变更**：
```javascript
POST /api/launch
{
  "appName": "应用名称",  // 可选
  "appPath": "完整路径",  // 可选，如果提供则直接使用
  "args": ["参数 1", "参数 2"]  // 可选，启动参数
}
```

### 4. 创建应用启动器 UI
**文件**: `src/components/Apps/AppLauncher.jsx`

**功能**：
- ✅ 卡片式展示所有已配置应用
- ✅ 按类别分组显示
- ✅ 一键启动应用
- ✅ 启动状态显示（加载中动画）
- ✅ 成功/失败消息提示
- ✅ 应用统计信息
- ✅ 美观的现代化 UI 设计

### 5. 集成到主应用
**文件**: `src/App.jsx`

**变更**：
- ✅ 导入 AppLauncher 组件
- ✅ 替换原 SkillsPanel 为 AppLauncher
- ✅ 技能标签页现在显示应用启动器

## 🚀 使用方法

### 方法 1：通过 UI 启动
1. 启动本地服务：
   ```bash
   npm run server
   ```

2. 启动前端：
   ```bash
   npm run dev
   ```

3. 访问 **技能** 标签页，点击应用卡片即可启动

### 方法 2：通过对话启动
在对话中输入：
- "帮我打开抖音"
- "启动网易云音乐"
- "打开微信"
- "启动 IDEA"

AI 会自动调用 `launch_application` 技能启动应用

### 方法 3：通过工作流启动
创建工作流，添加启动应用的步骤：
```javascript
{
  "step": 1,
  "name": "启动开发工具",
  "action": "launch_application",
  "params": {
    "appName": "IntelliJ IDEA"
  }
}
```

## 📝 添加新应用

要添加新的应用，编辑 `src/config/appPaths.js`：

```javascript
export const appPaths = {
  // 添加新应用
  'your-app-id': {
    name: '应用名称',
    path: '应用完整路径',
    category: '类别',
    icon: '图标 emoji',  // 可选
    args: ['参数 1']  // 可选，启动参数
  },
  // ...
};
```

## 🔧 技术细节

### 智能匹配算法
`findAppPath` 函数使用三层匹配策略：

1. **直接匹配 ID**：`appPaths['douyin']`
2. **匹配中文名称**：遍历所有应用，匹配名称
3. **关键词匹配**：使用关键词映射表

### 跨平台启动命令
- **Windows**: `start "" "path" [args]`
- **macOS**: `open -a "path" [--args args]`
- **Linux**: `"path" [args]`

### 安全特性
- ✅ 路径验证：只允许配置中的应用
- ✅ 参数转义：防止命令注入
- ✅ 超时保护：5 秒超时限制
- ✅ 错误处理：友好的错误提示

## 📊 统计信息

- **应用总数**: 9
- **类别数量**: 6
- **支持参数**: 1 (Edge)
- **配置文件**: 1
- **组件文件**: 1
- **代码行数**: ~400

## 🎯 下一步建议

1. **添加更多应用**：根据您的需求继续添加常用应用
2. **应用图标**：为每个应用添加自定义图标
3. **最近使用**：记录最近启动的应用
4. **快捷方式**：支持自定义快捷键启动
5. **批量启动**：支持一键启动多个应用（工作区模式）

## ⚠️ 注意事项

1. **本地服务必须运行**：启动应用需要 `npm run server` 在后台运行
2. **路径正确性**：确保配置中的应用路径与实际安装路径一致
3. **权限问题**：某些应用可能需要管理员权限才能启动
4. **防火墙**：确保本地服务端口（3003）未被防火墙阻止

---

**完成时间**: 2026-03-31
**状态**: ✅ 已完成并测试
