/**
 * 工作流可视化编辑器
 * 超酷的拖拽式工作流编排工具
 */
import React, { useState, useCallback } from 'react';
import { Play, Save, FolderOpen, Download, Upload, Trash2, Plus, Settings, Eye } from 'lucide-react';
import WorkflowNode, { NodeToolbar } from './WorkflowNode.jsx';
import WorkflowConnection, { TemporaryConnection, ConnectionGradients } from './WorkflowConnection.jsx';
import WorkflowCanvas from './WorkflowCanvas.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';

/**
 * 生成唯一 ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 工作流编辑器组件
 */
export default function WorkflowEditor() {
  // 工作流数据
  const [workflow, setWorkflow] = useState({
    name: '未命名工作流',
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        name: '开始',
        position: { x: 100, y: 200 },
        config: {}
      }
    ],
    connections: []
  });

  // 选中状态
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  
  // 画布状态
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // 连接状态
  const [connecting, setConnecting] = useState(null);
  const [tempConnectionEnd, setTempConnectionEnd] = useState(null);
  
  // UI 状态
  const [showProperties, setShowProperties] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);

  // 添加节点
  const handleAddNode = useCallback((type) => {
    const newNode = {
      id: `${type}-${generateId()}`,
      type,
      name: type === 'skill' ? '技能' 
        : type === 'start' ? '开始' 
        : type === 'end' ? '结束' 
        : type === 'mouse' ? '鼠标移动'
        : type === 'keyboard' ? '键盘输入'
        : '条件',
      position: {
        x: 400 + Math.random() * 100,
        y: 200 + Math.random() * 100
      },
      width: 200,
      config: type === 'skill' ? { skill: '' } 
        : type === 'mouse' ? { x: 0, y: 0, click: 'left' }
        : type === 'keyboard' ? { text: '', delay: 50 }
        : {}
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  }, []);

  // 移动节点
  const handleMoveNode = useCallback((nodeId, x, y) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId
          ? { ...node, position: { x, y } }
          : node
      )
    }));
  }, []);

  // 删除节点
  const handleDeleteNode = useCallback((nodeId) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(
        c => c.source !== nodeId && c.target !== nodeId
      )
    }));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setShowProperties(false);
    }
  }, [selectedNode]);

  // 复制节点
  const handleDuplicateNode = useCallback((nodeId) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const newNode = {
      ...node,
      id: `${node.type}-${generateId()}`,
      name: `${node.name} (副本)`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50
      }
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  }, [workflow.nodes]);

  // 更新节点
  const handleUpdateNode = useCallback((nodeId, updates) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  }, []);

  // 开始连接
  const handleConnectionStart = useCallback((nodeId, port, position) => {
    console.log('[WorkflowEditor] handleConnectionStart called:', { nodeId, port, position });
    setConnecting({
      nodeId,
      port,
      position
    });
  }, []);

  // 结束连接
  const handleConnectionEnd = useCallback((nodeId, port, position) => {
    console.log('[WorkflowEditor] handleConnectionEnd called:', { nodeId, port, position, connecting });
    
    if (!connecting || connecting.nodeId === nodeId) {
      console.log('[WorkflowEditor] handleConnectionEnd: invalid connection, clearing');
      setConnecting(null);
      setTempConnectionEnd(null);
      return;
    }

    const source = connecting.port === 'output' ? connecting.nodeId : nodeId;
    const target = connecting.port === 'input' ? connecting.nodeId : nodeId;

    console.log('[WorkflowEditor] handleConnectionEnd: source=', source, 'target=', target);

    // 检查连接是否已存在
    const exists = workflow.connections.some(
      c => c.source === source && c.target === target
    );

    if (!exists) {
      console.log('[WorkflowEditor] Creating new connection');
      setWorkflow(prev => ({
        ...prev,
        connections: [
          ...prev.connections,
          {
            id: `conn-${generateId()}`,
            source,
            target
          }
        ]
      }));
    } else {
      console.log('[WorkflowEditor] Connection already exists');
    }

    setConnecting(null);
    setTempConnectionEnd(null);
  }, [connecting, workflow.connections]);

  // 删除连接
  const handleDeleteConnection = useCallback((connectionId) => {
    setWorkflow(prev => ({
      ...prev,
      connections: prev.connections.filter(c => c.id !== connectionId)
    }));
    if (selectedConnection === connectionId) {
      setSelectedConnection(null);
    }
  }, [selectedConnection]);

  // 保存工作流
  const handleSave = useCallback(() => {
    const data = JSON.stringify(workflow, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name || 'workflow'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [workflow]);

  // 加载工作流
  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loaded = JSON.parse(e.target.result);
          setWorkflow(loaded);
        } catch (error) {
          alert('文件格式错误');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  // 运行工作流
  const handleRun = useCallback(async () => {
    console.log('🚀 开始执行工作流');
    
    // 1. 找到开始节点
    const startNode = workflow.nodes.find(n => n.type === 'start');
    if (!startNode) {
      alert('工作流必须包含一个"开始"节点');
      return;
    }

    try {
      // 2. 从开始节点开始，沿着连接线执行
      const context = {}; // 用于存储节点执行结果
      await executeNode(startNode.id, workflow, context);
    } catch (error) {
      console.error('❌ 工作流执行失败:', error);
      alert(`工作流执行失败：${error.message}`);
    }
  }, [workflow]);

  // 执行节点（递归）
  const executeNode = async (nodeId, workflow, context = {}) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`节点 ${nodeId} 不存在`);
    }

    console.log(`📍 执行节点：${node.name} (${node.type})`);

    let result = null;

    // 1. 如果是技能节点，执行技能
    if (node.type === 'skill') {
      result = await executeSkill(node, context);
    }

    // 2. 如果是鼠标移动节点，执行鼠标操作
    if (node.type === 'mouse') {
      await executeMouse(node);
    }

    // 3. 如果是键盘输入节点，执行键盘操作
    if (node.type === 'keyboard') {
      await executeKeyboard(node);
    }

    // 4. 如果是条件节点，评估条件并选择分支
    if (node.type === 'condition') {
      await executeCondition(node, workflow, context);
      return;
    }

    // 保存当前节点执行结果到上下文
    context[node.id] = result;
    context.lastResult = result; // 最近一次执行结果
    
    // 同时通过技能名称保存结果（支持 ${skillName.field} 语法）
    if (node.type === 'skill' && node.config?.skill) {
      const skillName = node.config.skill;
      context[skillName] = result;
      console.log(`📌 保存技能结果到上下文：${skillName}`, { 
        hasLearningDoc: !!result?.learningDoc,
        hasResults: !!result?.results,
        hasContent: !!result?.content 
      });
    }

    // 5. 找到下一个节点（通过连接线）
    const nextConnection = workflow.connections.find(c => c.source === nodeId);
    if (nextConnection) {
      await executeNode(nextConnection.target, workflow, context);
    }
  };

  // 解析配置中的模板变量（支持 ${variable} 和 ${object.property}）
  const resolveTemplate = (value, context) => {
    if (typeof value !== 'string') {
      return value;
    }
    
    // 匹配 ${...} 模板
    const templateRegex = /\$\{([^}]+)\}/g;
    
    return value.replace(templateRegex, (match, expression) => {
      // 支持访问 context 中的任何变量
      const keys = expression.split('.');
      let result = context;
      
      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          return match; // 找不到变量，返回原字符串
        }
      }
      
      // 特殊处理：如果是数组，格式化为文本
      if (Array.isArray(result)) {
        // 如果数组元素是对象，尝试提取有用信息
        if (result.length > 0 && typeof result[0] === 'object') {
          return result.map((item, index) => {
            const title = item.title || item.name || `项目 ${index + 1}`;
            const url = item.url || item.link || '';
            // 支持多种描述字段名
            const snippet = item.text || item.snippet || item.description || item.summary || '';
            return `${index + 1}. ${title}\n   链接：${url}\n   描述：${snippet}`;
          }).join('\n\n');
        }
        return result.join(', ');
      }
      
      return result !== undefined ? String(result) : match;
    });
  };

  // 递归解析对象中的所有模板变量
  const resolveConfigTemplates = (config, context) => {
    if (!config || typeof config !== 'object') {
      return config;
    }
    
    const resolved = {};
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string') {
        resolved[key] = resolveTemplate(value, context);
      } else if (typeof value === 'object' && value !== null) {
        resolved[key] = resolveConfigTemplates(value, context);
      } else {
        resolved[key] = value;
      }
    }
    return resolved;
  };

  // 执行技能
  const executeSkill = async (node, context = {}) => {
    const skillName = node.config?.skill;
    if (!skillName) {
      throw new Error(`节点 ${node.name} 未选择技能`);
    }

    console.log(`🔧 执行技能：${skillName}`);
    console.log(`📋 当前上下文：`, {
      hasLastResult: !!context.lastResult,
      hasLearnWebpage: !!context.learn_webpage,
      learn_webpage_keys: context.learn_webpage ? Object.keys(context.learn_webpage) : [],
      lastResult_keys: context.lastResult ? Object.keys(context.lastResult) : []
    });

    // 解析配置中的模板变量
    // 支持访问前一个技能返回的所有字段
    const templateContext = {
      ...context,
      lastResult: context.lastResult,
      result: context.lastResult,
      // 通用字段
      searchResults: context.lastResult?.results,
      // 如果 lastResult 有 skillName 字段，也添加到上下文中
      // 例如：learn_webpage.learningDoc, web_search.results
    };
    
    // 添加技能特定的字段（例如：learn_webpage.learningDoc）
    if (context.lastResult && typeof context.lastResult === 'object') {
      Object.assign(templateContext, context.lastResult);
    }
    
    const resolvedConfig = resolveConfigTemplates(node.config, templateContext);
    
    console.log(`📝 解析后的配置:`, {
      skill: skillName,
      content_preview: resolvedConfig.content ? resolvedConfig.content.substring(0, 100) : '(空)',
      has_template_vars: resolvedConfig.content?.includes('${')
    });

    // 需要在服务端执行的技能列表
    const serverSkills = ['safe_write_file', 'safe_read_file', 'generate_project_code', 'review_code'];
    
    // 如果是服务端技能，通过后端 API 调用
    if (serverSkills.includes(skillName)) {
      return await executeServerSkill(skillName, resolvedConfig);
    }

    // 否则在浏览器中执行
    const { lazySkillLoader } = await import('../../skills/LazySkillLoader.js');
    const SkillClass = await lazySkillLoader.loadSkill(skillName);
    
    if (!SkillClass) {
      throw new Error(`技能 ${skillName} 不存在`);
    }

    const skill = new SkillClass();
    const result = await skill.execute(resolvedConfig);
    
    console.log(`✅ 技能执行完成:`, result);
    return result;
  };

  // 执行服务端技能（通过后端 API）
  const executeServerSkill = async (skillName, config) => {
    console.log(`🌐 通过后端执行技能：${skillName}`);
    
    try {
      const response = await fetch('http://localhost:3003/api/skill/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill: skillName,
          params: config
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `技能 ${skillName} 执行失败`);
      }

      const result = await response.json();
      console.log(`✅ 服务端技能执行完成:`, result);
      return result;
    } catch (error) {
      console.error(`❌ 服务端技能执行失败:`, error);
      throw new Error(`服务端技能执行失败：${error.message}`);
    }
  };

  // 执行鼠标操作
  const executeMouse = async (node) => {
    const { x, y, click } = node.config || {};
    
    if (x === undefined || y === undefined) {
      throw new Error('鼠标移动节点需要配置 X 和 Y 坐标');
    }

    console.log(`🖱️ 移动鼠标到：(${x}, ${y})${click !== 'none' ? ` 并点击${click}键` : ''}`);

    // 调用后端 API
    const response = await fetch('http://localhost:3003/api/ui/mouse/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y })
    });

    if (!response.ok) {
      throw new Error('鼠标移动失败');
    }

    // 如果需要点击
    if (click && click !== 'none') {
      const clickResponse = await fetch('http://localhost:3003/api/ui/mouse/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ button: click })
      });

      if (!clickResponse.ok) {
        throw new Error('鼠标点击失败');
      }
    }

    console.log('✅ 鼠标操作完成');
  };

  // 执行键盘输入
  const executeKeyboard = async (node) => {
    const { text, delay } = node.config || {};
    
    if (!text) {
      throw new Error('键盘输入节点需要配置输入文本');
    }

    console.log(`⌨️ 输入文本：${text}`);

    const response = await fetch('http://localhost:3003/api/ui/keyboard/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, delay: delay || 50 })
    });

    if (!response.ok) {
      throw new Error('键盘输入失败');
    }

    console.log('✅ 键盘输入完成');
  };

  // 执行条件判断
  const executeCondition = async (node, workflow, context = {}) => {
    const condition = node.condition || '';
    
    console.log(`🔀 评估条件：${condition}`);
    console.log('上下文:', context);

    try {
      // 构建评估环境，提供常用变量
      const lastResult = context.lastResult;
      const result = lastResult;
      const results = lastResult?.results;
      
      // 直接 eval 评估（在 async 函数作用域内，只能访问局部变量）
      // 使用更安全的 Function 方式，只传入简单的变量
      const evaluate = new Function('result', 'results', 'lastResult', `return ${condition}`);
      const evalResult = evaluate(result, results, lastResult);
      
      console.log(`条件结果：${evalResult}`);

      // 根据条件结果选择分支
      // true 走第一个连接，false 走第二个连接
      const connections = workflow.connections.filter(c => c.source === node.id);
      
      if (connections.length > 0) {
        const nextNode = evalResult ? connections[0] : (connections[1] || connections[0]);
        console.log(`条件为 ${evalResult ? '真' : '假'}，执行分支：${nextNode.target}`);
        await executeNode(nextNode.target, workflow, context);
      }
    } catch (error) {
      console.error('条件评估失败:', error);
      throw new Error(`条件表达式错误：${error.message}`);
    }
  };

  // 处理画布点击
  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedNode(null);
      setSelectedConnection(null);
      setShowProperties(false);
    }
  }, []);

  // 处理鼠标移动（临时连接线）
  React.useEffect(() => {
    console.log('[WorkflowEditor] connecting state changed:', connecting);
    
    const handleMouseMove = (e) => {
      if (!connecting) return;
      
      const canvas = document.querySelector('.workflow-canvas');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;

      console.log('[WorkflowEditor] Mouse move, setting tempConnectionEnd:', { x, y });
      setTempConnectionEnd({ x, y });
    };

    const handleMouseUp = (e) => {
      // 鼠标松开时检查是否在输入连接点上
      const isInputConnectionPoint = e.target.closest('[data-connection-point="input"]');
      
      if (connecting) {
        if (!isInputConnectionPoint) {
          // 在空白处或非输入连接点上松开，取消连接
          console.log('[WorkflowEditor] Mouse up, clearing connection (not completed)');
          setConnecting(null);
          setTempConnectionEnd(null);
        }
        // 如果在输入连接点上松开，会由该连接点的 onMouseUp 处理
      }
    };

    if (connecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [connecting, offset, scale]);

  return (
    <div className="w-full h-screen flex flex-col bg-dark-900 overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="h-14 bg-dark-800/80 backdrop-blur-sm border-b border-dark-700 flex items-center justify-between px-4 z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🚀 工作流编辑器
          </h1>
          <input
            type="text"
            value={workflow.name}
            onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-sm text-dark-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleLoad}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            <span>打开</span>
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>

          <div className="w-px h-6 bg-dark-700" />

          <button
            onClick={handleRun}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-sm font-medium transition-all"
          >
            <Play className="w-4 h-4" />
            <span>运行</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className={`p-2 rounded-lg transition-colors ${
              showToolbar ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-dark-700'
            }`}
            title="显示工具栏"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowProperties(!showProperties)}
            className={`p-2 rounded-lg transition-colors ${
              showProperties ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-dark-700'
            }`}
            title="属性面板"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex relative">
        {/* 节点工具栏 */}
        {showToolbar && (
          <div className="absolute left-4 top-4 z-40">
            <NodeToolbar onAddNode={handleAddNode} />
          </div>
        )}

        {/* 画布 */}
        <WorkflowCanvas
          scale={scale}
          offset={offset}
          onScaleChange={setScale}
          onOffsetChange={setOffset}
        >
          {/* 节点（在底层） */}
          <div onClick={handleCanvasClick}>
            {workflow.nodes.map(node => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={setSelectedNode}
                onMove={handleMoveNode}
                onDelete={handleDeleteNode}
                onDuplicate={handleDuplicateNode}
                onConnectionStart={handleConnectionStart}
                onConnectionEnd={handleConnectionEnd}
                scale={scale}
                offset={offset}
              />
            ))}
          </div>
          
          {/* SVG 连接线（在顶层，与节点一起 transform） */}
          <svg 
            className="absolute pointer-events-none"
            style={{ overflow: 'visible', zIndex: 100 }}
          >
            <ConnectionGradients />
            
            {/* 连接线 */}
            {workflow.connections.map(conn => (
              <WorkflowConnection
                key={conn.id}
                connection={conn}
                nodes={workflow.nodes}
                isSelected={selectedConnection === conn.id}
                onSelect={setSelectedConnection}
                onDelete={handleDeleteConnection}
              />
            ))}

            {/* 临时连接线 */}
            {connecting && (
              <TemporaryConnection
                from={connecting.position}
                to={tempConnectionEnd}
              />
            )}
          </svg>
        </WorkflowCanvas>

        {/* 属性面板 */}
        {showProperties && selectedNode && (
          <div className="absolute right-0 top-0 bottom-0 z-50">
            <PropertiesPanel
              node={workflow.nodes.find(n => n.id === selectedNode)}
              onUpdate={handleUpdateNode}
              onClose={() => {
                setSelectedNode(null);
                setShowProperties(false);
              }}
            />
          </div>
        )}
      </div>

      {/* 状态栏 */}
      <div className="h-8 bg-dark-800 border-t border-dark-700 flex items-center justify-between px-4 text-xs text-dark-400">
        <div className="flex items-center space-x-4">
          <span>节点：{workflow.nodes.length}</span>
          <span>连接：{workflow.connections.length}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>缩放：{Math.round(scale * 100)}%</span>
          <span className="text-green-400">● 就绪</span>
        </div>
      </div>
    </div>
  );
}
