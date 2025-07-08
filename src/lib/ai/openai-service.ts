// src/lib/ai/openai-service.ts
import OpenAI from 'openai';
import type { 
  SummaryOptions, 
  SummaryResult, 
  AIModel, 
  AIError,
  ContentAnalysis,
  NamedEntity,
  SummaryMetadata,
  ContentPreprocessOptions
} from '@/types/ai';

export class OpenAIService {
  private client: OpenAI;
  private readonly models: Record<string, AIModel> = {
    'gpt-4o': {
      id: 'gpt-4o',
      name: 'GPT-4 Omni',
      provider: 'openai',
      maxTokens: 4096,
      contextWindow: 128000,
      supportedLanguages: ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar'],
      capabilities: ['summarization', 'extraction', 'translation', 'analysis', 'generation'],
      pricing: { input: 0.005, output: 0.015 }
    },
    'gpt-4o-mini': {
      id: 'gpt-4o-mini',
      name: 'GPT-4 Omni Mini',
      provider: 'openai',
      maxTokens: 16384,
      contextWindow: 128000,
      supportedLanguages: ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar'],
      capabilities: ['summarization', 'extraction', 'translation', 'analysis', 'generation'],
      pricing: { input: 0.00015, output: 0.0006 }
    },
    'gpt-4-turbo': {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      maxTokens: 4096,
      contextWindow: 128000,
      supportedLanguages: ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar'],
      capabilities: ['summarization', 'extraction', 'translation', 'analysis', 'generation'],
      pricing: { input: 0.01, output: 0.03 }
    }
  };

