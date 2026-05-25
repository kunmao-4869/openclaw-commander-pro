/**
 * 自主学习项目工作流
 * 演示：从搜索资料到完成项目的完整流程
 */

import { skillManager } from '../skills/core/SkillManager.js';
import { AdvancedWorkflowEngine } from './AdvancedWorkflowEngine.js';
import { ParallelStep, ActionStep, ConditionStep } from './WorkflowEngine.js';
import { AdvancedWorkflowBuilder } from './AdvancedWorkflowEngine.js';

/**
 * 创建自主学习工作流
 * @param {string} topic - 学习主题
 * @param {string} projectType - 项目类型
 */
export function createSelfLearningWorkflow(topic, projectType = 'demo') {
  const builder = new AdvancedWorkflowBuilder(
    `learn_${topic.replace(/\s+/g, '_')}`,
    `自主学习：${topic}`
  );

  builder.workflow.id = `learn_${topic.replace(/\s+/g, '_')}`;

  // 阶段 1: 并行收集资料
  const researchParallel = new ParallelStep({
    id: 'research_phase',
    name: '资料收集阶段',
    steps: [
      // 1.1 通用搜索
      new ActionStep({
        id: 'web_search_general',
        name: '通用搜索',
        action: 'web_search',
        params: {
          query: `${topic} 教程 入门`,
          limit: 10
        }
      }),
      // 1.2 维基百科搜索
      new ActionStep({
        id: 'wiki_search',
        name: '维基百科搜索',
        action: 'wikipedia_search',
        params: {
          query: topic,
          limit: 5
        }
      }),
      // 1.3 最新动态搜索
      new ActionStep({
        id: 'news_search',
        name: '最新动态',
        action: 'news_search',
        params: {
          query: topic
        }
      }),
      // 1.4 最佳实践搜索
      new ActionStep({
        id: 'best_practices',
        name: '最佳实践',
        action: 'web_search',
        params: {
          query: `${topic} 最佳实践 2026`
        }
      })
    ]
  });

  builder.workflow.startStep = 'research_phase';
  builder.workflow.steps.set('research_phase', researchParallel);

  // 阶段 2: 分析收集的资料
  const analyzeGeneral = new ActionStep({
    id: 'analyze_general',
    name: '分析通用搜索结果',
    action: 'analyze_search_results',
    params: {
      query: `${topic} 教程`,
      results: [] // 会引用 web_search_general 的输出
    }
  });

  builder.workflow.steps.set('analyze_general', analyzeGeneral);
  builder.workflow.steps.get('research_phase').onSuccess = 'analyze_general';

  // 阶段 3: 对比多个来源
  const compareSources = new ActionStep({
    id: 'compare_all',
    name: '对比所有来源',
    action: 'compare_sources',
    params: {
      sources: []
    }
  });

  builder.workflow.steps.set('compare_all', compareSources);
  builder.workflow.steps.get('analyze_general').onSuccess = 'compare_all';

  // 阶段 4: 条件判断 - 是否找到足够资料
  const checkSufficient = new ConditionStep({
    id: 'check_sufficient',
    name: '检查资料是否充足',
    condition: async (context) => {
      const compareResult = context.outputs['compare_all']?.comparison;
      return compareResult && compareResult.length > 0;
    },
    branches: {
      true: 'create_learning_plan',
      false: 'expand_search'
    }
  });

  builder.workflow.steps.set('check_sufficient', checkSufficient);
  builder.workflow.steps.get('compare_all').onSuccess = 'check_sufficient';

  // 阶段 5a: 创建学习计划
  const createPlan = new ActionStep({
    id: 'create_learning_plan',
    name: '创建学习计划',
    action: 'analyze_search_results',
    params: {
      query: `${topic} 学习路径 从入门到项目`,
      results: []
    }
  });

  builder.workflow.steps.set('create_learning_plan', createPlan);

  // 阶段 5b: 扩展搜索（资料不足时）
  const expandSearch = new ActionStep({
    id: 'expand_search',
    name: '扩展搜索',
    action: 'web_search',
    params: {
      query: `${topic} 完整指南 深度教程`
    }
  });

  builder.workflow.steps.set('expand_search', expandSearch);
  
  // 扩展搜索后回到创建计划
  builder.workflow.steps.get('expand_search').onSuccess = 'create_learning_plan';

  // 阶段 6: 启动开发工具
  const launchIDE = new ActionStep({
    id: 'launch_ide',
    name: '启动开发工具',
    action: 'launch_application',
    params: {
      appName: 'Trae'
    }
  });

  builder.workflow.steps.set('launch_ide', launchIDE);
  builder.workflow.steps.get('create_learning_plan').onSuccess = 'launch_ide';

  // 阶段 7: 创建项目文件
  const createProject = new ActionStep({
    id: 'create_project',
    name: '创建项目结构',
    action: 'safe_list_directory',
    params: {
      path: './projects'
    }
  });

  builder.workflow.steps.set('create_project', createProject);
  builder.workflow.steps.get('launch_ide').onSuccess = 'create_project';

  builder.lastStepId = 'create_project';

  return builder.build();
}

