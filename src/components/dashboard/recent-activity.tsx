// src/components/dashboard/recent-activity.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, getUrlDomain } from '@/lib/utils'
import type { ParsedContent } from '@/types/database'

export function RecentActivity() {
  const [recentContent, setRecentContent] = useState<ParsedContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentContent = async () => {
      try {
        const response = await fetch('/api/content?limit=5&sort=created_at&order=desc')
        const data = await response.json()
        
        if (data.success) {
          setRecentContent(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch recent content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentContent()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>最近活动</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/content">查看全部</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentContent.length > 0 ? (
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="flex items-start space-x-4">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  content.status === 'completed' ? 'bg-green-500' :
                  content.status === 'processing' ? 'bg-yellow-500' :
                  content.status === 'failed' ? 'bg-red-500' :
                  'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/content/${content.id}`}
                    className="block hover:bg-accent rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">
                        {content.title || '无标题'}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        content.status === 'completed' ? 'bg-green-100 text-green-800' :
                        content.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        content.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {content.status === 'completed' ? '已完成' :
                         content.status === 'processing' ? '处理中' :
                         content.status === 'failed' ? '失败' : '待处理'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getUrlDomain(content.url)} • {formatDate(content.created_at)}
                    </p>
                    {content.summary && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {content.summary.substring(0, 100)}...
                      </p>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium">暂无内容</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              开始解析您的第一个网页内容
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/parse">开始解析</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}