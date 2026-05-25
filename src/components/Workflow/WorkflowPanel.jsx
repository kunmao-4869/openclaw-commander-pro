import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, Activity, Sparkles } from 'lucide-react'
import { workflowEngine, WorkflowEngine } from '../../workflow/WorkflowEngine.js'
import { workflowTemplates as templates } from '../../workflow/WorkflowTemplates.js'
import { skillManager } from '../../skills/core/SkillManager.js'
import AIWorkflowCreator from './AIWorkflowCreator.jsx'

/**
 * 工作流面板组件
 */
export default function WorkflowPanel() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [workflows, setWorkflows] = useState([])
  const [executionStatus, setExecutionStatus] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionHistory, setExecutionHistory] = useState([])
  const [executionLogs, setExecutionLogs] = useState([])
  const [showAICreator, setShowAICreator] = useState(false)

  // 加载可用工作流
  useEffect(() => {
    const availableWorkflows = Object.entries(templates).map(([key, factory]) => {
      const workflow = factory()
      return {
        key,
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        steps: workflow.steps.size
      }
    })
    setWorkflows(availableWorkflows)
  }, [])

  // 执行工作流
  const executeWorkflow = async (workflowKey) => {
    const workflow = templates[workflowKey]()
    setSelectedWorkflow(workflow)
    setIsExecuting(true)
    setExecutionStatus({ status: 'running', step: 0 })
    setExecutionLogs([])

    try {
      // 创建带有 skillManager 的工作流引擎实例
      const engine = new WorkflowEngine({
        skillManager: skillManager
      })
      
      // 注册工作流
      engine.registerWorkflow(workflow)
      
      // 添加日志记录
      const log = (message) => {
        setExecutionLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          message
        }])
      }
      
      log(`开始执行：${workflow.name}`)
      
      // 执行工作流
      const result = await engine.executeWorkflow(workflow.id, {
        // 示例参数
        projectPath: './my-project',
        projectName: 'my-app',
        userInput: '帮我分析一下这个项目',
        dataSource: './data.csv',
        dataFormat: 'csv',
        // 注入日志函数
        onStepExecute: (stepName) => log(`执行步骤：${stepName}`),
        onStepComplete: (stepName, result) => log(`步骤完成：${stepName}`),
        onStepError: (stepName, error) => log(`步骤失败：${stepName} - ${error.message}`)
      })

      log(`执行完成，总耗时：${result.duration}ms`)

      setExecutionStatus({
        status: 'completed',
        result
      })

      setExecutionHistory(prev => [...prev, {
        workflow: workflow.name,
        status: 'success',
        duration: result.duration,
        timestamp: new Date().toISOString()
      }])

    } catch (error) {
      log(`执行失败：${error.message}`)
      
      setExecutionStatus({
        status: 'failed',
        error: error.message
      })

      setExecutionHistory(prev => [...prev, {
        workflow: workflow.name,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">工作流中心</h2>
          
          {/* AI 生成按钮 */}
          <button
            onClick={() => setShowAICreator(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 rounded-lg transition-all transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">AI 生成工作流</span>
          </button>
        </div>
        <p className="text-dark-400">
          自动化执行复杂任务，支持顺序执行、条件分支、并行处理
          <span className="ml-2 text-primary-400">✨ 新增：AI 智能生成工作流</span>
        </p>
      </div>

      {/* 工作流列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {workflows.map((workflow) => (
          <div
            key={workflow.key}
            className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-600/50 transition-all cursor-pointer group"
            onClick={() => !isExecuting && executeWorkflow(workflow.key)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold group-hover:text-primary-400 transition-colors">
                  {workflow.name}
                </h3>
                <p className="text-sm text-dark-400 mt-1">
                  {workflow.description}
                </p>
              </div>
              <div className="text-xs text-dark-500 bg-dark-700 px-2 py-1 rounded">
                {workflow.steps} 步骤
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={isExecuting}
                className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-700 disabled:cursor-not-allowed rounded-lg text-sm transition-colors flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                执行
              </button>
              <button className="px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm transition-colors">
                详情
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 执行状态 */}
      {executionStatus && (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-6">
          <h3 className="text-lg font-semibold mb-4">执行状态</h3>
          
          {executionStatus.status === 'running' && (
            <div className="flex items-center space-x-3 text-blue-400">
              <Activity className="w-5 h-5 animate-spin" />
              <span>正在执行...</span>
            </div>
          )}

          {executionStatus.status === 'completed' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>执行完成</span>
              </div>
              <div className="text-sm text-dark-400">
                <div>耗时：{executionStatus.result.duration}ms</div>
                <div>步骤：{executionStatus.result.stepsExecuted}</div>
              </div>
            </div>
          )}

          {executionStatus.status === 'failed' && (
            <div className="flex items-center space-x-3 text-red-400">
              <XCircle className="w-5 h-5" />
              <span>执行失败</span>
              <div className="text-sm text-red-300 mt-2">{executionStatus.error}</div>
            </div>
          )}
        </div>
      )}

      {/* 执行日志 */}
      {executionLogs && executionLogs.length > 0 && (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            执行日志
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {executionLogs.map((log, index) => (
              <div key={index} className="text-sm font-mono bg-dark-700 p-2 rounded">
                <span className="text-dark-400 mr-2">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-dark-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI 工作流创建器 */}
      {showAICreator && (
        <AIWorkflowCreator
          onClose={() => setShowAICreator(false)}
          onWorkflowGenerated={(workflow, result) => {
            console.log('AI 生成的工作流已执行:', workflow, result);
          }}
        />
      )}

      {/* 执行历史 */}
      {executionHistory.length > 0 && (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold mb-4">执行历史</h3>
          <div className="space-y-2">
            {executionHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {item.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm">{item.workflow}</span>
                </div>
                <div className="text-xs text-dark-400">
                  {item.status === 'success' ? `${item.duration}ms` : item.error}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
