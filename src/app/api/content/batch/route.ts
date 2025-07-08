// src/app/api/content/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { scraperService } from '@/lib/scraper';
import { aiServiceManager } from '@/lib/ai';
import { contentService } from '@/lib/database/content';
import { userService } from '@/lib/database/user';
import type { Database, APIResponse } from '@/types/database';
import { z } from 'zod';

// 批量解析请求验证
const batchParseSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(10), // 最多10个URL
  options: z.object({
    summaryType: z.enum(['brief', 'standard', 'detailed', 'bullet-points', 'key-insights', 'executive', 'technical', 'academic']).optional(),
    language: z.string().optional(),
    extractImages: z.boolean().optional(),
    extractLinks: z.boolean().optional(),
    customPrompt: z.string().optional(),
    maxTokens: z.number().min(100).max(4000).optional(),
    continueOnError: z.boolean().optional()
  }).optional()
});

// 批量删除请求验证
const batchDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(50) // 最多50个ID
});

// 批量更新请求验证
const batchUpdateSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(50),
  updates: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    key_points: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    language: z.string().optional()
  })
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const supabase = createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'parse':
        return await handleBatchParse(body, user.id, supabase, startTime);
      case 'delete':
        return await handleBatchDelete(body, user.id);
      case 'update':
        return await handleBatchUpdate(body, user.id);
      default:
        return NextResponse.json(
          { success: false, error: '不支持的批量操作' } as APIResponse,
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Batch API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '批量操作失败' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

// 批量解析处理
async function handleBatchParse(body: any, userId: string, supabase: any, startTime: number) {
  const validationResult = batchParseSchema.safeParse(body);
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

  const { urls, options = {} } = validationResult.data;
  const { continueOnError = true } = options;

  // 检查用户使用限制
  const usageLimitResult = await userService.checkUsageLimit(userId);
  if (!usageLimitResult.success || !usageLimitResult.data?.canProceed) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'API使用次数不足，无法进行批量操作'
      } as APIResponse,
      { status: 429 }
    );
  }

  const results: Array<{
    url: string;
    success: boolean;
    contentId?: string;
    data?: any;
    error?: string;
  }> = [];

  let successCount = 0;
  let failureCount = 0;
  let totalTokens = 0;
  let totalCost = 0;

  // 创建批量处理请求
  const batchRequest = {
    items: urls.map(url => ({ id: url, content: url })),
    batchOptions: {
      maxConcurrency: 3,
      preserveOrder: true,
      continueOnError
    }
  };

  try {
    // 并行处理所有URL
    const promises = urls.map(async (url) => {
      try {
        // 创建初始内容记录
        const contentResult = await contentService.createContent(userId, {
          user_id: userId,
          url,
          status: 'processing',
          metadata: { batchOperation: true, requestOptions: options }
        });

        if (!contentResult.success) {
          return {
            url,
            success: false,
            error: '创建内容记录失败'
          };
        }

        const contentId = contentResult.data!.id;

        // 爬取网页
        const scrapingResult = await scraperService.scrapeURL(url, {
          extractImages: options.extractImages ?? false,
          extractLinks: options.extractLinks ?? false,
          timeout: 30000
        });

        if (!scrapingResult.success || !scrapingResult.data) {
          await contentService.updateContent(contentId, userId, {
            status: 'failed',
            error_message: `爬取失败: ${scrapingResult.error}`
          });

          return {
            url,
            success: false,
            contentId,
            error: scrapingResult.error
          };
        }

        // 生成摘要
        const summaryResult = await aiServiceManager.generateSummary(
          scrapingResult.data.cleanedContent,
          {
            summaryType: options.summaryType ?? 'standard',
            language: options.language ?? 'auto',
            maxTokens: options.maxTokens ?? 1000,
            customPrompt: options.customPrompt,
            includeKeyPoints: true
          }
        );

        if (!summaryResult.success) {
          await contentService.updateContent(contentId, userId, {
            status: 'failed',
            error_message: `摘要生成失败: ${summaryResult.error}`
          });

          return {
            url,
            success: false,
            contentId,
            error: summaryResult.error
          };
        }

        // 更新内容记录
        const updateResult = await contentService.updateContent(contentId, userId, {
          title: scrapingResult.data.title,
          original_content: scrapingResult.data.content,
          cleaned_content: scrapingResult.data.cleanedContent,
          summary: summaryResult.summary,
          key_points: summaryResult.keyPoints,
          metadata: {
            ...scrapingResult.data.metadata,
            ai: summaryResult.metadata,
            batchOperation: true
          },
          word_count: scrapingResult.data.metadata.wordCount,
          reading_time: scrapingResult.data.metadata.readingTime,
          language: summaryResult.metadata.language,
          status: 'completed',
          tokens_used: summaryResult.metadata.tokensUsed.total
        });

        return {
          url,
          success: true,
          contentId,
          data: updateResult.data,
          tokensUsed: summaryResult.metadata.tokensUsed.total,
          cost: summaryResult.metadata.cost
        };

      } catch (error) {
        return {
          url,
          success: false,
          error: error instanceof Error ? error.message : '处理失败'
        };
      }
    });

    // 等待所有任务完成
    const batchResults = await Promise.allSettled(promises);

    // 处理结果
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const taskResult = result.value;
        results.push(taskResult);
        
        if (taskResult.success) {
          successCount++;
          totalTokens += taskResult.tokensUsed || 0;
          totalCost += taskResult.cost || 0;
        } else {
          failureCount++;
        }
      } else {
        results.push({
          url: urls[index],
          success: false,
          error: '任务执行失败: ' + result.reason
        });
        failureCount++;
      }
    });

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: urls.length,
          successful: successCount,
          failed: failureCount,
          totalTokens,
          totalCost,
          processingTime
        }
      },
      message: `批量解析完成: ${successCount}成功, ${failureCount}失败`
    } as APIResponse);

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '批量解析失败: ' + (error instanceof Error ? error.message : '未知错误')
      } as APIResponse,
      { status: 500 }
    );
  }
}

