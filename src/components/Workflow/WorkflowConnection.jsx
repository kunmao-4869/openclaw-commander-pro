/**
 * 工作流连接线组件
 * 使用 SVG 贝塞尔曲线
 */
import React from 'react';

/**
 * 计算贝塞尔曲线控制点
 */
function calculateControlPoints(start, end) {
  const deltaX = Math.abs(end.x - start.x);
  const deltaY = Math.abs(end.y - start.y);
  
  // 控制点偏移量
  const offset = Math.max(deltaX * 0.5, 100);
  
  return {
    cp1: { x: start.x + offset, y: start.y },
    cp2: { x: end.x - offset, y: end.y }
  };
}

/**
 * 工作流连接线组件
 */
export default function WorkflowConnection({ 
  connection, 
  nodes, 
  isSelected, 
  onSelect,
  onDelete 
}) {
  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);
  
  console.log('[WorkflowConnection] Rendering connection:', connection, 'sourceNode:', sourceNode, 'targetNode:', targetNode);
  
  if (!sourceNode || !targetNode) {
    console.log('[WorkflowConnection] Missing source or target node, returning null');
    return null;
  }
  
  // 计算连接点位置（使用固定高度 100px）
  const NODE_HEIGHT = 100;
  
  const sourcePosition = {
    x: sourceNode.position.x + (sourceNode.width || 200),
    y: sourceNode.position.y + (NODE_HEIGHT / 2)
  };
  
  const targetPosition = {
    x: targetNode.position.x,
    y: targetNode.position.y + (NODE_HEIGHT / 2)
  };
  
  // 计算控制点
  const { cp1, cp2 } = calculateControlPoints(sourcePosition, targetPosition);
  
  // 生成贝塞尔曲线路径
  const path = `M ${sourcePosition.x} ${sourcePosition.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${targetPosition.x} ${targetPosition.y}`;
  
  console.log('[WorkflowConnection] Path:', path, 'sourcePosition:', sourcePosition, 'targetPosition:', targetPosition);
  
  return (
    <g 
      className="group cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(connection.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDelete(connection.id);
      }}
    >
      {/* 阴影/光晕效果 */}
      <path
        d={path}
        fill="none"
        stroke="rgba(134, 239, 172, 0.1)"
        strokeWidth="8"
        className="group-hover:stroke-green-400/20 transition-colors"
      />
      
      {/* 主连接线 */}
      <path
        d={path}
        fill="none"
        stroke={isSelected ? '#ffffff' : '#86efac'}
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-200"
        strokeDasharray={isSelected ? 'none' : '5,5'}
      />
      
      {/* 动画流动效果 */}
      <path
        d={path}
        fill="none"
        stroke="url(#connectionGradientGreen)"
        strokeWidth="2"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        strokeDasharray="10,10"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="100"
          to="0"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* 连接点标记 */}
      <circle cx={sourcePosition.x} cy={sourcePosition.y} r="4" fill="#3b82f6" />
      <circle cx={targetPosition.x} cy={targetPosition.y} r="4" fill="#3b82f6" />
      
      {/* 删除按钮（悬停时显示） */}
      {isSelected && (
        <g>
          <circle
            cx={(sourcePosition.x + targetPosition.x) / 2}
            cy={(sourcePosition.y + targetPosition.y) / 2 - 15}
            r="12"
            fill="#ef4444"
            className="cursor-pointer hover:fill-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(connection.id);
            }}
          />
          <text
            x={(sourcePosition.x + targetPosition.x) / 2}
            y={(sourcePosition.y + targetPosition.y) / 2 - 11}
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
}

/**
 * 临时连接线（拖拽时）
 */
export function TemporaryConnection({ from, to }) {
  console.log('[TemporaryConnection] Rendering with from:', from, 'to:', to);
  
  if (!from) {
    console.log('[TemporaryConnection] No from position, returning null');
    return null;
  }
  
  const { cp1, cp2 } = calculateControlPoints(from, to || from);
  const path = `M ${from.x} ${from.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to ? to.x : from.x} ${to ? to.y : from.y}`;
  
  console.log('[TemporaryConnection] Path:', path);
  
  return (
    <path
      d={path}
      fill="none"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeDasharray="5,5"
      className="opacity-70"
    >
      {to && (
        <animate
          attributeName="stroke-dashoffset"
          from="100"
          to="0"
          dur="1s"
          repeatCount="indefinite"
        />
      )}
    </path>
  );
}

/**
 * SVG 渐变定义
 */
export function ConnectionGradients() {
  return (
    <defs>
      <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="connectionGradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#86efac" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
      </linearGradient>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon
          points="0 0, 10 3.5, 0 7"
          fill="#86efac"
        />
      </marker>
    </defs>
  );
}
