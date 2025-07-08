// src/app/api/monitoring/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import type { APIResponse } from '@/types/database';

// 监控数据收集
interface MonitoringData {
  system: {
    uptime: number;
    memory: NodeJS.MemoryUsage;
    cpu: number;
    timestamp: string;
  };
  api: {
    totalRequests: number;
    activeRequests: number;
    averageResponseTime: number;
    errorRate: number;
    endpoints: Record<string, {
      requests: number;
      averageTime: number;
      errors: number;
    }>;
  };
  database: {
    connections: number;
    queries: number;
    averageQueryTime: number;
    slowQueries: number;
  };
  services: {
    ai: {
      requests: number;
      averageTime: number;
      errors: number;
      tokensUsed: number;
      cost: number;
    };
    scraper: {
      requests: number;
      averageTime: number;
      errors: number;
      successRate: number;
    };
  };
}

// 内存中的监控数据存储（生产环境建议使用Redis等）
const monitoringStore = {
  requests: new Map<string, { timestamp: number; duration: number; status: number }>(),
  apiStats: {
    totalRequests: 0,
    totalErrors: 0,
    totalDuration: 0,
    endpoints: new Map<string, { requests: number; duration: number; errors: number }>()
  },
  services: {
    ai: { requests: 0, duration: 0, errors: 0, tokensUsed: 0, cost: 0 },
    scraper: { requests: 0, duration: 0, errors: 0, successful: 0 }
  }
};

// 记录API请求
function _recordApiRequest(endpoint: string, duration: number, status: number) {
  const requestId = `${endpoint}-${Date.now()}-${Math.random()}`;
  
  // 保存最近1小时的请求
  const oneHourAgo = Date.now() - 3600000;
  for (const [key, value] of monitoringStore.requests.entries()) {
    if (value.timestamp < oneHourAgo) {
      monitoringStore.requests.delete(key);
    }
  }
  
  monitoringStore.requests.set(requestId, { timestamp: Date.now(), duration, status });
  
  // 更新统计
  monitoringStore.apiStats.totalRequests++;
  monitoringStore.apiStats.totalDuration += duration;
  
  if (status >= 400) {
    monitoringStore.apiStats.totalErrors++;
  }
  
  // 更新端点统计
  const endpointStats = monitoringStore.apiStats.endpoints.get(endpoint) || 
    { requests: 0, duration: 0, errors: 0 };
  
  endpointStats.requests++;
  endpointStats.duration += duration;
  
  if (status >= 400) {
    endpointStats.errors++;
  }
  
  monitoringStore.apiStats.endpoints.set(endpoint, endpointStats);
}

// 记录服务使用
function _recordServiceUsage(service: 'ai' | 'scraper', duration: number, success: boolean, metadata: any = {}) {
  const serviceStats = monitoringStore.services[service];
  
  serviceStats.requests++;
  serviceStats.duration += duration;
  
  if (!success) {
    serviceStats.errors++;
  }
  
  if (service === 'ai') {
    (serviceStats as any).tokensUsed += metadata.tokensUsed || 0;
    (serviceStats as any).cost += metadata.cost || 0;
  } else if (service === 'scraper' && success) {
    (serviceStats as any).successful++;
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 只有认证用户可以访问监控数据
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const timeRange = parseInt(searchParams.get('timeRange') || '3600'); // 默认1小时

    // 系统监控数据
    const cpuUsage = process.cpuUsage();
    const systemData = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: cpuUsage.user + cpuUsage.system,
      timestamp: new Date().toISOString()
    };

    // API统计数据
    const currentTime = Date.now();
    const timeRangeMs = timeRange * 1000;
    const cutoffTime = currentTime - timeRangeMs;
    
    const recentRequests = Array.from(monitoringStore.requests.entries())
      .filter(([_, data]) => data.timestamp >= cutoffTime)
      .map(([_, data]) => data);

    const apiData = {
      totalRequests: recentRequests.length,
      activeRequests: 0, // 这里可以实现活跃请求追踪
      averageResponseTime: recentRequests.length > 0 ? 
        recentRequests.reduce((sum, req) => sum + req.duration, 0) / recentRequests.length : 0,
      errorRate: recentRequests.length > 0 ? 
        (recentRequests.filter(req => req.status >= 400).length / recentRequests.length) * 100 : 0,
      endpoints: Object.fromEntries(
        Array.from(monitoringStore.apiStats.endpoints.entries()).map(([endpoint, stats]) => [
          endpoint,
          {
            requests: stats.requests,
            averageTime: stats.requests > 0 ? stats.duration / stats.requests : 0,
            errors: stats.errors
          }
        ])
      )
    };

    // 数据库统计（简化版）
    const databaseData = {
      connections: 1, // Supabase连接池
      queries: 0, // 需要从Supabase获取
      averageQueryTime: 0,
      slowQueries: 0
    };

    // 服务统计
    const servicesData = {
      ai: {
        requests: monitoringStore.services.ai.requests,
        averageTime: monitoringStore.services.ai.requests > 0 ? 
          monitoringStore.services.ai.duration / monitoringStore.services.ai.requests : 0,
        errors: monitoringStore.services.ai.errors,
        tokensUsed: monitoringStore.services.ai.tokensUsed,
        cost: monitoringStore.services.ai.cost
      },
      scraper: {
        requests: monitoringStore.services.scraper.requests,
        averageTime: monitoringStore.services.scraper.requests > 0 ? 
          monitoringStore.services.scraper.duration / monitoringStore.services.scraper.requests : 0,
        errors: monitoringStore.services.scraper.errors,
        successRate: monitoringStore.services.scraper.requests > 0 ? 
          (monitoringStore.services.scraper.successful / monitoringStore.services.scraper.requests) * 100 : 0
      }
    };

    const monitoringData: MonitoringData = {
      system: systemData,
      api: apiData,
      database: databaseData,
      services: servicesData
    };

    // 根据类型返回不同的数据
    switch (type) {
      case 'system':
        return NextResponse.json({ success: true, data: systemData });
      case 'api':
        return NextResponse.json({ success: true, data: apiData });
      case 'database':
        return NextResponse.json({ success: true, data: databaseData });
      case 'services':
        return NextResponse.json({ success: true, data: servicesData });
      case 'overview':
      default:
        return NextResponse.json({ success: true, data: monitoringData });
    }

  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取监控数据失败' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

// 清理监控数据
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    switch (type) {
      case 'requests':
        monitoringStore.requests.clear();
        break;
      case 'api':
        monitoringStore.apiStats = {
          totalRequests: 0,
          totalErrors: 0,
          totalDuration: 0,
          endpoints: new Map()
        };
        break;
      case 'services':
        monitoringStore.services = {
          ai: { requests: 0, duration: 0, errors: 0, tokensUsed: 0, cost: 0 },
          scraper: { requests: 0, duration: 0, errors: 0, successful: 0 }
        };
        break;
      case 'all':
        monitoringStore.requests.clear();
        monitoringStore.apiStats = {
          totalRequests: 0,
          totalErrors: 0,
          totalDuration: 0,
          endpoints: new Map()
        };
        monitoringStore.services = {
          ai: { requests: 0, duration: 0, errors: 0, tokensUsed: 0, cost: 0 },
          scraper: { requests: 0, duration: 0, errors: 0, successful: 0 }
        };
        break;
      default:
        return NextResponse.json(
          { success: false, error: '不支持的清理类型' } as APIResponse,
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `监控数据已清理: ${type}`
    } as APIResponse);

  } catch (error) {
    console.error('Monitoring cleanup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '清理监控数据失败' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

