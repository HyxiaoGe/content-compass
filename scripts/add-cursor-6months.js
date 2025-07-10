#!/usr/bin/env node

/**
 * Cursor近半年完整更新数据
 * 数据源: https://cursor.com/changelog
 * 时间范围: 2025年4月-7月
 * 更新时间: 2025-07-10
 */

const { createClient } = require('@supabase/supabase-js');

// 配置Supabase
const supabaseUrl = 'https://ibcosbscpshgexjgpoiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY29zYnNjcHNoZ2V4amdwb2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1MDU5MCwiZXhwIjoyMDY3NTI2NTkwfQ.0tRC0vsiNVBUASbY7ChXlT7NRXSmtxa14rfsghgvMu0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Cursor近半年完整版本数据
const cursorVersions = [
  {
    version: '1.2',
    publishedAt: '2025-07-03T00:00:00Z',
    title: 'Cursor 1.2 - Agent待办事项和队列消息',
    summary: 'Cursor 1.2版本带来了革命性的Agent待办事项功能，支持结构化任务规划和依赖关系跟踪。新增队列消息功能，Memories正式GA，PR索引和语义搜索让代码库导航更智能。Tab补全速度显著提升，Agent现在还能自动解决合并冲突。',
    keyPoints: [
      'Agent待办事项 - 结构化任务规划，支持依赖关系跟踪',
      '队列消息功能 - Agent任务排队执行',
      'Memories正式GA - 项目记忆管理系统',
      'PR索引和语义搜索 - 智能代码库导航',
      '改进的嵌入模型 - 更准确的代码搜索',
      '更快的Tab补全 - 显著提升编码效率',
      'Agent合并冲突解决 - 自动处理代码冲突',
      'VS Code升级到1.99 - 最新编辑器功能',
      'Slack Agent响应优化 - 更快的团队协作',
      '内存泄漏修复 - 提升稳定性'
    ],
    tags: ['Agent', 'Memories', 'PR搜索', 'Tab补全', '合并冲突', 'VS Code'],
    importance: 'high'
  },
  {
    version: '1.1',
    publishedAt: '2025-06-12T00:00:00Z',
    title: 'Cursor 1.1 - Slack中的后台Agent',
    summary: 'Cursor 1.1引入了强大的Slack集成功能。现在可以在Slack中通过@Cursor提及直接启动Agent，Agent能够读取线程上下文，直接创建PR和调查问题，让团队协作更加seamless。新增设置搜索功能和服务器进度通知。',
    keyPoints: [
      'Slack中的后台Agent - 在Slack直接使用Agent',
      '@Cursor提及功能 - 快速启动Agent助手',
      'Slack线程上下文理解 - Agent理解对话历史',
      'Slack中创建PR - 直接从对话创建Pull Request',
      'Slack问题调查 - Agent直接处理技术问题',
      '设置搜索功能 - Cmd/Ctrl+F搜索设置',
      '服务器进度通知 - 实时任务进度反馈'
    ],
    tags: ['Slack集成', '后台Agent', 'PR创建', '团队协作', '设置搜索'],
    importance: 'high'
  },
  {
    version: '1.0',
    publishedAt: '2025-06-04T00:00:00Z',
    title: 'Cursor 1.0 - 里程碑版本发布',
    summary: 'Cursor 1.0正式发布，标志着AI代码编辑器的重要里程碑。引入BugBot自动PR代码审查，后台Agent对所有用户开放，支持Jupyter Notebook开发。Memories beta功能让项目记忆更智能，一键MCP服务器安装简化扩展流程。聊天支持Mermaid图表和Markdown表格。',
    keyPoints: [
      'BugBot自动PR审查 - AI驱动的代码审查系统',
      '后台Agent全面开放 - 所有用户可使用后台Agent',
      'Jupyter Notebook支持 - 扩展到数据科学开发',
      'Memories beta功能 - 智能项目记忆管理',
      '一键MCP服务器安装 - 简化扩展安装流程',
      'Mermaid图表支持 - 聊天中显示流程图和架构图',
      'Markdown表格支持 - 更丰富的聊天响应格式',
      '增强的仪表板 - 使用分析和设置管理',
      '并行工具调用 - 提升多任务处理效率',
      '网页搜索和链接解析 - 扩展信息获取能力'
    ],
    tags: ['1.0发布', 'BugBot', 'Jupyter', 'Memories', 'MCP', 'Mermaid'],
    importance: 'high'
  },
  {
    version: '0.50',
    publishedAt: '2025-05-15T00:00:00Z',
    title: 'Cursor 0.50 - 统一定价和后台Agent预览',
    summary: 'Cursor 0.50带来了简化的统一定价模型，Max Mode支持顶级模型。后台Agent预览版可以并行执行任务，新的Tab模型支持多文件建议。改进的上下文管理支持@folders，重新设计的内联编辑提供更多选项。',
    keyPoints: [
      '统一定价模型 - 简化的基于请求的定价',
      'Max Mode顶级模型 - 访问最强AI模型',
      '后台Agent预览 - 并行任务执行环境',
      '新Tab模型 - 多文件代码建议功能',
      '@folders上下文支持 - 改进的上下文管理',
      '重新设计的内联编辑 - 更多编辑选项',
      '多根工作区支持 - 复杂项目结构管理',
      '聊天功能增强 - 导出和复制对话',
      '并行任务处理 - 提升开发效率'
    ],
    tags: ['定价模型', 'Max Mode', '后台Agent', 'Tab模型', '内联编辑'],
    importance: 'medium'
  },
  {
    version: '0.49',
    publishedAt: '2025-04-15T00:00:00Z',
    title: 'Cursor 0.49 - 自动规则生成和代码审查',
    summary: 'Cursor 0.49引入了自动规则生成功能，可以从对话中直接生成Cursor Rules。改进的聊天历史更易访问，内置diff视图简化代码审查。MCP服务器支持图片，增强的Agent终端控制，全局忽略文件配置。',
    keyPoints: [
      '自动规则生成 - 从对话直接生成Cursor Rules',
      '改进的聊天历史 - 更易访问的对话记录',
      '内置diff视图 - 简化代码审查流程',
      'MCP服务器图片支持 - 扩展多媒体处理能力',
      '增强的Agent终端控制 - 更好的命令行交互',
      '全局忽略文件配置 - 项目级文件过滤',
      '新模型支持 - Gemini 2.5 Pro和Grok 3',
      '工具交互改进 - 更流畅的开发体验',
      '代码审查优化 - 更直观的差异比较'
    ],
    tags: ['规则生成', '代码审查', 'diff视图', 'MCP', '终端控制', '新模型'],
    importance: 'medium'
  }
];

