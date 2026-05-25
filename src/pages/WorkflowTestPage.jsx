/**
 * 工作流编辑器测试页面
 * 用于独立测试工作流编辑器组件
 */
import React, { useState, Suspense, lazy } from 'react';

// 使用 lazy loading 延迟加载
const WorkflowEditor = lazy(() => import('../components/Workflow/WorkflowEditor.jsx'));

export default function WorkflowTestPage() {
  const [error, setError] = useState(null);

  return (
    <div className="w-full h-screen bg-dark-900">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-dark-400">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold mb-2">正在加载工作流编辑器...</h2>
            <p className="text-sm">请稍候片刻</p>
          </div>
        </div>
      }>
        {error ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-red-400 max-w-md">
              <h2 className="text-2xl font-bold mb-4">❌ 加载失败</h2>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                刷新页面
              </button>
            </div>
          </div>
        ) : (
          <WorkflowEditor onError={setError} />
        )}
      </Suspense>
    </div>
  );
}
