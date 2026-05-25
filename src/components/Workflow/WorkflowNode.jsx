/**
 * 工作流节点组件
 * 支持拖拽、连接、配置
 */
import React, { useState, useRef } from 'react';
import { Play, Square, GitBranch, Zap, Settings, Trash2, Copy, Plus, MousePointer, Keyboard } from 'lucide-react';

/**
 * 节点类型配置
 */
const NODE_TYPES = {
  start: {
    icon: Play,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    label: '开始'
  },
  skill: {
    icon: Zap,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    label: '技能'
  },
  condition: {
    icon: GitBranch,
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/50',
    label: '条件'
  },
  end: {
    icon: Square,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    label: '结束'
  },
  mouse: {
    icon: MousePointer,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/50',
    label: '鼠标移动'
  },
  keyboard: {
    icon: Keyboard,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/50',
    label: '键盘输入'
  }
};

/**
 * 工作流节点组件
 */
export default function WorkflowNode({ 
  node, 
  isSelected, 
  onSelect, 
  onMove, 
  onDelete, 
  onDuplicate,
  onConnectionStart,
  onConnectionEnd,
  scale = 1,
  offset = { x: 0, y: 0 }
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const nodeConfig = NODE_TYPES[node.type] || NODE_TYPES.skill;
  const IconComponent = nodeConfig.icon;

  // 处理鼠标按下
  const handleMouseDown = (e) => {
    if (e.target.closest('.node-controls')) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    // 获取画布容器的边界
    const canvasElement = document.querySelector('.workflow-canvas');
    if (canvasElement) {
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // 计算鼠标点击点在画布坐标系中的位置
      const clickX = (e.clientX - canvasRect.left - offset.x) / scale;
      const clickY = (e.clientY - canvasRect.top - offset.y) / scale;
      
      // 计算鼠标点击点相对于节点左上角的偏移（在画布坐标系中）
      setDragOffset({
        x: clickX - node.position.x,
        y: clickY - node.position.y
      });
    }
    
    onSelect(node.id);
  };

  // 处理鼠标移动
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      // 获取画布容器的边界
      const canvasElement = document.querySelector('.workflow-canvas');
      if (!canvasElement) return;
      
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // 计算鼠标在画布容器中的位置（考虑缩放和平移）
      const mouseX = (e.clientX - canvasRect.left - offset.x) / scale;
      const mouseY = (e.clientY - canvasRect.top - offset.y) / scale;
      
      // 计算新位置（减去鼠标相对于节点的偏移）
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;
      
      onMove(node.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, node.id, onMove]);

  // 处理连接点鼠标按下（开始连接）
  const handleOutputMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('[WorkflowNode] Output connection point mouse down');
    
    // 获取节点中心位置（使用固定高度 100px）
    const nodeHeight = 100;
    const nodeCenterY = node.position.y + nodeHeight / 2;
    
    // 直接调用 onConnectionStart，传递正确的起始位置
    onConnectionStart(node.id, 'output', {
      x: node.position.x + (node.width || 200),
      y: nodeCenterY
    });
  };

  // 处理输入连接点鼠标松开（完成连接）
  const handleInputMouseUp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('[WorkflowNode] Input connection point mouse up');
    
    // 获取节点中心位置（使用固定高度 100px）
    const nodeHeight = 100;
    const nodeCenterY = node.position.y + nodeHeight / 2;
    
    // 直接调用 onConnectionEnd，传递正确的结束位置
    onConnectionEnd(node.id, 'input', {
      x: node.position.x,
      y: nodeCenterY
    });
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-move select-none transition-shadow duration-200 ${
        isSelected ? 'z-50' : 'z-10'
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.width || 200
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 节点主体 */}
      <div
        className={`relative rounded-xl border-2 backdrop-blur-sm transition-all duration-200 group min-h-[100px] ${
          isSelected 
            ? `${nodeConfig.borderColor} shadow-lg shadow-${nodeConfig.color.split('-')[1]}-500/30 scale-105` 
            : 'border-dark-600 hover:border-dark-500'
        }`}
      >
        {/* 渐变背景 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${nodeConfig.color} opacity-10 rounded-xl`} />
        
        {/* 节点内容 */}
        <div className="relative p-3">
          {/* 标题栏 */}
          <div className="flex items-center space-x-2 mb-2">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${nodeConfig.color}`}>
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-dark-100 text-sm flex-1">
              {node.name || nodeConfig.label}
            </span>
            
            {/* 控制按钮 - 选中时或悬停时显示 */}
            <div className={`node-controls flex items-center space-x-1 transition-opacity ${
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(node.id);
                }}
                className="p-1 hover:bg-dark-700 rounded transition-colors"
                title="复制节点"
              >
                <Copy className="w-3.5 h-3.5 text-dark-400" />
              </button>
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
                className="p-1 hover:bg-red-900/50 rounded transition-colors"
                title="删除节点"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          </div>
          
          {/* 节点描述 */}
          {node.description && (
            <p className="text-xs text-dark-400 line-clamp-2 mb-2">
              {node.description}
            </p>
          )}
          
          {/* 节点参数预览 */}
          {node.config && Object.keys(node.config).length > 0 && (
            <div className={`p-2 rounded-lg ${nodeConfig.bgColor}`}>
              <div className="flex flex-wrap gap-1">
                {Object.entries(node.config).slice(0, 3).map(([key, value]) => (
                  <div
                    key={key}
                    className="px-2 py-1 bg-dark-800/50 rounded text-xs text-dark-300"
                  >
                    {key}: {String(value).slice(0, 15)}
                    {String(value).length > 15 ? '...' : ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 输入连接点 */}
        {node.type !== 'start' && (
          <div
            data-connection-point="input"
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-crosshair group"
            onMouseUp={handleInputMouseUp}
          >
            <div className="w-3 h-3 rounded-full bg-dark-600 border-2 border-dark-400 group-hover:border-blue-400 group-hover:bg-blue-500/50 transition-colors" />
          </div>
        )}
        
        {/* 输出连接点 */}
        {node.type !== 'end' && (
          <div
            data-connection-point="output"
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-crosshair group"
            onMouseDown={handleOutputMouseDown}
          >
            <div className="w-3 h-3 rounded-full bg-dark-600 border-2 border-dark-400 group-hover:border-blue-400 group-hover:bg-blue-500/50 transition-colors" />
          </div>
        )}
      </div>
      
      {/* 选中指示器 */}
      {isSelected && (
        <div className={`absolute -inset-1 rounded-xl border-2 border-dashed ${nodeConfig.borderColor} opacity-50`} />
      )}
    </div>
  );
}

/**
 * 节点工具栏组件
 */
export function NodeToolbar({ onAddNode }) {
  return (
    <div className="flex flex-col space-y-2 p-4 bg-dark-800/50 backdrop-blur-sm rounded-xl border border-dark-700">
      <h3 className="text-sm font-semibold text-dark-200 mb-2">添加节点</h3>
      
      {Object.entries(NODE_TYPES).map(([type, config]) => {
        const IconComponent = config.icon;
        return (
          <button
            key={type}
            onClick={() => onAddNode(type)}
            className="flex items-center space-x-3 p-3 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 border border-dark-600 hover:border-dark-500 transition-all group"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color} group-hover:scale-110 transition-transform`}>
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-dark-300 group-hover:text-dark-100">
              {config.label}
            </span>
            <Plus className="w-4 h-4 text-dark-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        );
      })}
    </div>
  );
}
