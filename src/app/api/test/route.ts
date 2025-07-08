// src/app/api/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import type { Database, APIResponse } from '@/types/database';

// 测试端点配置
const testEndpoints = {
  // 系统健康检查
  health: async () => {
    const checks = {
      server: { status: 'healthy', timestamp: new Date().toISOString() },
      database: { status: 'unknown' as string, error: null as string | null, latency: 0 },
      ai: { status: 'unknown' as string, error: null as string | null, latency: 0 },
      scraper: { status: 'unknown' as string, error: null as string | null, latency: 0 }
    };

    // 测试数据库连接
    try {
      const startTime = Date.now();
      const supabase = await createRouteHandlerClient();
      const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact' }).limit(1);
      const latency = Date.now() - startTime;
      
      checks.database = {
        status: error ? 'error' : 'healthy',
        error: error?.message || null as string | null,
        latency
      };
    } catch (error) {
      checks.database = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Database connection failed',
        latency: 0
      };
    }

    // 测试AI服务
    try {
      const startTime = Date.now();
      const { aiServiceManager } = await import('@/lib/ai');
      
      // 简单的AI服务测试
      const testResult = await aiServiceManager.generateSummary('This is a test content for health check.', {
        summaryType: 'brief',
        language: 'en',
        maxTokens: 50,
        includeKeyPoints: false,
        includeAnalysis: false
      });
      
      const latency = Date.now() - startTime;
      checks.ai = {
        status: testResult.success ? 'healthy' : 'error',
        error: testResult.success ? null : (testResult.error || 'Unknown error'),
        latency
      };
    } catch (error) {
      checks.ai = {
        status: 'error',
        error: error instanceof Error ? error.message : 'AI service failed',
        latency: 0
      };
    }

    // 测试爬虫服务
    try {
      const startTime = Date.now();
      const { scraperService } = await import('@/lib/scraper');
      
      // 简单的爬虫服务测试（测试一个轻量级页面）
      const testResult = await scraperService.scrapeURL('https://httpbin.org/json', {
        timeout: 10000,
        extractImages: false,
        extractLinks: false
      });
      
      const latency = Date.now() - startTime;
      checks.scraper = {
        status: testResult.success ? 'healthy' : 'error',
        error: testResult.success ? null : (testResult.error || 'Unknown error'),
        latency
      };
    } catch (error) {
      checks.scraper = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Scraper service failed',
        latency: 0
      };
    }

    const overallStatus = Object.values(checks).every(check => check.status === 'healthy') ? 'healthy' : 'degraded';
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: checks,
      uptime: process.uptime()
    };
  },

  // 测试用户认证
  auth: async (request: NextRequest) => {
    const supabase = await createRouteHandlerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    return {
      authenticated: !error && !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null,
      error: error?.message || null
    };
  },

  // 测试数据库连接
  database: async () => {
    const supabase = await createRouteHandlerClient();
    const tests = {};
    
    // 测试各个表的连接
    const tables = ['user_profiles', 'parsed_content', 'monitoring_rules', 'usage_logs'];
    
    for (const table of tables) {
      try {
        const startTime = Date.now();
        const { data, error } = await supabase.from(table as any).select('count', { count: 'exact' }).limit(1);
        const latency = Date.now() - startTime;
        
        (tests as any)[table] = {
          status: error ? 'error' : 'healthy',
          error: error?.message || null as string | null,
          latency,
          count: data?.length || 0
        };
      } catch (error) {
        (tests as any)[table] = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          latency: 0,
          count: 0
        };
      }
    }
    
    return tests;
  },

  // 测试API端点
  endpoints: async (request: NextRequest) => {
    const baseUrl = new URL(request.url).origin;
    const endpoints = [
      { name: 'docs', path: '/api/docs', method: 'GET' },
      { name: 'health', path: '/api/test?type=health', method: 'GET' },
      { name: 'auth', path: '/api/test?type=auth', method: 'GET' }
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ContentCompass-Test/1.0'
          }
        });
        const latency = Date.now() - startTime;
        
        (results as any)[endpoint.name] = {
          status: response.ok ? 'healthy' : 'error',
          statusCode: response.status,
          latency,
          error: response.ok ? null : `HTTP ${response.status}`
        };
      } catch (error) {
        (results as any)[endpoint.name] = {
          status: 'error',
          statusCode: 0,
          latency: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    return results;
  },

  // 性能测试
  performance: async () => {
    const metrics = {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      nodejs: process.version,
      platform: process.platform,
      arch: process.arch
    };
    
    return metrics;
  },

  // 环境变量检查
  environment: async () => {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'OPENAI_API_KEY'
    ];
    
    const envStatus = {};
    
    for (const envVar of requiredEnvVars) {
      const value = process.env[envVar];
      (envStatus as any)[envVar] = {
        exists: !!value,
        length: value ? value.length : 0,
        preview: value ? `${value.substring(0, 8)}...` : null
      };
    }
    
    return {
      nodeEnv: process.env.NODE_ENV,
      variables: envStatus,
      timestamp: new Date().toISOString()
    };
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'health';
    const detailed = searchParams.get('detailed') === 'true';
    
    // 检查测试类型是否存在
    if (!(testType in testEndpoints)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `不支持的测试类型: ${testType}`,
          availableTypes: Object.keys(testEndpoints)
        } as APIResponse,
        { status: 400 }
      );
    }
    
    // 执行测试
    const testFunction = testEndpoints[testType as keyof typeof testEndpoints];
    const startTime = Date.now();
    const result = await testFunction(request);
    const executionTime = Date.now() - startTime;
    
    // 如果是详细模式，运行所有测试
    if (detailed && testType === 'health') {
      const allTests = {};
      
      for (const [name, testFn] of Object.entries(testEndpoints)) {
        if (name !== 'health') {
          try {
            const testStartTime = Date.now();
            const testResult = await testFn(request);
            const testExecutionTime = Date.now() - testStartTime;
            
            (allTests as any)[name] = {
              result: testResult,
              executionTime: testExecutionTime,
              status: 'completed'
            };
          } catch (error) {
            (allTests as any)[name] = {
              result: null,
              executionTime: 0,
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        data: {
          primary: result,
          detailed: allTests,
          metadata: {
            testType,
            executionTime,
            timestamp: new Date().toISOString()
          }
        }
      } as APIResponse);
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        testType,
        executionTime,
        timestamp: new Date().toISOString()
      }
    } as APIResponse);
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '测试执行失败',
        timestamp: new Date().toISOString()
      } as APIResponse,
      { status: 500 }
    );
  }
}

