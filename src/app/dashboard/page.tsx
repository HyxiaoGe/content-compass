// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UsageChart } from '@/components/dashboard/usage-chart'
import { formatCurrency } from '@/lib/utils'
import type { Database } from '@/types/database'

async function getUserStats(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/stats?timeRange=30`, {
      cache: 'no-store',
      headers: {
        'Cookie': cookies().toString(),
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }
    
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  const userStats = await getUserStats(session.user.id)

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground">
            欢迎回来！这里是您的内容解析概览。
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/parse">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              解析新内容
            </Link>
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="总内容数"
          value={userStats?.content.total_content || 0}
          description="已解析的内容总数"
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          trend={{
            value: userStats?.content.this_month_content || 0,
            label: '本月新增',
            isPositive: true
          }}
        />
        
        <StatsCard
          title="API使用量"
          value={`${userStats?.profile.api_usage_count || 0}/${userStats?.profile.api_usage_limit || 100}`}
          description={`剩余 ${userStats?.profile.remaining_requests || 0} 次请求`}
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          trend={{
            value: userStats?.profile.usage_percentage || 0,
            label: '使用率',
            isPositive: (userStats?.profile.usage_percentage || 0) < 80
          }}
        />

        <StatsCard
          title="Token使用量"
          value={`${Math.round((userStats?.content.total_tokens_used || 0) / 1000)}k`}
          description="总计使用的AI tokens"
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          trend={{
            value: Math.round(((userStats?.content.this_month_tokens || 0) / (userStats?.content.total_tokens_used || 1)) * 100),
            label: '本月占比',
            isPositive: true
          }}
        />

        <StatsCard
          title="累计成本"
          value={formatCurrency(userStats?.content.total_cost || 0)}
          description="AI处理总成本"
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          trend={{
            value: userStats?.content.this_month_cost || 0,
            label: '本月成本',
            isPositive: false
          }}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 最近活动 */}
        <RecentActivity />

        {/* 使用趋势图 */}
        <UsageChart />
      </div>

      {/* 快速操作和性能指标 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/parse">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                解析新内容
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/batch">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                批量操作
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/content">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                浏览内容
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* 性能指标 */}
        <Card>
          <CardHeader>
            <CardTitle>性能指标</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">成功率</span>
              <span className="font-medium">{userStats?.performance_metrics?.success_rate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">平均处理时间</span>
              <span className="font-medium">{(userStats?.performance_metrics?.average_processing_time || 0) / 1000}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">平均Token/请求</span>
              <span className="font-medium">{userStats?.performance_metrics?.average_tokens_per_request || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">平均成本/请求</span>
              <span className="font-medium">{formatCurrency(userStats?.performance_metrics?.average_cost_per_request || 0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* 订阅信息 */}
        <Card>
          <CardHeader>
            <CardTitle>订阅计划</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">当前计划</span>
              <span className="font-medium capitalize">
                {userStats?.profile?.subscription_tier || 'free'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API使用进度</span>
                <span>{userStats?.profile?.usage_percentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(userStats?.profile?.usage_percentage || 0, 100)}%` }}
                />
              </div>
            </div>
            {(userStats?.profile?.subscription_tier || 'free') === 'free' && (
              <Button className="w-full" variant="outline" asChild>
                <Link href="/billing">升级计划</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: '仪表板 - ContentCompass',
  description: '查看您的内容解析统计和最近活动',
}