/**
 * 运行自主学习工作流
 */
async function runSelfLearning(topic = 'React', projectType = 'todo-app') {
  console.log('='.repeat(70));
  console.log(`🎓 开始自主学习：${topic}`);
  console.log(`📁 项目类型：${projectType}`);
  console.log('='.repeat(70));
  console.log('');

  const engine = new AdvancedWorkflowEngine({
    skillManager
  });

  const workflow = createSelfLearningWorkflow(topic, projectType);
  engine.registerWorkflow(workflow);

  console.log('📋 工作流已创建，开始执行...\n');

  try {
    const result = await engine.executeWorkflow(workflow.id, {
      executeSkill: async (skillName, params) => {
        console.log(`  [执行] ${skillName}`, JSON.stringify(params).slice(0, 100));
        
        // 模拟执行（实际会调用真实技能）
        if (skillName === 'web_search') {
          return {
            success: true,
            results: [
              { title: `${topic} 官方教程`, text: '从基础到高级的完整教程...' },
              { title: `${topic} 实战项目`, text: '10 个实战项目练习...' }
            ],
            total: 2
          };
        } else if (skillName === 'wikipedia_search') {
          return {
            success: true,
            results: [
              { title: `${topic} - 维基百科`, snippet: `${topic}的详细介绍...` }
            ]
          };
        } else if (skillName === 'analyze_search_results') {
          return {
            success: true,
            analysis: `学习${topic}的关键点：\n1. 基础概念\n2. 核心特性\n3. 实战应用\n4. 最佳实践`
          };
        } else if (skillName === 'compare_sources') {
          return {
            success: true,
            comparison: `多源对比结果：\n- 官方教程最权威\n- 实战项目最重要\n- 建议结合学习`
          };
        } else if (skillName === 'launch_application') {
          return {
            success: true,
            message: `已启动 ${params.appName}`
          };
        }
        
        return { success: true };
      }
    });

    console.log('');
    console.log('✅ 自主学习完成!');
    console.log('');
    console.log('📊 执行结果:');
    console.log(`  - 工作流：${result.workflowName}`);
    console.log(`  - 执行步骤：${result.stepsExecuted}`);
    console.log(`  - 耗时：${result.duration}ms`);
    console.log(`  - 输出数量：${Object.keys(result.outputs).length}`);
    console.log('');
    console.log('📚 学习成果:');
    console.log('  1. ✅ 收集了多个来源的资料');
    console.log('  2. ✅ 分析了教程和最佳实践');
    console.log('  3. ✅ 对比了不同学习路径');
    console.log('  4. ✅ 创建了学习计划');
    console.log('  5. ✅ 启动了开发工具');
    console.log('');
    console.log('💡 下一步:');
    console.log('  - 按照学习计划逐步实践');
    console.log('  - 遇到问题可以继续搜索');
    console.log('  - 完成项目后总结经验');
    console.log('');

    return result;
  } catch (error) {
    console.error('❌ 学习过程失败:', error.message);
    throw error;
  }
}

// 导出
export { runSelfLearning };

// 自动运行演示
runSelfLearning('React', 'todo-app').catch(console.error);
