// src/app/api/parse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { scraperService } from '@/lib/scraper';
import { aiServiceManager } from '@/lib/ai';
import { contentService } from '@/lib/database/content';
import { userService } from '@/lib/database/user';
import { usageLogService } from '@/lib/database/usage';
import type { Database, APIResponse, ParsedContent } from '@/types/database';
import type { SummaryOptions } from '@/types/ai';
import { z } from 'zod';

// 请求验证 schema
const parseRequestSchema = z.object({
  url: z.string().url('无效的URL格式'),
  options: z.object({
    summaryType: z.enum(['brief', 'standard', 'detailed', 'bullet-points', 'key-insights', 'executive', 'technical', 'academic']).optional(),
    language: z.string().optional(),
    extractImages: z.boolean().optional(),
    extractLinks: z.boolean().optional(),
    customPrompt: z.string().optional(),
    includeAnalysis: z.boolean().optional(),
    maxTokens: z.number().min(100).max(4000).optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let contentId: string | null = null;

  try {
    // 验证用户认证
    const supabase = await createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    // 解析和验证请求体
    const body = await request.json();
    const validationResult = parseRequestSchema.safeParse(body);

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

    const { url, options = {} } = validationResult.data;

    // 检查用户使用限制
    const usageLimitResult = await userService.checkUsageLimit(user.id);
    if (!usageLimitResult.success || !usageLimitResult.data?.canProceed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'API使用次数已达上限',
          data: usageLimitResult.data
        } as APIResponse,
        { status: 429 }
      );
    }

    // 检查是否已存在相同URL的内容（可选的去重逻辑）
    const existingContent = await contentService.getUserContent(user.id, {
      limit: 1,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });

    // 创建初始内容记录
    const initialContentResult = await contentService.createContent(user.id, {
      user_id: user.id,
      url,
      status: 'processing',
      metadata: { 
        requestOptions: options,
        requestTimestamp: new Date().toISOString()
      }
    });

    if (!initialContentResult.success || !initialContentResult.data) {
      return NextResponse.json(
        { success: false, error: '创建内容记录失败' } as APIResponse,
        { status: 500 }
      );
    }

    contentId = initialContentResult.data.id;

    try {
      // 第一步：网页爬取
      console.log(`开始爬取URL: ${url}`);
      const scrapingResult = await scraperService.scrapeURL(url, {
        extractImages: options.extractImages ?? false,
        extractLinks: options.extractLinks ?? false,
        timeout: 30000,
        waitForNetworkIdle: true
      });

      if (!scrapingResult.success || !scrapingResult.data) {
        await contentService.updateContent(contentId, user.id, {
          status: 'failed',
          error_message: `网页爬取失败: ${scrapingResult.error}`
        });

        return NextResponse.json(
          { 
            success: false, 
            error: `网页爬取失败: ${scrapingResult.error}`,
            details: { stage: 'scraping', url }
          } as APIResponse,
          { status: 400 }
        );
      }

      const { title, cleanedContent, metadata: scrapingMetadata } = scrapingResult.data;

      // 验证爬取的内容
      if (!cleanedContent || cleanedContent.length < 50) {
        await contentService.updateContent(contentId, user.id, {
          status: 'failed',
          error_message: '爬取的内容过短或为空'
        });

        return NextResponse.json(
          { success: false, error: '爬取的内容过短或为空，无法生成摘要' } as APIResponse,
          { status: 400 }
        );
      }

      // 第二步：AI摘要生成
      console.log(`开始生成摘要，内容长度: ${cleanedContent.length}`);
      const summaryOptions: SummaryOptions = {
        summaryType: options.summaryType ?? 'standard',
        language: options.language ?? 'auto',
        maxTokens: options.maxTokens ?? 1000,
        customPrompt: options.customPrompt,
        includeKeyPoints: true,
        includeAnalysis: options.includeAnalysis ?? false
      };

      const summaryResult = await aiServiceManager.generateSummary(cleanedContent, summaryOptions);

      if (!summaryResult.success) {
        await contentService.updateContent(contentId, user.id, {
          status: 'failed',
          error_message: `AI摘要生成失败: ${summaryResult.error}`
        });

        return NextResponse.json(
          { 
            success: false, 
            error: `AI摘要生成失败: ${summaryResult.error}`,
            details: { stage: 'ai_summary', contentLength: cleanedContent.length }
          } as APIResponse,
          { status: 500 }
        );
      }

      // 第三步：更新数据库记录
      const processingTime = Date.now() - startTime;
      const finalMetadata = {
        ...scrapingMetadata,
        ai: {
          model: summaryResult.metadata.model,
          tokensUsed: summaryResult.metadata.tokensUsed,
          cost: summaryResult.metadata.cost,
          confidence: summaryResult.metadata.confidence,
          processingTime: summaryResult.metadata.processingTime
        },
        processing: {
          totalTime: processingTime,
          scrapingTime: scrapingResult.processingTime,
          aiTime: summaryResult.metadata.processingTime
        },
        analysis: summaryResult.analysis
      };

      const updateResult = await contentService.updateContent(contentId, user.id, {
        title,
        original_content: scrapingResult.data.content,
        cleaned_content: cleanedContent,
        summary: summaryResult.summary,
        key_points: summaryResult.keyPoints,
        metadata: finalMetadata,
        word_count: scrapingMetadata.wordCount,
        reading_time: scrapingMetadata.readingTime,
        language: summaryResult.metadata.language,
        status: 'completed',
        tokens_used: summaryResult.metadata.tokensUsed.total,
        processing_time_ms: processingTime
      });

      if (!updateResult.success || !updateResult.data) {
        return NextResponse.json(
          { success: false, error: '更新内容记录失败' } as APIResponse,
          { status: 500 }
        );
      }

      // 第四步：更新用户使用统计
      await userService.incrementUsageCount(user.id);

      // 第五步：记录使用日志
      await usageLogService.logParseOperation(
        user.id,
        contentId,
        summaryResult.metadata.tokensUsed.total,
        processingTime,
        true,
        undefined,
        request.headers.get('x-forwarded-for') || undefined,
        request.headers.get('user-agent') || undefined
      );

      // 返回成功结果
      return NextResponse.json({
        success: true,
        data: updateResult.data,
        metadata: {
          processingTime,
          scrapingTime: scrapingResult.processingTime,
          aiTime: summaryResult.metadata.processingTime,
          tokensUsed: summaryResult.metadata.tokensUsed.total,
          cost: summaryResult.metadata.cost,
          compressionRatio: summaryResult.metadata.wordCount.compressionRatio
        }
      } as APIResponse<ParsedContent>);

    } catch (processingError) {
      // 处理过程中的错误
      if (contentId) {
        await contentService.updateContent(contentId, user.id, {
          status: 'failed',
          error_message: processingError instanceof Error ? processingError.message : '处理失败'
        });
      }

      throw processingError;
    }

  } catch (error) {
    console.error('Parse API error:', error);

    // 记录失败的使用日志
    if (contentId) {
      const processingTime = Date.now() - startTime;
      try {
        const supabase = await createRouteHandlerClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await usageLogService.logParseOperation(
            user.id,
            contentId,
            0,
            processingTime,
            false,
            error instanceof Error ? error.message : '未知错误',
            request.headers.get('x-forwarded-for') || undefined,
            request.headers.get('user-agent') || undefined
          );
        }
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误',
        requestId: contentId
      } as APIResponse,
      { status: 500 }
    );
  }
}

// GET 请求用于获取解析任务状态
export async function GET(request: NextRequest) {
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
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: '缺少taskId参数' } as APIResponse,
        { status: 400 }
      );
    }

    const result = await contentService.getContentById(taskId, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: '任务未找到' } as APIResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.data!.id,
        status: result.data!.status,
        url: result.data!.url,
        title: result.data!.title,
        progress: getProgressFromStatus(result.data!.status),
        error: result.data!.error_message,
        createdAt: result.data!.created_at,
        updatedAt: result.data!.updated_at
      }
    } as APIResponse);

  } catch (error) {
    console.error('Parse status API error:', error);
    return NextResponse.json(
      { success: false, error: '获取任务状态失败' } as APIResponse,
      { status: 500 }
    );
  }
}

// 辅助函数：根据状态计算进度
function getProgressFromStatus(status: string): number {
  switch (status) {
    case 'pending': return 0;
    case 'processing': return 50;
    case 'completed': return 100;
    case 'failed': return -1;
    default: return 0;
  }
}