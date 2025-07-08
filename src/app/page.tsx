// 重构后的前台主页 - AI信息聚合展示站

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { TimelineCard } from '@/components/front/timeline-card'
import { AnimatedBackground } from '@/components/front/animated-background'
import { CursorEffect } from '@/components/front/cursor-effect'
import { ContentCard } from '@/types/database-refactor'
import { TrendingUp, Sparkles } from 'lucide-react'

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
  },
  {
    id: '4',
    product: {
      name: 'OpenAI',
      logo: 'https://openai.com/favicon.ico',
      category: 'AI Platform',
      slug: 'openai'
    },
    title: 'GPT-4 Turbo 128K上下文窗口升级',
    summary: 'OpenAI推出了GPT-4 Turbo的重大更新，将上下文窗口扩展到128K tokens，相当于300页文本。新版本不仅处理能力更强，还优化了响应速度和成本效益，让开发者能够构建更复杂的AI应用。',
    keyPoints: [
      '上下文窗口扩展至128K tokens',
      '处理速度提升2.5倍',
      '成本降低30%',
      '支持更复杂的多轮对话'
    ],
    importance: 'high',
    publishedAt: '2024-01-12T14:00:00Z',
    originalUrl: 'https://openai.com/blog/gpt-4-turbo',
    tags: ['model-update', 'context-window', 'performance']
  },
  {
    id: '5',
    product: {
      name: 'Perplexity',
      logo: 'https://framerusercontent.com/images/pta2kExQjjj4WH50JAVR6D1QNFQ.png',
      category: 'AI Search',
      slug: 'perplexity'
    },
    title: 'Perplexity Pro搜索能力全面升级',
    summary: 'Perplexity推出了Pro版本的重大更新，集成了最新的AI模型，提供更准确的实时信息搜索和分析能力。新版本支持多模态输入，可以同时处理文本、图片和文档，为用户提供更全面的搜索体验。',
    keyPoints: [
      '集成GPT-4和Claude最新模型',
      '支持图片和文档搜索',
      '实时网络信息更新',
      '增强的引用验证系统'
    ],
    importance: 'medium',
    publishedAt: '2024-01-11T11:30:00Z',
    originalUrl: 'https://blog.perplexity.ai/pro-update',
    tags: ['search', 'multimodal', 'real-time']
  }
]

export default function HomePage() {
  const [content, setContent] = useState<ContentCard[]>(mockContent)
  const [loading, setLoading] = useState(false)

  // 模拟数据加载
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setContent(mockContent)
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* 动态背景 */}
      <AnimatedBackground />
      
      {/* 鼠标效果 */}
      <CursorEffect />
      
      {/* 简化的顶部导航 */}
      <header className="relative bg-gray-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo和站点标题 */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ContentCompass
                </h1>
                <p className="text-sm text-gray-400">AI产品更新聚合站</p>
              </div>
            </motion.div>

            {/* 登录按钮 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-lg shadow-lg shadow-blue-500/25 border-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                登录
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="relative w-full px-4 sm:px-6 lg:px-8 py-12 z-10">
        {/* 页面头部信息 */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              最新AI产品动态
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            实时跟踪AI产品更新，精选重要信息为您呈现
          </motion.p>
          
          {/* 装饰性元素 */}
          <motion.div
            className="mt-8 flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </motion.div>
        </motion.div>

        {/* 交替式卡片布局 */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full"></div>
                <div className="absolute inset-2 w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-8">
              {content.map((item, index) => (
                <TimelineCard 
                  key={item.id} 
                  content={item} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="relative bg-gray-900/80 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">ContentCompass</h3>
                  <p className="text-sm text-gray-400">AI产品更新聚合站</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                自动监控和AI处理AI产品的更新信息，为关注AI产品动态的开发者、研究者、从业者提供精炼的信息摘要。
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">产品</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors">RSS订阅</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">联系</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">反馈建议</a></li>
                <li><a href="#" className="hover:text-white transition-colors">技术支持</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2024 ContentCompass. 专注AI产品信息聚合。
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}