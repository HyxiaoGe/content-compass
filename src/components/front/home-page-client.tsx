// ContentCompass v2.0 - 主页客户端组件
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FluidBackground } from '@/components/effects/fluid-background'
import { GlassmorphismCard } from '@/components/effects/glassmorphism-card'
import { HolographicHeader } from '@/components/effects/holographic-ui'
import { CursorEffect } from '@/components/front/cursor-effect'
import { TrendingUp } from 'lucide-react'
import type { AIProduct, LatestUpdate } from '@/types/database-v2'

interface HomePageClientProps {
  products: AIProduct[]
  updates: LatestUpdate[]
}

export function HomePageClient({ products, updates }: HomePageClientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // 避免hydration mismatch
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 流体背景 */}
      <FluidBackground />
      
      {/* 鼠标效果 */}
      <CursorEffect />
      
      {/* 导航栏 */}
      <nav className="relative z-40 p-6">
        <div className="flex items-center justify-start">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300 tracking-wider">
              CONTENT COMPASS
            </span>
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
              AI产品更新流
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            实时追踪顶级AI工具的最新动态，为你的技术决策提供关键洞察
          </p>
        </motion.div>

        {/* 统计信息 */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 px-8 py-4">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{products.length}</div>
                <div className="text-sm text-gray-400">产品</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{updates.length}</div>
                <div className="text-sm text-gray-400">最新更新</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div className="text-sm text-green-400">实时同步</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 产品卡片网格 - 交替布局 */}
        <div className="max-w-7xl mx-auto px-6">
          {updates.length > 0 ? (
            <div className="space-y-16">
              {updates.map((update, index) => (
                <motion.div
                  key={update.id}
                  className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  initial={{ 
                    opacity: 0, 
                    x: index % 2 === 0 ? -100 : 100 
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1 
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="w-full max-w-2xl">
                    <GlassmorphismCard
                      content={{
                        id: update.id,
                        product: {
                          name: update.product_name,
                          logo: update.logo_url || '',
                          category: update.category,
                          slug: update.product_slug
                        },
                        title: update.title,
                        summary: update.summary,
                        keyPoints: update.key_points,
                        importance: update.importance_level,
                        publishedAt: update.published_at || new Date().toISOString(),
                        originalUrl: update.original_url,
                        tags: update.tags
                      }}
                      index={index}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // 空状态
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">
                数据正在同步中...
              </h3>
              <p className="text-gray-500">
                我们正在从各个AI平台获取最新更新信息
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* 底部装饰 */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 3 }}
      />
    </div>
  )
}