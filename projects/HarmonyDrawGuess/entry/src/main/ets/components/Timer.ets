/**
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
