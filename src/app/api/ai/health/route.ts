// src/app/api/ai/health/route.ts
import { NextResponse } from 'next/server';
import { aiServiceManager } from '@/lib/ai/ai-service-manager';
import { aiTester } from '@/lib/ai/ai-test';

export async function GET() {
  try {
    const health = await aiServiceManager.healthCheck();
    
    return NextResponse.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'AI服务健康检查失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST 请求用于运行AI服务测试套件
export async function POST() {
  try {
    const testResults = await aiTester.runAllTests();
    
    return NextResponse.json({
      success: true,
      data: testResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'AI服务测试执行失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}