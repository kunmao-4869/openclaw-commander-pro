/**
 * 自主代码创作引擎
 * 根据需求描述直接创作原创代码，不依赖搜索
 */

class CodeCreator {
  constructor() {
    // 编程语言特性库
    this.languageFeatures = {
      python: {
        extension: '.py',
        importSyntax: 'import',
        classSyntax: 'class',
        functionSyntax: 'def',
        commentStyle: '#',
        entryPoint: 'if __name__ == "__main__"',
        features: ['动态类型', '缩进语法', '丰富的标准库']
      },
      javascript: {
        extension: '.js',
        importSyntax: 'import/export',
        classSyntax: 'class/constructor',
        functionSyntax: 'function/=>',
        commentStyle: '//',
        entryPoint: '直接执行',
        features: ['异步编程', '事件驱动', '原型继承']
      },
      java: {
        extension: '.java',
        importSyntax: 'import',
        classSyntax: 'public class',
        functionSyntax: 'public static void',
        commentStyle: '//',
        entryPoint: 'public static void main',
        features: ['强类型', '面向对象', 'JVM 运行']
      },
      cpp: {
        extension: '.cpp',
        importSyntax: '#include',
        classSyntax: 'class',
        functionSyntax: '返回类型 函数名',
        commentStyle: '//',
        entryPoint: 'int main',
        features: ['手动内存管理', '多范式', '高性能']
      }
    };

    // 常见游戏/应用模板
    this.templates = {
      'guess_game': this.createGuessGame.bind(this),
      'calculator': this.createCalculator.bind(this),
      'todo_list': this.createTodoList.bind(this),
      'chat_bot': this.createChatBot.bind(this),
      'file_organizer': this.createFileOrganizer.bind(this),
      'password_generator': this.createPasswordGenerator.bind(this)
    };
  }

  /**
   * 根据需求创作代码
   * @param {string} description - 需求描述
   * @param {string} language - 编程语言
   * @param {object} options - 其他选项
   */
  async createCode(description, language = 'python', options = {}) {
    console.log(`\n🎨 开始创作代码：${description}`);
    console.log(`   语言：${language}`);
    
    // 分析需求
    const analysis = this.analyzeRequirement(description);
    
    // 选择合适的模板或自定义创作
    let code;
    if (analysis.template && this.templates[analysis.template]) {
      code = await this.templates[analysis.template](analysis, language, options);
    } else {
      code = await this.customCreate(analysis, language, options);
    }
    
    return {
      success: true,
      language,
      description,
      code,
      filename: `${analysis.name}${this.languageFeatures[language].extension}`,
      analysis
    };
  }

  /**
   * 分析需求
   */
  analyzeRequirement(description) {
    const lowerDesc = description.toLowerCase();
    
    // 识别应用类型
    let template = null;
    if (lowerDesc.includes('猜') && lowerDesc.includes('数字')) {
      template = 'guess_game';
    } else if (lowerDesc.includes('计算')) {
      template = 'calculator';
    } else if (lowerDesc.includes('代办') || lowerDesc.includes('清单')) {
      template = 'todo_list';
    } else if (lowerDesc.includes('聊天') || lowerDesc.includes('对话')) {
      template = 'chat_bot';
    } else if (lowerDesc.includes('文件') || lowerDesc.includes('整理')) {
      template = 'file_organizer';
    } else if (lowerDesc.includes('密码') || lowerDesc.includes('生成')) {
      template = 'password_generator';
    }
    
    // 提取名称
    const nameMatch = description.match(/(\w+) 游戏/);
    const name = nameMatch ? nameMatch[1] : 'App';
    
    return {
      template,
      name,
      description,
      features: this.extractFeatures(description),
      complexity: this.assessComplexity(description)
    };
  }

