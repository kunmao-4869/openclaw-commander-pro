import React, { useState, useEffect } from 'react'
import { Brain, Zap, Settings, MessageSquare, FolderOpen, Terminal, BarChart3, Workflow, Layers } from 'lucide-react'
import { useModelStore } from './store/modelStore.js'
import { useChatStore } from './store/chatStore.js'
import WorkflowEditor from './components/Workflow/WorkflowEditor.jsx'
import TerminalPanel from './components/Terminal/TerminalPanel.jsx'
import ProjectsPanel from './components/Projects/ProjectsPanel.jsx'
import AppLauncher from './components/Apps/AppLauncher.jsx'
import { openClawClient } from './lib/openclaw.js'
import { skillManager } from './skills/core/SkillManager.js'
import { taskPlanner, quickExecute } from './lib/taskPlanner.js'
import { workflowEngine } from './workflow/WorkflowEngine.js'
import { preloadCommonSkills } from './skills/LazySkillLoader.js'
import { skillsAPIClient } from './skills/SkillsAPIClient.js'
import { skillExecutor } from './skills/core/SkillExecutor.js'
import { ReadRequirementSkill } from './skills/file/ReadRequirement.js'
import { SafeFileReadSkill, SafeFileListSkill } from './skills/security/SafeFileOperations.js'
import { SafeFileWriteSkill } from './skills/advanced/SafeFileWrite.js'
import { LearnWebpageSkill } from './skills/learning/LearnWebpage.js'

/**
 * 主应用界面
 * 现代化、多标签页、模型切换
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('chat')
  const { currentModel, setCurrentModel, autoSelectModel, toggleAutoSelect } = useModelStore()
  const { messages, isLoading } = useChatStore()

  // 初始化工作流引擎和预加载技能
  const [skillsStatus, setSkillsStatus] = useState(null)

  useEffect(() => {
    // 从服务端 API 加载 Skills
    const loadSkills = async () => {
      try {
        await skillsAPIClient.loadAllSkills()
        const status = skillsAPIClient.getStatus()
        setSkillsStatus(status)
        console.log('✅ Skills 文件夹加载完成:', status)
      } catch (error) {
        console.error('❌ Skills 文件夹加载失败:', error)
        console.warn('💡 请确保后端服务已启动：npm run server')
      }
    }

    loadSkills()

    // 注册技能到全局 SkillExecutor
    console.log('📝 注册技能到全局 SkillExecutor...')
    const skills = [
      { name: 'read_requirement', instance: new ReadRequirementSkill() },
      { name: 'safe_read_file', instance: new SafeFileReadSkill() },
      { name: 'safe_list_directory', instance: new SafeFileListSkill() },
      { name: 'safe_write_file', instance: new SafeFileWriteSkill() },
      { name: 'learn_webpage', instance: new LearnWebpageSkill() }
    ]
    
    skillExecutor.registerSkills(skills)
    skillExecutor.markAsInitialized()
    
    // 将 SkillExecutor 注入到各个模块
    workflowEngine.skillExecutor = skillExecutor
    workflowEngine.skillManager = skillManager

    // 预加载常用技能
    preloadCommonSkills().then(() => {
      console.log('✅ 常用技能已预加载')
      console.log(`📊 当前已注册技能：${skillExecutor.getSkillCount()} 个`)
      console.log(`📋 技能列表：${skillExecutor.getRegisteredSkills().join(', ')}`)
    }).catch(error => {
      console.warn('⚠️ 预加载技能失败:', error)
    })

    console.log('✅ 工作流引擎已连接到技能管理器和 SkillExecutor')
  }, [])
  
  const tabs = [
    { id: 'chat', label: '对话', icon: MessageSquare },
    { id: 'workflow', label: '工作流', icon: Workflow },
    { id: 'skills', label: '技能', icon: Zap },
    { id: 'projects', label: '项目', icon: FolderOpen },
    { id: 'terminal', label: '终端', icon: Terminal },
    { id: 'analytics', label: '分析', icon: BarChart3 },
    { id: 'settings', label: '设置', icon: Settings }
  ]
  
  return (
    <div className="h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white">
      {/* 顶部导航栏 */}
      <header className="h-16 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Brain className="w-8 h-8 text-primary-400" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              OpenClaw Commander Pro
            </h1>
            {skillsStatus && (
              <div className="flex items-center space-x-2 text-xs text-green-400 mt-1">
                <Zap className="w-3 h-3" />
                <span>Skills: {skillsStatus.totalSkills} 个技能 | {skillsStatus.categories.length} 个分类</span>
              </div>
            )}
          </div>
        </div>
        
        {/* 模型切换器 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-dark-800 rounded-lg p-2">
            <button
              onClick={() => !autoSelectModel && setCurrentModel('qwen3:8b')}
              className={`px-4 py-2 rounded-md transition-all ${
                currentModel === 'qwen3:8b'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              8B 快速
            </button>
            <button
              onClick={() => !autoSelectModel && setCurrentModel('qwen3:30b')}
              className={`px-4 py-2 rounded-md transition-all ${
                currentModel === 'qwen3:30b'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              30B 强大
            </button>
          </div>
          
          <button
            onClick={toggleAutoSelect}
            className={`px-3 py-2 rounded-md text-sm ${
              autoSelectModel
                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                : 'bg-dark-700 text-dark-300'
            }`}
          >
            智能选择
          </button>
        </div>
      </header>
      
      {/* 主体内容 */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* 侧边栏 */}
        <aside className="w-64 bg-dark-900/50 border-r border-dark-700 flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
          
          {/* 状态信息 */}
          <div className="p-4 border-t border-dark-700">
            <div className="text-xs text-dark-400 space-y-2">
              <div className="flex justify-between">
                <span>当前模型:</span>
                <span className="text-primary-400">{currentModel}</span>
              </div>
              <div className="flex justify-between">
                <span>内存使用:</span>
                <span className="text-green-400">~8.2 GB</span>
              </div>
              <div className="flex justify-between">
                <span>对话数量:</span>
                <span>3</span>
              </div>
            </div>
          </div>
        </aside>
        
        {/* 主内容区 */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <ChatPanel />}
          {activeTab === 'workflow' && <WorkflowEditor />}
          {activeTab === 'skills' && <AppLauncher />}
          {activeTab === 'projects' && <ProjectsPanel />}
          {activeTab === 'terminal' && <TerminalPanel />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </div>
  )
}

