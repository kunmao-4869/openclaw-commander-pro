import React, { useState } from 'react';
import { getAllApps, getAppsByCategory } from '../../config/appPaths.js';
import { skillManager } from '../../skills/core/SkillManager.js';

export default function AppLauncher() {
  const [launching, setLaunching] = useState(null);
  const [message, setMessage] = useState(null);
  const allApps = getAllApps();
  const appsByCategory = getAppsByCategory();

  const handleLaunch = async (appId, appName) => {
    setLaunching(appId);
    setMessage(null);

    try {
      const result = await skillManager.executeSkill('launch_application', {
        appName: appName
      });

      setMessage({
        type: 'success',
        text: result.message || `已启动 ${appName}`
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setLaunching(null);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      '音乐': '🎵',
      '娱乐': '🎬',
      'AI 助手': '🤖',
      '开发工具': '💻',
      '浏览器': '🌐',
      '编辑器': '📝',
      '社交': '💬'
    };
    return icons[category] || '📱';
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">应用启动器</h2>
      
      {/* 消息提示 */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-900/20 border-green-700 text-green-400' 
            : 'bg-red-900/20 border-red-700 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* 统计信息 */}
      <div className="mb-6 p-4 bg-dark-800 rounded-xl border border-dark-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">📊 应用统计</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-primary-400">{allApps.length}</div>
                <div className="text-sm text-dark-400">应用总数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{Object.keys(appsByCategory).length}</div>
                <div className="text-sm text-dark-400">类别数量</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {Object.values(appsByCategory).reduce((sum, apps) => sum + apps.length, 0)}
                </div>
                <div className="text-sm text-dark-400">已配置</div>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-dark-400">
            <div>💡 提示：点击应用卡片即可启动</div>
            <div>⚠️ 需要本地服务支持 (npm run server)</div>
          </div>
        </div>
      </div>

      {/* 按类别显示应用 */}
      {Object.entries(appsByCategory).map(([category, apps]) => (
        <div key={category} className="mb-8">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">{getCategoryIcon(category)}</span>
            <h3 className="text-xl font-semibold">{category}</h3>
            <span className="ml-3 px-3 py-1 bg-dark-700 rounded-full text-sm text-dark-300">
              {apps.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => (
              <div
                key={app.id}
                className={`bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-primary-500 transition-all cursor-pointer group ${
                  launching === app.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !launching && handleLaunch(app.id, app.name)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                      {app.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-lg group-hover:text-primary-400 transition-colors">
                        {app.name}
                      </h4>
                      <p className="text-sm text-dark-400">{app.id}</p>
                    </div>
                  </div>
                  {launching === app.id && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-400"></div>
                  )}
                </div>
                
                <div className="text-sm text-dark-400 mb-3">
                  <div className="flex items-center">
                    <span className="mr-2">📁</span>
                    <span className="truncate" title={app.path}>{app.path}</span>
                  </div>
                </div>

                {app.args && app.args.length > 0 && (
                  <div className="text-xs text-dark-500 mb-3">
                    <div className="flex items-center">
                      <span className="mr-2">⚙️</span>
                      <span>参数：{app.args.join(' ')}</span>
                    </div>
                  </div>
                )}
                
                <button
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    launching === app.id
                      ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                  disabled={launching === app.id}
                >
                  {launching === app.id ? '启动中...' : '启动应用'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 添加新应用提示 */}
      <div className="mt-8 p-6 bg-dark-800 rounded-xl border border-dark-700">
        <h3 className="text-lg font-semibold mb-2">➕ 添加新应用</h3>
        <p className="text-dark-400 mb-4">
          要添加新的应用，请编辑配置文件：
        </p>
        <code className="block bg-dark-950 px-4 py-3 rounded-lg text-sm text-primary-400 font-mono">
          src/config/appPaths.js
        </code>
      </div>
    </div>
  );
}
