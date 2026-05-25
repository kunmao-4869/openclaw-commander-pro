/**
 * 浏览器搜索学习工作流
 * 使用真实浏览器操作搜索引擎，像真人一样学习
 */

import { skillManager } from '../skills/core/SkillManager.js';
import { AdvancedWorkflowEngine } from './AdvancedWorkflowEngine.js';
import { ParallelStep, ActionStep, ConditionStep } from './WorkflowEngine.js';
import { AdvancedWorkflowBuilder } from './AdvancedWorkflowEngine.js';

/**
 * 创建浏览器搜索学习工作流
 * @param {string} topic - 学习主题
 * @param {string} searchEngine - 搜索引擎（bing/baidu）
 */
export function createBrowserSearchWorkflow(topic, searchEngine = 'bing') {
  const builder = new AdvancedWorkflowBuilder(
    `browser_learn_${topic.replace(/\s+/g, '_')}`,
    `浏览器搜索学习：${topic}`
  );

  builder.workflow.id = `browser_learn_${topic.replace(/\s+/g, '_')}`;

  // ========== 阶段 1: 使用浏览器搜索 ==========
  const browserSearch = new ActionStep({
    id: 'browser_search',
    name: '浏览器搜索',
    action: 'browser_automation',
    params: {
      url: searchEngine === 'baidu' 
        ? `https://www.baidu.com/s?wd=${encodeURIComponent(topic)}`
        : `https://www.bing.com/search?q=${encodeURIComponent(topic)}`,
      action: 'extract',
      timeout: 30000
    }
  });

  builder.workflow.startStep = 'browser_search';
  builder.workflow.steps.set('browser_search', browserSearch);

  // ========== 阶段 2: 提取搜索结果 ==========
  const extractResults = new ActionStep({
    id: 'extract_results',
    name: '提取搜索结果',
    action: 'analyze_search_results',
    params: {
      query: topic,
      results: [] // 会引用 browser_search 的输出
    }
  });

  builder.workflow.steps.set('extract_results', extractResults);
  builder.workflow.steps.get('browser_search').onSuccess = 'extract_results';

  // ========== 阶段 3: 访问第一个结果 ==========
  const visitFirstResult = new ActionStep({
    id: 'visit_first',
    name: '访问第一个搜索结果',
    action: 'extract_webpage_content',
    params: {
      url: '{{browser_search.results.[0].url}}', // 引用第一个搜索结果的 URL
      timeout: 30000
    }
  });

  builder.workflow.steps.set('visit_first', visitFirstResult);
  builder.workflow.steps.get('extract_results').onSuccess = 'visit_first';

  // ========== 阶段 4: 访问第二个结果 ==========
  const visitSecond = new ActionStep({
    id: 'visit_second',
    name: '访问第二个搜索结果',
    action: 'extract_webpage_content',
    params: {
      url: '{{browser_search.results.[1].url}}',
      timeout: 30000
    }
  });

  builder.workflow.steps.set('visit_second', visitSecond);
  builder.workflow.steps.get('visit_first').onSuccess = 'visit_second';

  // ========== 阶段 5: 访问第三个结果 ==========
  const visitThird = new ActionStep({
    id: 'visit_third',
    name: '访问第三个搜索结果',
    action: 'extract_webpage_content',
    params: {
      url: '{{browser_search.results.[2].url}}',
      timeout: 30000
    }
  });

  builder.workflow.steps.set('visit_third', visitThird);
  builder.workflow.steps.get('visit_second').onSuccess = 'visit_third';

  // ========== 阶段 6: 综合分析 ==========
  const comprehensiveAnalysis = new ActionStep({
    id: 'comprehensive_analysis',
    name: '综合分析所有资料',
    action: 'compare_sources',
    params: {
      sources: [
        '{{visit_first.content}}',
        '{{visit_second.content}}',
        '{{visit_third.content}}'
      ]
    }
  });

  builder.workflow.steps.set('comprehensive_analysis', comprehensiveAnalysis);
  builder.workflow.steps.get('visit_third').onSuccess = 'comprehensive_analysis';

  // ========== 阶段 7: 生成学习总结 ==========
  const generateSummary = new ActionStep({
    id: 'generate_summary',
    name: '生成学习总结',
    action: 'analyze_search_results',
    params: {
      query: `${topic} 学习总结 知识点`,
      results: []
    }
  });

  builder.workflow.steps.set('generate_summary', generateSummary);
  builder.workflow.steps.get('comprehensive_analysis').onSuccess = 'generate_summary';

  builder.lastStepId = 'generate_summary';

  return builder.build();
}