  /**
   * 提取功能特性
   */
  extractFeatures(description) {
    const features = [];
    
    if (description.includes('随机')) features.push('random');
    if (description.includes('提示')) features.push('hint');
    if (description.includes('记录') || description.includes('统计')) features.push('statistics');
    if (description.includes('难度')) features.push('difficulty');
    if (description.includes('界面') || description.includes('GUI')) features.push('gui');
    if (description.includes('文件')) features.push('file_io');
    if (description.includes('网络')) features.push('network');
    
    return features;
  }

  /**
   * 评估复杂度
   */
  assessComplexity(description) {
    const wordCount = description.length;
    if (wordCount < 20) return 'simple';
    if (wordCount < 50) return 'medium';
    return 'complex';
  }

  /**
   * 创建猜数字游戏
   */
  async createGuessGame(analysis, language, options) {
    const { name = 'NumberBomb' } = analysis;
    
    if (language === 'python') {
      return this.generatePythonGuessGame(name, options);
    } else if (language === 'javascript') {
      return this.generateJavaScriptGuessGame(name, options);
    } else if (language === 'java') {
      return this.generateJavaGuessGame(name, options);
    }
    
    throw new Error(`不支持的语言：${language}`);
  }

  /**
   * 生成 Python 猜数字游戏
   */
  generatePythonGuessGame(name, options) {
    const { minNum = 1, maxNum = 100, withHint = true } = options;
    
    return `"""
${name} 游戏
自动生成 - ${new Date().toLocaleDateString('zh-CN')}
"""

import random
import time


class ${name}:
    """${name} 游戏类"""
    
    def __init__(self, min_num=${minNum}, max_num=${maxNum}):
        """初始化游戏"""
        self.min_num = min_num
        self.max_num = max_num
        self.target = random.randint(min_num, max_num)
        self.attempts = 0
        self.history = []
        self.game_over = False
        
        print("=" * 50)
        print(f"🎮 欢迎来到${name}！")
        print("=" * 50)
        print(f"我想了一个 {min_num} 到 {max_num} 之间的数字")
        print("猜猜看是多少吧！\\n")
    
    def guess(self, number):
        """玩家猜测"""
        if self.game_over:
            return "游戏已结束！"
        
        self.attempts += 1
        self.history.append(number)
        
        if number == self.target:
            self.game_over = True
            return self._win_message()
        elif number < self.target:
            return f"太小了！再试一次（第{self.attempts}次）"
        else:
            return f"太大了！再试一次（第{self.attempts}次）"
    
    def _win_message(self):
        """胜利消息"""
        rating = "⭐⭐⭐⭐⭐" if self.attempts <= 5 else "⭐⭐⭐⭐" if self.attempts <= 10 else "⭐⭐⭐"
        return f"\\n🎉 恭喜你猜对了！\\n答案：{self.target}\\n次数：{self.attempts}\\n评级：{rating}"
    
    ${withHint ? `def get_hint(self):
        """获取提示"""
        if not self.history:
            return "大胆猜吧！"
        last = self.history[-1]
        if last < self.target:
            return f"提示：答案在 {last} 到 {self.max_num} 之间"
        else:
            return f"提示：答案在 {self.min_num} 到 {last} 之间"` : ''}
    
    def restart(self):
        """重新开始"""
        self.target = random.randint(self.min_num, self.max_num)
        self.attempts = 0
        self.history = []
        self.game_over = False
        print("\\n🔄 新游戏开始！")


def play():
    """主游戏函数"""
    game = ${name}()
    
    while not game.game_over:
        try:
            inp = input("\\n你的猜测（输入数字，'h' 提示，'q' 退出）：")
            
            if inp.lower() == 'q':
                print(f"游戏结束！答案是 {game.target}")
                return
            elif inp.lower() == 'h':
                ${withHint ? 'print("💡 " + game.get_hint())' : 'print("提示功能未启用")'}
                continue
            
            num = int(inp)
            if num < game.min_num or num > game.max_num:
                print(f"请输入 {game.min_num} 到 {game.max_num} 之间的数字")
                continue
            
            print(game.guess(num))
            
        except ValueError:
            print("⚠️ 请输入有效的数字！")
        except KeyboardInterrupt:
            print(f"\\n游戏中断！答案是 {game.target}")
            return
    
    # 询问再玩一次
    if input("\\n再玩一次？(y/n): ").lower() == 'y':
        play()


if __name__ == "__main__":
    play()
`;
  }

