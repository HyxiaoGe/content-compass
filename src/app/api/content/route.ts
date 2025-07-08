// src/app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { contentService } from '@/lib/database/content';
import type { Database, APIResponse, ParsedContent, PaginatedResponse } from '@/types/database';
import { z } from 'zod';

// 查询参数验证
const querySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  sort: z.enum(['created_at', 'updated_at', 'title']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  language: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const supabase = createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' } as APIResponse,
        { status: 401 }
      );
    }

    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validationResult = querySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '查询参数无效',
          details: validationResult.error.errors
        } as APIResponse,
        { status: 400 }
      );
    }

    const { 
      page = 1, 
      limit = 10, 
      status, 
      sort = 'created_at', 
      order = 'desc',
      search,
      language,
      startDate,
      endDate
    } = validationResult.data;

    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: '分页参数无效' } as APIResponse,
        { status: 400 }
      );
    }

    // 如果有搜索参数，使用搜索功能
    if (search) {
      const searchResult = await contentService.searchContent(user.id, search, {
        limit,
        offset: (page - 1) * limit
      });

      if (!searchResult.success) {
        return NextResponse.json(
          { success: false, error: searchResult.error } as APIResponse,
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: searchResult.data,
        pagination: {
          page,
          limit,
          hasMore: searchResult.data!.length === limit
        },
        query: { search }
      } as PaginatedResponse<ParsedContent>);
    }

    // 构建查询选项
    const queryOptions: any = {
      limit,
      offset: (page - 1) * limit,
      orderBy: sort,
      orderDirection: order
    };

    // 添加状态过滤
    if (status) {
      queryOptions.status = status;
    }

    // 获取内容列表
    let result;
    if (language || startDate || endDate) {
      // 需要更复杂的过滤，使用Supabase客户端直接查询
      let query = supabase
        .from('parsed_content')
        .select('*')
        .eq('user_id', user.id)
        .order(sort, { ascending: order === 'asc' })
        .range((page - 1) * limit, page * limit - 1);

      if (status) query = query.eq('status', status);
      if (language) query = query.eq('language', language);
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);

      const { data, error } = await query;
      
      if (error) {
        return NextResponse.json(
          { success: false, error: error.message } as APIResponse,
          { status: 500 }
        );
      }

      result = { success: true, data: data || [] };
    } else {
      result = await contentService.getUserContent(user.id, queryOptions);
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error } as APIResponse,
        { status: 500 }
      );
    }

    // 获取总数（用于分页信息）
    const { data: countResult, error: countError } = await supabase
      .from('parsed_content')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    const totalCount = countResult?.length || 0;

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: result.data!.length === limit,
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        status,
        language,
        startDate,
        endDate,
        sort,
        order
      }
    } as PaginatedResponse<ParsedContent>);

  } catch (error) {
    console.error('Content list API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

// POST 请求用于创建新的内容记录（通常通过parse API创建，这里提供备用方法）
export async function POST(request: NextRequest) {
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
    const { title, url, content, summary, keyPoints, metadata } = body;

    if (!title || !url || !content) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段: title, url, content' } as APIResponse,
        { status: 400 }
      );
    }

    const result = await contentService.createContent(user.id, {
      user_id: user.id,
      title,
      url,
      original_content: content,
      cleaned_content: content,
      summary: summary || '',
      key_points: keyPoints || [],
      metadata: metadata || {},
      word_count: content.split(/\s+/).length,
      reading_time: Math.ceil(content.split(/\s+/).length / 200),
      language: 'auto',
      status: 'completed'
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error } as APIResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: '内容创建成功'
    } as APIResponse<ParsedContent>, { status: 201 });

  } catch (error) {
    console.error('Content create API error:', error);
    return NextResponse.json(
      { success: false, error: '创建内容失败' } as APIResponse,
      { status: 500 }
    );
  }
}