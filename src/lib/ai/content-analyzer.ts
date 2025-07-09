/**
 * AI内容分析服务
 * 
 * 使用OpenAI API分析爬取的内容，提取关键信息：
 * - 生成摘要
 * - 提取关键要点
 * - 判断重要程度
 * - 生成标签
 */

interface AnalysisResult {
  title: string;
  summary: string;
  keyPoints: string[];
  importance: 'high' | 'medium' | 'low';
  tags: string[];
  confidence: number;
  tokensUsed: number;
}

interface ContentInput {
  title: string;
  content: string;
  url?: string;
  publishDate?: Date;
  productName: string;
}

export class ContentAnalyzer {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY!;
    
    if (!this.apiKey) {
      throw new Error('OpenAI API密钥未设置');
    }
  }

  /**
   * 分析单条内容
   */
  async analyzeContent(input: ContentInput): Promise<AnalysisResult> {
    try {
      console.log(`🤖 开始分析内容: ${input.title}`);

      const prompt = this.buildAnalysisPrompt(input);
      const response = await this.callOpenAI(prompt);
      
      return this.parseAnalysisResponse(response, input);
      
    } catch (error) {
      console.error('AI内容分析失败:', error);
      
      // 返回降级结果
      return this.getFallbackAnalysis(input);
    }
  }

  /**
   * 批量分析内容
   */
  async analyzeMultipleContents(inputs: ContentInput[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    
    for (const input of inputs) {
      try {
        const result = await this.analyzeContent(input);
        results.push(result);
        
        // 添加延迟避免API限制
        await this.delay(1000);
        
      } catch (error) {
        console.error(`分析失败: ${input.title}`, error);
        results.push(this.getFallbackAnalysis(input));
      }
    }
    
    return results;
  }

  /**
   * 构建分析提示词
   */
  private buildAnalysisPrompt(input: ContentInput): string {
    return `
请分析以下${input.productName}产品的更新内容，并按照JSON格式返回结构化信息：

**标题**: ${input.title}
**内容**: ${input.content}
**发布日期**: ${input.publishDate?.toISOString() || '未知'}
**来源**: ${input.url || '未知'}

请提供以下信息：
1. **优化后的标题** - 简洁明了，突出核心更新
2. **摘要** - 150-250字的中文摘要，突出重点
3. **关键要点** - 3-6个要点，每个20-40字
4. **重要程度** - high/medium/low（根据对用户影响程度）
5. **标签** - 3-5个相关标签
6. **置信度** - 分析结果的可信度(0-1)

请严格按照以下JSON格式返回，不要包含其他文字：

{
  "title": "优化后的标题",
  "summary": "详细摘要内容...",
  "keyPoints": [
    "关键要点1",
    "关键要点2",
    "关键要点3"
  ],
  "importance": "high|medium|low",
  "tags": ["标签1", "标签2", "标签3"],
  "confidence": 0.85
}
`;
  }

  /**
   * 调用OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 使用成本较低的模型
        messages: [
          {
            role: 'system',
            content: '你是一个专业的AI产品信息分析师，擅长分析技术产品更新并提取关键信息。请始终用中文回复，并严格按照要求的JSON格式返回结果。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // 降低随机性，提高一致性
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API请求失败: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  /**
   * 解析AI响应结果
   */
  private parseAnalysisResponse(response: any, input: ContentInput): AnalysisResult {
    try {
      const choice = response.choices?.[0];
      if (!choice) {
        throw new Error('AI响应格式异常');
      }

      const content = choice.message?.content;
      if (!content) {
        throw new Error('AI响应内容为空');
      }

      const parsed = JSON.parse(content);
      
      // 验证必需字段
      const required = ['title', 'summary', 'keyPoints', 'importance', 'tags', 'confidence'];
      for (const field of required) {
        if (!(field in parsed)) {
          throw new Error(`缺少必需字段: ${field}`);
        }
      }

      return {
        title: parsed.title || input.title,
        summary: parsed.summary,
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        importance: ['high', 'medium', 'low'].includes(parsed.importance) 
          ? parsed.importance 
          : 'medium',
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        confidence: typeof parsed.confidence === 'number' 
          ? Math.min(Math.max(parsed.confidence, 0), 1) 
          : 0.5,
        tokensUsed: response.usage?.total_tokens || 0
      };

    } catch (error) {
      console.error('解析AI响应失败:', error);
      throw new Error(`AI响应解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取降级分析结果（当AI分析失败时使用）
   */
  private getFallbackAnalysis(input: ContentInput): AnalysisResult {
    // 基于规则的简单分析
    const title = input.title;
    const content = input.content;
    
    // 简单的重要性判断
    const highImportanceKeywords = ['重大', '重要', '突破', '发布', '新功能', '升级'];
    const hasHighKeywords = highImportanceKeywords.some(keyword => 
      title.includes(keyword) || content.includes(keyword)
    );

    // 提取简单的关键要点
    const sentences = content.split(/[。！？.]/).filter(s => s.trim().length > 10);
    const keyPoints = sentences.slice(0, 3).map(s => s.trim().substring(0, 40) + '...');

    // 生成简单标签
    const commonTags = ['产品更新', '功能改进', '版本发布'];
    
    return {
      title: title,
      summary: content.length > 200 ? content.substring(0, 200) + '...' : content,
      keyPoints: keyPoints.length > 0 ? keyPoints : ['产品功能更新'],
      importance: hasHighKeywords ? 'high' : 'medium',
      tags: commonTags,
      confidence: 0.3, // 降级结果置信度较低
      tokensUsed: 0
    };
  }

  /**
   * 延迟工具函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 估算内容分析成本
   */
  estimateCost(contents: ContentInput[]): {
    estimatedTokens: number;
    estimatedCostUSD: number;
  } {
    // 粗略估算：平均每条内容消耗800 tokens
    const avgTokensPerContent = 800;
    const estimatedTokens = contents.length * avgTokensPerContent;
    
    // GPT-4o-mini 定价: $0.00015 per 1K input tokens, $0.0006 per 1K output tokens
    // 假设输入:输出 = 3:1
    const inputTokens = estimatedTokens * 0.75;
    const outputTokens = estimatedTokens * 0.25;
    const estimatedCostUSD = (inputTokens / 1000 * 0.00015) + (outputTokens / 1000 * 0.0006);

    return {
      estimatedTokens,
      estimatedCostUSD: Math.round(estimatedCostUSD * 10000) / 10000 // 保留4位小数
    };
  }
}