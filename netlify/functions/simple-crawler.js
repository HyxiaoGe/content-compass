const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * 简化的网页爬取器 - 用于Netlify Functions
 * 使用原生Node.js API，无需额外依赖
 */

class SimpleCrawler {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (compatible; ContentCompass/1.0; +https://content-compass.netlify.app)';
  }

  /**
   * 获取网页内容
   */
  async fetchPage(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const httpModule = isHttps ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache'
        },
        timeout: 5000
      };

      const req = httpModule.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  /**
   * 从HTML中提取基本信息
   */
  extractBasicInfo(html) {
    // 提取标题
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // 提取所有链接
    const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi;
    const links = [];
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      links.push({
        url: linkMatch[1],
        text: linkMatch[2].trim()
      });
    }

    // 提取段落文本 - 改进版本
    const paragraphs = [];
    
    // 1. 尝试提取明显的更新内容
    const updatePatterns = [
      /(\d+\.\d+)\s*([A-Za-z]+\s+\d+,\s+\d{4})\s*([^<]+)/gi, // 版本号模式
      /Agent\s+[^<]{50,}/gi, // Agent相关更新
      /(?:New|Updated|Fixed|Improved)\s+[^<]{30,}/gi, // 更新关键词
      /Changelog([^<]{100,})/gi // Changelog内容
    ];
    
    for (const pattern of updatePatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const text = match[0]
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (text && text.length > 30 && !paragraphs.includes(text)) {
          paragraphs.push(text.substring(0, 200));
        }
      }
    }

    // 2. 如果没找到，尝试提取文本节点
    if (paragraphs.length === 0) {
      const textNodes = html.match(/>([^<]{50,})</g);
      if (textNodes) {
        for (const node of textNodes.slice(0, 5)) {
          const text = node.substring(1, node.length - 1).trim();
          if (text && !text.includes('{') && !text.includes(';')) {
            paragraphs.push(text.substring(0, 200));
          }
        }
      }
    }

    return {
      title,
      links,
      paragraphs
    };
  }

  /**
   * 尝试从常见的更新页面获取信息
   */
  async crawlUpdates(productSlug) {
    const productConfigs = {
      'openai': {
        urls: ['https://openai.com/index/'],
        name: 'OpenAI'
      },
      'cursor': {
        urls: ['https://cursor.com/en/changelog'],
        name: 'Cursor'
      },
      'claude': {
        urls: ['https://www.anthropic.com/news'],
        name: 'Claude'
      },
      'github-copilot': {
        urls: ['https://github.blog/changelog/label/copilot/'],
        name: 'GitHub Copilot'
      }
    };

    const config = productConfigs[productSlug];
    if (!config) {
      throw new Error(`不支持的产品: ${productSlug}`);
    }

    const updates = [];

    // 只尝试第一个URL，减少超时风险
    const url = config.urls[0];
    
    try {
      console.log(`📄 尝试爬取: ${url}`);
      
      // 设置更短的超时时间
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('爬取超时')), 3000);
      });
      
      const response = await Promise.race([
        this.fetchPage(url),
        timeoutPromise
      ]);
      
      if (response.statusCode !== 200) {
        console.log(`❌ HTTP ${response.statusCode}: ${url}`);
        return updates;
      }

      const info = this.extractBasicInfo(response.body);
      
      // 基于内容生成更新条目 - 限制为1条以减少处理时间
      const relevantParagraphs = info.paragraphs
        .filter(p => this.isRelevantUpdate(p, config.name))
        .slice(0, 1);

      for (const paragraph of relevantParagraphs) {
        updates.push({
          title: `${config.name} 产品更新`,
          content: paragraph,
          url: url,
          publishDate: new Date(),
          source: 'web'
        });
      }

      console.log(`✅ 从 ${url} 提取了 ${relevantParagraphs.length} 条更新`);

    } catch (error) {
      console.log(`❌ 爬取失败 ${url}:`, error.message);
    }

    return updates;
  }

  /**
   * 判断内容是否为相关更新
   */
  isRelevantUpdate(text, productName) {
    const updateKeywords = [
      'update', 'release', 'version', 'feature', 'improve', 'fix',
      '更新', '发布', '版本', '功能', '改进', '修复', '新增'
    ];
    
    const lowerText = text.toLowerCase();
    const lowerProductName = productName.toLowerCase();
    
    // 包含产品名称或更新关键词
    return lowerText.includes(lowerProductName) || 
           updateKeywords.some(keyword => lowerText.includes(keyword));
  }

  /**
   * 生成简单的AI分析结果
   */
  analyzeContent(update, productName) {
    const content = update.content;
    const title = update.title;
    
    // 简单的重要性判断
    const highImportanceKeywords = ['major', 'important', 'breaking', 'new', '重大', '重要', '新'];
    const isHighImportance = highImportanceKeywords.some(keyword => 
      content.toLowerCase().includes(keyword) || title.toLowerCase().includes(keyword)
    );

    // 提取关键要点
    const sentences = content.split(/[.。!！?？]/).filter(s => s.trim().length > 10);
    const keyPoints = sentences.slice(0, 3).map(s => s.trim().substring(0, 40) + '...');

    return {
      title: `${productName} 功能更新`,
      summary: content.length > 200 ? content.substring(0, 200) + '...' : content,
      keyPoints: keyPoints.length > 0 ? keyPoints : ['产品功能更新'],
      importance: isHighImportance ? 'high' : 'medium',
      tags: ['产品更新', '功能改进'],
      version: this.extractVersion(content),
      publishDate: update.publishDate,
      originalUrl: update.url,
      confidence: 0.6
    };
  }

  /**
   * 提取版本号
   */
  extractVersion(text) {
    const versionMatch = text.match(/v?(\d+\.\d+(?:\.\d+)?)/i);
    return versionMatch ? versionMatch[1] : null;
  }

  /**
   * 生成内容哈希
   */
  generateHash(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

module.exports = { SimpleCrawler };