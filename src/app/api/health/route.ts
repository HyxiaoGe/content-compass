// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/database/test-connection';

export async function GET() {
  try {
    const health = await healthCheck();
    
    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : 500
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}