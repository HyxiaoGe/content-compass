// src/components/content/content-list.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate, getUrlDomain, truncateText } from '@/lib/utils'
import type { ParsedContent, PaginatedResponse } from '@/types/database'

interface ContentListProps {
  initialData?: PaginatedResponse<ParsedContent>
}

export function ContentList({ initialData }: ContentListProps) {
  const [content, setContent] = useState<ParsedContent[]>(initialData?.data || [])
  const [loading, setLoading] = useState(!initialData)
  const [pagination, setPagination] = useState(initialData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
    totalPages: 0
  })
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    language: '',
    sort: 'created_at',
    order: 'desc'
  })

  const [searchInput, setSearchInput] = useState('')

  const fetchContent = async (page = 1, newFilters = filters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sort: newFilters.sort,
        order: newFilters.order,
      })

      if (newFilters.search) params.append('search', newFilters.search)
      if (newFilters.status) params.append('status', newFilters.status)
      if (newFilters.language) params.append('language', newFilters.language)

      const response = await fetch(`/api/content?${params}`)
      const data = await response.json()

      if (data.success) {
        setContent(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialData) {
      fetchContent()
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newFilters = { ...filters, search: searchInput }
    setFilters(newFilters)
    fetchContent(1, newFilters)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    fetchContent(1, newFilters)
  }

  const handlePageChange = (page: number) => {
    fetchContent(page)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800',
    }
    
    const labels = {
      completed: '已完成',
      processing: '处理中',
      failed: '失败',
      pending: '待处理',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges] || badges.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (loading && !content.length) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 搜索和过滤器 */}
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="搜索标题、URL或内容..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">搜索</Button>
        </form>

        <div className="flex flex-wrap gap-3">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="所有状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="processing">处理中</SelectItem>
              <SelectItem value="failed">失败</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.language || 'all'}
            onValueChange={(value) => handleFilterChange('language', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="所有语言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有语言</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${filters.sort}-${filters.order}`}
            onValueChange={(value) => {
              const [sort, order] = value.split('-')
              setFilters(prev => ({ ...prev, sort, order }))
              fetchContent(1, { ...filters, sort, order })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">最新创建</SelectItem>
              <SelectItem value="created_at-asc">最早创建</SelectItem>
              <SelectItem value="updated_at-desc">最近更新</SelectItem>
              <SelectItem value="title-asc">标题 A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 内容列表 */}
      {content.length > 0 ? (
        <div className="space-y-4">
          {content.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/content/${item.id}`}
                      className="block group"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium group-hover:text-blue-600 transition-colors truncate">
                          {item.title || '无标题'}
                        </h3>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span>{getUrlDomain(item.url)}</span>
                        <span>•</span>
                        <span>{formatDate(item.created_at)}</span>
                        {item.word_count && (
                          <>
                            <span>•</span>
                            <span>{item.word_count} 字</span>
                          </>
                        )}
                        {item.reading_time && (
                          <>
                            <span>•</span>
                            <span>{item.reading_time} 分钟阅读</span>
                          </>
                        )}
                      </div>

                      {item.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {truncateText(item.summary, 200)}
                        </p>
                      )}

                      {item.key_points && item.key_points.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">关键要点:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.key_points.slice(0, 3).map((point, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700"
                              >
                                {truncateText(point, 30)}
                              </span>
                            ))}
                            {item.key_points.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{item.key_points.length - 3} 个要点
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {item.tokens_used && (
                      <span className="text-xs text-muted-foreground">
                        {item.tokens_used} tokens
                      </span>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/content/${item.id}`}>
                        查看详情
                      </Link>
                    </Button>
                  </div>
                </div>

                {item.error_message && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">错误:</span> {item.error_message}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
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
            {filters.search || filters.status || filters.language 
              ? '没有找到符合条件的内容' 
              : '开始解析您的第一个网页内容'
            }
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/parse">开始解析</Link>
            </Button>
          </div>
        </div>
      )}

      {/* 分页 */}
      {'totalPages' in pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            显示第 {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total || 0)} 条，
            共 {pagination.total || 0} 条结果
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
            >
              上一页
            </Button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = i + 1
                const isActive = pageNum === pagination.page
                
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}