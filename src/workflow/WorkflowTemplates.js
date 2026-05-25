import { WorkflowBuilder, ActionStep, ConditionStep } from './WorkflowEngine'

/**
 * 预定义工作流模板
 */

/**
 * 工作流 1: 项目初始化
 * 流程：列出目录 → 显示系统信息 → 完成
 */
export function createProjectInitWorkflow() {
  return new WorkflowBuilder('project_init', '项目初始化工作流')
    .withDescription('自动初始化新项目结构')
    
    // 步骤 1: 列出当前目录
    .addAction('列出目录', 'safe_list_directory', {
      path: '.'
    })
    
    // 步骤 2: 获取系统信息
    .addAction('获取系统信息', 'get_system_info', {
      detail_level: 'basic'
    })
    
    .build()
}

/**
 * 工作流 2: 代码质量检查
 * 流程：列出源文件 → 获取进程信息 → 完成
 */
export function createCodeQualityWorkflow() {
  return new WorkflowBuilder('code_quality', '代码质量检查工作流')
    .withDescription('自动执行代码质量检查')
    
    // 步骤 1: 列出源代码目录
    .addAction('列出源代码', 'safe_list_directory', {
      path: './src'
    })
    
    // 步骤 2: 获取进程列表
    .addAction('获取进程列表', 'list_processes', {})
    
    .build()
}

/**
 * 工作流 3: 文件备份
 * 流程：搜索文件 → 列出备份目录 → 完成
 */
export function createBackupWorkflow() {
  return new WorkflowBuilder('file_backup', '文件备份工作流')
    .withDescription('自动备份重要文件')
    
    // 步骤 1: 搜索源代码文件
    .addAction('搜索源代码', 'safe_search_files', {
      pattern: '*.jsx',
      path: './src'
    })
    
    // 步骤 2: 列出备份目录
    .addAction('列出备份目录', 'safe_list_directory', {
      path: './backup'
    })
    
    .build()
}

/**
 * 工作流 4: 网络诊断
 * 流程：Ping 测试 → 获取网络信息 → Web 搜索 → 完成
 */
export function createNetworkDiagnosisWorkflow() {
  return new WorkflowBuilder('network_diagnosis', '网络诊断工作流')
    .withDescription('自动诊断网络问题')
    
    // 步骤 1: Ping 测试
    .addAction('Ping 测试', 'ping_test', {
      host: '8.8.8.8',
      count: 4
    })
    
    // 步骤 2: 获取网络信息
    .addAction('获取网络信息', 'get_network_info', {})
    
    // 步骤 3: 搜索网络问题
    .addAction('搜索网络问题', 'web_search', {
      query: 'network diagnosis tools'
    })
    
    .build()
}

/**
 * 工作流 5: 智能助手（简化版）
 * 流程：搜索信息 → 分析结果 → 完成
 */
export function createSmartAssistantWorkflow() {
  return new WorkflowBuilder('smart_assistant', '智能助手工作流')
    .withDescription('根据任务类型智能选择执行路径')
  
    // 步骤 1: 搜索信息
    .addAction('搜索信息', 'web_search', {
      query: '{{userInput}}'
    })
    
    // 步骤 2: 分析搜索结果
    .addAction('分析结果', 'analyze_search_results', {
      query: '{{userInput}}',
      results: '{{web_search.results}}'
    })
    
    .build()
}

/**
 * 工作流 6: 数据分析
 * 流程：搜索数据 → 比较来源 → 完成
 */
export function createDataAnalysisWorkflow() {
  return new WorkflowBuilder('data_analysis', '数据分析工作流')
    .withDescription('自动分析数据并生成报告')
    
    // 步骤 1: 搜索数据
    .addAction('搜索数据', 'web_search', {
      query: '{{dataSource}}'
    })
    
    // 步骤 2: 比较数据来源
    .addAction('比较来源', 'compare_sources', {
      sources: '{{web_search.results}}'
    })
    
    .build()
}

// 导出所有工作流工厂
export const workflowTemplates = {
  project_init: createProjectInitWorkflow,
  code_quality: createCodeQualityWorkflow,
  file_backup: createBackupWorkflow,
  network_diagnosis: createNetworkDiagnosisWorkflow,
  smart_assistant: createSmartAssistantWorkflow,
  data_analysis: createDataAnalysisWorkflow
}
