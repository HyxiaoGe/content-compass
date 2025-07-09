-- ContentCompass 数据库迁移脚本
-- 从原有schema迁移到v2.0版本
-- 删除不需要的表，保留有用的数据

-- =================
-- 1. 备份重要数据 (可选)
-- =================

-- 如果有重要的用户数据，先备份
-- CREATE TABLE backup_user_profiles AS SELECT * FROM user_profiles;
-- CREATE TABLE backup_parsed_content AS SELECT * FROM parsed_content;

-- =================
-- 2. 删除旧表和相关对象
-- =================

-- 删除触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_parsed_content_updated_at ON parsed_content;
DROP TRIGGER IF EXISTS update_monitoring_rules_updated_at ON monitoring_rules;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 删除策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own content" ON parsed_content;
DROP POLICY IF EXISTS "Users can manage own monitoring rules" ON monitoring_rules;
DROP POLICY IF EXISTS "Users can view own usage logs" ON usage_logs;

-- 删除视图
DROP VIEW IF EXISTS admin_stats;

-- 删除不再需要的表
DROP TABLE IF EXISTS usage_logs CASCADE;
DROP TABLE IF EXISTS parsed_content CASCADE;
DROP TABLE IF EXISTS monitoring_rules CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 删除旧的重构表 (如果存在)
DROP TABLE IF EXISTS user_bookmarks CASCADE;
DROP TABLE IF EXISTS processing_logs CASCADE;
DROP TABLE IF EXISTS content_items CASCADE;
DROP TABLE IF EXISTS monitor_sources CASCADE;

-- =================
-- 3. 删除旧的函数
-- =================

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- =================
-- 4. 应用新的schema
-- =================

-- 执行 schema-v2.sql 中的内容
-- 这里我们假设已经执行了 schema-v2.sql

-- =================
-- 5. 数据迁移 (如果需要)
-- =================

-- 如果有需要保留的用户数据，可以这样迁移：
-- INSERT INTO users (email, role, full_name, created_at)
-- SELECT email, 'viewer', full_name, created_at 
-- FROM backup_user_profiles;

-- =================
-- 6. 验证迁移结果
-- =================

-- 检查新表是否创建成功
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'ai_products', 
    'product_updates', 
    'crawl_tasks', 
    'users', 
    'system_logs', 
    'system_settings'
  )
ORDER BY table_name;

-- 检查初始数据是否插入成功
SELECT 
  'ai_products' as table_name, 
  COUNT(*) as record_count 
FROM ai_products
UNION ALL
SELECT 
  'system_settings' as table_name, 
  COUNT(*) as record_count 
FROM system_settings
UNION ALL
SELECT 
  'users' as table_name, 
  COUNT(*) as record_count 
FROM users;

-- 检查索引是否创建成功
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN (
    'ai_products', 
    'product_updates', 
    'crawl_tasks', 
    'system_logs'
  )
ORDER BY tablename, indexname;

-- =================
-- 7. 清理备份表 (可选)
-- =================

-- 确认迁移成功后，可以删除备份表
-- DROP TABLE IF EXISTS backup_user_profiles;
-- DROP TABLE IF EXISTS backup_parsed_content;

-- =================
-- 8. 更新应用配置
-- =================

-- 提示：迁移完成后需要更新的应用配置
-- 1. 更新 API 路由以使用新的表结构
-- 2. 更新前端组件以调用新的 API
-- 3. 更新数据库连接配置
-- 4. 设置定时任务进行数据爬取
-- 5. 配置 AI 处理管道

COMMENT ON SCHEMA public IS 'ContentCompass v2.0 - 迁移完成于 ' || NOW();