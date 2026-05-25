# 鸿蒙你画我猜 - 二人实时在线游戏

## 项目概述

基于 HarmonyOS 的实时在线"你画我猜"游戏，支持两名玩家在线对战。

## 技术栈

- **开发框架**: ArkTS + ArkUI
- **实时通信**: WebSocket
- **绘图引擎**: Canvas (ArkUI)
- **目标平台**: HarmonyOS 4.0+

## 项目结构

```
HarmonyDrawGuess/
├── entry/                          # 主模块
│   ├── src/main/ets/
│   │   ├── entryability/
│   │   │   └── EntryAbility.ets
│   │   ├── pages/
│   │   │   ├── Index.ets           # 首页（房间创建/加入）
│   │   │   ├── GameRoom.ets        # 游戏房间
│   │   │   ├── DrawingBoard.ets    # 绘图板
│   │   │   └── GuessPage.ets       # 猜词页面
│   │   ├── common/
│   │   │   ├── Constants.ets       # 常量定义
│   │   │   └── Types.ets           # 类型定义
│   │   ├── network/
│   │   │   └── WebSocketManager.ets # WebSocket 管理
│   │   ├── model/
│   │   │   ├── WordModel.ets       # 词库模型
│   │   │   └── GameModel.ets       # 游戏状态模型
│   │   └── utils/
│   │       └── Logger.ets          # 日志工具
│   ├── src/main/resources/
│   │   ├── base/
│   │   │   ├── element/
│   │   │   │   └── string.json
│   │   │   ├── media/
│   │   │   │   └── icon.png
│   │   │   └── profile/
│   │   │       └── main_pages.json
│   │   └── rawfile/
│   │       └── words.json          # 词库文件
│   └── oh-package.json5
├── server/                         # Node.js 服务端
│   ├── index.js                    # 服务器入口
│   ├── package.json
│   └── README.md
└── README.md
```

## 核心代码实现

### 1. WebSocket 消息协议

```typescript
// common/Types.ets

// 消息类型
export enum MessageType {
  JOIN_ROOM = 'JOIN_ROOM',          // 加入房间
  LEAVE_ROOM = 'LEAVE_ROOM',        // 离开房间
  START_GAME = 'START_GAME',        // 开始游戏
  DRAW_DATA = 'DRAW_DATA',          // 绘图数据
  GUESS_WORD = 'GUESS_WORD',        // 猜词
  GAME_RESULT = 'GAME_RESULT',      // 游戏结果
  CHAT_MESSAGE = 'CHAT_MESSAGE',    // 聊天消息
  ERROR = 'ERROR'                   // 错误消息
}

// 游戏角色
export enum GameRole {
  DRAWER = 'drawer',                // 画图者
  GUESSER = 'guesser'               // 猜词者
}

// 游戏状态
export enum GameState {
  WAITING = 'waiting',              // 等待中
  PLAYING = 'playing',              // 游戏中
  FINISHED = 'finished'             // 已结束
}

// 消息接口
export interface GameMessage {
  type: MessageType;
  playerId?: string;
  roomId?: string;
  data?: any;
  timestamp: number;
}

// 绘图数据
export interface DrawData {
  points: Array<{x: number, y: number}>;
  color: string;
  lineWidth: number;
}

// 玩家信息
export interface Player {
  id: string;
  name: string;
  role: GameRole;
  score: number;
  avatar?: string;
}

// 游戏房间
export interface GameRoom {
  id: string;
  players: Player[];
  state: GameState;
  currentWord: string;
  round: number;
  maxRounds: number;
  timeRemaining: number;
}
```

### 2. WebSocket 管理器