// POST 请求用于执行压力测试
export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { testType, config = {} } = body;

    if (testType === 'load') {
      // 负载测试
      const { concurrent = 5, iterations = 10, endpoint = '/api/docs' } = config;
      const baseUrl = new URL(request.url).origin;
      
      const results = [];
      const startTime = Date.now();
      
      // 并发测试
      const promises = Array.from({ length: concurrent }, async (_, i) => {
        const iterationResults = [];
        
        for (let j = 0; j < iterations; j++) {
          const iterationStart = Date.now();
          try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            });
            
            iterationResults.push({
              iteration: j + 1,
              status: response.status,
              latency: Date.now() - iterationStart,
              success: response.ok
            });
          } catch (error) {
            iterationResults.push({
              iteration: j + 1,
              status: 0,
              latency: Date.now() - iterationStart,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
        
        return {
          worker: i + 1,
          results: iterationResults
        };
      });
      
      const workerResults = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      // 计算统计信息
      const allResults = workerResults.flatMap(w => w.results);
      const successfulResults = allResults.filter(r => r.success);
      const failedResults = allResults.filter(r => !r.success);
      
      const stats = {
        total: allResults.length,
        successful: successfulResults.length,
        failed: failedResults.length,
        successRate: (successfulResults.length / allResults.length) * 100,
        averageLatency: successfulResults.reduce((sum, r) => sum + r.latency, 0) / successfulResults.length,
        minLatency: Math.min(...successfulResults.map(r => r.latency)),
        maxLatency: Math.max(...successfulResults.map(r => r.latency)),
        totalTime,
        requestsPerSecond: allResults.length / (totalTime / 1000)
      };
      
      return NextResponse.json({
        success: true,
        data: {
          config: { concurrent, iterations, endpoint },
          stats,
          workers: workerResults,
          timestamp: new Date().toISOString()
        }
      } as APIResponse);
    }
    
    return NextResponse.json(
      { success: false, error: '不支持的测试类型' } as APIResponse,
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Load test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '负载测试失败' 
      } as APIResponse,
      { status: 500 }
    );
  }
}