  /**
   * 生成 JavaScript 猜数字游戏
   */
  generateJavaScriptGuessGame(name, options) {
    const { minNum = 1, maxNum = 100 } = options;
    
    return `/**
 * ${name} 游戏
 * 自动生成 - ${new Date().toLocaleDateString('zh-CN')}
 */

class ${name} {
  constructor(minNum = ${minNum}, maxNum = ${maxNum}) {
    this.minNum = minNum;
    this.maxNum = maxNum;
    this.target = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    this.attempts = 0;
    this.history = [];
    this.gameOver = false;
    
    console.log('='.repeat(50));
    console.log('🎮 欢迎来到${name}！');
    console.log('='.repeat(50));
    console.log(\`我想了一个 \${minNum} 到 \${maxNum} 之间的数字\`);
    console.log('猜猜看是多少吧！\\n');
  }
  
  guess(number) {
    if (this.gameOver) {
      return '游戏已结束！';
    }
    
    this.attempts++;
    this.history.push(number);
    
    if (number === this.target) {
      this.gameOver = true;
      return this._winMessage();
    } else if (number < this.target) {
      return \`太小了！再试一次（第\${this.attempts}次）\`;
    } else {
      return \`太大了！再试一次（第\${this.attempts}次）\`;
    }
  }
  
  _winMessage() {
    const rating = this.attempts <= 5 ? '⭐⭐⭐⭐⭐' : this.attempts <= 10 ? '⭐⭐⭐⭐' : '⭐⭐⭐';
    return \`\\n🎉 恭喜你猜对了！\\n答案：\${this.target}\\n次数：\${this.attempts}\\n评级：\${rating}\`;
  }
  
  getHint() {
    if (!this.history.length) return '大胆猜吧！';
    const last = this.history[this.history.length - 1];
    if (last < this.target) {
      return \`提示：答案在 \${last} 到 \${this.maxNum} 之间\`;
    } else {
      return \`提示：答案在 \${this.minNum} 到 \${last} 之间\`;
    }
  }
  
  restart() {
    this.target = Math.floor(Math.random() * (this.maxNum - this.minNum + 1)) + this.minNum;
    this.attempts = 0;
    this.history = [];
    this.gameOver = false;
    console.log('\\n🔄 新游戏开始！');
  }
}

// Node.js 环境运行
if (typeof require !== 'undefined') {
  const readline = require('readline');
  
  function play() {
    const game = new ${name}();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    function ask() {
      if (game.gameOver) {
        rl.question('\\n再玩一次？(y/n): ', (ans) => {
          if (ans.toLowerCase() === 'y') {
            game.restart();
            ask();
          } else {
            console.log('\\n感谢游玩！🎮');
            rl.close();
          }
        });
        return;
      }
      
      rl.question('\\n你的猜测（输入数字，'h' 提示，'q' 退出）：', (input) => {
        if (input.toLowerCase() === 'q') {
          console.log(\`游戏结束！答案是 \${game.target}\`);
          rl.close();
          return;
        }
        
        if (input.toLowerCase() === 'h') {
          console.log('💡 ' + game.getHint());
          ask();
          return;
        }
        
        const num = parseInt(input);
        if (isNaN(num) || num < game.minNum || num > game.maxNum) {
          console.log(\`请输入 \${game.minNum} 到 \${game.maxNum} 之间的数字\`);
          ask();
          return;
        }
        
        console.log(game.guess(num));
        ask();
      });
    }
    
    ask();
  }
  
  play();
}

// 导出
if (typeof module !== 'undefined') {
  module.exports = ${name};
}
`;
  }

