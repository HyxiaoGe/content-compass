import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { ProductCrawler } from "../../src/lib/crawler/product-crawler";

interface CrawlResult {
  success: boolean;
  productSlug: string;
  updatesFound: number;
  newUpdates: number;
  error?: string;
}

interface CrawlResponse {
  success: boolean;
  message: string;
  results: CrawlResult[];
  timestamp: string;
  executionTime: number;
}

// MVP阶段支持的产品
const MVP_PRODUCTS = [
  'github-copilot',
  'openai', 
  'cursor',
  'claude'
];

/**
 * Netlify Function: 爬取AI产品更新信息
 * 
 * 支持的参数:
 * - products: 逗号分隔的产品slug列表，如 "openai,cursor"
 * - force: 是否强制重新爬取 (true/false)
 * 
 * 示例:
 * - /.netlify/functions/crawl-products
 * - /.netlify/functions/crawl-products?products=openai,cursor
 * - /.netlify/functions/crawl-products?force=true
 */
export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}> => {
  const startTime = Date.now();
  console.log('🚀 爬取任务开始执行...');
  
  try {
    // 验证环境变量
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'OPENAI_API_KEY'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`缺少必需的环境变量: ${envVar}`);
      }
    }

    // 解析查询参数
    const { queryStringParameters } = event;
    const productsParam = queryStringParameters?.products;
    const forceParam = queryStringParameters?.force === 'true';
    
    // 确定要爬取的产品
    let targetProducts: string[];
    if (productsParam) {
      targetProducts = productsParam.split(',').map(p => p.trim());
      // 验证产品是否在MVP列表中
      const invalidProducts = targetProducts.filter(p => !MVP_PRODUCTS.includes(p));
      if (invalidProducts.length > 0) {
        throw new Error(`不支持的产品: ${invalidProducts.join(', ')}。MVP阶段仅支持: ${MVP_PRODUCTS.join(', ')}`);
      }
    } else {
      // 默认爬取所有MVP产品
      targetProducts = [...MVP_PRODUCTS];
    }

    console.log(`📋 计划爬取产品: ${targetProducts.join(', ')}`);

    // 初始化爬取器
    const crawler = new ProductCrawler();
    const results: CrawlResult[] = [];
    
    // 执行爬取任务（串行执行避免过载）
    for (const productSlug of targetProducts) {
      console.log(`🔍 开始爬取: ${productSlug}`);
      
      try {
        const result = await crawler.crawlProduct(productSlug);
        
        results.push({
          success: result.success,
          productSlug,
          updatesFound: result.updatesFound,
          newUpdates: result.newUpdates,
          error: result.error
        });
        
        if (result.success) {
          console.log(`✅ ${productSlug} 爬取完成: 发现 ${result.updatesFound} 条更新，其中 ${result.newUpdates} 条为新内容`);
        } else {
          console.log(`❌ ${productSlug} 爬取失败: ${result.error}`);
        }
        
        // 添加延迟避免过于频繁的请求
        if (targetProducts.indexOf(productSlug) < targetProducts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ ${productSlug} 爬取异常:`, error);
        results.push({
          success: false,
          productSlug,
          updatesFound: 0,
          newUpdates: 0,
          error: error instanceof Error ? error.message : '未知错误'
        });
      }
    }

    // 统计结果
    const successCount = results.filter(r => r.success).length;
    const totalUpdates = results.reduce((sum, r) => sum + r.updatesFound, 0);
    const totalNewUpdates = results.reduce((sum, r) => sum + r.newUpdates, 0);
    const executionTime = Date.now() - startTime;

    const response: CrawlResponse = {
      success: successCount > 0,
      message: `爬取完成: ${successCount}/${results.length} 个产品成功，发现 ${totalUpdates} 条更新，其中 ${totalNewUpdates} 条为新内容`,
      results,
      timestamp: new Date().toISOString(),
      executionTime
    };

    console.log(`🎉 爬取任务执行完成 (${executionTime}ms):`, response.message);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(response, null, 2)
    };

  } catch (error) {
    console.error('💥 爬取任务执行失败:', error);
    
    const executionTime = Date.now() - startTime;
    const errorResponse: CrawlResponse = {
      success: false,
      message: error instanceof Error ? error.message : '爬取任务执行失败',
      results: [],
      timestamp: new Date().toISOString(),
      executionTime
    };

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(errorResponse, null, 2)
    };
  }
};