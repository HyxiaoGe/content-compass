const { createClient } = require('@supabase/supabase-js');
const { SimpleCrawler } = require('./simple-crawler');

/**
 * Netlify Function: AI产品信息爬取
 * 
 * 使用简化的网页爬取和基本分析
 */
exports.handler = async (event, context) => {
  console.log('🚀 爬取任务开始执行...');
  
  try {
    // 验证环境变量
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`缺少必需的环境变量: ${envVar}`);
      }
    }

    // 解析查询参数
    const { queryStringParameters } = event;
    const productsParam = queryStringParameters?.products;
    
    // MVP产品列表
    const MVP_PRODUCTS = [
      'github-copilot',
      'openai', 
      'cursor',
      'claude'
    ];

    // 确定要爬取的产品
    let targetProducts = MVP_PRODUCTS;
    if (productsParam) {
      targetProducts = productsParam.split(',').map(p => p.trim());
      const invalidProducts = targetProducts.filter(p => !MVP_PRODUCTS.includes(p));
      if (invalidProducts.length > 0) {
        throw new Error(`不支持的产品: ${invalidProducts.join(', ')}`);
      }
    }

    console.log(`📋 计划爬取产品: ${targetProducts.join(', ')}`);

    // 初始化Supabase客户端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // 初始化爬取器
    const crawler = new SimpleCrawler();

    // 执行真实爬取
    const results = [];
    for (const productSlug of targetProducts) {
      console.log(`🔍 开始爬取产品: ${productSlug}`);
      
      try {
        // 检查产品是否存在
        const { data: product, error: productError } = await supabase
          .from('ai_products')
          .select('*')
          .eq('slug', productSlug)
          .eq('is_active', true)
          .single();

        if (productError || !product) {
          throw new Error(`产品不存在或未启用: ${productSlug}`);
        }

        // 爬取更新
        const rawUpdates = await crawler.crawlUpdates(productSlug);
        console.log(`📄 发现 ${rawUpdates.length} 条原始更新`);

        let newUpdatesCount = 0;
        let savedCount = 0;

        // 处理每个更新
        for (const rawUpdate of rawUpdates) {
          // 生成内容哈希
          const contentHash = crawler.generateHash(rawUpdate.title + rawUpdate.content);
          
          // 检查是否已存在
          const { data: existing } = await supabase
            .from('product_updates')
            .select('id')
            .eq('product_id', product.id)
            .eq('content_hash', contentHash)
            .single();

          if (existing) {
            console.log(`⏭️ 跳过已存在的更新: ${rawUpdate.title}`);
            continue;
          }

          newUpdatesCount++;

          // 分析内容
          const analyzed = crawler.analyzeContent(rawUpdate, product.name);
          
          // 保存到数据库
          const { error: insertError } = await supabase
            .from('product_updates')
            .insert({
              product_id: product.id,
              title: analyzed.title,
              summary: analyzed.summary,
              key_points: analyzed.keyPoints,
              importance_level: analyzed.importance,
              tags: analyzed.tags,
              version_number: analyzed.version,
              original_url: analyzed.originalUrl,
              published_at: analyzed.publishDate.toISOString(),
              status: 'published',
              content_hash: contentHash,
              confidence_score: analyzed.confidence,
              ai_model_used: 'rule-based',
              scraped_at: new Date().toISOString(),
              processed_at: new Date().toISOString()
            });

          if (!insertError) {
            savedCount++;
            console.log(`✅ 保存新更新: ${analyzed.title}`);
          } else {
            console.error(`❌ 保存失败:`, insertError);
          }
        }

        // 更新产品爬取状态
        await supabase
          .from('ai_products')
          .update({
            last_crawled_at: new Date().toISOString(),
            crawl_status: 'success',
            crawl_error: null
          })
          .eq('id', product.id);

        results.push({
          success: true,
          productSlug,
          updatesFound: rawUpdates.length,
          newUpdates: savedCount,
          error: null
        });
        
        console.log(`✅ ${productSlug} 爬取完成: ${savedCount} 条新更新`);
        
      } catch (error) {
        console.error(`❌ ${productSlug} 爬取失败:`, error);
        
        // 更新错误状态
        try {
          const { data: product } = await supabase
            .from('ai_products')
            .select('id')
            .eq('slug', productSlug)
            .single();
            
          if (product) {
            await supabase
              .from('ai_products')
              .update({
                last_crawled_at: new Date().toISOString(),
                crawl_status: 'error',
                crawl_error: error.message
              })
              .eq('id', product.id);
          }
        } catch (updateError) {
          console.error('更新错误状态失败:', updateError);
        }

        results.push({
          success: false,
          productSlug,
          updatesFound: 0,
          newUpdates: 0,
          error: error.message || '爬取失败'
        });
      }
      
      // 添加延迟避免过快请求
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 统计结果
    const successCount = results.filter(r => r.success).length;
    const totalUpdates = results.reduce((sum, r) => sum + r.updatesFound, 0);
    const totalNewUpdates = results.reduce((sum, r) => sum + r.newUpdates, 0);

    const response = {
      success: successCount > 0,
      message: `爬取完成: ${successCount}/${results.length} 个产品成功，发现 ${totalUpdates} 条更新，其中 ${totalNewUpdates} 条为新内容`,
      results,
      timestamp: new Date().toISOString(),
      executionTime: Date.now() - parseInt(context.awsRequestId || '0', 36),
      version: 'JavaScript-Production'
    };

    console.log('🎉 爬取任务执行完成:', response.message);

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
    
    const errorResponse = {
      success: false,
      message: error.message || '爬取任务执行失败',
      results: [],
      timestamp: new Date().toISOString(),
      executionTime: 0,
      version: 'JavaScript-Production'
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