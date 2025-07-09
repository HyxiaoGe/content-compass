// ContentCompass v2.0 - 产品详情页客户端组件
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FluidBackground } from '@/components/effects/fluid-background'
import { CursorEffect } from '@/components/front/cursor-effect'
import { ArrowLeft, ExternalLink, Clock, Calendar, TrendingUp, Sparkles, Zap, Brain, Cpu, Globe } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Image from 'next/image'
import type { AIProduct, ProductUpdate } from '@/types/database-v2'

interface ProductDetailClientProps {
  product: AIProduct
  updates: ProductUpdate[]
}

export function ProductDetailClient({ product, updates }: ProductDetailClientProps) {
  const router = useRouter()
  const [timeFilter, setTimeFilter] = useState<'all' | '6months'>('6months')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 过滤最近6个月的数据
  const filteredUpdates = updates.filter(update => {
    if (timeFilter === 'all') return true
    if (!update.published_at) return false
    
    const updateDate = new Date(update.published_at)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    return updateDate >= sixMonthsAgo
  })

  // 重要性图标映射
  const getImportanceIcon = (level: string) => {
    switch (level) {
      case 'high': return <Sparkles className="w-4 h-4 text-yellow-400" />
      case 'medium': return <Zap className="w-4 h-4 text-blue-400" />
      case 'low': return <Brain className="w-4 h-4 text-gray-400" />
      default: return <Cpu className="w-4 h-4 text-purple-400" />
    }
  }

  // 重要性颜色映射
  const getImportanceColor = (level: string) => {
    switch (level) {
      case 'high': return 'from-yellow-400/20 to-orange-400/20 border-yellow-400/30'
      case 'medium': return 'from-blue-400/20 to-cyan-400/20 border-blue-400/30'
      case 'low': return 'from-gray-400/20 to-slate-400/20 border-gray-400/30'
      default: return 'from-purple-400/20 to-pink-400/20 border-purple-400/30'
    }
  }

  if (!mounted) {
    return null
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

      {/* 主要内容 */}
      <main className="relative z-10 py-6">
        <div className="max-w-6xl mx-auto px-6">
          {/* 返回按钮 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </motion.div>

          {/* 产品头部信息 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
                  {product.logo_url ? (
                    <Image
                      src={product.logo_url}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <Globe className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {product.name}
                  </span>
                </h1>
                <p className="text-gray-400 text-lg mb-3">{product.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                    {product.category}
                  </Badge>
                  {product.homepage_url && (
                    <a
                      href={product.homepage_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>官网</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 统计信息和过滤器 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">
                  共 {filteredUpdates.length} 条更新记录
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => setTimeFilter('6months')}
                variant={timeFilter === '6months' ? 'default' : 'ghost'}
                size="sm"
                className={timeFilter === '6months' ? 'bg-cyan-500 hover:bg-cyan-600' : 'text-gray-400 hover:text-white'}
              >
                近6个月
              </Button>
              <Button
                onClick={() => setTimeFilter('all')}
                variant={timeFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                className={timeFilter === 'all' ? 'bg-cyan-500 hover:bg-cyan-600' : 'text-gray-400 hover:text-white'}
              >
                全部
              </Button>
            </div>
          </motion.div>

          {/* 更新记录列表 */}
          <div className="space-y-6">
            {filteredUpdates.length > 0 ? (
              filteredUpdates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card className={`backdrop-blur-md bg-gradient-to-br ${getImportanceColor(update.importance_level)} border`}>
                    <CardContent className="p-6">
                      {/* 更新头部 */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getImportanceIcon(update.importance_level)}
                            <h3 className="text-xl font-semibold text-white">
                              {update.title}
                            </h3>
                            {update.version_number && (
                              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                                {update.version_number}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {update.published_at 
                                  ? formatDistanceToNow(new Date(update.published_at), { addSuffix: true, locale: zhCN })
                                  : '时间未知'
                                }
                              </span>
                            </div>
                            {update.original_url && (
                              <a
                                href={update.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>原文</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 摘要 */}
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {update.summary}
                      </p>

                      {/* 关键要点 */}
                      {update.key_points && update.key_points.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">关键要点：</h4>
                          <ul className="space-y-2">
                            {update.key_points.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 标签 */}
                      {update.tags && update.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {update.tags.map((tag, tagIndex) => (
                            <Badge 
                              key={tagIndex}
                              variant="secondary" 
                              className="bg-white/10 text-gray-300 border-white/20 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center py-20"
              >
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  暂无更新记录
                </h3>
                <p className="text-gray-500">
                  该产品在所选时间范围内暂无更新记录
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* 底部装饰 */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />
    </div>
  )
}