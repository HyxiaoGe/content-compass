'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContentCard } from '@/types/database-refactor'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ExternalLink, Clock, TrendingUp, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface TimelineCardProps {
  content: ContentCard
  index: number
}

export function TimelineCard({ content, index }: TimelineCardProps) {
  const isEven = index % 2 === 0
  const isLeft = !isEven // 奇数卡片在左侧，偶数卡片在右侧
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  const [isHovered, setIsHovered] = useState(false)
  
  // 鼠标位置跟踪
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // 3D倾斜效果
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [isLeft ? -5 : 5, isLeft ? 5 : -5])
  
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
  
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return (
          <Badge variant="destructive" className="text-xs bg-gradient-to-r from-red-500 to-pink-500 border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            高重要
          </Badge>
        )
      case 'medium':
        return <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 border-0">中重要</Badge>
      case 'low':
        return <Badge variant="secondary" className="text-xs">低重要</Badge>
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

  return (
    <motion.div
      ref={cardRef}
      initial={{ 
        opacity: 0, 
        x: isLeft ? -200 : 200,
        y: 50,
        scale: 0.8
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0,
        y: 0,
        scale: 1
      } : {}}
      transition={{ 
        duration: 1,
        type: "spring",
        stiffness: 60,
        damping: 20
      }}
      className={`timeline-card w-full flex ${isLeft ? 'justify-start' : 'justify-end'} mb-16`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className={`
          relative
          w-[85%] 
          ${isLeft ? 'ml-0 mr-auto' : 'ml-auto mr-0'}
          ${isLeft ? 'pr-[15%]' : 'pl-[15%]'}
        `}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
          transformStyle: "preserve-3d"
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`
            relative
            bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm
            shadow-2xl 
            transition-all 
            duration-500
            border border-white/20
            overflow-hidden
            group
            ${isLeft ? 'transform -skew-x-2' : 'transform skew-x-2'}
            hover:skew-x-0
            before:absolute before:inset-0 
            before:bg-gradient-to-br before:from-blue-600/10 before:to-purple-600/10
            before:opacity-0 before:transition-opacity before:duration-500
            hover:before:opacity-100
          `}
          style={{
            boxShadow: isHovered 
              ? '0 20px 70px -15px rgba(59, 130, 246, 0.5), 0 10px 30px -15px rgba(139, 92, 246, 0.3)' 
              : '0 10px 40px -15px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* 发光边框效果 */}
          <div className={`
            absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
            bg-gradient-to-r ${isLeft ? 'from-blue-500 to-purple-500' : 'from-purple-500 to-pink-500'}
            blur-xl -z-10 scale-95
          `} />
          
        <CardContent className={`relative z-10 p-0 ${isLeft ? 'transform skew-x-2' : 'transform -skew-x-2'} group-hover:transform-none transition-transform duration-500`}>
          {/* 产品头部 */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={content.product.logo || '/placeholder-logo.png'}
                    alt={content.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{content.product.name}</h3>
                  <p className="text-sm text-gray-500">{content.product.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getImportanceBadge(content.importance)}
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatPublishedDate(content.publishedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* 内容主体 */}
          <div className="px-6 pb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
              {content.title}
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {content.summary}
            </p>

            {/* 关键点 */}
            {content.keyPoints && content.keyPoints.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                  关键亮点
                </h4>
                <ul className="space-y-2">
                  {content.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 标签 */}
            {content.tags && content.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 底部操作 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                更新于 {formatPublishedDate(content.publishedAt)}
              </div>
              <a
                href={content.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                查看原文
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
      </motion.div>
    </motion.div>
  )
}