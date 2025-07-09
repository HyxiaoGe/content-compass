-- ContentCompass v2.0 - 测试数据种子脚本
-- 为10个AI产品添加示例更新记录

-- ===================================================
-- 1. Cursor (AI Code Editor)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'cursor'),
  'v0.43',
  '2025-01-15T00:00:00Z',
  'Cursor v0.43 - Agent规划系统与企业级Slack集成',
  'Cursor v0.43版本带来了突破性的Agent智能规划系统，可以为复杂任务创建结构化待办清单并跟踪依赖关系。新增企业级Slack集成，支持直接从Slack启动Background Agent。Tab补全速度提升100ms，新增PR语义搜索，Memory系统正式商用。',
  ARRAY[
    'Agent创建结构化待办清单，自动分解复杂任务并跟踪依赖关系',
    '队列消息系统：可预先排队多个Agent任务，支持任务重新排序',
    'Memory系统正式发布：改进生成质量，增加用户审批机制',
    'PR语义搜索：支持PR、issue、commit的深度搜索和索引',
    'Slack企业集成：直接从Slack启动Agent，理解线程上下文',
    'Tab补全性能优化：响应时间减少100ms，大幅提升编码流畅度'
  ],
  'high',
  ARRAY['agent', 'slack', 'memory', 'pr-indexing', 'planning'],
  'published',
  '2025-01-15T14:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'cursor'),
  'v0.42',
  '2025-01-08T00:00:00Z',
  'Cursor v0.42 - 多文件编辑与代码审查增强',
  'v0.42版本专注于提升多文件编辑体验，Agent现在可以同时修改多个相关文件，并提供智能代码审查建议。新增文件依赖分析功能，自动识别需要同步修改的文件。',
  ARRAY[
    '多文件Agent编辑：一次性修改多个相关文件',
    '智能代码审查：AI驱动的代码质量检查和建议',
    '文件依赖分析：自动识别文件间的依赖关系',
    'Git集成增强：更好的分支管理和冲突解决',
    '性能优化：大型项目加载速度提升40%'
  ],
  'medium',
  ARRAY['multi-file', 'code-review', 'dependencies', 'git', 'performance'],
  'published',
  '2025-01-08T10:00:00Z'
);

-- ===================================================
-- 2. Claude (AI Assistant)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'claude'),
  'Claude 3.5 Sonnet',
  '2025-01-10T00:00:00Z',
  'Claude 3.5 Sonnet发布 - 网页搜索与语音模式',
  'Anthropic推出Claude 3.5 Sonnet，引入实时网页搜索、语音对话模式和Projects协作功能。新增Computer Use计算机控制能力，可以直接操作屏幕和应用程序，重新定义AI助手的交互方式。',
  ARRAY[
    '实时网页搜索：访问最新信息，提供实时数据支持',
    '语音对话模式：自然语音交互，支持多轮对话',
    'Projects协作：团队项目管理和知识共享平台',
    'Computer Use：直接控制计算机界面和应用程序',
    '混合推理模式：快速响应与深度思考的智能切换',
    '上下文窗口扩展：支持更长文档和复杂任务处理'
  ],
  'high',
  ARRAY['web-search', 'voice', 'projects', 'computer-use', 'reasoning'],
  'published',
  '2025-01-10T16:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'claude'),
  'Claude 3.0 Opus',
  '2024-12-20T00:00:00Z',
  'Claude 3.0 Opus - 多模态能力全面升级',
  'Claude 3.0 Opus版本带来了显著的多模态处理能力提升，支持更复杂的图像分析、文档理解和创意生成任务。推理能力大幅增强，特别是在数学、编程和逻辑推理方面。',
  ARRAY[
    '多模态处理：图像、文档、图表的深度理解',
    '推理能力增强：数学、编程、逻辑推理准确性提升',
    '创意生成：更自然的写作和创意内容生成',
    '文档分析：PDF、表格、图表的智能解析',
    '代码理解：多语言代码分析和优化建议'
  ],
  'high',
  ARRAY['multimodal', 'reasoning', 'creativity', 'documents', 'coding'],
  'published',
  '2024-12-20T12:00:00Z'
);

