import React, { useState } from 'react';
import { Sparkles, Send, X, Zap, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { aiWorkflowGenerator } from '../../workflow/AIWorkflowGenerator.js';
import { workflowEngine } from '../../workflow/WorkflowEngine.js';
import { skillManager } from '../../skills/core/SkillManager.js';

/**
 * AI 智能工作流生成器组件
 * 通过对话方式生成和执行工作流
 */
export default function AIWorkflowCreator({ onClose, onWorkflowGenerated }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '你好！我是 AI 工作流助手 🤖\n\n请告诉我你想要完成什么任务？例如：\n- "帮我诊断网络问题"\n- "研究最新的人工智能发展趋势"\n- "启动抖音并查看热门视频"\n- "查找项目中的所有 JavaScript 文件"',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      // 生成工作流
      const workflow = await aiWorkflowGenerator.generateWorkflow(input);
      
      // 获取推荐
      const recs = aiWorkflowGenerator.getRecommendations(input);
      setRecommendations(recs);

      if (workflow) {
        setGeneratedWorkflow(workflow);
        
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `我为你生成了一个工作流！✨\n\n**工作流名称**: ${workflow.name}\n**步骤数**: ${workflow.steps.size}\n**置信度**: ${(workflow.config?.confidence || 0.8) * 100}%\n\n要执行这个工作流吗？`,
          timestamp: new Date().toISOString(),
          workflow: workflow
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `抱歉，我暂时无法生成合适的工作流。\n\n你可以尝试：\n1. 更详细地描述你的需求\n2. 使用更具体的关键词\n3. 从推荐的工作流中选择`,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'error',
        content: `生成失败：${error.message}\n\n请重试或联系管理员。`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // 执行工作流
  const handleExecuteWorkflow = async (workflow) => {
    if (!workflow) return;

    setIsGenerating(true);
    
    try {
      console.log('[AIWorkflowCreator] 开始执行工作流:', workflow.id, workflow.name);
      console.log('[AIWorkflowCreator] 工作流步骤:', workflow.steps.size);
      
      // 注册并执行工作流
      workflowEngine.registerWorkflow(workflow);
      
      const result = await workflowEngine.executeWorkflow(workflow.id, {
        userInput: messages.find(m => m.role === 'user')?.content || '',
        executeSkill: async (skillName, params) => {
          console.log('[AIWorkflowCreator] 执行技能:', skillName, params);
          try {
            const skillResult = await skillManager.executeSkill(skillName, params);
            console.log('[AIWorkflowCreator] 技能执行结果:', skillResult);
            return skillResult;
          } catch (error) {
            console.error('[AIWorkflowCreator] 技能执行失败:', error);
            throw error;
          }
        }
      });

      console.log('[AIWorkflowCreator] 工作流执行结果:', result);

      const resultMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `✅ 工作流执行完成！\n\n**执行时间**: ${result.duration}ms\n**执行步骤**: ${result.stepsExecuted || 0}\n**状态**: ${result.success ? '成功' : '失败'}\n\n${result.errors && result.errors.length > 0 ? `**错误**: ${result.errors.join(', ')}` : ''}`,
        timestamp: new Date().toISOString(),
        result: result
      };

      setMessages(prev => [...prev, resultMessage]);
      
      if (onWorkflowGenerated) {
        onWorkflowGenerated(workflow, result);
      }
    } catch (error) {
      console.error('[AIWorkflowCreator] 工作流执行失败:', error);
      const errorMessage = {
        id: Date.now(),
        role: 'error',
        content: `执行失败：${error.message}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-xl border border-dark-600 w-full max-w-4xl h-[600px] flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary-400" />
            <h3 className="text-xl font-semibold">AI 智能工作流生成器</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : message.role === 'error'
                    ? 'bg-red-900/30 border border-red-700 text-red-400'
                    : 'bg-dark-700 text-dark-100'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center mb-2">
                    <Sparkles className="w-4 h-4 mr-2 text-primary-400" />
                    <span className="text-xs text-primary-400">AI 助手</span>
                  </div>
                )}
                
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                
                {/* 工作流预览 */}
                {message.workflow && (
                  <div className="mt-3 p-3 bg-dark-800 rounded-lg border border-dark-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold text-sm">{message.workflow.name}</span>
                      </div>
                      <span className="text-xs text-dark-400">
                        {message.workflow.steps.size} 个步骤
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleExecuteWorkflow(message.workflow)}
                      className="w-full mt-2 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>执行工作流</span>
                    </button>
                  </div>
                )}

                {/* 时间戳 */}
                <div className="mt-2 text-xs opacity-50">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-dark-700 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-400"></div>
                  <span className="text-sm text-dark-400">AI 正在思考中...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 推荐区域 */}
        {recommendations.length > 0 && (
          <div className="px-4 py-2 border-t border-dark-600 bg-dark-800/50">
            <div className="flex items-center space-x-2 text-xs text-dark-400 mb-2">
              <MessageSquare className="w-3 h-3" />
              <span>推荐工作流类型：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-dark-700 rounded-full text-xs text-dark-300"
                >
                  {rec.pattern} ({rec.score} 匹配)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 输入区域 */}
        <div className="p-4 border-t border-dark-600">
          <div className="flex items-end space-x-2">
            <div className="flex-1 bg-dark-900 rounded-lg border border-dark-700 p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="描述你想要完成的任务..."
                className="w-full bg-transparent border-none outline-none text-sm resize-none"
                rows={2}
                disabled={isGenerating}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isGenerating || !input.trim()}
              className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-dark-500">
            💡 提示：描述越详细，生成的工作流越精准。按 Enter 发送，Shift+Enter 换行
          </div>
        </div>
      </div>
    </div>
  );
}
