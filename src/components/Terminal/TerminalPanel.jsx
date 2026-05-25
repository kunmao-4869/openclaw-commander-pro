import React, { useState, useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, Send, Trash2, Download, Upload, FolderOpen, MapPin } from 'lucide-react'
import DirectorySelector from './DirectorySelector.jsx'

// 导入智能工作流系统
import TerminalAgent from '../../terminal/TerminalAgent.js'
import ProjectWorkflowManager from '../../skills/advanced/ProjectWorkflowManager.js'

/**
 * 终端面板组件（集成智能工作流系统）
 * 提供命令行交互界面 + 项目管理功能
 */
export default function TerminalPanel() {
  const [output, setOutput] = useState([])
  const [command, setCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [workingDirectory, setWorkingDirectory] = useState('.')
  const [showDirectorySelector, setShowDirectorySelector] = useState(false)
  
  // 智能工作流状态
  const [terminalAgent, setTerminalAgent] = useState(null)
  const [workflowManager, setWorkflowManager] = useState(null)
  const [currentProject, setCurrentProject] = useState(null)
  const [skillsLoaded, setSkillsLoaded] = useState(false)
  
  // 项目创建需求输入
  const [showProjectInput, setShowProjectInput] = useState(false)
  const [projectType, setProjectType] = useState('harmonyos')
  const [projectRequirement, setProjectRequirement] = useState('')
  
  const outputRef = useRef(null)
  const inputRef = useRef(null)

  // 初始化智能工作流系统
  useEffect(() => {
    const initWorkflowSystem = async () => {
      try {
        // 创建 TerminalAgent 实例
        const agent = new TerminalAgent({
          apiBaseUrl: 'http://localhost:3003',
          autonomousMode: true,
          verbose: true
        })
        
        // 创建 ProjectWorkflowManager 实例
        const workflowManager = new ProjectWorkflowManager({
          baseDir: './projects'
        })
        
        // 注册技能
        await agent.registerDefaultSkills()
        
        // 设置状态
        setTerminalAgent(agent)
        setWorkflowManager(workflowManager)
        setSkillsLoaded(true)
        
        addOutput('✅ 智能工作流系统已加载', 'system')
        addOutput(`✅ 已注册 ${agent.skills.size} 个技能`, 'system')
        
        // 检查当前项目
        const status = workflowManager.getProjectStatus()
        if (status.hasProject) {
          setCurrentProject(status)
          addOutput(`📁 当前项目：${status.name} (${status.type})`, 'info')
        }
        
      } catch (error) {
        console.error('初始化工作流系统失败:', error)
        addOutput(`⚠️ 工作流系统初始化失败：${error.message}`, 'error')
      }
    }
    
    initWorkflowSystem()
  }, [])
  
  // 智能工作流系统已在上面初始化
  // 不再需要 WebSocket 连接，所有功能都通过本地技能执行
  
  // 处理快捷操作 - 打开需求输入对话框
  const handleQuickAction = (type, defaultRequirement) => {
    setProjectType(type)
    setProjectRequirement(defaultRequirement)
    setShowProjectInput(true)
  }
  
  // 确认创建项目
  const confirmCreateProject = () => {
    const projectNames = {
      harmonyos: 'HarmonyOS_App',
      unreal: 'UE_Game',
      python: 'Python_Tool',
      react: 'React_App'
    }
    
    const command = `创建一个${projectType === 'harmonyos' ? 'HarmonyOS' : projectType === 'unreal' ? 'Unreal' : projectType === 'python' ? 'Python' : 'React'}项目，项目名称：${projectNames[projectType]}，需求：${projectRequirement || '默认项目'}`
    executeCommand(command)
    setShowProjectInput(false)
    setProjectRequirement('')
  }
  
  // 取消创建项目
  const cancelCreateProject = () => {
    setShowProjectInput(false)
    setProjectRequirement('')
  }

  // 自动滚动到底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current && skillsLoaded) {
      inputRef.current.focus()
    }
  }, [skillsLoaded])

  // 添加输出行
  const addOutput = (text, type = 'info') => {
    setOutput(prev => {
      // 生成唯一 ID（基于时间戳和索引）
      const uniqueId = `${Date.now()}-${prev.length}-${Math.random().toString(36).substr(2, 9)}`;
      return [...prev, {
        id: uniqueId,
        text,
        type,
        timestamp: new Date().toISOString()
      }];
    });
  }

  // 添加系统消息
  const addSystemMessage = (text) => {
    addOutput(text, 'system')
  }

  // 添加命令输出
  const addCommandOutput = (text) => {
    addOutput(text, 'output')
  }

  // 添加错误信息
  const addError = (text) => {
    addOutput(text, 'error')
  }

  // 处理服务器消息（已移除，不再使用 WebSocket）
  // const handleServerMessage = (data) => { ... }

  // 发送命令到服务器（已移除，不再使用 WebSocket）
  // const sendCommand = (command) => { ... }

  // 更改工作目录
  const changeDirectory = (path) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'changeDirectory',
        path
      }))
    }
  }

  // 获取命令历史
  const getHistory = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'getHistory'
      }))
    }
  }

  // 清除历史
  const clearHistory = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'clear'
      }))
    }
  }

  // 选择工作目录
  const handleSelectDirectory = (path) => {
    setWorkingDirectory(path);
    addSystemMessage(`工作目录已更改为：${path}`);
    setShowDirectorySelector(false);
  };

  // 显示当前目录
  const showWorkingDirectory = () => {
    addOutput(`当前工作目录：${workingDirectory}`, 'system');
  };

  // 执行命令
  const executeCommand = async (cmd) => {
    if (!cmd.trim()) return

    // 优先处理智能工作流命令
    if (terminalAgent && skillsLoaded) {
      // 使用 TerminalAgent 识别技能
      const skills = terminalAgent.parseInput(cmd)
      
      if (skills.length > 0) {
        addOutput(`🤖 识别到 ${skills.length} 个技能调用`, 'system')
        
        for (const skillCall of skills) {
          try {
            addOutput(`  → 执行技能：${skillCall.skill}`, 'info')
            const result = await terminalAgent.executeSkill(skillCall)
            
            if (result) {
              addOutput(`  ✅ 技能执行成功`, 'success')
              
              // 更新项目状态
              if (workflowManager) {
                const status = workflowManager.getProjectStatus()
                if (status.hasProject) {
                  setCurrentProject(status)
                }
              }
            } else {
              addOutput(`  ⚠️ 技能执行返回空结果`, 'warning')
            }
          } catch (error) {
            addOutput(`  ❌ 技能执行失败：${error.message}`, 'error')
          }
        }
        
        setCommand('')
        return
      }
    }

    // 处理内置命令
    const builtInCommands = {
      'help': () => showHelp(),
      'clear': () => clearTerminal(),
      'history': () => getHistory(),
      'export': () => exportLogs(),
      'pwd': () => showWorkingDirectory(),
      'project': () => showProjectStatus()
    }

    const cmdName = cmd.trim().split(' ')[0].toLowerCase()

    if (builtInCommands[cmdName]) {
      builtInCommands[cmdName]()
      setCommand('')
      return
    }

    // 处理 cd 命令
    if (cmdName === 'cd') {
      const path = cmd.substring(3).trim()
      if (path) {
        changeDirectory(path)
      }
      setCommand('')
      return
    }

    // 未知命令提示
    addOutput(`未知命令：${cmdName}`, 'warning')
    addOutput('提示：使用自然语言描述需求，或输入 "help" 查看帮助', 'info')
    setCommand('')
  }
  
  // 显示项目状态
  const showProjectStatus = () => {
    if (!workflowManager) {
      addOutput('工作流系统未初始化', 'error')
      return
    }
    
    const status = workflowManager.getProjectStatus()
    if (status.hasProject) {
      addOutput('📊 当前项目状态:', 'system')
      addOutput(`  项目名称：${status.name}`, 'info')
      addOutput(`  项目类型：${status.type}`, 'info')
      addOutput(`  根目录：${status.rootDir}`, 'info')
      addOutput('  文件夹结构:', 'info')
      for (const [name, folder] of Object.entries(status.structure)) {
        addOutput(`    - ${name}: ${folder}/`, 'info')
      }
    } else {
      addOutput('当前没有活动项目', 'warning')
      addOutput('提示：使用 "创建一个 HarmonyOS 项目" 来创建项目', 'info')
    }
  }

  // 内置命令：帮助
  const showHelp = () => {
    addSystemMessage(`
可用命令:
  help          - 显示帮助信息
  clear         - 清屏
  history       - 显示命令历史
  export        - 导出日志
  pwd           - 查看当前目录
  project       - 查看项目状态

智能工作流命令:
  创建一个 HarmonyOS 项目
  创建一个 Unreal 游戏项目
  创建一个 Python 工具项目
  创建一个 React 应用项目
  
  学习 https://url 并保存到 studying
  在 studying 中搜索 ArkTS 代码
  检查图片资源配置

提示：使用自然语言描述你的需求即可
`)
  }

  // 内置命令：清屏
  const clearTerminal = () => {
    setOutput([])
    addSystemMessage('终端已清空')
  }

  // 内置命令：显示历史
  const showHistory = () => {
    if (commandHistory.length === 0) {
      addSystemMessage('没有命令历史')
      return
    }
    
    addSystemMessage('命令历史:')
    commandHistory.forEach((cmd, i) => {
      addOutput(`  ${i + 1}. ${cmd}`, 'info')
    })
  }

  // 内置命令：导出日志
  const exportLogs = () => {
    const logText = output.map(line => 
      `[${new Date(line.timestamp).toLocaleTimeString()}] ${line.type}: ${line.text}`
    ).join('\n')
    
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `terminal-log-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    addSystemMessage(`已导出 ${output.length} 行日志`)
  }

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(command)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1)
        setCommand(commandHistory[historyIndex - 1])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(historyIndex + 1)
        setCommand(commandHistory[historyIndex + 1])
      } else {
        setHistoryIndex(commandHistory.length)
        setCommand('')
      }
    }
  }

  // 清除输出
  const clearOutput = () => {
    setOutput([])
    addSystemMessage('输出已清除')
  }

  return (
    <div className="h-full flex flex-col bg-dark-900">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-800/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold">终端</h2>
          </div>
          
          {/* 工作目录显示和选择 */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-dark-800 rounded-lg border border-dark-600">
            <MapPin className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono text-dark-300 max-w-[200px] truncate">
              {workingDirectory}
            </span>
            <button
              onClick={() => setShowDirectorySelector(true)}
              className="p-1 hover:bg-dark-700 rounded transition-colors"
              title="选择工作目录"
            >
              <FolderOpen className="w-4 h-4 text-primary-400" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${skillsLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-xs text-dark-400">
            {skillsLoaded ? '智能工作流已就绪' : '加载中...'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={clearOutput}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            title="清除输出"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={exportLogs}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            title="导出日志"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 输出区域 */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"
      >
        {output.length === 0 && (
          <div className="text-dark-500 text-center mt-20">
            <TerminalIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div>终端已就绪</div>
            <div className="text-xs mt-2">输入 "help" 查看可用命令</div>
            <div className="text-xs mt-1 text-primary-400">💡 点击左上角图标选择工作目录</div>
          </div>
        )}

        {output.map((line) => (
          <div
            key={line.id}
            className={`${
              line.type === 'command' ? 'text-primary-400' :
              line.type === 'system' ? 'text-green-400' :
              line.type === 'error' ? 'text-red-400' :
              'text-dark-300'
            }`}
          >
            <span className="text-dark-500 mr-2 text-xs">
              {new Date(line.timestamp).toLocaleTimeString()}
            </span>
            {line.text}
          </div>
        ))}
      </div>

      {/* 项目状态面板 */}
      {currentProject && (
        <div className="p-3 border-t border-dark-700 bg-dark-800/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-green-400">📁 当前项目</h3>
            <span className="text-xs text-dark-400">{currentProject.type}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-dark-500">名称:</span>
              <span className="text-dark-300 ml-2">{currentProject.name}</span>
            </div>
            <div>
              <span className="text-dark-500">类型:</span>
              <span className="text-dark-300 ml-2">{currentProject.type}</span>
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span className="text-dark-500">文件夹结构:</span>
            <pre className="mt-1 text-xs text-dark-400 font-mono">
              {Object.entries(currentProject.structure)
                .map(([k, v]) => `  ${k}: ${v}/`)
                .join('\n')}
            </pre>
          </div>
        </div>
      )}

      {/* 快捷操作面板 */}
      <div className="p-3 border-t border-dark-700 bg-dark-800/30">
        <h3 className="text-xs font-semibold text-dark-400 mb-2">⚡ 快捷操作</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickAction('harmonyos', '开发一个 HarmonyOS 应用')}
            className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded text-xs text-blue-400 transition-colors text-left"
          >
            📱 HarmonyOS 项目
          </button>
          <button
            onClick={() => handleQuickAction('unreal', '开发一个 Unreal Engine 游戏')}
            className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 rounded text-xs text-purple-400 transition-colors text-left"
          >
            🎮 Unreal 游戏
          </button>
          <button
            onClick={() => handleQuickAction('python', '开发一个 Python 工具')}
            className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded text-xs text-green-400 transition-colors text-left"
          >
            🐍 Python 工具
          </button>
          <button
            onClick={() => handleQuickAction('react', '开发一个 React 前端应用')}
            className="px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/50 rounded text-xs text-cyan-400 transition-colors text-left"
          >
            ⚛️ React 应用
          </button>
        </div>
        <div className="mt-2 text-xs text-dark-500">
          💡 提示：也可以直接输入自然语言命令，如 "学习 https://url 并保存到 studying"
        </div>
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center space-x-2 bg-dark-800 rounded-lg p-2">
          <span className="text-green-400 font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入命令或自然语言描述需求..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
            autoComplete="off"
          />
          <button
            onClick={() => executeCommand(command)}
            className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-dark-500 flex items-center justify-between">
          <div>
            ↑↓ 切换历史命令 · Enter 执行 · help 查看帮助 · project 查看项目
          </div>
          <div>
            历史：{commandHistory.length} 条
          </div>
        </div>
      </div>

      {/* 项目创建需求输入对话框 */}
      {showProjectInput && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-dark-600 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              📱 创建{projectType === 'harmonyos' ? 'HarmonyOS' : projectType === 'unreal' ? 'Unreal' : projectType === 'python' ? 'Python' : 'React'}项目
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm text-dark-400 mb-2">
                项目需求描述 <span className="text-yellow-500">*</span>
              </label>
              <textarea
                value={projectRequirement}
                onChange={(e) => setProjectRequirement(e.target.value)}
                placeholder={
                  projectType === 'harmonyos' 
                    ? '例如：开发一个猜数字游戏，包含以下功能：\n- 随机生成 1-100 的数字\n- 用户输入猜测\n- 提示"太大了"或"太小了"\n- 记录猜测次数\n- 游戏结束后显示统计信息'
                    : projectType === 'unreal'
                    ? '例如：开发一个第一人称射击游戏，包含：\n- 第一人称视角控制\n- 武器系统\n- 敌人 AI\n- 地图场景\n- 计分系统'
                    : projectType === 'python'
                    ? '例如：开发一个文件批量重命名工具，包含：\n- 文件选择对话框\n- 批量处理功能\n- 进度条显示\n- 结果导出功能'
                    : '例如：开发一个个人博客网站，包含：\n- 文章列表页面\n- 文章详情页面\n- 分类和标签\n- 响应式设计'
                }
                className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-sm text-white focus:border-primary-500 focus:outline-none resize-none"
                rows="6"
                autoFocus
              />
            </div>
            
            <div className="mb-4 p-3 bg-dark-900/50 rounded-lg border border-dark-700">
              <h4 className="text-sm font-semibold text-primary-400 mb-2">💡 输入格式建议：</h4>
              <div className="text-xs text-dark-400 space-y-1">
                <div>✅ <strong>功能描述</strong>：列出项目需要实现的主要功能</div>
                <div>✅ <strong>技术栈</strong>：指定使用的技术（如 ArkTS、C++、Python 等）</div>
                <div>✅ <strong>界面要求</strong>：描述界面风格或布局要求</div>
                <div>✅ <strong>特殊需求</strong>：其他特殊功能或要求</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-green-400 mb-2">📝 快速示例：</h4>
              <div className="text-xs text-dark-400 space-y-1">
                <button 
                  onClick={() => setProjectRequirement('开发一个计算器应用，包含：\n- 加减乘除基本运算\n- 连续计算功能\n- 历史记录查看\n- 简洁现代的界面')}
                  className="block w-full text-left px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded border border-dark-600 transition-colors"
                >
                  🔢 计算器应用
                </button>
                <button 
                  onClick={() => setProjectRequirement('开发一个待办事项管理工具，包含：\n- 添加/删除/编辑任务\n- 任务优先级设置\n- 任务完成标记\n- 数据本地存储')}
                  className="block w-full text-left px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded border border-dark-600 transition-colors"
                >
                  ✅ 待办事项管理
                </button>
                <button 
                  onClick={() => setProjectRequirement('开发一个天气查询应用，包含：\n- 城市搜索功能\n- 实时天气显示\n- 天气预报展示\n- 自动定位功能')}
                  className="block w-full text-left px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded border border-dark-600 transition-colors"
                >
                  🌤️ 天气查询应用
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={confirmCreateProject}
                disabled={!projectRequirement.trim()}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                ✅ 确认创建
              </button>
              <button
                onClick={cancelCreateProject}
                className="flex-1 bg-dark-700 hover:bg-dark-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                ❌ 取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 目录选择对话框 */}
      {showDirectorySelector && (
        <DirectorySelector
          onSelect={handleSelectDirectory}
          onClose={() => setShowDirectorySelector(false)}
          initialPath={workingDirectory}
        />
      )}
    </div>
  )
}
