/**
 * 工作流节点属性面板
 */
import React, { useState, useEffect } from 'react';
import { X, Save, Settings2 } from 'lucide-react';

/**
 * 可用技能列表
 */
const AVAILABLE_SKILLS = [
  { name: 'browser_search', label: '浏览器搜索', category: '浏览器' },
  { name: 'web_search', label: '网络搜索', category: '网络' },
  { name: 'analyze_search_results', label: '分析搜索结果', category: 'AI' },
  { name: 'compare_sources', label: '对比来源', category: 'AI' },
  { name: 'generate_project_code', label: '生成项目代码', category: '代码' },
  { name: 'review_code', label: '代码审查', category: '代码' },
  { name: 'safe_read_file', label: '读取文件', category: '文件' },
  { name: 'safe_write_file', label: '写入文件', category: '文件' },
  { name: 'launch_application', label: '启动应用', category: '系统' },
  { name: 'get_system_info', label: '系统信息', category: '系统' },
  { name: 'mouse_move', label: '移动鼠标', category: '自动化' },
  { name: 'keyboard_input', label: '键盘输入', category: '自动化' },
  { name: 'learn_webpage', label: '学习网页', category: '学习' },
  { name: 'batch_learn_webpages', label: '批量学习', category: '学习' },
];

/**
 * 技能参数提示数据（从技能定义中获取）
 */
const SKILL_PARAM_HINTS = {
  'safe_write_file': {
    path: {
      label: '文件路径',
      description: '支持相对路径（自动保存到 projects 目录）或绝对路径',
      required: true,  // 必填项
      examples: ['UE5teaching.md', 'docs/notes.md', 'F:\\openclaw\\commander-pro\\projects\\output.md']
    },
    content: {
      label: '文件内容',
      description: '可以是纯文本、Markdown、代码等，支持模板变量',
      required: false,  // 可选项
      templateVariables: [
        { name: 'learn_webpage.learningDoc', description: '学习网页技能生成的完整学习文档' },
        { name: 'learn_webpage.content', description: '学习网页技能提取的原始网页内容' },
        { name: 'learn_webpage.summary', description: '学习网页技能的内容摘要' },
        { name: 'web_search.results', description: '网络搜索技能的搜索结果数组' },
        { name: 'searchResults', description: '搜索结果的快捷访问（等同于 web_search.results）' },
        { name: 'lastResult', description: '前一个技能的完整返回对象' }
      ],
      examples: [
        '${learn_webpage.learningDoc}',
        '${searchResults}',
        '# 我的笔记\n\n这是我自己写的内容',
        'console.log("Hello World");'
      ]
    },
    encoding: {
      label: '文件编码',
      description: '文件编码格式，默认 utf-8',
      required: false,
      examples: ['utf-8', 'ascii', 'base64']
    }
  },
  'safe_read_file': {
    path: {
      label: '文件路径',
      description: '要读取的文件路径',
      required: true,
      examples: ['UE5teaching.md', 'config.json']
    }
  },
  'learn_webpage': {
    url: {
      label: '网页 URL',
      description: '要学习的网页地址',
      required: true,  // 必填项
      examples: [
        'https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine',
        'https://learn.microsoft.com/zh-cn/cpp/cpp/welcome-back-to-cpp-modern-cpp'
      ]
    }
  },
  'batch_learn_webpages': {
    urls: {
      label: 'URL 列表',
      description: '要批量学习的网页 URL 数组（最多 20 个）',
      required: true,  // 必填项
      isArray: true,
      examples: [
        '["https://dev.epicgames.com/.../cpp-basics", "https://dev.epicgames.com/.../cpp-classes"]'
      ]
    },
    options: {
      label: '学习选项',
      description: '可选的学习配置（timeout、title 等）',
      required: false,
      isObject: true,
      examples: [
        '{"timeout": 30000, "title": "C++ 教程"}'
      ]
    }
  }
};

/**
 * 获取技能参数提示
 */
function getParamHint(skillName, paramName) {
  const skillHints = SKILL_PARAM_HINTS[skillName];
  if (!skillHints) return null;
  return skillHints[paramName] || null;
}

/**
 * 属性面板组件
 */
