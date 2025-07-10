#!/usr/bin/env node

/**
 * 清理数据库中的假数据，只保留真实的产品更新
 */

const { createClient } = require('@supabase/supabase-js');

// 配置Supabase
const supabaseUrl = 'https://ibcosbscpshgexjgpoiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY29zYnNjcHNoZ2V4amdwb2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1MDU5MCwiZXhwIjoyMDY3NTI2NTkwfQ.0tRC0vsiNVBUASbY7ChXlT7NRXSmtxa14rfsghgvMu0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanFakeData() {
  try {
    console.log('🧹 开始清理数据库中的假数据...\n');
    
    // 1. 先查看所有数据
    const { data: allUpdates, error: fetchError } = await supabase
      .from('product_updates')
      .select(`
        id,
        title,
        summary,
        published_at,
        content_hash,
        ai_products!inner(name)
      `)
      .order('published_at', { ascending: false });
    
    if (fetchError) {
      throw new Error(`查询失败: ${fetchError.message}`);
    }
    
    console.log(`📊 数据库中总共有 ${allUpdates.length} 条更新记录\n`);
    
    // 2. 识别假数据
    const fakeDataPatterns = [
      /\d+\/\d+\/\d{4}\s+更新/,  // "7/10/2025 更新" 这种格式
      /包含性能优化、新功能添加和bug修复/,  // 通用描述
      /发布了重要功能更新/,  // 通用标题
      /本次更新提升了用户体验，增强了系统稳定性/  // 通用描述
    ];
    
    const fakeUpdates = allUpdates.filter(update => {
      // 如果有真实的content_hash（包含2025且不是通用格式），则认为是真实数据
      if (update.content_hash && update.content_hash.includes('2025') && !update.content_hash.includes('generated')) {
        return false;
      }
      
      // 检查标题和摘要是否匹配假数据模式
      const titleMatch = fakeDataPatterns.some(pattern => pattern.test(update.title));
      const summaryMatch = fakeDataPatterns.some(pattern => pattern.test(update.summary));
      
      return titleMatch || summaryMatch;
    });
    
    const realUpdates = allUpdates.filter(update => !fakeUpdates.includes(update));
    
    console.log(`✅ 识别出真实数据: ${realUpdates.length} 条`);
    console.log(`❌ 识别出假数据: ${fakeUpdates.length} 条\n`);
    
    // 3. 显示要删除的假数据
    if (fakeUpdates.length > 0) {
      console.log(`🗑️  将要删除的假数据:`);
      fakeUpdates.forEach((update, index) => {
        console.log(`  ${index + 1}. ${update.ai_products.name}: ${update.title}`);
        console.log(`     📅 ${new Date(update.published_at).toLocaleDateString()}`);
        console.log(`     🆔 ${update.id}`);
      });
      
      console.log(`\n⚠️  确认要删除这 ${fakeUpdates.length} 条假数据吗？(继续执行将删除)`);
      
      // 4. 删除假数据
      const idsToDelete = fakeUpdates.map(u => u.id);
      
      const { error: deleteError } = await supabase
        .from('product_updates')
        .delete()
        .in('id', idsToDelete);
      
      if (deleteError) {
        throw new Error(`删除失败: ${deleteError.message}`);
      }
      
      console.log(`\n✅ 成功删除 ${fakeUpdates.length} 条假数据！`);
    } else {
      console.log(`✅ 没有发现需要删除的假数据`);
    }
    
    // 5. 显示清理后的真实数据
    console.log(`\n📋 清理后保留的真实数据:`);
    realUpdates.forEach((update, index) => {
      console.log(`  ${index + 1}. ${update.ai_products.name}: ${update.title}`);
      console.log(`     📅 ${new Date(update.published_at).toLocaleDateString()}`);
    });
    
    console.log(`\n🎉 数据清理完成！现在数据库中只有 ${realUpdates.length} 条真实的产品更新数据。`);
    
  } catch (error) {
    console.error('❌ 清理失败:', error.message);
    process.exit(1);
  }
}

// 运行清理
if (require.main === module) {
  cleanFakeData().then(() => {
    console.log('\n✨ 数据库清理完成！');
    process.exit(0);
  }).catch(console.error);
}

module.exports = { cleanFakeData };