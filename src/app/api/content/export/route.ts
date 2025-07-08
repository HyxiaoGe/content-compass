// src/app/api/content/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { contentService } from '@/lib/database/content';
import type { Database, APIResponse, ParsedContent } from '@/types/database';
import { z } from 'zod';

// 导出请求验证
const exportSchema = z.object({
  format: z.enum(['json', 'csv', 'markdown', 'txt']),
  filters: z.object({
    status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
    language: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    ids: z.array(z.string().uuid()).optional()
  }).optional(),
  options: z.object({
    includeSummary: z.boolean().optional(),
    includeKeyPoints: z.boolean().optional(),
    includeMetadata: z.boolean().optional(),
    includeOriginalContent: z.boolean().optional()
  }).optional()
});

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
    const validationResult = exportSchema.safeParse(body);

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

    const { format, filters = {}, options = {} } = validationResult.data;
    const {
      includeSummary = true,
      includeKeyPoints = true,
      includeMetadata = false,
      includeOriginalContent = false
    } = options;

    // 获取要导出的内容
    let contents: ParsedContent[] = [];

    if (filters.ids && filters.ids.length > 0) {
      // 按ID导出特定内容
      const results = await Promise.all(
        filters.ids.map(id => contentService.getContentById(id, user.id))
      );
      contents = results
        .filter(result => result.success && result.data)
        .map(result => result.data!);
    } else {
      // 按条件导出内容
      let query = supabase
        .from('parsed_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.language) query = query.eq('language', filters.language);
      if (filters.startDate) query = query.gte('created_at', filters.startDate);
      if (filters.endDate) query = query.lte('created_at', filters.endDate);

      const { data, error } = await query;
      
      if (error) {
        return NextResponse.json(
          { success: false, error: '获取导出数据失败' } as APIResponse,
          { status: 500 }
        );
      }

      contents = data || [];
    }

    if (contents.length === 0) {
      return NextResponse.json(
        { success: false, error: '没有找到要导出的内容' } as APIResponse,
        { status: 404 }
      );
    }

    // 生成导出数据
    const exportData = await generateExportData(contents, format, {
      includeSummary,
      includeKeyPoints,
      includeMetadata,
      includeOriginalContent
    });

    // 设置响应头
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `content-compass-export-${timestamp}.${format}`;
    
    let contentType: string;
    let responseData: string | object;

    switch (format) {
      case 'json':
        contentType = 'application/json';
        responseData = exportData;
        break;
      case 'csv':
        contentType = 'text/csv';
        responseData = exportData as string;
        break;
      case 'markdown':
        contentType = 'text/markdown';
        responseData = exportData as string;
        break;
      case 'txt':
        contentType = 'text/plain';
        responseData = exportData as string;
        break;
      default:
        contentType = 'application/json';
        responseData = exportData;
    }

    // 返回文件下载响应
    return new NextResponse(
      typeof responseData === 'string' ? responseData : JSON.stringify(responseData, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache'
        }
      }
    );

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '导出失败' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

// 生成导出数据
async function generateExportData(
  contents: ParsedContent[],
  format: string,
  options: {
    includeSummary: boolean;
    includeKeyPoints: boolean;
    includeMetadata: boolean;
    includeOriginalContent: boolean;
  }
): Promise<any> {
  
  const exportItems = contents.map(content => {
    const item: any = {
      id: content.id,
      title: content.title,
      url: content.url,
      status: content.status,
      language: content.language,
      word_count: content.word_count,
      reading_time: content.reading_time,
      tokens_used: content.tokens_used,
      created_at: content.created_at,
      updated_at: content.updated_at
    };

    if (options.includeSummary && content.summary) {
      item.summary = content.summary;
    }

    if (options.includeKeyPoints && content.key_points) {
      item.key_points = content.key_points;
    }

    if (options.includeOriginalContent && content.cleaned_content) {
      item.content = content.cleaned_content;
    }

    if (options.includeMetadata && content.metadata) {
      item.metadata = content.metadata;
    }

    if (content.error_message) {
      item.error_message = content.error_message;
    }

    return item;
  });

  switch (format) {
    case 'json':
      return {
        exported_at: new Date().toISOString(),
        total_items: exportItems.length,
        export_options: options,
        data: exportItems
      };

    case 'csv':
      return generateCSV(exportItems);

    case 'markdown':
      return generateMarkdown(exportItems, options);

    case 'txt':
      return generatePlainText(exportItems, options);

    default:
      return exportItems;
  }
}

