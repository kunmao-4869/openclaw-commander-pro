/**
 * 创建完整的鸿蒙你画我猜游戏项目
 */

import { SafeFileWriteSkill } from './src/skills/advanced/SafeFileWrite.js';

async function createCompleteGame() {
  console.log('🚀 开始创建完整的鸿蒙你画我猜游戏项目\n');
  
  const safeWrite = new SafeFileWriteSkill();
  const baseDir = 'F:\\openclaw\\commander-pro\\projects\\HarmonyDrawGuess';
  
  try {
    // 项目配置文件
    const projectFiles = [
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
      Text('你画我猜')
        .fontSize(36)
        .fontWeight(FontWeight.Bold)
        .fontColor('#1890FF')
        .margin({ bottom: 40 })

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
        })

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
        })

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
`
      },
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
      }
    ];

    // 写入所有文件
    for (const file of projectFiles) {
      console.log('📝 创建文件：' + file.path);
      
      try {
        await safeWrite.execute({
          path: file.path,
          content: file.content,
          overwrite: true
        });
        console.log('✅ 创建成功\n');
      } catch (error) {
        console.error('❌ 创建失败:', error.message, '\n');
      }
    }

    console.log('\\n✅ 项目创建完成！');
    console.log('📁 项目位置：' + baseDir);
    console.log('\\n📝 下一步：');
    console.log('1. 在 DevEco Studio 中打开项目');
    console.log('2. 配置签名');
    console.log('3. 连接设备或启动模拟器');
    console.log('4. 运行项目');
    
  } catch (error) {
    console.error('\\n❌ 项目创建失败:', error.message);
    console.error(error.stack);
  }
}

createCompleteGame().catch(console.error);
