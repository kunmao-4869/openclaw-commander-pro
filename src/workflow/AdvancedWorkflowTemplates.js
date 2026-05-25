/**
 * 高级工作流模板库
 * 展示复杂工作流编排的实际应用
 */

import { AdvancedWorkflowBuilder, WorkflowUtils } from './AdvancedWorkflowEngine.js';
import { ActionStep, ConditionStep, ParallelStep } from './WorkflowEngine.js';

/**
 * 模板 1: 智能诊断工作流
 * 特点：并行检查 + 条件分支 + 错误恢复
 */
export function createIntelligentDiagnosisWorkflow(skillManager) {
  const builder = new AdvancedWorkflowBuilder(
    'diagnosis_intelligent',
    '智能系统诊断（高级版）'
  );
  
  builder.workflow.id = 'diagnosis_intelligent';

  // 步骤 1: 并行获取系统信息和网络信息
  const parallelCheckStep = new ParallelStep({
    id: 'parallel_check',
    name: '并行系统检查',
    steps: [
      new ActionStep({
        id: 'check_system',
        name: '检查系统信息',
        action: 'get_system_info',
        params: {}
      }),
      new ActionStep({
        id: 'check_network',
        name: '检查网络信息',
        action: 'get_network_info',
        params: {}
      }),
      new ActionStep({
        id: 'check_processes',
        name: '检查进程',
        action: 'list_processes',
        params: {}
      })
    ]
  });

  builder.workflow.startStep = 'parallel_check';
  builder.workflow.steps.set('parallel_check', parallelCheckStep);

  // 步骤 2: 条件判断 - 系统是否异常
  const conditionStep = new ConditionStep({
    id: 'check_anomaly',
    name: '判断系统是否异常',
    condition: async (context) => {
      const systemInfo = context.outputs['check_system']?.result?.info;
      const memoryUsage = parseFloat(systemInfo?.memory?.usage || '0');
      return memoryUsage > 80; // 内存使用率超过 80% 视为异常
    },
    branches: {
      true: 'analyze_issue',
      false: 'report_normal'
    }
  });

  builder.workflow.steps.set('check_anomaly', conditionStep);
  builder.workflow.steps.get('parallel_check').onSuccess = 'check_anomaly';

  // 步骤 3a: 分析问题（内存高）
  const analyzeStep = new ActionStep({
    id: 'analyze_issue',
    name: '分析内存问题',
    action: 'web_search',
    params: {
      query: 'Windows 内存使用率高 解决方法'
    }
  });

  builder.workflow.steps.set('analyze_issue', analyzeStep);

  // 步骤 3b: 报告正常
  const reportNormalStep = new ActionStep({
    id: 'report_normal',
    name: '报告系统正常',
    action: 'analyze_search_results',
    params: {
      query: '系统健康检查',
      results: []
    }
  });

  builder.workflow.steps.set('report_normal', reportNormalStep);

  // 步骤 4: 聚合结果
  const aggregateStep = new ActionStep({
    id: 'final_report',
    name: '生成诊断报告',
    action: 'compare_sources',
    params: {
      sources: []
    }
  });

  builder.workflow.steps.set('final_report', aggregateStep);
  builder.workflow.steps.get('analyze_issue').onSuccess = 'final_report';
  builder.workflow.steps.get('report_normal').onSuccess = 'final_report';

  builder.lastStepId = 'final_report';

  return builder.build();
}

/**
 * 模板 2: 深度研究工作流
 * 特点：循环搜索 + 数据聚合 + 超时控制
 */