  /**
   * 生成 Java 猜数字游戏
   */
  generateJavaGuessGame(name, options) {
    const { minNum = 1, maxNum = 100 } = options;
    
    return `/**
 * ${name} 游戏
 * 自动生成 - ${new Date().toLocaleDateString('zh-CN')}
 */

import java.util.Random;
import java.util.Scanner;
import java.util.ArrayList;

public class ${name} {
    private int minNum;
    private int maxNum;
    private int target;
    private int attempts;
    private ArrayList<Integer> history;
    private boolean gameOver;
    private Scanner scanner;
    
    public ${name}() {
        this(${minNum}, ${maxNum});
    }
    
    public ${name}(int minNum, int maxNum) {
        this.minNum = minNum;
        this.maxNum = maxNum;
        this.target = new Random().nextInt(maxNum - minNum + 1) + minNum;
        this.attempts = 0;
        this.history = new ArrayList<>();
        this.gameOver = false;
        this.scanner = new Scanner(System.in);
        
        System.out.println("=".repeat(50));
        System.out.println("🎮 欢迎来到${name}！");
        System.out.println("=".repeat(50));
        System.out.println("我想了一个 " + minNum + " 到 " + maxNum + " 之间的数字");
        System.out.println("猜猜看是多少吧！\\n");
    }
    
    public String guess(int number) {
        if (gameOver) {
            return "游戏已结束！";
        }
        
        attempts++;
        history.add(number);
        
        if (number == target) {
            gameOver = true;
            return winMessage();
        } else if (number < target) {
            return "太小了！再试一次（第" + attempts + "次）";
        } else {
            return "太大了！再试一次（第" + attempts + "次）";
        }
    }
    
    private String winMessage() {
        String rating = attempts <= 5 ? "⭐⭐⭐⭐⭐" : attempts <= 10 ? "⭐⭐⭐⭐" : "⭐⭐⭐";
        return "\\n🎉 恭喜你猜对了！\\n答案：" + target + "\\n次数：" + attempts + "\\n评级：" + rating;
    }
    
    public String getHint() {
        if (history.isEmpty()) {
            return "大胆猜吧！";
        }
        int last = history.get(history.size() - 1);
        if (last < target) {
            return "提示：答案在 " + last + " 到 " + maxNum + " 之间";
        } else {
            return "提示：答案在 " + minNum + " 到 " + last + " 之间";
        }
    }
    
    public void restart() {
        target = new Random().nextInt(maxNum - minNum + 1) + minNum;
        attempts = 0;
        history.clear();
        gameOver = false;
        System.out.println("\\n🔄 新游戏开始！");
    }
    
    public static void main(String[] args) {
        ${name} game = new ${name}();
        
        while (!game.gameOver) {
            try {
                System.out.print("\\n你的猜测（输入数字，h 提示，q 退出）：");
                String input = game.scanner.nextLine();
                
                if (input.equalsIgnoreCase("q")) {
                    System.out.println("游戏结束！答案是 " + game.target);
                    return;
                }
                
                if (input.equalsIgnoreCase("h")) {
                    System.out.println("💡 " + game.getHint());
                    continue;
                }
                
                int num = Integer.parseInt(input);
                if (num < game.minNum || num > game.maxNum) {
                    System.out.println("请输入 " + game.minNum + " 到 " + game.maxNum + " 之间的数字");
                    continue;
                }
                
                System.out.println(game.guess(num));
                
            } catch (NumberFormatException e) {
                System.out.println("⚠️ 请输入有效的数字！");
            }
        }
        
        // 询问再玩一次
        System.out.print("\\n再玩一次？(y/n): ");
        if (game.scanner.nextLine().equalsIgnoreCase("y")) {
            game.restart();
            main(args);
        } else {
            System.out.println("\\n感谢游玩！🎮");
        }
    }
}
`;
  }