-- ===================================================
-- 3. GitHub Copilot (Code Assistant)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'github-copilot'),
  'Copilot Chat 2.0',
  '2025-01-12T00:00:00Z',
  'GitHub Copilot Chat 2.0 - 智能代码对话助手',
  'GitHub Copilot Chat 2.0重新定义了代码协作体验，引入智能对话式编程，支持自然语言描述需求，AI自动生成完整的功能模块。新增代码库理解能力，可以分析整个项目结构并提供优化建议。',
  ARRAY[
    '对话式编程：自然语言描述需求，AI生成完整代码',
    '代码库智能分析：理解项目架构，提供重构建议',
    '多文件生成：一次性创建多个相关文件和模块',
    'PR自动生成：根据需求自动创建Pull Request',
    '测试用例生成：智能生成单元测试和集成测试',
    'Bug修复助手：自动识别和修复常见代码问题'
  ],
  'high',
  ARRAY['chat', 'codebase-analysis', 'multi-file', 'pr-generation', 'testing'],
  'published',
  '2025-01-12T09:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'github-copilot'),
  'Copilot Workspace',
  '2025-01-05T00:00:00Z',
  'Copilot Workspace - AI驱动的开发环境',
  'GitHub推出Copilot Workspace，一个完全由AI驱动的开发环境。从issue到代码实现的全流程自动化，支持复杂项目的端到端开发。集成了代码审查、测试和部署的完整工作流。',
  ARRAY[
    'AI开发工作流：从issue到代码的全自动化流程',
    '智能项目搭建：根据需求自动创建项目结构',
    '代码审查集成：AI驱动的代码质量检查',
    '自动化测试：智能生成和执行测试套件',
    '部署集成：与CI/CD管道的无缝集成'
  ],
  'high',
  ARRAY['workspace', 'automation', 'code-review', 'testing', 'deployment'],
  'published',
  '2025-01-05T11:00:00Z'
);

-- ===================================================
-- 4. OpenAI (AI Platform)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'openai'),
  'GPT-4o',
  '2025-01-18T00:00:00Z',
  'GPT-4o正式发布 - 多模态AI的新里程碑',
  'OpenAI正式发布GPT-4o，这是一个原生多模态模型，可以同时处理文本、图像、音频和视频。相比GPT-4 Turbo，推理速度提升2倍，成本降低50%，支持实时语音对话和视频分析。',
  ARRAY[
    '原生多模态：文本、图像、音频、视频的统一处理',
    '实时语音对话：低延迟的自然语音交互',
    '视频理解：视频内容分析和时间序列推理',
    '性能优化：推理速度提升2倍，成本降低50%',
    'API增强：新的流式处理和批量处理能力',
    '安全性提升：更强的内容过滤和安全防护'
  ],
  'high',
  ARRAY['gpt-4o', 'multimodal', 'voice', 'video', 'performance', 'api'],
  'published',
  '2025-01-18T15:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'openai'),
  'o1-preview',
  '2025-01-03T00:00:00Z',
  'o1推理模型预览版 - 突破性思维链技术',
  'OpenAI发布o1推理模型预览版，专门针对复杂推理任务优化。采用思维链技术，在数学、科学、编程等领域展现出接近人类专家水平的推理能力。特别在竞赛数学和代码优化方面表现突出。',
  ARRAY[
    '思维链推理：模拟人类逐步推理过程',
    '数学专家级能力：解决复杂数学和物理问题',
    '代码优化：高质量代码生成和算法优化',
    '科学研究助手：协助复杂科学问题分析',
    '逻辑推理增强：处理多步骤逻辑问题',
    '安全对齐：更好的价值对齐和安全性'
  ],
  'high',
  ARRAY['o1', 'reasoning', 'mathematics', 'coding', 'science', 'logic'],
  'published',
  '2025-01-03T13:00:00Z'
);

