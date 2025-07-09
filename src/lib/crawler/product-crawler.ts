import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database-v2';
import { ContentAnalyzer } from '../ai/content-analyzer';

/**
 * 产品更新爬取器
 * 
 * 功能：
 * 1. 从各AI产品官网爬取最新更新信息
 * 2. 使用AI分析内容，提取关键信息
 * 3. 将结构化数据存储到数据库
 */

interface CrawlConfig {
  name: string;
  homepage: string;
  changelogUrl?: string;
  blogUrl?: string;
  rssUrl?: string;
  selectors: {
    title?: string;
    content?: string;
    date?: string;
    version?: string;
  };
  userAgent?: string;
  rateLimit?: number; // 请求间隔（毫秒）
}

interface RawUpdate {
  title: string;
  content: string;
  url: string;
  publishDate?: Date;
  version?: string;
  source: 'changelog' | 'blog' | 'rss';
}

interface ProcessedUpdate {
  title: string;
  summary: string;
  keyPoints: string[];
  importance: 'high' | 'medium' | 'low';
  tags: string[];
  version?: string;
  publishDate: Date;
  originalUrl: string;
  confidence: number;
}

export class ProductCrawler {
  private supabase;
  private contentAnalyzer: ContentAnalyzer;

  constructor() {
    // 初始化Supabase客户端
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // 初始化AI内容分析器
    this.contentAnalyzer = new ContentAnalyzer();
  }

