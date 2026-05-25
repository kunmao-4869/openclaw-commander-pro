# 🎮 鸿蒙你画我猜游戏 - 完整项目代码

> 二人实时在线游戏，基于 HarmonyOS + ArkTS + WebSocket

## 项目结构

```
HarmonyDrawGuess/
├── entry/
│   ├── src/main/ets/
│   │   ├── entryability/
│   │   │   └── EntryAbility.ets
│   │   ├── pages/
│   │   │   ├── Index.ets           # 首页（创建/加入房间）
│   │   │   ├── GameRoom.ets        # 游戏房间
│   │   │   └── DrawingBoard.ets    # 绘图板
│   │   ├── common/
│   │   │   └── Types.ets           # 类型定义
│   │   └── network/
│   │       └── WebSocketManager.ets # WebSocket 管理
│   ├── src/main/resources/
│   │   └── base/
│   │       ├── element/
│   │       │   └── string.json
│   │       └── profile/
│   │           └── main_pages.json
│   └── oh-package.json5
├── server/
│   ├── index.js                    # WebSocket 服务器
│   └── package.json
└── README.md
```

## 1. 类型定义 (common/Types.ets)

```typescript
// 消息类型
export enum MessageType {
  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
  START_GAME = 'START_GAME',
  DRAW_DATA = 'DRAW_DATA',
  GUESS_WORD = 'GUESS_WORD',
  GAME_RESULT = 'GAME_RESULT'
}

// 游戏角色
export enum GameRole {
  DRAWER = 'drawer',
  GUESSER = 'guesser'
}

// 游戏状态
export enum GameState {
  WAITING = 'waiting',
  PLAYING = 'playing',
  FINISHED = 'finished'
}

// 玩家信息
export interface Player {
  id: string;
  name: string;
  role: GameRole;
  score: number;
}

// 游戏房间
export interface GameRoom {
  id: string;
  players: Player[];
  state: GameState;
  currentWord: string;
  round: number;
  timeRemaining: number;
}

// 绘图数据
export interface DrawData {
  points: Array<{x: number, y: number}>;
  color: string;
  lineWidth: number;
}

// 网络消息
export interface GameMessage {
  type: MessageType;
  playerId?: string;
  roomId?: string;
  data?: any;
  timestamp: number;
}
```

## 2. WebSocket 管理 (network/WebSocketManager.ets)

```typescript
import websocket from '@ohos.net.websocket';
import { GameMessage, MessageType } from '../common/Types';

export class WebSocketManager {
  private static instance: WebSocketManager;
  private wsSocket: websocket.WebSocket | null = null;
  private isConnected: boolean = false;
  private messageListeners: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  async connect(serverUrl: string): Promise<boolean> {
    try {
      this.wsSocket = await websocket.createWebSocket({
        url: serverUrl,
        protocols: ['game-protocol']
      });

      this.wsSocket.on('open', () => {
        console.log('WebSocket 连接成功');
        this.isConnected = true;
      });

      this.wsSocket.on('message', (data: string) => {
        this.handleMessage(data);
      });

      this.wsSocket.on('close', () => {
        console.log('WebSocket 连接关闭');
        this.isConnected = false;
      });

      this.wsSocket.on('error', (error) => {
        console.error('WebSocket 错误:', error);
        this.isConnected = false;
      });

      return true;
    } catch (error) {
      console.error('连接失败:', error);
      return false;
    }
  }

  private handleMessage(data: string) {
    try {
      const message: GameMessage = JSON.parse(data);
      const listeners = this.messageListeners.get(message.type) || [];
      listeners.forEach(listener => listener(message));
    } catch (error) {
      console.error('消息解析失败:', error);
    }
  }

  async sendMessage(message: GameMessage): Promise<boolean> {
    if (!this.isConnected || !this.wsSocket) {
      return false;
    }

    try {
      const data = JSON.stringify(message);
      await this.wsSocket.send(data);
      return true;
    } catch (error) {
      return false;
    }
  }

  onMessage(type: MessageType, callback: Function) {
    if (!this.messageListeners.has(type)) {
      this.messageListeners.set(type, []);
    }
    this.messageListeners.get(type)!.push(callback);
  }

  disconnect() {
    if (this.wsSocket) {
      this.wsSocket.close();
      this.wsSocket = null;
      this.isConnected = false;
    }
  }
}
```

## 3. 首页 (pages/Index.ets)

