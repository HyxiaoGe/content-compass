// src/types/scraper.ts
export interface ScrapingOptions {
  timeout?: number;
  waitForSelector?: string;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  blockResources?: string[];
  extractImages?: boolean;
  extractLinks?: boolean;
  followRedirects?: boolean;
  maxRedirects?: number;
  waitForNetworkIdle?: boolean;
  customSelectors?: {
    title?: string[];
    content?: string[];
    author?: string[];
    publishDate?: string[];
  };
}

export interface ScrapingResult {
  success: boolean;
  data?: {
    url: string;
    finalUrl?: string; // 重定向后的最终URL
    title: string;
    content: string;
    cleanedContent: string;
    metadata: {
      description?: string;
      keywords?: string[];
      author?: string;
      publishDate?: string;
      images: string[];
      links: string[];
      wordCount: number;
      language?: string;
      readingTime: number; // 分钟
      charset?: string;
      favicon?: string;
      siteName?: string;
      articleType?: string;
    };
    rawHtml?: string;
    screenshot?: Buffer; // 可选的页面截图
  };
  error?: string;
  processingTime?: number;
  retryCount?: number;
}

export interface ContentMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  language?: string;
  charset?: string;
  favicon?: string;
  siteName?: string;
  articleType?: string;
  canonicalUrl?: string;
  images: string[];
  links: string[];
  wordCount: number;
  readingTime: number;
}

export interface ContentCleaner {
  removeAds(html: string): string;
  removeNavigation(html: string): string;
  extractMainContent(html: string): string;
  cleanWhitespace(text: string): string;
  detectLanguage(text: string): string;
  extractKeywords(text: string): string[];
  calculateReadingTime(text: string): number;
}

export interface ScrapingConfig {
  maxConcurrentScrapes: number;
  defaultTimeout: number;
  retryAttempts: number;
  retryDelay: number;
  rateLimitDelay: number;
  enableScreenshots: boolean;
  enableCaching: boolean;
  cacheTimeout: number;
  userAgents: string[];
  blockedDomains: string[];
  allowedDomains: string[];
}

export interface RateLimitInfo {
  domain: string;
  lastRequest: number;
  requestCount: number;
  resetTime: number;
}

export interface ScrapingError extends Error {
  code: 'TIMEOUT' | 'BLOCKED' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'PARSING_ERROR' | 'RATE_LIMITED';
  url?: string;
  statusCode?: number;
  retryable: boolean;
}

export interface ScrapingStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageProcessingTime: number;
  totalProcessingTime: number;
  requestsByDomain: Record<string, number>;
  errorsByType: Record<string, number>;
}

// 常用的网站模式
export interface SitePattern {
  domain: string;
  selectors: {
    title?: string[];
    content?: string[];
    author?: string[];
    publishDate?: string[];
    description?: string[];
  };
  blockedElements?: string[];
  waitForSelector?: string;
  customProcessing?: (page: any) => Promise<any>;
}

// 预定义的网站模式
export const SITE_PATTERNS: Record<string, SitePattern> = {
  'medium.com': {
    domain: 'medium.com',
    selectors: {
      title: ['h1[data-testid="storyTitle"]', 'h1.p-name'],
      content: ['article section', '.postArticle-content'],
      author: ['[data-testid="authorName"]', '.u-accentColor--textNormal'],
      publishDate: ['[data-testid="storyPublishDate"]', 'time']
    },
    waitForSelector: 'article'
  },
  'github.com': {
    domain: 'github.com',
    selectors: {
      title: ['#readme h1', '.entry-title'],
      content: ['#readme', '.markdown-body'],
      author: ['.author', '.commit-author']
    },
    waitForSelector: '#readme'
  },
  'stackoverflow.com': {
    domain: 'stackoverflow.com',
    selectors: {
      title: ['.question-hyperlink', 'h1[itemprop="name"]'],
      content: ['.post-text', '.answer .post-text'],
      author: ['.user-details', '.user-info']
    },
    waitForSelector: '.question'
  },
  'wikipedia.org': {
    domain: 'wikipedia.org',
    selectors: {
      title: ['#firstHeading'],
      content: ['#mw-content-text .mw-parser-output'],
      author: ['.mw-history-histlinks']
    },
    blockedElements: ['.navbox', '.infobox', '.references']
  }
};