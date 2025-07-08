// src/lib/ai/ai-service-manager.ts
import { OpenAIService } from './openai-service';
import { promptManager } from './prompt-manager';
import type { 
  SummaryOptions, 
  SummaryResult, 
  AIProvider,
  AIServiceConfig,
  AIUsageStats,
  AIRequest,
  AIResponse,
  AIError,
  AIServiceHealth,
  BatchSummaryRequest,
  BatchSummaryResult
} from '@/types/ai';

interface ProviderInstance {
  name: string;
  service: any;
  isAvailable: boolean;
  lastHealthCheck: Date;
  errorCount: number;
  totalRequests: number;
  successfulRequests: number;
}

export class AIServiceManager {
  private providers: Map<string, ProviderInstance> = new Map();
  private config: AIServiceConfig;
  private stats: AIUsageStats;
  private requestQueue: AIRequest[] = [];
  private activeRequests = new Map<string, AIRequest>();
  private rateLimiter = new Map<string, { count: number; resetTime: number }>();

  constructor(config?: Partial<AIServiceConfig>) {
    this.config = {
      defaultModel: 'gpt-4o-mini',
      fallbackModel: 'gpt-4o-mini',
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 60000,
      rateLimit: {
        requestsPerMinute: 60,
        tokensPerMinute: 100000
      },
      enableCaching: true,
      cacheTimeout: 300000, // 5分钟
      enableFallback: true,
      costLimits: {
        perRequest: 1.0,
        perUser: 10.0,
        perDay: 100.0
      },
      ...config
    };

    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      totalCost: 0,
      averageProcessingTime: 0,
      requestsByModel: {},
      errorsByType: {},
      costByModel: {},
      dailyUsage: []
    };

