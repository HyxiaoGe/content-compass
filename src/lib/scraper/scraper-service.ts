// src/lib/scraper/scraper-service.ts
import { PuppeteerScraper } from './puppeteer-scraper';
import { ContentCleaner } from './content-cleaner';
import type { 
  ScrapingOptions, 
  ScrapingResult, 
  RateLimitInfo, 
  ScrapingStats,
  ScrapingConfig 
} from '@/types/scraper';

export class ScraperService {
  private scraper = new PuppeteerScraper();
  private contentCleaner = new ContentCleaner();
  private rateLimiter = new Map<string, RateLimitInfo>();
  private stats: ScrapingStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageProcessingTime: 0,
    totalProcessingTime: 0,
    requestsByDomain: {},
    errorsByType: {}
  };

  private config: ScrapingConfig = {
    maxConcurrentScrapes: 3,
    defaultTimeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    rateLimitDelay: 2000, // 同域名请求间隔
    enableScreenshots: false,
    enableCaching: false,
    cacheTimeout: 300000, // 5分钟
    userAgents: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ],
    blockedDomains: [
      'facebook.com',
      'twitter.com',
      'instagram.com',
      'tiktok.com',
      'doubleclick.net',
      'googleadservices.com'
    ],
    allowedDomains: [] // 空数组表示允许所有域名
  };

  private cache = new Map<string, { result: ScrapingResult; timestamp: number }>();
  private activeScrapes = new Set<string>();

  async scrapeURL(url: string, options: ScrapingOptions = {}): Promise<ScrapingResult> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    try {
      // URL 验证
      if (!this.isValidURL(url)) {
        this.recordError('INVALID_URL');
        return {
          success: false,
          error: '无效的URL格式'
        };
      }

      // 域名检查
      if (!this.isDomainAllowed(url)) {
        this.recordError('BLOCKED_DOMAIN');
        return {
          success: false,
          error: '该域名不被允许'
        };
      }

      // 检查缓存
      if (this.config.enableCaching) {
        const cached = this.getFromCache(url);
        if (cached) {
          this.stats.successfulRequests++;
          return cached;
        }
      }

      // 速率限制检查
      if (!this.checkRateLimit(url)) {
        this.recordError('RATE_LIMITED');
        return {
          success: false,
          error: '请求频率过高，请稍后再试'
        };
      }

      // 检查并发限制
      if (this.activeScrapes.size >= this.config.maxConcurrentScrapes) {
        this.recordError('CONCURRENT_LIMIT');
        return {
          success: false,
          error: '并发请求数量已达上限'
        };
      }

      // 标记活跃爬取
      this.activeScrapes.add(url);

      try {
        // 合并配置选项
        const mergedOptions: ScrapingOptions = {
          timeout: this.config.defaultTimeout,
          blockResources: ['font', 'media'],
          waitForNetworkIdle: true,
          ...options
        };

        // 执行爬取
        const result = await this.scraper.scrape(url, mergedOptions);

        if (result.success && result.data) {
          // 清理和处理内容
          const cleanedContent = this.contentCleaner.cleanContent(result.data.content);
          const language = this.contentCleaner.detectLanguage(cleanedContent);
          const readingTime = this.contentCleaner.calculateReadingTime(cleanedContent);
          const wordCount = this.contentCleaner.calculateWordCount(cleanedContent, language);

          // 提取关键信息
          const { summary, keywords } = this.contentCleaner.extractKeyInfo(cleanedContent);

          // 更新结果
          result.data = {
            ...result.data,
            cleanedContent,
            metadata: {
              ...result.data.metadata,
              language,
              readingTime,
              wordCount,
              keywords
            }
          };

          // 缓存结果
          if (this.config.enableCaching) {
            this.setCache(url, result);
          }

          this.stats.successfulRequests++;
          this.recordDomainRequest(url);
        } else {
          this.stats.failedRequests++;
          this.recordError('SCRAPING_FAILED');
        }

        return result;

      } finally {
        // 移除活跃爬取标记
        this.activeScrapes.delete(url);
      }

    } catch (error) {
      this.stats.failedRequests++;
      this.recordError('UNKNOWN_ERROR');
      
      const processingTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        processingTime
      };
    } finally {
      // 更新统计信息
      const processingTime = Date.now() - startTime;
      this.updateStats(processingTime);
    }
  }

  // 批量爬取
  async scrapeMultipleURLs(
    urls: string[], 
    options: ScrapingOptions = {}
  ): Promise<{ url: string; result: ScrapingResult }[]> {
    const results: { url: string; result: ScrapingResult }[] = [];
    const semaphore = new Semaphore(this.config.maxConcurrentScrapes);

    const tasks = urls.map(async (url) => {
      return semaphore.acquire(async () => {
        const result = await this.scrapeURL(url, options);
        return { url, result };
      });
    });

    const batchResults = await Promise.allSettled(tasks);

    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          url: urls[index],
          result: {
            success: false,
            error: '批量处理失败: ' + result.reason
          }
        });
      }
    });

    return results;
  }

  private isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  private isDomainAllowed(url: string): boolean {
    try {
      const domain = new URL(url).hostname;
      
      // 检查被阻止的域名
      if (this.config.blockedDomains.some(blocked => domain.includes(blocked))) {
        return false;
      }

      // 检查允许的域名（如果配置了）
      if (this.config.allowedDomains.length > 0) {
        return this.config.allowedDomains.some(allowed => domain.includes(allowed));
      }

      return true;
    } catch {
      return false;
    }
  }

  private checkRateLimit(url: string): boolean {
    try {
      const domain = new URL(url).hostname;
      const now = Date.now();
      const rateLimit = this.rateLimiter.get(domain);

      if (!rateLimit) {
        this.rateLimiter.set(domain, {
          domain,
          lastRequest: now,
          requestCount: 1,
          resetTime: now + 60000 // 1分钟重置
        });
        return true;
      }

      // 检查重置时间
      if (now > rateLimit.resetTime) {
        rateLimit.requestCount = 1;
        rateLimit.resetTime = now + 60000;
        rateLimit.lastRequest = now;
        return true;
      }

      // 检查间隔时间
      if (now - rateLimit.lastRequest < this.config.rateLimitDelay) {
        return false;
      }

      // 检查请求频率（每分钟最多30次）
      if (rateLimit.requestCount >= 30) {
        return false;
      }

      rateLimit.lastRequest = now;
      rateLimit.requestCount++;
      return true;
    } catch {
      return false;
    }
  }

  private getFromCache(url: string): ScrapingResult | null {
    const cached = this.cache.get(url);
    
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      return { ...cached.result }; // 返回副本
    }

    if (cached) {
      this.cache.delete(url); // 清除过期缓存
    }

    return null;
  }

  private setCache(url: string, result: ScrapingResult): void {
    this.cache.set(url, {
      result: { ...result }, // 存储副本
      timestamp: Date.now()
    });

    // 限制缓存大小
    if (this.cache.size > 1000) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  private recordError(errorType: string): void {
    this.stats.errorsByType[errorType] = (this.stats.errorsByType[errorType] || 0) + 1;
  }

  private recordDomainRequest(url: string): void {
    try {
      const domain = new URL(url).hostname;
      this.stats.requestsByDomain[domain] = (this.stats.requestsByDomain[domain] || 0) + 1;
    } catch {
      // 忽略URL解析错误
    }
  }

  private updateStats(processingTime: number): void {
    this.stats.totalProcessingTime += processingTime;
    this.stats.averageProcessingTime = this.stats.totalProcessingTime / this.stats.totalRequests;
  }

  // 获取统计信息
  getStats(): ScrapingStats {
    return { ...this.stats };
  }

  // 重置统计信息
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageProcessingTime: 0,
      totalProcessingTime: 0,
      requestsByDomain: {},
      errorsByType: {}
    };
  }

  // 清除缓存
  clearCache(): void {
    this.cache.clear();
  }

  // 更新配置
  updateConfig(newConfig: Partial<ScrapingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // 获取配置
  getConfig(): ScrapingConfig {
    return { ...this.config };
  }

  // 健康检查
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    browser: boolean;
    activeScrapes: number;
    cacheSize: number;
    stats: ScrapingStats;
  }> {
    const browserStatus = this.scraper.getBrowserStatus();
    const activeScrapes = this.activeScrapes.size;
    const cacheSize = this.cache.size;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (!browserStatus.initialized || !browserStatus.isConnected) {
      status = 'unhealthy';
    } else if (activeScrapes >= this.config.maxConcurrentScrapes * 0.8) {
      status = 'degraded';
    }

    return {
      status,
      browser: browserStatus.initialized && browserStatus.isConnected,
      activeScrapes,
      cacheSize,
      stats: this.getStats()
    };
  }

  // 关闭服务
  async close(): Promise<void> {
    await this.scraper.close();
    this.clearCache();
    this.rateLimiter.clear();
    this.activeScrapes.clear();
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
export const scraperService = new ScraperService();