  /**
   * 创建计算器
   */
  async createCalculator(analysis, language, options) {
    if (language === 'python') {
      return `"""
简易计算器
"""

def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def divide(x, y):
    if y == 0:
        return "错误：除数不能为零"
    return x / y

def calculate():
    print("简易计算器")
    print("支持运算：+ - * /")
    
    while True:
        try:
            expr = input("\\n输入表达式（或 'q' 退出）：")
            if expr.lower() == 'q':
                print("再见！")
                break
            
            # 简单解析
            if '+' in expr:
                a, b = map(float, expr.split('+'))
                result = add(a, b)
            elif '-' in expr:
                a, b = map(float, expr.split('-'))
                result = subtract(a, b)
            elif '*' in expr:
                a, b = map(float, expr.split('*'))
                result = multiply(a, b)
            elif '/' in expr:
                a, b = map(float, expr.split('/'))
                result = divide(a, b)
            else:
                print("不支持的运算")
                continue
            
            print(f"结果：{result}")
            
        except Exception as e:
            print(f"错误：{e}")

if __name__ == "__main__":
    calculate()
`;
    }
    
    throw new Error(`暂不支持 ${language} 语言的计算器模板`);
  }

  /**
   * 创建待办清单
   */
  async createTodoList(analysis, language, options) {
    if (language === 'python') {
      return `"""
待办事项清单
"""

class TodoList:
    def __init__(self):
        self.todos = []
    
    def add(self, task):
        self.todos.append({"task": task, "done": False})
        print(f"已添加：{task}")
    
    def complete(self, index):
        if 0 <= index < len(self.todos):
            self.todos[index]["done"] = True
            print(f"已完成：{self.todos[index]['task']}")
        else:
            print("无效的序号")
    
    def show(self):
        if not self.todos:
            print("暂无待办事项")
            return
        
        print("\\n待办清单：")
        for i, todo in enumerate(self.todos):
            status = "✅" if todo["done"] else "⬜"
            print(f"{i + 1}. {status} {todo['task']}")
    
    def remove(self, index):
        if 0 <= index < len(self.todos):
            removed = self.todos.pop(index)
            print(f"已删除：{removed['task']}")
        else:
            print("无效的序号")


def main():
    todo = TodoList()
    
    print("待办事项清单")
    print("命令：add(添加) show(查看) complete(完成) remove(删除) q(退出)")
    
    while True:
        cmd = input("\\n> ").strip().split()
        if not cmd:
            continue
        
        action = cmd[0].lower()
        
        if action == 'q':
            print("再见！")
            break
        elif action == 'add':
            task = ' '.join(cmd[1:])
            if task:
                todo.add(task)
            else:
                print("请指定任务内容")
        elif action == 'show':
            todo.show()
        elif action == 'complete':
            if len(cmd) > 1:
                todo.complete(int(cmd[1]) - 1)
            else:
                print("请指定任务序号")
        elif action == 'remove':
            if len(cmd) > 1:
                todo.remove(int(cmd[1]) - 1)
            else:
                print("请指定任务序号")
        else:
            print("未知命令")


if __name__ == "__main__":
    main()
`;
    }
    
    throw new Error(`暂不支持 ${language} 语言的待办清单模板`);
  }

