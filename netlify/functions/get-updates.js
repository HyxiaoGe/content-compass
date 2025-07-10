const { createClient } = require('@supabase/supabase-js');

/**
 * 获取现有的产品更新数据
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
    const productSlug = queryStringParameters?.product;
    const limit = parseInt(queryStringParameters?.limit) || 10;
    
    let query = supabase
      .from('product_updates')
      .select(`
        *,
        ai_products!inner(
          id,
          name,
          slug,
          logo_url
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    // 如果指定了产品，过滤该产品
    if (productSlug) {
      query = query.eq('ai_products.slug', productSlug);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // 统计每个产品的更新数量
    const productStats = {};
    data.forEach(update => {
      const productName = update.ai_products.name;
      if (!productStats[productName]) {
        productStats[productName] = 0;
      }
      productStats[productName]++;
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        total: data.length,
        updates: data,
        stats: productStats,
        message: `找到 ${data.length} 条产品更新记录`
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
        error: error.message
      })
    };
  }
};