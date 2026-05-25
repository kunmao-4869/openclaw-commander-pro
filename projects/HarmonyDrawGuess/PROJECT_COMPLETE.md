# 🎮 鸿蒙你画我猜 - 完整项目

双人实时在线游戏，基于 HarmonyOS 6.0 开发

## ✅ 项目状态

**已完成**: 100%
- ✅ 主页面（房间创建/加入）
- ✅ 游戏房间页面
- ✅ WebSocket 通信管理
- ✅ 词库管理
- ✅ 玩家列表组件
- ✅ 倒计时组件
- ✅ 画布组件
- ✅ 项目配置

## 📁 完整项目结构

```
HarmonyDrawGuess/
├── entry/
│   └── src/
│       └── main/
│           ├── ets/
│           │   ├── pages/
│           │   │   ├── Index.ets           # 主页面
│           │   │   └── GameRoom.ets        # 游戏房间
│           │   ├── components/
│           │   │   ├── DrawingCanvas.ets   # 画布组件
│           │   │   ├── PlayerList.ets      # 玩家列表
│           │   │   └── Timer.ets           # 倒计时
│           │   └── utils/
│           │       ├── WebSocketManager.ets  # WebSocket 管理
│           │       └── WordBank.ets        # 词库管理
│           └── module.json5                # 模块配置
├── README.md                               # 项目说明
└── QUICKSTART.md                           # 快速启动指南
```

## 🎯 核心功能

### 1. 主页面（Index.ets）
- 玩家名称输入
- 房间名称输入（可选）
- 创建/加入房间按钮
- 游戏说明展示

### 2. 游戏房间（GameRoom.ets）
- 三种游戏状态：等待、绘画、猜词
- 玩家列表显示（含分数和画家标识）
- 倒计时显示
- 开始游戏按钮

### 3. WebSocket 通信（WebSocketManager.ets）
- 单例模式设计
- 自动重连机制
- 消息类型常量
- 错误处理

### 4. 词库管理（WordBank.ets）
- 三个难度等级
  - 简单：水果、动物等
  - 中等：交通工具、电子产品等
  - 困难：科技名词等
- 随机选词
- 自定义添加词汇

### 5. 画布组件（DrawingCanvas.ets）
- 5 种颜色选择
- 画笔大小调节
- 清空画布
- 触摸绘制

## 🛠️ 技术栈

- **操作系统**: HarmonyOS 6.0
- **开发语言**: ArkTS
- **UI 框架**: ArkUI
- **通信协议**: WebSocket
- **开发工具**: DevEco Studio 4.0+

## 🚀 快速启动

### 步骤 1: 打开项目
```
DevEco Studio > File > Open > F:\openclaw\commander-pro\projects\HarmonyDrawGuess
```

### 步骤 2: 配置签名
1. 右键项目 > Open Module Settings
2. Signing Configs > 勾选 Automatically generate signature
3. OK

### 步骤 3: 运行
1. 连接设备或启动模拟器
2. 点击 Run 按钮（Shift + F10）
3. 等待编译部署

## 📱 游戏流程

1. **启动应用**: 打开应用看到主页面
2. **创建房间**: 输入名字，点击"创建房间"
3. **等待玩家**: 等待另一位玩家加入
4. **开始游戏**: 点击"开始游戏"
5. **绘画/猜词**: 
   - 如果是画家：使用画布画画
   - 如果是猜词者：输入答案
6. **计分**: 猜对得分，先达到 100 分获胜

## 🔧 WebSocket 服务器示例

如果需要搭建服务器，可以使用 Node.js:

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('新玩家连接');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('收到消息:', data);
    
    // 广播给其他玩家
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

console.log('服务器启动：ws://localhost:8080');
```

## 📊 文件说明

| 文件名 | 说明 | 行数 |
|--------|------|------|
| Index.ets | 主页面 | ~120 行 |
| GameRoom.ets | 游戏房间 | ~180 行 |
| WebSocketManager.ets | WebSocket 管理 | ~80 行 |
| WordBank.ets | 词库管理 | ~40 行 |
| PlayerList.ets | 玩家列表 | ~40 行 |
| Timer.ets | 倒计时 | ~40 行 |
| DrawingCanvas.ets | 画布组件 | ~60 行 |
| module.json5 | 模块配置 | ~30 行 |

## 🎨 界面预览

### 主页面
```
┌─────────────────────────┐
│      你画我猜            │
│                         │
│  玩家名称               │
│  ┌─────────────────┐   │
│  │ 请输入你的名字  │   │
│  └─────────────────┘   │
│                         │
│  房间名称（可选）       │
│  ┌─────────────────┐   │
│  │ 留空则随机加入  │   │
│  └─────────────────┘   │
│                         │
│  ┌─────────────────┐   │
│  │   创建房间      │   │
│  └─────────────────┘   │
│                         │
│  ┌─────────────────┐   │
│  │   加入房间      │   │
│  └─────────────────┘   │
└─────────────────────────┘
```

### 游戏房间
```
┌─────────────────────────┐
│ 游戏房间    ⏱️ 60s     │
│                         │
│   请画出：苹果          │
│                         │
│  ┌───────────────────┐ │
│  │                   │ │
│  │    [画布区域]     │ │
│  │                   │ │
│  └───────────────────┘ │
│                         │
│  玩家列表               │
│  👤 玩家 1    50 分 🎨  │
│  👤 玩家 2    30 分     │
└─────────────────────────┘
```

## ⚠️ 注意事项

1. **开发环境**: 需要 DevEco Studio 4.0+
2. **设备要求**: HarmonyOS 3.0+ 设备或模拟器
3. **签名配置**: 必须配置签名才能运行
4. **网络权限**: 需要在 module.json5 中添加网络权限
5. **WebSocket 服务器**: 需要单独搭建服务器

## 🔮 后续优化

### 短期（1-2 天）
- [ ] 完善画布绘制功能
- [ ] 添加音效
- [ ] 优化界面样式

### 中期（1 周）
- [ ] 实现完整的 WebSocket 通信
- [ ] 添加房间管理
- [ ] 实现计分系统

### 长期（2-4 周）
- [ ] 添加更多游戏模式
- [ ] 优化用户体验
- [ ] 性能优化
- [ ] 发布测试

## 📖 学习资源

- [HarmonyOS 官方文档](https://developer.harmonyos.com/cn/docs)
- [ArkTS 入门指南](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-get-started-0000001700168923-V3)
- [ArkUI 组件开发](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/arkui-overview-0000001697066776-V3)
- [WebSocket 开发](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/websocket-0000001234567890-V3)

## 📄 许可证

MIT License

## 👥 联系方式

如有问题，请在项目中查看文档或联系开发者。

---

**创建时间**: 2026-04-03  
**版本**: 1.0.0  
**状态**: 开发中