  /**
   * 创建聊天机器人
   */
  async createChatBot(analysis, language, options) {
    if (language === 'python') {
      return `"""
简易聊天机器人
"""

import random


class ChatBot:
    def __init__(self, name="小智"):
        self.name = name
        self.history = []
        
        # 预设回复
        self.responses = {
            'hello': ['你好！', '嗨！', '您好！'],
            'name': [f'我叫{name}', '我是 AI 助手'],
            'time': ['现在是几点呢？', '时间过得好快！'],
            'weather': ['今天天气不错！', '记得带伞哦！'],
            'bye': ['再见！', '拜拜！', '下次聊！']
        }
        
        print(f"🤖 {name} 已启动！")
        print("跟我聊天吧！\\n")
    
    def respond(self, message):
        """回复消息"""
        self.history.append(message)
        message_lower = message.lower()
        
        # 关键词匹配
        if any(word in message_lower for word in ['你好', 'hello', 'hi']):
            return random.choice(self.responses['hello'])
        elif '名字' in message or 'name' in message_lower:
            return random.choice(self.responses['name'])
        elif '时间' in message or 'time' in message_lower:
            return random.choice(self.responses['time'])
        elif '天气' in message or 'weather' in message_lower:
            return random.choice(self.responses['weather'])
        elif '再见' in message or 'bye' in message_lower:
            return random.choice(self.responses['bye'])
        else:
            return "嗯...我明白了！"
    
    def chat(self):
        """聊天循环"""
        while True:
            try:
                user_input = input("你：")
                if user_input.lower() == 'q':
                    print(f"{self.name}: 再见！")
                    break
                
                response = self.respond(user_input)
                print(f"{self.name}: {response}")
                
            except KeyboardInterrupt:
                print(f"\\n{self.name}: 下次聊！")
                break


if __name__ == "__main__":
    bot = ChatBot()
    bot.chat()
`;
    }
    
    throw new Error(`暂不支持 ${language} 语言的聊天机器人模板`);
  }

  /**
   * 创建密码生成器
   */
  async createPasswordGenerator(analysis, language, options) {
    if (language === 'python') {
      return `"""
密码生成器
"""

import random
import string


class PasswordGenerator:
    def __init__(self, length=12, use_upper=True, use_lower=True, 
                 use_digits=True, use_special=True):
        self.length = length
        self.use_upper = use_upper
        self.use_lower = use_lower
        self.use_digits = use_digits
        self.use_special = use_special
        
        self.chars = ''
        if use_upper:
            self.chars += string.ascii_uppercase
        if use_lower:
            self.chars += string.ascii_lowercase
        if use_digits:
            self.chars += string.digits
        if use_special:
            self.chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
        
        if not self.chars:
            raise ValueError("至少选择一种字符类型")
    
    def generate(self, count=1):
        """生成密码"""
        passwords = []
        for _ in range(count):
            password = ''.join(random.choice(self.chars) for _ in range(self.length))
            passwords.append(password)
        return passwords
    
    def check_strength(self, password):
        """检查密码强度"""
        score = 0
        if len(password) >= 8:
            score += 1
        if len(password) >= 12:
            score += 1
        if any(c.isupper() for c in password):
            score += 1
        if any(c.islower() for c in password):
            score += 1
        if any(c.isdigit() for c in password):
            score += 1
        if any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
            score += 1
        
        if score >= 6:
            return "非常强"
        elif score >= 4:
            return "中等"
        else:
            return "较弱"


def main():
    print("🔐 密码生成器")
    print("=" * 50)
    
    length = int(input("密码长度（默认 12）：") or "12")
    
    gen = PasswordGenerator(length=length)
    
    while True:
        cmd = input("\\n生成密码？(y/n/q): ").lower()
        
        if cmd == 'q':
            print("再见！")
            break
        elif cmd == 'n':
            continue
        elif cmd == 'y':
            passwords = gen.generate(5)
            print("\\n生成的密码：")
            for i, pwd in enumerate(passwords, 1):
                strength = gen.check_strength(pwd)
                print(f"{i}. {pwd} (强度：{strength})")
        else:
            print("无效命令")


if __name__ == "__main__":
    main()
`;
    }
    
    throw new Error(`暂不支持 ${language} 语言的密码生成器模板`);
  }

