'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ContentCard, IMPORTANCE_LEVELS } from '@/types/database-refactor'
import { Clock, ExternalLink, Star, Bookmark } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ContentItemCardProps {
  content: ContentCard
  showBookmark?: boolean
  onBookmark?: (contentId: string) => void
}

export function ContentItemCard({ 
  content, 
  showBookmark = false, 
  onBookmark 
}: ContentItemCardProps) {
  const importanceConfig = IMPORTANCE_LEVELS[content.importance]
  
  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(content.id)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
        {/* 头部 - 产品信息 */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* 产品Logo */}
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {content.product.logo ? (
                  <Image
                    src={content.product.logo}
                    alt={content.product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // 如果图片加载失败，显示首字母
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                    {content.product.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* 产品信息 */}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {content.product.name}
                </h3>
                {content.product.category && (
                  <p className="text-sm text-gray-500 truncate">
                    {content.product.category}
                  </p>
                )}
              </div>
            </div>
            
            {/* 重要性标识 */}
            <div className="flex items-center space-x-2">
              {content.importance === 'high' && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              )}
              <Badge
                variant={importanceConfig.color === 'red' ? 'destructive' : 
                        importanceConfig.color === 'yellow' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {importanceConfig.label}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* 内容区域 */}
        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* 标题 */}
          <h4 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight">
            {content.title}
          </h4>
          
          {/* AI摘要 */}
          <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed flex-1">
            {content.summary}
          </p>
          
          {/* 关键要点 */}
          {content.keyPoints.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">关键要点:</h5>
              <ul className="space-y-1">
                {content.keyPoints.slice(0, 3).map((point, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="line-clamp-1">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* 标签 */}
          {content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {content.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {content.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{content.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* 底部操作区 */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              {/* 时间信息 */}
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(content.publishedAt), {
                    addSuffix: true,
                    locale: zhCN
                  })}
                </span>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center space-x-2">
                {showBookmark && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className="p-1 h-auto"
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                )}
                
                {content.originalUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="p-1 h-auto"
                  >
                    <Link href={content.originalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}