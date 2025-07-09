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
      id: '1-prev',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 1.1 - Slack深度集成与上下文理解',
      summary: 'Cursor 1.1专注于企业协作场景，引入了完整的Slack集成功能。可以直接从Slack启动Background Agent，Agent能够理解Slack线程上下文，实现真正的团队协作编程。同时改进了搜索和集成功能，为团队开发提供更好的支持。',
      keyPoints: [
        'Slack深度集成：直接从Slack频道启动Background Agent',
        'Slack线程上下文理解：Agent可以读取和理解Slack对话内容',
        '团队协作增强：支持多人协作的代码编写和审查',
        '改进的搜索功能：更精确的代码库搜索和定位',
        '集成功能优化：与第三方工具的连接更加稳定',
        '企业级安全：支持企业级权限控制和数据保护'
      ],
      importance: 'high',
      publishedAt: '2025-06-12T16:00:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['slack', 'collaboration', 'enterprise', 'background-agent']
    },
    {
      id: '1-prev2',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 1.0 - 里程碑版本正式发布',
      summary: 'Cursor 1.0正式发布，标志着AI代码编辑器进入成熟阶段。引入革命性的BugBot自动代码审查系统，Background Agent全面开放，支持Jupyter Notebook，Memory功能进入Beta测试。一键式MCP服务器安装，支持Mermaid图表和Markdown表格的丰富聊天响应。',
      keyPoints: [
        'BugBot自动PR代码审查：智能检测潜在bug和代码质量问题',
        'Background Agent全面开放：所有用户可使用后台AI助手',
        'Jupyter Notebook完整支持：无缝集成数据科学工作流',
        'Memory Beta功能：AI助手开始具备长期记忆能力',
        '一键MCP服务器安装：简化开发环境配置',
        '丰富聊天响应：支持Mermaid流程图和Markdown表格显示',
        '全新设置和控制面板：提供更直观的配置界面',
        '企业级稳定性：针对大型项目优化性能'
      ],
      importance: 'high',
      publishedAt: '2025-06-04T10:00:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['milestone', 'bugbot', 'background-agent', 'jupyter', 'memory']
    },
    {
      id: '1-prev3',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 0.50 - 定价模式革新与智能化提升',
      summary: 'Cursor 0.50版本重新定义了AI代码编辑器的商业模式，推出简化的定价结构和Max Mode功能。全新的Tab模型支持更智能的代码补全，Background Agent进入预览阶段。改进上下文管理，重新设计内联编辑功能，支持多根工作区。',
      keyPoints: [
        '简化定价模式：更透明、更灵活的订阅方案',
        'Max Mode顶级模型：访问最强大的AI编程模型',
        '全新Tab模型：智能预测下一步代码编写意图',
        'Background Agent预览：后台AI助手开始测试',
        '改进的上下文管理：更好地理解项目结构和依赖',
        '重新设计的内联编辑：更流畅的代码修改体验',
        '多根工作区支持：同时处理多个项目根目录',
        '性能优化：整体响应速度和稳定性提升'
      ],
      importance: 'high',
      publishedAt: '2025-05-15T14:20:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['pricing', 'max-mode', 'tab-model', 'background-agent', 'workspace']
    },
    {
      id: '1-prev4',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 0.45 - 多模型支持与性能优化',
      summary: 'Cursor 0.45版本引入了多AI模型支持，用户可以根据不同场景选择最适合的模型。大幅优化了代码分析速度，新增实时协作功能，支持团队成员同时编辑同一个项目。',
      keyPoints: [
        '多AI模型切换：支持GPT-4、Claude等多种模型',
        '代码分析性能提升50%：更快的语法检查和错误检测',
        '实时协作功能：多人同时编辑代码',
        '智能代码格式化：自动调整代码风格',
        '扩展生态系统：支持更多第三方插件'
      ],
      importance: 'medium',
      publishedAt: '2024-12-20T11:30:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['multi-model', 'performance', 'collaboration', 'plugins']
    },
    {
      id: '1-prev5',
      product: {
        name: 'Cursor',
        logo: 'https://cursor.sh/favicon.ico',
        category: 'AI Code Editor',
        slug: 'cursor'
      },
      title: 'Cursor 0.42 - 初始AI助手功能',
      summary: 'Cursor 0.42版本首次引入AI助手功能，提供基础的代码补全和智能建议。这是Cursor向AI代码编辑器转型的重要里程碑，为后续版本奠定了基础。',
      keyPoints: [
        '首次引入AI代码补全功能',
        '智能代码建议和自动修复',
        '基础的上下文理解能力',
        '简单的重构建议功能'
      ],
      importance: 'medium',
      publishedAt: '2024-11-15T09:20:00Z',
      originalUrl: 'https://cursor.com/changelog',
      tags: ['ai-assistant', 'code-completion', 'refactoring', 'milestone']
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
      id: '2-prev',
      product: {
        name: 'Claude',
        logo: 'https://www.anthropic.com/favicon.ico',
        category: 'AI Assistant',
        slug: 'claude'
      },
      title: 'Claude Code正式发布 - 命令行AI编程助手',
      summary: 'Claude Code从研究预览版正式发布为通用可用版本，这是一个革命性的"代理式命令行工具"。支持TypeScript和Python SDK，集成SSE和HTTP传输的MCP服务器，提供OAuth 2.0身份验证。新增钩子支持，允许开发者通过GitHub Issues参与社区建设。',
      keyPoints: [
        'Claude Code正式GA发布：从研究预览到生产就绪',
        'TypeScript和Python SDK：完整的开发者工具包',
        'MCP服务器集成：支持SSE和HTTP传输协议',
        'OAuth 2.0身份验证：使用/mcp命令进行安全认证',
        'MCP资源引用：支持@server:protocol://path格式',
        '钩子系统支持：允许自定义工作流和集成',
        'GitHub Actions集成：原生CI/CD支持',
        'IDE原生支持：VS Code和JetBrains完整集成'
      ],
      importance: 'high',
      publishedAt: '2025-06-30T14:00:00Z',
      originalUrl: 'https://docs.anthropic.com/en/release-notes/claude-code',
      tags: ['claude-code', 'sdk', 'mcp', 'oauth', 'github-actions']
    },
    {
      id: '2-prev2',
      product: {
        name: 'Claude',
        logo: 'https://www.anthropic.com/favicon.ico',
        category: 'AI Assistant',
        slug: 'claude'
      },
      title: 'Claude Code成为通用可用版本',
      summary: 'Claude Code在5月22日正式从研究预览版升级为通用可用版本，标志着AI命令行工具的成熟。6月4日开始支持Pro和Max订阅计划，为专业开发者提供更强大的AI编程助手功能。',
      keyPoints: [
        'Claude Code正式GA：生产环境就绪',
        'Pro和Max计划支持：专业开发者功能',
        '稳定性和性能提升：企业级可靠性',
        '扩展的API功能：更多编程语言支持',
        '改进的错误处理：更好的开发体验',
        '社区支持增强：详细文档和示例'
      ],
      importance: 'high',
      publishedAt: '2025-05-22T16:00:00Z',
      originalUrl: 'https://docs.anthropic.com/en/release-notes/claude-code',
      tags: ['ga-release', 'pro-max', 'stability', 'enterprise']
    },
    {
      id: '2-prev3',
      product: {
        name: 'Claude',
        logo: 'https://www.anthropic.com/favicon.ico',
        category: 'AI Assistant',
        slug: 'claude'
      },
      title: 'Claude Code研究预览版发布',
      summary: 'Anthropic在2月24日首次发布Claude Code研究预览版，这是一个全新的"代理式命令行工具"。这标志着Claude生态系统从对话式AI扩展到开发者工具领域的重要里程碑。',
      keyPoints: [
        'Claude Code首次发布：代理式命令行工具',
        '研究预览版状态：早期访问和反馈',
        '开发者工具生态：扩展Claude应用场景',
        '命令行AI交互：新的人机交互模式',
        '代理式架构：自主执行复杂任务',
        '社区驱动开发：开放式反馈机制'
      ],
      importance: 'medium',
      publishedAt: '2025-02-24T10:00:00Z',
      originalUrl: 'https://docs.anthropic.com/en/release-notes/claude-code',
      tags: ['research-preview', 'command-line', 'agentic', 'developer-tools']
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
        const allData = mockDetailData[slug] || []
        
        // 过滤半年内的更新记录
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        
        const filteredData = allData.filter(item => {
          const publishDate = new Date(item.publishedAt)
          return publishDate >= sixMonthsAgo
        })
        
        setContent(filteredData)
        if (filteredData.length > 0) {
          setProductInfo(filteredData[0].product)
        } else if (allData.length > 0) {
          // 如果半年内没有更新，至少显示产品信息
          setProductInfo(allData[0].product)
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
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              查看 {productInfo.name} 的所有更新记录和AI蒸馏后的核心信息
            </p>
            <div className="flex items-center justify-center">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                显示近6个月更新记录
              </Badge>
            </div>
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