#!/usr/bin/env node

/**
 * 从Cursor官网获取的真实更新数据
 * 数据源: https://cursor.com/changelog
 * 更新时间: 2025-07-10
 */

const { createClient } = require('@supabase/supabase-js');

// 配置Supabase
const supabaseUrl = 'https://ibcosbscpshgexjgpoiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY29zYnNjcHNoZ2V4amdwb2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1MDU5MCwiZXhwIjoyMDY3NTI2NTkwfQ.0tRC0vsiNVBUASbY7ChXlT7NRXSmtxa14rfsghgvMu0';

const supabase = createClient(supabaseUrl, supabaseKey);

// 从官网获取的真实Cursor更新数据
const cursorUpdates = [
  {
    version: '1.2',
    publishedAt: '2025-07-03T00:00:00Z',
    title: 'Cursor 1.2 - Agent待办事项、队列消息和更快的Tab补全',
    summary: 'Cursor 1.2版本带来了Agent待办事项规划功能，让长期任务更易理解和跟踪。Agent现在会提前规划结构化的待办事项列表，并在工作进展时更新。新增队列消息功能，可以在Agent完成当前任务后排队后续消息。Memories功能正式GA，改进了内存生成质量。PR索引和搜索功能让你可以语义搜索旧PR。Tab补全速度显著提升，Agent还能解决合并冲突。',
    keyPoints: [
      'Agent待办事项 - 结构化任务规划，可视化待办列表',
      '队列消息 - Agent完成当前任务后自动处理排队消息',
      'Memories功能正式GA - 更好的项目记忆管理',
      'PR索引和语义搜索 - 快速查找历史PR和代码',
      '更快的Tab补全 - 显著提升编码速度',
      'Agent合并冲突解决 - 自动处理代码冲突',
      '改进的嵌入模型 - 更准确的代码库搜索'
    ],
    tags: ['Agent', 'Memories', 'PR搜索', 'Tab补全', '合并冲突'],
    importance: 'high'
  },
  {
    version: '1.1',
    publishedAt: '2025-06-12T00:00:00Z',
    title: 'Cursor 1.1 - Slack集成和后台Agent',
    summary: 'Cursor 1.1版本引入了强大的Slack集成功能。现在可以在Slack中通过@Cursor直接启动Agent，Agent能够读取Slack线程上下文并创建GitHub PR。后台Agent功能得到扩展，提供了更好的搜索和集成能力，让团队协作更加seamless。',
    keyPoints: [
      'Slack中的后台Agent - 直接在Slack启动Agent',
      '@Cursor提及功能 - 快速调用Agent助手',
      'Slack线程上下文读取 - Agent理解对话历史',
      'GitHub PR创建 - 从Slack直接创建Pull Request',
      '改进的搜索能力 - 更精准的代码搜索',
      '增强的集成功能 - 更好的工作流集成'
    ],
    tags: ['Slack集成', '后台Agent', 'GitHub集成', '团队协作'],
    importance: 'high'
  },
  {
    version: '1.0',
    publishedAt: '2025-06-04T00:00:00Z',
    title: 'Cursor 1.0 - 里程碑版本发布',
    summary: 'Cursor 1.0正式发布，标志着AI代码编辑器的重要里程碑。新增BugBot自动PR代码审查功能，后台Agent访问权限扩展到所有用户。支持Jupyter Notebook，引入Memories beta功能。一键MCP服务器安装让扩展更简单，聊天响应支持Mermaid图表和Markdown表格。',
    keyPoints: [
      'BugBot自动PR审查 - AI驱动的代码审查',
      '后台Agent全用户开放 - 所有用户可使用后台Agent',
      'Jupyter Notebook支持 - 扩展到数据科学场景',
      'Memories beta功能 - 项目记忆管理系统',
      '一键MCP服务器安装 - 简化扩展安装过程',
      'Mermaid图表支持 - 聊天中显示流程图',
      'Markdown表格支持 - 更丰富的聊天响应格式'
    ],
    tags: ['1.0发布', 'BugBot', 'Jupyter', 'Memories', 'MCP'],
    importance: 'high'
  }
];

async function addCursorUpdates() {
  try {
    console.log('🚀 开始添加Cursor官网真实更新数据...\n');
    
    // 获取Cursor产品ID
    const { data: product, error: productError } = await supabase
      .from('ai_products')
      .select('id, name')
      .eq('slug', 'cursor')
      .single();
    
    if (productError || !product) {
      throw new Error(`获取Cursor产品信息失败: ${productError?.message || '产品不存在'}`);
    }
    
    console.log(`📋 找到产品: ${product.name} (ID: ${product.id})`);
    
    // 先删除现有的Cursor更新（确保数据干净）
    const { error: deleteError } = await supabase
      .from('product_updates')
      .delete()
      .eq('product_id', product.id);
    
    if (deleteError) {
      console.warn(`⚠️  删除旧数据时出错: ${deleteError.message}`);
    } else {
      console.log(`🧹 已清理Cursor的旧更新数据`);
    }
    
    // 添加新的真实更新数据
    for (const [index, update] of cursorUpdates.entries()) {
      const insertData = {
        product_id: product.id,
        title: update.title,
        summary: update.summary,
        key_points: update.keyPoints,
        version_number: update.version,
        published_at: update.publishedAt,
        importance_level: update.importance,
        tags: update.tags,
        original_url: 'https://cursor.com/changelog',
        status: 'published',
        ai_model_used: 'manual',
        confidence_score: 1.0,
        content_hash: `cursor_v${update.version}_${update.publishedAt.split('T')[0]}`
      };
      
      console.log(`📝 添加: ${update.title}`);
      
      const { data, error } = await supabase
        .from('product_updates')
        .insert(insertData);
      
      if (error) {
        console.error(`❌ 添加失败:`, error.message);
      } else {
        console.log(`✅ 成功添加版本 ${update.version}`);
      }
    }
    
    // 验证添加结果
    console.log('\n📊 验证添加结果...');
    const { data: newUpdates, error: queryError } = await supabase
      .from('product_updates')
      .select(`
        *,
        ai_products!inner(name)
      `)
      .eq('product_id', product.id)
      .order('published_at', { ascending: false });
    
    if (queryError) {
      console.error(`❌ 查询失败:`, queryError.message);
    } else {
      console.log(`\n🎉 Cursor更新数据添加完成！总共 ${newUpdates.length} 条记录:`);
      newUpdates.forEach((update, index) => {
        const date = new Date(update.published_at).toLocaleDateString('zh-CN');
        console.log(`  ${index + 1}. v${update.version_number} - ${update.title.replace('Cursor ', '').substring(0, 40)}... (${date})`);
      });
    }
    
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  addCursorUpdates().then(() => {
    console.log('\n✨ Cursor数据更新完成！');
    process.exit(0);
  }).catch(console.error);
}

module.exports = { addCursorUpdates };