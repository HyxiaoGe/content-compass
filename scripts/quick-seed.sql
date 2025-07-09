-- 快速测试数据 - 每个产品添加1-2条记录

-- Cursor
INSERT INTO product_updates (product_id, title, summary, key_points, importance_level, tags, status, published_at)
SELECT id, 
  'Cursor v0.43 - Agent规划系统与企业级Slack集成', 
  'Cursor v0.43版本带来了突破性的Agent智能规划系统，支持Slack集成和Memory系统。', 
  ARRAY['Agent智能规划', 'Slack企业集成', 'Memory系统', 'Tab补全优化'],
  'high',
  ARRAY['agent', 'slack', 'memory'],
  'published',
  NOW() - INTERVAL '2 days'
FROM ai_products WHERE slug = 'cursor';

-- Claude  
INSERT INTO product_updates (product_id, title, summary, key_points, importance_level, tags, status, published_at)
SELECT id,
  'Claude 3.5 Sonnet - 网页搜索与语音模式',
  'Claude 3.5 Sonnet引入实时网页搜索、语音对话模式和Computer Use计算机控制能力。',
  ARRAY['实时网页搜索', '语音对话模式', 'Computer Use', '混合推理模式'],
  'high', 
  ARRAY['web-search', 'voice', 'computer-use'],
  'published',
  NOW() - INTERVAL '3 days'
FROM ai_products WHERE slug = 'claude';

-- GitHub Copilot
INSERT INTO product_updates (product_id, title, summary, key_points, importance_level, tags, status, published_at)
SELECT id,
  'GitHub Copilot Chat 2.0 - 智能代码对话助手',
  'GitHub Copilot Chat 2.0支持对话式编程，可以分析整个项目结构并提供优化建议。',
  ARRAY['对话式编程', '代码库智能分析', '多文件生成', 'PR自动生成'],
  'high',
  ARRAY['chat', 'codebase-analysis', 'automation'],
  'published', 
  NOW() - INTERVAL '1 day'
FROM ai_products WHERE slug = 'github-copilot';

-- OpenAI
INSERT INTO product_updates (product_id, title, summary, key_points, importance_level, tags, status, published_at)
SELECT id,
  'GPT-4o正式发布 - 多模态AI的新里程碑',
  'OpenAI正式发布GPT-4o，原生多模态模型，推理速度提升2倍，成本降低50%。',
  ARRAY['原生多模态', '实时语音对话', '视频理解', '性能优化'],
  'high',
  ARRAY['gpt-4o', 'multimodal', 'performance'],
  'published',
  NOW() - INTERVAL '4 days'
FROM ai_products WHERE slug = 'openai';

-- Stability AI
INSERT INTO product_updates (product_id, title, summary, key_points, importance_level, tags, status, published_at)
SELECT id,
  'SDXL Turbo - 实时图像生成革命', 
  'Stability AI发布SDXL Turbo，实现真正的实时图像生成，单步去噪技术生成时间缩短至1秒。',
  ARRAY['实时生成', '单步去噪', '实时编辑', '交互式创作'],
  'high',
  ARRAY['sdxl-turbo', 'real-time', 'fast-generation'],
  'published',
  NOW() - INTERVAL '5 days'
FROM ai_products WHERE slug = 'stability-ai';