```typescript
import router from '@ohos.router';
import { WebSocketManager } from '../network/WebSocketManager';

@Entry
@Component
struct Index {
  @State roomId: string = '';
  @State playerName: string = '';
  @State isConnecting: boolean = false;
  
  private wsManager = WebSocketManager.getInstance();

  build() {
    Column() {
      Text('你画我猜')
        .fontSize(36)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 20 })

      Text('创建或加入房间')
        .fontSize(18)
        .fontColor('#666666')
        .margin({ bottom: 40 })

      // 玩家名称输入
      TextInput({ placeholder: '输入你的昵称' })
        .width('80%')
        .height(50)
        .fontSize(16)
        .backgroundColor('#F5F5F5')
        .padding(10)
        .onChange((value: string) => {
          this.playerName = value;
        })
        .margin({ bottom: 20 })

      // 房间 ID 输入
      TextInput({ placeholder: '输入房间 ID（加入游戏）' })
        .width('80%')
        .height(50)
        .fontSize(16)
        .backgroundColor('#F5F5F5')
        .padding(10)
        .onChange((value: string) => {
          this.roomId = value;
        })
        .margin({ bottom: 30 })

      // 创建房间按钮
      Button('创建房间')
        .width('80%')
        .height(50)
        .fontSize(18)
        .backgroundColor('#0066CC')
        .enabled(!this.isConnecting && this.playerName.length > 0)
        .onClick(async () => {
          await this.createRoom();
        })
        .margin({ bottom: 15 })

      // 加入房间按钮
      Button('加入房间')
        .width('80%')
        .height(50)
        .fontSize(18)
        .backgroundColor('#00AA66')
        .enabled(!this.isConnecting && this.playerName.length > 0 && this.roomId.length > 0)
        .onClick(async () => {
          await this.joinRoom();
        })

      // 连接状态
      if (this.isConnecting) {
        Text('正在连接...')
          .fontSize(14)
          .fontColor('#666666')
          .margin({ top: 20 })
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  async createRoom() {
    this.isConnecting = true;
    
    // 连接到服务器
    const connected = await this.wsManager.connect('ws://localhost:8080');
    
    if (connected) {
      // 生成房间 ID
      const newRoomId = Math.random().toString(36).substr(2, 6).toUpperCase();
      
      // 发送加入房间消息
      await this.wsManager.sendMessage({
        type: 'JOIN_ROOM',
        roomId: newRoomId,
        data: {
          playerName: this.playerName
        },
        timestamp: Date.now()
      });
      
      // 跳转到游戏房间
      router.pushUrl({
        url: 'pages/GameRoom',
        params: {
          roomId: newRoomId,
          playerName: this.playerName,
          isCreator: true
        }
      });
    } else {
      alert('连接服务器失败，请检查服务器是否运行');
    }
    
    this.isConnecting = false;
  }

  async joinRoom() {
    this.isConnecting = true;
    
    const connected = await this.wsManager.connect('ws://localhost:8080');
    
    if (connected) {
      await this.wsManager.sendMessage({
        type: 'JOIN_ROOM',
        roomId: this.roomId,
        data: {
          playerName: this.playerName
        },
        timestamp: Date.now()
      });
      
      router.pushUrl({
        url: 'pages/GameRoom',
        params: {
          roomId: this.roomId,
          playerName: this.playerName,
          isCreator: false
        }
      });
    } else {
      alert('连接服务器失败');
    }
    
    this.isConnecting = false;
  }
}
```

## 4. 游戏房间 (pages/GameRoom.ets)