  /**
   * 爬取单个产品的更新信息
   */
  async crawlProduct(productSlug: string): Promise<{
    success: boolean;
    updatesFound: number;
    newUpdates: number;
    error?: string;
  }> {
    try {
      console.log(`🔍 开始爬取产品: ${productSlug}`);

      // 1. 获取产品配置
      const { data: product, error: productError } = await this.supabase
        .from('ai_products')
        .select('*')
        .eq('slug', productSlug)
        .eq('is_active', true)
        .single();

      if (productError || !product) {
        throw new Error(`产品不存在或未启用: ${productSlug}`);
      }

      // 2. 构建爬取配置
      const config = this.buildCrawlConfig(product);
      
      // 3. 执行爬取
      const rawUpdates = await this.fetchUpdates(config);
      console.log(`📄 发现 ${rawUpdates.length} 条原始更新`);

      // 4. 过滤新内容
      const newUpdates = await this.filterNewUpdates(product.id, rawUpdates);
      console.log(`🆕 其中 ${newUpdates.length} 条为新内容`);

      if (newUpdates.length === 0) {
        return {
          success: true,
          updatesFound: rawUpdates.length,
          newUpdates: 0
        };
      }

      // 5. AI处理内容
      const processedUpdates = await this.processUpdatesWithAI(newUpdates, product.name);
      console.log(`🤖 AI处理完成 ${processedUpdates.length} 条更新`);

      // 6. 存储到数据库
      const savedCount = await this.saveUpdates(product.id, processedUpdates);
      console.log(`💾 已保存 ${savedCount} 条更新到数据库`);

      // 7. 更新产品状态
      await this.updateProductCrawlStatus(product.id, 'success');

      return {
        success: true,
        updatesFound: rawUpdates.length,
        newUpdates: savedCount
      };

    } catch (error) {
      console.error(`❌ 爬取产品 ${productSlug} 失败:`, error);
      
      // 更新错误状态
      try {
        const { data: product } = await this.supabase
          .from('ai_products')
          .select('id')
          .eq('slug', productSlug)
          .single();
          
        if (product) {
          await this.updateProductCrawlStatus(
            product.id, 
            'error', 
            error instanceof Error ? error.message : '未知错误'
          );
        }
      } catch (updateError) {
        console.error('更新错误状态失败:', updateError);
      }

      return {
        success: false,
        updatesFound: 0,
        newUpdates: 0,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 构建爬取配置
   */
  private buildCrawlConfig(product: any): CrawlConfig {
    // 基础配置
    const config: CrawlConfig = {
      name: product.name,
      homepage: product.homepage_url,
      selectors: {},
      userAgent: 'Mozilla/5.0 (compatible; ContentCompass/1.0; +https://content-compass.netlify.app)',
      rateLimit: 2000 // 2秒间隔
    };

    // 根据产品定制配置
    switch (product.slug) {
      case 'openai':
        config.blogUrl = 'https://openai.com/blog';
        config.selectors = {
          title: 'h2 a',
          content: '.post-excerpt',
          date: '.post-date'
        };
        break;
        
      case 'github-copilot':
        config.changelogUrl = 'https://github.com/github/copilot-docs/releases';
        config.selectors = {
          title: '.release-title a',
          content: '.markdown-body',
          date: 'relative-time',
          version: '.tag-name'
        };
        break;
        
      case 'cursor':
        config.changelogUrl = 'https://cursor.sh/changelog';
        config.selectors = {
          title: '.changelog-title',
          content: '.changelog-content',
          date: '.changelog-date',
          version: '.version-tag'
        };
        break;
        
      case 'claude':
        config.blogUrl = 'https://www.anthropic.com/news';
        config.selectors = {
          title: '.news-title a',
          content: '.news-excerpt',
          date: '.news-date'
        };
        break;
        
      default:
        // 使用通用配置
        config.changelogUrl = product.changelog_url;
        break;
    }

    return config;
  }

  /**
   * 获取更新信息（暂时返回模拟数据）
   */
  private async fetchUpdates(config: CrawlConfig): Promise<RawUpdate[]> {
    // TODO: 实现真实的网页爬取逻辑
    // 这里先返回模拟数据用于测试
    
    const mockUpdates: RawUpdate[] = [
      {
        title: `${config.name} 最新功能更新`,
        content: `${config.name} 发布了重要更新，包含多项新功能和性能改进...`,
        url: config.changelogUrl || config.blogUrl || config.homepage,
        publishDate: new Date(),
        source: 'changelog'
      }
    ];

    return mockUpdates;
  }

  /**
   * 过滤新内容（检查是否已存在）
   */
  private async filterNewUpdates(productId: string, updates: RawUpdate[]): Promise<RawUpdate[]> {
    const newUpdates: RawUpdate[] = [];

    for (const update of updates) {
      // 生成内容哈希
      const contentHash = this.generateContentHash(update.title + update.content);
      
      // 检查是否已存在
      const { data: existing } = await this.supabase
        .from('product_updates')
        .select('id')
        .eq('product_id', productId)
        .eq('content_hash', contentHash)
        .single();

      if (!existing) {
        newUpdates.push(update);
      }
    }

    return newUpdates;
  }

  /**
   * 使用AI处理更新内容
   */
  private async processUpdatesWithAI(updates: RawUpdate[], productName: string): Promise<ProcessedUpdate[]> {
    const processed: ProcessedUpdate[] = [];

    console.log(`🤖 开始AI分析 ${updates.length} 条更新`);

    for (const update of updates) {
      try {
        // 调用AI内容分析器
        const analysisResult = await this.contentAnalyzer.analyzeContent({
          title: update.title,
          content: update.content,
          url: update.url,
          publishDate: update.publishDate,
          productName
        });

        const processedUpdate: ProcessedUpdate = {
          title: analysisResult.title,
          summary: analysisResult.summary,
          keyPoints: analysisResult.keyPoints,
          importance: analysisResult.importance,
          tags: analysisResult.tags,
          version: update.version,
          publishDate: update.publishDate || new Date(),
          originalUrl: update.url,
          confidence: analysisResult.confidence
        };

        processed.push(processedUpdate);
        
        console.log(`✅ AI分析完成: ${update.title} (置信度: ${analysisResult.confidence})`);
        
      } catch (error) {
        console.error(`❌ AI分析失败: ${update.title}`, error);
        
        // 使用降级处理
        const fallbackUpdate: ProcessedUpdate = {
          title: update.title,
          summary: update.content.length > 200 ? update.content.substring(0, 200) + '...' : update.content,
          keyPoints: ['产品功能更新'],
          importance: 'medium',
          tags: ['更新'],
          version: update.version,
          publishDate: update.publishDate || new Date(),
          originalUrl: update.url,
          confidence: 0.3
        };
        
        processed.push(fallbackUpdate);
      }
    }

    return processed;
  }

  /**
   * 保存更新到数据库
   */
  private async saveUpdates(productId: string, updates: ProcessedUpdate[]): Promise<number> {
    let savedCount = 0;

    for (const update of updates) {
      try {
        const { error } = await this.supabase
          .from('product_updates')
          .insert({
            product_id: productId,
            title: update.title,
            summary: update.summary,
            key_points: update.keyPoints,
            importance_level: update.importance,
            tags: update.tags,
            version_number: update.version,
            original_url: update.originalUrl,
            published_at: update.publishDate.toISOString(),
            status: 'published',
            content_hash: this.generateContentHash(update.title + update.summary),
            confidence_score: update.confidence,
            ai_model_used: 'gpt-4',
            scraped_at: new Date().toISOString(),
            processed_at: new Date().toISOString()
          });

        if (!error) {
          savedCount++;
        } else {
          console.error('保存更新失败:', error);
        }
      } catch (error) {
        console.error('保存更新异常:', error);
      }
    }

    return savedCount;
  }

  /**
   * 更新产品爬取状态
   */
  private async updateProductCrawlStatus(
    productId: string, 
    status: 'success' | 'error', 
    error?: string
  ): Promise<void> {
    await this.supabase
      .from('ai_products')
      .update({
        last_crawled_at: new Date().toISOString(),
        crawl_status: status,
        crawl_error: error || null
      })
      .eq('id', productId);
  }

  /**
   * 生成内容哈希
   */
  private generateContentHash(content: string): string {
    // 简单的哈希函数，生产环境应使用更强的哈希算法
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }
}