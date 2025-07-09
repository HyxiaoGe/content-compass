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
    title: 'Cursor 1.2 - 企业级AI编程助手全面升级',
    summary: 'Cursor 1.2版本带来了突破性的Agent智能规划系统，可以为复杂任务创建结构化待办清单并跟踪依赖关系。新增企业级Slack集成，支持直接从Slack启动Background Agent。Tab补全速度提升100ms，新增PR语义搜索，Memory系统正式商用，显著提升长期项目的上下文理解能力。',
    keyPoints: [
      'Agent创建结构化待办清单，自动分解复杂任务并跟踪依赖关系',
      '队列消息系统：可预先排队多个Agent任务，支持任务重新排序',
      'Memory系统正式发布：改进生成质量，增加用户审批机制',
      'PR语义搜索：支持PR、issue、commit的深度搜索和索引',
      'Slack企业集成：直接从Slack启动Agent，理解线程上下文',
      'Tab补全性能优化：响应时间减少100ms，大幅提升编码流畅度',
      'Agent合并冲突解决：自动处理Git合并冲突',
      'Background Agent改进：支持长时间运行的后台任务'
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
    title: 'Claude 4突破性发布 - 重新定义AI编程助手',
    summary: 'Anthropic发布Claude 4系列，包括旗舰级Claude Opus 4和高效版Claude Sonnet 4。Opus 4在SWE-bench达到72.5%，Sonnet 4更是突破至72.7%，成为业界最强编程模型。引入扩展思考与工具并行执行，显著减少65%的任务"捷径"使用，真正实现虚拟协作者级别的AI能力。',
    keyPoints: [
      'SWE-bench性能突破：Opus 4 (72.5%)，Sonnet 4 (72.7%)',
      'Terminal-bench领先：Opus 4 (43.2%)，创造业界新纪录',
      '扩展思考与工具并行执行：同时运行多个工具提升效率',
      '改进内存能力：长期任务上下文保持和专注度提升',
      '任务完成质量提升：减少65%的"捷径"使用，更精确执行',
      'Claude Code集成：VS Code、JetBrains原生支持',
      '多平台可用：Anthropic API、AWS Bedrock、Google Cloud',
      '灵活定价：Opus 4 ($15/$75)，Sonnet 4 ($3/$15) 每百万token'
    ],
    importance: 'high',
    publishedAt: '2025-07-07T16:30:00Z',
    originalUrl: 'https://www.anthropic.com/news/claude-4',
    tags: ['claude4', 'swe-bench', 'coding', 'reasoning', 'claude-code']
  },
  {
    id: '3',
    product: {
      name: 'GitHub Copilot',
      logo: 'https://github.com/favicon.ico',
      category: 'Code Assistant',
      slug: 'github-copilot'
    },
    title: 'GitHub Copilot Agent全新管理界面与Pro用户扩展',
    summary: 'GitHub Copilot在7月3日推出全新的Agent管理页面，简化任务启动和进度跟踪。Copilot编程代理扩展至Pro用户，支持学生、教师和开源维护者。新增多任务并行处理能力，MCP服务器集成，提供GPT-4.5等最新模型访问权限。',
    keyPoints: [
      'Agent管理页面：统一的任务启动和进度跟踪界面',
      'Pro用户代理访问：学生、教师、开源维护者均可使用',
      '多任务并行处理：Copilot可同时处理多个编程任务',
      'MCP服务器集成：连接外部资源和仓库数据',
      '完整开发流程：自动规划、编写、测试、迭代代码',
      'Pro+高级功能：GPT-4.5访问权限，1500月度高级请求',
      '消费计费更新：每月配额重置，精确计费管理',
      '全面测试能力：提交完整测试的Pull Request'
    ],
    importance: 'high',
    publishedAt: '2025-07-03T16:00:00Z',
    originalUrl: 'https://github.com/features/copilot/whats-new',
    tags: ['agent-page', 'pro-access', 'multi-task', 'mcp', 'billing']
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