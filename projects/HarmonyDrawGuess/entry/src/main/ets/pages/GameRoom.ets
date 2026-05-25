/**
 * 游戏房间页面
 */
@Entry
@Component
struct GameRoom {
  @State players: Array<{ name: string, score: number, isDrawer: boolean }> = [];
  @State currentWord: string = '';
  @State timeLeft: number = 60;
  @State isDrawer: boolean = false;

  build() {
    Column() {
      // 顶部信息
      Row() {
        Text('游戏房间').fontSize(20).fontWeight(FontWeight.Bold)
        Blank()
        Text('⏱️ ' + this.timeLeft.toString() + 's')
          .fontSize(18)
          .fontColor(this.timeLeft < 10 ? '#FF4D4F' : '#333')
      }
      .width('100%')
      .height(60)
      .padding({ left: 20, right: 20 })

      // 游戏区域
      if (this.isDrawer) {
        Column() {
          Text('请画出：' + this.currentWord)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .margin({ bottom: 20 })
          
          // 画布占位
          Column() {
            Text('[画布区域 - 待实现 Canvas]')
              .fontSize(16)
              .fontColor('#999')
          }
          .width('90%')
          .height(400)
          .backgroundColor('#f0f0f0')
          .justifyContent(FlexAlign.Center)
        }
        .width('100%')
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Column() {
          Text('等待其他玩家绘画...')
            .fontSize(20)
            .margin({ bottom: 20 })
          
          TextInput({ placeholder: '输入你的答案' })
            .width('80%')
            .height(50)
          
          Button('提交答案')
            .width('60%')
            .height(45)
            .margin({ top: 20 })
        }
        .width('100%')
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
      }

      // 玩家列表
      Column() {
        Text('玩家列表').fontSize(18).fontWeight(FontWeight.Bold)
        ForEach(this.players, (player) => {
          Row() {
            Text(player.name).fontSize(16)
            Blank()
            Text(player.score.toString() + '分').fontColor('#1890FF')
            if (player.isDrawer) { Text('🎨').fontSize(20) }
          }
          .width('90%')
          .height(50)
          .padding({ left: 20, right: 20 })
        })
      }
      .width('100%')
      .padding({ top: 20 })
    }
    .width('100%')
    .height('100%')
  }
}
