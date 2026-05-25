import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * 聊天状态管理
 */

export const useChatStore = create(
  subscribeWithSelector((set, get) => ({
    // 聊天历史
    conversations: [],
    currentConversationId: null,
    
    // 当前消息
    messages: [],
    isLoading: false,
    error: null,
    
    // 思考过程
    thinkingProcess: {
      active: false,
      model: null,
      steps: [],
      startTime: null,
      endTime: null
    },
    
    // 开始新对话
    startNewConversation: (title = '新对话') => {
      const newConversation = {
        id: `conv_${Date.now()}`,
        title,
        createdAt: new Date().toISOString(),
        messages: [],
        model: 'qwen3:8b'
      }
      
      set((state) => ({
        conversations: [newConversation, ...state.conversations],
        currentConversationId: newConversation.id,
        messages: []
      }))
      
      return newConversation.id
    },
    
    // 切换对话
    switchConversation: (conversationId) => {
      const conversation = get().conversations.find(c => c.id === conversationId)
      if (conversation) {
        set({
          currentConversationId: conversationId,
          messages: conversation.messages
        })
      }
    },
    
    // 添加消息
    addMessage: (role, content, metadata = {}) => {
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        role,
        content,
        timestamp: new Date().toISOString(),
        ...metadata
      }
      
      set((state) => {
        const newMessages = [...state.messages, message]
        
        // 更新当前对话
        const updatedConversations = state.conversations.map(conv =>
          conv.id === state.currentConversationId
            ? { ...conv, messages: newMessages }
            : conv
        )
        
        return {
          messages: newMessages,
          conversations: updatedConversations
        }
      })
      
      return message.id
    },
    
    // 开始思考
    startThinking: (model) => set({
      thinkingProcess: {
        active: true,
        model,
        steps: [],
        startTime: Date.now()
      }
    }),
    
    // 添加思考步骤
    addThinkingStep: (step) => set((state) => ({
      thinkingProcess: {
        ...state.thinkingProcess,
        steps: [...state.thinkingProcess.steps, step]
      }
    })),
    
    // 结束思考
    endThinking: () => set((state) => ({
      thinkingProcess: {
        ...state.thinkingProcess,
        active: false,
        endTime: Date.now()
      }
    })),
    
    // 设置加载状态
    setLoading: (loading) => set({ isLoading: loading }),
    
    // 设置错误
    setError: (error) => set({ error }),
    
    // 清除错误
    clearError: () => set({ error: null }),
    
    // 删除对话
    deleteConversation: (conversationId) => set((state) => ({
      conversations: state.conversations.filter(c => c.id !== conversationId),
      currentConversationId: state.currentConversationId === conversationId 
        ? null 
        : state.currentConversationId
    })),
    
    // 导出对话
    exportConversation: (conversationId) => {
      const conversation = get().conversations.find(c => c.id === conversationId)
      if (conversation) {
        const blob = new Blob([JSON.stringify(conversation, null, 2)], { 
          type: 'application/json' 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${conversation.title}-${conversationId}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    }
  }))
)
