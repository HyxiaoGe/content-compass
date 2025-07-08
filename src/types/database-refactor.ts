// 重构后的数据库类型定义 - AI信息聚合站

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'user' | 'admin'
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'user' | 'admin'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'user' | 'admin'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      monitor_sources: {
        Row: {
          id: string
          name: string
          slug: string
          url: string
          logo_url: string | null
          category: string | null
          description: string | null
          schedule: 'hourly' | 'daily' | 'weekly'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          url: string
          logo_url?: string | null
          category?: string | null
          description?: string | null
          schedule?: 'hourly' | 'daily' | 'weekly'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          url?: string
          logo_url?: string | null
          category?: string | null
          description?: string | null
          schedule?: 'hourly' | 'daily' | 'weekly'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      content_items: {
        Row: {
          id: string
          source_id: string
          title: string
          original_url: string | null
          original_content: string | null
          summary: string
          key_points: string[]
          importance: 'high' | 'medium' | 'low'
          tags: string[]
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          source_updated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_id: string
          title: string
          original_url?: string | null
          original_content?: string | null
          summary: string
          key_points: string[]
          importance?: 'high' | 'medium' | 'low'
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          source_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          title?: string
          original_url?: string | null
          original_content?: string | null
          summary?: string
          key_points?: string[]
          importance?: 'high' | 'medium' | 'low'
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          source_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      processing_logs: {
        Row: {
          id: string
          content_id: string
          action: string
          result: string | null
          tokens_used: number
          cost_cents: number
          processing_time_ms: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          content_id: string
          action: string
          result?: string | null
          tokens_used?: number
          cost_cents?: number
          processing_time_ms?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          action?: string
          result?: string | null
          tokens_used?: number
          cost_cents?: number
          processing_time_ms?: number | null
          metadata?: Json | null
          created_at?: string
        }
      }
      user_bookmarks: {
        Row: {
          id: string
          user_id: string
          content_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      admin_stats: {
        Row: {
          published_content: number | null
          draft_content: number | null
          active_sources: number | null
          total_users: number | null
          tokens_used_30d: number | null
          cost_cents_30d: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 应用层类型定义

export interface MonitorSource {
  id: string
  name: string
  slug: string
  url: string
  logo_url?: string
  category?: string
  description?: string
  schedule: 'hourly' | 'daily' | 'weekly'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContentItem {
  id: string
  source_id: string
  source?: MonitorSource // 关联的监控源信息
  title: string
  original_url?: string
  original_content?: string
  summary: string
  key_points: string[]
  importance: 'high' | 'medium' | 'low'
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  source_updated_at?: string
  created_at: string
  updated_at: string
}

export interface ProcessingLog {
  id: string
  content_id: string
  action: 'scrape' | 'summarize' | 'publish' | 'error' | 'manual'
  result?: string
  tokens_used: number
  cost_cents: number
  processing_time_ms?: number
  metadata?: Record<string, any>
  created_at: string
}

export interface UserBookmark {
  id: string
  user_id: string
  content_id: string
  content?: ContentItem // 关联的内容信息
  created_at: string
}

export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface SystemSettings {
  key: string
  value: any
  description?: string
  updated_at: string
}

export interface AdminStats {
  published_content: number
  draft_content: number
  active_sources: number
  total_users: number
  tokens_used_30d: number
  cost_cents_30d: number
}

// API响应类型
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  metadata?: {
    total?: number
    page?: number
    limit?: number
    [key: string]: any
  }
}

// 内容卡片展示类型 (前台使用)
export interface ContentCard {
  id: string
  product: {
    name: string
    logo?: string
    category?: string
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

// 筛选和搜索参数
export interface ContentFilters {
  category?: string
  importance?: 'high' | 'medium' | 'low'
  tags?: string[]
  search?: string
  source?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
  sortBy?: 'published_at' | 'importance' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

// 管理员权限检查
export const ADMIN_EMAILS = [
  'admin@contentcompass.dev',
  // 可以在环境变量中配置更多管理员邮箱
]

export function isAdmin(userEmail: string): boolean {
  return ADMIN_EMAILS.includes(userEmail)
}

// 内容重要性级别配置
export const IMPORTANCE_LEVELS = {
  high: {
    label: '高',
    color: 'red',
    priority: 3
  },
  medium: {
    label: '中',
    color: 'yellow', 
    priority: 2
  },
  low: {
    label: '低',
    color: 'gray',
    priority: 1
  }
} as const

// 处理状态配置
export const CONTENT_STATUS = {
  draft: {
    label: '草稿',
    color: 'gray'
  },
  published: {
    label: '已发布',
    color: 'green'
  },
  archived: {
    label: '已归档',
    color: 'orange'
  }
} as const