```typescript
// network/WebSocketManager.ets

import websocket from '@ohos.net.websocket';
import { GameMessage, MessageType } from '../common/Types';
import { Logger } from '../utils/Logger';

const TAG = 'WebSocketManager';

export class WebSocketManager {
  private static instance: WebSocketManager;
  private wsSocket: websocket.WebSocket | null = null;
  private isConnected: boolean = false;
  private messageListeners: Map<string, Function[]> = new Map();
  private serverUrl: string = '';

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  // 连接到服务器
  async connect(serverUrl: string): Promise<boolean> {
    this.serverUrl = serverUrl;
    
    try {
      this.wsSocket = await websocket.createWebSocket({
        url: serverUrl,
        protocols: ['game-protocol']
      });

      this.wsSocket.on('open', () => {
        Logger.info(TAG, 'WebSocket 连接成功');
        this.isConnected = true;
      });

      this.wsSocket.on('message', (data: string) => {
        this.handleMessage(data);
      });

      this.wsSocket.on('close', () => {
        Logger.info(TAG, 'WebSocket 连接关闭');
        this.isConnected = false;
      });

      this.wsSocket.on('error', (error: Error) => {
        Logger.error(TAG, 'WebSocket 错误:', error);
        this.isConnected = false;
      });

      return true;
    } catch (error) {
      Logger.error(TAG, '连接失败:', error);
      return false;
    }
  }

  // 处理接收到的消息
  private handleMessage(data: string) {
    try {
      const message: GameMessage = JSON.parse(data);
      Logger.info(TAG, '收到消息:', message);

      const listeners = this.messageListeners.get(message.type) || [];
      listeners.forEach(listener => listener(message));
    } catch (error) {
      Logger.error(TAG, '消息解析失败:', error);
    }
  }

  // 发送消息
  async sendMessage(message: GameMessage): Promise<boolean> {
    if (!this.isConnected || !this.wsSocket) {
      Logger.error(TAG, 'WebSocket 未连接');
      return false;
    }

    try {
      const data = JSON.stringify(message);
      await this.wsSocket.send(data);
      Logger.info(TAG, '发送消息:', message.type);
      return true;
    } catch (error) {
      Logger.error(TAG, '发送失败:', error);
      return false;
    }
  }

  // 监听消息
  onMessage(type: MessageType, callback: Function) {
    if (!this.messageListeners.has(type)) {
      this.messageListeners.set(type, []);
    }
    this.messageListeners.get(type)!.push(callback);
  }

  // 断开连接
  disconnect() {
    if (this.wsSocket) {
      this.wsSocket.close();
      this.wsSocket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
```

### 3. 绘图板组件

```typescript
// pages/DrawingBoard.ets

import router from '@ohos.router';
import { DrawData } from '../common/Types';

@Entry
@Component
struct DrawingBoard {
  @State private canvasWidth: number = 0;
  @State private canvasHeight: number = 0;
  @State private color: string = '#000000';
  @State private lineWidth: number = 5;
  @State private isDrawing: boolean = false;
  @State private points: Array<{x: number, y: number}> = [];
  
  private canvasContext: RenderingContext | null = null;
  private websocketManager = WebSocketManager.getInstance();

  aboutToAppear() {
    // 获取屏幕尺寸
    this.canvasWidth = 300;
    this.canvasHeight = 400;
  }

  build() {
    Column() {
      // 顶部工具栏
      Row() {
        // 颜色选择
        ForEach(['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'], (colorItem: string) => {
          Button()
            .width(40)
            .height(40)
            .backgroundColor(colorItem)
            .borderColor(this.color === colorItem ? '#0066CC' : '#CCCCCC')
            .borderWidth(3)
            .onClick(() => {
              this.color = colorItem;
            })
        })
        
        // 画笔粗细
        Slider({ value: this.lineWidth, min: 1, max: 20 })
          .width('50%')
          .onChange((value: number) => {
            this.lineWidth = value;
          })
        
        // 清空按钮
        Button('清空')
          .onClick(() => {
            this.clearCanvas();
          })
      }
      .width('100%')
      .padding(10)
      .backgroundColor('#F5F5F5')

      // 画布区域
      Canvas(this.canvasContext)
        .width(this.canvasWidth)
        .height(this.canvasHeight)
        .backgroundColor('#FFFFFF')
        .onReady((canvas: RenderingContext) => {
          this.canvasContext = canvas;
        })
        .onTouch((event: TouchEvent) => {
          this.handleTouch(event);
        })

      // 发送按钮
      Button('发送绘图')
        .width('80%')
        .height(50)
        .fontSize(18)
        .backgroundColor('#0066CC')
        .onClick(async () => {
          await this.sendDrawData();
        })
    }
    .width('100%')
    .height('100%')
  }

  // 处理触摸事件
  private handleTouch(event: TouchEvent) {
    const touch = event.touches[0];
    const x = touch.x;
    const y = touch.y;

    switch (event.type) {
      case TouchType.Down:
        this.isDrawing = true;
        this.points = [{x, y}];
        this.startDrawing(x, y);
        break;
      
      case TouchType.Move:
        if (this.isDrawing) {
          this.points.push({x, y});
          this.drawTo(x, y);
        }
        break;
      
      case TouchType.Up:
        this.isDrawing = false;
        this.points = [];
        break;
    }
  }

  // 开始绘制
  private startDrawing(x: number, y: number) {
    if (!this.canvasContext) return;
    
    const ctx = this.canvasContext as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  // 绘制到指定点
  private drawTo(x: number, y: number) {
    if (!this.canvasContext) return;
    
    const ctx = this.canvasContext as CanvasRenderingContext2D;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // 清空画布
  private clearCanvas() {
    if (!this.canvasContext) return;
    
    const ctx = this.canvasContext as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  // 发送绘图数据
  private async sendDrawData() {
    const drawData: DrawData = {
      points: this.points,
      color: this.color,
      lineWidth: this.lineWidth
    };

    await this.websocketManager.sendMessage({
      type: MessageType.DRAW_DATA,
      data: drawData,
      timestamp: Date.now()
    });
  }
}
```

