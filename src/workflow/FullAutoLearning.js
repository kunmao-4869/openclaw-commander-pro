/**
 * 完整自主学习项目演示
 * 从搜索资料 → 学习总结 → 生成代码 → 创建项目
 */

import { skillManager } from '../skills/core/SkillManager.js';
import { AdvancedWorkflowEngine } from './AdvancedWorkflowEngine.js';
import { ParallelStep, ActionStep, ConditionStep } from './WorkflowEngine.js';
import { AdvancedWorkflowBuilder } from './AdvancedWorkflowEngine.js';

/**
 * 创建完整自主学习项目工作流
 * @param {string} topic - 学习主题
 * @param {string} projectType - 项目类型
 * @param {string} outputDir - 输出目录
 */
export function createFullAutoLearningWorkflow(topic, projectType = 'demo', outputDir = './projects') {
  const builder = new AdvancedWorkflowBuilder(
    `auto_learn_${topic.replace(/\s+/g, '_')}`,
    `完全自主学习：${topic} → ${projectType}`
  );

  builder.workflow.id = `auto_learn_${topic.replace(/\s+/g, '_')}`;

  // ========== 阶段 1: 资料收集 ==========
  const researchPhase = new ParallelStep({
    id: 'research_phase',
    name: '并行资料收集',
    steps: [
      // 1.1 通用教程搜索
      new ActionStep({
        id: 'search_tutorials',
        name: '搜索教程',
        action: 'web_search',
        params: {
          query: `${topic} 教程 从入门到实战 2026`,
          limit: 15
        }
      }),
      // 1.2 维基百科（理论基础）
      new ActionStep({
        id: 'search_wiki',
        name: '维基百科',
        action: 'wikipedia_search',
        params: {
          query: topic,
          limit: 5
        }
      }),
      // 1.3 最佳实践
      new ActionStep({
        id: 'search_best_practices',
        name: '最佳实践',
        action: 'web_search',
        params: {
          query: `${topic} 最佳实践 设计模式 代码规范`
        }
      }),
      // 1.4 项目示例
      new ActionStep({
        id: 'search_examples',
        name: '项目示例',
        action: 'web_search',
        params: {
          query: `${topic} ${projectType} 项目示例 源码`
        }
      }),
      // 1.5 常见问题
      new ActionStep({
        id: 'search_faqs',
        name: '常见问题',
        action: 'web_search',
        params: {
          query: `${topic} 常见问题 踩坑 解决方案`
        }
      })
    ]
  });

  builder.workflow.startStep = 'research_phase';
  builder.workflow.steps.set('research_phase', researchPhase);

  // ========== 阶段 2: 深度学习分析 ==========
  const analyzeTutorials = new ActionStep({
    id: 'analyze_tutorials',
    name: '分析教程质量',
    action: 'analyze_search_results',
    params: {
      query: `${topic} 教程`,
      results: []
    }
  });

  builder.workflow.steps.set('analyze_tutorials', analyzeTutorials);
  builder.workflow.steps.get('research_phase').onSuccess = 'analyze_tutorials';

  const analyzeExamples = new ActionStep({
    id: 'analyze_examples',
    name: '分析项目示例',
    action: 'analyze_search_results',
    params: {
      query: `${topic} ${projectType} 示例`,
      results: []
    }
  });

  builder.workflow.steps.set('analyze_examples', analyzeExamples);
  builder.workflow.steps.get('analyze_tutorials').onSuccess = 'analyze_examples';

  // ========== 阶段 3: 综合对比 ==========
  const compareAllSources = new ActionStep({
    id: 'compare_all',
    name: '综合对比所有来源',
    action: 'compare_sources',
    params: {
      sources: []
    }
  });

  builder.workflow.steps.set('compare_all', compareAllSources);
  builder.workflow.steps.get('analyze_examples').onSuccess = 'compare_all';

  // ========== 阶段 4: 生成学习总结 ==========
  const generateSummaryStep = new ActionStep({
    id: 'generate_summary',
    name: '生成学习总结',
    action: 'analyze_search_results',
    params: {
      query: `${topic} 学习路径 知识点总结`,
      results: []
    }
  });

  builder.workflow.steps.set('generate_summary', generateSummaryStep);
  builder.workflow.steps.get('compare_all').onSuccess = 'generate_summary';

  // ========== 阶段 5: 生成项目代码 ==========
  const generateProjectCode = new ActionStep({
    id: 'generate_code',
    name: '生成项目代码',
    action: 'generate_project_code',
    params: {
      projectType: projectType,
      requirements: `基于${topic}技术的${projectType}项目`,
      techStack: topic,
      learningResults: '{{generate_summary.analysis}}'
    }
  });

  builder.workflow.steps.set('generate_code', generateProjectCode);
  builder.workflow.steps.get('generate_summary').onSuccess = 'generate_code';

  // ========== 阶段 6: 代码审查 ==========
  const reviewCode = new ActionStep({
    id: 'review_code',
    name: '代码质量审查',
    action: 'review_code',
    params: {
      files: '{{generate_code.projectConfig.files}}'
    }
  });

  builder.workflow.steps.set('review_code', reviewCode);
  builder.workflow.steps.get('generate_code').onSuccess = 'review_code';

  // ========== 阶段 7: 创建项目文件 ==========
  const createProjectFiles = new ActionStep({
    id: 'create_files',
    name: '创建项目文件',
    action: 'create_project_files',
    params: {
      projectConfig: '{{generate_code.projectConfig}}',
      basePath: outputDir
    }
  });

  builder.workflow.steps.set('create_files', createProjectFiles);
  builder.workflow.steps.get('review_code').onSuccess = 'create_files';

  // ========== 阶段 8: 启动开发工具 ==========
  const launchIDE = new ActionStep({
    id: 'launch_ide',
    name: '启动开发工具',
    action: 'launch_application',
    params: {
      appName: 'Trae'
    }
  });

  builder.workflow.steps.set('launch_ide', launchIDE);
  builder.workflow.steps.get('create_files').onSuccess = 'launch_ide';

  // ========== 阶段 9: 生成项目报告 ==========
  const generateReport = new ActionStep({
    id: 'generate_report',
    name: '生成项目报告',
    action: 'analyze_search_results',
    params: {
      query: `项目完成报告：${topic} ${projectType}`,
      results: []
    }
  });

  builder.workflow.steps.set('generate_report', generateReport);
  builder.workflow.steps.get('launch_ide').onSuccess = 'generate_report';

  builder.lastStepId = 'generate_report';

  return builder.build();
}

