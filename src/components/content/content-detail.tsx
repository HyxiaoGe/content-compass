// src/components/content/content-detail.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { formatDate, getUrlDomain, formatBytes, formatDuration, formatCurrency } from '@/lib/utils'
import type { ParsedContent } from '@/types/database'

interface ContentDetailProps {
  content: ParsedContent
}

export function ContentDetail({ content }: ContentDetailProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'content' | 'metadata'>('summary')
  const [regenerating, setRegenerating] = useState(false)
  const [regenerateOptions, setRegenerateOptions] = useState({
    summaryType: 'standard',
    language: 'auto',
    maxTokens: 1000,
    customPrompt: ''
  })

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      const response = await fetch(`/api/content/${content.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'regenerate-summary',
          ...regenerateOptions,
          maxTokens: Number(regenerateOptions.maxTokens)
        }),
      })

      const data = await response.json()

      if (data.success) {
        // 刷新页面或更新状态
        window.location.reload()
      } else {
        alert('重新生成失败: ' + data.error)
      }
    } catch (error) {
      alert('重新生成失败，请稍后重试')
    } finally {
      setRegenerating(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'text-green-600 bg-green-50',
      processing: 'text-yellow-600 bg-yellow-50',
      failed: 'text-red-600 bg-red-50',
      pending: 'text-gray-600 bg-gray-50',
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const exportContent = async (format: 'json' | 'markdown' | 'txt') => {
    try {
      const response = await fetch('/api/content/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          filters: {
            ids: [content.id]
          },
          options: {
            includeSummary: true,
            includeKeyPoints: true,
            includeMetadata: false,
            includeOriginalContent: false
          }
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `content-${content.id}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold truncate">
              {content.title || '无标题'}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(content.status)}`}>
              {content.status === 'completed' ? '已完成' :
               content.status === 'processing' ? '处理中' :
               content.status === 'failed' ? '失败' : '待处理'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <Link 
              href={content.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {getUrlDomain(content.url)}
            </Link>
            <span>•</span>
            <span>{formatDate(content.created_at)}</span>
            {content.word_count && (
              <>
                <span>•</span>
                <span>{content.word_count} 字</span>
              </>
            )}
            {content.reading_time && (
              <>
                <span>•</span>
                <span>{content.reading_time} 分钟阅读</span>
              </>
            )}
            {content.tokens_used && (
              <>
                <span>•</span>
                <span>{content.tokens_used} tokens</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button variant="outline" size="sm">
              导出
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            <div className="absolute right-0 mt-1 w-32 rounded-md border bg-popover p-1 shadow-lg opacity-0 invisible hover:opacity-100 hover:visible transition-all">
              <button 
                onClick={() => exportContent('json')}
                className="block w-full text-left px-2 py-1 text-sm hover:bg-accent rounded"
              >
                JSON
              </button>
              <button 
                onClick={() => exportContent('markdown')}
                className="block w-full text-left px-2 py-1 text-sm hover:bg-accent rounded"
              >
                Markdown
              </button>
              <button 
                onClick={() => exportContent('txt')}
                className="block w-full text-left px-2 py-1 text-sm hover:bg-accent rounded"
              >
                文本
              </button>
            </div>
          </div>
          
          <Button variant="outline" size="sm" asChild>
            <Link href="/content">返回列表</Link>
          </Button>
        </div>
      </div>

      {/* 错误信息 */}
      {content.error_message && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">处理错误</h3>
                <p className="mt-1 text-sm text-red-700">{content.error_message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 标签页导航 */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            摘要与要点
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            原始内容
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metadata'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            技术信息
          </button>
        </nav>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* 摘要 */}
          {content.summary && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI 摘要</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                >
                  {regenerating ? '重新生成中...' : '重新生成'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{content.summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 关键要点 */}
          {content.key_points && content.key_points.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>关键要点</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.key_points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 重新生成选项 */}
          <Card>
            <CardHeader>
              <CardTitle>重新生成摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">摘要类型</label>
                  <Select
                    value={regenerateOptions.summaryType}
                    onChange={(e) => setRegenerateOptions(prev => ({ ...prev, summaryType: e.target.value }))}
                  >
                    <option value="brief">简要摘要</option>
                    <option value="standard">标准摘要</option>
                    <option value="detailed">详细摘要</option>
                    <option value="bullet-points">要点列表</option>
                    <option value="key-insights">关键洞察</option>
                    <option value="executive">执行摘要</option>
                    <option value="technical">技术摘要</option>
                    <option value="academic">学术摘要</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">最大Token数</label>
                  <Select
                    value={regenerateOptions.maxTokens.toString()}
                    onChange={(e) => setRegenerateOptions(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  >
                    <option value="500">500 tokens</option>
                    <option value="1000">1000 tokens</option>
                    <option value="2000">2000 tokens</option>
                    <option value="3000">3000 tokens</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">自定义提示词</label>
                <Textarea
                  placeholder="输入自定义提示词..."
                  value={regenerateOptions.customPrompt}
                  onChange={(e) => setRegenerateOptions(prev => ({ ...prev, customPrompt: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleRegenerate} 
                disabled={regenerating}
                className="w-full"
              >
                {regenerating ? '生成中...' : '重新生成摘要'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'content' && (
        <Card>
          <CardHeader>
            <CardTitle>原始内容</CardTitle>
          </CardHeader>
          <CardContent>
            {content.cleaned_content ? (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {content.cleaned_content}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暂无内容
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'metadata' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">内容ID</span>
                <span className="text-sm font-mono">{content.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">状态</span>
                <span className="text-sm">{content.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">语言</span>
                <span className="text-sm">{content.language || '未知'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">字数</span>
                <span className="text-sm">{content.word_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">阅读时间</span>
                <span className="text-sm">{content.reading_time || 0} 分钟</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">创建时间</span>
                <span className="text-sm">{formatDate(content.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">更新时间</span>
                <span className="text-sm">{formatDate(content.updated_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* AI 处理信息 */}
          <Card>
            <CardHeader>
              <CardTitle>AI 处理信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">使用Token</span>
                <span className="text-sm">{content.tokens_used || 0}</span>
              </div>
              {content.processing_time_ms && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">处理时间</span>
                  <span className="text-sm">{formatDuration(content.processing_time_ms)}</span>
                </div>
              )}
              {content.metadata?.ai?.model && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">AI模型</span>
                  <span className="text-sm">{content.metadata.ai.model}</span>
                </div>
              )}
              {content.metadata?.ai?.cost && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">处理成本</span>
                  <span className="text-sm">{formatCurrency(content.metadata.ai.cost)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 元数据 */}
          {content.metadata && Object.keys(content.metadata).length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>详细元数据</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(content.metadata, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}