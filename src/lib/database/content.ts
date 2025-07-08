// src/lib/database/content.ts
import { createClient } from '@/lib/supabase/client';
import type { Database, ParsedContent, APIResponse, UserStats } from '@/types/database';

export class ContentService {
  private supabase = createClient();

  async createContent(
    userId: string,
    data: Database['public']['Tables']['parsed_content']['Insert']
  ): Promise<APIResponse<ParsedContent>> {
    try {
      const { data: content, error } = await this.supabase
        .from('parsed_content')
        .insert({ ...data, user_id: userId })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: content };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async updateContent(
    id: string,
    userId: string,
    updates: Database['public']['Tables']['parsed_content']['Update']
  ): Promise<APIResponse<ParsedContent>> {
    try {
      const { data, error } = await this.supabase
        .from('parsed_content')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getUserContent(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: string;
      orderBy?: 'created_at' | 'updated_at';
      orderDirection?: 'asc' | 'desc';
    } = {}
  ): Promise<APIResponse<ParsedContent[]>> {
    try {
      const {
        limit = 10,
        offset = 0,
        status,
        orderBy = 'created_at',
        orderDirection = 'desc'
      } = options;

      let query = this.supabase
        .from('parsed_content')
        .select('*')
        .eq('user_id', userId)
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getContentById(
    id: string,
    userId: string
  ): Promise<APIResponse<ParsedContent>> {
    try {
      const { data, error } = await this.supabase
        .from('parsed_content')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async deleteContent(
    id: string,
    userId: string
  ): Promise<APIResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('parsed_content')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // 获取用户使用统计
  async getUserStats(userId: string): Promise<APIResponse<UserStats>> {
    try {
      // 获取总内容数量
      const { data: totalContent, error: totalError } = await this.supabase
        .from('parsed_content')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

      if (totalError) {
        return { success: false, error: totalError.message };
      }

      // 获取本月数据
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const { data: monthlyContent, error: monthlyError } = await this.supabase
        .from('parsed_content')
        .select('tokens_used')
        .eq('user_id', userId)
        .gte('created_at', thisMonth.toISOString());

      if (monthlyError) {
        return { success: false, error: monthlyError.message };
      }

      // 获取所有内容的token统计
      const { data: allContent, error: allError } = await this.supabase
        .from('parsed_content')
        .select('tokens_used')
        .eq('user_id', userId);

      if (allError) {
        return { success: false, error: allError.message };
      }

      const stats: UserStats = {
        total_content: totalContent?.length || 0,
        this_month_content: monthlyContent?.length || 0,
        total_tokens_used: allContent?.reduce((sum, item) => sum + (item.tokens_used || 0), 0) || 0,
        this_month_tokens: monthlyContent?.reduce((sum, item) => sum + (item.tokens_used || 0), 0) || 0,
      };

      return { success: true, data: stats };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // 搜索内容
  async searchContent(
    userId: string,
    query: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<APIResponse<ParsedContent[]>> {
    try {
      const { limit = 10, offset = 0 } = options;

      const { data, error } = await this.supabase
        .from('parsed_content')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%,url.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const contentService = new ContentService();