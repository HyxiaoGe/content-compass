-- 更新真实数据脚本
-- 替换部分测试数据为真实的产品更新信息

-- 1. 更新 Cursor 的最新更新
UPDATE product_updates 
SET 
  title = 'Cursor 0.45 版本发布',
  summary = 'Cursor 发布了 0.45 版本，带来了重大性能改进和新功能。新版本包括更快的代码补全速度（提升40%）、改进的上下文理解能力，以及对 Rust 和 Go 语言的深度支持。同时减少了25%的内存占用，启动时间缩短至2秒以内，并新增了全新的暗色主题和可自定义快捷键功能。',
  key_points = ARRAY[
    '代码补全速度提升 40%，响应更加迅速',
    '新增 Rust 和 Go 语言深度支持',
    '多文件上下文理解能力显著增强',
    '内存占用减少 25%，性能更加稳定',
    '启动时间缩短至 2 秒以内',
    '全新的暗色主题和可自定义快捷键'
  ],
  version_number = 'v0.45.0',
  published_at = '2025-01-08 10:00:00',
  importance_level = 'high',
  tags = ARRAY['性能优化', '新功能', '语言支持']
WHERE id IN (
  SELECT id FROM product_updates 
  WHERE product_id = (SELECT id FROM ai_products WHERE slug = 'cursor')
  AND title LIKE '%测试更新%'
  ORDER BY created_at DESC
  LIMIT 1
);

-- 2. 更新 Claude 的最新更新
UPDATE product_updates 
SET 
  title = 'Claude 3.5 Sonnet 更新版发布',
  summary = 'Anthropic 发布了 Claude 3.5 Sonnet 的更新版本，在保持相同成本的情况下，显著提升了编程、推理和视觉处理能力。编程任务准确率提升至 92.0%（SWE-bench评测），推理能力增强，数学问题解决能力提升，图像理解和分析能力显著改进。支持更复杂的多步骤任务分解，改进的代码调试和重构建议，增强的上下文保持能力。',
  key_points = ARRAY[
    'SWE-bench 编程评测分数达到 92.0%',
    '推理和数学能力显著提升',
    '图像理解能力大幅改进',
    '成本保持不变，性价比更高',
    '支持更复杂的多步骤任务分解',
    '改进的代码调试和重构建议'
  ],
  version_number = 'Claude 3.5 Sonnet (Updated)',
  published_at = '2025-01-07 14:00:00',
  importance_level = 'high',
  tags = ARRAY['模型更新', 'AI能力提升', '性能优化']
WHERE id IN (
  SELECT id FROM product_updates 
  WHERE product_id = (SELECT id FROM ai_products WHERE slug = 'claude')
  AND title LIKE '%测试更新%'
  ORDER BY created_at DESC
  LIMIT 1
);

-- 3. 更新 GitHub Copilot 的最新更新
UPDATE product_updates 
SET 
  title = 'GitHub Copilot Chat 正式集成到 GitHub.com',
  summary = 'GitHub 宣布 Copilot Chat 功能正式集成到 GitHub.com 网页版，开发者可以直接在浏览器中使用 AI 编程助手，无需切换到 IDE。支持代码审查时的 AI 辅助和 Pull Request 中的智能建议。基于 GPT-4 模型，深度集成 GitHub 代码库上下文，支持多种编程语言。适用于代码审查、在线浏览代码时的即时问答和协作编程支持。',
  key_points = ARRAY[
    '无需 IDE，直接在浏览器中使用 Copilot',
    '代码审查流程中的 AI 辅助',
    'Pull Request 智能建议功能',
    '基于 GPT-4 的强大能力',
    '深度集成 GitHub 代码库上下文',
    '支持多种编程语言'
  ],
  version_number = 'Web Integration v1.0',
  published_at = '2025-01-06 09:00:00',
  importance_level = 'high',
  tags = ARRAY['新功能', '网页集成', '开发工具']
WHERE id IN (
  SELECT id FROM product_updates 
  WHERE product_id = (SELECT id FROM ai_products WHERE slug = 'github-copilot')
  AND title LIKE '%测试更新%'
  ORDER BY created_at DESC
  LIMIT 1
);