// 生成CSV格式
function generateCSV(items: any[]): string {
  if (items.length === 0) return '';

  // 获取所有字段
  const allFields = new Set<string>();
  items.forEach((item: any) => {
    Object.keys(item).forEach(key => {
      if (key !== 'key_points' && key !== 'metadata') { // 排除复杂字段
        allFields.add(key);
      }
    });
  });

  const fields = Array.from(allFields);
  
  // CSV头部
  const header = fields.join(',');
  
  // CSV数据行
  const rows = items.map((item: any) => {
    return fields.map(field => {
      const value = item[field];
      if (value === null || value === undefined) return '';
      
      // 转义CSV中的特殊字符
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });

  return [header, ...rows].join('\n');
}

// 生成Markdown格式
function generateMarkdown(items: any[], options: any): string {
  let markdown = '# ContentCompass 导出报告\n\n';
  markdown += `导出时间: ${new Date().toLocaleString()}\n`;
  markdown += `总计项目: ${items.length}\n\n`;

  items.forEach((item, index) => {
    markdown += `## ${index + 1}. ${item.title || '无标题'}\n\n`;
    markdown += `- **URL**: ${item.url}\n`;
    markdown += `- **状态**: ${item.status}\n`;
    markdown += `- **语言**: ${item.language || 'unknown'}\n`;
    markdown += `- **字数**: ${item.word_count || 0}\n`;
    markdown += `- **阅读时间**: ${item.reading_time || 0} 分钟\n`;
    markdown += `- **创建时间**: ${new Date(item.created_at).toLocaleString()}\n\n`;

    if (options.includeSummary && item.summary) {
      markdown += `### 摘要\n\n${item.summary}\n\n`;
    }

    if (options.includeKeyPoints && item.key_points && item.key_points.length > 0) {
      markdown += `### 关键要点\n\n`;
      item.key_points.forEach((point: string) => {
        markdown += `- ${point}\n`;
      });
      markdown += '\n';
    }

    if (options.includeOriginalContent && item.content) {
      markdown += `### 原始内容\n\n${item.content}\n\n`;
    }

    markdown += '---\n\n';
  });

  return markdown;
}

// 生成纯文本格式
function generatePlainText(items: any[], options: any): string {
  let text = 'ContentCompass 导出报告\n';
  text += '='.repeat(50) + '\n\n';
  text += `导出时间: ${new Date().toLocaleString()}\n`;
  text += `总计项目: ${items.length}\n\n`;

  items.forEach((item, index) => {
    text += `${index + 1}. ${item.title || '无标题'}\n`;
    text += '-'.repeat(30) + '\n';
    text += `URL: ${item.url}\n`;
    text += `状态: ${item.status}\n`;
    text += `语言: ${item.language || 'unknown'}\n`;
    text += `字数: ${item.word_count || 0}\n`;
    text += `阅读时间: ${item.reading_time || 0} 分钟\n`;
    text += `创建时间: ${new Date(item.created_at).toLocaleString()}\n\n`;

    if (options.includeSummary && item.summary) {
      text += `摘要:\n${item.summary}\n\n`;
    }

    if (options.includeKeyPoints && item.key_points && item.key_points.length > 0) {
      text += `关键要点:\n`;
      item.key_points.forEach((point: string, idx: number) => {
        text += `${idx + 1}. ${point}\n`;
      });
      text += '\n';
    }

    if (options.includeOriginalContent && item.content) {
      text += `原始内容:\n${item.content}\n\n`;
    }

    text += '='.repeat(50) + '\n\n';
  });

  return text;
}