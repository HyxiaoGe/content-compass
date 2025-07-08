-- ContentCompass AI信息聚合站 - 重构后的数据库Schema
-- 简化设计，专注于AI产品更新信息的聚合和展示

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表 (简化)
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 监控源表 (AI产品)
CREATE TABLE monitor_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- 产品名称 如 "Cursor", "Claude"
  slug TEXT UNIQUE NOT NULL, -- URL友好的标识符
  url TEXT NOT NULL, -- 监控的changelog/更新页面URL
  logo_url TEXT, -- 产品Logo URL
  category TEXT, -- 产品分类 如 "Code Editor", "AI Assistant"
  description TEXT, -- 产品简介
  schedule TEXT DEFAULT 'daily' CHECK (schedule IN ('hourly', 'daily', 'weekly')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 内容条目表 (处理后的AI产品更新)
CREATE TABLE content_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_id UUID REFERENCES monitor_sources(id) ON DELETE CASCADE,
  
  -- 原始内容信息
  title TEXT NOT NULL, -- 原始更新标题
  original_url TEXT, -- 原文链接
  original_content TEXT, -- 原始内容（用于重新处理）
  
  -- AI处理后的内容
  summary TEXT NOT NULL, -- AI生成的摘要 (150-300字)
  key_points TEXT[], -- AI提取的关键要点 (3-5个)
  importance TEXT DEFAULT 'medium' CHECK (importance IN ('high', 'medium', 'low')),
  tags TEXT[], -- 标签 如 ["feature", "bug-fix", "ui"]
  
  -- 状态管理
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- 时间信息
  published_at TIMESTAMP WITH TIME ZONE, -- 前台发布时间
  source_updated_at TIMESTAMP WITH TIME ZONE, -- 原始内容的更新时间
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 处理日志表 (记录AI处理过程)
CREATE TABLE processing_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'scrape', 'summarize', 'publish', 'error'
  result TEXT, -- 处理结果或错误信息
  tokens_used INTEGER DEFAULT 0, -- AI处理使用的token数量
  cost_cents INTEGER DEFAULT 0, -- 成本(分为单位)
  processing_time_ms INTEGER, -- 处理耗时(毫秒)
  metadata JSONB, -- 额外的处理元数据
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户收藏表 (可选功能)
CREATE TABLE user_bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- 系统配置表
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX idx_content_items_status_published ON content_items (status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_content_items_source_id ON content_items (source_id);
CREATE INDEX idx_content_items_importance ON content_items (importance);
CREATE INDEX idx_content_items_tags ON content_items USING gin(tags);
CREATE INDEX idx_monitor_sources_active ON monitor_sources (is_active) WHERE is_active = true;
CREATE INDEX idx_processing_logs_content_id ON processing_logs (content_id);
CREATE INDEX idx_processing_logs_created_at ON processing_logs (created_at DESC);

-- RLS (Row Level Security) 策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- 公开数据策略 (前台展示)
CREATE POLICY "Public content items are viewable by everyone" ON content_items
FOR SELECT USING (status = 'published');

CREATE POLICY "Public monitor sources are viewable by everyone" ON monitor_sources
FOR SELECT USING (is_active = true);

-- 管理员策略 (后台管理)
CREATE POLICY "Admins can do everything on content_items" ON content_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can do everything on monitor_sources" ON monitor_sources
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can view processing_logs" ON processing_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- 用户自己的数据策略
CREATE POLICY "Users can view and update their own data" ON users
FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own bookmarks" ON user_bookmarks
FOR ALL USING (auth.uid() = user_id);

-- 插入一些初始数据
INSERT INTO system_settings (key, value, description) VALUES
('admin_emails', '["admin@contentcompass.dev"]', '管理员邮箱白名单'),
('ai_model', '"gpt-4o-mini"', '当前使用的AI模型'),
('max_daily_processing', '100', '每日最大处理条目数'),
('site_title', '"ContentCompass"', '网站标题'),
('site_description', '"AI产品更新信息聚合站"', '网站描述');

-- 插入一些示例监控源
INSERT INTO monitor_sources (name, slug, url, category, description, logo_url) VALUES
('Cursor', 'cursor', 'https://cursor.sh/changelog', 'Code Editor', 'AI-powered code editor', 'https://cursor.sh/favicon.ico'),
('Claude', 'claude', 'https://docs.anthropic.com/claude/docs', 'AI Assistant', 'Anthropic的AI助手', 'https://docs.anthropic.com/favicon.ico'),
('OpenAI', 'openai', 'https://platform.openai.com/docs/changelog', 'AI Platform', 'OpenAI API和产品更新', 'https://openai.com/favicon.ico'),
('GitHub Copilot', 'github-copilot', 'https://github.blog/tag/github-copilot/', 'Code Assistant', 'GitHub的AI编程助手', 'https://github.com/favicon.ico'),
('Notion', 'notion', 'https://www.notion.so/releases', 'Productivity', 'AI增强的协作平台', 'https://www.notion.so/favicon.ico');

-- 创建触发器自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monitor_sources_updated_at BEFORE UPDATE ON monitor_sources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 统计视图 (用于后台仪表板)
CREATE VIEW admin_stats AS
SELECT 
  (SELECT COUNT(*) FROM content_items WHERE status = 'published') as published_content,
  (SELECT COUNT(*) FROM content_items WHERE status = 'draft') as draft_content,
  (SELECT COUNT(*) FROM monitor_sources WHERE is_active = true) as active_sources,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT SUM(tokens_used) FROM processing_logs WHERE created_at >= NOW() - INTERVAL '30 days') as tokens_used_30d,
  (SELECT SUM(cost_cents) FROM processing_logs WHERE created_at >= NOW() - INTERVAL '30 days') as cost_cents_30d;

COMMENT ON TABLE monitor_sources IS 'AI产品监控源配置表';
COMMENT ON TABLE content_items IS '处理后的AI产品更新内容';
COMMENT ON TABLE processing_logs IS 'AI处理过程日志记录';
COMMENT ON TABLE user_bookmarks IS '用户收藏功能表';
COMMENT ON TABLE system_settings IS '系统配置参数表';