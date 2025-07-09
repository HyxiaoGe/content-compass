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
  'stability-ai': [
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
      id: '5-prev',
      product: {
        name: 'Stability AI',
        logo: 'https://stability.ai/favicon.ico',
        category: 'AI Image Generation',
        slug: 'stability-ai'
      },
      title: 'Stable Diffusion 3.5 Large Turbo - 高速图像生成',
      summary: 'Stability AI推出Stable Diffusion 3.5 Large Turbo版本，专为高速图像生成而优化。相比标准版本，生成速度提升3倍，同时保持高质量输出。支持实时预览和快速迭代，大幅提升创作效率。',
      keyPoints: [
        '生成速度提升3倍：针对实时创作优化',
        '保持高质量输出：平衡速度与质量',
        '实时预览功能：边调整边查看效果',
        '快速迭代支持：加速创作流程',
        '内存优化：降低GPU显存占用',
        '批量生成优化：支持高效批处理',
        'API集成优化：更快的云端调用响应',
        '移动端适配：支持移动设备部署'
      ],
      importance: 'high',
      publishedAt: '2025-05-20T10:00:00Z',
      originalUrl: 'https://stability.ai/news',
      tags: ['turbo', 'speed-optimization', 'real-time', 'mobile', 'api']
    },
    {
      id: '5-prev2',
      product: {
        name: 'Stability AI',
        logo: 'https://stability.ai/favicon.ico',
        category: 'AI Image Generation',
        slug: 'stability-ai'
      },
      title: 'Stable Video Diffusion 1.1 - 视频生成重大更新',
      summary: 'Stable Video Diffusion 1.1带来了视频生成领域的重大突破，支持更长时间的视频生成和更高的分辨率。新增运动控制功能，允许精确控制视频中的物体运动轨迹，为视频创作者提供更强的创作自由度。',
      keyPoints: [
        '视频长度扩展：支持最长60秒视频生成',
        '分辨率提升：最高支持1920x1080高清输出',
        '运动控制：精确控制物体运动轨迹',
        '帧率优化：支持30fps流畅播放',
        '批量处理：同时生成多个视频',
        '风格迁移：支持视频风格转换',
        'API增强：更完善的开发者接口',
        '社区模型：开源社区贡献模型支持'
      ],
      importance: 'high',
      publishedAt: '2025-04-18T16:20:00Z',
      originalUrl: 'https://stability.ai/news',
      tags: ['video-generation', 'motion-control', 'high-resolution', 'community']
    },
    {
      id: '5-prev3',
      product: {
        name: 'Stability AI',
        logo: 'https://stability.ai/favicon.ico',
        category: 'AI Image Generation',
        slug: 'stability-ai'
      },
      title: 'Stable Audio 2.0 - AI音频生成革命',
      summary: 'Stability AI进军音频生成领域，推出Stable Audio 2.0。支持从文本提示生成高质量音乐、音效和语音，为音频创作者提供全新的AI工具。集成先进的音频理解技术，能够生成符合情感和氛围的音频内容。',
      keyPoints: [
        '文本转音乐：从描述生成原创音乐',
        '音效生成：创造各种环境音效',
        '语音合成：多语言语音生成',
        '情感理解：根据情感生成合适音频',
        '音频编辑：支持音频片段混合编辑',
        '商业授权：提供商业使用授权',
        '开发者API：音频生成编程接口',
        '社区分享：音频作品社区平台'
      ],
      importance: 'high',
      publishedAt: '2025-03-22T11:45:00Z',
      originalUrl: 'https://stability.ai/news',
      tags: ['audio-generation', 'music', 'voice-synthesis', 'emotion-ai']
    },
    {
      id: '5-prev4',
      product: {
        name: 'Stability AI',
        logo: 'https://stability.ai/favicon.ico',
        category: 'AI Image Generation',
        slug: 'stability-ai'
      },
      title: 'Stable Code 3B - 代码生成模型发布',
      summary: 'Stability AI推出Stable Code 3B，一个专门为代码生成优化的3B参数模型。支持多种编程语言，提供代码补全、错误修复和代码重构功能。模型经过大规模代码库训练，能够理解上下文并生成高质量代码。',
      keyPoints: [
        '3B参数模型：轻量级但功能强大',
        '多语言支持：涵盖主流编程语言',
        '代码补全：智能代码自动完成',
        '错误修复：自动检测和修复代码错误',
        '代码重构：优化代码结构建议',
        '上下文理解：深度理解代码上下文',
        '开源发布：完全开源可商用',
        '社区贡献：支持社区微调和优化'
      ],
      importance: 'medium',
      publishedAt: '2025-02-28T09:30:00Z',
      originalUrl: 'https://stability.ai/news',
      tags: ['code-generation', 'programming', 'open-source', 'developer-tools']
    },
    {
      id: '5-prev5',
      product: {
        name: 'Stability AI',
        logo: 'https://stability.ai/favicon.ico',
        category: 'AI Image Generation',
        slug: 'stability-ai'
      },
      title: 'SDXL 1.0正式发布 - 图像生成里程碑',
      summary: 'Stability AI发布SDXL 1.0正式版本，这是Stable Diffusion系列的重要里程碑。SDXL 1.0在图像质量、细节处理和提示词理解方面都有显著提升，标志着开源图像生成技术的新高度。',
      keyPoints: [
        'SDXL 1.0正式版：稳定性和质量双重提升',
        '图像质量提升：更细腻的细节处理',
        '提示词理解：更准确的文本理解',
        '风格多样性：支持更多艺术风格',
        '社区生态：丰富的第三方工具支持',
        'LoRA支持：灵活的模型微调机制',
        '商业友好：开放的商业使用许可',
        '性能优化：更快的生成速度'
      ],
      importance: 'high',
      publishedAt: '2025-01-15T13:00:00Z',
      originalUrl: 'https://stability.ai/news',
      tags: ['sdxl', 'milestone', 'open-source', 'commercial']
    }
  ],
  'qwen': [
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
      id: '6-prev',
      product: {
        name: 'Alibaba Qwen',
        logo: 'https://qianwen.aliyun.com/favicon.ico',
        category: 'AI Language Model',
        slug: 'qwen'
      },
      title: 'Qwen-TTS语音合成系统正式发布',
      summary: 'Alibaba发布Qwen-TTS文本转语音系统，经过数百万小时语音数据训练。支持3种中文方言（北京话、上海话、四川话）和7种中英双语声音，能够自动调整韵律、节奏和情感语调，为用户提供自然流畅的语音体验。',
      keyPoints: [
        '数百万小时训练数据：保证高质量语音合成',
        '3种中文方言支持：北京话、上海话、四川话',
        '7种双语声音：中英文无缝切换',
        '自动韵律调整：智能控制语音节奏',
        '情感语调识别：根据内容调整情感表达',
        '实时语音合成：快速响应文本输入',
        '开源发布：支持开发者自定义训练',
        '企业级应用：支持大规模商业部署'
      ],
      importance: 'high',
      publishedAt: '2025-06-27T08:30:00Z',
      originalUrl: 'https://qwenlm.github.io/blog/',
      tags: ['tts', 'voice-synthesis', 'multilingual', 'dialect', 'open-source']
    },
    {
      id: '6-prev2',
      product: {
        name: 'Alibaba Qwen',
        logo: 'https://qianwen.aliyun.com/favicon.ico',
        category: 'AI Language Model',
        slug: 'qwen'
      },
      title: 'Qwen VLo多模态理解生成模型',
      summary: 'Qwen VLo是Alibaba推出的统一多模态理解和生成模型，在前代QwenVL基础上实现重大突破。能够深度理解图像、视频内容并生成高质量的多模态内容，为视觉AI应用提供强大的基础能力。',
      keyPoints: [
        '统一多模态架构：理解和生成一体化',
        '视觉内容深度理解：图像、视频全面分析',
        '高质量内容生成：创造逼真的多模态内容',
        'QwenVL技术升级：在前代基础上重大改进',
        '场景适应能力：适应多种应用场景',
        '实时处理能力：快速响应多模态输入',
        '开发者友好：提供简洁的API接口',
        '商业化就绪：支持大规模生产部署'
      ],
      importance: 'high',
      publishedAt: '2025-06-26T14:15:00Z',
      originalUrl: 'https://qwenlm.github.io/blog/',
      tags: ['multimodal', 'vision', 'generation', 'qwenvl', 'unified']
    },
    {
      id: '6-prev3',
      product: {
        name: 'Alibaba Qwen',
        logo: 'https://qianwen.aliyun.com/favicon.ico',
        category: 'AI Language Model',
        slug: 'qwen'
      },
      title: 'Qwen3 Embedding文本嵌入模型',
      summary: 'Qwen3 Embedding是基于Qwen3基础模型构建的文本嵌入和重排序模型，在多个基准测试中达到SOTA性能。为搜索、推荐、问答等应用提供强大的语义理解能力，支持中英文双语处理。',
      keyPoints: [
        'Qwen3基础模型：继承强大的语言理解能力',
        'SOTA基准性能：在多个评测中创造新纪录',
        '文本嵌入优化：高质量向量表示',
        '重排序功能：提升搜索结果相关性',
        '双语支持：中英文无缝处理',
        '快速推理：优化的计算效率',
        '应用广泛：搜索、推荐、问答多场景适用',
        '开源社区：支持研究和商业应用'
      ],
      importance: 'high',
      publishedAt: '2025-06-05T11:20:00Z',
      originalUrl: 'https://qwenlm.github.io/blog/',
      tags: ['embedding', 'retrieval', 'search', 'reranking', 'bilingual']
    },
    {
      id: '6-prev4',
      product: {
        name: 'Alibaba Qwen',
        logo: 'https://qianwen.aliyun.com/favicon.ico',
        category: 'AI Language Model',
        slug: 'qwen'
      },
      title: 'Qwen3-235B-A22B旗舰模型深度解析',
      summary: 'Qwen3-235B-A22B是Alibaba推出的235B参数旗舰模型，在编程、数学和通用能力方面实现重大突破。采用先进的MoE架构，在保持强大性能的同时优化计算效率，为企业级AI应用提供顶级智能。',
      keyPoints: [
        '235B参数规模：业界顶级模型参数量',
        'MoE架构优化：高效的专家混合模型',
        '编程能力突破：代码生成和理解大幅提升',
        '数学推理增强：复杂数学问题求解能力',
        '通用能力提升：跨领域知识整合',
        '计算效率优化：降低推理成本',
        '企业级部署：支持大规模商业应用',
        '开源贡献：推动AI技术生态发展'
      ],
      importance: 'high',
      publishedAt: '2025-04-29T16:45:00Z',
      originalUrl: 'https://qwenlm.github.io/blog/',
      tags: ['qwen3', 'flagship', 'moe', 'coding', 'math', 'enterprise']
    },
    {
      id: '6-prev5',
      product: {
        name: 'Alibaba Qwen',
        logo: 'https://qianwen.aliyun.com/favicon.ico',
        category: 'AI Language Model',
        slug: 'qwen'
      },
      title: 'QVQ-Max视觉推理模型发布',
      summary: 'QVQ-Max是Alibaba推出的视觉推理模型，能够分析和推理图像、视频内容。在各个领域展现出强大的视觉理解能力，为计算机视觉应用提供新的解决方案。',
      keyPoints: [
        '视觉推理能力：深度分析图像和视频',
        '多领域应用：跨行业视觉理解',
        '推理逻辑增强：复杂视觉问题求解',
        '实时处理：快速视觉内容分析',
        '场景适应：适应多样化应用场景',
        '准确性提升：提高视觉识别准确率',
        '开发者工具：提供完整的开发套件',
        '商业化支持：企业级视觉AI解决方案'
      ],
      importance: 'high',
      publishedAt: '2025-03-28T13:30:00Z',
      originalUrl: 'https://qwenlm.github.io/blog/',
      tags: ['vision', 'reasoning', 'multimodal', 'video', 'analysis']
    }
  ],
  'gemini': [
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
      id: '7-prev',
      product: {
        name: 'Google Gemini',
        logo: 'https://www.gstatic.com/devrel-devsite/prod/v9c8f5f3b0d4e5a8f7e6b5c2d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f/ai/images/gemini/favicon.ico',
        category: 'AI Assistant',
        slug: 'gemini'
      },
      title: 'Gemini 2.5 Flash-Lite高性价比版本',
      summary: 'Google推出Gemini 2.5 Flash-Lite，作为系列中最高性价比和最快响应速度的版本。专为大规模部署和实时应用场景优化，在保持高质量输出的同时显著降低成本和延迟。',
      keyPoints: [
        '最高性价比：大幅降低AI应用成本',
        '最快响应速度：毫秒级响应优化',
        '轻量级架构：减少资源消耗',
        '批量处理优化：支持大规模并发',
        '实时应用适配：聊天机器人、客服等场景',
        '成本效益平衡：性能与价格最优配比',
        'API优化：简化开发者集成',
        '企业级扩展：支持大规模商业部署'
      ],
      importance: 'high',
      publishedAt: '2025-06-17T12:30:00Z',
      originalUrl: 'https://deepmind.google/discover/blog/',
      tags: ['flash-lite', 'cost-efficient', 'real-time', 'enterprise', 'optimization']
    },
    {
      id: '7-prev2',
      product: {
        name: 'Google Gemini',
        logo: 'https://www.gstatic.com/devrel-devsite/prod/v9c8f5f3b0d4e5a8f7e6b5c2d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f/ai/images/gemini/favicon.ico',
        category: 'AI Assistant',
        slug: 'gemini'
      },
      title: 'Gemma 3n移动端AI模型发布',
      summary: 'Google发布Gemma 3n"移动优先AI"模型，专为设备端快速多模态AI应用设计。优化了移动设备上的推理速度和能耗，为移动应用开发者提供强大的本地AI能力。',
      keyPoints: [
        '移动优先设计：专为移动设备优化',
        '快速多模态：图像、文本、语音统一处理',
        '设备端推理：无需网络连接的本地AI',
        '能耗优化：延长移动设备续航',
        '轻量级部署：适合移动应用集成',
        '隐私保护：本地处理保护用户数据',
        '开发者友好：简化移动AI开发',
        'Android生态：与Android系统深度集成'
      ],
      importance: 'high',
      publishedAt: '2025-05-25T10:15:00Z',
      originalUrl: 'https://deepmind.google/discover/blog/',
      tags: ['gemma-3n', 'mobile-ai', 'on-device', 'multimodal', 'privacy', 'android']
    },
    {
      id: '7-prev3',
      product: {
        name: 'Google Gemini',
        logo: 'https://www.gstatic.com/devrel-devsite/prod/v9c8f5f3b0d4e5a8f7e6b5c2d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f/ai/images/gemini/favicon.ico',
        category: 'AI Assistant',
        slug: 'gemini'
      },
      title: 'Veo 3视频生成模型重大升级',
      summary: 'Google发布Veo 3下一代视频生成模型，在视频质量、时长和控制精度方面实现重大突破。支持更长时间的视频生成和精确的视频编辑控制，为视频内容创作者提供前所未有的创作工具。',
      keyPoints: [
        '视频质量提升：更高分辨率和更自然的动作',
        '时长扩展：支持更长时间的视频生成',
        '精确控制：细粒度的视频编辑和修改',
        '风格多样：支持多种视频风格和效果',
        '实时预览：生成过程的实时反馈',
        '商业应用：内容创作和广告制作',
        'API集成：开发者可轻松集成',
        '创作工具：配套的视频编辑功能'
      ],
      importance: 'high',
      publishedAt: '2025-04-20T16:45:00Z',
      originalUrl: 'https://deepmind.google/discover/blog/',
      tags: ['veo-3', 'video-generation', 'content-creation', 'editing', 'commercial']
    },
    {
      id: '7-prev4',
      product: {
        name: 'Google Gemini',
        logo: 'https://www.gstatic.com/devrel-devsite/prod/v9c8f5f3b0d4e5a8f7e6b5c2d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f/ai/images/gemini/favicon.ico',
        category: 'AI Assistant',
        slug: 'gemini'
      },
      title: 'Imagen 4图像生成与编辑系统',
      summary: 'Google推出Imagen 4高质量图像生成与编辑系统，在图像质量、编辑精度和创作灵活性方面达到新高度。集成先进的图像理解和编辑技术，为设计师和创作者提供专业级的AI辅助工具。',
      keyPoints: [
        '高质量生成：超高分辨率图像创作',
        '精确编辑：局部修改和风格调整',
        '创作灵活性：多样化的艺术风格支持',
        '专业工具集：面向设计师的完整套件',
        '批量处理：高效的图像批量生成',
        '版权友好：避免版权争议的内容生成',
        'Web集成：浏览器端的图像编辑体验',
        '商业授权：支持商业使用的图像内容'
      ],
      importance: 'high',
      publishedAt: '2025-03-15T11:20:00Z',
      originalUrl: 'https://deepmind.google/discover/blog/',
      tags: ['imagen-4', 'image-generation', 'editing', 'design', 'commercial', 'copyright']
    },
    {
      id: '7-prev5',
      product: {
        name: 'Google Gemini',
        logo: 'https://www.gstatic.com/devrel-devsite/prod/v9c8f5f3b0d4e5a8f7e6b5c2d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f/ai/images/gemini/favicon.ico',
        category: 'AI Assistant',
        slug: 'gemini'
      },
      title: 'Gemini通用AI助手愿景发布',
      summary: 'Google宣布Gemini通用AI助手的长期愿景，旨在开发能够"制定计划和想象新体验"的AI系统。通过整合多模态能力和推理技术，构建真正的通用人工智能助手。',
      keyPoints: [
        '通用AI愿景：构建全能的AI助手',
        '计划制定能力：复杂任务的自动规划',
        '想象创新体验：创造性思维和解决方案',
        '多模态整合：视觉、听觉、文本统一处理',
        '推理能力增强：逻辑推理和问题解决',
        '个性化服务：适应用户个人需求',
        '持续学习：不断改进和优化',
        '生态系统构建：与Google服务深度集成'
      ],
      importance: 'high',
      publishedAt: '2025-02-28T14:30:00Z',
      originalUrl: 'https://deepmind.google/discover/blog/',
      tags: ['universal-ai', 'planning', 'imagination', 'reasoning', 'personalization', 'ecosystem']
    }
  ],
  'deepseek': [
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
      id: '8-prev',
      product: {
        name: 'DeepSeek',
        logo: 'https://www.deepseek.com/favicon.ico',
        category: 'AI Reasoning Model',
        slug: 'deepseek'
      },
      title: 'DeepSeek-R1-0528重大更新 - 智能体功能全面升级',
      summary: 'DeepSeek发布R1-0528更新版本，新增系统提示、JSON输出和函数调用支持，专为智能体AI应用场景优化。在AIME 2025测试中准确率从70%提升至87.5%，推理深度显著增强，成为智能体开发的理想选择。',
      keyPoints: [
        '系统提示支持：允许自定义AI助手行为',
        'JSON输出格式：结构化数据输出支持',
        '函数调用功能：支持外部工具和API集成',
        '智能体优化：专为AI Agent应用场景设计',
        '准确率提升：AIME 2025测试准确率达87.5%',
        '推理深度增强：平均推理token从12K增至23K',
        '幻觉率降低：更准确的信息生成和推理',
        '企业级应用：支持大规模商业智能体部署'
      ],
      importance: 'high',
      publishedAt: '2025-05-28T14:30:00Z',
      originalUrl: 'https://www.deepseek.com/',
      tags: ['r1-0528', 'agent', 'json', 'function-calling', 'accuracy', 'enterprise']
    },
    {
      id: '8-prev2',
      product: {
        name: 'DeepSeek',
        logo: 'https://www.deepseek.com/favicon.ico',
        category: 'AI Reasoning Model',
        slug: 'deepseek'
      },
      title: 'DeepSeek-R1蒸馏模型系列发布',
      summary: 'DeepSeek发布六个基于Llama和Qwen的蒸馏模型，其中R1-Distill-Qwen-32B在多个基准测试中超越OpenAI o1-mini，为密集模型创造新的SOTA纪录。轻量级版本R1-Distill-Qwen3-8B可在单GPU上运行。',
      keyPoints: [
        'R1-Distill-Qwen-32B：超越o1-mini的密集模型SOTA',
        'R1-Distill-Qwen3-8B：MIT许可的轻量级版本',
        '单GPU运行：支持消费级硬件部署',
        '六个蒸馏版本：基于Llama和Qwen的多样选择',
        'Gemini 2.5 Flash超越：8B模型性能优于Google模型',
        'MIT开源许可：无限制商业使用',
        '知识蒸馏技术：保留大模型能力的同时降低资源需求',
        '社区友好：为研究者和开发者提供易用工具'
      ],
      importance: 'high',
      publishedAt: '2025-05-20T11:15:00Z',
      originalUrl: 'https://www.deepseek.com/',
      tags: ['distilled', 'qwen', 'llama', 'single-gpu', 'mit-license', 'sota']
    },
    {
      id: '8-prev3',
      product: {
        name: 'DeepSeek',
        logo: 'https://www.deepseek.com/favicon.ico',
        category: 'AI Reasoning Model',
        slug: 'deepseek'
      },
      title: 'DeepSeek-R1-Zero强化学习突破',
      summary: 'DeepSeek发布R1-Zero模型，采用创新的大规模强化学习方法，无需监督微调直接训练。模型自然涌现出自我验证、反思和长链推理能力，为AI推理领域带来重大突破。',
      keyPoints: [
        '纯强化学习：无需监督微调的创新训练方法',
        '自我验证能力：模型可自主检查推理过程',
        '反思机制：从错误中学习和改进',
        '长链推理：支持复杂多步推理任务',
        '自然涌现：通过RL训练自发产生高级推理行为',
        '研究里程碑：为AI推理研究提供新范式',
        '开源贡献：支持学术研究和技术发展',
        '算法创新：展示强化学习在推理任务中的潜力'
      ],
      importance: 'high',
      publishedAt: '2025-04-15T16:45:00Z',
      originalUrl: 'https://www.deepseek.com/',
      tags: ['r1-zero', 'reinforcement-learning', 'self-verification', 'reflection', 'reasoning']
    },
    {
      id: '8-prev4',
      product: {
        name: 'DeepSeek',
        logo: 'https://www.deepseek.com/favicon.ico',
        category: 'AI Reasoning Model',
        slug: 'deepseek'
      },
      title: 'DeepSeek V3基础模型发布',
      summary: 'DeepSeek发布V3基础模型，采用MoE架构拥有671B参数，64K上下文窗口，在代码生成、数学推理、中文处理等任务上表现卓越。作为R1系列的基础，V3为后续推理模型提供了强大的语言理解能力。',
      keyPoints: [
        '671B参数MoE：混合专家模型架构',
        '64K上下文窗口：支持长文本处理',
        '代码生成优化：专业的编程能力',
        '数学推理增强：复杂数学问题求解',
        '中文处理专长：优秀的中文理解生成',
        '性价比优势：1元/百万输入token，2元/百万输出token',
        '多平台支持：Web、移动应用、API全覆盖',
        '开源基础：为社区提供强大的基础模型'
      ],
      importance: 'high',
      publishedAt: '2025-03-10T13:20:00Z',
      originalUrl: 'https://www.deepseek.com/',
      tags: ['v3', 'moe', 'code-generation', 'math', 'chinese', 'cost-efficient']
    },
    {
      id: '8-prev5',
      product: {
        name: 'DeepSeek',
        logo: 'https://www.deepseek.com/favicon.ico',
        category: 'AI Reasoning Model',
        slug: 'deepseek'
      },
      title: 'DeepSeek移动应用全球登顶',
      summary: 'DeepSeek AI助手移动应用在发布后数日内登顶Apple App Store，超越OpenAI ChatGPT成为全球下载量第一的AI应用。应用提供R1模型的聊天机器人界面，引发全球AI市场关注和美股相关公司震动。',
      keyPoints: [
        'App Store登顶：超越ChatGPT成为下载量第一',
        '全球用户激增：数日内获得数百万用户',
        'R1模型集成：提供强大的推理能力体验',
        '市场震动：引发美股AI公司股价波动',
        'Nvidia冲击：对AI硬件需求预期产生影响',
        '用户体验优化：简洁直观的聊天界面',
        '免费使用：基础功能完全免费',
        '全球可用：支持多语言和多地区'
      ],
      importance: 'high',
      publishedAt: '2025-02-01T09:00:00Z',
      originalUrl: 'https://www.deepseek.com/',
      tags: ['mobile-app', 'app-store', 'global', 'chatgpt', 'market-impact', 'nvidia']
    }
  ],
  'perplexity': [
    {
      id: '9',
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