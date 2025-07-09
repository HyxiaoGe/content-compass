// AI科技感前台主页 - 终极未来体验

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FluidBackground } from '@/components/effects/fluid-background'
import { GlassmorphismCard } from '@/components/effects/glassmorphism-card'
import { HolographicHeader } from '@/components/effects/holographic-ui'
import { CursorEffect } from '@/components/front/cursor-effect'
import { ContentCard } from '@/types/database-refactor'
import { TrendingUp } from 'lucide-react'

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
    title: 'Claude 4对话AI升级 - 网页搜索、语音模式与协作工具',
    summary: 'Anthropic推出Claude 4系列对话AI，包括旗舰级Opus 4和高效版Sonnet 4。新增网页搜索、语音模式、Projects协作功能和Computer Use计算机控制能力。Claude 3.7 Sonnet引入混合推理模式，允许用户在快速响应和深度思考之间选择，重新定义智能对话助手体验。',
    keyPoints: [
      'Claude 4对话模型：Opus 4旗舰级推理和Sonnet 4高效响应',
      '网页搜索功能：2025年3月推出，支付用户可实时搜索网络信息',
      '语音模式Beta：2025年5月推出，支持英语语音交互',
      'Projects协作功能：团队知识管理和对话组织工具',
      'Computer Use：2024年10月推出，可控制计算机屏幕和输入设备',
      'Artifacts创作工具：实时代码预览和交互式内容创建',
      'Google Workspace集成：连接邮件、日历和文档',
      'Claude 3.7 Sonnet混合推理：快速响应与深度思考模式切换'
    ],
    importance: 'high',
    publishedAt: '2025-07-07T16:30:00Z',
    originalUrl: 'https://www.anthropic.com/news/claude-4',
    tags: ['claude4', 'voice-mode', 'web-search', 'projects', 'computer-use', 'artifacts']
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
    title: 'OpenAI 2025核心产品全面升级 - GPT-4o、o3/o4推理模型与Canvas协作',
    summary: 'OpenAI在2025年推出了全面的产品升级，GPT-4o正式取代GPT-4成为标准模型，在写作、编程、STEM等领域表现卓越。全新o3-pro和o4-mini推理模型提供更强的复杂推理能力。Advanced Voice升级带来更自然的语音交互，Library功能统一管理生成内容，Projects和Scheduled Tasks提升工作效率。',
    keyPoints: [
      'GPT-4o全面替代GPT-4：原生多模态模型，在写作、编程、STEM等领域全面超越',
      'o3-pro推理模型：专为复杂科学、编程、商业查询设计，支持长时间思考',
      'o4-mini高效推理：AIME 2024/2025最佳性能，支持更高使用限制',
      'Python数据分析：o1和o3-mini支持回归分析、可视化、场景模拟',
      'Advanced Voice升级：显著提升语调自然度、节奏感和情感表达',
      'Library图像管理：自动保存ChatGPT生成的所有图像，统一浏览和重用',
      'Projects功能增强：Plus、Pro、Team用户获得更专注的工作体验',
      'Scheduled Tasks：支持自动化提示和定期任务执行'
    ],
    importance: 'high',
    publishedAt: '2025-07-08T10:00:00Z',
    originalUrl: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
    tags: ['gpt-4o', 'o3-pro', 'o4-mini', 'advanced-voice', 'library', 'projects', 'reasoning']
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
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/alibaba-icon.png',
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
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png',
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
  },
  {
    id: '9',
    product: {
      name: 'Claude Code',
      logo: 'https://www.anthropic.com/favicon.ico',
      category: 'AI Code Assistant',
      slug: 'claude-code'
    },
    title: 'Claude Code正式发布 - 终端原生AI编程助手',
    summary: 'Anthropic推出Claude Code，基于Claude 4模型的终端原生编程助手。支持VS Code和JetBrains全系列IDE深度集成，提供自主代码库管理、GitHub Actions后台任务、内联编辑建议等功能。JetBrains数据显示Claude Code在文档生成方面提升19%，重构成功率提升59%，成为开发者首选的AI编程工具。',
    keyPoints: [
      'Claude 4模型驱动：业界领先的代码生成和推理能力',
      'VS Code & JetBrains集成：内联编辑建议和无缝配对编程',
      '终端原生设计：可在任何IDE或服务器环境中使用',
      'GitHub Actions支持：后台任务自动化和CI/CD集成',
      '自主代码库管理：理解整个项目结构和依赖关系',
      '性能数据验证：文档生成提升19%，重构成功率提升59%',
      'Claude Max订阅：$50-200月费，适合个人和团队使用',
      '快速启动：Cmd+Esc(Mac)或Ctrl+Esc(Windows/Linux)快速调用'
    ],
    importance: 'high',
    publishedAt: '2025-06-15T14:00:00Z',
    originalUrl: 'https://docs.anthropic.com/en/docs/claude-code/ide-integrations',
    tags: ['claude-code', 'ide-integration', 'vs-code', 'jetbrains', 'github-actions', 'terminal']
  },
  {
    id: '10',
    product: {
      name: 'Midjourney',
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/midjourney-icon.png',
      category: 'AI Image Generation',
      slug: 'midjourney'
    },
    title: 'Midjourney V7革命性升级 - 默认个性化与Draft Mode',
    summary: 'Midjourney发布V7版本，采用全新架构提供前所未有的图像生成精度和质量。首次默认启用个性化功能，新增Draft Mode实现10倍生成速度和一半成本。文本提示处理更智能，图像质量显著提升，在身体、手部和物体细节方面实现更高一致性。',
    keyPoints: [
      'V7全新架构：CEO David Holz称为"完全不同的架构"',
      '默认个性化：首个默认启用个性化的模型版本',
      'Draft Mode：生成速度提升10倍，成本降低50%',
      '图像质量飞跃：更丰富纹理和更高细节一致性',
      '智能文本处理：文本提示理解和响应能力大幅提升',
      '身体细节优化：手部、身体和物体渲染精度显著改善',
      '强制评分系统：需评估200张图像创建个性化配置',
      '2025年6月17日：V7成为默认模型'
    ],
    importance: 'high',
    publishedAt: '2025-04-03T14:00:00Z',
    originalUrl: 'https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version',
    tags: ['v7', 'personalization', 'draft-mode', 'architecture', 'image-quality', 'text-prompts']
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
      
      {/* 极简导航栏 */}
      <nav className="relative z-40 p-6">
        <div className="flex items-center justify-start">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300 tracking-wider">CONTENT COMPASS</span>
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