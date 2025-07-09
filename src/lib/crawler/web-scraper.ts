import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

/**
 * 网页爬取工具
 * 
 * 支持静态HTML爬取和动态JS渲染页面爬取
 */

interface ScrapeOptions {
  userAgent?: string;
  timeout?: number;
  waitForSelector?: string;
  javascript?: boolean; // 是否需要JS渲染
  headers?: Record<string, string>;
}

interface ScrapedContent {
  html: string;
  url: string;
  title: string;
  statusCode: number;
  timestamp: Date;
}

export class WebScraper {
  private defaultOptions: ScrapeOptions = {
    userAgent: 'Mozilla/5.0 (compatible; ContentCompass/1.0; +https://content-compass.netlify.app)',
    timeout: 30000,
    javascript: false,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache'
    }
  };

  /**
   * 爬取网页内容
   */
  async scrape(url: string, options: ScrapeOptions = {}): Promise<ScrapedContent> {
    const config = { ...this.defaultOptions, ...options };
    
    console.log(`🕷️ 开始爬取: ${url}`);
    
    try {
      if (config.javascript) {
        return await this.scrapeWithPuppeteer(url, config);
      } else {
        return await this.scrapeWithFetch(url, config);
      }
    } catch (error) {
      console.error(`❌ 爬取失败: ${url}`, error);
      throw error;
    }
  }

  /**
   * 使用fetch进行静态爬取
   */
  private async scrapeWithFetch(url: string, options: ScrapeOptions): Promise<ScrapedContent> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': options.userAgent!,
          ...options.headers
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const title = $('title').text() || $('h1').first().text() || '无标题';

      return {
        html,
        url,
        title: title.trim(),
        statusCode: response.status,
        timestamp: new Date()
      };

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 使用Puppeteer进行动态爬取
   */
  private async scrapeWithPuppeteer(url: string, options: ScrapeOptions): Promise<ScrapedContent> {
    let browser;
    
    try {
      // 配置Chromium（适配Netlify Functions）
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: null,
        executablePath: await chromium.executablePath(),
        headless: true
      });

      const page = await browser.newPage();
      
      // 设置请求头
      await page.setUserAgent(options.userAgent!);
      await page.setExtraHTTPHeaders(options.headers || {});
      
      // 设置超时
      page.setDefaultTimeout(options.timeout!);
      
      // 访问页面
      const response = await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: options.timeout
      });

      // 等待指定元素
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { timeout: 10000 });
      }

      // 获取页面内容
      const html = await page.content();
      const title = await page.title();

      return {
        html,
        url,
        title: title.trim(),
        statusCode: response?.status() || 200,
        timestamp: new Date()
      };

    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * 从HTML中提取数据
   */
  extractData(html: string, selectors: Record<string, string>): Record<string, string[]> {
    const $ = cheerio.load(html);
    const result: Record<string, string[]> = {};

    for (const [key, selector] of Object.entries(selectors)) {
      const elements = $(selector);
      const values: string[] = [];

      elements.each((_, element) => {
        const $el = $(element);
        let value = '';

        // 根据元素类型获取内容
        if (selector.includes('[datetime]') || $el.attr('datetime')) {
          value = $el.attr('datetime') || $el.text().trim();
        } else if (selector.includes('a') || $el.is('a')) {
          value = $el.attr('href') || $el.text().trim();
        } else {
          value = $el.text().trim();
        }

        if (value) {
          values.push(value);
        }
      });

      result[key] = values;
    }

    return result;
  }

  /**
   * 清理和标准化文本内容
   */
  cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, ' ')
      .trim();
  }

  /**
   * 解析相对URL为绝对URL
   */
  resolveUrl(baseUrl: string, relativeUrl: string): string {
    try {
      return new URL(relativeUrl, baseUrl).href;
    } catch {
      return relativeUrl;
    }
  }

  /**
   * 延迟执行（用于限制请求频率）
   */
  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}