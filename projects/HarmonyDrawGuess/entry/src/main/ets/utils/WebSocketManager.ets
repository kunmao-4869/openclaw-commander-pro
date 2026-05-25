/**
 * WebSocket 通信管理
 */
import websocket from '@ohos.net.websocket';

export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: websocket.WebSocket | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public async connect(url: string = 'ws://localhost:8080'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = websocket.createWebSocket();
        
        this.ws.on('open', () => {
          console.log('✅ WebSocket 连接成功');
          this.isConnected = true;
          resolve();
        });

        this.ws.on('error', (err) => {
          console.error('❌ 连接失败:', err);
          this.isConnected = false;
          reject(err);
        });

        this.ws.on('message', (data) => {
          this.handleMessage(data as string);
        });

        this.ws.connect(url);
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
    this.ws.send(JSON.stringify({ type, data, timestamp: Date.now() }));
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  private handleMessage(data: string): void {
    try {
      const msg = JSON.parse(data);
      console.log('收到消息:', msg);
    } catch (err) {
      console.error('解析失败:', err);
    }
  }
}

export const MessageTypes = {
  JOIN_ROOM: 'join_room',
  START_GAME: 'start_game',
  DRAWING_UPDATE: 'drawing_update',
  GUESS_WORD: 'guess_word'
};
