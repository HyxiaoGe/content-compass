// src/components/dashboard/usage-chart.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UsageData {
  date: string
  content_count: number
  tokens_used: number
  cost: number
}

export function UsageChart() {
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7') // 7天

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await fetch(`/api/user/stats?timeRange=${timeRange}&detailed=true`)
        const data = await response.json()
        
        if (data.success && data.data.recent_activity) {
          setUsageData(data.data.recent_activity)
        }
      } catch (error) {
        console.error('Failed to fetch usage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsageData()
  }, [timeRange])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>使用趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // 找到最大值用于缩放
  const maxContent = Math.max(...usageData.map(d => d.content_count), 1)
  const maxTokens = Math.max(...usageData.map(d => d.tokens_used), 1)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>使用趋势</CardTitle>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">最近7天</SelectItem>
            <SelectItem value="14">最近14天</SelectItem>
            <SelectItem value="30">最近30天</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {usageData.length > 0 ? (
          <div className="space-y-4">
            {/* 图例 */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>内容数量</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Token使用量</span>
              </div>
            </div>

            {/* 简单的条形图 */}
            <div className="space-y-3">
              {usageData.slice(-7).map((day, index) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                    <span>{day.content_count} 个内容 • {day.tokens_used} tokens</span>
                  </div>
                  
                  {/* 内容数量条 */}
                  <div className="flex items-center space-x-2">
                    <div className="w-16 text-xs text-right">内容:</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.content_count / maxContent) * 100}%` }}
                      />
                    </div>
                    <div className="w-8 text-xs">{day.content_count}</div>
                  </div>

                  {/* Token使用量条 */}
                  <div className="flex items-center space-x-2">
                    <div className="w-16 text-xs text-right">Token:</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.tokens_used / maxTokens) * 100}%` }}
                      />
                    </div>
                    <div className="w-8 text-xs">{Math.round(day.tokens_used / 1000)}k</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium">暂无使用数据</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              开始使用后将显示使用趋势图
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}