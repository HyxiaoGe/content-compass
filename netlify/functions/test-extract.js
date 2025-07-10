/**
 * 测试内容提取
 */
exports.handler = async (event, context) => {
  // 模拟一些真实的更新内容
  const testUpdates = [
    {
      productSlug: 'cursor',
      title: 'Cursor 1.2 - Agent Planning, Better Context & Faster Tab',
      content: 'Cursor 1.2版本发布，带来了Agent计划功能、更好的上下文管理和更快的Tab补全。Agent现在可以提前规划结构化的待办事项列表，使长期任务更容易理解和跟踪。',
      publishDate: new Date('2025-07-03'),
      source: 'changelog'
    },
    {
      productSlug: 'openai',
      title: 'GPT-4o System Card and Safety Evaluations',
      content: 'OpenAI发布了GPT-4o的系统卡片和安全评估报告，详细说明了模型的能力、限制和安全措施。报告涵盖了多模态能力的评估结果。',
      publishDate: new Date('2025-07-09'),
      source: 'blog'
    },
    {
      productSlug: 'claude',
      title: 'Claude 3.5 Sonnet - 更强大的编程和推理能力',
      content: 'Anthropic发布Claude 3.5 Sonnet更新版本，在保持相同成本的情况下，显著提升了编程、推理和视觉处理能力。SWE-bench评测分数达到92.0%。',
      publishDate: new Date('2025-07-08'),
      source: 'news'
    },
    {
      productSlug: 'github-copilot',
      title: 'GitHub Copilot in Azure Data Studio',
      content: 'GitHub Copilot现在可以在Azure Data Studio中使用，为数据库开发者提供AI辅助的SQL查询编写和数据分析功能。',
      publishDate: new Date('2025-07-05'),
      source: 'blog'
    }
  ];

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      message: '这些是我们应该能爬取到的真实更新示例',
      updates: testUpdates,
      note: '如果爬取返回0条，说明HTML解析有问题'
    }, null, 2)
  };
};