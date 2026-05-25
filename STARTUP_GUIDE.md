# 🚀 OpenClaw Commander Pro 启动指南

## 📋 启动步骤

### 1. 安装依赖（首次运行）

```bash
cd f:\openclaw\commander-pro
npm install
```

### 2. 启动本地服务（新窗口）

本地服务用于处理系统级操作（启动应用、文件操作等）

```bash
npm run server
```

你会看到：
```
✅ OpenClaw 本地服务已启动：http://localhost:3003
   健康检查：http://localhost:3003/health
   启动应用：POST /api/launch
   应用列表：GET /api/apps
   打开网址：POST /api/open-url
```

### 3. 启动前端（新窗口）

```bash
npm run dev
```

你会看到：
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3001/
```

### 4. 打开浏览器

访问 **http://localhost:3001/**

---

## ✅ 验证安装

### 检查服务状态

1. **前端服务**：访问 http://localhost:3001/
2. **本地服务**：访问 http://localhost:3003/health

### 测试功能

在聊天框中输入：
- "帮我打开抖音" - 测试应用启动
- "搜索已安装的应用" - 测试应用列表
- "打开 https://www.bilibili.com" - 测试打开网址

---

## 🔧 常见问题

### 问题 1：应用启动失败
**错误**：`本地服务未启动，请先运行：npm run server`

**解决**：确保已启动本地服务（步骤 2）

### 问题 2：找不到应用
**错误**：`未找到应用程序"xxx"`

**解决**：
1. 确认应用已安装
2. 使用正确的应用名称（如"抖音"、"微信"）
3. 运行"搜索已安装的应用"查看可用应用

### 问题 3：端口被占用
**错误**：`Port 3001 is in use`

**解决**：
- 前端端口：修改 `vite.config.js` 中的 `server.port`
- 服务端口：修改 `server/index.js` 中的 `PORT`

---

## 📊 服务架构

```
┌─────────────┐     ┌──────────────┐
│   浏览器    │────▶│  Vite 前端   │
│  (UI 界面)  │     │ (port:3001)  │
└─────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  本地服务    │
                    │ (port:3003)  │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   系统 API    │
                    │ (启动应用等) │
                    └──────────────┘
```

---

## 🎯 快速启动脚本

### Windows (PowerShell)

创建 `start.bat`：
```batch
@echo off
start cmd /k "cd /d %~dp0 && npm run server"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d %~dp0 && npm run dev"
```

### macOS/Linux (Bash)

创建 `start.sh`：
```bash
#!/bin/bash
gnome-terminal -- bash -c "npm run server; exec bash"
sleep 2
gnome-terminal -- bash -c "npm run dev; exec bash"
```

---

## 📝 注意事项

1. **必须运行两个服务**：前端 + 本地服务
2. **确保 Ollama 运行**：如果使用本地大模型
3. **防火墙设置**：允许端口 3001 和 3003
4. **应用路径**：确保应用在系统 PATH 中

---

**最后更新**: 2026-03-26  
**版本**: 2.0.0