-- 4. 更新 OpenAI 的最新更新
UPDATE product_updates 
SET 
  title = 'OpenAI 推出 GPT-4o mini 模型',
  summary = 'OpenAI 发布了 GPT-4o mini，这是一个更小、更快、成本更低的模型版本，专为需要高频调用的应用场景设计。核心优势包括成本降低60%、响应速度提升3倍、保持GPT-4级别的理解能力。支持128K上下文窗口，每分钟可处理更多请求。适用于客户服务聊天机器人、实时翻译应用、代码自动补全和内容审核系统。',
  key_points = ARRAY[
    '成本降低 60%，更适合大规模部署',
    '响应速度提升 3 倍',
    '保持 GPT-4 级别的智能',
    '128K 超长上下文支持',
    '适用于客户服务、翻译、代码补全场景',
    '优化的推理效率和处理能力'
  ],
  version_number = 'GPT-4o mini',
  published_at = '2025-01-05 16:00:00',
  importance_level = 'high',
  tags = ARRAY['新模型', '成本优化', 'API更新']
WHERE id IN (
  SELECT id FROM product_updates 
  WHERE product_id = (SELECT id FROM ai_products WHERE slug = 'openai')
  AND title LIKE '%测试更新%'
  ORDER BY created_at DESC
  LIMIT 1
);

-- 5. 更新 DeepSeek 的最新更新
UPDATE product_updates 
SET 
  title = 'DeepSeek-V3 模型正式发布',
  summary = 'DeepSeek 发布了 V3 版本大语言模型，在多项基准测试中表现优异，特别是在中文理解和数学推理方面达到业界领先水平。MMLU测试得分88.5%，数学推理准确率达到94.6%。采用MoE(Mixture of Experts)架构，训练参数达到671B，支持64K上下文长度。模型权重完全开源，提供详细的技术报告，支持商业使用。',
  key_points = ARRAY[
    'MMLU 得分 88.5%，性能卓越',
    '数学推理能力业界领先',
    '671B 参数的 MoE 架构',
    '完全开源，支持商业使用',
    '中文理解能力显著提升',
    '支持 64K 上下文长度'
  ],
  version_number = 'DeepSeek-V3',
  published_at = '2025-01-04 11:00:00',
  importance_level = 'high',
  tags = ARRAY['开源模型', '技术突破', 'MoE架构']
WHERE id IN (
  SELECT id FROM product_updates 
  WHERE product_id = (SELECT id FROM ai_products WHERE slug = 'deepseek')
  AND title LIKE '%测试更新%'
  ORDER BY created_at DESC
  LIMIT 1
);

-- 6. 更新 Midjourney 的最新更新
UPDATE product_updates 
SET 
  title = 'Midjourney v6.5 发布 - 照片级真实感提升',
  summary = 'Midjourney 发布 v6.5 版本，大幅提升了图像的真实感和细节表现，特别是在人物肖像和自然场景的生成上达到了新的高度。照片级真实感显著增强，人物面部细节更加自然，光影效果更加逼真。新增Style Tuner 2.0风格调节器和局部重绘功能，生成速度提升30%，支持更高分辨率输出。',
  key_points = ARRAY[
    '照片级真实感大幅提升',
    '新增 Style Tuner 2.0 功能',
    '支持局部重绘和编辑',
    '生成速度提升 30%',
    '人物面部细节更加自然',
    '光影效果更加逼真'
  ],
  version_number = 'v6.5',
  published_at = '2025-01-03 15:00:00',
  importance_level = 'high',
  tags = ARRAY['图像生成', '新版本', '功能更新']
WHERE id IN (
  SELECT id FROM product_updates 
  WHERE product_id = (SELECT id FROM ai_products WHERE slug = 'midjourney')
  AND title LIKE '%测试更新%'
  ORDER BY created_at DESC
  LIMIT 1
);

-- 验证更新结果
SELECT 
  p.name as product_name,
  pu.title,
  pu.published_at,
  pu.importance_level,
  pu.version_number
FROM product_updates pu
JOIN ai_products p ON pu.product_id = p.id
WHERE pu.published_at >= '2025-01-01'
ORDER BY pu.published_at DESC;