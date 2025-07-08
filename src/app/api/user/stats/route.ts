// src/app/api/user/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { contentService } from '@/lib/database/content';
import { usageLogService } from '@/lib/database/usage';
import { userService } from '@/lib/database/user';
import type { Database, APIResponse } from '@/types/database';

interface UserDashboardStats {
  profile: {
    subscription_tier: string;
    api_usage_count: number;
    api_usage_limit: number;
    usage_percentage: number;
    remaining_requests: number;
  };
  content: {
    total_content: number;
    this_month_content: number;
    this_week_content: number;
    today_content: number;
    total_tokens_used: number;
    this_month_tokens: number;
    total_cost: number;
    this_month_cost: number;
  };
  recent_activity: Array<{
    date: string;
    content_count: number;
    tokens_used: number;
    cost: number;
  }>;
  status_breakdown: {
    completed: number;
    processing: number;
    failed: number;
    pending: number;
  };
  language_breakdown: Record<string, number>;
  summary_type_breakdown: Record<string, number>;
  performance_metrics: {
    average_processing_time: number;
    success_rate: number;
    average_tokens_per_request: number;
    average_cost_per_request: number;
  };
  top_domains: Array<{
    domain: string;
    count: number;
    percentage: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30'; // 默认30天
    const detailed = searchParams.get('detailed') === 'true';

    // 设置时间范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    thisWeek.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 并行获取各种统计数据
    const [
      userProfile,
      contentStats,
      usageStats,
      recentActivity,
      statusBreakdown,
      languageBreakdown,
      performanceData
    ] = await Promise.all([
      // 用户档案
      userService.getUserProfile(user.id),
      
      // 内容统计
      contentService.getUserStats(user.id),
      
      // 使用统计
      usageLogService.getUserUsageStats(user.id, startDate.toISOString(), endDate.toISOString()),
      
      // 近期活动
      getRecentActivity(supabase, user.id, parseInt(timeRange)),
      
      // 状态分布
      getStatusBreakdown(supabase, user.id),
      
      // 语言分布
      getLanguageBreakdown(supabase, user.id),
      
      // 性能指标
      getPerformanceMetrics(supabase, user.id)
    ]);

    if (!userProfile.success || !contentStats.success) {
      return NextResponse.json(
        { success: false, error: '获取用户统计数据失败' } as APIResponse,
        { status: 500 }
      );
    }

    // 获取时间段统计
    const [monthlyContent, weeklyContent, todayContent] = await Promise.all([
      getContentCount(supabase, user.id, thisMonth.toISOString()),
      getContentCount(supabase, user.id, thisWeek.toISOString()),
      getContentCount(supabase, user.id, today.toISOString())
    ]);

    // 获取时间段token和成本统计
    const [monthlyStats, weeklyStats, todayStats] = await Promise.all([
      getTokensAndCost(supabase, user.id, thisMonth.toISOString()),
      getTokensAndCost(supabase, user.id, thisWeek.toISOString()),
      getTokensAndCost(supabase, user.id, today.toISOString())
    ]);

    // 获取热门域名
    const topDomains = await getTopDomains(supabase, user.id, 10);

    // 获取摘要类型分布
    const summaryTypeBreakdown = await getSummaryTypeBreakdown(supabase, user.id);

    const stats: UserDashboardStats = {
      profile: {
        subscription_tier: userProfile.data!.subscription_tier,
        api_usage_count: userProfile.data!.api_usage_count,
        api_usage_limit: userProfile.data!.api_usage_limit,
        usage_percentage: Math.round((userProfile.data!.api_usage_count / userProfile.data!.api_usage_limit) * 100),
        remaining_requests: Math.max(0, userProfile.data!.api_usage_limit - userProfile.data!.api_usage_count)
      },
      content: {
        total_content: contentStats.data!.total_content,
        this_month_content: monthlyContent,
        this_week_content: weeklyContent,
        today_content: todayContent,
        total_tokens_used: contentStats.data!.total_tokens_used,
        this_month_tokens: monthlyStats.tokens,
        total_cost: calculateTotalCost(contentStats.data!.total_tokens_used),
        this_month_cost: monthlyStats.cost
      },
      recent_activity: recentActivity,
      status_breakdown: statusBreakdown,
      language_breakdown: languageBreakdown,
      summary_type_breakdown: summaryTypeBreakdown,
      performance_metrics: performanceData,
      top_domains: topDomains
    };

    return NextResponse.json({
      success: true,
      data: stats,
      metadata: {
        timeRange: parseInt(timeRange),
        detailed,
        generatedAt: new Date().toISOString()
      }
    } as APIResponse<UserDashboardStats>);

  } catch (error) {
    console.error('User stats API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取统计数据失败' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

// 辅助函数：获取近期活动
async function getRecentActivity(supabase: any, userId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('parsed_content')
    .select('created_at, tokens_used, metadata')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) return [];

  // 按日期聚合
  const activityMap = new Map<string, { content_count: number; tokens_used: number; cost: number }>();
  
  data?.forEach((item: any) => {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    const existing = activityMap.get(date) || { content_count: 0, tokens_used: 0, cost: 0 };
    const cost = item.metadata?.ai?.cost || 0;
    
    activityMap.set(date, {
      content_count: existing.content_count + 1,
      tokens_used: existing.tokens_used + (item.tokens_used || 0),
      cost: existing.cost + cost
    });
  });

  return Array.from(activityMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// 辅助函数：获取状态分布
async function getStatusBreakdown(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('parsed_content')
    .select('status')
    .eq('user_id', userId);

  if (error) return { completed: 0, processing: 0, failed: 0, pending: 0 };

  const breakdown = { completed: 0, processing: 0, failed: 0, pending: 0 };
  data?.forEach((item: any) => {
    if (item.status in breakdown) {
      breakdown[item.status as keyof typeof breakdown]++;
    }
  });

  return breakdown;
}

// 辅助函数：获取语言分布
async function getLanguageBreakdown(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('parsed_content')
    .select('language')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (error) return {};

  const breakdown: Record<string, number> = {};
  data?.forEach((item: any) => {
    if (item.language) {
      breakdown[item.language] = (breakdown[item.language] || 0) + 1;
    }
  });

  return breakdown;
}

// 辅助函数：获取性能指标
async function getPerformanceMetrics(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('parsed_content')
    .select('status, tokens_used, processing_time_ms')
    .eq('user_id', userId);

  if (error) return {
    average_processing_time: 0,
    success_rate: 0,
    average_tokens_per_request: 0,
    average_cost_per_request: 0
  };

  const total = data?.length || 0;
  const completed = data?.filter((item: any) => item.status === 'completed').length || 0;
  const totalTokens = data?.reduce((sum: any, item: any) => sum + (item.tokens_used || 0), 0) || 0;
  const totalProcessingTime = data?.reduce((sum: any, item: any) => sum + (item.processing_time_ms || 0), 0) || 0;

  return {
    average_processing_time: total > 0 ? Math.round(totalProcessingTime / total) : 0,
    success_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    average_tokens_per_request: completed > 0 ? Math.round(totalTokens / completed) : 0,
    average_cost_per_request: completed > 0 ? calculateTotalCost(totalTokens) / completed : 0
  };
}

// 辅助函数：获取内容数量
async function getContentCount(supabase: any, userId: string, since: string): Promise<number> {
  const { data, error } = await supabase
    .from('parsed_content')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', since);

  return error ? 0 : (data?.length || 0);
}

// 辅助函数：获取tokens和成本
async function getTokensAndCost(supabase: any, userId: string, since: string) {
  const { data, error } = await supabase
    .from('parsed_content')
    .select('tokens_used, metadata')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .gte('created_at', since);

  if (error) return { tokens: 0, cost: 0 };

  const tokens = data?.reduce((sum: any, item: any) => sum + (item.tokens_used || 0), 0) || 0;
  const cost = data?.reduce((sum: any, item: any) => sum + (item.metadata?.ai?.cost || 0), 0) || 0;

  return { tokens, cost };
}

// 辅助函数：获取热门域名
async function getTopDomains(supabase: any, userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('parsed_content')
    .select('url')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (error) return [];

  const domainCount: Record<string, number> = {};
  data?.forEach((item: any) => {
    try {
      const domain = new URL(item.url).hostname;
      domainCount[domain] = (domainCount[domain] || 0) + 1;
    } catch {
      // 忽略无效URL
    }
  });

  const total = data?.length || 0;
  return Object.entries(domainCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([domain, count]) => ({
      domain,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
}

// 辅助函数：获取摘要类型分布
async function getSummaryTypeBreakdown(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('parsed_content')
    .select('metadata')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (error) return {};

  const breakdown: Record<string, number> = {};
  data?.forEach((item: any) => {
    const summaryType = item.metadata?.requestOptions?.summaryType || 'standard';
    breakdown[summaryType] = (breakdown[summaryType] || 0) + 1;
  });

  return breakdown;
}

// 辅助函数：计算总成本（简单估算）
function calculateTotalCost(totalTokens: number): number {
  // 使用gpt-4o-mini的价格进行估算
  const inputPrice = 0.00015; // per 1K tokens
  const outputPrice = 0.0006; // per 1K tokens
  
  // 假设输入输出比例为 3:1
  const inputTokens = totalTokens * 0.75;
  const outputTokens = totalTokens * 0.25;
  
  return (inputTokens / 1000) * inputPrice + (outputTokens / 1000) * outputPrice;
}