export default function PropertiesPanel({ 
  node, 
  onUpdate, 
  onClose 
}) {
  const [editedNode, setEditedNode] = useState(node);

  useEffect(() => {
    setEditedNode(node);
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    onUpdate(node.id, editedNode);
  };

  const handleConfigChange = (key, value) => {
    setEditedNode(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  return (
    <div className="w-80 h-full bg-dark-800/95 backdrop-blur-sm border-l border-dark-700 flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div className="flex items-center space-x-2">
          <Settings2 className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-dark-100">节点属性</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors"
            title="保存"
          >
            <Save className="w-4 h-4 text-blue-400" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-dark-400" />
          </button>
        </div>
      </div>

      {/* 属性内容 */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(148, 163, 184, 0.5) rgba(30, 41, 59, 0.5)'
        }}
      >
        {/* 节点名称 */}
        <div>
          <label className="block text-xs font-medium text-dark-400 mb-1">
            节点名称
          </label>
          <input
            type="text"
            value={editedNode.name || ''}
            onChange={(e) => setEditedNode(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 text-sm focus:outline-none focus:border-blue-500"
            placeholder="输入节点名称"
          />
        </div>

        {/* 节点描述 */}
        <div>
          <label className="block text-xs font-medium text-dark-400 mb-1">
            描述
          </label>
          <textarea
            value={editedNode.description || ''}
            onChange={(e) => setEditedNode(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 text-sm focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
            placeholder="节点描述"
          />
        </div>

        {/* 技能选择（仅技能节点） */}
        {editedNode.type === 'skill' && (
          <div>
            <label className="block text-xs font-medium text-dark-400 mb-2">
              选择技能
            </label>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {AVAILABLE_SKILLS.map(skill => (
                <button
                  key={skill.name}
                  onClick={() => {
                    // 为某些技能自动添加默认参数
                    let defaultConfig = {};
                    if (skill.name === 'safe_write_file') {
                      defaultConfig = {
                        path: 'output.txt',
                        content: '${learn_webpage.learningDoc}'  // 默认使用学习文档
                      };
                    } else if (skill.name === 'safe_read_file') {
                      defaultConfig = {
                        path: 'input.txt'
                      };
                    } else if (skill.name === 'learn_webpage') {
                      defaultConfig = {
                        url: 'https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine'
                      };
                    } else if (skill.name === 'batch_learn_webpages') {
                      defaultConfig = {
                        urls: JSON.stringify([
                          'https://dev.epicgames.com/documentation/unreal-engine/programming-with-cplusplus-in-unreal-engine',
                          'https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-cpp-sample-project'
                        ], null, 2),
                        options: JSON.stringify({
                          timeout: 30000
                        }, null, 2)
                      };
                    }
                    
                    setEditedNode(prev => ({
                      ...prev,
                      name: skill.label,
                      config: { ...prev.config, skill: skill.name, ...defaultConfig }
                    }));
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    editedNode.config?.skill === skill.name
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'bg-dark-700 border border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <div className="font-medium text-dark-200">{skill.label}</div>
                  <div className="text-xs text-dark-500">{skill.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 动态参数配置 */}
        {editedNode.config && (
          <div>
            <label className="block text-xs font-medium text-dark-400 mb-2">
              参数配置
            </label>
            <div className="space-y-3">
              {Object.entries(editedNode.config).map(([key, value]) => {
                // 获取参数提示
                const hint = editedNode.config?.skill ? getParamHint(editedNode.config.skill, key) : null;
                const isRequired = hint?.required ?? false;
                
                return (
                  <div key={key}>
                    <label className="block text-xs text-dark-500 mb-1">
                      {hint?.label || key}
                      {isRequired && (
                        <span className="ml-1 text-red-400 font-semibold" title="必填项">*</span>
                      )}
                      {!isRequired && (
                        <span className="ml-1 text-dark-600 text-xs" title="可选项">(可选)</span>
                      )}
                    </label>
                    <input
                      type={typeof value === 'number' ? 'number' : 'text'}
                      value={value}
                      onChange={(e) => handleConfigChange(key, e.target.value)}
                      className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-dark-100 text-xs focus:outline-none focus:border-blue-500"
                      placeholder={isRequired ? '必填项' : '可选项'}
                    />
                    
                    {/* 显示参数提示 */}
                    {hint && (
                    <div className="mt-1 p-2 bg-blue-600/10 border border-blue-500/30 rounded text-xs text-blue-300">
                      {(() => {
                        return (
                          <>
                            <div className="font-semibold mb-1">{hint.label}</div>
                            <div className="mb-1">{hint.description}</div>
                            {hint.required && (
                              <div className="mt-1 text-red-300 font-semibold">⚠️ 必填项</div>
                            )}
                            {hint.templateVariables && (
                              <div className="mt-2">
                                <div className="font-semibold mb-1">可用的模板变量：</div>
                                <ul className="space-y-1">
                                  {hint.templateVariables.map((v, i) => (
                                    <li key={i} className="flex justify-between items-start">
                                      <code className="text-blue-400">${'{}'}{v.name}</code>
                                      <span className="text-blue-200 ml-2">{v.description}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {hint.examples && hint.examples.length > 0 && (
                              <div className="mt-2">
                                <div className="font-semibold mb-1">示例：</div>
                                <ul className="space-y-1">
                                  {hint.examples.map((ex, i) => (
                                    <li key={i} className="text-blue-200">
                                      • {ex.length > 60 ? ex.substring(0, 60) + '...' : ex}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                  </div>
                );
              })}
              
              {/* 添加参数按钮 */}
              <button
                onClick={() => {
                  const key = prompt('参数名称:');
                  if (key) {
                    handleConfigChange(key, '');
                  }
                }}
                className="w-full py-1.5 text-xs text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
              >
                + 添加参数
              </button>
            </div>
          </div>
        )}

        {/* 条件节点配置 */}
        {editedNode.type === 'condition' && (
          <div>
            <label className="block text-xs font-medium text-dark-400 mb-2">
              条件表达式
            </label>
            <textarea
              value={editedNode.condition || ''}
              onChange={(e) => setEditedNode(prev => ({ ...prev, condition: e.target.value }))}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
              rows={4}
              placeholder="例如：result.success === true"
            />
            <p className="text-xs text-dark-500 mt-1">
              支持 JavaScript 表达式
            </p>
          </div>
        )}

        {/* 鼠标移动节点配置 */}
        {editedNode.type === 'mouse' && (
          <div>
            <label className="block text-xs font-medium text-dark-400 mb-2">
              鼠标配置
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-dark-500 mb-1">
                  X 坐标
                </label>
                <input
                  type="number"
                  value={editedNode.config?.x || 0}
                  onChange={(e) => handleConfigChange('x', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-dark-100 text-xs focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-500 mb-1">
                  Y 坐标
                </label>
                <input
                  type="number"
                  value={editedNode.config?.y || 0}
                  onChange={(e) => handleConfigChange('y', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-dark-100 text-xs focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-500 mb-1">
                  点击类型
                </label>
                <select
                  value={editedNode.config?.click || 'left'}
                  onChange={(e) => handleConfigChange('click', e.target.value)}
                  className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-dark-100 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="left">左键</option>
                  <option value="right">右键</option>
                  <option value="middle">中键</option>
                  <option value="none">不点击（仅移动）</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 键盘输入节点配置 */}
        {editedNode.type === 'keyboard' && (
          <div>
            <label className="block text-xs font-medium text-dark-400 mb-2">
              键盘配置
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-dark-500 mb-1">
                  输入文本
                </label>
                <textarea
                  value={editedNode.config?.text || ''}
                  onChange={(e) => handleConfigChange('text', e.target.value)}
                  className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-dark-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="输入要输入的文本"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-500 mb-1">
                  按键延迟（毫秒）
                </label>
                <input
                  type="number"
                  value={editedNode.config?.delay || 50}
                  onChange={(e) => handleConfigChange('delay', parseInt(e.target.value) || 50)}
                  className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-dark-100 text-xs focus:outline-none focus:border-blue-500"
                  placeholder="50"
                />
                <p className="text-xs text-dark-500 mt-1">
                  每个按键之间的延迟时间
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 节点元信息 */}
        <div className="pt-4 border-t border-dark-700">
          <h4 className="text-xs font-medium text-dark-500 mb-2">元信息</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-dark-500">ID:</span>
              <span className="text-dark-400 font-mono">{editedNode.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-500">类型:</span>
              <span className="text-dark-400">{editedNode.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-500">位置:</span>
              <span className="text-dark-400 font-mono">
                ({Math.round(editedNode.position.x)}, {Math.round(editedNode.position.y)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="p-4 border-t border-dark-700">
        <button
          onClick={handleSave}
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-sm font-medium transition-all"
        >
          保存修改
        </button>
      </div>
    </div>
  );
}
