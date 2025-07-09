// AI科技感前台主页 - 终极未来体验

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FluidBackground } from '@/components/effects/fluid-background'
import { GlassmorphismCard } from '@/components/effects/glassmorphism-card'
import { HolographicHeader, HolographicStatusBar } from '@/components/effects/holographic-ui'
import { CursorEffect } from '@/components/front/cursor-effect'
import { ContentCard } from '@/types/database-refactor'
import { TrendingUp, Sparkles, Settings, User } from 'lucide-react'

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D流体粒子背景 */}
      <FluidBackground />
      
      {/* 高级鼠标效果 */}
      <CursorEffect />
      
      {/* 全息状态栏 */}
      <HolographicStatusBar />
      
      {/* 极简导航栏 */}
      <nav className="relative z-40 p-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300 tracking-wider">CONTENT COMPASS</span>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-300 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/25"
            >
              <User className="w-4 h-4 mr-2" />
              登录
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* 全息头部 */}
      <HolographicHeader />

      {/* 主要内容区域 */}
      <main className="relative z-10 py-12">
        {/* 内容标题 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              实时数据流
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            AI驱动的信息聚合，为您提供最新的产品动态和技术洞察
          </p>
        </motion.div>

        {/* 毛玻璃卡片布局 */}
        <div className="relative w-full px-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full"></div>
                <div className="absolute inset-2 w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                <div className="absolute inset-4 w-8 h-8 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" style={{ animationDuration: '0.5s' }}></div>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-12">
              {content.map((item, index) => (
                <GlassmorphismCard 
                  key={item.id} 
                  content={item} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 全息页脚 */}
      <footer className="relative mt-32">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent" />
        
        <div className="relative z-10 px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">ContentCompass</h3>
                    <p className="text-xs text-gray-400">AI信息聚合引擎</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  基于先进AI技术的实时信息聚合平台，为您提供最前沿的科技动态。
                </p>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-white mb-6 flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2" />
                  核心功能
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">智能内容聚合</li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">实时数据分析</li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">AI驱动洞察</li>
                </ul>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-white mb-6 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                  连接我们
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="hover:text-purple-400 transition-colors cursor-pointer">技术文档</li>
                  <li className="hover:text-purple-400 transition-colors cursor-pointer">API接口</li>
                  <li className="hover:text-purple-400 transition-colors cursor-pointer">开发者社区</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                <p className="text-sm text-gray-500">
                  &copy; 2024 ContentCompass. Powered by AI Technology.
                </p>
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}