'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Zap, 
  Brain, 
  FileText, 
  Layers, 
  BarChart3, 
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: '智能内容提取',
    description: '自动识别并提取网页核心内容，过滤广告和噪音信息，保留最有价值的内容。',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
  },
  {
    icon: Brain,
    title: 'AI 驱动摘要',
    description: '使用最新的 GPT-4 模型生成高质量的内容摘要，提供多种摘要格式选择。',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50',
  },
  {
    icon: FileText,
    title: '多种输出格式',
    description: '支持 JSON、Markdown、CSV、PDF 等多种格式导出，满足不同使用场景需求。',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
  },
  {
    icon: Layers,
    title: '批量处理',
    description: '一次性处理多个 URL，支持批量导入和导出，大幅提高工作效率。',
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
  },
  {
    icon: BarChart3,
    title: '详细分析',
    description: '提供深度的内容分析报告，包括关键词提取、情感分析和阅读时长预估。',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'from-indigo-50 to-blue-50',
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '企业级安全保障，数据传输加密，隐私信息得到充分保护，符合 GDPR 规范。',
    color: 'from-teal-500 to-green-500',
    bgColor: 'from-teal-50 to-green-50',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">强大的功能特性</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              为内容创作者量身定制的
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              智能解析工具
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            集成最先进的 AI 技术，为您提供全方位的内容处理解决方案
          </p>
        </motion.div>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="relative h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-50`} />
                
                <CardContent className="relative p-8">
                  {/* 图标 */}
                  <div className="relative mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* 内容 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  {/* 悬停时显示的箭头 */}
                  <div className="flex items-center text-transparent group-hover:text-blue-600 transition-all duration-300">
                    <span className="text-sm font-medium mr-2">了解更多</span>
                    <ArrowRight className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 底部统计 */}
        <motion.div 
          className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">支持网站类型</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">8</div>
              <div className="text-blue-100">种摘要格式</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">种导出格式</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24h</div>
              <div className="text-blue-100">技术支持</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}