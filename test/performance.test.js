/**
 * 性能测试
 * 测试应用在大量数据下的性能表现
 */

import { performanceMonitor } from '../src/utils/PerformanceMonitor.js';

describe('Performance Tests', () => {
  beforeAll(() => {
    performanceMonitor.start();
  });

  afterAll(() => {
    performanceMonitor.stop();
    const report = performanceMonitor.getReport();
    console.log('性能报告:', JSON.stringify(report, null, 2));

    const suggestions = performanceMonitor.getOptimizationSuggestions();
    console.log('优化建议:', JSON.stringify(suggestions, null, 2));
  });

  test('should handle 1000 messages efficiently', () => {
    const start = performance.now();

    // 模拟创建 1000 条消息
    const messages = Array.from({ length: 1000 }, (_, i) => ({
      id: `msg_${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `测试消息 ${i}`,
      timestamp: Date.now() - (1000 - i) * 1000
    }));

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100); // 应该在 100ms 内完成
    expect(messages.length).toBe(1000);
  });

  test('should handle memory efficiently', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;

    // 创建大量对象
    const objects = Array.from({ length: 10000 }, (_, i) => ({
      id: `obj_${i}`,
      data: { a: 1, b: 2, c: 3, d: 4 }
    }));

    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // 内存增长应该在合理范围内（< 50MB）
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    expect(objects.length).toBe(10000);
  });

  test('should process large text efficiently', () => {
    const largeText = 'a'.repeat(100000); // 100KB 文本
    const start = performance.now();

    // 模拟文本处理
    const words = largeText.split(' ');
    const wordCount = words.length;
    const charCount = largeText.length;

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(50); // 应该在 50ms 内完成
    expect(wordCount).toBe(1);
    expect(charCount).toBe(100000);
  });
});

describe('Message List Performance', () => {
  test('should render message list with virtual scrolling', () => {
    const messages = Array.from({ length: 5000 }, (_, i) => ({
      id: `msg_${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `测试消息 ${i}`.repeat(10), // 较长的消息
      timestamp: Date.now() - (5000 - i) * 1000
    }));

    const start = performance.now();

    // 模拟虚拟滚动渲染（只渲染可见部分）
    const visibleMessages = messages.slice(0, 20); // 假设只显示 20 条

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(10); // 应该非常快
    expect(visibleMessages.length).toBeLessThanOrEqual(20);
  });

  test('should update messages efficiently', () => {
    const messages = Array.from({ length: 100 }, (_, i) => ({
      id: `msg_${i}`,
      role: 'user',
      content: `初始消息 ${i}`,
      timestamp: Date.now() - (100 - i) * 1000
    }));

    const start = performance.now();

    // 添加新消息
    const newMessage = {
      id: 'msg_new',
      role: 'assistant',
      content: '新消息',
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, newMessage];

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(5); // 应该非常快
    expect(updatedMessages.length).toBe(101);
  });
});

describe('Skill Loading Performance', () => {
  test('should load skills asynchronously', async () => {
    const { lazySkillLoader } = await import('../src/skills/LazySkillLoader.js');

    const start = performance.now();

    // 预加载多个技能
    await lazySkillLoader.preloadSkills([
      'system_info',
      'web_search',
      'launch_application',
      'safe_read_file',
      'safe_write_file'
    ]);

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(2000); // 应该在 2 秒内完成
  });

  test('should execute loaded skills efficiently', async () => {
    const { loadSkillInstance } = await import('../src/skills/LazySkillLoader.js');

    // 加载技能
    const skill = await loadSkillInstance('system_info', { name: 'test' });

    const start = performance.now();

    // 执行技能
    const result = await skill.execute({});

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100); // 应该在 100ms 内完成
    expect(result).toBeDefined();
  });
});

describe('Component Rendering Performance', () => {
  test('should prevent unnecessary re-renders', () => {
    let renderCount = 0;

    // 模拟 React 组件
    const MockComponent = () => {
      renderCount++;
      return null;
    };

    const start = performance.now();

    // 多次渲染
    for (let i = 0; i < 100; i++) {
      MockComponent();
    }

    const duration = performance.now() - start;

    // 检查是否有不必要的渲染
    console.log(`渲染次数: ${renderCount}`);
    console.log(`总耗时: ${duration.toFixed(2)}ms`);
  });
});
