#!/usr/bin/env node

/**
 * 检查数据库中Anthropic相关产品的设置
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ibcosbscpshgexjgpoiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY29zYnNjcHNoZ2V4amdwb2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1MDU5MCwiZXhwIjoyMDY3NTI2NTkwfQ.0tRC0vsiNVBUASbY7ChXlT7NRXSmtxa14rfsghgvMu0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAntropicProducts() {
  try {
    console.log('🔍 检查数据库中的Anthropic产品设置...\n');
    
    // 查找所有Anthropic相关产品
    const { data: products, error } = await supabase
      .from('ai_products')
      .select('*')
      .or('slug.eq.claude,slug.eq.claude-code,name.ilike.%Claude%,name.ilike.%Anthropic%')
      .order('display_order');
    
    if (error) {
      throw new Error(`查询失败: ${error.message}`);
    }
    
    console.log(`📋 找到 ${products.length} 个Anthropic相关产品:\n`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. 📱 ${product.name}`);
      console.log(`   🔗 Slug: ${product.slug}`);
      console.log(`   📂 分类: ${product.category}`);
      console.log(`   📝 描述: ${product.description}`);
      console.log(`   🌐 主页: ${product.homepage_url}`);
      console.log(`   📊 Changelog: ${product.changelog_url}`);
      console.log(`   🆔 ID: ${product.id}`);
      console.log(`   📈 显示顺序: ${product.display_order}`);
      console.log();
    });
    
    // 检查现有更新数据
    if (products.length > 0) {
      console.log('📊 检查现有更新数据...\n');
      
      for (const product of products) {
        const { data: updates, error: updateError } = await supabase
          .from('product_updates')
          .select('id, title, published_at, version_number')
          .eq('product_id', product.id)
          .order('published_at', { ascending: false })
          .limit(3);
        
        if (updateError) {
          console.log(`   ❌ ${product.name}: 查询更新失败 - ${updateError.message}`);
        } else {
          console.log(`   📈 ${product.name}: ${updates.length} 条更新记录`);
          updates.forEach(update => {
            const date = new Date(update.published_at).toLocaleDateString('zh-CN');
            console.log(`      - ${update.title} (${date})`);
          });
        }
        console.log();
      }
    }
    
    console.log('💡 建议的更新策略:');
    console.log('1. Claude (对话AI) - 从 https://www.anthropic.com/news 获取模型更新');
    console.log('2. Claude Code (编程助手) - 从 https://docs.anthropic.com/en/docs/claude-code 获取工具更新');
    console.log('3. 两个产品有不同的更新节奏和内容焦点');
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  checkAntropicProducts().then(() => {
    console.log('\n✨ 检查完成！');
    process.exit(0);
  }).catch(console.error);
}

module.exports = { checkAntropicProducts };