// 聊天面板组件
function ChatPanel() {
  const { messages, isLoading, addMessage, setLoading, setError, startThinking, endThinking } = useChatStore()
  const { currentModel, autoSelectModel, smartSelectModel } = useModelStore()
  const [input, setInput] = useState('')
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage = input.trim()
    addMessage('user', userMessage)
    setInput('')
    setLoading(true)
    
    try {
      // 评估任务复杂度
      const complexity = taskPlanner.evaluateComplexity(userMessage)
      
      // 开始思考
      startThinking(complexity.needReview ? 'qwen3:8b+30b' : 'qwen3:8b')
      
      let response = ''
      let taskResult = null
      
      // 判断是否需要使用双模型任务规划
      if (complexity.needReview || userMessage.length > 50) {
        // 复杂任务：使用双模型协作模式
        addMessage('assistant', `📋 **任务分析中...**\n\n复杂度评分：${complexity.score}/10\n等级：${complexity.level}\n需要审查：${complexity.needReview ? '是' : '否'}`)
        
        taskResult = await taskPlanner.processTask(userMessage, {
          executeSkill: skillManager.executeSkill.bind(skillManager),
          messages: messages.slice(-5)
        })
        
        // 生成回复
        response = generateTaskResponse(taskResult)
      } else {
        // 简单任务：直接执行
        taskResult = await quickExecute(userMessage, {
          executeSkill: skillManager.executeSkill.bind(skillManager)
        })
        
        response = generateTaskResponse(taskResult)
      }
      
      // 结束思考
      endThinking()
      
      // 添加 AI 回复
      addMessage('assistant', response)
    } catch (error) {
      console.error('发送消息失败:', error)
      setError(error.message || '发送失败，请重试')
      endThinking()
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * 生成任务执行回复
   */
  function generateTaskResponse(taskResult) {
    const { preliminaryPlan, optimizedPlan, executionResult, quickMode, plan, result } = taskResult;
    
    let response = '';
    
    // 如果是快速模式，显示简化信息
    if (quickMode) {
      response += `## ⚡ 快速执行\n\n`;
      response += `**任务**: ${plan?.understanding?.coreNeed || '简单任务'}\n\n`;
      
      if (result) {
        response += `### ✅ 执行结果\n\n`;
        
        if (result.results && result.results.length > 0) {
          result.results.forEach((r, i) => {
            const statusIcon = r.status === 'success' ? '✅' : r.status === 'failed' ? '❌' : '⏸️';
            response += `${statusIcon} **步骤 ${r.step}**: ${r.name}\n`;
            
            if (r.status === 'success' && r.result) {
              // 检查是否是 AI 对话结果
              if (r.result.type === 'ai_chat' && r.result.response) {
                response += `   ${r.result.response}\n`;
              } else {
                const resultPreview = JSON.stringify(r.result, null, 2).slice(0, 200);
                response += `   结果：${resultPreview}${resultPreview.length >= 200 ? '...' : ''}\n`;
              }
            } else if (r.status === 'failed') {
              response += `   错误：${r.error}\n`;
            } else if (r.status === 'simulated') {
              response += `   模拟：${r.message}\n`;
            }
            response += '\n';
          });
          
          response += `### 📈 统计\n`;
          response += `- 总步骤：${result.totalSteps}\n`;
          response += `- 成功：${result.successfulSteps}\n`;
          response += `- 失败：${result.failedSteps}\n`;
        } else {
          response += `任务已执行，暂无详细结果。\n`;
        }
      }
      
      return response;
    }
    
    // 双模型模式：显示完整规划过程
    if (!quickMode) {
      response += `## 📊 任务规划\n\n`;
      if (preliminaryPlan?.understanding) {
        response += `**理解**: ${preliminaryPlan.understanding.coreNeed}\n\n`;
        response += `**类别**: ${preliminaryPlan.understanding.category}\n`;
        response += `**难度**: ${preliminaryPlan.understanding.difficulty}\n`;
        response += `**预计步骤**: ${preliminaryPlan.plan.length}步\n\n`;
      }
      
      // 显示优化信息
      if (optimizedPlan?.changes && optimizedPlan.changes.length > 0) {
        response += `### 🔍 审查优化\n\n`;
        response += `**完整性**: ${optimizedPlan.review?.completeness || 0}/10\n`;
        response += `**效率**: ${optimizedPlan.review?.efficiency || 0}/10\n`;
        response += `**安全性**: ${optimizedPlan.review?.safety || 0}/10\n\n`;
        
        if (optimizedPlan.changes.length > 0) {
          response += `**优化内容**:\n`;
          optimizedPlan.changes.forEach((change, i) => {
            response += `${i + 1}. ${change.type}: ${change.description} (${change.reason})\n`;
          });
          response += '\n';
        }
      }
    }
    
    // 显示执行结果
    response += `## ✅ 执行结果\n\n`;
    
    if (executionResult && executionResult.results && executionResult.results.length > 0) {
      executionResult.results.forEach((result, i) => {
        const statusIcon = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⏸️';
        response += `${statusIcon} **步骤 ${result.step}**: ${result.name}\n`;
        
        if (result.status === 'success' && result.result) {
          // 简化显示结果
          const resultPreview = JSON.stringify(result.result, null, 2).slice(0, 200);
          response += `   结果：${resultPreview}${resultPreview.length >= 200 ? '...' : ''}\n`;
        } else if (result.status === 'failed') {
          response += `   错误：${result.error}\n`;
        } else if (result.status === 'simulated') {
          response += `   模拟：${result.message}\n`;
        }
        response += '\n';
      });
      
      // 总结
      response += `### 📈 执行统计\n`;
      response += `- 总步骤：${executionResult.totalSteps}\n`;
      response += `- 成功：${executionResult.successfulSteps}\n`;
      response += `- 失败：${executionResult.failedSteps}\n`;
      
      if (executionResult.finalOutput) {
        response += `\n### 📝 最终输出\n\n${executionResult.finalOutput}`;
      }
    } else {
      response += '任务已执行，暂无详细结果。';
    }
    
    return response;
  }
  
  /**
   * 检测用户消息是否需要调用技能
   */
  async function detectSkillCall(message, context) {
    const allSkills = skillManager.getAllSkills()
    const skillNames = allSkills.map(s => s.name).join(', ')
    
    // 使用 AI 检测是否需要调用技能
    const detectionPrompt = `分析用户消息，判断是否需要调用以下技能之一：${skillNames}

如果不需要调用技能，返回 null
如果需要调用技能，返回 JSON 格式：{"skill": "技能名称", "params": {参数}}

用户消息：${message}

只返回 JSON 或 null，不要其他内容：`

    try {
      const detectionMessages = [
        { role: 'system', content: '你是一个技能检测助手，只返回 JSON 或 null' },
        ...context.slice(-3).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: detectionPrompt }
      ]
      
      const detection = await openClawClient.chat('qwen3:8b', detectionMessages, {
        temperature: 0.1, // 低温度，确保稳定输出
        maxTokens: 256,
      })
      
      // 解析检测结果
      const trimmed = detection.trim()
      if (trimmed === 'null' || !trimmed.includes('skill')) {
        return null
      }
      
      try {
        const skillCall = JSON.parse(trimmed)
        return skillCall
      } catch {
        return null
      }
    } catch (error) {
      console.error('技能检测失败:', error)
      return null
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl px-6 py-4 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-100'
              }`}
            >
              <div className="text-sm opacity-60 mb-1">
                {message.role === 'user' ? '你' : 'AI 助手'}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark-800 rounded-2xl px-6 py-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 输入框 */}
      <div className="p-6 border-t border-dark-700">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息... (Shift+Enter 换行)"
            className="flex-1 bg-dark-800 border border-dark-600 rounded-xl px-6 py-4 focus:outline-none focus:border-primary-500 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-700 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

// 分析面板组件
function AnalyticsPanel() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">数据分析</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold mb-2">对话统计</h3>
          <div className="text-3xl font-bold text-primary-400">127</div>
          <div className="text-sm text-dark-400 mt-1">总对话次数</div>
        </div>
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold mb-2">技能使用</h3>
          <div className="text-3xl font-bold text-green-400">89</div>
          <div className="text-sm text-dark-400 mt-1">技能调用次数</div>
        </div>
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold mb-2">平均响应</h3>
          <div className="text-3xl font-bold text-purple-400">1.2s</div>
          <div className="text-sm text-dark-400 mt-1">8B 模型</div>
        </div>
      </div>
    </div>
  )
}

// 设置面板组件
function SettingsPanel() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">系统设置</h2>
      <div className="space-y-6">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold mb-4">模型设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>默认模型</span>
              <select className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-2">
                <option>qwen3:8b</option>
                <option>qwen3:30b</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