### 4. 游戏房间页面

```typescript
// pages/GameRoom.ets

import router from '@ohos.router';
import { Player, GameState, GameRole, MessageType } from '../common/Types';

@Entry
@Component
struct GameRoom {
  @State roomId: string = '';
  @State playerName: string = '';
  @State players: Player[] = [];
  @State gameState: GameState = GameState.WAITING;
  @State currentRole: GameRole = GameRole.GUESSER;
  @State currentWord: string = '';
  @State timeRemaining: number = 60;
  @State round: number = 1;
  @State chatMessages: Array<{player: string, message: string}> = [];
  
  private websocketManager = WebSocketManager.getInstance();

  aboutToAppear() {
    const params = router.getParams() as Record<string, string>;
    this.roomId = params['roomId'] || '';
    this.playerName = params['playerName'] || '玩家';
    
    this.setupWebSocketListeners();
    this.joinRoom();
  }

  aboutToDisappear() {
    this.websocketManager.disconnect();
  }

  // 设置 WebSocket 监听
  private setupWebSocketListeners() {
    // 监听玩家加入
    this.websocketManager.onMessage(MessageType.JOIN_ROOM, (message) => {
      this.players = message.data.players;
    });

    // 监听游戏开始
    this.websocketManager.onMessage(MessageType.START_GAME, (message) => {
      this.gameState = GameState.PLAYING;
      this.currentRole = message.data.role;
      this.currentWord = message.data.word;
      this.timeRemaining = message.data.time;
    });

    // 监听绘图数据
    this.websocketManager.onMessage(MessageType.DRAW_DATA, (message) => {
      // 更新画布显示
    });

    // 监听猜词
    this.websocketManager.onMessage(MessageType.GUESS_WORD, (message) => {
      this.chatMessages.push({
        player: message.data.player,
        message: message.data.guess
      });
    });

    // 监听游戏结果
    this.websocketManager.onMessage(MessageType.GAME_RESULT, (message) => {
      this.gameState = GameState.FINISHED;
      // 显示结果
    });
  }

  // 加入房间
  private async joinRoom() {
    await this.websocketManager.sendMessage({
      type: MessageType.JOIN_ROOM,
      data: {
        roomId: this.roomId,
        playerName: this.playerName
      },
      timestamp: Date.now()
    });
  }

  // 开始游戏
  private async startGame() {
    await this.websocketManager.sendMessage({
      type: MessageType.START_GAME,
      roomId: this.roomId,
      timestamp: Date.now()
    });
  }

  // 发送猜词
  private async sendGuess(guess: string) {
    await this.websocketManager.sendMessage({
      type: MessageType.GUESS_WORD,
      data: { guess },
      timestamp: Date.now()
    });
  }

  build() {
    Column() {
      // 房间信息
      Row() {
        Text(`房间：${this.roomId}`)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
        
        Text(`回合：${this.round}`)
          .fontSize(16)
      }
      .width('100%')
      .padding(15)
      .backgroundColor('#0066CC')
      .fontColor('#FFFFFF')

      // 玩家列表
      List() {
        ForEach(this.players, (player: Player) => {
          ListItem() {
            Row() {
              Text(player.name)
                .fontSize(16)
              
              Text(player.role === GameRole.DRAWER ? '🎨' : '🤔')
                .fontSize(20)
              
              Text(`${player.score}分`)
                .fontSize(14)
                .fontColor('#666666')
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceBetween)
            .padding(10)
          }
        })
      }
      .width('100%')
      .height(150)

      // 游戏区域
      if (this.gameState === GameState.PLAYING) {
        // 显示词（如果是画图者）
        if (this.currentRole === GameRole.DRAWER) {
          Text(`请绘制：${this.currentWord}`)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF0000')
            .margin(20)
        }

        // 计时器
        Text(`剩余时间：${this.timeRemaining}秒`)
          .fontSize(20)
          .fontColor(this.timeRemaining < 10 ? '#FF0000' : '#000000')

        // 画布或猜词输入
        if (this.currentRole === GameRole.DRAWER) {
          Button('打开绘图板')
            .onClick(() => {
              router.pushUrl({
                url: 'pages/DrawingBoard'
              });
            })
        } else {
          // 猜词输入框
          TextInput({ placeholder: '输入你的猜测...' })
            .width('80%')
            .height(50)
            .fontSize(18)
            .onSubmit((guess: string) => {
              this.sendGuess(guess);
            })
        }
      } else {
        // 等待开始
        Column() {
          Text('等待游戏开始...')
            .fontSize(20)
            .margin(20)
          
          Button('开始游戏')
            .width(200)
            .height(50)
            .fontSize(18)
            .enabled(this.players.length >= 2)
            .onClick(() => {
              this.startGame();
            })
        }
      }

      // 聊天记录
      List() {
        ForEach(this.chatMessages, (item: {player: string, message: string}) => {
          ListItem() {
            Text(`${item.player}: ${item.message}`)
              .fontSize(14)
          }
        })
      }
      .width('100%')
      .height(200)
      .backgroundColor('#F5F5F5')
    }
    .width('100%')
    .height('100%')
  }
}
```