    this.initializeProviders();
  }

  private initializeProviders(): void {
    // 注册OpenAI提供商
    try {
      const openaiService = new OpenAIService();
      this.registerProvider('openai', openaiService);
    } catch (error) {
      console.warn('OpenAI服务初始化失败:', error);
    }

    // 未来可以在这里添加其他AI提供商
    // this.registerProvider('anthropic', new AnthropicService());
    // this.registerProvider('azure', new AzureOpenAIService());
  }

  private registerProvider(name: string, service: any): void {
    this.providers.set(name, {
      name,
      service,
      isAvailable: true,
      lastHealthCheck: new Date(),
      errorCount: 0,
      totalRequests: 0,
      successfulRequests: 0
    });
  }

  async generateSummary(
    content: string,
    options: SummaryOptions = {}
  ): Promise<SummaryResult> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // 创建请求对象
      const request: AIRequest = {
        id: requestId,
        userId: options.userId || 'anonymous',
        content,
        options,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      this.activeRequests.set(requestId, request);
      
      // 速率限制检查
      if (!this.checkRateLimit(request.userId)) {
        throw this.createAIError('请求频率超限', 'RATE_LIMITED');
      }

      // 成本限制检查
      const estimatedCost = await this.estimateCost(content, options);
      if (!this.checkCostLimits(request.userId, estimatedCost)) {
        throw this.createAIError('超出成本限制', 'INSUFFICIENT_QUOTA');
      }

      // 选择提供商和模型
      const { provider, model } = this.selectProvider(options);
      
      // 获取或构建提示词
      const prompts = await this.buildPrompts(content, options);
      
      // 更新请求状态
      request.status = 'processing';

      // 执行摘要生成
      const result = await this.executeWithRetry(
        provider,
        content,
        { ...options, model },
        this.config.maxRetries
      );

      // 更新统计
      this.updateStats(provider.name, model, result, startTime);
      
      // 清理活跃请求
      request.status = 'completed';
      request.result = result;
      this.activeRequests.delete(requestId);

      return result;

    } catch (error) {
      // 错误处理
      const aiError = error as AIError;
      this.recordError(aiError.code || 'UNKNOWN_ERROR');
      
      const request = this.activeRequests.get(requestId);
      if (request) {
        request.status = 'failed';
        request.error = aiError.message;
        this.activeRequests.delete(requestId);
      }

      // 返回错误结果
      return {
        success: false,
        summary: '',
        keyPoints: [],
        metadata: {
          model: options.model || this.config.defaultModel,
          provider: 'unknown',
          tokensUsed: { input: 0, output: 0, total: 0 },
          processingTime: Date.now() - startTime,
          cost: 0,
          language: 'unknown',
          confidence: 0,
          wordCount: { original: 0, summary: 0, compressionRatio: 0 },
          timestamp: new Date().toISOString()
        },
        error: aiError.message
      };
    }
  }

  // 批量处理摘要
  async generateBatchSummaries(
    request: BatchSummaryRequest
  ): Promise<BatchSummaryResult> {
    const startTime = Date.now();
    const results: BatchSummaryResult['results'] = [];
    const { maxConcurrency = 3, preserveOrder = true, continueOnError = true } = request.batchOptions || {};

    // 创建信号量控制并发
    const semaphore = new Semaphore(maxConcurrency);
    
    const tasks = request.items.map(async (item, index) => {
      return semaphore.acquire(async () => {
        try {
          const result = await this.generateSummary(item.content, item.options);
          return { 
            id: item.id, 
            success: result.success,
            result: result.success ? result : undefined,
            error: result.success ? undefined : result.error,
            index 
          };
        } catch (error) {
          return { 
            id: item.id, 
            success: false, 
            error: error instanceof Error ? error.message : '未知错误',
            index 
          };
        }
      });
    });

    const batchResults = await Promise.allSettled(tasks);
    
    // 处理结果
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          id: request.items[index].id,
          success: false,
          error: '批量处理失败: ' + result.reason,
          index
        });
      }
    });

    // 如果需要保持顺序
    if (preserveOrder) {
      results.sort((a, b) => (a.index || 0) - (b.index || 0));
    }

    // 计算摘要统计
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    const totalCost = results.reduce((sum, r) => sum + (r.result?.metadata.cost || 0), 0);
    const totalTokens = results.reduce((sum, r) => sum + (r.result?.metadata.tokensUsed.total || 0), 0);

    return {
      results: results.map(r => ({ id: r.id, success: r.success, result: r.result, error: r.error })),
      summary: {
        total: results.length,
        successful,
        failed,
        totalCost,
        totalTokens,
        processingTime: Date.now() - startTime
      }
    };
  }

  private async executeWithRetry(
    provider: ProviderInstance,
    content: string,
    options: SummaryOptions,
    maxRetries: number
  ): Promise<SummaryResult> {
    let lastError: AIError | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        provider.totalRequests++;
        const result = await provider.service.generateSummary(content, options);
        
        if (result.success) {
          provider.successfulRequests++;
          provider.errorCount = 0; // 重置错误计数
          return result;
        }
        
        lastError = this.createAIError(result.error || '生成失败', 'UNKNOWN_ERROR');
        
      } catch (error) {
        lastError = error as AIError;
        provider.errorCount++;
        
        // 如果是不可重试的错误，直接抛出
        if (!lastError.retryable) {
          break;
        }
        
        // 等待后重试
        if (attempt < maxRetries) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt));
        }
      }
    }
    
    // 标记提供商为不可用（如果错误太多）
    if (provider.errorCount >= 5) {
      provider.isAvailable = false;
    }
    
    throw lastError || this.createAIError('重试次数已达上限', 'UNKNOWN_ERROR');
  }

  private selectProvider(options: SummaryOptions): { provider: ProviderInstance; model: string } {
    const requestedModel = options.model || this.config.defaultModel;
    
    // 首先尝试找到支持请求模型的提供商
    for (const [name, provider] of this.providers) {
      if (provider.isAvailable && provider.service.getModelInfo?.(requestedModel)) {
        return { provider, model: requestedModel };
      }
    }
    
    // 如果没有找到，使用默认提供商和回退模型
    const defaultProvider = this.providers.get('openai');
    if (defaultProvider?.isAvailable) {
      return { provider: defaultProvider, model: this.config.fallbackModel };
    }
    
    throw this.createAIError('没有可用的AI提供商', 'MODEL_NOT_AVAILABLE');
  }

  private async buildPrompts(content: string, options: SummaryOptions): Promise<{
    systemPrompt: string;
    userPrompt: string;
  }> {
    if (options.customPrompt) {
      return {
        systemPrompt: '你是一个专业的内容分析师，请按照用户的要求对内容进行处理。',
        userPrompt: `${options.customPrompt}\n\n内容：\n${content}`
      };
    }

    // 使用提示词管理器
    const summaryType = options.summaryType || 'standard';
    const template = promptManager.getDefaultTemplate(summaryType);
    
    if (template) {
      const prompts = promptManager.buildPrompt(template.id, { content }, {
        language: options.language,
        includeExamples: false
      });
      
      if (prompts) {
        return prompts;
      }
    }

    // 回退到简单提示词
    return {
      systemPrompt: '你是一个专业的内容摘要专家，请生成准确、简洁的摘要。',
      userPrompt: `请为以下内容生成摘要：\n\n${content}`
    };
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const key = `rate_limit_${userId}`;
    const limit = this.rateLimiter.get(key);
    
    if (!limit || now > limit.resetTime) {
      this.rateLimiter.set(key, {
        count: 1,
        resetTime: now + 60000 // 1分钟
      });
      return true;
    }
    
    if (limit.count >= this.config.rateLimit.requestsPerMinute) {
      return false;
    }
    
    limit.count++;
    return true;
  }

  private async checkCostLimits(userId: string, estimatedCost: number): Promise<boolean> {
    // 单次请求成本检查
    if (estimatedCost > this.config.costLimits.perRequest) {
      return false;
    }
    
    // 这里可以添加用户每日/每月成本限制检查
    // 需要从数据库查询用户的使用历史
    
    return true;
  }

  private async estimateCost(content: string, options: SummaryOptions): Promise<number> {
    try {
      const provider = this.providers.get('openai');
      if (provider?.service.estimateCost) {
        return provider.service.estimateCost(content, options);
      }
    } catch (error) {
      console.warn('成本估算失败:', error);
    }
    
    return 0.01; // 默认估算
  }

  private updateStats(
    providerName: string, 
    model: string, 
    result: SummaryResult, 
    startTime: number
  ): void {
    this.stats.totalRequests++;
    
    if (result.success) {
      this.stats.successfulRequests++;
      this.stats.totalTokensUsed += result.metadata.tokensUsed.total;
      this.stats.totalCost += result.metadata.cost;
      
      // 按模型统计
      this.stats.requestsByModel[model] = (this.stats.requestsByModel[model] || 0) + 1;
      this.stats.costByModel[model] = (this.stats.costByModel[model] || 0) + result.metadata.cost;
    } else {
      this.stats.failedRequests++;
    }
    
    // 更新平均处理时间
    const processingTime = Date.now() - startTime;
    this.stats.averageProcessingTime = 
      (this.stats.averageProcessingTime * (this.stats.totalRequests - 1) + processingTime) / 
      this.stats.totalRequests;
  }

  private recordError(errorType: string): void {
    this.stats.errorsByType[errorType] = (this.stats.errorsByType[errorType] || 0) + 1;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createAIError(message: string, code: string): AIError {
    const error = new Error(message) as AIError;
    error.code = code as any;
    error.retryable = ['NETWORK_ERROR', 'TIMEOUT', 'RATE_LIMITED'].includes(code);
    return error;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 健康检查
  async healthCheck(): Promise<AIServiceHealth> {
    const providerHealth: AIServiceHealth['providers'] = {};
    
    for (const [name, provider] of this.providers) {
      const startTime = Date.now();
      let available = true;
      let latency = 0;
      
      try {
        // 简单的健康检查
        if (provider.service.healthCheck) {
          await provider.service.healthCheck();
        }
        latency = Date.now() - startTime;
      } catch (error) {
        available = false;
        latency = Date.now() - startTime;
      }
      
      const errorRate = provider.totalRequests > 0 
        ? (provider.totalRequests - provider.successfulRequests) / provider.totalRequests 
        : 0;
      
      providerHealth[name] = {
        available,
        latency,
        errorRate,
        lastChecked: new Date().toISOString()
      };
    }
    
    const successRate = this.stats.totalRequests > 0 
      ? this.stats.successfulRequests / this.stats.totalRequests 
      : 1;
    
    let status: AIServiceHealth['status'] = 'healthy';
    if (successRate < 0.5) {
      status = 'unhealthy';
    } else if (successRate < 0.8) {
      status = 'degraded';
    }
    
    return {
      status,
      providers: providerHealth,
      totalRequests: this.stats.totalRequests,
      successRate,
      averageLatency: this.stats.averageProcessingTime,
      activeRequests: this.activeRequests.size,
      queueSize: this.requestQueue.length
    };
  }

  // 获取统计信息
  getStats(): AIUsageStats {
    return { ...this.stats };
  }

  // 重置统计信息
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      totalCost: 0,
      averageProcessingTime: 0,
      requestsByModel: {},
      errorsByType: {},
      costByModel: {},
      dailyUsage: []
    };
  }

  // 更新配置
  updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // 获取配置
  getConfig(): AIServiceConfig {
    return { ...this.config };
  }

  // 获取可用的模型
  getAvailableModels(): string[] {
    const models = new Set<string>();
    
    for (const provider of this.providers.values()) {
      if (provider.isAvailable && provider.service.getAvailableModels) {
        const providerModels = provider.service.getAvailableModels();
        providerModels.forEach((model: any) => models.add(model.id));
      }
    }
    
    return Array.from(models);
  }
}

// 信号量类用于控制并发
class Semaphore {
  private permits: number;
  private waiting: Array<(value: any) => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire<T>(task: () => Promise<T>): Promise<T> {
    if (this.permits > 0) {
      this.permits--;
      try {
        return await task();
      } finally {
        this.release();
      }
    }

    return new Promise((resolve) => {
      this.waiting.push(async (release) => {
        try {
          const result = await task();
          resolve(result);
        } finally {
          release();
        }
      });
    });
  }

  private release(): void {
    if (this.waiting.length > 0) {
      const next = this.waiting.shift()!;
      next(() => this.release());
    } else {
      this.permits++;
    }
  }
}

// 导出单例实例
export const aiServiceManager = new AIServiceManager();