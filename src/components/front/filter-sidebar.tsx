'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ContentFilters, IMPORTANCE_LEVELS } from '@/types/database-refactor'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterSidebarProps {
  filters: ContentFilters
  onFiltersChange: (filters: ContentFilters) => void
  categories: string[]
  sources: Array<{ slug: string; name: string }>
  popularTags: string[]
  isOpen: boolean
  onToggle: () => void
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  categories,
  sources,
  popularTags,
  isOpen,
  onToggle
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    category: true,
    importance: true,
    source: true,
    tags: true,
    date: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilter = <K extends keyof ContentFilters>(
    key: K,
    value: ContentFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1 // 重置页码
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      sortBy: 'published_at',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = !!(
    filters.search ||
    filters.category ||
    filters.importance ||
    filters.source ||
    filters.tags?.length ||
    filters.dateFrom ||
    filters.dateTo
  )

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string
    section: keyof typeof expandedSections
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      {/* 移动端遮罩 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%"
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:w-full lg:bg-transparent"
      >
        <div className="h-full flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">筛选条件</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 筛选内容 */}
          <div className="flex-1 overflow-y-auto">
            <Card className="lg:shadow-sm">
              <CardHeader className="hidden lg:block">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>筛选条件</span>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      清除
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0 lg:p-6 lg:pt-0">
                {/* 搜索 */}
                <FilterSection title="搜索" section="search">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索内容..."
                      value={filters.search || ''}
                      onChange={(e) => updateFilter('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </FilterSection>

                {/* 产品分类 */}
                <FilterSection title="产品分类" section="category">
                  <Select
                    value={filters.category || 'all'}
                    onValueChange={(value) => updateFilter('category', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterSection>

                {/* 重要性 */}
                <FilterSection title="重要性" section="importance">
                  <div className="space-y-2">
                    {Object.entries(IMPORTANCE_LEVELS).map(([level, config]) => (
                      <label key={level} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="importance"
                          value={level}
                          checked={filters.importance === level}
                          onChange={(e) => updateFilter('importance', e.target.value as any)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Badge
                          variant={config.color === 'red' ? 'destructive' : 
                                  config.color === 'yellow' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {config.label}
                        </Badge>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importance"
                        value=""
                        checked={!filters.importance}
                        onChange={() => updateFilter('importance', undefined)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-600">全部</span>
                    </label>
                  </div>
                </FilterSection>

                {/* 产品来源 */}
                <FilterSection title="产品来源" section="source">
                  <Select
                    value={filters.source || 'all'}
                    onValueChange={(value) => updateFilter('source', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择产品" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部产品</SelectItem>
                      {sources.map((source) => (
                        <SelectItem key={source.slug} value={source.slug}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterSection>

                {/* 热门标签 */}
                <FilterSection title="热门标签" section="tags">
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => {
                      const isSelected = filters.tags?.includes(tag)
                      return (
                        <button
                          key={tag}
                          onClick={() => {
                            const currentTags = filters.tags || []
                            const newTags = isSelected
                              ? currentTags.filter(t => t !== tag)
                              : [...currentTags, tag]
                            updateFilter('tags', newTags.length > 0 ? newTags : undefined)
                          }}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                            isSelected
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                </FilterSection>

                {/* 日期范围 */}
                <FilterSection title="发布时间" section="date">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        开始日期
                      </label>
                      <Input
                        type="date"
                        value={filters.dateFrom || ''}
                        onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        结束日期
                      </label>
                      <Input
                        type="date"
                        value={filters.dateTo || ''}
                        onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
                      />
                    </div>
                  </div>
                </FilterSection>
              </CardContent>
            </Card>
          </div>

          {/* 移动端底部操作 */}
          <div className="p-4 border-t lg:hidden">
            <div className="flex space-x-3">
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                清除筛选
              </Button>
              <Button onClick={onToggle} className="flex-1">
                应用筛选
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}