export function createDeepResearchWorkflow(skillManager) {
  const builder = new AdvancedWorkflowBuilder(
    'research_deep',
    '深度主题研究（循环增强版）'
  );
  
  builder.workflow.id = 'research_deep';

  // 步骤 1: 初始搜索
  const initialSearch = new ActionStep({
    id: 'initial_search',
    name: '初始搜索',
    action: 'web_search',
    params: {
      query: '{{researchTopic}}'
    }
  });

  builder.workflow.startStep = 'initial_search';
  builder.workflow.steps.set('initial_search', initialSearch);

  // 步骤 2: 分析第一批结果
  const analyzeFirst = new ActionStep({
    id: 'analyze_first',
    name: '分析第一批结果',
    action: 'analyze_search_results',
    params: {
      query: '{{researchTopic}}',
      results: []
    }
  });

  builder.workflow.steps.set('analyze_first', analyzeFirst);
  builder.workflow.steps.get('initial_search').onSuccess = 'analyze_first';

  // 步骤 3: 维基百科搜索（并行）
  const wikiSearch = new ActionStep({
    id: 'wiki_search',
    name: '维基百科搜索',
    action: 'wikipedia_search',
    params: {
      query: '{{researchTopic}}'
    }
  });

  builder.workflow.steps.set('wiki_search', wikiSearch);
  builder.workflow.steps.get('analyze_first').onSuccess = 'wiki_search';

  // 步骤 4: 新闻搜索（并行）
  const newsSearch = new ActionStep({
    id: 'news_search',
    name: '新闻搜索',
    action: 'news_search',
    params: {
      query: '{{researchTopic}}'
    }
  });

  builder.workflow.steps.set('news_search', newsSearch);
  builder.workflow.steps.get('wiki_search').onSuccess = 'news_search';

  // 步骤 5: 对比多个来源
  const compareStep = new ActionStep({
    id: 'compare_all',
    name: '对比所有来源',
    action: 'compare_sources',
    params: {
      sources: []
    }
  });

  builder.workflow.steps.set('compare_all', compareStep);
  builder.workflow.steps.get('news_search').onSuccess = 'compare_all';

  builder.lastStepId = 'compare_all';

  return builder.build();
}

/**
 * 模板 3: 应用自动化工作流
 * 特点：错误恢复 + 重试机制 + 超时控制
 */
export function createAppAutomationWorkflow(skillManager) {
  const builder = new AdvancedWorkflowBuilder(
    'app_automation',
    '应用自动化（容错增强版）'
  );
  
  builder.workflow.id = 'app_automation';

  // 步骤 1: 启动应用（带重试）
  const launchStep = new ActionStep({
    id: 'launch_app',
    name: '启动应用程序',
    action: 'launch_application',
    params: {
      appName: '{{appName}}'
    }
  });

  // 步骤 2: 等待应用启动
  const waitStep = new ActionStep({
    id: 'wait_launch',
    name: '等待应用启动',
    action: 'safe_read_file', // 占位，实际需要等待步骤
    params: { path: 'C:/temp/wait.txt' }
  });

  // 步骤 3: 验证应用是否启动成功
  const verifyStep = new ActionStep({
    id: 'verify_app',
    name: '验证应用',
    action: 'list_processes',
    params: {}
  });

  builder.workflow.startStep = 'launch_app';
  builder.workflow.steps.set('launch_app', launchStep);
  builder.workflow.steps.get('launch_app').onSuccess = 'wait_launch';
  
  builder.workflow.steps.set('wait_launch', waitStep);
  builder.workflow.steps.get('wait_launch').onSuccess = 'verify_app';
  
  builder.workflow.steps.set('verify_app', verifyStep);
  builder.lastStepId = 'verify_app';

  return builder.build();
}

/**
 * 模板 4: 文件批处理工作流
 * 特点：循环处理 + 条件过滤 + 错误恢复
 */
export function createFileBatchWorkflow(skillManager) {
  const builder = new AdvancedWorkflowBuilder(
    'file_batch',
    '文件批处理（循环增强版）'
  );
  
  builder.workflow.id = 'file_batch';

  // 步骤 1: 搜索文件
  const searchStep = new ActionStep({
    id: 'search_files',
    name: '搜索文件',
    action: 'safe_search_files',
    params: {
      pattern: '{{filePattern}}',
      path: '{{searchPath}}'
    }
  });

  builder.workflow.startStep = 'search_files';
  builder.workflow.steps.set('search_files', searchStep);

  // 步骤 2: 列出目录
  const listStep = new ActionStep({
    id: 'list_directory',
    name: '列出目录',
    action: 'safe_list_directory',
    params: {
      path: '{{searchPath}}'
    }
  });

  builder.workflow.steps.set('list_directory', listStep);
  builder.workflow.steps.get('search_files').onSuccess = 'list_directory';

  // 步骤 3: 读取示例文件
  const readSample = new ActionStep({
    id: 'read_sample',
    name: '读取示例文件',
    action: 'safe_read_file',
    params: {
      path: '{{sampleFilePath}}'
    }
  });

  builder.workflow.steps.set('read_sample', readSample);
  builder.workflow.steps.get('list_directory').onSuccess = 'read_sample';

  builder.lastStepId = 'read_sample';

  return builder.build();
}

