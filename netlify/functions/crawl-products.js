const { createClient } = require('@supabase/supabase-js');

/**
 * Netlify Function: AI产品信息爬取
 * 
 * 临时简化版本 - 用于测试Function部署
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

    // 模拟爬取结果（临时）
    const results = [];
    for (const productSlug of targetProducts) {
      // 检查产品是否存在
      const { data: product, error } = await supabase
        .from('ai_products')
        .select('id, name')
        .eq('slug', productSlug)
        .single();

      if (error || !product) {
        results.push({
          success: false,
          productSlug,
          updatesFound: 0,
          newUpdates: 0,
          error: `产品不存在: ${productSlug}`
        });
        continue;
      }

      // 模拟成功结果
      results.push({
        success: true,
        productSlug,
        updatesFound: Math.floor(Math.random() * 3) + 1,
        newUpdates: Math.floor(Math.random() * 2),
        error: null
      });
    }

    // 统计结果
    const successCount = results.filter(r => r.success).length;
    const totalUpdates = results.reduce((sum, r) => sum + r.updatesFound, 0);
    const totalNewUpdates = results.reduce((sum, r) => sum + r.newUpdates, 0);

    const response = {
      success: successCount > 0,
      message: `爬取测试完成: ${successCount}/${results.length} 个产品成功，模拟发现 ${totalUpdates} 条更新，其中 ${totalNewUpdates} 条为新内容`,
      results,
      timestamp: new Date().toISOString(),
      executionTime: Date.now() - parseInt(context.awsRequestId || '0', 36),
      version: 'JavaScript-MVP'
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
      version: 'JavaScript-MVP'
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