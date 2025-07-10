const { createClient } = require('@supabase/supabase-js');

/**
 * 快速测试版本 - 插入模拟数据以验证系统功能
 */
exports.handler = async (event, context) => {
  console.log('🚀 快速测试开始执行...');
  
  try {
    // 初始化Supabase客户端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

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

    // 确定要处理的产品
    let targetProducts = MVP_PRODUCTS;
    if (productsParam) {
      targetProducts = productsParam.split(',').map(p => p.trim()).filter(p => MVP_PRODUCTS.includes(p));
    }

    console.log(`📋 计划处理产品: ${targetProducts.join(', ')}`);

    const results = [];
    let totalNewUpdates = 0;

    for (const productSlug of targetProducts) {
      try {
        // 获取产品信息
        const { data: product, error: productError } = await supabase
          .from('ai_products')
          .select('*')
          .eq('slug', productSlug)
          .eq('is_active', true)
          .single();

        if (productError || !product) {
          results.push({
            success: false,
            productSlug,
            updatesFound: 0,
            newUpdates: 0,
            error: `产品不存在: ${productSlug}`
          });
          continue;
        }

        // 生成模拟更新
        const mockUpdate = {
          title: `${product.name} ${new Date().toLocaleDateString()} 更新`,
          summary: `${product.name} 发布了重要功能更新，包含性能优化、新功能添加和bug修复。本次更新提升了用户体验，增强了系统稳定性。`,
          keyPoints: ['性能优化', '新功能发布', 'Bug修复', '用户体验提升'],
          importance: 'medium',
          tags: ['产品更新', '功能改进', '版本发布'],
          publishDate: new Date(),
          originalUrl: product.homepage_url,
          confidence: 0.8
        };

        // 生成内容哈希
        const contentHash = Math.random().toString(36).substring(7);
        
        // 检查是否已存在相似更新（基于标题和日期）
        const today = new Date().toISOString().split('T')[0];
        const { data: existingToday } = await supabase
          .from('product_updates')
          .select('id')
          .eq('product_id', product.id)
          .gte('published_at', today + 'T00:00:00Z')
          .lt('published_at', today + 'T23:59:59Z');

        if (existingToday && existingToday.length > 0) {
          results.push({
            success: true,
            productSlug,
            updatesFound: 1,
            newUpdates: 0,
            error: null
          });
          console.log(`⏭️ ${productSlug} 今日已有更新，跳过`);
          continue;
        }

        // 插入新的更新记录
        const { error: insertError } = await supabase
          .from('product_updates')
          .insert({
            product_id: product.id,
            title: mockUpdate.title,
            summary: mockUpdate.summary,
            key_points: mockUpdate.keyPoints,
            importance_level: mockUpdate.importance,
            tags: mockUpdate.tags,
            original_url: mockUpdate.originalUrl,
            published_at: mockUpdate.publishDate.toISOString(),
            status: 'published',
            content_hash: contentHash,
            confidence_score: mockUpdate.confidence,
            ai_model_used: 'test-mock',
            scraped_at: new Date().toISOString(),
            processed_at: new Date().toISOString()
          });

        if (insertError) {
          console.error(`❌ 插入失败:`, insertError);
          results.push({
            success: false,
            productSlug,
            updatesFound: 1,
            newUpdates: 0,
            error: insertError.message
          });
        } else {
          totalNewUpdates++;
          console.log(`✅ ${productSlug} 插入测试更新成功`);
          
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
            updatesFound: 1,
            newUpdates: 1,
            error: null
          });
        }

      } catch (error) {
        console.error(`❌ 处理 ${productSlug} 失败:`, error);
        results.push({
          success: false,
          productSlug,
          updatesFound: 0,
          newUpdates: 0,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalUpdates = results.reduce((sum, r) => sum + r.updatesFound, 0);

    const response = {
      success: successCount > 0,
      message: `快速测试完成: ${successCount}/${results.length} 个产品成功，生成 ${totalUpdates} 条更新，其中 ${totalNewUpdates} 条为新内容`,
      results,
      timestamp: new Date().toISOString(),
      executionTime: Date.now() - parseInt(context.awsRequestId || '0', 36),
      version: 'JavaScript-QuickTest'
    };

    console.log('🎉 快速测试执行完成:', response.message);

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
    console.error('💥 快速测试执行失败:', error);
    
    const errorResponse = {
      success: false,
      message: error.message || '快速测试执行失败',
      results: [],
      timestamp: new Date().toISOString(),
      executionTime: 0,
      version: 'JavaScript-QuickTest'
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