```typescript
import router from '@ohos.router';
import { WebSocketManager } from '../network/WebSocketManager';
import { MessageType, GameRole, GameState, Player } from '../common/Types';

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
  @State chatMessages: Array<{player: string, message: string}> = [];
  
  private wsManager = WebSocketManager.getInstance();

  aboutToAppear() {
    const params = router.getParams() as Record<string, string>;
    this.roomId = params['roomId'] || '';
    this.playerName = params['playerName'] || '玩家';
    
    this.setupListeners();
  }

  aboutToDisappear() {
    this.wsManager.disconnect();
  }

  setupListeners() {
    // 监听玩家加入
    this.wsManager.onMessage(MessageType.JOIN_ROOM, (msg) => {
      this.players = msg.data.players;
    });

    // 监听游戏开始
    this.wsManager.onMessage(MessageType.START_GAME, (msg) => {
      this.gameState = GameState.PLAYING;
      this.currentRole = msg.data.role;
      this.currentWord = msg.data.word;
      this.timeRemaining = msg.data.time;
    });

    // 监听绘图数据
    this.wsManager.onMessage(MessageType.DRAW_DATA, (msg) => {
      // 更新画布
    });

    // 监听猜词
    this.wsManager.onMessage(MessageType.GUESS_WORD, (msg) => {
      this.chatMessages.push({
        player: msg.data.player,
        message: msg.data.guess
      });
    });
  }

  startGame() {
    this.wsManager.sendMessage({
      type: MessageType.START_GAME,
      roomId: this.roomId,
      timestamp: Date.now()
    });
  }

  build() {
    Column() {
      // 顶部信息
      Row() {
        Text(`房间：${this.roomId}`)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
        
        Text(`玩家：${this.players.length}/2`)
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
              
              Text(player.role === GameRole.DRAWER ? ' 🎨' : ' 🤔')
                .fontSize(20)
              
              Text(` ${player.score}分`)
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
        if (this.currentRole === GameRole.DRAWER) {
          Text(`请绘制：${this.currentWord}`)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF0000')
            .margin(20)
          
          Button('打开绘图板')
            .onClick(() => {
              router.pushUrl({ url: 'pages/DrawingBoard' });
            })
        } else {
          Text('等待对方画画...')
            .fontSize(20)
            .margin(20)
          
          TextInput({ placeholder: '输入你的猜测...' })
            .width('80%')
            .height(50)
            .fontSize(18)
            .onSubmit((guess: string) => {
              this.sendGuess(guess);
            })
        }
      } else {
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

      // 聊天记录
      List() {
        ForEach(this.chatMessages, (item) => {
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

  sendGuess(guess: string) {
    this.wsManager.sendMessage({
      type: MessageType.GUESS_WORD,
      data: { guess },
      timestamp: Date.now()
    });
  }
}
```

## 5. 绘图板 (pages/DrawingBoard.ets)

```typescript
import router from '@ohos.router';
import { WebSocketManager } from '../network/WebSocketManager';

@Entry
@Component
struct DrawingBoard {
  @State canvasWidth: number = 300;
  @State canvasHeight: number = 400;
  @State color: string = '#000000';
  @State lineWidth: number = 5;
  @State isDrawing: boolean = false;
  
  private canvasContext: RenderingContext | null = null;
  private wsManager = WebSocketManager.getInstance();

  build() {
    Column() {
      // 颜色选择
      Row() {
        ForEach(['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'], (colorItem) => {
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
        
        // 清空
        Button('清空')
          .onClick(() => {
            this.clearCanvas();
          })
      }
      .width('100%')
      .padding(10)
      .backgroundColor('#F5F5F5')

      // 画布
      Canvas(this.canvasContext)
        .width(this.canvasWidth)
        .height(this.canvasHeight)
        .backgroundColor('#FFFFFF')
        .onReady((canvas) => {
          this.canvasContext = canvas;
        })
        .onTouch((event) => {
          this.handleTouch(event);
        })

      // 完成按钮
      Button('完成')
        .width('80%')
        .height(50)
        .fontSize(18)
        .backgroundColor('#00AA66')
        .onClick(() => {
          router.back();
        })
    }
    .width('100%')
    .height('100%')
  }

  handleTouch(event) {
    const touch = event.touches[0];
    const x = touch.x;
    const y = touch.y;

    if (event.type === 'Down') {
      this.isDrawing = true;
      this.startDrawing(x, y);
    } else if (event.type === 'Move' && this.isDrawing) {
      this.drawTo(x, y);
    } else if (event.type === 'Up') {
      this.isDrawing = false;
    }
  }

  startDrawing(x: number, y: number) {
    if (!this.canvasContext) return;
    const ctx = this.canvasContext as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
  }

  drawTo(x: number, y: number) {
    if (!this.canvasContext) return;
    const ctx = this.canvasContext as CanvasRenderingContext2D;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  clearCanvas() {
    if (!this.canvasContext) return;
    const ctx = this.canvasContext as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
```

## 6. 服务端代码 (server/index.js)

