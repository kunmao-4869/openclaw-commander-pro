/**
 * 智慧客房系统 - 页面生成器
 * 根据需求文档生成完整的 HarmonyOS 应用代码
 * 包含 5 个页面：Login, Home, Light, Curtain, Service
 */

/**
 * 生成登录页面
 */
export function generateLoginPage(projectName, roomNumber) {
  return `/**
 * ${projectName} - 登录页面
 * 智慧客房系统 HarmonyOS 应用
 * MVVM 架构 | V2 状态管理 | Navigation 导航
 * 多设备适配：手机、平板、折叠屏
 */

import router from '@ohos.router';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct Login {
  // V2 状态管理装饰器
  @State roomNumber: string = '${roomNumber}';
  @State username: string = '';
  @State rememberMe: boolean = false;
  @State isLoading: boolean = false;

  // 生命周期
  aboutToAppear() {
    console.info('Login page aboutToAppear');
    this.loadSavedCredentials();
  }

  aboutToDisappear() {
    console.info('Login page aboutToDisappear');
  }

  // 加载保存的凭证
  loadSavedCredentials() {
    if (this.rememberMe) {
      // TODO: 从首选项加载保存的房号和用户名
      console.info('Loading saved credentials...');
    }
  }

  // 保存凭证
  saveCredentials() {
    if (this.rememberMe) {
      // TODO: 保存到首选项
      console.info('Saving credentials...');
    }
  }

  // 处理登录
  handleLogin() {
    if (!this.roomNumber || !this.username) {
      promptAction.showToast({
        message: '请输入房号和用户名',
        duration: 2000
      });
      return;
    }

    this.isLoading = true;
    
    // 模拟登录验证
    setTimeout(() => {
      this.isLoading = false;
      this.saveCredentials();
      
      promptAction.showToast({
        message: '登录成功，欢迎入住',
        duration: 1500
      });
      
      // 导航到首页
      router.replaceUrl({
        url: 'pages/Home',
        params: {
          roomNumber: this.roomNumber,
          username: this.username
        }
      });
    }, 1000);
  }

  build() {
    Column() {
      // 背景 - 虚化的酒店客房内景
      Stack() {
        // 背景图片
        Image($r('app.media.hotel_room_bg'))
          .width('100%')
          .height('100%')
          .objectFit(ImageFit.Cover)
          .blur(10)
          .opacity(0.3)

        // 主内容
        Column() {
          // 顶部标题区域
          Column() {
            Text('广科•未来酒店')
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor('#D4AF37') // 金色
              .margin({ bottom: 8 })

            Text('华为 ICT 学院专属智慧旅居体验')
              .fontSize(14)
              .fontColor('#CCCCCC')
              .margin({ top: 4 })
          }
          .width('100%')
          .padding({ top: 60, bottom: 40 })
          .alignItems(HorizontalAlign.Center)

          // 登录表单
          Column() {
            // 房号输入框
            Column() {
              Text('房号')
                .fontSize(14)
                .fontColor('#D4AF37')
                .margin({ bottom: 8 })
                .fontWeight(FontWeight.Medium)

              TextInput({ 
                placeholder: '请输入房号，例如：${roomNumber}',
                text: this.roomNumber
              })
                .onChange((value: string) => {
                  this.roomNumber = value;
                })
                .padding({ left: 16, right: 16, top: 14, bottom: 14 })
                .backgroundColor('rgba(212, 175, 55, 0.1)')
                .borderRadius(12)
                .border({
                  width: 1,
                  color: 'rgba(212, 175, 55, 0.3)'
                })
            }
            .width('85%')
            .margin({ bottom: 24 })

            // 用户名输入框
            Column() {
              Text('用户名')
                .fontSize(14)
                .fontColor('#D4AF37')
                .margin({ bottom: 8 })
                .fontWeight(FontWeight.Medium)

              TextInput({ 
                placeholder: '请输入用户名，例如：xiao',
                text: this.username
              })
                .onChange((value: string) => {
                  this.username = value;
                })
                .padding({ left: 16, right: 16, top: 14, bottom: 14 })
                .backgroundColor('rgba(212, 175, 55, 0.1)')
                .borderRadius(12)
                .border({
                  width: 1,
                  color: 'rgba(212, 175, 55, 0.3)'
                })
            }
            .width('85%')
            .margin({ bottom: 24 })

            // 记住我
            Row() {
              Checkbox({ name: 'remember', group: 'login' })
                .select(this.rememberMe)
                .onChange((isChecked: boolean) => {
                  this.rememberMe = isChecked;
                })
                .color('#D4AF37')
              
              Text('记住我的信息')
                .fontSize(14)
                .fontColor('#CCCCCC')
                .margin({ left: 8 })
            }
            .width('85%')
            .justify(FlexAlign.Start)
            .margin({ bottom: 40 })

            // 立即入住按钮
            Button(this.isLoading ? '登录中...' : '立即入住')
              .width('85%')
              .height(50)
              .fontSize(18)
              .fontWeight(FontWeight.Medium)
              .fontColor('#FFFFFF')
              .backgroundColor('#D4AF37') // 金色
              .enabled(!this.isLoading)
              .onClick(() => {
                this.handleLogin();
              })
              .shadow({
                radius: 16,
                color: 'rgba(212, 175, 55, 0.4)',
                offsetX: 0,
                offsetY: 4
              })
          }
          .alignItems(HorizontalAlign.Center)

          // 底部文案
          Column() {
            Text('重塑智慧旅居体验，让科技赋能每一次下榻')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ bottom: 8 })

            Text('欢迎回家，尽享舒适之旅')
              .fontSize(12)
              .fontColor('#999999')
          }
          .width('100%')
          .position({ x: 0, y: 'calc(100% - 80px)' })
          .alignItems(HorizontalAlign.Center)
        }
        .width('100%')
        .height('100%')
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#1A1A1A') // 深色背景
  }
}

export default Login;
`;
}

// 导出其他页面生成函数（后续补充）
console.log('智慧客房页面生成器已加载');