-- ===================================================
-- 5. Stability AI (AI Image Generation)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'stability-ai'),
  'SDXL Turbo',
  '2025-01-14T00:00:00Z',
  'SDXL Turbo发布 - 实时图像生成革命',
  'Stability AI发布SDXL Turbo，实现了真正的实时图像生成。单步去噪技术使得生成时间缩短至1秒以内，同时保持高质量输出。支持实时编辑和交互式创作工作流。',
  ARRAY[
    '实时生成：1秒内完成高质量图像生成',
    '单步去噪：革命性的快速采样技术',
    '实时编辑：即时预览编辑效果',
    '交互式创作：拖拽式图像编辑界面',
    '移动端优化：支持移动设备实时生成',
    'API集成：简化的开发者接口'
  ],
  'high',
  ARRAY['sdxl-turbo', 'real-time', 'fast-generation', 'interactive', 'mobile', 'api'],
  'published',
  '2025-01-14T14:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'stability-ai'),
  'Stable Video 3D',
  '2024-12-28T00:00:00Z',
  'Stable Video 3D - 视频到3D模型生成',
  'Stability AI推出Stable Video 3D，可以从单个视频生成高质量的3D模型。支持360度视角重建，为VR/AR内容创作、游戏开发和产品设计提供强大工具。',
  ARRAY[
    '视频转3D：从视频自动生成3D模型',
    '360度重建：完整的三维空间重建',
    'VR/AR支持：针对虚拟现实优化',
    '游戏资产生成：快速创建游戏3D资源',
    '产品设计工具：支持工业设计工作流',
    '高质量输出：专业级3D模型质量'
  ],
  'medium',
  ARRAY['3d-generation', 'video-to-3d', 'vr-ar', 'gaming', 'design', 'reconstruction'],
  'published',
  '2024-12-28T10:00:00Z'
);

-- ===================================================
-- 6. Alibaba Qwen (AI Language Model)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'qwen'),
  'Qwen2.5-72B',
  '2025-01-16T00:00:00Z',
  'Qwen2.5-72B发布 - 中文理解新标杆',
  '阿里巴巴发布Qwen2.5-72B，在中文理解和生成方面达到新的行业标杆。特别针对中文文化、历史、文学等领域进行深度优化，同时保持强大的多语言能力。支持32K上下文长度。',
  ARRAY[
    '中文理解升级：文化、历史、文学领域深度优化',
    '长文本处理：支持32K token上下文长度',
    '多模态能力：图文理解和生成能力增强',
    '代码生成：中文注释的代码生成和解释',
    '数学推理：中文数学问题求解能力提升',
    '安全对齐：符合中文语境的安全价值观'
  ],
  'high',
  ARRAY['chinese', 'long-context', 'multimodal', 'coding', 'mathematics', 'safety'],
  'published',
  '2025-01-16T11:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'qwen'),
  'QwenVL-Chat',
  '2025-01-02T00:00:00Z',
  'QwenVL-Chat - 多模态对话系统',
  'QwenVL-Chat是专门针对视觉理解优化的多模态对话系统。支持图像分析、图表理解、OCR识别等功能，特别在中文场景下的图文理解方面表现优异。',
  ARRAY[
    '视觉理解：图像内容深度分析和理解',
    '图表解读：数据图表的智能分析',
    'OCR识别：中英文文字识别和理解',
    '多轮对话：基于图像的多轮交互',
    '文档分析：PDF、PPT等文档的智能解析',
    '教育应用：支持在线教育和题目解答'
  ],
  'medium',
  ARRAY['vision', 'ocr', 'charts', 'documents', 'education', 'chinese'],
  'published',
  '2025-01-02T09:00:00Z'
);

