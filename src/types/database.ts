// src/types/database.ts
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          api_usage_count: number;
          api_usage_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          api_usage_count?: number;
          api_usage_limit?: number;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          api_usage_count?: number;
          api_usage_limit?: number;
        };
      };
      parsed_content: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string | null;
          original_content: string | null;
          cleaned_content: string | null;
          summary: string | null;
          key_points: string[] | null;
          metadata: Record<string, any> | null;
          word_count: number | null;
          reading_time: number | null;
          language: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          error_message: string | null;
          tokens_used: number;
          processing_time_ms: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title?: string | null;
          original_content?: string | null;
          cleaned_content?: string | null;
          summary?: string | null;
          key_points?: string[] | null;
          metadata?: Record<string, any> | null;
          word_count?: number | null;
          reading_time?: number | null;
          language?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          tokens_used?: number;
          processing_time_ms?: number | null;
        };
        Update: {
          title?: string | null;
          original_content?: string | null;
          cleaned_content?: string | null;
          summary?: string | null;
          key_points?: string[] | null;
          metadata?: Record<string, any> | null;
          word_count?: number | null;
          reading_time?: number | null;
          language?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          tokens_used?: number;
          processing_time_ms?: number | null;
        };
      };
      monitoring_rules: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          url: string;
          schedule: 'hourly' | 'daily' | 'weekly';
          is_active: boolean;
          last_checked_at: string | null;
          last_content_hash: string | null;
          notification_settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          url: string;
          schedule?: 'hourly' | 'daily' | 'weekly';
          is_active?: boolean;
          last_checked_at?: string | null;
          last_content_hash?: string | null;
          notification_settings?: Record<string, any>;
        };
        Update: {
          name?: string;
          url?: string;
          schedule?: 'hourly' | 'daily' | 'weekly';
          is_active?: boolean;
          last_checked_at?: string | null;
          last_content_hash?: string | null;
          notification_settings?: Record<string, any>;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          action_type: 'parse' | 'monitor_check' | 'api_call';
          resource_id: string | null;
          tokens_used: number;
          processing_time_ms: number | null;
          success: boolean;
          error_message: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action_type: 'parse' | 'monitor_check' | 'api_call';
          resource_id?: string | null;
          tokens_used?: number;
          processing_time_ms?: number | null;
          success?: boolean;
          error_message?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          action_type?: 'parse' | 'monitor_check' | 'api_call';
          resource_id?: string | null;
          tokens_used?: number;
          processing_time_ms?: number | null;
          success?: boolean;
          error_message?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
    };
  };
}

// 便捷类型别名
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type ParsedContent = Database['public']['Tables']['parsed_content']['Row'];
export type MonitoringRule = Database['public']['Tables']['monitoring_rules']['Row'];
export type UsageLog = Database['public']['Tables']['usage_logs']['Row'];

// API 相关类型
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ParseURLRequest {
  url: string;
  options?: {
    summary_length?: 'brief' | 'detailed' | 'comprehensive';
    extract_images?: boolean;
    extract_links?: boolean;
    custom_prompt?: string;
  };
}

export interface ParseURLResponse extends ParsedContent {}

// 分页相关类型
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total?: number;
    hasMore: boolean;
  };
}

// 统计数据类型
export interface UserStats {
  total_content: number;
  this_month_content: number;
  total_tokens_used: number;
  this_month_tokens: number;
}

export interface DashboardStats extends UserStats {
  recent_activity: Array<{
    date: string;
    content_count: number;
    tokens_used: number;
  }>;
}