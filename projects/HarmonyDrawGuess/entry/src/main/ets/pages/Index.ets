/**
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
          .alignSelf(ItemAlign.Start)
        TextInput({ placeholder: '请输入你的名字' })
          .onChange((value: string) => { this.playerName = value; })
          .width('100%')
          .height(50)
      }
      .width('85%')
      .margin({ bottom: 24 })

      Column() {
        Text('房间名称（可选）')
          .fontSize(16)
          .alignSelf(ItemAlign.Start)
        TextInput({ placeholder: '留空则随机加入' })
          .onChange((value: string) => { this.roomName = value; })
          .width('100%')
          .height(50)
      }
      .width('85%')
      .margin({ bottom: 40 })

      Button('创建房间')
        .width('85%')
        .height(50)
        .onClick(() => {
          console.log('创建房间:', this.roomName || '随机');
        })

      Button('加入房间')
        .width('85%')
        .height(50)
        .margin({ top: 16 })
        .onClick(() => {
          if (!this.roomName) {
            console.error('请输入房间名称');
            return;
          }
          console.log('加入房间:', this.roomName);
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
