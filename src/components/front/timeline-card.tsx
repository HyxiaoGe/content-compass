'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContentCard } from '@/types/database-refactor'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ExternalLink, Clock, TrendingUp } from 'lucide-react'
import Image from 'next/image'

interface TimelineCardProps {
  content: ContentCard
  index: number
}

export function TimelineCard({ content, index }: TimelineCardProps) {
  const isEven = index % 2 === 0
  const isLeft = !isEven // 奇数卡片在左侧，偶数卡片在右侧
  
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">高重要</Badge>
      case 'medium':
        return <Badge variant="default" className="text-xs">中重要</Badge>
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
      initial={{ 
        opacity: 0, 
        x: isLeft ? -100 : 100 
      }}
      animate={{ 
        opacity: 1, 
        x: 0 
      }}
      transition={{ 
        duration: 0.8,
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'} mb-16`}
    >
      <Card className={`
        ${isLeft ? 'w-[60%]' : 'w-[60%]'} 
        bg-white 
        shadow-lg 
        hover:shadow-xl 
        transition-all 
        duration-300 
        hover:scale-105 
        border-0 
        rounded-2xl
        overflow-hidden
        group
      `}>
        <CardContent className="p-0">
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
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                查看原文
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}