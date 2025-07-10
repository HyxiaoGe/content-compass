#!/usr/bin/env node

/**
 * Anthropic产品更新数据
 * 包含Claude对话AI和Claude Code编程助手
 * 数据源: https://www.anthropic.com/news 和 https://docs.anthropic.com/en/docs/claude-code
 * 更新时间: 2025-07-10
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ibcosbscpshgexjgpoiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY29zYnNjcHNoZ2V4amdwb2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1MDU5MCwiZXhwIjoyMDY3NTI2NTkwfQ.0tRC0vsiNVBUASbY7ChXlT7NRXSmtxa14rfsghgvMu0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Claude对话AI的更新数据
const claudeUpdates = [
  {
    publishedAt: '2025-07-09T00:00:00Z',
    title: 'Claude教育应用进展和企业扩展',
    summary: 'Anthropic在教育领域推进Claude应用，同时劳伦斯利弗莫尔国家实验室扩展Claude企业版使用。这标志着Claude在科研和教育领域的重要进展，为学术研究和高等教育提供强大的AI支持。',
    keyPoints: [
      'Claude教育应用持续发展',
      '劳伦斯利弗莫尔国家实验室扩展企业使用',
      '科研和教育领域应用拓展',
      '高等教育AI支持增强'
    ],
    tags: ['教育', '企业版', '科研', '国家实验室'],
    importance: 'medium'
  },
  {
    publishedAt: '2025-06-27T00:00:00Z',
    title: 'Anthropic经济未来计划启动',
    summary: 'Anthropic启动经济未来计划，研究AI对经济发展和就业市场的长期影响。该计划旨在理解和塑造AI技术对社会经济结构的影响，确保AI发展造福全社会。',
    keyPoints: [
      '经济未来计划正式启动',
      'AI对经济发展影响研究',
      '就业市场变化分析',
      '社会经济结构影响评估',
      'AI发展社会效益确保'
    ],
    tags: ['经济研究', '社会影响', '未来规划', '就业市场'],
    importance: 'medium'
  },
  {
    publishedAt: '2025-06-25T00:00:00Z',
    title: 'Claude Artifacts - AI驱动的应用创建',
    summary: 'Claude Artifacts功能正式发布，支持用户通过自然语言创建完整的应用程序。这一功能让非技术用户也能快速构建交互式应用，大大降低了应用开发的门槛。',
    keyPoints: [
      'Claude Artifacts功能发布',
      '自然语言创建应用程序',
      '交互式应用快速构建',
      '降低应用开发门槛',
      '非技术用户友好设计'
    ],
    tags: ['Artifacts', '应用创建', '自然语言', '用户友好'],
    importance: 'high'
  },
  {
    publishedAt: '2025-06-06T00:00:00Z',
    title: 'Claude Gov - 美国国家安全专用模型',
    summary: 'Anthropic发布Claude Gov模型，专为美国国家安全应用设计。该模型具有增强的安全特性和合规性，支持政府部门的敏感任务处理，标志着AI在国家安全领域的重要应用。',
    keyPoints: [
      'Claude Gov专用模型发布',
      '美国国家安全应用支持',
      '增强的安全特性和合规性',
      '政府部门敏感任务处理',
      'AI国家安全领域应用'
    ],
    tags: ['Claude Gov', '国家安全', '政府应用', '合规性'],
    importance: 'high'
  },
  {
    publishedAt: '2025-05-22T00:00:00Z',
    title: 'Claude 4 - 新一代智能Agent',
    summary: 'Claude 4正式发布，带来革命性的Agent构建能力和AI安全防护Level 3级别。新版本能够构建更复杂的智能代理，同时提供业界领先的安全保护机制，确保AI系统的可靠性和安全性。',
    keyPoints: [
      'Claude 4正式发布',
      '革命性Agent构建能力',
      'AI安全防护Level 3级别',
      '复杂智能代理构建',
      '业界领先安全保护机制',
      'AI系统可靠性和安全性保障'
    ],
    tags: ['Claude 4', 'Agent构建', 'AI安全', 'Level 3防护'],
    importance: 'high'
  },
  {
    publishedAt: '2025-05-07T00:00:00Z',
    title: 'Claude网页搜索API发布',
    summary: 'Anthropic发布Claude网页搜索API，让开发者能够将实时网页搜索功能集成到应用中。这一功能大大扩展了Claude的信息获取能力，使其能够访问最新的网络信息。',
    keyPoints: [
      '网页搜索API正式发布',
      '实时网页搜索功能集成',
      '扩展信息获取能力',
      '最新网络信息访问',
      '开发者API支持'
    ],
    tags: ['搜索API', '实时信息', '开发者工具', '网络搜索'],
    importance: 'medium'
  },
  {
    publishedAt: '2025-05-01T00:00:00Z',
    title: 'Claude外部系统连接能力',
    summary: 'Claude新增连接外部系统的能力，支持与各种第三方服务和数据库的集成。这一功能让Claude能够在更复杂的工作流中发挥作用，成为真正的智能工作助手。',
    keyPoints: [
      '外部系统连接能力新增',
      '第三方服务集成支持',
      '数据库连接功能',
      '复杂工作流集成',
      '智能工作助手定位'
    ],
    tags: ['外部集成', '第三方服务', '工作流', '系统连接'],
    importance: 'medium'
  },
  {
    publishedAt: '2025-02-24T00:00:00Z',
    title: 'Claude 3.7 Sonnet - 最智能模型发布',
    summary: 'Claude 3.7 Sonnet发布，被称为"迄今最智能的模型"。能够产生近乎即时的响应，或展示其扩展思维的逐步过程。同时Claude Code编程助手也同步发布，为开发者提供强大的编程支持。',
    keyPoints: [
      'Claude 3.7 Sonnet发布',
      '迄今最智能的模型',
      '近乎即时的响应速度',
      '扩展思维逐步展示',
      'Claude Code同步发布',
      '强大编程支持功能'
    ],
    tags: ['Claude 3.7', 'Sonnet', '智能模型', '即时响应', '扩展思维'],
    importance: 'high'
  }
];

// Claude Code的更新数据
const claudeCodeUpdates = [
  {
    publishedAt: '2025-02-24T00:00:00Z',
    title: 'Claude Code正式发布 - AI编程助手',
    summary: 'Claude Code正式发布，这是一款革命性的AI编程助手，可以直接在终端中工作。支持从自然语言描述构建功能、调试和修复代码问题、导航整个项目代码库、自动化繁琐的开发任务。采用Unix哲学设计，可组合和脚本化。',
    keyPoints: [
      '直接在终端中工作',
      '自然语言描述构建功能',
      '智能调试和代码修复',
      '整个项目代码库导航',
      '开发任务自动化',
      '直接编辑文件和创建提交',
      'Unix哲学可组合设计',
      '企业级安全和隐私保护',
      'Node.js 18+支持',
      'npm全局安装'
    ],
    tags: ['Claude Code', '编程助手', '终端工具', '自然语言', '代码生成'],
    importance: 'high'
  },
  {
    publishedAt: '2025-03-15T00:00:00Z',
    title: 'Claude Code IDE集成更新',
    summary: 'Claude Code发布重要的IDE集成更新，改进了与主流开发环境的兼容性。新增对VS Code、IntelliJ等主流IDE的深度集成，提供更流畅的开发体验。同时优化了代码补全和错误检测功能。',
    keyPoints: [
      'IDE集成功能增强',
      'VS Code深度集成支持',
      'IntelliJ平台兼容',
      '代码补全功能优化',
      '错误检测能力提升',
      '开发体验流畅化',
      '主流开发环境支持'
    ],
    tags: ['IDE集成', 'VS Code', 'IntelliJ', '代码补全', '错误检测'],
    importance: 'medium'
  },
  {
    publishedAt: '2025-04-20T00:00:00Z',
    title: 'Claude Code企业版功能扩展',
    summary: 'Claude Code企业版发布新功能，包括团队协作支持、代码审查集成、安全合规管理等。企业用户现在可以更好地在团队环境中使用Claude Code，同时确保代码安全和合规性。',
    keyPoints: [
      '企业版功能扩展',
      '团队协作支持',
      '代码审查集成',
      '安全合规管理',
      '团队环境优化',
      '代码安全保障',
      '合规性确保'
    ],
    tags: ['企业版', '团队协作', '代码审查', '安全合规', '团队管理'],
    importance: 'medium'
  }
];

async function addAntropicUpdates() {
  try {
    console.log('🚀 开始添加Anthropic产品更新数据...\n');
    
    // 获取Claude产品ID
    const { data: claudeProduct, error: claudeError } = await supabase
      .from('ai_products')
      .select('id, name')
      .eq('slug', 'claude')
      .single();
    
    if (claudeError || !claudeProduct) {
      throw new Error(`获取Claude产品信息失败: ${claudeError?.message || '产品不存在'}`);
    }
    
    // 获取Claude Code产品ID
    const { data: claudeCodeProduct, error: claudeCodeError } = await supabase
      .from('ai_products')
      .select('id, name')
      .eq('slug', 'claude-code')
      .single();
    
    if (claudeCodeError || !claudeCodeProduct) {
      throw new Error(`获取Claude Code产品信息失败: ${claudeCodeError?.message || '产品不存在'}`);
    }
    
    console.log(`📋 找到产品:`);
    console.log(`   • ${claudeProduct.name} (ID: ${claudeProduct.id})`);
    console.log(`   • ${claudeCodeProduct.name} (ID: ${claudeCodeProduct.id})\n`);
    
    // 清理现有数据
    await supabase.from('product_updates').delete().eq('product_id', claudeProduct.id);
    await supabase.from('product_updates').delete().eq('product_id', claudeCodeProduct.id);
    console.log('🧹 已清理现有数据\n');
    
    // 添加Claude更新数据
    console.log(`📝 添加Claude对话AI更新 (${claudeUpdates.length}条):`);
    for (const [index, update] of claudeUpdates.entries()) {
      const insertData = {
        product_id: claudeProduct.id,
        title: update.title,
        summary: update.summary,
        key_points: update.keyPoints,
        published_at: update.publishedAt,
        importance_level: update.importance,
        tags: update.tags,
        original_url: 'https://www.anthropic.com/news',
        status: 'published',
        ai_model_used: 'manual',
        confidence_score: 1.0,
        content_hash: `claude_${update.publishedAt.split('T')[0]}_${index}`
      };
      
      const { error } = await supabase.from('product_updates').insert(insertData);
      
      if (error) {
        console.log(`   ❌ ${update.title.substring(0, 30)}... - ${error.message}`);
      } else {
        console.log(`   ✅ ${update.title.substring(0, 40)}...`);
      }
    }
    
    // 添加Claude Code更新数据
    console.log(`\n📝 添加Claude Code编程助手更新 (${claudeCodeUpdates.length}条):`);
    for (const [index, update] of claudeCodeUpdates.entries()) {
      const insertData = {
        product_id: claudeCodeProduct.id,
        title: update.title,
        summary: update.summary,
        key_points: update.keyPoints,
        published_at: update.publishedAt,
        importance_level: update.importance,
        tags: update.tags,
        original_url: 'https://docs.anthropic.com/en/docs/claude-code',
        status: 'published',
        ai_model_used: 'manual',
        confidence_score: 1.0,
        content_hash: `claude_code_${update.publishedAt.split('T')[0]}_${index}`
      };
      
      const { error } = await supabase.from('product_updates').insert(insertData);
      
      if (error) {
        console.log(`   ❌ ${update.title.substring(0, 30)}... - ${error.message}`);
      } else {
        console.log(`   ✅ ${update.title.substring(0, 40)}...`);
      }
    }
    
    // 验证结果
    console.log('\n📊 验证添加结果...');
    
    const { data: claudeResults } = await supabase
      .from('product_updates')
      .select('title, published_at')
      .eq('product_id', claudeProduct.id)
      .order('published_at', { ascending: false });
    
    const { data: claudeCodeResults } = await supabase
      .from('product_updates')
      .select('title, published_at')
      .eq('product_id', claudeCodeProduct.id)
      .order('published_at', { ascending: false });
    
    console.log(`\n🎉 Anthropic产品数据添加完成！`);
    console.log(`📈 Claude对话AI: ${claudeResults?.length || 0} 条更新`);
    console.log(`📈 Claude Code: ${claudeCodeResults?.length || 0} 条更新`);
    console.log(`📈 总计: ${(claudeResults?.length || 0) + (claudeCodeResults?.length || 0)} 条更新`);
    
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  addAntropicUpdates().then(() => {
    console.log('\n✨ Anthropic数据更新完成！');
    process.exit(0);
  }).catch(console.error);
}

module.exports = { addAntropicUpdates };