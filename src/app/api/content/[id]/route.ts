// src/app/api/content/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { contentService } from '@/lib/database/content';
import { aiServiceManager } from '@/lib/ai';
import type { Database, APIResponse, ParsedContent } from '@/types/database';
import { z } from 'zod';

// 更新内容的验证schema
const updateContentSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  key_points: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  language: z.string().optional()
});

// 重新生成摘要的验证schema
const regenerateSummarySchema = z.object({
  summaryType: z.enum(['brief', 'standard', 'detailed', 'bullet-points', 'key-insights', 'executive', 'technical', 'academic']).optional(),
  language: z.string().optional(),
  customPrompt: z.string().optional(),
  maxTokens: z.number().min(100).max(4000).optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    const result = await contentService.getContentById(id, user.id);

    if (!result.success) {
      const status = result.error?.includes('not found') ? 404 : 500;
      return NextResponse.json(
        { success: false, error: result.error } as APIResponse,
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    } as APIResponse<ParsedContent>);

  } catch (error) {
    console.error('Content detail API error:', error);
    return NextResponse.json(
      { success: false, error: '获取内容详情失败' } as APIResponse,
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = updateContentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '请求参数无效',
          details: validationResult.error.errors
        } as APIResponse,
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // 首先检查内容是否存在
    const existingContent = await contentService.getContentById(id, user.id);
    if (!existingContent.success) {
      return NextResponse.json(
        { success: false, error: '内容不存在' } as APIResponse,
        { status: 404 }
      );
    }

    const result = await contentService.updateContent(id, user.id, updates);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error } as APIResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: '内容更新成功'
    } as APIResponse<ParsedContent>);

  } catch (error) {
    console.error('Content update API error:', error);
    return NextResponse.json(
      { success: false, error: '更新内容失败' } as APIResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    // 首先检查内容是否存在
    const existingContent = await contentService.getContentById(id, user.id);
    if (!existingContent.success) {
      return NextResponse.json(
        { success: false, error: '内容不存在' } as APIResponse,
        { status: 404 }
      );
    }

    const result = await contentService.deleteContent(id, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error } as APIResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '内容删除成功'
    } as APIResponse);

  } catch (error) {
    console.error('Content delete API error:', error);
    return NextResponse.json(
      { success: false, error: '删除内容失败' } as APIResponse,
      { status: 500 }
    );
  }
}

// PATCH 请求用于重新生成摘要
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...options } = body;

    if (action !== 'regenerate-summary') {
      return NextResponse.json(
        { success: false, error: '不支持的操作' } as APIResponse,
        { status: 400 }
      );
    }

    const validationResult = regenerateSummarySchema.safeParse(options);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '请求参数无效',
          details: validationResult.error.errors
        } as APIResponse,
        { status: 400 }
      );
    }

    // 获取现有内容
    const existingContent = await contentService.getContentById(id, user.id);
    if (!existingContent.success || !existingContent.data) {
      return NextResponse.json(
        { success: false, error: '内容不存在' } as APIResponse,
        { status: 404 }
      );
    }

    const content = existingContent.data;
    if (!content.cleaned_content) {
      return NextResponse.json(
        { success: false, error: '没有可用的内容进行摘要生成' } as APIResponse,
        { status: 400 }
      );
    }

    // 重新生成摘要
    const summaryResult = await aiServiceManager.generateSummary(content.cleaned_content, {
      summaryType: validationResult.data.summaryType || 'standard',
      language: validationResult.data.language || 'auto',
      maxTokens: validationResult.data.maxTokens || 1000,
      customPrompt: validationResult.data.customPrompt,
      includeKeyPoints: true,
      includeAnalysis: false
    });

    if (!summaryResult.success) {
      return NextResponse.json(
        { success: false, error: `重新生成摘要失败: ${summaryResult.error}` } as APIResponse,
        { status: 500 }
      );
    }

    // 更新内容记录
    const updateResult = await contentService.updateContent(id, user.id, {
      summary: summaryResult.summary,
      key_points: summaryResult.keyPoints,
      tokens_used: summaryResult.metadata.tokensUsed.total,
      metadata: {
        ...content.metadata,
        regenerated: {
          timestamp: new Date().toISOString(),
          previousSummary: content.summary,
          newAiMetadata: summaryResult.metadata
        }
      }
    });

    if (!updateResult.success) {
      return NextResponse.json(
        { success: false, error: '更新摘要失败' } as APIResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updateResult.data,
      metadata: {
        tokensUsed: summaryResult.metadata.tokensUsed.total,
        cost: summaryResult.metadata.cost,
        model: summaryResult.metadata.model,
        processingTime: summaryResult.metadata.processingTime
      },
      message: '摘要重新生成成功'
    } as APIResponse<ParsedContent>);

  } catch (error) {
    console.error('Content regenerate API error:', error);
    return NextResponse.json(
      { success: false, error: '重新生成摘要失败' } as APIResponse,
      { status: 500 }
    );
  }
}