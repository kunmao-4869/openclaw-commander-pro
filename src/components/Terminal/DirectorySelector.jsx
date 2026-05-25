import React, { useState } from 'react';
import { FolderOpen, X, Check, ChevronRight } from 'lucide-react';

export default function DirectorySelector({ onSelect, onClose, initialPath = '' }) {
  const [currentPath, setCurrentPath] = useState(initialPath || '');
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载目录内容
  const loadDirectory = async (path) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3003/api/fs/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: path || '.', type: 'directories' })
      });

      if (!response.ok) {
        throw new Error('获取目录失败');
      }

      const result = await response.json();
      setDirectories(result.directories || []);
      setCurrentPath(result.currentPath || path);
    } catch (err) {
      setError(err.message);
      setDirectories([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  React.useEffect(() => {
    loadDirectory(currentPath);
  }, []);

  // 进入子目录
  const handleDirectoryClick = (dirName) => {
    const newPath = currentPath ? `${currentPath}\\${dirName}` : dirName;
    loadDirectory(newPath);
  };

  // 返回上级目录
  const handleParentDirectory = () => {
    if (!currentPath) return;
    
    const parts = currentPath.split('\\').filter(p => p);
    if (parts.length > 0) {
      parts.pop();
      const parentPath = parts.join('\\');
      loadDirectory(parentPath);
    }
  };

  // 选择当前目录
  const handleSelect = () => {
    onSelect(currentPath || '.');
  };

  // 快速选择常用目录
  const quickPaths = [
    { name: '桌面', path: 'Desktop' },
    { name: '文档', path: 'Documents' },
    { name: '下载', path: 'Downloads' },
    { name: '项目', path: 'Projects' },
  ];

  const handleQuickPath = (quickPath) => {
    // 在浏览器环境中，使用相对路径或占位符
    const fullPath = `./${quickPath}`;
    loadDirectory(fullPath);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-xl border border-dark-600 w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold">选择工作目录</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 路径导航 */}
        <div className="p-4 border-b border-dark-600">
          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleParentDirectory}
              disabled={!currentPath}
              className="p-2 bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="上级目录"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <div className="flex-1 px-3 py-2 bg-dark-900 rounded-lg font-mono text-sm text-dark-300 overflow-x-auto">
              {currentPath || '.'}
            </div>
          </div>

          {/* 快速访问 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-400">快速访问:</span>
            {quickPaths.map((qp) => (
              <button
                key={qp.path}
                onClick={() => handleQuickPath(qp.path)}
                className="px-3 py-1 bg-dark-700 hover:bg-dark-600 rounded text-sm transition-colors"
              >
                {qp.name}
              </button>
            ))}
          </div>
        </div>

        {/* 目录列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-dark-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-2"></div>
              加载中...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              <p>{error}</p>
              <button
                onClick={() => loadDirectory(currentPath)}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
              >
                重试
              </button>
            </div>
          ) : directories.length === 0 ? (
            <div className="text-center py-8 text-dark-400">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>当前目录为空</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {directories.map((dir, index) => (
                <button
                  key={index}
                  onClick={() => handleDirectoryClick(dir.name)}
                  className="flex items-center p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors group"
                >
                  <FolderOpen className="w-5 h-5 text-yellow-400 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm truncate">{dir.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-dark-600">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSelect}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            选择此目录
          </button>
        </div>
      </div>
    </div>
  );
}
