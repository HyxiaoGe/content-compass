// 重构后的前台主页 - AI信息聚合展示站

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ContentGrid } from '@/components/front/content-grid'
import { FilterSidebar } from '@/components/front/filter-sidebar'
import { ContentCard, ContentFilters } from '@/types/database-refactor'
import { Filter, Menu, X, TrendingUp, Clock, Star } from 'lucide-react'

// 模拟数据 - 实际应用中从API获取
const mockContent: ContentCard[] = [
  {
    id: '1',
    product: {
      name: 'Cursor',
      logo: 'https://cursor.sh/favicon.ico',
      category: 'Code Editor',
      slug: 'cursor'
    },
    title: 'Cursor 0.42 发布 - 全新AI编程体验',
    summary: 'Cursor 最新版本带来了革命性的AI编程体验，包括增强的代码补全、智能重构建议和实时代码审查功能。新版本支持更多编程语言，提升了AI模型的响应速度，让开发者能够更高效地编写高质量代码。',
    keyPoints: [
      '新增智能代码重构功能',
      '支持30+编程语言的AI补全',
      '实时代码质量检查',
      '性能提升40%，响应更快速'
    ],
    importance: 'high',
    publishedAt: '2024-01-15T10:00:00Z',
    originalUrl: 'https://cursor.sh/changelog',
    tags: ['feature', 'ai', 'performance']
  },
  {
    id: '2',
    product: {
      name: 'Claude',
      logo: 'https://www.anthropic.com/favicon.ico',
      category: 'AI Assistant',
      slug: 'claude'
    },
    title: 'Claude 3.5 Haiku 模型正式发布',
    summary: 'Anthropic 发布了 Claude 3.5 Haiku，这是一个专为快速响应优化的轻量级模型。新模型在保持高质量输出的同时，显著提升了处理速度，特别适合需要实时交互的应用场景。',
    keyPoints: [
      '响应速度提升3倍',
      '保持Claude 3的高质量输出',
      '优化的成本效益比',
      '支持多语言和多模态输入'
    ],
    importance: 'high',
    publishedAt: '2024-01-14T15:30:00Z',
    originalUrl: 'https://docs.anthropic.com/claude/docs',
    tags: ['model-release', 'performance', 'api']
  },
  {
    id: '3',
    product: {
      name: 'GitHub Copilot',
      logo: 'https://github.com/favicon.ico',
      category: 'Code Assistant',
      slug: 'github-copilot'
    },
    title: 'GitHub Copilot Chat 增强功能上线',
    summary: 'GitHub Copilot Chat 推出了全新的对话界面和增强的代码理解能力。新版本能够更好地理解项目上下文，提供更精准的代码建议和调试帮助，同时支持自然语言编程指令。',
    keyPoints: [
      '改进的上下文理解能力',
      '支持自然语言编程',
      '增强的调试辅助功能',
      '集成项目级代码分析'
    ],
    importance: 'medium',
    publishedAt: '2024-01-13T09:15:00Z',
    originalUrl: 'https://github.blog/tag/github-copilot/',
    tags: ['chat', 'debugging', 'context']
  }
]

const mockCategories = ['Code Editor', 'AI Assistant', 'Code Assistant', 'Productivity']
const mockSources = [
  { slug: 'cursor', name: 'Cursor' },
  { slug: 'claude', name: 'Claude' },
  { slug: 'github-copilot', name: 'GitHub Copilot' },
  { slug: 'openai', name: 'OpenAI' }
]
const mockTags = ['feature', 'ai', 'performance', 'model-release', 'api', 'chat', 'debugging', 'context']

export default function HomePage() {
  const [content, setContent] = useState<ContentCard[]>(mockContent)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [filters, setFilters] = useState<ContentFilters>({
    page: 1,
    limit: 12,
    sortBy: 'published_at',
    sortOrder: 'desc'
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 模拟数据筛选
  useEffect(() => {
    setLoading(true)
    // 模拟API调用延迟
    setTimeout(() => {
      let filteredContent = [...mockContent]
      
      // 应用筛选逻辑
      if (filters.search) {
        filteredContent = filteredContent.filter(item =>
          item.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          item.summary.toLowerCase().includes(filters.search!.toLowerCase())
        )
      }
      
      if (filters.category) {
        filteredContent = filteredContent.filter(item =>
          item.product.category === filters.category
        )
      }
      
      if (filters.importance) {
        filteredContent = filteredContent.filter(item =>
          item.importance === filters.importance
        )
      }
      
      if (filters.source) {
        filteredContent = filteredContent.filter(item =>
          item.product.slug === filters.source
        )
      }
      
      if (filters.tags?.length) {
        filteredContent = filteredContent.filter(item =>
          filters.tags!.some(tag => item.tags.includes(tag))
        )
      }
      
      setContent(filteredContent)
      setLoading(false)
    }, 500)
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo和站点标题 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ContentCompass</h1>
                  <p className="text-xs text-gray-500">AI产品更新聚合站</p>
                </div>
              </div>
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center space-x-4">
              {/* 筛选按钮 (移动端) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4" />
                筛选
              </Button>
              
              {/* 登录链接 */}
              <Button variant="ghost" size="sm">
                登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 侧边栏筛选 */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              categories={mockCategories}
              sources={mockSources}
              popularTags={mockTags}
              isOpen={false}
              onToggle={() => {}}
            />
          </div>

          {/* 移动端筛选侧边栏 */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            categories={mockCategories}
            sources={mockSources}
            popularTags={mockTags}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(false)}
          />

          {/* 主内容区 */}
          <div className="flex-1 min-w-0">
            {/* 页面头部信息 */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">最新AI产品动态</h2>
                  <p className="text-gray-600 mt-1">
                    实时跟踪AI产品更新，精选重要信息为您呈现
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>实时更新</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{content.length} 条内容</span>
                  </div>
                </div>
              </div>
              
              {/* 筛选标签显示 */}
              {(filters.search || filters.category || filters.importance || filters.source || filters.tags?.length) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {filters.search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      搜索: {filters.search}
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      分类: {filters.category}
                    </span>
                  )}
                  {filters.importance && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      重要性: {filters.importance}
                    </span>
                  )}
                  {filters.source && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      来源: {mockSources.find(s => s.slug === filters.source)?.name}
                    </span>
                  )}
                  {filters.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 内容网格 */}
            <ContentGrid
              content={content}
              loading={loading}
              error={error}
            />

            {/* 分页 (占位) */}
            {content.length > 0 && !loading && (
              <motion.div 
                className="mt-12 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>
                    上一页
                  </Button>
                  <Button variant="outline" className="bg-blue-600 text-white">
                    1
                  </Button>
                  <Button variant="outline">
                    2
                  </Button>
                  <Button variant="outline">
                    下一页
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">ContentCompass</h3>
                  <p className="text-sm text-gray-500">AI产品更新聚合站</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                自动监控和AI处理AI产品的更新信息，为关注AI产品动态的开发者、研究者、从业者提供精炼的信息摘要。
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">产品</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">关于我们</a></li>
                <li><a href="#" className="hover:text-gray-900">API文档</a></li>
                <li><a href="#" className="hover:text-gray-900">RSS订阅</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">联系</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">联系我们</a></li>
                <li><a href="#" className="hover:text-gray-900">反馈建议</a></li>
                <li><a href="#" className="hover:text-gray-900">技术支持</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 ContentCompass. 专注AI产品信息聚合。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}