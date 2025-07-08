// src/types/ai.ts
export interface AIProvider {
  name: string;
  models: string[];
  maxTokens: number;
  supportedLanguages: string[];
  pricing: {
    input: number; // per 1K tokens
    output: number; // per 1K tokens
  };
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  contextWindow: number;
  supportedLanguages: string[];
  capabilities: AICapability[];
  pricing: {
    input: number;
    output: number;
  };
}

export type AICapability = 'summarization' | 'extraction' | 'translation' | 'analysis' | 'generation';

export interface SummaryOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  summaryType?: SummaryType;
  language?: string;
  customPrompt?: string;
  includeKeyPoints?: boolean;
  includeAnalysis?: boolean;
  preserveFormatting?: boolean;
  focusAreas?: string[];
}

export type SummaryType = 
  | 'brief'           // 简短摘要 (1-2句)
  | 'standard'        // 标准摘要 (1段)
  | 'detailed'        // 详细摘要 (多段)
  | 'bullet-points'   // 要点列表
  | 'key-insights'    // 关键洞察
  | 'executive'       // 执行摘要
  | 'technical'       // 技术摘要
  | 'academic';       // 学术摘要

export interface SummaryResult {
  success: boolean;
  summary: string;
  keyPoints: string[];
  insights?: string[];
  analysis?: ContentAnalysis;
  metadata: SummaryMetadata;
  error?: string;
}

export interface ContentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  tone: string[];
  topics: string[];
  entities: NamedEntity[];
  complexity: 'simple' | 'moderate' | 'complex';
  readability: number; // 0-100 score
  bias?: 'left' | 'right' | 'center' | 'unknown';
}

export interface NamedEntity {
  text: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'product' | 'other';
  confidence: number;
}

export interface SummaryMetadata {
  model: string;
  provider: string;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  processingTime: number;
  cost: number;
  language: string;
  confidence: number;
  wordCount: {
    original: number;
    summary: number;
    compressionRatio: number;
  };
  timestamp: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  type: SummaryType;
  language: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: PromptVariable[];
  examples?: PromptExample[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description: string;
  required: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

export interface PromptExample {
  input: string;
  expectedOutput: string;
  context?: string;
}

export interface AIServiceConfig {
  defaultModel: string;
  fallbackModel: string;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  enableCaching: boolean;
  cacheTimeout: number;
  enableFallback: boolean;
  costLimits: {
    perRequest: number;
    perUser: number;
    perDay: number;
  };
}

export interface AIUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokensUsed: number;
  totalCost: number;
  averageProcessingTime: number;
  requestsByModel: Record<string, number>;
  errorsByType: Record<string, number>;
  costByModel: Record<string, number>;
  dailyUsage: Array<{
    date: string;
    requests: number;
    tokens: number;
    cost: number;
  }>;
}

export interface AIRequest {
  id: string;
  userId: string;
  content: string;
  options: SummaryOptions;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: SummaryResult;
  error?: string;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: string;
    model: string;
    tokensUsed: number;
    cost: number;
    processingTime: number;
  };
}

// 错误类型
export interface AIError extends Error {
  code: AIErrorCode;
  provider?: string;
  model?: string;
  tokensUsed?: number;
  retryable: boolean;
  rateLimited?: boolean;
}

export type AIErrorCode = 
  | 'INVALID_API_KEY'
  | 'RATE_LIMITED'
  | 'INSUFFICIENT_QUOTA'
  | 'MODEL_NOT_AVAILABLE'
  | 'CONTENT_TOO_LONG'
  | 'INVALID_REQUEST'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

// 提示词模板类型
export interface PromptLibrary {
  templates: Record<string, PromptTemplate>;
  categories: PromptCategory[];
  defaultTemplates: Record<SummaryType, string>;
}

export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  templates: string[];
}

// 内容预处理选项
export interface ContentPreprocessOptions {
  maxLength?: number;
  removeCode?: boolean;
  removeLinks?: boolean;
  removeImages?: boolean;
  preserveStructure?: boolean;
  extractTables?: boolean;
  extractQuotes?: boolean;
}

// AI服务健康状态
export interface AIServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  providers: Record<string, {
    available: boolean;
    latency: number;
    errorRate: number;
    lastChecked: string;
  }>;
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  activeRequests: number;
  queueSize: number;
}

// 批量处理
export interface BatchSummaryRequest {
  items: Array<{
    id: string;
    content: string;
    options?: SummaryOptions;
  }>;
  batchOptions?: {
    maxConcurrency?: number;
    preserveOrder?: boolean;
    continueOnError?: boolean;
  };
}

export interface BatchSummaryResult {
  results: Array<{
    id: string;
    success: boolean;
    result?: SummaryResult;
    error?: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    totalCost: number;
    totalTokens: number;
    processingTime: number;
  };
}

// 实时流式处理
export interface StreamingSummaryOptions extends SummaryOptions {
  onProgress?: (chunk: string, progress: number) => void;
  onMetadata?: (metadata: Partial<SummaryMetadata>) => void;
  onComplete?: (result: SummaryResult) => void;
  onError?: (error: AIError) => void;
}