```javascript
const WebSocket = require('ws');
const http = require('http');

const PORT = 8080;
const rooms = new Map();
const players = new Map();

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('你画我猜服务器运行中');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const playerId = generateId();
  players.set(playerId, { ws, id: playerId });
  console.log('新玩家连接:', playerId);

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
    removePlayer(playerId);
    players.delete(playerId);
  });
});

function handleMessage(ws, playerId, msg) {
  switch (msg.type) {
    case 'JOIN_ROOM':
      joinRoom(playerId, msg.roomId, msg.data);
      break;
    
    case 'START_GAME':
      startGame(playerId, msg.roomId);
      break;
    
    case 'DRAW_DATA':
      broadcastToRoom(msg.roomId, {
        type: 'DRAW_DATA',
        playerId,
        data: msg.data
      }, playerId);
      break;
    
    case 'GUESS_WORD':
      handleGuess(playerId, msg.roomId, msg.data.guess);
      break;
  }
}

function joinRoom(playerId, roomId, data) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      players: [],
      state: 'waiting',
      round: 1,
      timeRemaining: 60
    });
  }

  const room = rooms.get(roomId);
  room.players.push({
    id: playerId,
    name: data.playerName,
    role: 'guesser',
    score: 0
  });

  broadcastToRoom(roomId, {
    type: 'JOIN_ROOM',
    data: { roomId, players: room.players }
  });
}

function startGame(playerId, roomId) {
  const room = rooms.get(roomId);
  if (!room || room.players.length < 2) return;

  const drawerIndex = Math.floor(Math.random() * room.players.length);
  const words = ['苹果', '香蕉', '电脑', '手机', '汽车', '飞机', '太阳', '月亮'];
  const currentWord = words[Math.floor(Math.random() * words.length)];

  room.players.forEach((player, index) => {
    player.role = index === drawerIndex ? 'drawer' : 'guesser';
  });

  room.state = 'playing';
  room.currentWord = currentWord;

  broadcastToRoom(roomId, {
    type: 'START_GAME',
    data: {
      role: room.players.find(p => p.id === playerId)?.role,
      word: currentWord,
      time: 60
    }
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

function handleGuess(playerId, roomId, guess) {
  const room = rooms.get(roomId);
  if (!room) return;

  const player = room.players.find(p => p.id === playerId);
  if (!player || player.role === 'drawer') return;

  const isCorrect = guess.toLowerCase() === room.currentWord.toLowerCase();

  broadcastToRoom(roomId, {
    type: 'GUESS_WORD',
    data: { player: player.name, guess, correct: isCorrect }
  });

  if (isCorrect) {
    player.score += 10;
    endRound(roomId, true);
  }
}

function endRound(roomId, correctGuess = false) {
  const room = rooms.get(roomId);
  if (!room) return;

  broadcastToRoom(roomId, {
    type: 'GAME_RESULT',
    data: {
      word: room.currentWord,
      correct: correctGuess,
      scores: room.players.map(p => ({ name: p.name, score: p.score }))
    }
  });

  room.round++;
  room.state = room.round > 3 ? 'finished' : 'waiting';
}

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

function removePlayer(playerId) {
  rooms.forEach((room, roomId) => {
    room.players = room.players.filter(p => p.id !== playerId);
    if (room.players.length === 0) {
      rooms.delete(roomId);
    }
  });
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

server.listen(PORT, () => {
  console.log(`服务器启动在端口 ${PORT}`);
});
```

## 7. 服务端配置 (server/package.json)

```json
{
  "name": "harmony-draw-guess-server",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "ws": "^8.14.2"
  }
}
```

## 使用说明

### 1. 启动服务端

```bash
cd server
npm install
node index.js
```

### 2. 创建鸿蒙项目

1. 打开 DevEco Studio
2. 创建新项目 → Empty Ability
3. 项目名称：HarmonyDrawGuess
4. 复制上面的代码到对应文件

### 3. 配置权限

```json5
// module.json5
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

### 4. 运行项目

1. 连接鸿蒙设备或启动模拟器
2. 点击 Run 运行
3. 创建房间或加入房间
4. 开始游戏！

## 游戏流程

1. **玩家 A** 创建房间，获得房间 ID
2. **玩家 B** 输入房间 ID 加入
3. 点击"开始游戏"
4. 随机分配角色：
   - 画图者：看到词语，在绘图板上画画
   - 猜词者：观看绘图，输入猜测
5. 60 秒内猜对得分
6. 交换角色，继续下一轮
7. 3 轮后游戏结束，显示总分

## 功能特性

✅ 实时 WebSocket 通信
✅ 流畅绘图体验
✅ 多颜色选择
✅ 画笔粗细调节
✅ 猜词聊天
✅ 自动计分
✅ 多回合制
✅ 倒计时功能

## 后续优化

- [ ] 添加更多词库
- [ ] 支持 3-4 人游戏
- [ ] 添加表情和道具
- [ ] 优化绘图算法
- [ ] 添加音效
- [ ] 排行榜系统