/**
 * 运行完全自主学习项目
 */
async function runFullAutoLearning(topic = 'React', projectType = 'todo-app', outputDir = './projects') {
  console.log('='.repeat(80));
  console.log('🎓 完全自主学习项目系统');
  console.log('='.repeat(80));
  console.log(`学习主题：${topic}`);
  console.log(`项目类型：${projectType}`);
  console.log(`输出目录：${outputDir}`);
  console.log('='.repeat(80));
  console.log('');

  const engine = new AdvancedWorkflowEngine({
    skillManager
  });

  const workflow = createFullAutoLearningWorkflow(topic, projectType, outputDir);
  engine.registerWorkflow(workflow);

  console.log('📋 工作流已创建，共 9 个阶段:\n');
  console.log('  1️⃣  并行资料收集（5 个来源）');
  console.log('  2️⃣  深度学习分析（教程 + 示例）');
  console.log('  3️⃣  综合对比所有来源');
  console.log('  4️⃣  生成学习总结');
  console.log('  5️⃣  生成项目代码');
  console.log('  6️⃣  代码质量审查');
  console.log('  7️⃣  创建项目文件');
  console.log('  8️⃣  启动开发工具');
  console.log('  9️⃣  生成项目报告');
  console.log('');
  console.log('开始执行...\n');

  try {
    // 使用真实技能执行
    const result = await engine.executeWorkflow(workflow.id);

    console.log('');
    console.log('='.repeat(80));
    console.log('🎉 完全自主学习完成!');
    console.log('='.repeat(80));
    console.log('');
    console.log('📊 执行统计:');
    console.log(`  - 工作流：${result.workflowName}`);
    console.log(`  - 执行步骤：${result.stepsExecuted}`);
    console.log(`  - 总耗时：${result.duration}ms`);
    console.log(`  - 输出数量：${Object.keys(result.outputs).length}`);
    console.log('');
    console.log('📚 学习成果:');
    console.log('  ✅ 收集了多个来源的资料');
    console.log('  ✅ 深度分析了教程和示例');
    console.log('  ✅ 对比了不同学习路径');
    console.log('  ✅ 生成了学习总结');
    console.log('  ✅ 自动生成了项目代码');
    console.log('  ✅ 完成了代码质量审查');
    console.log('  ✅ 创建了完整的项目文件');
    console.log('  ✅ 启动了开发工具');
    console.log('  ✅ 生成了项目报告');
    console.log('');
    console.log('📁 项目位置:');
    console.log(`  ${outputDir}/${projectType}/`);
    console.log('');
    console.log('💡 下一步建议:');
    console.log('  1. 在 IDE 中查看生成的代码');
    console.log('  2. 根据需求调整和优化');
    console.log('  3. 运行项目测试功能');
    console.log('  4. 继续学习进阶内容');
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

// 导出
export { runFullAutoLearning };

// 自动运行演示
console.log('\n准备启动完全自主学习项目系统...\n');
runFullAutoLearning('React', 'todo-app', './projects/react-todo').catch(console.error);
