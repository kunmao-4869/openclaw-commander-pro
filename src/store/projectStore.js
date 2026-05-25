/**
 * 项目管理 Store
 * 管理项目的创建、导入、导出、配置
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // 项目列表
      projects: [],
      
      // 当前项目 ID
      currentProjectId: null,
      
      // 项目加载状态
      isLoading: false,
      
      /**
       * 创建新项目
       */
      createProject: (name, path = null) => {
        const project = {
          id: `proj_${Date.now()}`,
          name,
          path: path || `./${name.replace(/\s+/g, '-').toLowerCase()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            defaultModel: 'qwen3:8b',
            autoSave: true,
            workspace: ['src', 'public'],
            ignorePatterns: ['node_modules', '.git', 'dist']
          },
          conversations: [],
          workflows: [],
          metadata: {}
        }
        
        set((state) => ({
          projects: [project, ...state.projects],
          currentProjectId: project.id
        }))
        
        return project
      },
      
      /**
       * 导入项目
       */
      importProject: async (file) => {
        try {
          set({ isLoading: true })
          
          const content = await file.text()
          const project = JSON.parse(content)
          
          // 验证项目格式
          if (!project.id || !project.name) {
            throw new Error('无效的项目文件格式')
          }
          
          // 生成新 ID 避免冲突
          project.id = `proj_${Date.now()}_${project.id}`
          project.importedAt = new Date().toISOString()
          
          set((state) => ({
            projects: [project, ...state.projects],
            currentProjectId: project.id
          }))
          
          return project
        } catch (error) {
          console.error('导入项目失败:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
      
      /**
       * 导出项目
       */
      exportProject: (projectId) => {
        const project = get().projects.find(p => p.id === projectId)
        
        if (!project) {
          throw new Error('项目不存在')
        }
        
        // 创建可下载的文件
        const blob = new Blob([JSON.stringify(project, null, 2)], {
          type: 'application/json'
        })
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-project.json`
        a.click()
        URL.revokeObjectURL(url)
        
        return project
      },
      
      /**
       * 更新项目
       */
      updateProject: (projectId, updates) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId 
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          )
        }))
      },
      
      /**
       * 删除项目
       */
      deleteProject: (projectId) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== projectId),
          currentProjectId: state.currentProjectId === projectId ? null : state.currentProjectId
        }))
      },
      
      /**
       * 设置当前项目
       */
      setCurrentProject: (projectId) => {
        set({ currentProjectId: projectId })
      },
      
      /**
       * 获取当前项目
       */
      getCurrentProject: () => {
        const { projects, currentProjectId } = get()
        return projects.find(p => p.id === currentProjectId) || null
      },
      
      /**
       * 添加对话到项目
       */
      addConversation: (projectId, conversation) => {
        set((state) => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? {
                  ...p,
                  conversations: [conversation, ...p.conversations],
                  updatedAt: new Date().toISOString()
                }
              : p
          )
        }))
      },
      
      /**
       * 添加工作流到项目
       */
      addWorkflow: (projectId, workflow) => {
        set((state) => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? {
                  ...p,
                  workflows: [...p.workflows, workflow],
                  updatedAt: new Date().toISOString()
                }
              : p
          )
        }))
      },
      
      /**
       * 搜索项目
       */
      searchProjects: (query) => {
        const { projects } = get()
        
        if (!query.trim()) {
          return projects
        }
        
        const lowerQuery = query.toLowerCase()
        return projects.filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.path.toLowerCase().includes(lowerQuery)
        )
      },
      
      /**
       * 获取项目统计
       */
      getProjectStats: (projectId) => {
        const project = get().projects.find(p => p.id === projectId)
        
        if (!project) {
          return null
        }
        
        return {
          totalConversations: project.conversations.length,
          totalWorkflows: project.workflows.length,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        }
      }
    }),
    {
      name: 'openclaw-projects', // localStorage key
      partialize: (state) => ({
        projects: state.projects,
        currentProjectId: state.currentProjectId
      }) // 只持久化部分状态
    }
  )
)