-- ===================================================
-- 7. Google Gemini (AI Assistant)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'gemini'),
  'Gemini 2.0 Flash',
  '2025-01-20T00:00:00Z',
  'Gemini 2.0 Flash - 下一代多模态AI助手',
  'Google发布Gemini 2.0 Flash，这是一个全新架构的多模态AI助手。支持实时语音对话、屏幕理解、以及与Google生态系统的深度集成。推理速度提升3倍，支持更复杂的多步骤任务。',
  ARRAY[
    '实时多模态：语音、视觉、文本的实时交互',
    '屏幕理解：直接理解和操作屏幕内容',
    'Google生态集成：与Gmail、Drive、Calendar无缝集成',
    '推理速度提升：比Gemini 1.5快3倍',
    '多步骤任务：复杂工作流的自动化执行',
    'Developer API：为开发者提供强大的API接口'
  ],
  'high',
  ARRAY['gemini-2.0', 'multimodal', 'real-time', 'google-integration', 'performance', 'api'],
  'published',
  '2025-01-20T16:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'gemini'),
  'Gemini Advanced',
  '2025-01-07T00:00:00Z',
  'Gemini Advanced - 专业级AI工作助手',
  'Google推出Gemini Advanced订阅服务，提供专业级AI能力。包括更长的上下文窗口、优先级处理、以及专业领域的特化模型。特别适合研究、编程、内容创作等专业场景。',
  ARRAY[
    '专业级能力：针对特定领域优化的AI模型',
    '长上下文：支持100万token的超长上下文',
    '优先级处理：订阅用户享受优先响应',
    '专业模板：预置的专业工作流模板',
    '数据安全：企业级数据保护和隐私控制',
    'Workspace集成：与Google Workspace深度整合'
  ],
  'medium',
  ARRAY['advanced', 'professional', 'long-context', 'priority', 'security', 'workspace'],
  'published',
  '2025-01-07T13:00:00Z'
);

-- ===================================================
-- 8. DeepSeek (AI Reasoning Model)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'deepseek'),
  'DeepSeek-R1',
  '2025-01-21T00:00:00Z',
  'DeepSeek-R1发布 - 开源推理模型的突破',
  'DeepSeek发布R1推理模型，这是首个开源的大规模推理模型，在数学、编程、科学推理等领域达到GPT-4级别性能。采用创新的强化学习训练方法，推理过程可视化，完全开源。',
  ARRAY[
    '开源推理模型：首个开源的大规模推理AI',
    '强化学习训练：创新的RL训练方法',
    '推理过程可视化：展示完整的思考过程',
    '数学专业能力：竞赛级数学问题求解',
    '编程算法优化：高质量代码生成和优化',
    '完全开源：模型权重和训练代码全部开放'
  ],
  'high',
  ARRAY['reasoning', 'open-source', 'reinforcement-learning', 'mathematics', 'coding', 'visualization'],
  'published',
  '2025-01-21T12:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'deepseek'),
  'DeepSeek-Coder-V2',
  '2025-01-09T00:00:00Z',
  'DeepSeek-Coder-V2 - 开源代码生成专家',
  'DeepSeek推出Coder-V2，专门针对代码生成和理解优化的开源模型。支持338种编程语言，在代码补全、bug修复、代码解释等任务上表现优异，完全免费使用。',
  ARRAY[
    '338种编程语言：覆盖主流和小众编程语言',
    '代码补全：智能的代码自动完成',
    'Bug修复：自动识别和修复代码问题',
    '代码解释：详细的代码逻辑解释',
    '算法优化：性能优化建议和重构',
    '免费开源：完全免费的商业使用许可'
  ],
  'medium',
  ARRAY['coding', 'open-source', 'code-completion', 'bug-fixing', 'optimization', 'free'],
  'published',
  '2025-01-09T15:00:00Z'
);

