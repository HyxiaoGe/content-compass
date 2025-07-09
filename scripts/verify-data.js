// 验证数据库数据脚本
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请确保环境变量 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 已配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
  console.log('🔍 验证数据库数据...\n');
  
  try {
    // 1. 检查产品数量
    const { data: products, error: productsError } = await supabase
      .from('ai_products')
      .select('*');
    
    if (productsError) {
      console.error('❌ 产品表查询失败:', productsError);
      return;
    }
    
    console.log(`✅ 产品表: ${products.length} 个产品`);
    products.forEach(p => console.log(`   - ${p.name} (${p.slug})`));
    
    // 2. 检查产品更新数量
    const { data: updates, error: updatesError } = await supabase
      .from('product_updates')
      .select('*');
    
    if (updatesError) {
      console.error('❌ 产品更新表查询失败:', updatesError);
      return;
    }
    
    console.log(`\n✅ 产品更新表: ${updates.length} 条更新记录`);
    
    // 3. 按产品统计更新数量
    const updatesByProduct = {};
    updates.forEach(update => {
      const product = products.find(p => p.id === update.product_id);
      const productName = product ? product.name : 'Unknown';
      updatesByProduct[productName] = (updatesByProduct[productName] || 0) + 1;
    });
    
    Object.entries(updatesByProduct).forEach(([name, count]) => {
      console.log(`   - ${name}: ${count} 条更新`);
    });
    
    // 4. 测试latest_updates视图
    const { data: latestUpdates, error: viewError } = await supabase
      .from('latest_updates')
      .select('*')
      .limit(5);
    
    if (viewError) {
      console.error('❌ 最新更新视图查询失败:', viewError);
      return;
    }
    
    console.log(`\n✅ 最新更新视图: ${latestUpdates.length} 条记录`);
    latestUpdates.forEach(u => {
      const date = new Date(u.published_at).toLocaleDateString('zh-CN');
      console.log(`   - ${u.product_name}: ${u.title} (${date})`);
    });
    
    // 5. 验证数据完整性
    console.log('\n🔍 数据完整性检查:');
    
    const missingUpdates = products.filter(p => {
      return !updates.some(u => u.product_id === p.id);
    });
    
    if (missingUpdates.length > 0) {
      console.log(`⚠️  以下产品没有更新记录:`);
      missingUpdates.forEach(p => console.log(`   - ${p.name}`));
    } else {
      console.log('✅ 所有产品都有更新记录');
    }
    
    console.log('\n🎉 数据验证完成！');
    console.log(`📊 总结: ${products.length}个产品，${updates.length}条更新，${latestUpdates.length}条显示在首页`);
    
  } catch (error) {
    console.error('❌ 数据验证失败:', error);
  }
}

verifyData();