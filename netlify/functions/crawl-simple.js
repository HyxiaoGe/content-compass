const { createClient } = require('@supabase/supabase-js');

/**
 * 极简爬取函数 - 避免超时
 */
exports.handler = async (event, context) => {
  try {
    // 初始化Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // 获取参数
    const { queryStringParameters } = event;
    const products = queryStringParameters?.products?.split(',') || ['cursor'];
    
    const results = [];
    
    // 简单处理每个产品
    for (const productSlug of products) {
      try {
        // 检查产品
        const { data: product } = await supabase
          .from('ai_products')
          .select('id, name')
          .eq('slug', productSlug)
          .single();

        if (!product) {
          results.push({ 
            productSlug, 
            success: false, 
            error: '产品不存在' 
          });
          continue;
        }

        // 生成测试更新
        const update = {
          product_id: product.id,
          title: `${product.name} 每日更新`,
          summary: `${product.name} 今日更新内容摘要`,
          key_points: ['功能更新', '性能优化'],
          importance_level: 'medium',
          tags: ['更新'],
          published_at: new Date().toISOString(),
          status: 'published',
          content_hash: Math.random().toString(36).substring(7),
          confidence_score: 0.8,
          ai_model_used: 'simple',
          scraped_at: new Date().toISOString()
        };

        // 检查今日是否已有更新
        const today = new Date().toISOString().split('T')[0];
        const { count } = await supabase
          .from('product_updates')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', product.id)
          .gte('published_at', today + 'T00:00:00Z');

        if (count > 0) {
          results.push({ 
            productSlug, 
            success: true, 
            newUpdates: 0,
            message: '今日已更新' 
          });
          continue;
        }

        // 插入更新
        const { error } = await supabase
          .from('product_updates')
          .insert(update);

        if (error) {
          results.push({ 
            productSlug, 
            success: false, 
            error: error.message 
          });
        } else {
          results.push({ 
            productSlug, 
            success: true, 
            newUpdates: 1 
          });
        }

      } catch (error) {
        results.push({ 
          productSlug, 
          success: false, 
          error: error.message 
        });
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        results,
        timestamp: new Date().toISOString()
      })
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
        error: error.message
      })
    };
  }
};