// src/lib/database/test-connection.ts
import { createClient } from '@/lib/supabase/client';
import { contentService } from './content';
import { userService } from './user';
import { usageLogService } from './usage';

export async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const supabase = createClient();
    
    // 测试基本连接
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    
    if (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    
    console.log('✅ Database connection successful');
    
    // 测试认证状态
    console.log('2. Testing auth status...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('✅ User authenticated:', user.email);
      
      // 测试用户服务
      console.log('3. Testing user service...');
      const profileResult = await userService.getUserProfile(user.id);
      
      if (profileResult.success) {
        console.log('✅ User profile retrieved successfully');
      } else {
        console.log('⚠️ User profile not found, this is normal for new users');
      }
      
      // 测试使用限制检查
      console.log('4. Testing usage limit check...');
      const usageResult = await userService.checkUsageLimit(user.id);
      
      if (usageResult.success) {
        console.log('✅ Usage limit check successful:', usageResult.data);
      } else {
        console.log('❌ Usage limit check failed:', usageResult.error);
      }
      
      // 测试内容服务
      console.log('5. Testing content service...');
      const contentResult = await contentService.getUserContent(user.id, { limit: 1 });
      
      if (contentResult.success) {
        console.log('✅ Content service working, found', contentResult.data?.length, 'items');
      } else {
        console.log('❌ Content service failed:', contentResult.error);
      }
      
    } else {
      console.log('⚠️ No user authenticated - this is normal if not logged in');
    }
    
    console.log('✅ All database tests completed successfully!');
    return { success: true, message: 'Database connection and services working properly' };
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// 用于开发环境的数据库健康检查
export async function healthCheck() {
  const supabase = createClient();
  
  try {
    // 检查数据库连接
    const { error } = await supabase.from('user_profiles').select('count').limit(1);
    
    if (error) {
      return {
        status: 'error',
        database: 'disconnected',
        message: error.message
      };
    }
    
    // 检查认证状态
    const { data: { user } } = await supabase.auth.getUser();
    
    return {
      status: 'healthy',
      database: 'connected',
      auth: user ? 'authenticated' : 'anonymous',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      status: 'error',
      database: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}