-- ===================================================
-- 9. Claude Code (AI Code Assistant)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'claude-code'),
  'Claude Code 1.0',
  '2025-01-17T00:00:00Z',
  'Claude Code 1.0正式发布 - AI编程助手新标杆',
  'Anthropic正式发布Claude Code 1.0，这是专门为编程场景优化的AI助手。集成了代码生成、调试、重构、测试等完整的开发工作流。支持与VS Code、JetBrains等主流IDE深度集成。',
  ARRAY[
    '专业编程助手：针对编程场景深度优化',
    'IDE深度集成：VS Code、JetBrains无缝集成',
    '完整开发工作流：从设计到测试的全流程支持',
    '智能代码审查：AI驱动的代码质量检查',
    '多语言支持：50+编程语言和框架',
    '团队协作：支持团队代码标准和最佳实践'
  ],
  'high',
  ARRAY['claude-code', 'ide-integration', 'workflow', 'code-review', 'multi-language', 'collaboration'],
  'published',
  '2025-01-17T10:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'claude-code'),
  'Claude Code Beta',
  '2024-12-15T00:00:00Z',
  'Claude Code Beta测试版 - 开发者预览',
  'Claude Code Beta版本开放给开发者社区测试。提供基础的代码生成、解释和优化功能。收集开发者反馈，为正式版本做准备。支持Python、JavaScript、TypeScript等主流语言。',
  ARRAY[
    '开发者预览：面向开发者社区的早期版本',
    '基础代码功能：代码生成、解释、优化',
    '主流语言支持：Python、JS、TS等热门语言',
    '社区反馈：收集开发者使用反馈',
    '性能测试：大规模代码库的处理能力测试',
    '安全性验证：代码安全性和隐私保护测试'
  ],
  'medium',
  ARRAY['beta', 'preview', 'community', 'feedback', 'performance', 'security'],
  'published',
  '2024-12-15T14:00:00Z'
);

-- ===================================================
-- 10. Midjourney (AI Image Generation)
-- ===================================================

INSERT INTO product_updates (
  product_id, 
  version_number, 
  release_date, 
  title, 
  summary, 
  key_points, 
  importance_level, 
  tags, 
  status, 
  published_at
) VALUES 
(
  (SELECT id FROM ai_products WHERE slug = 'midjourney'),
  'V7 Alpha',
  '2025-01-19T00:00:00Z',
  'Midjourney V7 Alpha - 照片级真实感突破',
  'Midjourney发布V7 Alpha版本，在图像真实感方面实现重大突破。新的模型架构显著提升了人像、风景、产品渲染的真实度，同时保持了艺术创作的灵活性。支持更精确的提示词控制。',
  ARRAY[
    '照片级真实感：人像和场景的超真实渲染',
    '精确提示控制：更准确的提示词理解和执行',
    '风格一致性：系列图像的风格保持一致',
    '产品渲染：专业级产品展示图生成',
    '艺术创作平衡：真实感与艺术性的完美平衡',
    '性能优化：生成速度提升30%'
  ],
  'high',
  ARRAY['v7', 'photorealistic', 'prompt-control', 'consistency', 'product-rendering', 'performance'],
  'published',
  '2025-01-19T18:00:00Z'
),
(
  (SELECT id FROM ai_products WHERE slug = 'midjourney'),
  'Style Reference 2.0',
  '2025-01-11T00:00:00Z',
  'Style Reference 2.0 - 艺术风格精确控制',
  'Midjourney推出Style Reference 2.0功能，允许用户上传参考图像来精确控制生成图像的艺术风格。支持多个风格的混合、风格强度调节，为创作者提供前所未有的创作控制力。',
  ARRAY[
    '精确风格控制：基于参考图像的风格迁移',
    '多风格混合：同时应用多个艺术风格',
    '强度调节：精确控制风格应用的强度',
    '创作自由度：保持内容创意的同时控制风格',
    '商业应用：品牌视觉一致性的专业工具',
    '易用界面：简化的风格参考操作流程'
  ],
  'medium',
  ARRAY['style-reference', 'style-control', 'mixing', 'creativity', 'branding', 'usability'],
  'published',
  '2025-01-11T12:00:00Z'
);

-- 更新统计信息
ANALYZE ai_products;
ANALYZE product_updates;