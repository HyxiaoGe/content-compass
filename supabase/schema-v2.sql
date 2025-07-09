-- ContentCompass AI信息聚合站 - 数据库Schema v2.0
-- 基于10个AI产品的数据结构优化设计
-- 支持：定时爬取、AI处理、内容管理、多版本历史记录

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 用于全文搜索

-- =================
-- 1. 核心产品表
-- =================

-- AI产品表 (替代之前的monitor_sources，更专注于产品信息)
CREATE TABLE ai_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- 产品名称 如 "Cursor", "Claude", "Claude Code"
  slug TEXT UNIQUE NOT NULL, -- URL友好标识符
  category TEXT NOT NULL, -- 产品分类 如 "Code Editor", "AI Assistant", "AI Image Generation"
  description TEXT, -- 产品简介
  logo_url TEXT, -- 产品Logo URL
  homepage_url TEXT, -- 产品主页
  
  -- 爬取配置
  changelog_url TEXT, -- 主要changelog URL
  additional_urls TEXT[], -- 额外的信息源URLs
  scraper_config JSONB, -- 爬虫配置 {"selector": ".changelog-item", "interval": "daily"}
  
  -- 状态管理
  is_active BOOLEAN DEFAULT true, -- 是否启用监控
  last_crawled_at TIMESTAMP WITH TIME ZONE, -- 上次爬取时间
  crawl_status TEXT DEFAULT 'pending' CHECK (crawl_status IN ('pending', 'running', 'success', 'error')),
  crawl_error TEXT, -- 爬取错误信息
  
  -- 显示配置
  display_order INTEGER DEFAULT 0, -- 前台显示顺序
  is_featured BOOLEAN DEFAULT false, -- 是否精选显示
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- 2. 内容版本表
-- =================

-- 产品更新内容表 (支持多版本历史记录)
CREATE TABLE product_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES ai_products(id) ON DELETE CASCADE,
  
  -- 版本信息
  version_number TEXT, -- 版本号 如 "v7", "1.2", "GPT-4o"
  release_date TIMESTAMP WITH TIME ZONE, -- 发布日期
  
  -- 原始内容信息
  title TEXT NOT NULL, -- 更新标题
  original_url TEXT, -- 原文链接
  raw_content TEXT, -- 原始HTML/文本内容
  content_hash TEXT, -- 内容哈希，用于检测变化
  
  -- AI处理后的结构化内容
  summary TEXT NOT NULL, -- AI生成的摘要 (150-300字)
  key_points TEXT[] NOT NULL, -- 关键要点数组 (5-8个)
  importance_level TEXT DEFAULT 'medium' CHECK (importance_level IN ('high', 'medium', 'low')),
  tags TEXT[] DEFAULT '{}', -- 标签数组
  
  -- 内容状态
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- AI处理元数据
  ai_model_used TEXT, -- 使用的AI模型
  tokens_consumed INTEGER DEFAULT 0, -- 消耗的token数
  processing_cost_cents INTEGER DEFAULT 0, -- 处理成本(分)
  confidence_score DECIMAL(3,2), -- AI处理置信度 0.00-1.00
  
  -- 审核信息 (可选，用于手动标记)
  review_notes TEXT, -- 审核备注
  
  -- 时间戳
  scraped_at TIMESTAMP WITH TIME ZONE, -- 爬取时间
  processed_at TIMESTAMP WITH TIME ZONE, -- AI处理时间
  published_at TIMESTAMP WITH TIME ZONE, -- 发布时间
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- 3. 爬取任务表
-- =================

-- 爬取任务队列表
CREATE TABLE crawl_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES ai_products(id) ON DELETE CASCADE,
  
  task_type TEXT DEFAULT 'scheduled' CHECK (task_type IN ('scheduled', 'manual', 'retry')),
  priority INTEGER DEFAULT 5, -- 优先级 1-10，数字越小优先级越高
  
  -- 任务状态
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- 结果信息
  result_message TEXT,
  items_found INTEGER DEFAULT 0, -- 发现的新内容数量
  items_processed INTEGER DEFAULT 0, -- 成功处理的内容数量
  
  -- 执行信息
  execution_time_ms INTEGER, -- 执行时间(毫秒)
  retry_count INTEGER DEFAULT 0, -- 重试次数
  max_retries INTEGER DEFAULT 3, -- 最大重试次数
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- 4. 系统管理表
-- =================

