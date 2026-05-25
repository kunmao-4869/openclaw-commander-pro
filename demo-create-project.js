/**
 * 高级示例：自动创建完整的项目结构和代码
 */

import DevAutomationEngine from './src/automation/DevAutomationEngine.js';

async function createCompleteProject() {
  console.log('🚀 自动创建完整项目 - 待办事项应用\n');
  console.log('========================================\n');
  
  const engine = new DevAutomationEngine();
  
  try {
    // 1. 连接 IDE
    console.log('📍 步骤 1: 连接 IDE');
    await engine.autoConnect();
    console.log('✅ 已连接\n');
    
    // 2. 创建项目文件结构
    console.log('📍 步骤 2: 创建项目文件结构');
    
    // 文件 1: Todo.ts - 数据模型
    await createFile(engine, 'Todo.ts', `/**
 * 待办事项数据模型
 */

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export class TodoItem implements Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  
  constructor(title: string, priority: Todo['priority'] = 'medium') {
    this.id = Date.now();
    this.title = title;
    this.completed = false;
    this.createdAt = new Date();
    this.priority = priority;
  }
  
  complete(): void {
    this.completed = true;
    console.log(\`✅ 已完成：\${this.title}\`);
  }
  
  getPriorityLabel(): string {
    const labels = {
      low: '🟢 低',
      medium: '🟡 中',
      high: '🔴 高'
    };
    return labels[this.priority];
  }
}
`);
    
    await engine.sleep(1000);
    
    // 文件 2: TodoStorage.ts - 数据存储
    await createFile(engine, 'TodoStorage.ts', `/**
 * 待办事项存储服务
 */

import { Todo, TodoItem } from './Todo';

export class TodoStorage {
  private todos: Todo[] = [];
  private storageKey = 'todos';
  
  constructor() {
    this.load();
  }
  
  /**
   * 添加待办事项
   */
  add(todo: Todo): void {
    this.todos.push(todo);
    this.save();
    console.log(\`📝 已添加：\${todo.title}\`);
  }
  
  /**
   * 获取所有待办事项
   */
  getAll(): Todo[] {
    return this.todos;
  }
  
  /**
   * 获取未完成的待办事项
   */
  getPending(): Todo[] {
    return this.todos.filter(t => !t.completed);
  }
  
  /**
   * 获取已完成的待办事项
   */
  getCompleted(): Todo[] {
    return this.todos.filter(t => t.completed);
  }
  
  /**
   * 标记为完成
   */
  complete(id: number): boolean {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = true;
      this.save();
      return true;
    }
    return false;
  }
  
  /**
   * 删除待办事项
   */
  delete(id: number): boolean {
    const index = this.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }
  
  /**
   * 统计
   */
  getStats(): { total: number; pending: number; completed: number } {
    return {
      total: this.todos.length,
      pending: this.todos.filter(t => !t.completed).length,
      completed: this.todos.filter(t => t.completed).length
    };
  }
  
  /**
   * 保存到本地存储
   */
  private save(): void {
    try {
      const data = JSON.stringify(this.todos, null, 2);
      console.log('💾 保存数据...');
      // 在实际应用中，这里会写入文件或 localStorage
    } catch (error) {
      console.error('保存失败:', error);
    }
  }
  
  /**
   * 从本地存储加载
   */
  private load(): void {
    try {
      console.log('📂 加载数据...');
      // 在实际应用中，这里会从文件或 localStorage 读取
      this.todos = [];
    } catch (error) {
      console.error('加载失败:', error);
    }
  }
}
`);
    
    await engine.sleep(1000);
    
    // 文件 3: TodoApp.ts - 主应用
    await createFile(engine, 'TodoApp.ts', `/**
 * 待办事项应用主程序
 */

import { TodoItem } from './Todo';
import { TodoStorage } from './TodoStorage';

export class TodoApp {
  private storage: TodoStorage;
  
  constructor() {
    this.storage = new TodoStorage();
    console.log('🎯 待办事项应用已启动\\n');
  }
  
  /**
   * 添加待办事项
   */
  addTodo(title: string, priority: 'low' | 'medium' | 'high' = 'medium'): void {
    const todo = new TodoItem(title, priority);
    this.storage.add(todo);
  }
  
  /**
   * 完成待办事项
   */
  completeTodo(id: number): void {
    if (this.storage.complete(id)) {
      console.log('✅ 操作成功');
    } else {
      console.log('❌ 未找到该待办事项');
    }
  }
  
  /**
   * 删除待办事项
   */
  deleteTodo(id: number): void {
    if (this.storage.delete(id)) {
      console.log('🗑️  已删除');
    } else {
      console.log('❌ 未找到该待办事项');
    }
  }
  
  /**
   * 列出所有待办事项
   */
  listTodos(): void {
    const todos = this.storage.getAll();
    
    if (todos.length === 0) {
      console.log('📭 暂无待办事项');
      return;
    }
    
    console.log('\\n📋 待办事项列表:');
    console.log('─'.repeat(50));
    
    todos.forEach(todo => {
      const status = todo.completed ? '✅' : '⬜';
      const priority = todo.priority === 'high' ? '🔴' : 
                       todo.priority === 'medium' ? '🟡' : '🟢';
      
      console.log(\`\${status} [\${todo.id}] \${priority} \${todo.title}\`);
    });
    
    console.log('─'.repeat(50));
  }
  
  /**
   * 显示统计
   */
  showStats(): void {
    const stats = this.storage.getStats();
    
    console.log('\\n📊 统计信息:');
    console.log(\`  总计：\${stats.total}\`);
    console.log(\`  未完成：\${stats.pending}\`);
    console.log(\`  已完成：\${stats.completed}\`);
  }
  
  /**
   * 运行演示
   */
  runDemo(): void {
    console.log('🎬 运行演示...\\n');
    
    // 添加一些示例待办事项
    this.addTodo('学习 TypeScript', 'high');
    this.addTodo('编写单元测试', 'medium');
    this.addTodo('阅读文档', 'low');
    this.addTodo('完成项目', 'high');
    
    // 显示列表
    this.listTodos();
    
    // 完成一个
    const todos = this.storage.getAll();
    if (todos.length > 0) {
      this.completeTodo(todos[0].id);
    }
    
    // 显示统计
    this.showStats();
    
    console.log('\\n✨ 演示完成！');
  }
}

// 主函数
function main(): void {
  const app = new TodoApp();
  app.runDemo();
}

// 执行
main();
`);
    
    await engine.sleep(1000);
    
    // 文件 4: index.ts - 入口文件
    await createFile(engine, 'index.ts', `/**
 * 应用入口
 */

import { TodoApp } from './TodoApp';

console.log('=================================');
console.log('🎯 待办事项管理系统');
console.log('=================================\\n');

// 创建并运行应用
const app = new TodoApp();

// 显示帮助
console.log('💡 可用功能:');
console.log('  - addTodo(title, priority) - 添加待办');
console.log('  - completeTodo(id) - 完成待办');
console.log('  - deleteTodo(id) - 删除待办');
console.log('  - listTodos() - 列出所有');
console.log('  - showStats() - 显示统计');
console.log('  - runDemo() - 运行演示\\n');

// 运行演示
app.runDemo();
`);
    
    await engine.sleep(1000);
    
    // 3. 格式化所有文件
    console.log('\\n📍 步骤 3: 格式化所有代码');
    await engine.formatCode();
    console.log('✅ 格式化完成\\n');
    
    // 4. 保存所有
    console.log('📍 步骤 4: 保存所有文件');
    await engine.executeStep({ action: 'save_all' });
    console.log('✅ 保存完成\\n');
    
    // 5. 查看历史
    console.log('📍 步骤 5: 操作历史');
    const history = engine.getHistory();
    console.log(\`共执行 \${history.length} 个操作\`);
    
    console.log('\\n========================================');
    console.log('🎉 项目创建完成！');
    console.log('========================================\\n');
    
    console.log('📁 创建的文件:');
    console.log('  1. Todo.ts - 数据模型');
    console.log('  2. TodoStorage.ts - 存储服务');
    console.log('  3. TodoApp.ts - 主应用');
    console.log('  4. index.ts - 入口文件');
    
    console.log('\\n💡 下一步:');
    console.log('  - 在 IDE 中查看创建的文件');
    console.log('  - 运行 index.ts 查看效果');
    console.log('  - 根据需要修改代码');
    
  } catch (error) {
    console.error('\\n❌ 创建失败:', error.message);
  } finally {
    engine.disconnect();
    console.log('\\n👋 已断开连接');
  }
}

/**
 * 辅助函数：创建文件
 */
async function createFile(engine: DevAutomationEngine, filename: string, content: string) {
  console.log(\`   创建：\${filename}\`);
  await engine.connector.executeAction('new_file', { filename });
  await engine.sleep(300);
  await engine.writeContent(content);
  await engine.sleep(300);
  console.log(\`   ✅ \${filename} 完成\`);
}

// 运行
createCompleteProject().catch(console.error);