async function addCursorSixMonths() {
  try {
    console.log('🚀 开始添加Cursor近半年完整更新数据...\n');
    
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
    
    // 清理所有现有的Cursor更新数据
    const { error: deleteError } = await supabase
      .from('product_updates')
      .delete()
      .eq('product_id', product.id);
    
    if (deleteError) {
      console.warn(`⚠️  删除旧数据时出错: ${deleteError.message}`);
    } else {
      console.log(`🧹 已清理所有Cursor旧数据`);
    }
    
    // 添加近半年的完整版本数据
    console.log(`\n📝 开始添加 ${cursorVersions.length} 个版本的数据:`);
    
    for (const [index, version] of cursorVersions.entries()) {
      const insertData = {
        product_id: product.id,
        title: version.title,
        summary: version.summary,
        key_points: version.keyPoints,
        version_number: version.version,
        published_at: version.publishedAt,
        importance_level: version.importance,
        tags: version.tags,
        original_url: 'https://cursor.com/changelog',
        status: 'published',
        ai_model_used: 'manual',
        confidence_score: 1.0,
        content_hash: `cursor_v${version.version}_${version.publishedAt.split('T')[0]}`
      };
      
      console.log(`  ${index + 1}. 添加版本 ${version.version} - ${version.title.replace('Cursor ', '').substring(0, 30)}...`);
      
      const { data, error } = await supabase
        .from('product_updates')
        .insert(insertData);
      
      if (error) {
        console.error(`     ❌ 失败: ${error.message}`);
      } else {
        console.log(`     ✅ 成功`);
      }
    }
    
    // 验证添加结果
    console.log('\n📊 验证添加结果...');
    const { data: allUpdates, error: queryError } = await supabase
      .from('product_updates')
      .select(`
        version_number,
        title,
        published_at,
        key_points,
        tags
      `)
      .eq('product_id', product.id)
      .order('published_at', { ascending: false });
    
    if (queryError) {
      console.error(`❌ 查询验证失败:`, queryError.message);
    } else {
      console.log(`\n🎉 Cursor近半年数据添加完成！总共 ${allUpdates.length} 个版本:`);
      console.log(`┌─────────┬──────────────────────────────────────┬─────────────┐`);
      console.log(`│ 版本    │ 标题                                 │ 发布日期    │`);
      console.log(`├─────────┼──────────────────────────────────────┼─────────────┤`);
      
      allUpdates.forEach(update => {
        const date = new Date(update.published_at).toLocaleDateString('zh-CN');
        const title = update.title.replace('Cursor ', '').substring(0, 32);
        const version = update.version_number.padEnd(7);
        console.log(`│ v${version} │ ${title.padEnd(36)} │ ${date.padEnd(11)} │`);
      });
      
      console.log(`└─────────┴──────────────────────────────────────┴─────────────┘`);
      
      // 统计信息
      const totalFeatures = allUpdates.reduce((sum, update) => sum + (update.key_points?.length || 0), 0);
      const allTags = allUpdates.flatMap(update => update.tags || []);
      const uniqueTags = [...new Set(allTags)];
      
      console.log(`\n📈 数据统计:`);
      console.log(`   🔸 版本数量: ${allUpdates.length} 个`);
      console.log(`   🔸 功能要点: ${totalFeatures} 个`);
      console.log(`   🔸 标签类型: ${uniqueTags.length} 种`);
      console.log(`   🔸 时间跨度: 2025年4月 - 2025年7月`);
    }
    
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  addCursorSixMonths().then(() => {
    console.log('\n✨ Cursor近半年数据更新完成！');
    process.exit(0);
  }).catch(console.error);
}

module.exports = { addCursorSixMonths };