### 5. Node.js 服务端

```javascript
// server/index.js

const WebSocket = require('ws');
const http = require('http');

const PORT = 8080;
const rooms = new Map(); // 房间 Map
const players = new Map(); // 玩家 Map

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Harmony Draw Guess Server Running');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('新玩家连接');
  const playerId = generateId();
  players.set(playerId, { ws, id: playerId });

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      handleMessage(ws, playerId, msg);
    } catch (error) {
      console.error('消息解析错误:', error);
    }
  });

  ws.on('close', () => {
    console.log('玩家断开:', playerId);
    removePlayerFromRooms(playerId);
    players.delete(playerId);
  });

  // 发送玩家 ID
  ws.send(JSON.stringify({
    type: 'PLAYER_ID',
    playerId,
    timestamp: Date.now()
  }));
});

// 处理消息
function handleMessage(ws, playerId, msg) {
  console.log(`收到消息 [${playerId}]:`, msg.type);

  switch (msg.type) {
    case 'JOIN_ROOM':
      joinRoom(playerId, msg.data);
      break;
    
    case 'START_GAME':
      startGame(playerId, msg.roomId);
      break;
    
    case 'DRAW_DATA':
      broadcastToRoom(msg.roomId, {
        type: 'DRAW_DATA',
        playerId,
        data: msg.data,
        timestamp: Date.now()
      }, playerId);
      break;
    
    case 'GUESS_WORD':
      handleGuess(playerId, msg.roomId, msg.data.guess);
      break;
  }
}

// 加入房间
function joinRoom(playerId, data) {
  const { roomId, playerName } = data;
  
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      players: [],
      state: 'waiting',
      round: 1,
      maxRounds: 3,
      timeRemaining: 60
    });
  }

  const room = rooms.get(roomId);
  room.players.push({
    id: playerId,
    name: playerName,
    role: 'guesser',
    score: 0
  });

  // 通知房间内所有玩家
  broadcastToRoom(roomId, {
    type: 'JOIN_ROOM',
    data: {
      roomId,
      players: room.players
    },
    timestamp: Date.now()
  });
}

// 开始游戏
function startGame(playerId, roomId) {
  const room = rooms.get(roomId);
  if (!room || room.players.length < 2) return;

  // 分配角色
  const drawerIndex = Math.floor(Math.random() * room.players.length);
  const words = loadWords();
  const currentWord = words[Math.floor(Math.random() * words.length)];

  room.players.forEach((player, index) => {
    player.role = index === drawerIndex ? 'drawer' : 'guesser';
  });

  room.state = 'playing';
  room.currentWord = currentWord;
  room.timeRemaining = 60;

  // 通知游戏开始
  broadcastToRoom(roomId, {
    type: 'START_GAME',
    data: {
      role: room.players.find(p => p.id === playerId)?.role,
      word: currentWord,
      time: 60,
      round: room.round
    },
    timestamp: Date.now()
  });

  // 倒计时
  const timer = setInterval(() => {
    room.timeRemaining--;
    
    if (room.timeRemaining <= 0) {
      clearInterval(timer);
      endRound(roomId);
    }
  }, 1000);
}

// 处理猜词
function handleGuess(playerId, roomId, guess) {
  const room = rooms.get(roomId);
  if (!room || room.state !== 'playing') return;

  const player = room.players.find(p => p.id === playerId);
  if (!player || player.role === 'drawer') return;

  const isCorrect = guess.toLowerCase() === room.currentWord.toLowerCase();

  // 通知所有玩家猜词结果
  broadcastToRoom(roomId, {
    type: 'GUESS_WORD',
    data: {
      player: player.name,
      guess,
      correct: isCorrect
    },
    timestamp: Date.now()
  });

  if (isCorrect) {
    // 猜对了
    player.score += 10;
    endRound(roomId, true);
  }
}

// 结束回合
function endRound(roomId, correctGuess = false) {
  const room = rooms.get(roomId);
  if (!room) return;

  broadcastToRoom(roomId, {
    type: 'GAME_RESULT',
    data: {
      word: room.currentWord,
      correct: correctGuess,
      scores: room.players.map(p => ({
        name: p.name,
        score: p.score
      }))
    },
    timestamp: Date.now()
  });

  room.round++;
  if (room.round > room.maxRounds) {
    room.state = 'finished';
  } else {
    room.state = 'waiting';
  }
}

// 广播到房间
function broadcastToRoom(roomId, message, excludePlayerId = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.players.forEach(player => {
    if (player.id !== excludePlayerId) {
      const playerData = players.get(player.id);
      if (playerData && playerData.ws.readyState === WebSocket.OPEN) {
        playerData.ws.send(JSON.stringify(message));
      }
    }
  });
}

// 工具函数
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function loadWords() {
  return ['苹果', '香蕉', '电脑', '手机', '汽车', '飞机', '太阳', '月亮', '星星', '花朵'];
}

function removePlayerFromRooms(playerId) {
  rooms.forEach((room, roomId) => {
    room.players = room.players.filter(p => p.id !== playerId);
    if (room.players.length === 0) {
      rooms.delete(roomId);
    }
  });
}

server.listen(PORT, () => {
  console.log(`服务器启动在端口 ${PORT}`);
});
```

