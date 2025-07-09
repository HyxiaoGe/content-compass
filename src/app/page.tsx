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
      name: 'Stability AI',
      logo: 'https://stability.ai/favicon.ico',
      category: 'AI Image Generation',
      slug: 'stability-ai'
    },
    title: 'Stable Diffusion 3.5全系列发布 - 图像生成新突破',
    summary: 'Stability AI发布Stable Diffusion 3.5完整产品线，包括Large、Large Turbo和Medium三个版本。同时推出革命性的Stable Fast 3D技术，实现从单张图片快速生成3D资产。新增Stable Virtual Camera多视角视频生成功能，为创作者提供前所未有的3D相机控制能力。',
    keyPoints: [
      'Stable Diffusion 3.5全系列：Large、Large Turbo、Medium版本',
      'Stable Fast 3D：单张图片快速生成3D资产技术',
      'Stable Virtual Camera：多视角视频生成与3D相机控制',
      '研究预览状态：持续优化中的前沿技术',
      'NVIDIA合作：针对SD3.5模型进行专项优化',
      'AMD GPU支持：为Radeon显卡优化性能',
      'AWS深度合作：扩展云端部署能力',
      '企业级解决方案：与WPP战略投资合作'
    ],
    importance: 'high',
    publishedAt: '2025-06-15T14:30:00Z',
    originalUrl: 'https://stability.ai/news',
    tags: ['stable-diffusion', '3d-generation', 'video-generation', 'nvidia', 'enterprise']
  },
  {
    id: '6',
    product: {
      name: 'Alibaba Qwen',
      logo: 'https://qianwen.aliyun.com/favicon.ico',
      category: 'AI Language Model',
      slug: 'qwen'
    },
    title: 'Qwen3旗舰模型发布 - 多模态AI能力全面升级',
    summary: 'Alibaba发布Qwen3系列旗舰模型，包括235B参数的Qwen3-235B-A22B和轻量级的Qwen3-30B-A3B。全面升级编程、数学和通用能力，4B小模型即可匹敌Qwen2性能。同时发布QVQ-Max视觉推理模型、Qwen-TTS语音合成和Qwen VLo多模态理解生成模型。',
    keyPoints: [
      'Qwen3-235B-A22B旗舰模型：顶级编程、数学、通用能力',
      'Qwen3-30B-A3B小型MoE：超越前代模型性能',
      'QVQ-Max视觉推理：图像和视频内容深度分析',
      'Qwen-TTS语音合成：支持3种中文方言和7种双语声音',
      'Qwen VLo多模态：统一理解和生成高质量内容',
      'Qwen3 Embedding：文本嵌入和重排序SOTA性能',
      '4B轻量级模型：媲美Qwen2的强大性能',
      '全面开源：支持商业化应用和社区贡献'
    ],
    importance: 'high',
    publishedAt: '2025-06-27T10:00:00Z',
    originalUrl: 'https://qwenlm.github.io/blog/',
    tags: ['qwen3', 'multimodal', 'tts', 'vision', 'embedding', 'open-source']
  },
  {
    id: '7',
    product: {
      name: 'Google Gemini',
      logo: 'https://www.gstatic.com/devrel-devsite/prod/v9c8f5f3b0d4e5a8f7e6b5c2d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f/ai/images/gemini/favicon.ico',
      category: 'AI Assistant',
      slug: 'gemini'
    },
    title: 'Gemini 2.5全系列发布 - 通用AI助手新突破',
    summary: 'Google发布Gemini 2.5系列模型，包括稳定版Pro和通用版Flash，同时推出最高性价比的Flash-Lite版本。新增音频对话和生成功能，大幅扩展多模态理解能力。配合Gemma 3n移动端AI和Veo 3/Imagen 4生成模型，构建全面的通用AI助手生态系统。',
    keyPoints: [
      'Gemini 2.5 Pro稳定版：企业级性能和可靠性',
      'Gemini 2.5 Flash通用版：平衡性能与效率的最佳选择',
      'Gemini 2.5 Flash-Lite：最高性价比和最快响应速度',
      '音频对话生成：全新的语音交互体验',
      '多模态理解增强：图像、视频、文本统一处理',
      'Gemma 3n移动AI：专为设备端快速多模态AI优化',
      'Veo 3视频生成：下一代视频内容创作工具',
      'Imagen 4图像生成：高质量图像生成与编辑'
    ],
    importance: 'high',
    publishedAt: '2025-06-17T14:00:00Z',
    originalUrl: 'https://deepmind.google/discover/blog/',
    tags: ['gemini-2.5', 'multimodal', 'audio', 'mobile', 'veo', 'imagen', 'universal-ai']
  },
  {
    id: '8',
    product: {
      name: 'DeepSeek',
      logo: 'https://www.deepseek.com/favicon.ico',
      category: 'AI Reasoning Model',
      slug: 'deepseek'
    },
    title: 'DeepSeek-R1推理模型突破 - 开源AI推理新标杆',
    summary: 'DeepSeek发布R1系列推理模型，性能媲美OpenAI o1的同时训练成本仅为其十分之一。671B参数MoE架构，128K上下文窗口，在数学、编程、推理任务上实现SOTA性能。完全开源且支持商业使用，引发全球AI市场震动。',
    keyPoints: [
      'DeepSeek-R1推理模型：性能媲美OpenAI o1，成本仅560万美元',
      'DeepSeek-R1-0528升级版：支持系统提示、JSON输出和函数调用',
      'R1-Zero强化学习：无需监督微调的纯RL训练方法',
      '蒸馏版本发布：R1-Distill-Qwen-32B超越o1-mini性能',
      'AIME 2025测试：准确率从70%提升至87.5%',
      'MIT开源许可：支持商业使用和社区贡献',
      'App Store冲榜：超越ChatGPT成为下载量第一',
      '移动GPU支持：单GPU即可运行的轻量级版本'
    ],
    importance: 'high',
    publishedAt: '2025-05-29T16:00:00Z',
    originalUrl: 'https://www.deepseek.com/',
    tags: ['deepseek-r1', 'reasoning', 'open-source', 'cost-efficient', 'reinforcement-learning', 'distilled']
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