'use client'

import { motion } from 'framer-motion'
import { Link2, Brain, Download, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    title: '输入网页URL',
    description: '复制粘贴任意网页链接，支持新闻、博客、文档、研究报告等各种类型的内容。',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    details: ['支持主流网站', '批量URL导入', '自动内容检测']
  },
  {
    icon: Brain,
    title: 'AI 智能处理',
    description: '系统自动提取核心内容，使用 GPT-4 生成结构化摘要和关键要点分析。',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    details: ['智能内容提取', 'GPT-4 摘要生成', '关键信息识别']
  },
  {
    icon: Download,
    title: '获得结果',
    description: '查看精炼的内容摘要，选择合适的格式导出，随时分享和使用处理结果。',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    details: ['多格式导出', '一键分享', '历史记录管理']
  },
]

export function WorkflowSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              简单三步
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              轻松使用
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            无需复杂设置，即刻开始您的内容解析之旅
          </p>
        </motion.div>

        {/* 步骤展示 */}
        <div className="relative">
          {/* 连接线 */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -5 }}
              >
                {/* 步骤卡片 */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* 步骤编号 */}
                  <div className="absolute -top-4 left-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${step.color} text-white flex items-center justify-center text-xl font-bold shadow-lg`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* 图标 */}
                  <div className={`inline-flex p-4 rounded-2xl ${step.bgColor} mb-6 mt-4`}>
                    <step.icon className={`w-8 h-8 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} />
                  </div>
                  
                  {/* 标题和描述 */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  
                  {/* 功能特点列表 */}
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color} mr-3`} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* 箭头 (仅在非最后一个步骤显示) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* 底部演示视频区域 */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="relative inline-block">
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl p-8 text-white shadow-2xl">
              <div className="aspect-video bg-gray-800 rounded-2xl mb-6 flex items-center justify-center min-w-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-gray-300">观看产品演示视频</p>
                  <p className="text-sm text-gray-400 mt-2">2 分钟了解全部功能</p>
                </div>
              </div>
              <p className="text-lg font-medium">
                看看其他用户如何使用 ContentCompass 提高工作效率
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}