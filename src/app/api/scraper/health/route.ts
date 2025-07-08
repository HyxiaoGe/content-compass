// src/app/api/scraper/health/route.ts
import { NextResponse } from 'next/server';
import { scraperService } from '@/lib/scraper/scraper-service';
import { scraperTester } from '@/lib/scraper/scraper-test';

export async function GET() {
  try {
    const health = await scraperService.healthCheck();
    
    return NextResponse.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '健康检查失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST 请求用于运行测试套件
export async function POST() {
  try {
    const testResults = await scraperTester.runAllTests();
    
    return NextResponse.json({
      success: true,
      data: testResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '测试执行失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}