-- 系统日志表 (简化版，不关联用户)
CREATE TABLE system_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  level TEXT DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error')),
  category TEXT, -- 'crawler', 'ai_processing', 'api'
  message TEXT NOT NULL,
  details JSONB, -- 详细信息
  product_id UUID REFERENCES ai_products(id), -- 相关产品(可选)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 系统配置表
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general', -- 'general', 'crawler', 'ai', 'display'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- 5. 索引优化
-- =================

-- 产品表索引
CREATE INDEX idx_ai_products_active ON ai_products (is_active) WHERE is_active = true;
CREATE INDEX idx_ai_products_display_order ON ai_products (display_order, is_featured);
CREATE INDEX idx_ai_products_slug ON ai_products (slug);

-- 更新内容表索引
CREATE INDEX idx_product_updates_published ON product_updates (status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_product_updates_product_id ON product_updates (product_id);
CREATE INDEX idx_product_updates_importance ON product_updates (importance_level);
CREATE INDEX idx_product_updates_tags ON product_updates USING gin(tags);
CREATE INDEX idx_product_updates_version ON product_updates (product_id, version_number);
CREATE INDEX idx_product_updates_hash ON product_updates (content_hash);

-- 爬取任务表索引
CREATE INDEX idx_crawl_tasks_status ON crawl_tasks (status, priority);
CREATE INDEX idx_crawl_tasks_product_id ON crawl_tasks (product_id);
CREATE INDEX idx_crawl_tasks_created_at ON crawl_tasks (created_at DESC);

-- 系统日志索引
CREATE INDEX idx_system_logs_level ON system_logs (level, created_at DESC);
CREATE INDEX idx_system_logs_category ON system_logs (category, created_at DESC);

-- =================
-- 6. 视图和函数
-- =================

-- 前台展示视图 (最新发布内容)
CREATE VIEW latest_updates AS
SELECT 
  pu.id,
  pu.product_id,
  ap.name as product_name,
  ap.slug as product_slug,
  ap.category,
  ap.logo_url,
  pu.title,
  pu.summary,
  pu.key_points,
  pu.importance_level,
  pu.tags,
  pu.published_at,
  pu.original_url
FROM product_updates pu
JOIN ai_products ap ON pu.product_id = ap.id
WHERE pu.status = 'published' 
  AND ap.is_active = true
ORDER BY pu.published_at DESC;

-- 系统统计视图 (用于监控)
CREATE VIEW system_stats AS
SELECT 
  (SELECT COUNT(*) FROM ai_products WHERE is_active = true) as active_products,
  (SELECT COUNT(*) FROM product_updates WHERE status = 'published') as published_updates,
  (SELECT COUNT(*) FROM product_updates WHERE status = 'draft') as draft_updates,
  (SELECT COUNT(*) FROM crawl_tasks WHERE status = 'pending') as pending_tasks,
  (SELECT COUNT(*) FROM crawl_tasks WHERE status = 'failed') as failed_tasks,
  (SELECT SUM(tokens_consumed) FROM product_updates WHERE created_at >= NOW() - INTERVAL '30 days') as tokens_30d,
  (SELECT SUM(processing_cost_cents) FROM product_updates WHERE created_at >= NOW() - INTERVAL '30 days') as cost_30d_cents;

-- 自动更新 updated_at 字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 应用触发器到所有需要的表
CREATE TRIGGER update_ai_products_updated_at BEFORE UPDATE ON ai_products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_updates_updated_at BEFORE UPDATE ON product_updates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crawl_tasks_updated_at BEFORE UPDATE ON crawl_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================
-- 7. 初始数据
-- =================

-- 系统配置初始值
INSERT INTO system_settings (key, value, description, category) VALUES
('site_title', '"ContentCompass"', '网站标题', 'general'),
('site_description', '"AI产品更新信息聚合站"', '网站描述', 'general'),
('max_daily_crawls', '50', '每日最大爬取任务数', 'crawler'),
('ai_model_primary', '"gpt-4o-mini"', '主要AI处理模型', 'ai'),
('ai_model_backup', '"gpt-3.5-turbo"', '备用AI处理模型', 'ai'),
('crawl_interval_hours', '24', '爬取间隔时间(小时)', 'crawler'),
('items_per_page', '20', '每页显示项目数', 'display'),
('featured_products_count', '8', '精选产品数量', 'display');

-- 10个AI产品初始数据
INSERT INTO ai_products (name, slug, category, description, logo_url, homepage_url, changelog_url, display_order, is_featured) VALUES
('Cursor', 'cursor', 'AI Code Editor', 'AI-powered code editor with agent capabilities', 'https://cursor.sh/favicon.ico', 'https://cursor.sh', 'https://cursor.sh/changelog', 1, true),
('Claude', 'claude', 'AI Assistant', 'Anthropic的对话AI助手', 'https://www.anthropic.com/favicon.ico', 'https://claude.ai', 'https://www.anthropic.com/news', 2, true),
('GitHub Copilot', 'github-copilot', 'Code Assistant', 'GitHub的AI编程助手', 'https://github.com/favicon.ico', 'https://github.com/features/copilot', 'https://github.com/features/copilot/whats-new', 3, true),
('OpenAI', 'openai', 'AI Platform', 'OpenAI API和产品更新', 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/openai-icon.png', 'https://openai.com', 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes', 4, true),
('Stability AI', 'stability-ai', 'AI Image Generation', 'Stable Diffusion图像生成平台', 'https://stability.ai/favicon.ico', 'https://stability.ai', 'https://stability.ai/news', 5, true),
('Alibaba Qwen', 'qwen', 'AI Language Model', '阿里巴巴通义千问大语言模型', 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/alibaba-icon.png', 'https://qwenlm.github.io', 'https://qwenlm.github.io/blog/', 6, true),
('Google Gemini', 'gemini', 'AI Assistant', 'Google的多模态AI助手', 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png', 'https://gemini.google.com', 'https://deepmind.google/discover/blog/', 7, true),
('DeepSeek', 'deepseek', 'AI Reasoning Model', '深度求索推理模型', 'https://www.deepseek.com/favicon.ico', 'https://www.deepseek.com', 'https://www.deepseek.com', 8, true),
('Claude Code', 'claude-code', 'AI Code Assistant', 'Anthropic的AI编程助手', 'https://www.anthropic.com/favicon.ico', 'https://docs.anthropic.com/en/docs/claude-code', 'https://docs.anthropic.com/en/docs/claude-code/ide-integrations', 9, true),
('Midjourney', 'midjourney', 'AI Image Generation', 'AI图像生成平台', 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/midjourney-icon.png', 'https://midjourney.com', 'https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version', 10, true);


-- =================
-- 8. 注释和文档
-- =================

COMMENT ON TABLE ai_products IS 'AI产品基本信息和爬取配置';
COMMENT ON TABLE product_updates IS '产品更新内容，支持多版本历史记录';
COMMENT ON TABLE crawl_tasks IS '爬取任务队列，支持定时和手动任务';
COMMENT ON TABLE system_logs IS '系统操作日志记录';
COMMENT ON TABLE system_settings IS '系统配置参数';

COMMENT ON COLUMN ai_products.scraper_config IS '爬虫配置JSON：选择器、间隔时间、特殊处理规则等';
COMMENT ON COLUMN product_updates.content_hash IS '内容哈希值，用于检测内容是否发生变化';
COMMENT ON COLUMN product_updates.confidence_score IS 'AI处理置信度，0.00-1.00，低于阈值需要人工审核';
COMMENT ON COLUMN crawl_tasks.priority IS '任务优先级，1-10，数字越小优先级越高';