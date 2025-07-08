// src/app/api/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { Database, APIResponse } from '@/types/database';

// 系统状态检查
interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceStatus;
    ai: ServiceStatus;
    scraper: ServiceStatus;
    auth: ServiceStatus;
  };
  metrics: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    requests: {
      total: number;
      success: number;
      errors: number;
      rate: number;
    };
  };
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  error?: string;
  lastCheck: string;
  metadata?: any;
}

// 缓存状态检查结果（避免频繁检查）
let cachedStatus: SystemStatus | null = null;
let lastCheckTime = 0;
const CACHE_DURATION = 30000; // 30秒缓存

async function checkDatabaseStatus(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    const supabase = createRouteHandlerClient();
    
    // 检查数据库连接
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact' })
      .limit(1);
    
    const latency = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'down',
        latency,
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
    
    // 检查响应时间
    const status = latency > 2000 ? 'degraded' : 'healthy';
    
    return {
      status,
      latency,
      lastCheck: new Date().toISOString(),
      metadata: {
        responseTime: latency,
        connectionPool: 'active'
      }
    };
    
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Database connection failed',
      lastCheck: new Date().toISOString()
    };
  }
}

async function checkAIStatus(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // 检查OpenAI API密钥是否存在
    if (!process.env.OPENAI_API_KEY) {
      return {
        status: 'down',
        latency: 0,
        error: 'OpenAI API key not configured',
        lastCheck: new Date().toISOString()
      };
    }
    
    // 简单的AI服务可用性检查
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    });
    
    const latency = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        status: 'degraded',
        latency,
        error: `OpenAI API returned ${response.status}`,
        lastCheck: new Date().toISOString()
      };
    }
    
    const status = latency > 3000 ? 'degraded' : 'healthy';
    
    return {
      status,
      latency,
      lastCheck: new Date().toISOString(),
      metadata: {
        apiVersion: 'v1',
        responseTime: latency
      }
    };
    
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'AI service check failed',
      lastCheck: new Date().toISOString()
    };
  }
}

async function checkScraperStatus(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // 测试一个简单的HTTP请求
    const response = await fetch('https://httpbin.org/json', {
      method: 'GET',
      headers: {
        'User-Agent': 'ContentCompass-StatusCheck/1.0'
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    });
    
    const latency = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        status: 'degraded',
        latency,
        error: `HTTP request failed with status ${response.status}`,
        lastCheck: new Date().toISOString()
      };
    }
    
    const status = latency > 5000 ? 'degraded' : 'healthy';
    
    return {
      status,
      latency,
      lastCheck: new Date().toISOString(),
      metadata: {
        userAgent: 'ContentCompass-StatusCheck/1.0',
        responseTime: latency
      }
    };
    
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Scraper service check failed',
      lastCheck: new Date().toISOString()
    };
  }
}

async function checkAuthStatus(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // 检查Supabase认证服务
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        status: 'down',
        latency: 0,
        error: 'Supabase configuration missing',
        lastCheck: new Date().toISOString()
      };
    }
    
    const supabase = createRouteHandlerClient();
    
    // 尝试获取用户会话（不会失败，只是检查服务可用性）
    const { data, error } = await supabase.auth.getSession();
    
    const latency = Date.now() - startTime;
    
    // 即使没有会话，只要没有错误就说明服务正常
    if (error) {
      return {
        status: 'degraded',
        latency,
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
    
    const status = latency > 2000 ? 'degraded' : 'healthy';
    
    return {
      status,
      latency,
      lastCheck: new Date().toISOString(),
      metadata: {
        hasSession: !!data.session,
        responseTime: latency
      }
    };
    
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Auth service check failed',
      lastCheck: new Date().toISOString()
    };
  }
}

async function getSystemStatus(): Promise<SystemStatus> {
  const currentTime = Date.now();
  
  // 如果缓存还有效，返回缓存结果
  if (cachedStatus && (currentTime - lastCheckTime) < CACHE_DURATION) {
    return cachedStatus;
  }
  
  // 并行检查所有服务
  const [database, ai, scraper, auth] = await Promise.all([
    checkDatabaseStatus(),
    checkAIStatus(),
    checkScraperStatus(),
    checkAuthStatus()
  ]);
  
  // 获取系统指标
  const memory = process.memoryUsage();
  const memoryUsed = memory.heapUsed;
  const memoryTotal = memory.heapTotal;
  
  // 确定整体状态
  const services = { database, ai, scraper, auth };
  const serviceStatuses = Object.values(services).map(s => s.status);
  
  let overall: 'healthy' | 'degraded' | 'down';
  if (serviceStatuses.includes('down')) {
    overall = 'down';
  } else if (serviceStatuses.includes('degraded')) {
    overall = 'degraded';
  } else {
    overall = 'healthy';
  }
  
  const status: SystemStatus = {
    overall,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services,
    metrics: {
      memory: {
        used: memoryUsed,
        total: memoryTotal,
        percentage: Math.round((memoryUsed / memoryTotal) * 100)
      },
      requests: {
        total: 0, // 这里可以从监控系统获取
        success: 0,
        errors: 0,
        rate: 0
      }
    }
  };
  
  // 缓存结果
  cachedStatus = status;
  lastCheckTime = currentTime;
  
  return status;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const service = searchParams.get('service');
    
    const status = await getSystemStatus();
    
    // 如果请求特定服务的状态
    if (service && service in status.services) {
      const serviceStatus = status.services[service as keyof typeof status.services];
      return NextResponse.json({
        success: true,
        data: {
          service,
          ...serviceStatus
        }
      } as APIResponse);
    }
    
    // 如果请求简单格式
    if (format === 'simple') {
      return NextResponse.json({
        status: status.overall,
        timestamp: status.timestamp,
        uptime: status.uptime
      });
    }
    
    // 返回完整状态
    return NextResponse.json({
      success: true,
      data: status
    } as APIResponse);
    
  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取系统状态失败',
        timestamp: new Date().toISOString()
      } as APIResponse,
      { status: 500 }
    );
  }
}

// 清除状态缓存
export async function DELETE(request: NextRequest) {
  try {
    cachedStatus = null;
    lastCheckTime = 0;
    
    return NextResponse.json({
      success: true,
      message: '状态缓存已清除'
    } as APIResponse);
    
  } catch (error) {
    console.error('Status cache clear error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '清除状态缓存失败' 
      } as APIResponse,
      { status: 500 }
    );
  }
}