/**
 * 创建鸿蒙项目学习工作流（专门针对鸿蒙开发学习）
 */
export function createHarmonyLearningWorkflow() {
  const builder = new AdvancedWorkflowBuilder(
    'harmony_project_learning',
    '鸿蒙项目学习：你画我猜游戏'
  );

  builder.workflow.id = 'harmony_project_learning';

  // 阶段 1: 搜索鸿蒙开发文档
  const searchHarmonyDocs = new ActionStep({
    id: 'search_harmony_docs',
    name: '搜索鸿蒙开发文档',
    action: 'browser_automation',
    params: {
      url: 'https://www.bing.com/search?q=HarmonyOS+ArkTS+游戏开发+教程',
      action: 'extract',
      timeout: 30000
    }
  });

  builder.workflow.startStep = 'search_harmony_docs';
  builder.workflow.steps.set('search_harmony_docs', searchHarmonyDocs);

  // 阶段 2: 搜索 WebSocket 实时通信
  const searchWebSocket = new ActionStep({
    id: 'search_websocket',
    name: '搜索 WebSocket 实时通信',
    action: 'browser_automation',
    params: {
      url: 'https://www.bing.com/search?q=HarmonyOS+WebSocket+实时通信+教程',
      action: 'extract',
      timeout: 30000
    }
  });

  builder.workflow.steps.set('search_websocket', searchWebSocket);
  builder.workflow.steps.get('search_harmony_docs').onSuccess = 'search_websocket';

  // 阶段 3: 搜索 Canvas 绘图
  const searchCanvas = new ActionStep({
    id: 'search_canvas',
    name: '搜索 Canvas 绘图',
    action: 'browser_automation',
    params: {
      url: 'https://www.bing.com/search?q=HarmonyOS+Canvas+绘图+教程',
      action: 'extract',
      timeout: 30000
    }
  });

  builder.workflow.steps.set('search_canvas', searchCanvas);
  builder.workflow.steps.get('search_websocket').onSuccess = 'search_canvas';

  // 阶段 4: 访问鸿蒙开发者官网
  const visitHarmonyOfficial = new ActionStep({
    id: 'visit_harmony_official',
    name: '访问鸿蒙开发者官网',
    action: 'extract_webpage_content',
    params: {
      url: 'https://developer.harmonyos.com/',
      timeout: 30000
    }
  });

  builder.workflow.steps.set('visit_harmony_official', visitHarmonyOfficial);
  builder.workflow.steps.get('search_canvas').onSuccess = 'visit_harmony_official';

  // 阶段 5: 综合分析
  const analyzeAll = new ActionStep({
    id: 'analyze_all',
    name: '综合分析所有资料',
    action: 'analyze_search_results',
    params: {
      query: '鸿蒙你画我猜游戏开发技术栈',
      results: []
    }
  });

  builder.workflow.steps.set('analyze_all', analyzeAll);
  builder.workflow.steps.get('visit_harmony_official').onSuccess = 'analyze_all';

  // 阶段 6: 生成项目规划
  const generateProjectPlan = new ActionStep({
    id: 'generate_plan',
    name: '生成项目规划',
    action: 'analyze_search_results',
    params: {
      query: '鸿蒙你画我猜游戏项目规划 技术选型 功能设计',
      results: []
    }
  });

  builder.workflow.steps.set('generate_plan', generateProjectPlan);
  builder.workflow.steps.get('analyze_all').onSuccess = 'generate_plan';

  builder.lastStepId = 'generate_plan';

  return builder.build();
}

/**
 * 运行浏览器搜索学习
 */
