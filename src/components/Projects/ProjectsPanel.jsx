import React, { useState } from 'react'
import { FolderOpen, Plus, Upload, Download, Trash2, Settings, MessageSquare, Workflow } from 'lucide-react'
import { useProjectStore } from '../../store/projectStore.js'

/**
 * 项目管理面板组件
 */
export default function ProjectsPanel() {
  const {
    projects,
    currentProjectId,
    createProject,
    importProject,
    exportProject,
    deleteProject,
    setCurrentProject,
    searchProjects
  } = useProjectStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  
  // 搜索项目
  const filteredProjects = searchQuery ? searchProjects(searchQuery) : projects
  
  // 创建项目
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return
    
    createProject(newProjectName.trim())
    setNewProjectName('')
    setShowCreateModal(false)
  }
  
  // 导入项目
  const handleImportProject = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      await importProject(file)
    } catch (error) {
      console.error('导入失败:', error)
      alert('导入项目失败：' + error.message)
    }
  }
  
  // 导出项目
  const handleExportProject = (projectId) => {
    try {
      exportProject(projectId)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出项目失败：' + error.message)
    }
  }
  
  // 删除项目
  const handleDeleteProject = (projectId) => {
    if (confirm('确定要删除这个项目吗？此操作不可恢复。')) {
      deleteProject(projectId)
    }
  }
  
  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">项目管理</h2>
          <p className="text-dark-400 text-sm">
            创建、导入和管理项目配置
          </p>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImportProject}
            className="hidden"
            id="import-project"
          />
          <label
            htmlFor="import-project"
            className="flex items-center px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            导入
          </label>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建项目
          </button>
        </div>
      </div>
      
      {/* 搜索框 */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索项目..."
          className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-600"
        />
      </div>
      
      {/* 项目列表 */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-dark-600" />
          <h3 className="text-xl font-semibold mb-2">暂无项目</h3>
          <p className="text-dark-400 mb-6">
            创建第一个项目或导入现有项目
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            新建项目
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`bg-dark-800 rounded-xl p-6 border transition-all cursor-pointer group ${
                currentProjectId === project.id
                  ? 'border-primary-600 shadow-lg shadow-primary-600/20'
                  : 'border-dark-700 hover:border-primary-600/50'
              }`}
              onClick={() => setCurrentProject(project.id)}
            >
              {/* 项目头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    currentProjectId === project.id ? 'bg-primary-400' : 'bg-dark-600'
                  }`} />
                  <h3 className="text-lg font-semibold group-hover:text-primary-400 transition-colors">
                    {project.name}
                  </h3>
                </div>
                
                {/* 项目操作 */}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExportProject(project.id)
                    }}
                    className="p-1.5 hover:bg-dark-700 rounded transition-colors"
                    title="导出项目"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteProject(project.id)
                    }}
                    className="p-1.5 hover:bg-red-600/20 text-red-400 rounded transition-colors"
                    title="删除项目"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* 项目路径 */}
              <div className="text-sm text-dark-400 mb-4">
                <div className="flex items-center">
                  <FolderOpen className="w-3 h-3 mr-1.5" />
                  {project.path}
                </div>
              </div>
              
              {/* 项目统计 */}
              <div className="flex items-center justify-between text-xs text-dark-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {project.conversations.length}
                  </span>
                  <span className="flex items-center">
                    <Workflow className="w-3 h-3 mr-1" />
                    {project.workflows.length}
                  </span>
                </div>
                <span>
                  {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              
              {/* 工作区标签 */}
              <div className="flex flex-wrap gap-1.5">
                {project.settings?.workspace?.slice(0, 3).map((dir, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-dark-700 text-dark-300 text-xs rounded"
                  >
                    {dir}
                  </span>
                ))}
                {project.settings?.workspace?.length > 3 && (
                  <span className="px-2 py-0.5 bg-dark-700 text-dark-300 text-xs rounded">
                    +{project.settings.workspace.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 新建项目弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md border border-dark-700">
            <h3 className="text-xl font-bold mb-4">新建项目</h3>
            
            <div className="mb-6">
              <label className="block text-sm text-dark-400 mb-2">
                项目名称
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="输入项目名称..."
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-600"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewProjectName('')
                }}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
