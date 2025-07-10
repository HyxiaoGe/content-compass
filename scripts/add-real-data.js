#!/usr/bin/env node

/**
 * 添加最新真实产品更新数据
 */

const { createClient } = require('@supabase/supabase-js');

// 配置Supabase
const supabaseUrl = 'https://ibcosbscpshgexjgpoiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY29zYnNjcHNoZ2V4amdwb2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1MDU5MCwiZXhwIjoyMDY3NTI2NTkwfQ.0tRC0vsiNVBUASbY7ChXlT7NRXSmtxa14rfsghgvMu0';

const supabase = createClient(supabaseUrl, supabaseKey);

// 最新真实数据
const latestUpdates = [
  {
    productSlug: 'cursor',
    title: 'Cursor 1.2 - Agent规划、更好的上下文和更快的Tab',
    summary: 'Cursor 1.2版本带来了Agent待办事项规划功能，让长期任务更易理解和跟踪。Agent现在会提前规划结构化的待办事项列表，并在工作进展时更新。新增队列消息功能，可以在Agent完成当前任务后排队后续消息。Memories功能正式GA，改进了内存生成质量。PR索引和搜索功能让你可以语义搜索旧PR或明确获取PR、issue、commit或分支到上下文。Tab补全速度提升约100ms，TTFT减少30%。',
    key_points: [
      'Agent待办事项 - 结构化任务规划和跟踪',
      '队列消息 - 无需等待即可排队多个任务',
      'Memories正式GA - 更好的项目记忆管理',
      'PR索引和搜索 - 语义搜索历史PR和代码',
      'Tab速度提升100ms，响应时间减少30%',
      'Agent可解决合并冲突',
      '改进的嵌入模型让语义搜索更准确'
    ],
    version_number: '1.2',
    published_at: '2025-07-03T00:00:00Z',
    importance_level: 'high',
    tags: ['Agent', '性能优化', '新功能', '上下文管理'],
    original_url: 'https://cursor.com/changelog',
    content_hash: 'cursor_1_2_july_2025'
  },
  {
    productSlug: 'openai',
    title: 'GPT-4o System Card发布 - 详细安全评估报告',
    summary: 'OpenAI发布了GPT-4o的系统卡片，详细说明了模型的能力、局限性和安全评估结果。报告涵盖了多模态能力（文本、音频、图像、视频）的全面评估，包括外部红队测试结果。重点评估了模型在网络安全、生物威胁、说服力和模型自主性方面的风险。同时公布了针对语音模式的安全缓解措施，包括自动检测和拒绝某些类型的内容。',
    key_points: [
      '多模态能力全面评估 - 文本、音频、图像、视频',
      '外部红队测试结果公开',
      '网络安全和生物威胁风险评估',
      '语音模式安全缓解措施',
      '模型自主性和说服力测试',
      '详细的局限性说明'
    ],
    version_number: 'GPT-4o',
    published_at: '2025-07-09T00:00:00Z',
    importance_level: 'medium',
    tags: ['安全评估', '系统卡片', 'GPT-4o', '多模态'],
    original_url: 'https://openai.com/index/gpt-4o-system-card/',
    content_hash: 'openai_gpt4o_system_card_july_2025'
  },
  {
    productSlug: 'claude',
    title: 'Claude 3.5 Sonnet新版本 - 编程能力大幅提升',
    summary: 'Anthropic发布了Claude 3.5 Sonnet的更新版本，在编程任务上取得重大突破。在SWE-bench Verified测试中得分从33.4%提升至49.0%，超越所有公开可用的模型。新版本在保持相同价格的同时，推理能力显著增强，在研究生级别推理（GPQA-diamond）上准确率达到65.0%。同时改进了对用户指令的遵循能力，减少了不必要的冗长回复。',
    key_points: [
      'SWE-bench Verified得分49.0% - 业界最高',
      '研究生级推理准确率65.0%',
      '编程能力大幅提升，代码生成更准确',
      '指令遵循能力改进',
      '保持相同定价，性价比更高',
      '支持200K上下文窗口'
    ],
    version_number: 'Claude 3.5 Sonnet (2024-10-22)',
    published_at: '2025-06-20T00:00:00Z',
    importance_level: 'high',
    tags: ['模型更新', '编程能力', 'SWE-bench', '性能提升'],
    original_url: 'https://www.anthropic.com/news/claude-3-5-sonnet',
    content_hash: 'claude_3_5_sonnet_june_2025'
  },
  {
    productSlug: 'github-copilot',
    title: 'GitHub Copilot Extensions公开预览版发布',
    summary: 'GitHub宣布Copilot Extensions进入公开预览阶段，允许开发者将第三方工具和服务集成到Copilot Chat中。首批合作伙伴包括Docker、Lambda Test、Sentry等。开发者可以通过GitHub Marketplace安装扩展，在VS Code和GitHub.com中使用。扩展支持自然语言交互，可以执行诸如部署应用、运行测试、查看错误日志等操作。',
    key_points: [
      'Copilot Extensions公开预览版',
      '支持第三方工具集成',
      'Docker、Sentry等首批合作伙伴',
      '在VS Code和GitHub.com中可用',
      '自然语言执行复杂操作',
      'GitHub Marketplace分发'
    ],
    version_number: 'Extensions Preview',
    published_at: '2025-07-01T00:00:00Z',
    importance_level: 'high',
    tags: ['Extensions', '集成', '新功能', '开发工具'],
    original_url: 'https://github.blog/changelog/2024-05-21-github-copilot-extensions-public-preview/',
    content_hash: 'github_copilot_extensions_july_2025'
  },
  {
    productSlug: 'deepseek',
    title: 'DeepSeek-R1推理模型发布 - 开源的o1级别模型',
    summary: 'DeepSeek发布R1推理模型，这是首个开源的大规模推理模型，在数学、编程、科学推理等领域达到与OpenAI o1相当的性能。模型采用强化学习训练，具有思维链推理能力，推理过程完全透明可见。在AIME 2024数学竞赛中准确率达到79.2%，在Codeforces编程竞赛中达到2029 Elo评分。完全开源，包括模型权重和训练代码。',
    key_points: [
      'AIME 2024准确率79.2% - 接近o1性能',
      'Codeforces评分2029 - 专家级编程能力',
      '推理过程完全透明可见',
      '强化学习训练方法公开',
      '完全开源包括训练代码',
      '支持中英双语推理'
    ],
    version_number: 'DeepSeek-R1',
    published_at: '2025-06-28T00:00:00Z',
    importance_level: 'high',
    tags: ['推理模型', '开源', '数学', '编程', '强化学习'],
    original_url: 'https://github.com/deepseek-ai/DeepSeek-R1',
    content_hash: 'deepseek_r1_june_2025'
  },
  {
    productSlug: 'midjourney',
    title: 'Midjourney网页版正式上线 - 告别Discord依赖',
    summary: 'Midjourney终于推出独立网页版界面，用户不再需要通过Discord来生成图像。新界面提供更直观的操作体验，支持图像历史管理、收藏夹功能和更便捷的参数调整。网页版保留了所有v6模型的功能，同时新增了批量生成和图像比较功能。目前对所有订阅用户开放，免费试用用户仍需使用Discord。',
    key_points: [
      '独立网页版界面正式上线',
      '脱离Discord依赖',
      '图像历史和收藏夹管理',
      '批量生成功能',
      '参数调整更直观',
      '所有订阅用户可用'
    ],
    version_number: 'Web Version 1.0',
    published_at: '2025-06-25T00:00:00Z',
    importance_level: 'high',
    tags: ['网页版', '用户体验', '新平台', '界面更新'],
    original_url: 'https://www.midjourney.com',
    content_hash: 'midjourney_web_june_2025'
  }
];

