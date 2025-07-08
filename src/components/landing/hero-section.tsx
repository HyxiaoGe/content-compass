'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

interface HeroSectionProps {
  isAuthenticated: boolean
}

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 产品标签 */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 backdrop-blur-sm mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI 驱动的智能解析平台</span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              重新定义
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              内容理解方式
            </span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            使用先进的 AI 技术，将任意网页内容转化为
            <span className="text-blue-600 font-semibold"> 结构化摘要 </span>
            和
            <span className="text-purple-600 font-semibold"> 关键洞察</span>
            ，让信息获取变得更加高效和智能。
          </motion.p>

          {/* CTA 按钮 */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    进入仪表板
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2 hover:bg-gray-50 transition-all duration-300">
                  <Link href="/parse">开始解析</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/auth/register" className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    免费开始体验
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2 hover:bg-gray-50 transition-all duration-300">
                  <Link href="#features">了解更多</Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* 统计数据 */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">10,000+</div>
              <div className="text-gray-600">内容已解析</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">1,000+</div>
              <div className="text-gray-600">活跃用户</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">99.9%</div>
              <div className="text-gray-600">准确率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-gray-600">在线服务</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}