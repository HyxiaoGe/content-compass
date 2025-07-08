// src/lib/scraper/puppeteer-scraper.ts
import puppeteer, { Browser, Page } from 'puppeteer';
import type { ScrapingOptions, ScrapingResult, SitePattern } from '@/types/scraper';
import { SITE_PATTERNS } from '@/types/scraper';

export class PuppeteerScraper {
  private browser: Browser | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.browser) return;
    if (this.isInitializing && this.initPromise) {
      await this.initPromise;
      return;
    }

    this.isInitializing = true;
    this.initPromise = this._initialize();
    await this.initPromise;
    this.isInitializing = false;
  }

  private async _initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      });
    } catch (error) {
      throw new Error(`Failed to initialize Puppeteer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async scrape(url: string, options: ScrapingOptions = {}): Promise<ScrapingResult> {
    const startTime = Date.now();
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount <= maxRetries) {
      try {
        await this.initialize();
        
        if (!this.browser) {
          throw new Error('Browser not initialized');
        }

        const page = await this.browser.newPage();
        
        try {
          // 配置页面
          await this.configurePage(page, options);

          // 获取站点特定配置
          const sitePattern = this.getSitePattern(url);
          const mergedOptions = this.mergeOptionsWithSitePattern(options, sitePattern);

          // 访问页面
          const response = await page.goto(url, {
            waitUntil: options.waitForNetworkIdle ? 'networkidle2' : 'domcontentloaded',
            timeout: options.timeout || 30000
          });

          if (!response) {
            throw new Error('No response received');
          }

          // 检查响应状态
          if (!response.ok()) {
            throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
          }

          // 等待页面加载完成
          await this.waitForPageLoad(page, mergedOptions);

          // 提取页面数据
          const scrapedData = await this.extractPageData(page, mergedOptions);
          
          // 获取最终URL（处理重定向）
          const finalUrl = page.url();

          const processingTime = Date.now() - startTime;

          return {
            success: true,
            data: {
              ...scrapedData,
              url: finalUrl,
              finalUrl: finalUrl !== url ? finalUrl : undefined
            },
            processingTime,
            retryCount
          };

        } finally {
          await page.close();
        }

      } catch (error) {
        retryCount++;
        const processingTime = Date.now() - startTime;
        
        if (retryCount > maxRetries) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown scraping error',
            processingTime,
            retryCount: retryCount - 1
          };
        }

        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    return {
      success: false,
      error: 'Max retries exceeded',
      processingTime: Date.now() - startTime,
      retryCount: maxRetries
    };
  }

  private async configurePage(page: Page, options: ScrapingOptions): Promise<void> {
    // 设置用户代理
    const userAgent = options.userAgent || this.getRandomUserAgent();
    await page.setUserAgent(userAgent);

    // 设置视窗
    const viewport = options.viewport || { width: 1280, height: 720 };
    await page.setViewport(viewport);

    // 设置请求拦截
    if (options.blockResources && options.blockResources.length > 0) {
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const resourceType = request.resourceType();
        if (options.blockResources!.includes(resourceType)) {
          request.abort();
        } else {
          request.continue();
        }
      });
    }

    // 设置额外的HTTP头
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
  }

  private getSitePattern(url: string): SitePattern | null {
    try {
      const domain = new URL(url).hostname;
      
      // 查找匹配的站点模式
      for (const [_key, pattern] of Object.entries(SITE_PATTERNS)) {
        if (domain.includes(pattern.domain)) {
          return pattern;
        }
      }
    } catch (_error) {
      // URL解析失败，返回null
    }
    
    return null;
  }

  private mergeOptionsWithSitePattern(options: ScrapingOptions, sitePattern: SitePattern | null): ScrapingOptions {
    if (!sitePattern) return options;

    return {
      ...options,
      waitForSelector: options.waitForSelector || sitePattern.waitForSelector,
      customSelectors: {
        ...sitePattern.selectors,
        ...options.customSelectors
      }
    };
  }

  private async waitForPageLoad(page: Page, options: ScrapingOptions): Promise<void> {
    // 等待特定选择器
    if (options.waitForSelector) {
      try {
        await page.waitForSelector(options.waitForSelector, { timeout: 5000 });
      } catch (_error) {
        // 选择器超时不算致命错误，继续执行
        console.warn(`Selector "${options.waitForSelector}" not found within timeout`);
      }
    }

    // 等待网络空闲
    if (options.waitForNetworkIdle) {
      try {
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
      } catch (_error) {
        // 网络空闲超时也不算致命错误
      }
    }

    // 额外等待确保页面完全加载
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async extractPageData(page: Page, options: ScrapingOptions): Promise<any> {
    return await page.evaluate((opts) => {
      // 在浏览器上下文中执行的代码
      const customSelectors = opts.customSelectors || {};

      // 提取标题
      const getTitleSelectors = () => [
        ...((customSelectors.title as string[]) || []),
        'h1',
        'title',
        '[property="og:title"]',
        '[name="twitter:title"]',
        '.entry-title',
        '.post-title',
        '.article-title'
      ];

      let title = '';
      for (const selector of getTitleSelectors()) {
        const element = document.querySelector(selector);
        if (element) {
          title = element.getAttribute('content') || element.textContent || '';
          if (title.trim()) break;
        }
      }

      // 如果还是没有标题，使用document.title
      if (!title.trim()) {
        title = document.title;
      }

      // 提取描述
      const description = (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content ||
                         (document.querySelector('meta[property="og:description"]') as HTMLMetaElement)?.content ||
                         '';

      // 提取关键词
      const keywords = (document.querySelector('meta[name="keywords"]') as HTMLMetaElement)?.content
        ?.split(',').map(k => k.trim()).filter(k => k) || [];

      // 提取作者
      const getAuthorSelectors = () => [
        ...((customSelectors.author as string[]) || []),
        'meta[name="author"]',
        '[rel="author"]',
        '.author',
        '.byline',
        '[data-testid="authorName"]'
      ];

      let author = '';
      for (const selector of getAuthorSelectors()) {
        const element = document.querySelector(selector);
        if (element) {
          author = element.getAttribute('content') || element.textContent || '';
          if (author.trim()) break;
        }
      }

      // 提取发布日期
      const getDateSelectors = () => [
        ...((customSelectors.publishDate as string[]) || []),
        'meta[property="article:published_time"]',
        'meta[name="date"]',
        'time[datetime]',
        '.published-date',
        '.publish-date',
        '[data-testid="storyPublishDate"]'
      ];

      let publishDate = '';
      for (const selector of getDateSelectors()) {
        const element = document.querySelector(selector);
        if (element) {
          publishDate = element.getAttribute('content') || 
                       element.getAttribute('datetime') || 
                       element.textContent || '';
          if (publishDate.trim()) break;
        }
      }

      // 提取主要内容
      const getContentSelectors = () => [
        ...((customSelectors.content as string[]) || []),
        'article',
        'main',
        '.content',
        '.post-content',
        '.entry-content',
        '.article-content',
        '#content',
        '.main-content',
        '[role="main"]'
      ];

      let mainContent = '';
      for (const selector of getContentSelectors()) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.length > 100) {
          mainContent = element.textContent;
          break;
        }
      }

      // 如果没有找到主要内容，使用body但排除导航和侧边栏
      if (!mainContent || mainContent.length < 100) {
        const body = document.body.cloneNode(true) as HTMLElement;
        
        // 移除不需要的元素
        const elementsToRemove = [
          'nav', 'header', 'footer', 'aside', 'script', 'style', 'noscript',
          '.navigation', '.navbar', '.sidebar', '.menu', '.ads', '.advertisement'
        ];
        
        elementsToRemove.forEach(selector => {
          body.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        mainContent = body.textContent || '';
      }

      // 提取图片
      const images = opts.extractImages ? 
        Array.from(document.querySelectorAll('img'))
          .map(img => img.src)
          .filter(src => src && (src.startsWith('http') || src.startsWith('//')))
          .slice(0, 20) // 限制数量
        : [];

      // 提取链接
      const links = opts.extractLinks ?
        Array.from(document.querySelectorAll('a[href]'))
          .map(link => (link as HTMLAnchorElement).href)
          .filter(href => href && href.startsWith('http'))
          .slice(0, 50) // 限制数量
        : [];

      // 语言检测
      const language = document.documentElement.lang || 
                      (document.querySelector('meta[http-equiv="content-language"]') as HTMLMetaElement)?.content || 
                      'en';

      // 获取网站名称
      const siteName = (document.querySelector('meta[property="og:site_name"]') as HTMLMetaElement)?.content ||
                      (document.querySelector('meta[name="application-name"]') as HTMLMetaElement)?.content ||
                      '';

      // 获取字符集
      const charset = (document.querySelector('meta[charset]') as HTMLMetaElement)?.getAttribute('charset') ||
                     (document.querySelector('meta[http-equiv="content-type"]') as HTMLMetaElement)?.content ||
                     'utf-8';

      // 获取favicon
      const favicon = (document.querySelector('link[rel="icon"]') as HTMLLinkElement)?.href ||
                     (document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement)?.href ||
                     '';

      // 计算字数和阅读时间
      const wordCount = mainContent.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // 假设200词/分钟

      return {
        title: title.trim(),
        content: mainContent,
        cleanedContent: '', // 将在后续步骤中清理
        metadata: {
          description,
          keywords,
          author: author.trim(),
          publishDate: publishDate.trim(),
          images: [...new Set(images)], // 去重
          links: [...new Set(links)], // 去重
          language,
          wordCount,
          readingTime,
          charset,
          favicon,
          siteName,
          articleType: (document.querySelector('meta[property="og:type"]') as HTMLMetaElement)?.content || 'article'
        },
        rawHtml: opts.extractImages || opts.extractLinks ? document.documentElement.outerHTML : undefined
      };
    }, options);
  }

  private getRandomUserAgent(): string {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0'
    ];
    
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  async takeScreenshot(url: string, options: ScrapingOptions & { screenshotOptions?: any } = {}): Promise<Buffer | null> {
    try {
      await this.initialize();
      
      if (!this.browser) {
        throw new Error('Browser not initialized');
      }

      const page = await this.browser.newPage();
      
      try {
        await this.configurePage(page, options);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: options.timeout || 30000 });
        
        const screenshot = await page.screenshot({
          type: 'png',
          fullPage: false,
          clip: { x: 0, y: 0, width: 1280, height: 720 },
          ...options.screenshotOptions
        });
        
        return screenshot as unknown as Buffer;
      } finally {
        await page.close();
      }
    } catch (error) {
      console.error('Screenshot failed:', error);
      return null;
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // 获取浏览器状态
  getBrowserStatus(): { initialized: boolean; isConnected: boolean } {
    return {
      initialized: this.browser !== null,
      isConnected: this.browser?.isConnected() || false
    };
  }
}