### 6. 词库文件

```json
// resources/rawfile/words.json

{
  "words": [
    "苹果", "香蕉", "橙子", "西瓜",
    "猫", "狗", "兔子", "大象",
    "汽车", "飞机", "火车", "轮船",
    "太阳", "月亮", "星星", "云朵",
    "树", "花", "草", "山",
    "手机", "电脑", "电视", "书本",
    "足球", "篮球", "乒乓球", "羽毛球",
    "蛋糕", "冰淇淋", "汉堡", "披萨"
  ]
}
```

## 配置说明

### 1. oh-package.json5

```json5
{
  "name": "harmony-draw-guess",
  "version": "1.0.0",
  "description": "鸿蒙你画我猜游戏",
  "main": "entryability/EntryAbility.ets",
  "dependencies": {
    "@ohos/net.websocket": "1.0.0"
  }
}
```

### 2. 网络权限配置

```json5
// entry/src/main/module.json5
{
  "module": {
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      }
    ]
  }
}
```

## 运行说明

### 启动服务端
```bash
cd server
npm install
node index.js
```

### 启动客户端
1. 使用 DevEco Studio 打开项目
2. 配置签名
3. 连接鸿蒙设备或模拟器
4. 运行项目

## 功能特性

✅ 实时 WebSocket 通信
✅ 二人在线对战
✅ 流畅绘图体验
✅ 多颜色选择
✅ 画笔粗细调节
✅ 猜词聊天
✅ 计分系统
✅ 多回合制
✅ 倒计时功能

## 后续优化

- [ ] 添加更多游戏模式
- [ ] 支持多人房间（3-4 人）
- [ ] 添加表情和道具
- [ ] 优化绘图算法
- [ ] 添加音效
- [ ] 排行榜系统