  private readonly defaultModel = 'gpt-4o-mini';
  private readonly maxContentLength = 100000; // 约100k字符

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API密钥未配置');
    }
    
    this.client = new OpenAI({ 
      apiKey,
      timeout: 60000, // 60秒超时
      maxRetries: 3
    });
  }

  async generateSummary(
    content: string, 
    options: SummaryOptions = {}
  ): Promise<SummaryResult> {
    const startTime = Date.now();

    try {
      // 预处理内容
      const processedContent = this.preprocessContent(content, {
        maxLength: this.maxContentLength,
        removeCode: true,
        preserveStructure: true
      });
      
      if (processedContent.length < 50) {
        throw this.createAIError('内容太短，无法生成有意义的摘要', 'CONTENT_TOO_LONG');
      }

      const {
        model = this.defaultModel,
        maxTokens = 2000,
        temperature = 0.3,
        summaryType = 'standard',
        language = 'auto',
        customPrompt,
        includeKeyPoints = true,
        includeAnalysis = false
      } = options;

      // 验证模型
      if (!this.models[model]) {
        throw this.createAIError(`不支持的模型: ${model}`, 'MODEL_NOT_AVAILABLE');
      }

      // 构建提示词
      const { systemPrompt, userPrompt } = this.buildPrompts(
        processedContent, 
        summaryType, 
        language, 
        customPrompt,
        includeKeyPoints,
        includeAnalysis
      );

      // 估算token使用量
      const estimatedTokens = this.estimateTokens(systemPrompt + userPrompt);
      if (estimatedTokens > this.models[model].contextWindow * 0.8) {
        throw this.createAIError('内容过长，超出模型上下文窗口', 'CONTENT_TOO_LONG');
      }

      // 调用OpenAI API
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        response_format: { type: 'text' }
      });

      const rawResponse = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
      const processingTime = Date.now() - startTime;

      if (!rawResponse) {
        throw this.createAIError('AI服务未返回有效响应', 'UNKNOWN_ERROR');
      }

      // 解析响应
      const parsedResult = this.parseAIResponse(rawResponse, includeKeyPoints, includeAnalysis);
      
      // 计算成本
      const cost = this.calculateCost(tokensUsed, model);

      // 构建元数据
      const metadata: SummaryMetadata = {
        model,
        provider: 'openai',
        tokensUsed: {
          input: tokensUsed.prompt_tokens,
          output: tokensUsed.completion_tokens,
          total: tokensUsed.total_tokens
        },
        processingTime,
        cost,
        language: this.detectLanguage(parsedResult.summary),
        confidence: this.calculateConfidence(parsedResult.summary, content),
        wordCount: {
          original: this.countWords(content),
          summary: this.countWords(parsedResult.summary),
          compressionRatio: this.countWords(parsedResult.summary) / this.countWords(content)
        },
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        summary: parsedResult.summary,
        keyPoints: parsedResult.keyPoints,
        insights: parsedResult.insights,
        analysis: parsedResult.analysis,
        metadata
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error && 'code' in error) {
        const aiError = error as AIError;
        return {
          success: false,
          summary: '',
          keyPoints: [],
          metadata: {
            model: options.model || this.defaultModel,
            provider: 'openai',
            tokensUsed: { input: 0, output: 0, total: 0 },
            processingTime,
            cost: 0,
            language: 'unknown',
            confidence: 0,
            wordCount: { original: 0, summary: 0, compressionRatio: 0 },
            timestamp: new Date().toISOString()
          },
          error: aiError.message
        };
      }

      throw this.handleOpenAIError(error);
    }
  }

  private preprocessContent(content: string, options: ContentPreprocessOptions): string {
    let processed = content.trim();

    // 限制长度
    if (options.maxLength && processed.length > options.maxLength) {
      // 智能截断，尽量在句子边界
      const truncated = processed.substring(0, options.maxLength);
      const lastSentenceEnd = Math.max(
        truncated.lastIndexOf('.'),
        truncated.lastIndexOf('!'),
        truncated.lastIndexOf('?'),
        truncated.lastIndexOf('。'),
        truncated.lastIndexOf('！'),
        truncated.lastIndexOf('？')
      );
      
      if (lastSentenceEnd > options.maxLength * 0.8) {
        processed = truncated.substring(0, lastSentenceEnd + 1);
      } else {
        processed = truncated + '...';
      }
    }

    // 移除代码块
    if (options.removeCode) {
      processed = processed.replace(/```[\s\S]*?```/g, '[代码块已移除]');
      processed = processed.replace(/`[^`]+`/g, '[代码已移除]');
    }

    // 移除链接
    if (options.removeLinks) {
      processed = processed.replace(/https?:\/\/[^\s]+/g, '[链接已移除]');
    }

    // 移除图片引用
    if (options.removeImages) {
      processed = processed.replace(/!\[.*?\]\(.*?\)/g, '[图片已移除]');
    }

    // 清理多余空白
    processed = processed.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n');

    return processed;
  }

  private buildPrompts(
    content: string, 
    summaryType: string, 
    language: string, 
    customPrompt?: string,
    includeKeyPoints?: boolean,
    includeAnalysis?: boolean
  ): { systemPrompt: string; userPrompt: string } {
    
    if (customPrompt) {
      return {
        systemPrompt: '你是一个专业的内容分析师，请按照用户的要求对内容进行处理。',
        userPrompt: `${customPrompt}\n\n内容：\n${content}`
      };
    }

    // 构建系统提示词
    let systemPrompt = '你是一个专业的内容摘要专家，能够准确理解和总结各种类型的文本内容。';

    // 根据摘要类型定制提示词
    const typePrompts = {
      brief: '请提供简洁的摘要，控制在1-2句话内，突出最核心的信息。',
      standard: '请提供标准的摘要，用一个段落总结主要内容和关键点。',
      detailed: '请提供详细的摘要，可以分多个段落，全面覆盖重要信息。',
      'bullet-points': '请以要点列表的形式总结内容，每个要点简洁明了。',
      'key-insights': '请重点提取内容中的关键洞察和重要发现。',
      executive: '请提供执行摘要，重点关注决策相关的信息和建议。',
      technical: '请提供技术摘要，重点关注技术细节、方法和实现。',
      academic: '请提供学术摘要，重点关注研究方法、发现和结论。'
    };

    systemPrompt += ' ' + (typePrompts[summaryType as keyof typeof typePrompts] || typePrompts.standard);

    // 语言设置
    const languagePrompts = {
      zh: '请用中文回复。',
      en: '请用英文回复。',
      auto: '请使用与原文相同的语言回复。'
    };

    systemPrompt += ' ' + (languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.auto);

    // 输出格式
    let outputFormat = '\n\n请按以下格式输出：\n\n摘要：\n[你的摘要内容]';

    if (includeKeyPoints) {
      outputFormat += '\n\n关键要点：\n- [要点1]\n- [要点2]\n- [要点3]';
    }

    if (includeAnalysis) {
      outputFormat += '\n\n内容分析：\n情感倾向：[positive/negative/neutral/mixed]\n主要话题：[话题1, 话题2, 话题3]\n复杂度：[simple/moderate/complex]';
    }

    systemPrompt += outputFormat;

    const userPrompt = `请分析并总结以下内容：\n\n${content}`;

    return { systemPrompt, userPrompt };
  }

  private parseAIResponse(
    response: string, 
    includeKeyPoints: boolean, 
    includeAnalysis: boolean
  ): {
    summary: string;
    keyPoints: string[];
    insights?: string[];
    analysis?: ContentAnalysis;
  } {
    
    const sections = response.split(/\n\n(?=摘要：|关键要点：|内容分析：)/);
    
    let summary = '';
    let keyPoints: string[] = [];
    let analysis: ContentAnalysis | undefined;

    for (const section of sections) {
      if (section.startsWith('摘要：')) {
        summary = section.replace('摘要：', '').trim();
      } else if (section.startsWith('关键要点：')) {
        const pointsText = section.replace('关键要点：', '').trim();
        keyPoints = pointsText
          .split('\n')
          .map(line => line.replace(/^-\s*/, '').trim())
          .filter(point => point.length > 0);
      } else if (section.startsWith('内容分析：') && includeAnalysis) {
        analysis = this.parseAnalysis(section);
      }
    }

    // 如果没有找到格式化的摘要，使用整个响应作为摘要
    if (!summary) {
      summary = response.trim();
    }

    // 如果需要关键要点但没有解析到，尝试从摘要中提取
    if (includeKeyPoints && keyPoints.length === 0) {
      keyPoints = this.extractKeyPointsFromSummary(summary);
    }

    return { summary, keyPoints, analysis };
  }

  private parseAnalysis(analysisText: string): ContentAnalysis {
    const lines = analysisText.split('\n');
    const analysis: ContentAnalysis = {
      sentiment: 'neutral',
      tone: [],
      topics: [],
      entities: [],
      complexity: 'moderate',
      readability: 50
    };

    for (const line of lines) {
      if (line.includes('情感倾向：')) {
        const sentiment = line.split('：')[1]?.trim().toLowerCase();
        if (['positive', 'negative', 'neutral', 'mixed'].includes(sentiment)) {
          analysis.sentiment = sentiment as any;
        }
      } else if (line.includes('主要话题：')) {
        const topics = line.split('：')[1]?.trim();
        if (topics) {
          analysis.topics = topics.split(/[,，]/).map(t => t.trim()).filter(t => t);
        }
      } else if (line.includes('复杂度：')) {
        const complexity = line.split('：')[1]?.trim().toLowerCase();
        if (['simple', 'moderate', 'complex'].includes(complexity)) {
          analysis.complexity = complexity as any;
        }
      }
    }

    return analysis;
  }

  private extractKeyPointsFromSummary(summary: string): string[] {
    // 简单的关键点提取逻辑
    const sentences = summary.split(/[.。!！?？]/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
    
    return sentences.slice(0, 5); // 最多5个关键点
  }

  private estimateTokens(text: string): number {
    // 粗略的token估算：英文约4字符1token，中文约1.5字符1token
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const otherChars = text.length - chineseChars;
    
    return Math.ceil(chineseChars / 1.5 + otherChars / 4);
  }

  private calculateCost(usage: any, model: string): number {
    const modelInfo = this.models[model];
    if (!modelInfo) return 0;
    
    const inputCost = (usage.prompt_tokens / 1000) * modelInfo.pricing.input;
    const outputCost = (usage.completion_tokens / 1000) * modelInfo.pricing.output;
    
    return inputCost + outputCost;
  }

  private detectLanguage(text: string): string {
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
  }

  private calculateConfidence(summary: string, originalContent: string): number {
    // 简单的置信度计算
    const summaryLength = summary.length;
    const originalLength = originalContent.length;
    const ratio = summaryLength / originalLength;
    
    // 理想的压缩比例在0.1-0.3之间
    if (ratio >= 0.1 && ratio <= 0.3) return 0.9;
    if (ratio >= 0.05 && ratio <= 0.5) return 0.7;
    return 0.5;
  }

  private countWords(text: string): number {
    const language = this.detectLanguage(text);
    
    if (['zh', 'ja', 'ko'].includes(language)) {
      // 中日韩文按字符计算
      return text.replace(/\s/g, '').length;
    } else {
      // 其他语言按词计算
      return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
  }

  private createAIError(message: string, code: string): AIError {
    const error = new Error(message) as AIError;
    error.code = code as any;
    error.provider = 'openai';
    error.retryable = ['NETWORK_ERROR', 'TIMEOUT', 'RATE_LIMITED'].includes(code);
    return error;
  }

  private handleOpenAIError(error: any): AIError {
    if (error.code === 'insufficient_quota') {
      return this.createAIError('API配额不足', 'INSUFFICIENT_QUOTA');
    }
    
    if (error.code === 'rate_limit_exceeded') {
      const aiError = this.createAIError('请求频率超限', 'RATE_LIMITED');
      aiError.rateLimited = true;
      return aiError;
    }
    
    if (error.code === 'invalid_api_key') {
      return this.createAIError('API密钥无效', 'INVALID_API_KEY');
    }
    
    if (error.code === 'model_not_found') {
      return this.createAIError('模型不可用', 'MODEL_NOT_AVAILABLE');
    }
    
    if (error.message?.includes('timeout')) {
      return this.createAIError('请求超时', 'TIMEOUT');
    }
    
    return this.createAIError(
      error.message || '未知错误', 
      'UNKNOWN_ERROR'
    );
  }

  // 获取可用模型
  getAvailableModels(): AIModel[] {
    return Object.values(this.models);
  }

  // 获取模型信息
  getModelInfo(modelId: string): AIModel | null {
    return this.models[modelId] || null;
  }

  // 估算成本
  estimateCost(content: string, options: SummaryOptions = {}): number {
    const model = options.model || this.defaultModel;
    const modelInfo = this.models[model];
    
    if (!modelInfo) return 0;
    
    const tokens = this.estimateTokens(content);
    const outputTokens = Math.min(options.maxTokens || 1000, tokens * 0.3);
    
    const inputCost = (tokens / 1000) * modelInfo.pricing.input;
    const outputCost = (outputTokens / 1000) * modelInfo.pricing.output;
    
    return inputCost + outputCost;
  }
}