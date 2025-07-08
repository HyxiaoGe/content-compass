// src/components/parse/parse-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ParseFormProps {
  onParseStart?: (url: string) => void
  onParseComplete?: (result: any) => void
}

const summaryTypes = [
  { value: 'brief', label: '简要摘要' },
  { value: 'standard', label: '标准摘要' },
  { value: 'detailed', label: '详细摘要' },
  { value: 'bullet-points', label: '要点列表' },
  { value: 'key-insights', label: '关键洞察' },
  { value: 'executive', label: '执行摘要' },
  { value: 'technical', label: '技术摘要' },
  { value: 'academic', label: '学术摘要' },
]

const languages = [
  { value: 'auto', label: '自动检测' },
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
]

export function ParseForm({ onParseStart, onParseComplete }: ParseFormProps) {
  const [url, setUrl] = useState('')
  const [options, setOptions] = useState({
    summaryType: 'standard',
    language: 'auto',
    extractImages: false,
    extractLinks: false,
    customPrompt: '',
    maxTokens: 1000,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 验证URL
      new URL(url)

      onParseStart?.(url)

      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          options: {
            ...options,
            maxTokens: Number(options.maxTokens),
          },
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || '解析失败')
        return
      }

      setResult(data)
      onParseComplete?.(data)

      // 跳转到结果页面
      router.push(`/content/${data.data.id}`)
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('Invalid URL')) {
        setError('请输入有效的URL地址')
      } else {
        setError('解析失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>解析网页内容</CardTitle>
          <CardDescription>
            输入网页URL，我们将为您提取内容并生成AI摘要
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL输入 */}
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                网页URL <span className="text-red-500">*</span>
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={loading}
                className={
                  url && !isValidUrl(url) 
                    ? 'border-red-500 focus-visible:ring-red-500' 
                    : ''
                }
              />
              {url && !isValidUrl(url) && (
                <p className="text-sm text-red-600">请输入有效的URL地址</p>
              )}
            </div>

            {/* 解析选项 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="summaryType" className="text-sm font-medium">
                  摘要类型
                </label>
                <Select
                  id="summaryType"
                  value={options.summaryType}
                  onChange={(e) => setOptions(prev => ({ ...prev, summaryType: e.target.value }))}
                  disabled={loading}
                >
                  {summaryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">
                  输出语言
                </label>
                <Select
                  id="language"
                  value={options.language}
                  onChange={(e) => setOptions(prev => ({ ...prev, language: e.target.value }))}
                  disabled={loading}
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* 高级选项 */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">高级选项</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="extractImages"
                    checked={options.extractImages}
                    onChange={(e) => setOptions(prev => ({ ...prev, extractImages: e.target.checked }))}
                    disabled={loading}
                    className="rounded border-input"
                  />
                  <label htmlFor="extractImages" className="text-sm">
                    提取图片信息
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="extractLinks"
                    checked={options.extractLinks}
                    onChange={(e) => setOptions(prev => ({ ...prev, extractLinks: e.target.checked }))}
                    disabled={loading}
                    className="rounded border-input"
                  />
                  <label htmlFor="extractLinks" className="text-sm">
                    提取链接信息
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="maxTokens" className="text-sm font-medium">
                  最大Token数量
                </label>
                <Select
                  id="maxTokens"
                  value={options.maxTokens.toString()}
                  onChange={(e) => setOptions(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  disabled={loading}
                >
                  <option value="500">500 tokens</option>
                  <option value="1000">1000 tokens</option>
                  <option value="2000">2000 tokens</option>
                  <option value="3000">3000 tokens</option>
                  <option value="4000">4000 tokens</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="customPrompt" className="text-sm font-medium">
                  自定义提示词 (可选)
                </label>
                <Textarea
                  id="customPrompt"
                  placeholder="输入自定义的提示词来指导AI生成特定类型的摘要..."
                  value={options.customPrompt}
                  onChange={(e) => setOptions(prev => ({ ...prev, customPrompt: e.target.value }))}
                  disabled={loading}
                  rows={3}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      解析错误
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !url || !isValidUrl(url)}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  解析中...
                </div>
              ) : (
                '开始解析'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 解析进度提示 */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">正在获取网页内容...</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-muted-foreground">正在清理和处理内容...</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-muted-foreground">正在生成AI摘要...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}