// 批量删除处理
async function handleBatchDelete(body: any, userId: string) {
  const validationResult = batchDeleteSchema.safeParse(body);
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

  const { ids } = validationResult.data;
  const results: Array<{ id: string; success: boolean; error?: string }> = [];

  let successCount = 0;
  let failureCount = 0;

  // 并行删除所有内容
  const deletePromises = ids.map(async (id) => {
    try {
      const result = await contentService.deleteContent(id, userId);
      if (result.success) {
        successCount++;
        return { id, success: true };
      } else {
        failureCount++;
        return { id, success: false, error: result.error };
      }
    } catch (error) {
      failureCount++;
      return { 
        id, 
        success: false, 
        error: error instanceof Error ? error.message : '删除失败' 
      };
    }
  });

  const deleteResults = await Promise.allSettled(deletePromises);
  
  deleteResults.forEach((result) => {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    } else {
      failureCount++;
      results.push({
        id: 'unknown',
        success: false,
        error: '删除操作失败'
      });
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      results,
      summary: {
        total: ids.length,
        successful: successCount,
        failed: failureCount
      }
    },
    message: `批量删除完成: ${successCount}成功, ${failureCount}失败`
  } as APIResponse);
}

// 批量更新处理
async function handleBatchUpdate(body: any, userId: string) {
  const validationResult = batchUpdateSchema.safeParse(body);
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

  const { ids, updates } = validationResult.data;
  const results: Array<{ id: string; success: boolean; data?: any; error?: string }> = [];

  let successCount = 0;
  let failureCount = 0;

  // 并行更新所有内容
  const updatePromises = ids.map(async (id) => {
    try {
      const result = await contentService.updateContent(id, userId, updates);
      if (result.success) {
        successCount++;
        return { id, success: true, data: result.data };
      } else {
        failureCount++;
        return { id, success: false, error: result.error };
      }
    } catch (error) {
      failureCount++;
      return { 
        id, 
        success: false, 
        error: error instanceof Error ? error.message : '更新失败' 
      };
    }
  });

  const updateResults = await Promise.allSettled(updatePromises);
  
  updateResults.forEach((result) => {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    } else {
      failureCount++;
      results.push({
        id: 'unknown',
        success: false,
        error: '更新操作失败'
      });
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      results,
      summary: {
        total: ids.length,
        successful: successCount,
        failed: failureCount
      }
    },
    message: `批量更新完成: ${successCount}成功, ${failureCount}失败`
  } as APIResponse);
}