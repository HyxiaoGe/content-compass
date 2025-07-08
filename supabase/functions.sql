-- 创建增加API使用次数的函数
CREATE OR REPLACE FUNCTION increment_api_usage(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET api_usage_count = api_usage_count + 1,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建重置月度使用次数的函数（可用于定期任务）
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET api_usage_count = 0,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE subscription_tier = 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建获取用户仪表板统计的函数
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_id UUID)
RETURNS TABLE(
    total_content bigint,
    this_month_content bigint,
    total_tokens_used bigint,
    this_month_tokens bigint,
    avg_processing_time numeric
) AS $$
DECLARE
    month_start timestamp with time zone;
BEGIN
    month_start := date_trunc('month', CURRENT_TIMESTAMP);
    
    RETURN QUERY
    SELECT 
        COUNT(*) as total_content,
        COUNT(*) FILTER (WHERE created_at >= month_start) as this_month_content,
        COALESCE(SUM(tokens_used), 0) as total_tokens_used,
        COALESCE(SUM(tokens_used) FILTER (WHERE created_at >= month_start), 0) as this_month_tokens,
        COALESCE(AVG(processing_time_ms), 0) as avg_processing_time
    FROM parsed_content
    WHERE parsed_content.user_id = get_user_dashboard_stats.user_id
    AND status = 'completed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;