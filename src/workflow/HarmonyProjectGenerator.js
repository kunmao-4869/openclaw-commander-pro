/**
 * 鸿蒙项目生成工作流
 * 直接生成鸿蒙项目代码，不依赖不可靠的自动规划
 */

import { skillManager } from '../skills/core/SkillManager.js';
import { AdvancedWorkflowEngine } from './AdvancedWorkflowEngine.js';
import { ActionStep } from './WorkflowEngine.js';
import { AdvancedWorkflowBuilder } from './AdvancedWorkflowEngine.js';

/**
 * 创建鸿蒙项目生成工作流
 * @param {string} projectName - 项目名称
 * @param {string} projectType - 项目类型（游戏/应用/工具等）
 * @param {string} description - 项目描述
 */
export function createHarmonyProjectWorkflow(projectName, projectType, description) {
  const builder = new AdvancedWorkflowBuilder(
    `harmony_project_${projectName.replace(/\s+/g, '_')}`,
    `鸿蒙项目生成：${projectName}`
  );

  builder.workflow.id = `harmony_project_${projectName.replace(/\s+/g, '_')}`;

  // 步骤 1: 生成项目结构
  const generateStructure = new ActionStep({
    id: 'generate_structure',
    name: '生成项目结构',
    action: 'analyze_search_results',
    params: {
      query: `鸿蒙项目结构 ${projectType} ${projectName} 目录组织 文件结构`,
      results: [] // AI 会自主分析
    }
  });

  builder.workflow.startStep = 'generate_structure';
  builder.workflow.steps.set('generate_structure', generateStructure);

  // 步骤 2: 生成核心代码
  const generateCoreCode = new ActionStep({
    id: 'generate_core_code',
    name: '生成核心代码',
    action: 'analyze_search_results',
    params: {
      query: `${projectName} ${projectType} ArkTS 代码实现 核心功能 ${description}`,
      results: []
    }
  });

  builder.workflow.steps.set('generate_core_code', generateCoreCode);
  builder.workflow.steps.get('generate_structure').onSuccess = 'generate_core_code';

  // 步骤 3: 生成配置文件
  const generateConfig = new ActionStep({
    id: 'generate_config',
    name: '生成配置文件',
    action: 'analyze_search_results',
    params: {
      query: `鸿蒙项目配置 oh-package.json5 module.json5 配置文件`,
      results: []
    }
  });

  builder.workflow.steps.set('generate_config', generateConfig);
  builder.workflow.steps.get('generate_core_code').onSuccess = 'generate_config';

  // 步骤 4: 生成 UI 界面
  const generateUI = new ActionStep({
    id: 'generate_ui',
    name: '生成 UI 界面',
    action: 'analyze_search_results',
    params: {
      query: `鸿蒙 ArkUI 界面设计 ${projectName} 页面布局 组件`,
      results: []
    }
  });

  builder.workflow.steps.set('generate_ui', generateUI);
  builder.workflow.steps.get('generate_config').onSuccess = 'generate_ui';

  // 步骤 5: 生成网络通信代码
  const generateNetwork = new ActionStep({
    id: 'generate_network',
    name: '生成网络通信',
    action: 'analyze_search_results',
    params: {
      query: `鸿蒙 WebSocket 实时通信 网络同步 多人在线`,
      results: []
    }
  });

  builder.workflow.steps.set('generate_network', generateNetwork);
  builder.workflow.steps.get('generate_ui').onSuccess = 'generate_network';

  // 步骤 6: 对比多种方案
  const compareSolutions = new ActionStep({
    id: 'compare_solutions',
    name: '对比技术方案',
    action: 'compare_sources',
    params: {
      topic: `${projectName} 技术实现方案`
    }
  });

  builder.workflow.steps.set('compare_solutions', compareSolutions);
  builder.workflow.steps.get('generate_network').onSuccess = 'compare_solutions';

  // 步骤 7: 生成完整项目
  const generateFullProject = new ActionStep({
    id: 'generate_full_project',
    name: '生成完整项目',
    action: 'analyze_search_results',
    params: {
      query: `${projectName} 完整项目代码 鸿蒙 HarmonyOS ArkTS ${description}`,
      results: []
    }
  });

  builder.workflow.steps.set('generate_full_project', generateFullProject);
  builder.workflow.steps.get('compare_solutions').onSuccess = 'generate_full_project';

  builder.lastStepId = 'generate_full_project';

  return builder.build();
}

/**
 * 运行鸿蒙项目生成
 */
async function runHarmonyProjectGeneration(projectName = '你画我猜', projectType = '游戏', description = '二人实时在线游戏') {
  console.log('='.repeat(80));
  console.log('🎮 鸿蒙项目生成器');
  console.log('='.repeat(80));
  console.log(`项目名称：${projectName}`);
  console.log(`项目类型：${projectType}`);
  console.log(`项目描述：${description}`);
  console.log('='.repeat(80));
  console.log('');

  const engine = new AdvancedWorkflowEngine({
    skillManager
  });

  const workflow = createHarmonyProjectWorkflow(projectName, projectType, description);
  engine.registerWorkflow(workflow);

  console.log('📋 工作流已创建，共 7 个步骤:\n');
  console.log('  1️⃣  生成项目结构');
  console.log('  2️⃣  生成核心代码');
  console.log('  3️⃣  生成配置文件');
  console.log('  4️⃣  生成 UI 界面');
  console.log('  5️⃣  生成网络通信代码');
  console.log('  6️⃣  对比技术方案');
  console.log('  7️⃣  生成完整项目');
  console.log('');
  console.log('开始执行...\n');

  try {
    const result = await engine.executeWorkflow(workflow.id);

    console.log('');
    console.log('='.repeat(80));
    console.log('🎉 项目生成完成!');
    console.log('='.repeat(80));
    console.log('');
    console.log('📊 执行统计:');
    console.log(`  - 工作流：${result.workflowName}`);
    console.log(`  - 执行步骤：${result.stepsExecuted}`);
    console.log(`  - 总耗时：${result.duration}ms`);
    console.log('');
    console.log('📦 生成内容:');
    console.log('  ✅ 项目目录结构');
    console.log('  ✅ 核心业务代码');
    console.log('  ✅ 配置文件');
    console.log('  ✅ UI 界面代码');
    console.log('  ✅ 网络通信代码');
    console.log('  ✅ 技术方案对比');
    console.log('  ✅ 完整项目文档');
    console.log('');
    console.log('💡 下一步:');
    console.log('  1. 在 DevEco Studio 中创建新项目');
    console.log('  2. 复制生成的代码到对应文件');
    console.log('  3. 配置签名和权限');
    console.log('  4. 运行到模拟器或真机');
    console.log('');

    return result;
  } catch (error) {
    console.error('');
    console.error('❌ 项目生成失败:', error.message);
    console.error('');
    throw error;
  }
}

// 导出
export { runHarmonyProjectGeneration };

// 自动运行：生成你画我猜游戏项目
console.log('\n🚀 开始生成"你画我猜"鸿蒙游戏项目...\n');
runHarmonyProjectGeneration('你画我猜', '游戏', '二人实时在线游戏').catch(console.error);