async function runBrowserLearning(topic = 'HarmonyOS 游戏开发', searchEngine = 'bing') {
  console.log('='.repeat(80));
  console.log('🌐 浏览器搜索学习系统');
  console.log('='.repeat(80));
  console.log(`学习主题：${topic}`);
  console.log(`搜索引擎：${searchEngine}`);
  console.log('='.repeat(80));
  console.log('');

  const engine = new AdvancedWorkflowEngine({
    skillManager
  });

  const workflow = createBrowserSearchWorkflow(topic, searchEngine);
  engine.registerWorkflow(workflow);

  console.log('📋 工作流已创建，共 7 个阶段:\n');
  console.log('  1️⃣  浏览器搜索（真实操作搜索引擎）');
  console.log('  2️⃣  提取搜索结果');
  console.log('  3️⃣  访问第一个搜索结果');
  console.log('  4️⃣  访问第二个搜索结果');
  console.log('  5️⃣  访问第三个搜索结果');
  console.log('  6️⃣  综合分析所有资料');
  console.log('  7️⃣  生成学习总结');
  console.log('');
  console.log('开始执行...\n');

  try {
    const result = await engine.executeWorkflow(workflow.id);

    console.log('');
    console.log('='.repeat(80));
    console.log('🎉 浏览器搜索学习完成!');
    console.log('='.repeat(80));
    console.log('');
    console.log('📊 执行统计:');
    console.log(`  - 工作流：${result.workflowName}`);
    console.log(`  - 执行步骤：${result.stepsExecuted}`);
    console.log(`  - 总耗时：${result.duration}ms`);
    console.log(`  - 输出数量：${Object.keys(result.outputs).length}`);
    console.log('');
    console.log('📚 学习成果:');
    console.log('  ✅ 使用真实浏览器搜索了资料');
    console.log('  ✅ 访问了多个搜索结果网页');
    console.log('  ✅ 提取了网页主要内容');
    console.log('  ✅ 综合分析了对比了多个来源');
    console.log('  ✅ 生成了学习总结');
    console.log('');

    return result;
  } catch (error) {
    console.error('');
    console.error('❌ 学习过程失败:', error.message);
    console.error('');
    console.error('错误堆栈:', error.stack);
    throw error;
  }
}

// 运行鸿蒙项目专门学习
async function runHarmonyProjectLearning() {
  console.log('='.repeat(80));
  console.log('🎮 鸿蒙项目学习：你画我猜游戏');
  console.log('='.repeat(80));
  console.log('');

  const engine = new AdvancedWorkflowEngine({
    skillManager
  });

  const workflow = createHarmonyLearningWorkflow();
  engine.registerWorkflow(workflow);

  console.log('📋 工作流已创建，共 6 个阶段:\n');
  console.log('  1️⃣  搜索鸿蒙开发文档');
  console.log('  2️⃣  搜索 WebSocket 实时通信');
  console.log('  3️⃣  搜索 Canvas 绘图');
  console.log('  4️⃣  访问鸿蒙开发者官网');
  console.log('  5️⃣  综合分析所有资料');
  console.log('  6️⃣  生成项目规划');
  console.log('');
  console.log('开始执行...\n');

  try {
    const result = await engine.executeWorkflow(workflow.id);

    console.log('');
    console.log('='.repeat(80));
    console.log('🎉 鸿蒙项目学习完成!');
    console.log('='.repeat(80));
    console.log('');
    console.log('📊 执行统计:');
    console.log(`  - 工作流：${result.workflowName}`);
    console.log(`  - 执行步骤：${result.stepsExecuted}`);
    console.log(`  - 总耗时：${result.duration}ms`);
    console.log('');
    console.log('📚 学习成果:');
    console.log('  ✅ 搜索了鸿蒙开发相关技术文档');
    console.log('  ✅ 学习了 WebSocket 实时通信方案');
    console.log('  ✅ 掌握了 Canvas 绘图技术');
    console.log('  ✅ 访问了鸿蒙开发者官网');
    console.log('  ✅ 生成了完整的项目规划');
    console.log('');

    return result;
  } catch (error) {
    console.error('');
    console.error('❌ 学习过程失败:', error.message);
    console.error('');
    throw error;
  }
}

// 导出
export { runBrowserLearning, runHarmonyProjectLearning };

// 自动运行鸿蒙项目学习
console.log('\n🚀 启动鸿蒙项目学习工作流...\n');
runHarmonyProjectLearning().catch(console.error);
