/**
 * 词库管理
 */
export class WordBank {
  private static words = {
    easy: ['苹果', '香蕉', '小狗', '小猫', '太阳', '月亮'],
    medium: ['汽车', '飞机', '电脑', '手机', '电视'],
    hard: ['人工智能', '区块链', '云计算', '大数据']
  };

  public static getRandomWord(difficulty: string = 'medium'): string {
    const list = this.words[difficulty as keyof typeof this.words] || this.words.medium;
    return list[Math.floor(Math.random() * list.length)];
  }

  public static getWords(count: number = 5): string[] {
    const all = [...this.words.easy, ...this.words.medium, ...this.words.hard];
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
