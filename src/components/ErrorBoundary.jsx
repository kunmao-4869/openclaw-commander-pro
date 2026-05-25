/**
 * 错误边界组件
 * 捕获 React 组件树中的错误，显示友好的错误提示
 */

import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // 更新状态使下一次渲染显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误到控制台
    console.error('ErrorBoundary 捕获到错误:', error, errorInfo);

    // 记录错误信息
    this.setState({
      error,
      errorInfo,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // 发送错误报告（如果配置了上报）
    this.reportError(error, errorInfo);
  }

  /**
   * 发送错误报告
   */
  reportError(error, errorInfo) {
    try {
      // 本地存储错误日志
      const errorLog = {
        id: this.state.errorId,
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack
        },
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // 存储到 localStorage
      const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      errorLogs.push(errorLog);

      // 只保留最近的 50 条错误
      if (errorLogs.length > 50) {
        errorLogs.shift();
      }

      localStorage.setItem('errorLogs', JSON.stringify(errorLogs));

      // 如果有错误上报服务，可以在这里调用
      // reportToServer(errorLog);
    } catch (err) {
      console.error('发送错误报告失败:', err);
    }
  }

  /**
   * 刷新页面
   */
  handleRefresh = () => {
    window.location.reload();
  };

  /**
   * 清除错误并重试
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  /**
   * 查看错误详情
   */
  toggleErrorDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  /**
   * 复制错误信息
   */
  copyErrorDetails = () => {
    const errorText = `
错误 ID: ${this.state.errorId}
时间: ${new Date().toISOString()}
URL: ${window.location.href}

错误信息:
${this.state.error?.message}

堆栈跟踪:
${this.state.error?.stack}

组件堆栈:
${this.state.errorInfo?.componentStack}

用户代理:
${navigator.userAgent}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      alert('错误信息已复制到剪贴板');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-red-900/20 to-dark-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* 错误卡片 */}
            <div className="bg-dark-800 rounded-2xl border-2 border-red-500/50 shadow-2xl shadow-red-500/20 overflow-hidden">
              {/* 错误头部 */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <AlertTriangle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      应用遇到了错误
                    </h1>
                    <p className="text-red-100 text-sm mt-1">
                      抱歉，应用运行时出现了意外情况
                    </p>
                  </div>
                </div>
              </div>

              {/* 错误内容 */}
              <div className="p-8">
                {/* 错误描述 */}
                <div className="mb-8">
                  <div className="flex items-start space-x-3 mb-4">
                    <Bug className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-2">
                        错误详情
                      </h2>
                      <p className="text-dark-300">
                        {this.state.error?.message || '未知错误'}
                      </p>
                    </div>
                  </div>

                  {/* 错误 ID */}
                  <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
                    <div className="flex items-center justify-between">
                      <span className="text-dark-400 text-sm">错误 ID:</span>
                      <code className="text-primary-400 font-mono">
                        {this.state.errorId}
                      </code>
                    </div>
                  </div>
                </div>

                {/* 错误详情切换 */}
                <button
                  onClick={this.toggleErrorDetails}
                  className="w-full mb-6 flex items-center justify-between px-4 py-3 bg-dark-900 hover:bg-dark-700 rounded-lg border border-dark-700 transition-colors"
                >
                  <span className="text-dark-300">
                    查看详细错误信息
                  </span>
                  <span className="text-dark-500">
                    {this.state.showDetails ? '▼' : '▶'}
                  </span>
                </button>

                {/* 详细错误信息 */}
                {this.state.showDetails && (
                  <div className="mb-6 space-y-4">
                    {/* 堆栈跟踪 */}
                    {this.state.error?.stack && (
                      <div className="bg-dark-900 rounded-lg p-4 border border-dark-700 overflow-x-auto">
                        <h3 className="text-sm font-semibold text-dark-300 mb-2">
                          堆栈跟踪
                        </h3>
                        <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}

                    {/* 组件堆栈 */}
                    {this.state.errorInfo?.componentStack && (
                      <div className="bg-dark-900 rounded-lg p-4 border border-dark-700 overflow-x-auto">
                        <h3 className="text-sm font-semibold text-dark-300 mb-2">
                          组件堆栈
                        </h3>
                        <pre className="text-xs text-yellow-400 font-mono whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 刷新页面 */}
                  <button
                    onClick={this.handleRefresh}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 rounded-xl font-medium transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>刷新页面</span>
                  </button>

                  {/* 重试 */}
                  <button
                    onClick={this.handleRetry}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-dark-700 hover:bg-dark-600 rounded-xl font-medium transition-colors"
                  >
                    <span>重试操作</span>
                  </button>
                </div>

                {/* 复制错误信息 */}
                <button
                  onClick={this.copyErrorDetails}
                  className="w-full mt-4 flex items-center justify-center space-x-2 px-6 py-3 bg-dark-900 hover:bg-dark-800 rounded-xl border border-dark-700 text-sm transition-colors"
                >
                  <span>复制错误信息</span>
                </button>
              </div>
            </div>

            {/* 开发环境提示 */}
            {import.meta.env.DEV && (
              <div className="mt-4 p-4 bg-yellow-900/20 rounded-xl border border-yellow-600/30">
                <p className="text-yellow-400 text-sm">
                  💡 开发模式：错误信息已打印到控制台，可以在开发者工具中查看详细信息
                </p>
              </div>
            )}

            {/* 联系支持 */}
            <div className="mt-4 p-4 bg-dark-800/50 rounded-xl border border-dark-700">
              <p className="text-dark-400 text-sm text-center">
                如果问题持续存在，请将错误 ID 提供给技术支持团队
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 用于测试错误边界的组件
 */
export class ErrorTest extends Component {
  state = { shouldThrow: false };

  handleThrow = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('这是一个测试错误');
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
