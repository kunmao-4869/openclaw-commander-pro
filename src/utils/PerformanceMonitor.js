/**
 * 性能监控工具
 * 用于监控应用性能指标和优化建议
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      renders: new Map(),
      componentTimes: new Map(),
      memoryUsage: [],
      fps: [],
      apiCalls: new Map()
    };

    this.observers = {
      render: null,
      memory: null,
      fps: null
    };

    this.startTime = Date.now();
  }

  /**
   * 开始监控
   */
  start() {
    this.startRenderMonitoring();
    this.startMemoryMonitoring();
    this.startFPSMonitoring();
    this.startAPIMonitoring();

    console.log('✅ 性能监控已启动');
  }

  /**
   * 停止监控
   */
  stop() {
    if (this.observers.render) {
      this.observers.render.disconnect();
    }

    if (this.observers.memory) {
      clearInterval(this.observers.memory);
    }

    if (this.observers.fps) {
      cancelAnimationFrame(this.observers.fps);
    }

    console.log('✅ 性能监控已停止');
  }

  /**
   * 监控组件渲染
   */
  startRenderMonitoring() {
    if (typeof PerformanceObserver !== 'undefined') {
      this.observers.render = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const componentName = entry.name || 'unknown';
          const duration = entry.duration;

          this.metrics.componentTimes.set(componentName, {
            last: duration,
            count: (this.metrics.componentTimes.get(componentName)?.count || 0) + 1,
            average: this._calculateAverage(componentName, duration)
          });
        }
      });

      this.observers.render.observe({ entryTypes: ['measure'] });
    }
  }

  /**
   * 监控内存使用
   */
  startMemoryMonitoring() {
    if (performance.memory) {
      this.observers.memory = setInterval(() => {
        const memory = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };

        this.metrics.memoryUsage.push(memory);

        // 只保留最近 100 个数据点
        if (this.metrics.memoryUsage.length > 100) {
          this.metrics.memoryUsage.shift();
        }

        // 检查内存泄漏
        this.checkMemoryLeak();
      }, 5000);
    }
  }

  /**
   * 监控 FPS
   */
  startFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.metrics.fps.push(fps);

        if (this.metrics.fps.length > 60) {
          this.metrics.fps.shift();
        }

        // 检查 FPS 是否过低
        if (fps < 30) {
          console.warn(`⚠️ FPS 过低: ${fps}`);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      this.observers.fps = requestAnimationFrame(measureFPS);
    };

    this.observers.fps = requestAnimationFrame(measureFPS);
  }

  /**
   * 监控 API 调用
   */
  startAPIMonitoring() {
    // 拦截 fetch API
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const url = args[0];
      const startTime = performance.now();

      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;

        this._trackAPICall(url, duration, true);

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this._trackAPICall(url, duration, false);
        throw error;
      }
    };
  }

  /**
   * 追踪 API 调用
   */
  _trackAPICall(url, duration, success) {
    const metrics = this.metrics.apiCalls.get(url) || {
      count: 0,
      successCount: 0,
      failureCount: 0,
      totalTime: 0,
      averageTime: 0
    };

    metrics.count++;
    metrics.totalTime += duration;
    metrics.averageTime = metrics.totalTime / metrics.count;

    if (success) {
      metrics.successCount++;
    } else {
      metrics.failureCount++;
    }

    this.metrics.apiCalls.set(url, metrics);

    // 检查 API 调用是否过慢
    if (duration > 1000) {
      console.warn(`⚠️ API 调用过慢: ${url} (${duration.toFixed(0)}ms)`);
    }
  }

  /**
   * 计算平均值
   */
  _calculateAverage(componentName, newDuration) {
    const existing = this.metrics.componentTimes.get(componentName);
    if (!existing) {
      return newDuration;
    }

    return (existing.average * existing.count + newDuration) / (existing.count + 1);
  }

  /**
   * 检查内存泄漏
   */
  checkMemoryLeak() {
    const memory = this.metrics.memoryUsage;
    if (memory.length < 10) return;

    const recent = memory.slice(-10);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];

    // 如果内存使用持续增长超过 20MB，发出警告
    if (newest.usedJSHeapSize > oldest.usedJSHeapSize + 20 * 1024 * 1024) {
      console.warn('⚠️ 检测到可能的内存泄漏');

      // 自动触发垃圾回收（如果可用）
      if (window.gc) {
        window.gc();
      }
    }
  }

  /**
   * 记录组件渲染时间
   */
  markRender(componentName, duration) {
    const existing = this.metrics.renders.get(componentName) || {
      count: 0,
      totalTime: 0,
      averageTime: 0,
      maxTime: 0
    };

    existing.count++;
    existing.totalTime += duration;
    existing.averageTime = existing.totalTime / existing.count;
    existing.maxTime = Math.max(existing.maxTime, duration);

    this.metrics.renders.set(componentName, existing);

    // 检查渲染是否过慢
    if (duration > 100) {
      console.warn(`⚠️ 组件渲染过慢: ${componentName} (${duration.toFixed(0)}ms)`);
    }
  }

  /**
   * 获取性能报告
   */
  getReport() {
    const memory = this.metrics.memoryUsage.slice(-1)[0];
    const fps = this.metrics.fps.slice(-10);
    const averageFPS = fps.length > 0
      ? fps.reduce((sum, val) => sum + val, 0) / fps.length
      : 0;

    return {
      runtime: Date.now() - this.startTime,
      memory: memory ? {
        used: this._formatBytes(memory.usedJSHeapSize),
        total: this._formatBytes(memory.totalJSHeapSize),
        limit: this._formatBytes(memory.jsHeapSizeLimit),
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(1)
      } : null,
      fps: {
        current: fps[fps.length - 1] || 0,
        average: Math.round(averageFPS),
        min: Math.min(...fps),
        max: Math.max(...fps)
      },
      slowestComponents: this._getSlowestComponents(),
      slowestAPIs: this._getSlowestAPIs()
    };
  }

  /**
   * 获取最慢的组件
   */
  _getSlowestComponents() {
    const sorted = Array.from(this.metrics.componentTimes.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.average - a.average);

    return sorted.slice(0, 10);
  }

  /**
   * 获取最慢的 API
   */
  _getSlowestAPIs() {
    const sorted = Array.from(this.metrics.apiCalls.entries())
      .map(([url, data]) => ({ url, ...data }))
      .sort((a, b) => b.averageTime - a.averageTime);

    return sorted.slice(0, 10);
  }

  /**
   * 格式化字节数
   */
  _formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 获取优化建议
   */
  getOptimizationSuggestions() {
    const suggestions = [];
    const report = this.getReport();

    // 内存使用建议
    if (report.memory && report.memory.percentage > 80) {
      suggestions.push({
        type: 'memory',
        severity: 'high',
        message: '内存使用率过高，建议优化数据缓存策略'
      });
    }

    // FPS 建议
    if (report.fps.average < 30) {
      suggestions.push({
        type: 'fps',
        severity: 'high',
        message: '平均 FPS 过低，建议使用虚拟滚动和 memo 优化'
      });
    } else if (report.fps.average < 50) {
      suggestions.push({
        type: 'fps',
        severity: 'medium',
        message: 'FPS 可以进一步提升，建议检查不必要的状态更新'
      });
    }

    // 组件渲染建议
    const slowComponents = report.slowestComponents.slice(0, 5);
    slowComponents.forEach(component => {
      if (component.average > 50) {
        suggestions.push({
          type: 'render',
          severity: 'medium',
          message: `组件 ${component.name} 平均渲染时间 ${component.average.toFixed(0)}ms，建议使用 React.memo 优化`
        });
      }
    });

    // API 调用建议
    const slowAPIs = report.slowestAPIs.slice(0, 5);
    slowAPIs.forEach(api => {
      if (api.averageTime > 1000) {
        suggestions.push({
          type: 'api',
          severity: 'high',
          message: `API ${api.url} 平均响应时间 ${api.averageTime.toFixed(0)}ms，建议优化或添加缓存`
        });
      } else if (api.averageTime > 500) {
        suggestions.push({
          type: 'api',
          severity: 'medium',
          message: `API ${api.url} 平均响应时间 ${api.averageTime.toFixed(0)}ms，可以考虑优化`
        });
      }
    });

    return suggestions;
  }
}

/**
 * 导出单例
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * 便捷函数：测量函数执行时间
 */
export function measurePerformance(name, fn) {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      performanceMonitor.markRender(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.markRender(name, duration);
      throw error;
    }
  };
}

/**
 * React Hook：测量组件性能
 */
export function usePerformanceMeasure(componentName) {
  const renderCount = React.useRef(0);
  const lastRenderTime = React.useRef(0);

  React.useLayoutEffect(() => {
    const now = performance.now();
    const duration = now - lastRenderTime.current;

    if (lastRenderTime.current > 0) {
      performanceMonitor.markRender(componentName, duration);
    }

    renderCount.current++;
    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current
  };
}
