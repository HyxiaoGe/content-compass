// src/lib/database/user.ts
import { createClient } from '@/lib/supabase/client';
import type { Database, UserProfile, APIResponse } from '@/types/database';

export class UserService {
  private supabase = createClient();

  async getUserProfile(userId: string): Promise<APIResponse<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
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

  async updateUserProfile(
    userId: string,
    updates: Database['public']['Tables']['user_profiles']['Update']
  ): Promise<APIResponse<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
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

  async incrementUsageCount(userId: string): Promise<APIResponse<void>> {
    try {
      const { error } = await this.supabase.rpc('increment_api_usage', {
        user_id: userId
      });

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

  async checkUsageLimit(userId: string): Promise<APIResponse<{
    canProceed: boolean;
    usage: number;
    limit: number;
    remaining: number;
  }>> {
    try {
      const profileResult = await this.getUserProfile(userId);
      
      if (!profileResult.success || !profileResult.data) {
        return { success: false, error: 'Failed to get user profile' };
      }

      const profile = profileResult.data;
      const remaining = profile.api_usage_limit - profile.api_usage_count;

      return {
        success: true,
        data: {
          canProceed: profile.api_usage_count < profile.api_usage_limit,
          usage: profile.api_usage_count,
          limit: profile.api_usage_limit,
          remaining: Math.max(0, remaining)
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async createOrUpdateProfile(
    userId: string,
    email: string,
    additionalData: Partial<Database['public']['Tables']['user_profiles']['Insert']> = {}
  ): Promise<APIResponse<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          email,
          ...additionalData
        })
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
}

export const userService = new UserService();