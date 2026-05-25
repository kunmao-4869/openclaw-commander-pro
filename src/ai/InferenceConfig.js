/**
 * 推理框架优化配置
 */

export const InferenceConfig = {
  // vLLM 配置
  vllm: {
    model: 'Qwen/Qwen2.5-7B-Instruct',
    maxModelLen: 262144,  // 256K 上下文
    tensorParallelSize: 1,  // 单卡
    gpuMemoryUtilization: 0.9,
    enableChunkedPrefill: true,
    maxNumBatchedTokens: 8192,
    enablePrefixCaching: true,
    enforceEager: false,  // 启用 CUDA Graph
    maxNumSeqs: 256,
    schedulerPolicy: 'fcfs',
    
    // API 配置
    host: 'localhost',
    port: 8000,
    apiEndpoint: '/v1/completions',
    
    // 性能优化
    continuousBatching: true,
    dynamicBatching: true,
    maxBatchSize: 32
  },
  
  // TensorRT-LLM 配置
  tensorrt: {
    model: 'Qwen/Qwen2.5-7B-Instruct',
    precision: 'fp16',  // fp16, int8, int4
    maxBatchSize: 32,
    maxInputLen: 4096,
    maxOutputLen: 2048,
    maxBeamWidth: 1,
    
    // 插件配置
    plugins: {
      gptAttentionPlugin: 'auto',
      contextFMHA: 1,
      pagedKvCache: 1,
      xqaPlugin: 1,
      gemmPlugin: 1
    },
    
    // 优化配置
    optLevel: 4,  // 0-4, 4 为最高优化
    enableCudaGraph: true,
    enablePagedKvCache: true
  },
  
  // SGLang 配置
  sglang: {
    model: 'Qwen/Qwen2.5-7B-Instruct',
    maxTotalTokens: 262144,
    contextLength: 262144,
    memFraction: 0.9,  // 内存分数
    tpSize: 1,
    
    // 调度配置
    schedulePolicy: 'fcfs',  // FCFS, LPM
    scheduleConservativeness: 1.0,
    
    // 优化配置
    enablePrefixCache: true,
    enableRadixCache: true,
    disableRadixCache: false
  },
  
  // 通用优化配置
  common: {
    // 批处理
    enableContinuousBatching: true,
    maxBatchSize: 32,
    dynamicBatching: true,
    maxInputLength: 4096,
    
    // 缓存
    enablePrefixCaching: true,
    enableKVCache: true,
    cacheSize: 1000,
    
    // 性能监控
    enableMetrics: true,
    logLevel: 'info',
    
    // 超时配置
    requestTimeout: 60000,  // 60 秒
    keepAliveTimeout: 30000  // 30 秒
  }
};

/**
 * 性能基准
 */
export const PerformanceBenchmarks = {
  // vLLM 性能（A100）
  vllm: {
    throughput: '150 tokens/s',
    latency: '50ms (P50)',
    memoryUsage: '14GB (7B model)',
    maxContext: '256K tokens'
  },
  
  // TensorRT-LLM 性能（A100）
  tensorrt: {
    throughput: '280 tokens/s',  // 10-16x 加速
    latency: '30ms (P50)',
    memoryUsage: '12GB (7B model, INT8)',
    maxContext: '128K tokens'
  },
  
  // SGLang 性能（A100）
  sglang: {
    throughput: '200 tokens/s',
    latency: '40ms (P50)',
    memoryUsage: '13GB (7B model)',
    maxContext: '256K tokens'
  }
};

/**
 * 推荐配置
 */
export const RecommendedConfigs = {
  // 单卡部署（RTX 4090 24GB）
  singleGPU: {
    framework: 'vllm',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    maxModelLen: 131072,  // 128K
    gpuMemoryUtilization: 0.95,
    tensorParallelSize: 1,
    expectedPerformance: '100 tokens/s'
  },
  
  // 双卡部署（2x RTX 3090）
  dualGPU: {
    framework: 'vllm',
    model: 'Qwen/Qwen2.5-14B-Instruct',
    maxModelLen: 262144,  // 256K
    gpuMemoryUtilization: 0.9,
    tensorParallelSize: 2,
    expectedPerformance: '80 tokens/s'
  },
  
  // 高性能部署（A100 80GB）
  highPerformance: {
    framework: 'tensorrt',
    model: 'Qwen/Qwen2.5-32B-Instruct',
    precision: 'fp16',
    maxModelLen: 262144,
    gpuMemoryUtilization: 0.95,
    tensorParallelSize: 1,
    expectedPerformance: '200 tokens/s'
  },
  
  // 长上下文场景
  longContext: {
    framework: 'sglang',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    maxModelLen: 262144,  // 256K
    enablePrefixCache: true,
    enableRadixCache: true,
    expectedPerformance: '150 tokens/s'
  }
};
