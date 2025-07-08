-- ContentCompass Database Schema
-- 创建用户配置表
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    api_usage_count INTEGER DEFAULT 0,
    api_usage_limit INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建解析内容表
CREATE TABLE parsed_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    original_content TEXT,
    cleaned_content TEXT,
    summary TEXT,
    key_points TEXT[], -- PostgreSQL 数组类型
    metadata JSONB, -- 存储额外的元数据
    word_count INTEGER,
    reading_time INTEGER, -- 预估阅读时间（分钟）
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    tokens_used INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建监控规则表
CREATE TABLE monitoring_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    schedule TEXT DEFAULT 'daily' CHECK (schedule IN ('hourly', 'daily', 'weekly')),
    is_active BOOLEAN DEFAULT true,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    last_content_hash TEXT, -- 用于检测内容变化
    notification_settings JSONB DEFAULT '{"email": true, "webhook": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建使用统计表
CREATE TABLE usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('parse', 'monitor_check', 'api_call')),
    resource_id UUID, -- 可以关联到 parsed_content 或 monitoring_rules
    tokens_used INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建索引优化查询性能
CREATE INDEX idx_parsed_content_user_id ON parsed_content(user_id);
CREATE INDEX idx_parsed_content_created_at ON parsed_content(created_at DESC);
CREATE INDEX idx_parsed_content_status ON parsed_content(status);
CREATE INDEX idx_monitoring_rules_user_id ON monitoring_rules(user_id);
CREATE INDEX idx_monitoring_rules_active ON monitoring_rules(is_active);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parsed_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
-- 用户只能查看和修改自己的数据
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own content" ON parsed_content
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own monitoring rules" ON monitoring_rules
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage logs" ON usage_logs
    FOR SELECT USING (auth.uid() = user_id);

-- 创建触发器自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parsed_content_updated_at BEFORE UPDATE ON parsed_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monitoring_rules_updated_at BEFORE UPDATE ON monitoring_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建函数自动创建用户配置
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 创建触发器在用户注册时自动创建用户配置
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();