'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContentCard } from '@/types/database-refactor'
// 或者创建一个通用的Card接口
interface CardContent {
  id: string
  product: {
    name: string
    logo: string
    category: string
    slug: string
  }
  title: string
  summary: string
  keyPoints: string[]
  importance: 'high' | 'medium' | 'low'
  publishedAt: string
  originalUrl?: string
  tags: string[]
}
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ExternalLink, Clock, Sparkles, Eye } from 'lucide-react'
import Image from 'next/image'

interface GlassmorphismCardProps {
  content: ContentCard | CardContent
  index: number
}

export function GlassmorphismCard({ content, index }: GlassmorphismCardProps) {
  const router = useRouter()
  const isEven = index % 2 === 0
  const isLeft = !isEven
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-150px" })
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 平滑跟随效果（非倾斜）
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // 改为平移效果而非倾斜
  const translateX = useTransform(mouseX, [-0.5, 0.5], [-5, 5])
  const translateY = useTransform(mouseY, [-0.5, 0.5], [-5, 5])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }
  
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const handleCardClick = () => {
    router.push(`/product/${content.product.slug}`)
  }
  

  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return mounted ? formatDistanceToNow(date, { addSuffix: true, locale: zhCN }) : '加载中...'
    } catch {
      return '时间未知'
    }
  }

  // 数据可视化组件
  const DataVisualization = () => {
    return (
      <div className="absolute top-0 right-0 w-24 h-24 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* 数据脉冲 */}
          <circle 
            cx="50" 
            cy="50" 
            r="20"
            fill="none"
            stroke="url(#pulse-gradient)"
            strokeWidth="2"
            className="animate-ping"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="30"
            fill="none"
            stroke="url(#pulse-gradient)"
            strokeWidth="1"
            className="animate-ping"
            style={{ animationDelay: '0.5s' }}
          />
          
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="100%" stopColor="#ff00ff" />
            </linearGradient>
          </defs>
          
          {/* 数据点 */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2
            const x = 50 + Math.cos(angle) * 15
            const y = 50 + Math.sin(angle) * 15
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill="#00ffff"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            )
          })}
        </svg>
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ 
        opacity: 0, 
        x: isLeft ? -300 : 300,
        y: 100,
        scale: 0.5,
        rotateY: isLeft ? -45 : 45
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0,
        y: 0,
        scale: 1,
        rotateY: 0
      } : {}}
      transition={{ 
        duration: 1.2,
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay: index * 0.3
      }}
      className={`timeline-card w-full max-w-none mb-12`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="relative w-full"
        style={{
          x: isHovered ? translateX : 0,
          y: isHovered ? translateY : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        {/* 悬浮动画容器 */}
        <motion.div
          className="relative group"
          animate={{
            y: isHovered ? -5 : 0,
            scale: isHovered ? 1.01 : 1,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            duration: 0.4 
          }}
        >
          {/* 悬浮阴影 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl"
            animate={{
              opacity: isHovered ? 0.8 : 0,
              scale: isHovered ? 1.1 : 0.8,
              y: isHovered ? 20 : 0,
            }}
            transition={{ duration: 0.4 }}
            style={{ zIndex: -1 }}
          />
          
          {/* 主卡片 */}
          <Card 
            className={`
              relative overflow-hidden cursor-pointer
              bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90
              backdrop-blur-2xl
              border border-white/10
              shadow-2xl
              transition-all duration-700
              ${isHovered ? 'border-cyan-500/30 shadow-cyan-500/20' : 'shadow-black/50'}
            `}
            onClick={handleCardClick}
          >
          {/* 毛玻璃反射效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* 扫描线动画 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* 数据可视化背景 */}
          <DataVisualization />
          
          <CardContent className="relative z-10 p-8">
            {/* 产品头部 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 p-2">
                      <Image
                        src={content.product.logo || '/placeholder-logo.png'}
                        alt={content.product.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* 脉冲指示器 */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{content.product.name}</h3>
                    <p className="text-gray-300 text-sm">{content.product.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-xs text-gray-400 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatPublishedDate(content.publishedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* 内容主体 */}
            <div className="space-y-6">
              <motion.h2 
                className="text-2xl font-bold text-white leading-tight"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.3 + 0.5 }}
              >
                {content.title}
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.3 + 0.7 }}
              >
                {content.summary}
              </motion.p>

              {/* 关键点 */}
              {content.keyPoints && content.keyPoints.length > 0 && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.3 + 0.9 }}
                >
                  <h4 className="font-semibold text-white flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                    关键亮点
                  </h4>
                  <div className="space-y-2">
                    {content.keyPoints.map((point, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.3 + 1 + i * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{point}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 标签 */}
              {content.tags && content.tags.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.3 + 1.2 }}
                >
                  {content.tags.map((tag, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="text-xs bg-white/5 border-white/20 text-gray-300 backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </motion.div>
              )}

              {/* 底部操作 */}
              <motion.div 
                className="flex items-center justify-between pt-6 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.3 + 1.4 }}
              >
                <div className="text-sm text-gray-400">
                  更新于 {formatPublishedDate(content.publishedAt)}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium rounded-xl backdrop-blur-sm transition-all duration-300 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400/50 hover:text-white hover:scale-105">
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </div>
                  <a
                    href={content.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium rounded-xl backdrop-blur-sm transition-all duration-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/50 hover:text-white hover:scale-105"
                    onClick={(e) => e.stopPropagation()}
                  >
                    查看原文
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}