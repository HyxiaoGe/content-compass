// 测试数据库连接和数据查询
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database-v2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 测试数据库连接...');
  
  try {
    // 测试产品表
    const { data: products, error: productsError } = await supabase
      .from('ai_products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ 产品表查询失败:', productsError);
    } else {
      console.log(`✅ 产品表连接成功，找到 ${products.length} 个产品`);
      products.forEach(p => console.log(`  - ${p.name} (${p.slug})`));
    }
    
    // 测试产品更新表
    const { data: updates, error: updatesError } = await supabase
      .from('product_updates')
      .select('*')
      .limit(5);
    
    if (updatesError) {
      console.error('❌ 产品更新表查询失败:', updatesError);
    } else {
      console.log(`✅ 产品更新表连接成功，找到 ${updates.length} 条更新记录`);
      updates.forEach(u => console.log(`  - ${u.title}`));
    }
    
    // 测试视图
    const { data: latestUpdates, error: viewError } = await supabase
      .from('latest_updates')
      .select('*')
      .limit(3);
    
    if (viewError) {
      console.error('❌ 最新更新视图查询失败:', viewError);
    } else {
      console.log(`✅ 最新更新视图连接成功，找到 ${latestUpdates.length} 条记录`);
      latestUpdates.forEach(u => console.log(`  - ${u.product_name}: ${u.title}`));
    }
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
}

testConnection();