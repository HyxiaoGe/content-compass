// src/lib/database/usage.ts
import { createClient } from '@/lib/supabase/client';
import type { Database, UsageLog, APIResponse } from '@/types/database';

export class UsageLogService {
  private supabase = createClient();

  async logUsage(
    data: Database['public']['Tables']['usage_logs']['Insert']
  ): Promise<APIResponse<UsageLog>> {
    try {
      const { data: log, error } = await this.supabase
        .from('usage_logs')
        .insert(data)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: log };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getUserUsageLogs(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      actionType?: 'parse' | 'monitor_check' | 'api_call';
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<APIResponse<UsageLog[]>> {
    try {
      const {
        limit = 50,
        offset = 0,
        actionType,
        startDate,
        endDate
      } = options;

      let query = this.supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (actionType) {
        query = query.eq('action_type', actionType);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
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

  async getUserUsageStats(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<APIResponse<{
    totalRequests: number;
    totalTokens: number;
    successRate: number;
    avgProcessingTime: number;
    requestsByType: Record<string, number>;
  }>> {
    try {
      let query = this.supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      const logs = data || [];
      const totalRequests = logs.length;
      const totalTokens = logs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const successfulRequests = logs.filter(log => log.success).length;
      const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
      
      const processingTimes = logs
        .filter(log => log.processing_time_ms !== null)
        .map(log => log.processing_time_ms!);
      const avgProcessingTime = processingTimes.length > 0 
        ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length 
        : 0;

      const requestsByType = logs.reduce((acc, log) => {
        acc[log.action_type] = (acc[log.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        data: {
          totalRequests,
          totalTokens,
          successRate,
          avgProcessingTime,
          requestsByType
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // 记录解析操作
  async logParseOperation(
    userId: string,
    resourceId: string,
    tokensUsed: number,
    processingTime: number,
    success: boolean,
    errorMessage?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<APIResponse<UsageLog>> {
    return this.logUsage({
      user_id: userId,
      action_type: 'parse',
      resource_id: resourceId,
      tokens_used: tokensUsed,
      processing_time_ms: processingTime,
      success,
      error_message: errorMessage || null,
      ip_address: ipAddress || null,
      user_agent: userAgent || null
    });
  }

  // 记录 API 调用
  async logApiCall(
    userId: string,
    success: boolean,
    processingTime?: number,
    errorMessage?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<APIResponse<UsageLog>> {
    return this.logUsage({
      user_id: userId,
      action_type: 'api_call',
      processing_time_ms: processingTime || null,
      success,
      error_message: errorMessage || null,
      ip_address: ipAddress || null,
      user_agent: userAgent || null
    });
  }
}

export const usageLogService = new UsageLogService();