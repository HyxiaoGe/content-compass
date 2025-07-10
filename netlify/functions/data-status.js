const { createClient } = require('@supabase/supabase-js');

/**
 * 数据状态检查 - 显示数据库中的真实数据统计
 */
exports.handler = async (event, context) => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // 获取所有产品的更新统计
    const { data: products, error: productsError } = await supabase
      .from('ai_products')
      .select(`
        id,
        name,
        slug,
        product_updates(count)
      `)
      .eq('is_active', true)
      .order('display_order');

    if (productsError) throw productsError;

    // 获取最近的更新
    const { data: recentUpdates, error: updatesError } = await supabase
      .from('product_updates')
      .select(`
        id,
        title,
        summary,
        published_at,
        importance_level,
        ai_products(name, slug)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10);

    if (updatesError) throw updatesError;

    // 统计数据质量
    const stats = {
      totalProducts: products.length,
      totalUpdates: products.reduce((sum, p) => sum + (p.product_updates?.[0]?.count || 0), 0),
      productsWithUpdates: products.filter(p => p.product_updates?.[0]?.count > 0).length,
      recentUpdates: recentUpdates.length,
      dataQuality: {
        realData: recentUpdates.filter(u => 
          u.summary && u.summary.length > 100 && 
          !u.summary.includes('发布了重要功能更新，包含性能优化')
        ).length,
        testData: recentUpdates.filter(u => 
          u.summary && u.summary.includes('发布了重要功能更新，包含性能优化')
        ).length
      }
    };

    // 按产品分组统计
    const productStats = products.map(p => ({
      name: p.name,
      slug: p.slug,
      updateCount: p.product_updates?.[0]?.count || 0
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        stats,
        productStats,
        recentUpdates: recentUpdates.map(u => ({
          title: u.title,
          product: u.ai_products?.name,
          date: u.published_at,
          importance: u.importance_level,
          isRealData: u.summary && u.summary.length > 100 && 
            !u.summary.includes('发布了重要功能更新，包含性能优化')
        })),
        message: `数据库中有 ${stats.totalUpdates} 条更新，其中 ${stats.dataQuality.realData} 条是真实数据`
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