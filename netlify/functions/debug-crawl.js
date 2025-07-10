const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * 调试爬取 - 看看到底发生了什么
 */
exports.handler = async (event, context) => {
  const { queryStringParameters } = event;
  const url = queryStringParameters?.url || 'https://cursor.sh/changelog';
  
  try {
    const result = await fetchPage(url);
    
    // 提取一些基本信息
    let bodyPreview = result.body.substring(0, 1000);
    let titleMatch = result.body.match(/<title[^>]*>([^<]*)<\/title>/i);
    let h1Match = result.body.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    let paragraphs = [];
    let pRegex = /<p[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/p>/gi;
    let pMatch;
    let count = 0;
    while ((pMatch = pRegex.exec(result.body)) !== null && count < 5) {
      paragraphs.push(pMatch[1].replace(/<[^>]*>/g, '').trim());
      count++;
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        url: url,
        httpStatus: result.statusCode,
        headers: result.headers,
        bodyLength: result.body.length,
        bodyPreview: bodyPreview,
        title: titleMatch ? titleMatch[1] : 'No title found',
        h1: h1Match ? h1Match[1] : 'No h1 found',
        firstParagraphs: paragraphs,
        message: `获取了 ${result.body.length} 字节的内容`
      }, null, 2)
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        url: url
      })
    };
  }
};

async function fetchPage(url) {
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
        'User-Agent': 'Mozilla/5.0 (compatible; ContentCompass/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
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