// 产品详情页 - AI风格的changelog展示
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FluidBackground } from '@/components/effects/fluid-background'
import { HolographicStatusBar } from '@/components/effects/holographic-ui'
import { CursorEffect } from '@/components/front/cursor-effect'
import { ContentCard } from '@/types/database-refactor'
import { ArrowLeft, ExternalLink, Clock, Calendar, TrendingUp, Sparkles, Zap, Brain, Cpu, Globe, Settings } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Image from 'next/image'

// 模拟详情数据 - 实际应用中从API获取
const mockDetailData: Record<string, ContentCard[]> = {
  'cursor': [
    {
      id: '1',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 1.0 正式发布 - 全新里程碑版本',
      summary: 'Cursor 1.0 正式发布，这是一个重要的里程碑版本。包含全新的 BugBot 代码审查功能、Memory 系统正式版、一键式 MCP 设置、Jupyter 支持，以及 Background Agent 的全面可用性。',
      keyPoints: [
        'BugBot 代码审查功能正式发布',
        'Memory 系统达到正式版本',
        '一键式 MCP 设置简化工作流',
        'Jupyter notebook 完整支持',
        'Background Agent 全面可用'
      ],
      importance: 'high',
      publishedAt: '2024-12-15T10:00:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['major-release', 'bugbot', 'memory', 'jupyter']
    },
    {
      id: '1-prev',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 0.40.3 - Agent 智能规划与多文件支持',
      summary: 'Agent 现在可以通过结构化的待办事项列表进行提前规划，使长期任务更易理解和跟踪。新增多文件 Tab 模型，支持跨文件的代码建议和语法高亮。',
      keyPoints: [
        'Agent 结构化待办事项列表',
        '可为 Agent 排队后续消息',
        '多文件 Tab 模型支持',
        '跨文件代码建议功能',
        '代码建议语法高亮'
      ],
      importance: 'high',
      publishedAt: '2024-11-28T14:30:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['agent', 'multi-file', 'planning', 'tab-model']
    },
    {
      id: '1-prev2',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 0.39.x - GitHub PR 集成与统一定价',
      summary: 'Cursor 现在可以索引和总结 GitHub PR，就像处理文件一样。引入基于请求的统一定价模式，为所有顶级模型提供 Max Mode，并支持并行任务执行。',
      keyPoints: [
        'GitHub PR 索引和总结功能',
        '统一的基于请求的定价模式',
        '所有顶级模型的 Max Mode',
        'Background Agent 并行执行',
        'Slack 集成和远程运行'
      ],
      importance: 'high',
      publishedAt: '2024-10-20T09:00:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['github', 'pricing', 'max-mode', 'slack']
    },
    {
      id: '1-prev3',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 0.38.x - Memory 系统改进',
      summary: 'Memory 系统质量大幅提升，改进了生成质量并增加了用户审批功能。Agent 现在可以在安全环境中远程运行，并直接在 Slack 中发送更新。',
      keyPoints: [
        'Memory 生成质量提升',
        '用户审批功能增强',
        'Agent 远程安全运行',
        'Slack 直接更新通知',
        '改进的用户体验'
      ],
      importance: 'medium',
      publishedAt: '2024-09-15T16:45:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['memory', 'agent', 'slack', 'security']
    }
  ],
  'claude': [
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
    }
  ],
  'github-copilot': [
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
  ],
  'openai': [
    {
      id: '4',
      product: {
        name: 'OpenAI',
        logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/openai-icon.png',
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
    }
  ],
  'perplexity': [
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
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [content, setContent] = useState<ContentCard[]>([])
  const [loading, setLoading] = useState(true)
  const [productInfo, setProductInfo] = useState<ContentCard['product'] | null>(null)

  useEffect(() => {
    if (slug) {
      setLoading(true)
      // 模拟API调用
      setTimeout(() => {
        const data = mockDetailData[slug] || []
        setContent(data)
        if (data.length > 0) {
          setProductInfo(data[0].product)
        }
        setLoading(false)
      }, 500)
    }
  }, [slug])

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return (
          <Badge className="relative overflow-hidden bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 animate-pulse" />
            <Zap className="w-3 h-3 mr-1 relative z-10" />
            <span className="relative z-10">高重要</span>
          </Badge>
        )
      case 'medium':
        return (
          <Badge className="relative overflow-hidden bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 backdrop-blur-sm">
            <Brain className="w-3 h-3 mr-1" />
            中重要
          </Badge>
        )
      case 'low':
        return (
          <Badge className="relative overflow-hidden bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 text-gray-300 backdrop-blur-sm">
            <Cpu className="w-3 h-3 mr-1" />
            低重要
          </Badge>
        )
      default:
        return <Badge variant="outline" className="text-xs">未知</Badge>
    }
  }

  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true, locale: zhCN })
    } catch {
      return '时间未知'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <FluidBackground />
        <CursorEffect />
        <div className="flex justify-center items-center h-screen">
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
      </div>
    )
  }

  if (!productInfo || content.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <FluidBackground />
        <CursorEffect />
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-4xl font-bold text-white mb-4">产品未找到</h1>
          <p className="text-gray-400 mb-8">请检查产品标识是否正确</p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
          >
            返回首页
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D流体粒子背景 */}
      <FluidBackground />
      
      {/* 高级鼠标效果 */}
      <CursorEffect />
      
      {/* 全息状态栏 */}
      <HolographicStatusBar />
      
      {/* 导航栏 */}
      <nav className="relative z-40 p-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-gray-300 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
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
          </motion.div>
        </div>
      </nav>

      {/* 产品头部 */}
      <header className="relative z-10 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 p-4">
                  <Image
                    src={productInfo.logo || '/placeholder-logo.png'}
                    alt={productInfo.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {productInfo.name}
              </span>
            </h1>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 backdrop-blur-sm">
                <Globe className="w-3 h-3 mr-1" />
                {productInfo.category}
              </Badge>
              <div className="flex items-center text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                {content.length} 个更新记录
              </div>
            </div>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              查看 {productInfo.name} 的所有更新记录和AI蒸馏后的核心信息
            </p>
          </motion.div>
        </div>
      </header>

      {/* 更新记录列表 */}
      <main className="relative z-10 py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {content.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl hover:border-cyan-500/30 hover:shadow-cyan-500/20 transition-all duration-700">
                  
                  {/* 毛玻璃反射效果 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* 扫描线动画 */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  
                  <CardContent className="relative z-10 p-8">
                    {/* 头部信息 */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-400 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatPublishedDate(item.publishedAt)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getImportanceBadge(item.importance)}
                      </div>
                    </div>

                    {/* 标题和摘要 */}
                    <div className="space-y-4 mb-6">
                      <h2 className="text-3xl font-bold text-white leading-tight">
                        {item.title}
                      </h2>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {item.summary}
                      </p>
                    </div>

                    {/* 关键点 */}
                    {item.keyPoints && item.keyPoints.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-white mb-4 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-cyan-400" />
                          关键亮点
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.keyPoints.map((point, i) => (
                            <div key={i} className="flex items-start bg-white/5 backdrop-blur-sm rounded-lg p-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 标签 */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="text-xs bg-white/5 border-white/20 text-gray-300 backdrop-blur-sm hover:bg-white/10 transition-colors"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 底部操作 */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="text-sm text-gray-400">
                        发布于 {formatPublishedDate(item.publishedAt)}
                      </div>
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium rounded-xl backdrop-blur-sm transition-all duration-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/50 hover:text-white hover:scale-105"
                      >
                        查看原文
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="relative mt-32 py-16 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
            <p className="text-sm text-gray-500">
              &copy; 2024 ContentCompass. Powered by AI Technology.
            </p>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  )
}