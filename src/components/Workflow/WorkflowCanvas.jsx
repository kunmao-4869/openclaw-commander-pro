/**
 * 工作流画布组件
 * 支持缩放、平移、网格
 */
import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize, Grid3x3 } from 'lucide-react';

/**
 * 工作流画布组件
 */
export default function WorkflowCanvas({ 
  children, 
  scale = 1, 
  offset = { x: 0, y: 0 },
  onScaleChange,
  onOffsetChange,
  showGrid = true
}) {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // 处理鼠标按下（开始平移）
  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.closest('.workflow-canvas')) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  };

  // 处理鼠标移动（平移中）
  const handleMouseMove = (e) => {
    if (!isPanning) return;
    
    e.preventDefault();
    onOffsetChange({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  // 处理鼠标松开（结束平移）
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // 处理滚轮缩放
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.min(Math.max(scale + delta, 0.5), 2);
      onScaleChange(newScale);
    }
  };

  // 缩放控制
  const handleZoomIn = () => {
    onScaleChange(Math.min(scale + 0.1, 2));
  };

  const handleZoomOut = () => {
    onScaleChange(Math.max(scale - 0.1, 0.5));
  };

  const handleFitScreen = () => {
    onScaleChange(1);
    onOffsetChange({ x: 0, y: 0 });
  };

  const toggleGrid = () => {
    // 通过 CSS 类控制网格显示
    const gridElement = document.querySelector('.canvas-grid');
    if (gridElement) {
      gridElement.style.display = showGrid ? 'none' : 'block';
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-dark-900">
      {/* 画布容器 */}
      <div
        ref={canvasRef}
        className="workflow-canvas absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* 网格背景 */}
        {showGrid && (
          <div
            className="canvas-grid absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * scale}px ${20 * scale}px`,
              backgroundPosition: `${offset.x}px ${offset.y}px`
            }}
          />
        )}
        
        {/* 内容容器 */}
        <div
          className="absolute"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          {children}
        </div>
      </div>
      
      {/* 缩放控制工具栏 */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-dark-800/80 backdrop-blur-sm rounded-lg border border-dark-700 p-2">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          title="缩小"
        >
          <ZoomOut className="w-4 h-4 text-dark-300" />
        </button>
        
        <span className="text-xs text-dark-400 w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          title="放大"
        >
          <ZoomIn className="w-4 h-4 text-dark-300" />
        </button>
        
        <div className="w-px h-4 bg-dark-700 mx-2" />
        
        <button
          onClick={handleFitScreen}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          title="适应屏幕"
        >
          <Maximize className="w-4 h-4 text-dark-300" />
        </button>
        
        <div className="w-px h-4 bg-dark-700 mx-2" />
        
        <button
          onClick={toggleGrid}
          className={`p-2 rounded-lg transition-colors ${
            showGrid ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-dark-700 text-dark-300'
          }`}
          title="切换网格"
        >
          <Grid3x3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