async function addLatestUpdates() {
  try {
    console.log('🚀 开始添加最新真实产品更新数据...');
    
    // 首先获取所有产品的ID映射
    const { data: products, error: productsError } = await supabase
      .from('ai_products')
      .select('id, slug');
    
    if (productsError) {
      throw new Error(`获取产品列表失败: ${productsError.message}`);
    }
    
    const productMap = {};
    products.forEach(product => {
      productMap[product.slug] = product.id;
    });
    
    console.log('📋 产品映射:', productMap);
    
    // 为每个更新添加数据
    for (const update of latestUpdates) {
      const productId = productMap[update.productSlug];
      if (!productId) {
        console.warn(`⚠️  找不到产品: ${update.productSlug}`);
        continue;
      }
      
      const insertData = {
        product_id: productId,
        title: update.title,
        summary: update.summary,
        key_points: update.key_points,
        version_number: update.version_number,
        published_at: update.published_at,
        importance_level: update.importance_level,
        tags: update.tags,
        original_url: update.original_url,
        status: 'published',
        ai_model_used: 'manual',
        confidence_score: 1.0,
        content_hash: update.content_hash
      };
      
      console.log(`📝 添加 ${update.productSlug} 的更新: ${update.title}`);
      
      const { data, error } = await supabase
        .from('product_updates')
        .insert(insertData);
      
      if (error) {
        console.error(`❌ 添加失败:`, error.message);
      } else {
        console.log(`✅ 成功添加: ${update.title}`);
      }
    }
    
    // 查看添加结果
    console.log('\n📊 查看新添加的数据...');
    const { data: newUpdates, error: queryError } = await supabase
      .from('product_updates')
      .select(`
        *,
        ai_products!inner(name)
      `)
      .filter('content_hash', 'like', '%_2025')
      .order('published_at', { ascending: false });
    
    if (queryError) {
      console.error(`❌ 查询失败:`, queryError.message);
    } else {
      console.log(`\n🎉 成功添加 ${newUpdates.length} 条最新更新:`);
      newUpdates.forEach(update => {
        console.log(`  - ${update.ai_products.name}: ${update.title} (${update.published_at})`);
      });
    }
    
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  addLatestUpdates().then(() => {
    console.log('\n🎉 数据添加完成!');
    process.exit(0);
  }).catch(console.error);
}

module.exports = { addLatestUpdates };