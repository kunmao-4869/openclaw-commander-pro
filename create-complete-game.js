/**
 * 一键创建完整的鸿蒙你画我猜游戏项目
 * 不依赖 AI 分析，直接生成所有代码
 */

import { SafeFileWriteSkill } from './src/skills/advanced/SafeFileWrite.js';

async function createCompleteHarmonyGame() {
  console.log('🚀 开始创建完整的鸿蒙你画我猜游戏项目\n');
  
  const safeWrite = new SafeFileWriteSkill();
  const baseDir = 'F:\\openclaw\\commander-pro\\projects\\HarmonyDrawGuess';
  
  const projectFiles = [
    // 1. 主页面
    {
      path: `${baseDir}\\entry\\src\\main\\ets\\pages\\Index.ets`,
      content: `/**
 * 主页面 - 房间创建/加入
 */
@Entry
@Component
struct Index {
  @State roomName: string = '';
  @State playerName: string = '';

  build() {
    Column() {
      // 标题
      Text('你画我猜')
        .fontSize(36)
        .fontWeight(FontWeight.Bold)
        .fontColor('#1890FF')
        .margin({ bottom: 40 })

      // 玩家名称输入
      Column() {
        Text('玩家名称')
          .fontSize(16)
          .fontColor('#333')
          .alignSelf(ItemAlign.Start)
          .margin({ bottom: 8 })

        TextInput({ placeholder: '请输入你的名字' })
          .onChange((value: string) => {
            this.playerName = value;
          })
          .width('100%')
          .height(50)
          .backgroundColor('#f5f5f5')
          .borderRadius(8)
          .padding({ left: 16, right: 16 })
      }
      .width('85%')
      .margin({ bottom: 24 })

      // 房间名称输入
      Column() {
        Text('房间名称（可选）')
          .fontSize(16)
          .fontColor('#333')
          .alignSelf(ItemAlign.Start)
          .margin({ bottom: 8 })

        TextInput({ placeholder: '留空则随机加入' })
          .onChange((value: string) => {
            this.roomName = value;
          })
          .width('100%')
          .height(50)
          .backgroundColor('#f5f5f5')
          .borderRadius(8)
          .padding({ left: 16, right: 16 })
      }
      .width('85%')
      .margin({ bottom: 40 })

      // 创建房间按钮
      Button('创建房间')
        .width('85%')
        .height(50)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .backgroundColor('#1890FF')
        .borderRadius(8)
        .margin({ bottom: 16 })
        .onClick(() => {
          console.log('创建房间:', this.roomName || '随机房间');
          // TODO: 实现创建房间逻辑
        })

      // 加入房间按钮
      Button('加入房间')
        .width('85%')
        .height(50)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .backgroundColor('#52C41A')
        .borderRadius(8)
        .margin({ bottom: 16 })
        .onClick(() => {
          if (!this.roomName) {
            console.error('请输入房间名称');
            return;
          }
          console.log('加入房间:', this.roomName);
          // TODO: 实现加入房间逻辑
        })

      // 游戏说明
      Column() {
        Text('游戏说明')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 12 })

        Text('1. 每轮一人画画，其他人猜词')
          .fontSize(14)
          .fontColor('#666')
          .width('85%')

        Text('2. 限时 60 秒，猜对得分')
          .fontSize(14)
          .fontColor('#666')
          .width('85%')

        Text('3. 先达到 100 分者获胜')
          .fontSize(14)
          .fontColor('#666')
          .width('85%')
      }
      .marginTop(40)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .backgroundColor('#fff')
  }
}
`
    },

    // 2. 游戏房间页面
    {
      path: `${baseDir}\\entry\\src\\main\\ets\\pages\\GameRoom.ets`,
      content: `/**
 * 游戏房间页面
 */
@Entry
@Component
struct GameRoom {
  @State players: Array<{ id: string, name: string, score: number, isDrawer: boolean }> = [];
  @State currentWord: string = '';
  @State timeLeft: number = 60;
  @State isDrawer: boolean = false;
  @State gameStatus: string = 'waiting';

  build() {
    Column() {
      // 顶部信息栏
      Row() {
        Text('游戏房间')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)

        Blank()

        Text('⏱️ ' + this.timeLeft.toString() + 's')
          .fontSize(18)
          .fontColor(this.timeLeft < 10 ? '#FF4D4F' : '#333')
      }
      .width('100%')
      .height(60)
      .padding({ left: 20, right: 20 })
      .backgroundColor('#f5f5f5')

      // 游戏状态
      if (this.gameStatus === 'waiting') {
        this.WaitingView()
      } else if (this.gameStatus === 'drawing') {
        this.DrawingView()
      } else if (this.gameStatus === 'guessing') {
        this.GuessingView()
      }

      // 玩家列表
      Column() {
        Text('玩家列表')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 12 })

        ForEach(this.players, (player) => {
          Row() {
            Text(player.name)
              .fontSize(16)
              .width('40%')

            Text(player.score.toString() + '分')
              .fontSize(16)
              .fontColor('#1890FF')

            if (player.isDrawer) {
              Text('🎨')
                .fontSize(20)
            }
          }
          .width('90%')
          .height(50)
          .justifyContent(FlexAlign.SpaceBetween)
          .padding({ left: 20, right: 20 })
          .margin({ bottom: 8 })
          .backgroundColor('#fafafa')
          .borderRadius(8)
        })
      }
      .width('100%')
      .flexGrow(1)
      .padding({ top: 20 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#fff')
  }

  @Builder
  WaitingView() {
    Column() {
      Text('等待游戏开始...')
        .fontSize(18)
        .fontColor('#666')
        .margin({ bottom: 20 })

      Button('开始游戏')
        .width('60%')
        .height(45)
        .fontSize(16)
        .onClick(() => {
          this.gameStatus = 'drawing';
          this.StartGame();
        })
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .flexGrow(1)
  }

  @Builder
  DrawingView() {
    Column() {
      if (this.isDrawer) {
        Text('请画出：' + this.currentWord)
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1890FF')
          .margin({ bottom: 20 })

        // 画布区域（占位）
        Column() {
          Text('[画布区域]')
            .fontSize(16)
            .fontColor('#999')
        }
        .width('90%')
        .height(400)
        .backgroundColor('#f0f0f0')
        .borderRadius(8)
        .justifyContent(FlexAlign.Center)
      } else {
        Text('等待其他玩家绘画...')
          .fontSize(20)
          .fontColor('#666')
      }
    }
    .width('100%')
    .flexGrow(1)
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  GuessingView() {
    Column() {
      Text('请猜出这个词')
        .fontSize(20)
        .fontColor('#333')
        .margin({ bottom: 20 })

      TextInput({ placeholder: '输入你的答案' })
        .width('80%')
        .height(50)
        .backgroundColor('#f5f5f5')
        .borderRadius(8)
        .margin({ bottom: 20 })

      Button('提交答案')
        .width('60%')
        .height(45)
        .fontSize(16)
        .backgroundColor('#52C41A')
    }
    .width('100%')
    .flexGrow(1)
    .justifyContent(FlexAlign.Center)
  }

  StartGame() {
    const randomIndex = Math.floor(Math.random() * this.players.length);
    this.players.forEach((player, index) => {
      player.isDrawer = (index === randomIndex);
    });

    const words = ['苹果', '香蕉', '汽车', '飞机', '太阳', '月亮', '小狗', '小猫'];
    this.currentWord = words[Math.floor(Math.random() * words.length)];

    const timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(timer);
        this.gameStatus = 'guessing';
      }
    }, 1000);
  }
}
`
    },

    // 3. WebSocket 管理器
    {
      path: `${baseDir}\\entry\\src\\main\\ets\\utils\\WebSocketManager.ets`,
      content: `/**
 * WebSocket 连接管理
 */
import websocket from '@ohos.net.websocket';

export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: websocket.WebSocket | null = null;
  private serverUrl: string = 'ws://localhost:8080';
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public async connect(url?: string): Promise<void> {
    if (url) {
      this.serverUrl = url;
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = websocket.createWebSocket();

        this.ws.on('open', () => {
          console.log('WebSocket 连接成功');
          this.isConnected = true;
          resolve();
        });

        this.ws.on('error', (err) => {
          console.error('WebSocket 连接失败:', err);
          this.isConnected = false;
          reject(err);
        });

        this.ws.on('message', (data) => {
          this.handleMessage(data as string);
        });

        this.ws.connect(this.serverUrl);
      } catch (err) {
        reject(err);
      }
    });
  }

  public send(type: string, data: any): void {
    if (!this.isConnected || !this.ws) {
      console.error('WebSocket 未连接');
      return;
    }

    const message = {
      type,
      data,
      timestamp: Date.now()
    };

    this.ws.send(JSON.stringify(message));
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  public isConnecting(): boolean {
    return this.isConnected;
  }

  private handleMessage(rawData: string): void {
    try {
      const message = JSON.parse(rawData);
      console.log('收到消息:', message);
    } catch (err) {
      console.error('解析消息失败:', err);
    }
  }
}

export const MessageTypes = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  START_GAME: 'start_game',
  DRAWING_UPDATE: 'drawing_update',
  GUESS_WORD: 'guess_word',
  GAME_RESULT: 'game_result'
};
`
    },

    // 4. 词库管理
    {
      path: `${baseDir}\\entry\\src\\main\\ets\\utils\\WordBank.ets`,
      content: `/**
 * 词库管理
 */
export class WordBank {
  private static categories = {
    easy: ['苹果', '香蕉', '橘子', '西瓜', '草莓', '小狗', '小猫', '小兔', '太阳', '月亮'],
    medium: ['汽车', '飞机', '火车', '轮船', '自行车', '电脑', '手机', '电视', '冰箱', '空调'],
    hard: ['人工智能', '区块链', '云计算', '大数据', '物联网', '机器人', '虚拟现实', '增强现实']
  };

  public static getRandomWord(difficulty: string = 'medium'): string {
    const words = this.categories[difficulty as keyof typeof this.categories] || this.categories.medium;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  public static getWords(count: number = 5, difficulty: string = 'medium'): string[] {
    const words = this.categories[difficulty as keyof typeof this.categories] || this.categories.medium;
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  public static addWord(word: string, difficulty: string = 'medium'): void {
    if (!this.categories[difficulty as keyof typeof this.categories]) {
      console.error('无效的难度等级');
      return;
    }

    if (!this.categories[difficulty as keyof typeof this.categories].includes(word)) {
      this.categories[difficulty as keyof typeof this.categories].push(word);
    }
  }
}
`
    },

    // 5. 玩家列表组件
    {
      path: `${baseDir}\\entry\\src\\main\\ets\\components\\PlayerList.ets`,
      content: `/**
 * 玩家列表组件
 */
@Entry
@Component
struct PlayerList {
  @State players: Array<{ id: string, name: string, score: number, isDrawer: boolean }> = [];

  build() {
    Column() {
      Text('玩家列表')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 12 })

      ForEach(this.players, (player) => {
        Row() {
          Text(player.name)
            .fontSize(16)
            .width('40%')

          Text(player.score.toString() + '分')
            .fontSize(16)
            .fontColor('#1890FF')

          if (player.isDrawer) {
            Text('🎨')
              .fontSize(20)
          }
        }
        .width('90%')
        .height(50)
        .justifyContent(FlexAlign.SpaceBetween)
        .padding({ left: 20, right: 20 })
        .margin({ bottom: 8 })
        .backgroundColor('#fafafa')
        .borderRadius(8)
      })
    }
    .width('100%')
    .padding({ top: 20 })
  }
}
`
    },

    // 6. 倒计时组件
    {
      path: `${baseDir}\\entry\\src\\main\\ets\\components\\Timer.ets`,
      content: `/**
 * 倒计时组件
 */
@Entry
@Component
struct Timer {
  @State timeLeft: number = 60;
  @State isRunning: boolean = false;

  aboutToAppear() {
    this.startTimer();
  }

  build() {
    Row() {
      Text('⏱️ ')
        .fontSize(20)
      
      Text(this.timeLeft.toString() + 's')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor(this.timeLeft < 10 ? '#FF4D4F' : '#333')
    }
    .padding({ left: 16, right: 16 })
    .backgroundColor('#f5f5f5')
    .borderRadius(8)
  }

  private startTimer() {
    this.isRunning = true;
    const timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.isRunning = false;
        clearInterval(timer);
      }
    }, 1000);
  }

  public reset(seconds: number) {
    this.timeLeft = seconds;
    this.startTimer();
  }
}
`
    },

    // 7. 画布组件
    {
      path: `${baseDir}\\entry\\src\\main\\ets\\components\\DrawingCanvas.ets`,
      content: `/**
 * 画布组件
 */
@Entry
@Component
struct DrawingCanvas {
  @State private paths: Array<Array<{ x: number, y: number }>> = [];
  @State private currentPath: Array<{ x: number, y: number }> = [];
  @State private brushColor: string = '#000000';
  @State private brushSize: number = 4;

  build() {
    Column() {
      // 工具栏
      Row() {
        ForEach(['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'], (color) => {
          Button('')
            .width(30)
            .height(30)
            .backgroundColor(color)
            .borderRadius(15)
            .border({
              width: this.brushColor === color ? 3 : 1,
              color: this.brushColor === color ? '#333' : '#ccc'
            })
            .onClick(() => {
              this.brushColor = color;
            })
            .margin({ right: 8 })
        })

        Blank()

        Button('清空')
          .fontSize(14)
          .onClick(() => {
            this.paths = [];
            this.currentPath = [];
          })
      }
      .width('100%')
      .height(60)
      .padding({ left: 16, right: 16 })
      .backgroundColor('#f5f5f5')

      // 画布区域
      Canvas(this.DrawingCanvasBuilder)
        .width('90%')
        .height(400)
        .backgroundColor('#ffffff')
        .border({
          width: 1,
          color: '#ddd'
        })
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  DrawingCanvasBuilder() {
    // Canvas 绘制逻辑
  }
}
`
    },

    // 8. 配置文件
    {
      path: `${baseDir}\\entry\\src\\main\\module.json5`,
      content: `{
  "module": {
    "name": "entry",
    "type": "entry",
    "description": "$string:module_desc",
    "mainElement": "EntryAbility",
    "deviceTypes": [
      "phone",
      "tablet"
    ],
    "deliveryWithInstall": true,
    "installationFree": false,
    "pages": "$profile:main_pages",
    "abilities": [
      {
        "name": "EntryAbility",
        "srcEntry": "./ets/entryability/EntryAbility.ets",
        "description": "$string:EntryAbility_desc",
        "icon": "$media:icon",
        "label": "$string:EntryAbility_label",
        "startWindowIcon": "$media:icon",
        "startWindowBackground": "$color:start_window_background",
        "exported": true,
        "skills": [
          {
            "entities": [
              "entity.system.home"
            ],
            "actions": [
              "action.system.home"
            ]
          }
        ]
      }
    ]
  }
}
`
    }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const file of projectFiles) {
    console.log('📝 创建文件：' + file.path);
    
    try {
      await safeWrite.execute({
        path: file.path,
        content: file.content,
        overwrite: true
      });
      console.log('✅ 创建成功\n');
      successCount++;
    } catch (error) {
      console.error('❌ 创建失败:', error.message, '\n');
      failCount++;
    }
  }

  console.log('\n========================================');
  console.log('✅ 项目创建完成！');
  console.log('📁 项目位置：' + baseDir);
  console.log('📊 成功：' + successCount + ' 个文件');
  console.log('📊 失败：' + failCount + ' 个文件');
  console.log('\n📝 下一步：');
  console.log('1. 在 DevEco Studio 中打开项目');
  console.log('2. 配置签名');
  console.log('3. 连接设备或启动模拟器');
  console.log('4. 运行项目');
  console.log('========================================\n');
}

createCompleteHarmonyGame().catch(console.error);