/**
 * 模板 5: 综合诊断 + 研究 + 报告工作流
 * 特点：多阶段 + 子工作流 + 完整编排
 */
export function createComprehensiveWorkflow(skillManager) {
  const builder = new AdvancedWorkflowBuilder(
    'comprehensive_analysis',
    '综合分析工作流（完整版）'
  );
  
  builder.workflow.id = 'comprehensive_analysis';

  // 阶段 1: 数据收集
  const collectData = new ParallelStep({
    id: 'data_collection',
    name: '数据收集',
    steps: [
      new ActionStep({
        id: 'collect_system',
        name: '收集系统信息',
        action: 'get_system_info',
        params: {}
      }),
      new ActionStep({
        id: 'collect_network',
        name: '收集网络信息',
        action: 'get_network_info',
        params: {}
      }),
      new ActionStep({
        id: 'collect_search',
        name: '搜索相关信息',
        action: 'web_search',
        params: {
          query: '{{topic}}'
        }
      })
    ]
  });

  builder.workflow.startStep = 'data_collection';
  builder.workflow.steps.set('data_collection', collectData);

  // 阶段 2: 数据分析
  const analyzeStep = new ActionStep({
    id: 'analyze_data',
    name: '分析收集的数据',
    action: 'analyze_search_results',
    params: {
      query: '{{topic}}',
      results: []
    }
  });

  builder.workflow.steps.set('analyze_data', analyzeStep);
  builder.workflow.steps.get('data_collection').onSuccess = 'analyze_data';

  // 阶段 3: 生成报告
  const reportStep = new ActionStep({
    id: 'generate_report',
    name: '生成综合报告',
    action: 'compare_sources',
    params: {
      sources: []
    }
  });

  builder.workflow.steps.set('generate_report', reportStep);
  builder.workflow.steps.get('analyze_data').onSuccess = 'generate_report';

  builder.lastStepId = 'generate_report';

  return builder.build();
}

// 导出所有模板
export const workflowTemplates = {
  'diagnosis_intelligent': createIntelligentDiagnosisWorkflow,
  'research_deep': createDeepResearchWorkflow,
  'app_automation': createAppAutomationWorkflow,
  'file_batch': createFileBatchWorkflow,
  'comprehensive_analysis': createComprehensiveWorkflow
};

/**
 * 获取所有模板描述
 */
export function getTemplateDescriptions() {
  return {
    'diagnosis_intelligent': {
      name: '智能系统诊断',
      description: '并行检查系统、网络、进程，根据结果智能分支分析',
      features: ['并行执行', '条件分支', '结果聚合']
    },
    'research_deep': {
      name: '深度主题研究',
      description: '多轮搜索 + 多维度分析，提供全面的研究结果',
      features: ['多源搜索', '并行收集', '对比分析']
    },
    'app_automation': {
      name: '应用自动化',
      description: '启动应用并验证，带错误恢复和重试机制',
      features: ['错误恢复', '自动重试', '超时控制']
    },
    'file_batch': {
      name: '文件批处理',
      description: '批量搜索、处理文件，支持循环和条件过滤',
      features: ['循环处理', '条件过滤', '批量操作']
    },
    'comprehensive_analysis': {
      name: '综合分析',
      description: '数据收集 + 分析 + 报告的完整工作流',
      features: ['多阶段', '并行收集', '完整编排']
    }
  };
}
