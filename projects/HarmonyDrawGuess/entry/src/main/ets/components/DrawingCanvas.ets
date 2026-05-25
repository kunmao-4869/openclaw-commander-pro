/**
 * 画布组件
 */
@Entry
@Component
struct DrawingCanvas {
  @State brushColor: string = '#000000';
  @State brushSize: number = 4;

  build() {
    Column() {
      // 颜色选择
      Row() {
        ForEach(['#000000', '#FF0000', '#00FF00', '#0000FF'], (color) => {
          Button('')
            .width(30)
            .height(30)
            .backgroundColor(color)
            .borderRadius(15)
            .onClick(() => { this.brushColor = color; })
            .margin({ right: 8 })
        })
        Blank()
        Button('清空').fontSize(14).onClick(() => { /* 清空逻辑 */ })
      }
      .width('100%')
      .height(60)
      .padding({ left: 16, right: 16 })

      // Canvas 画布
      Canvas()
        .width('90%')
        .height(400)
        .backgroundColor('#ffffff')
        .border({ width: 1, color: '#ddd' })
    }
    .width('100%')
    .height('100%')
  }
}
