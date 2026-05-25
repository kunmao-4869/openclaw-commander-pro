/**
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