  /**
   * 创建文件整理器
   */
  async createFileOrganizer(analysis, language, options) {
    if (language === 'python') {
      return `"""
文件整理器
自动按类型整理文件
"""

import os
import shutil
from pathlib import Path


class FileOrganizer:
    def __init__(self, directory='.'):
        self.directory = Path(directory)
        
        # 文件类型映射
        self.extensions = {
            'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
            'Documents': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.pptx'],
            'Videos': ['.mp4', '.avi', '.mkv', '.mov', '.wmv'],
            'Music': ['.mp3', '.wav', '.flac', '.aac'],
            'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
            'Code': ['.py', '.js', '.java', '.cpp', '.c', '.html', '.css']
        }
    
    def organize(self):
        """整理文件"""
        print(f"开始整理目录：{self.directory.absolute()}")
        
        for file_path in self.directory.iterdir():
            if file_path.is_file():
                self._move_file(file_path)
        
        print("整理完成！")
    
    def _move_file(self, file_path):
        """移动文件到对应文件夹"""
        ext = file_path.suffix.lower()
        
        for folder, extensions in self.extensions.items():
            if ext in extensions:
                target_dir = self.directory / folder
                target_dir.mkdir(exist_ok=True)
                
                target_path = target_dir / file_path.name
                
                # 避免覆盖
                if target_path.exists():
                    base = file_path.stem
                    target_path = target_dir / f"{base}_duplicate{file_path.suffix}"
                
                shutil.move(str(file_path), str(target_path))
                print(f"移动：{file_path.name} -> {folder}/")
                return
        
        # 其他文件
        other_dir = self.directory / 'Other'
        other_dir.mkdir(exist_ok=True)
        shutil.move(str(file_path), str(other_dir / file_path.name))
        print(f"移动：{file_path.name} -> Other/")
    
    def preview(self):
        """预览将整理的文件"""
        print(f"预览目录：{self.directory.absolute()}\\n")
        
        stats = {folder: 0 for folder in self.extensions}
        stats['Other'] = 0
        
        for file_path in self.directory.iterdir():
            if file_path.is_file():
                ext = file_path.suffix.lower()
                found = False
                
                for folder, extensions in self.extensions.items():
                    if ext in extensions:
                        stats[folder] += 1
                        found = True
                        break
                
                if not found:
                    stats['Other'] += 1
        
        print("文件统计：")
        for folder, count in stats.items():
            if count > 0:
                print(f"  {folder}: {count} 个文件")


def main():
    print("📁 文件整理器")
    print("=" * 50)
    
    directory = input("要整理的目录（默认当前目录）：") or '.'
    
    organizer = FileOrganizer(directory)
    
    print("\\n预览：")
    organizer.preview()
    
    confirm = input("\\n确认整理？(y/n): ").lower()
    if confirm == 'y':
        organizer.organize()
    else:
        print("已取消")


if __name__ == "__main__":
    main()
`;
    }
    
    throw new Error(`暂不支持 ${language} 语言的文件整理器模板`);
  }

  /**
   * 自定义创作
   */
  async customCreate(analysis, language, options) {
    // 根据分析结果创作代码
    const code = this.generateGenericCode(analysis, language, options);
    return code;
  }

  /**
   * 生成通用代码框架
   */
  generateGenericCode(analysis, language, options) {
    const { name, description, features } = analysis;
    
    if (language === 'python') {
      return `"""
${name} - ${description}
自动生成
"""

${features.includes('random') ? 'import random' : ''}
${features.includes('time') ? 'import time' : ''}
${features.includes('datetime') ? 'from datetime import datetime' : ''}


class ${name}:
    """${name} 类"""
    
    def __init__(self):
        """初始化"""
        print("初始化 ${name}")
    
    def run(self):
        """运行"""
        print("运行 ${name}")


def main():
    """主函数"""
    app = ${name}()
    app.run()


if __name__ == "__main__":
    main()
`;
    }
    
    throw new Error(`暂不支持 ${language} 语言的自定义创作`);
  }
}

// 导出
export default CodeCreator;
