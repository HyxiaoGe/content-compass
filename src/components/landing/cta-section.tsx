'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Star } from 'lucide-react'

interface CTASectionProps {
  isAuthenticated: boolean
}

export function CTASection({ isAuthenticated }: CTASectionProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
      
      {/* 动态背景元素 */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            top: '10%',
            left: '10%',
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-white/5 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            bottom: '10%',
            right: '10%',
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* 用户反馈标签 */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-white/90">来自 1000+ 用户的五星好评</span>
          </motion.div>

          {/* 主标题 */}
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            准备好开始了吗？
          </motion.h2>

          <motion.p 
            className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            加入数千名内容创作者和研究者，
            <br className="hidden md:block" />
            体验智能内容解析的强大功能
          </motion.p>

          {/* CTA 按钮 */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {isAuthenticated ? (
              <Button asChild size="lg" variant="secondary" className="group bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300">
                <Link href="/parse" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  开始解析内容
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant="secondary" className="group bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Link href="/auth/register" className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    免费注册账号
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4 h-auto text-white border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                  <Link href="/auth/login">立即登录</Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* 信任指标 */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">免费</div>
              <div className="text-blue-100 text-sm">开始使用</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5分钟</div>
              <div className="text-blue-100 text-sm">快速上手</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100 text-sm">在线支持</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">无限制</div>
              <div className="text-blue-100 text-sm">内容解析</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}