// ContentCompass Database v2.0 TypeScript Types
// 与 supabase/schema-v2.sql 对应的类型定义

// =================
// 1. 核心产品类型
// =================

export interface AIProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  logo_url?: string;
  homepage_url?: string;
  changelog_url?: string;
  additional_urls?: string[];
  scraper_config?: {
    selector?: string;
    interval?: string;
    custom_rules?: Record<string, any>;
  };
  is_active: boolean;
  last_crawled_at?: string;
  crawl_status: 'pending' | 'running' | 'success' | 'error';
  crawl_error?: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// =================
// 2. 产品更新内容类型
// =================

export interface ProductUpdate {
  id: string;
  product_id: string;
  version_number?: string;
  release_date?: string;
  title: string;
  original_url?: string;
  raw_content?: string;
  content_hash?: string;
  summary: string;
  key_points: string[];
  importance_level: 'high' | 'medium' | 'low';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  ai_model_used?: string;
  tokens_consumed: number;
  processing_cost_cents: number;
  confidence_score?: number;
  reviewed_by?: string;
  review_notes?: string;
  scraped_at?: string;
  processed_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// =================
// 3. 爬取任务类型
// =================

export interface CrawlTask {
  id: string;
  product_id: string;
  task_type: 'scheduled' | 'manual' | 'retry';
  priority: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  result_message?: string;
  items_found: number;
  items_processed: number;
  execution_time_ms?: number;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

// =================
// 4. 系统管理类型（简化版）
// =================

// =================
// 5. 系统日志类型
// =================

export interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  category?: string;
  message: string;
  details?: Record<string, any>;
  product_id?: string;
  created_at: string;
}

// =================
// 6. 系统配置类型
// =================

export interface SystemSetting {
  key: string;
  value: any;
  description?: string;
  category: string;
  updated_at: string;
}

// =================
// 7. 视图类型
// =================

export interface LatestUpdate {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  category: string;
  logo_url?: string;
  title: string;
  summary: string;
  key_points: string[];
  importance_level: 'high' | 'medium' | 'low';
  tags: string[];
  published_at?: string;
  original_url?: string;
}

export interface SystemStats {
  active_products: number;
  published_updates: number;
  draft_updates: number;
  pending_tasks: number;
  failed_tasks: number;
  tokens_30d: number;
  cost_30d_cents: number;
}

// =================
// 8. API 请求/响应类型
// =================

// 产品列表API响应
export interface ProductListResponse {
  data: AIProduct[];
  total: number;
  page: number;
  per_page: number;
}

// 更新内容列表API响应
export interface UpdateListResponse {
  data: LatestUpdate[];
  total: number;
  page: number;
  per_page: number;
}

// 产品详情API响应
export interface ProductDetailResponse {
  product: AIProduct;
  updates: ProductUpdate[];
  total_updates: number;
}

// 创建更新内容的请求
export interface CreateUpdateRequest {
  product_id: string;
  title: string;
  summary: string;
  key_points: string[];
  importance_level: 'high' | 'medium' | 'low';
  tags: string[];
  original_url?: string;
  version_number?: string;
  release_date?: string;
}

// 触发爬取任务的请求
export interface TriggerCrawlRequest {
  product_id: string;
  task_type: 'manual' | 'retry';
  priority?: number;
}

// =================
// 9. 前端组件Props类型
// =================

// 产品卡片组件Props
export interface ProductCardProps {
  product: AIProduct;
  latestUpdate?: ProductUpdate;
  onClick?: (product: AIProduct) => void;
}

// 更新内容卡片组件Props
export interface UpdateCardProps {
  update: LatestUpdate;
  index: number;
  onClick?: (update: LatestUpdate) => void;
}

// 管理后台表格Props
export interface AdminTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    title: string;
    render?: (value: any, record: T) => React.ReactNode;
  }[];
  loading?: boolean;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

// =================
// 10. 工具类型
// =================

// 数据库表名枚举
export enum TableName {
  AI_PRODUCTS = 'ai_products',
  PRODUCT_UPDATES = 'product_updates', 
  CRAWL_TASKS = 'crawl_tasks',
  SYSTEM_LOGS = 'system_logs',
  SYSTEM_SETTINGS = 'system_settings'
}

// API状态类型
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// 分页参数类型
export interface PaginationParams {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// 筛选参数类型
export interface FilterParams {
  category?: string;
  importance_level?: 'high' | 'medium' | 'low';
  tags?: string[];
  date_from?: string;
  date_to?: string;
  search?: string;
}

// API错误类型
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// =================
// 11. 常量定义
// =================

export const PRODUCT_CATEGORIES = [
  'AI Code Editor',
  'AI Assistant', 
  'Code Assistant',
  'AI Platform',
  'AI Image Generation',
  'AI Language Model',
  'AI Reasoning Model',
  'AI Code Assistant'
] as const;

export const IMPORTANCE_LEVELS = [
  'high',
  'medium', 
  'low'
] as const;

export const UPDATE_STATUS = [
  'draft',
  'published',
  'archived'
] as const;

export const CRAWL_STATUS = [
  'pending',
  'running',
  'success',
  'error'
] as const;


export const LOG_LEVELS = [
  'debug',
  'info',
  'warn',
  'error'
] as const;

// =================
// 12. 默认值
// =================

export const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  per_page: 20,
  sort_by: 'created_at',
  sort_order: 'desc'
};

export const DEFAULT_PRODUCT: Partial<AIProduct> = {
  category: 'AI Assistant',
  is_active: true,
  display_order: 0,
  is_featured: false,
  crawl_status: 'pending'
};

export const DEFAULT_UPDATE: Partial<ProductUpdate> = {
  importance_level: 'medium',
  tags: [],
  status: 'draft',
  tokens_consumed: 0,
  processing_cost_cents: 0
};

// =================
// 13. Supabase Database 类型
// =================

export interface Database {
  public: {
    Tables: {
      ai_products: {
        Row: AIProduct;
        Insert: Omit<AIProduct, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AIProduct, 'id' | 'created_at' | 'updated_at'>>;
      };
      product_updates: {
        Row: ProductUpdate;
        Insert: Omit<ProductUpdate, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProductUpdate, 'id' | 'created_at' | 'updated_at'>>;
      };
      crawl_tasks: {
        Row: CrawlTask;
        Insert: Omit<CrawlTask, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CrawlTask, 'id' | 'created_at' | 'updated_at'>>;
      };
      system_logs: {
        Row: SystemLog;
        Insert: Omit<SystemLog, 'id' | 'created_at'>;
        Update: Partial<Omit<SystemLog, 'id' | 'created_at'>>;
      };
      system_settings: {
        Row: SystemSetting;
        Insert: Omit<SystemSetting, 'updated_at'>;
        Update: Partial<Omit<SystemSetting, 'updated_at'>>;
      };
    };
    Views: {
      latest_updates: {
        Row: LatestUpdate;
      };
      system_stats: {
        Row: SystemStats;
      };
    };
  };
}

// =================
// 14. 类型守卫
// =================

export function isValidImportanceLevel(level: string): level is 'high' | 'medium' | 'low' {
  return IMPORTANCE_LEVELS.includes(level as any);
}

export function isValidUpdateStatus(status: string): status is 'draft' | 'published' | 'archived' {
  return UPDATE_STATUS.includes(status as any);
}

