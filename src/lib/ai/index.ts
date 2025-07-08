// src/lib/ai/index.ts
// 统一导出AI服务相关的所有模块

// 核心服务
export { OpenAIService } from './openai-service';
export { AIServiceManager, aiServiceManager } from './ai-service-manager';
export { PromptManager, promptManager } from './prompt-manager';

// 测试工具
export { AITester, aiTester, quickAITest } from './ai-test';

// 类型定义
export type {
  AIProvider,
  AIModel,
  AICapability,
  SummaryOptions,
  SummaryType,
  SummaryResult,
  ContentAnalysis,
  NamedEntity,
  SummaryMetadata,
  PromptTemplate,
  PromptVariable,
  PromptExample,
  AIServiceConfig,
  AIUsageStats,
  AIRequest,
  AIResponse,
  AIError,
  AIErrorCode,
  PromptLibrary,
  PromptCategory,
  ContentPreprocessOptions,
  AIServiceHealth,
  BatchSummaryRequest,
  BatchSummaryResult,
  StreamingSummaryOptions
} from '@/types/ai';

// 工具函数
export const AIUtils = {
  // 验证AI配置
  validateConfig: (config: any): boolean => {
    return !!(
      config &&
      typeof config === 'object' &&
      config.defaultModel &&
      config.maxRetries &&
      config.timeout
    );
  },

  // 估算token数量
  estimateTokens: (text: string): number => {
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars / 1.5 + otherChars / 4);
  },

  // 检测文本语言
  detectLanguage: (text: string): string => {
    const chinesePattern = /[\u4e00-\u9fff]/;
    const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/;
    const koreanPattern = /[\uac00-\ud7af]/;
    const arabicPattern = /[\u0600-\u06ff]/;
    const russianPattern = /[\u0400-\u04ff]/;

    if (chinesePattern.test(text)) return 'zh';
    if (japanesePattern.test(text)) return 'ja';
    if (koreanPattern.test(text)) return 'ko';
    if (arabicPattern.test(text)) return 'ar';
    if (russianPattern.test(text)) return 'ru';
    
    return 'en';
  },

  // 计算文本复杂度
  calculateComplexity: (text: string): 'simple' | 'moderate' | 'complex' => {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?。！？]+/).length;
    const averageWordsPerSentence = words / sentences;
    
    if (averageWordsPerSentence < 10) return 'simple';
    if (averageWordsPerSentence < 20) return 'moderate';
    return 'complex';
  },

  // 格式化成本
  formatCost: (cost: number): string => {
    if (cost < 0.01) return `$${(cost * 1000).toFixed(2)}k`;
    return `$${cost.toFixed(4)}`;
  },

  // 格式化token数量
  formatTokens: (tokens: number): string => {
    if (tokens < 1000) return `${tokens}`;
    if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
    return `${(tokens / 1000000).toFixed(1)}M`;
  },

  // 验证摘要质量
  validateSummaryQuality: (summary: string, originalText: string): {
    score: number;
    issues: string[];
  } => {
    const issues: string[] = [];
    let score = 100;

    // 检查长度
    const summaryLength = summary.length;
    const originalLength = originalText.length;
    const compressionRatio = summaryLength / originalLength;

    if (compressionRatio > 0.5) {
      issues.push('摘要过长，压缩比不足');
      score -= 20;
    }

    if (compressionRatio < 0.05) {
      issues.push('摘要过短，可能丢失重要信息');
      score -= 15;
    }

    // 检查内容质量
    if (summary.length < 20) {
      issues.push('摘要内容过短');
      score -= 30;
    }

    if (!summary.includes('。') && !summary.includes('.')) {
      issues.push('摘要缺少句子结构');
      score -= 10;
    }

    // 检查重复内容
    const words = summary.split(/\s+/);
    const uniqueWords = new Set(words);
    const repetitionRatio = 1 - (uniqueWords.size / words.length);
    
    if (repetitionRatio > 0.3) {
      issues.push('摘要包含过多重复内容');
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      issues
    };
  }
};

// 常量定义
export const AI_CONSTANTS = {
  // 默认配置
  DEFAULT_CONFIG: {
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
    cacheTimeout: 300000,
    enableFallback: true,
    costLimits: {
      perRequest: 1.0,
      perUser: 10.0,
      perDay: 100.0
    }
  },

  // 支持的模型
  SUPPORTED_MODELS: [
    'gpt-4o',
    'gpt-4o-mini', 
    'gpt-4-turbo'
  ],

  // 支持的语言
  SUPPORTED_LANGUAGES: [
    'zh', 'en', 'ja', 'ko', 'ar', 'ru', 'es', 'fr', 'de', 'it', 'pt'
  ],

  // 摘要类型
  SUMMARY_TYPES: [
    'brief',
    'standard', 
    'detailed',
    'bullet-points',
    'key-insights',
    'executive',
    'technical',
    'academic'
  ],

  // 错误代码
  ERROR_CODES: {
    INVALID_API_KEY: 'API密钥无效',
    RATE_LIMITED: '请求频率超限',
    INSUFFICIENT_QUOTA: 'API配额不足',
    MODEL_NOT_AVAILABLE: '模型不可用',
    CONTENT_TOO_LONG: '内容过长',
    INVALID_REQUEST: '无效请求',
    NETWORK_ERROR: '网络错误',
    TIMEOUT: '请求超时',
    UNKNOWN_ERROR: '未知错误'
  },

  // 质量阈值
  QUALITY_THRESHOLDS: {
    MIN_SUMMARY_LENGTH: 20,
    MAX_COMPRESSION_RATIO: 0.5,
    MIN_COMPRESSION_RATIO: 0.05,
    MAX_REPETITION_RATIO: 0.3,
    MIN_CONFIDENCE_SCORE: 0.5
  }
} as const;

// 助手函数
export const createAIError = (message: string, code: string): Error => {
  const error = new Error(message) as any;
  error.code = code;
  error.retryable = ['NETWORK_ERROR', 'TIMEOUT', 'RATE_LIMITED'].includes(code);
  return error;
};

export const isAIError = (error: any): error is any => {
  return error && typeof error.code === 'string' && typeof error.retryable === 'boolean';
};