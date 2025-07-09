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
import { TrendingUp, Sparkles, Settings } from 'lucide-react'

// 模拟数据 - 实际应用中从API获取
const mockContent: ContentCard[] = [
  {
    id: '1',
    product: {
      name: 'Cursor',
      logo: 'https://cursor.sh/favicon.ico',
      category: 'AI Code Editor',
      slug: 'cursor'
    },
    title: 'Cursor 1.2 - Agent智能任务规划与Slack集成',
    summary: 'Cursor 1.2版本于7月3日发布，带来了重大的Agent改进，包括结构化待办事项列表、依赖关系跟踪、消息队列功能，以及完整的Slack集成。Memory功能已正式发布，同时新增PR索引和摘要功能。',
    keyPoints: [
      'Agent结构化任务规划和依赖跟踪',
      '消息队列允许任务重新排序',
      'Memory功能正式发布(GA)',
      'PR索引和摘要功能',
      '完整的Slack集成支持'
    ],
    importance: 'high',
    publishedAt: '2025-07-03T14:00:00Z',
    originalUrl: 'https://cursor.com/changelog',
    tags: ['agent', 'slack', 'memory', 'pr-indexing', 'planning']
  },
  {
    id: '2',
    product: {
      name: 'Claude',
      logo: 'https://www.anthropic.com/favicon.ico',
      category: 'AI Assistant',
      slug: 'claude'
    },
    title: 'Claude 4正式发布 - Opus 4与Sonnet 4',
    summary: 'Anthropic于7月7日发布Claude 4系列，包括Claude Opus 4和Claude Sonnet 4。Opus 4成为世界最佳编程模型，在SWE-bench获得72.5%的成绩。新增扩展思考、工具使用、改进内存等功能。',
    keyPoints: [
      'Claude Opus 4领先SWE-bench (72.5%)',
      '可连续工作数小时处理长期任务',
      '扩展思考期间支持工具使用',
      '显著改进的内存能力',
      'Claude Code正式发布'
    ],
    importance: 'high',
    publishedAt: '2025-07-07T16:30:00Z',
    originalUrl: 'https://www.anthropic.com/news/claude-4',
    tags: ['claude4', 'opus4', 'sonnet4', 'coding', 'reasoning']
  },
  {
    id: '3',
    product: {
      name: 'GitHub Copilot',
      logo: 'https://github.com/favicon.ico',
      category: 'Code Assistant',
      slug: 'github-copilot'
    },
    title: 'GitHub Copilot编程代理与Pro+计划',
    summary: 'GitHub Copilot推出编程代理功能，可以代理处理开放issue，自动规划、编写、测试和迭代代码。新增Copilot Pro+计划，提供最新模型访问权限，包括GPT-4.5和Claude 4支持。',
    keyPoints: [
      'Copilot编程代理自动处理issue',
      'MCP协议集成外部资源',
      'Copilot Spaces组织上下文',
      'Pro+计划提供最新模型访问',
      'VS Code开源GitHub Copilot集成'
    ],
    importance: 'high',
    publishedAt: '2025-07-05T11:20:00Z',
    originalUrl: 'https://github.com/features/copilot/whats-new',
    tags: ['agent', 'pro-plus', 'mcp', 'workspace', 'vscode']
  },
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
        <div className="relative w-full px-4 md:px-6 lg:px-8">
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
            <div className="w-full max-w-full space-y-8">
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