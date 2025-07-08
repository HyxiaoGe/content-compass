// src/lib/scraper/index.ts
// 统一导出爬取服务相关的所有模块

// 核心服务
export { PuppeteerScraper } from './puppeteer-scraper';
export { ContentCleaner } from './content-cleaner';
export { ScraperService, scraperService } from './scraper-service';

// 测试工具
export { ScraperTester, scraperTester, quickTest } from './scraper-test';

// 类型定义
export type {
  ScrapingOptions,
  ScrapingResult,
  ContentMetadata,
  ScrapingConfig,
  RateLimitInfo,
  ScrapingStats,
  ScrapingError,
  SitePattern
} from '@/types/scraper';

// 预定义的网站模式
export { SITE_PATTERNS } from '@/types/scraper';

// 工具函数
export const ScraperUtils = {
  // 验证URL
  isValidURL: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  // 提取域名
  extractDomain: (url: string): string | null => {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  },

  // 标准化URL
  normalizeURL: (url: string): string => {
    try {
      const urlObj = new URL(url);
      // 移除fragment和某些参数
      urlObj.hash = '';
      // 可以在这里添加更多标准化逻辑
      return urlObj.toString();
    } catch {
      return url;
    }
  },

  // 检查是否为图片URL
  isImageURL: (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    try {
      const pathname = new URL(url).pathname.toLowerCase();
      return imageExtensions.some(ext => pathname.endsWith(ext));
    } catch {
      return false;
    }
  },

  // 检查是否为PDF URL
  isPDFURL: (url: string): boolean => {
    try {
      const pathname = new URL(url).pathname.toLowerCase();
      return pathname.endsWith('.pdf');
    } catch {
      return false;
    }
  },

  // 生成随机用户代理
  getRandomUserAgent: (): string => {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0'
    ];
    
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }
};

// 常量
export const SCRAPER_CONSTANTS = {
  DEFAULT_TIMEOUT: 30000,
  MAX_CONTENT_LENGTH: 1000000, // 1MB
  MAX_CONCURRENT_SCRAPES: 3,
  RATE_LIMIT_DELAY: 2000,
  CACHE_TIMEOUT: 300000, // 5分钟
  
  // 常见的内容选择器
  CONTENT_SELECTORS: [
    'article',
    'main',
    '.content',
    '.post-content',
    '.entry-content',
    '.article-content',
    '#content',
    '.main-content',
    '[role="main"]'
  ],

  // 需要移除的元素选择器
  NOISE_SELECTORS: [
    'nav',
    'header',
    'footer',
    'aside',
    'script',
    'style',
    'noscript',
    '.navigation',
    '.navbar',
    '.sidebar',
    '.menu',
    '.ads',
    '.advertisement',
    '.social-share',
    '.comments',
    '.related-posts'
  ],

  // 支持的语言代码
  SUPPORTED_LANGUAGES: [
    'zh', 'en', 'ja', 'ko', 'ar', 'ru', 'es', 'fr', 'de', 'it', 'pt'
  ]
} as const;