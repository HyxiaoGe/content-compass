// src/app/api/docs/route.ts
import { NextRequest, NextResponse } from 'next/server';

// API文档数据结构
const apiDocumentation = {
  title: 'ContentCompass API 文档',
  version: '1.0.0',
  description: '一个功能完整的网页内容解析和AI摘要平台的API接口',
  baseUrl: '/api',
  
  authentication: {
    type: 'Session-based',
    description: '使用Supabase认证，需要有效的用户session',
    header: 'Authorization: Bearer <token>',
    note: '所有API端点都需要用户认证'
  },

  endpoints: {
    // 内容解析API
    parse: {
      path: '/api/parse',
      method: 'POST',
      description: '解析网页内容并生成AI摘要',
      requestBody: {
        url: {
          type: 'string',
          required: true,
          description: '要解析的网页URL'
        },
        options: {
          type: 'object',
          required: false,
          properties: {
            summaryType: {
              type: 'string',
              enum: ['brief', 'standard', 'detailed', 'bullet-points', 'key-insights', 'executive', 'technical', 'academic'],
              default: 'standard',
              description: '摘要类型'
            },
            language: {
              type: 'string',
              default: 'auto',
              description: '输出语言，auto为自动检测'
            },
            extractImages: {
              type: 'boolean',
              default: false,
              description: '是否提取图片'
            },
            extractLinks: {
              type: 'boolean',
              default: false,
              description: '是否提取链接'
            },
            customPrompt: {
              type: 'string',
              description: '自定义提示词'
            },
            maxTokens: {
              type: 'number',
              min: 100,
              max: 4000,
              default: 1000,
              description: '最大token数'
            }
          }
        }
      },
      responses: {
        200: {
          description: '解析成功',
          example: {
            success: true,
            data: {
              id: 'content-id',
              title: '网页标题',
              url: 'https://example.com',
              summary: 'AI生成的摘要',
              key_points: ['关键点1', '关键点2'],
              status: 'completed',
              language: 'zh',
              word_count: 1500,
              reading_time: 8,
              tokens_used: 800,
              created_at: '2024-01-01T00:00:00Z'
            },
            metadata: {
              processingTime: 5000,
              tokensUsed: 800,
              cost: 0.002,
              model: 'gpt-4o-mini'
            }
          }
        },
        400: { description: '请求参数错误' },
        429: { description: 'API使用次数超限' },
        500: { description: '服务器内部错误' }
      }
    },

    // 内容管理API
    content: {
      list: {
        path: '/api/content',
        method: 'GET',
        description: '获取用户的内容列表',
        queryParams: {
          page: { type: 'number', default: 1, description: '页码' },
          limit: { type: 'number', default: 10, max: 100, description: '每页数量' },
          status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'], description: '状态过滤' },
          sort: { type: 'string', enum: ['created_at', 'updated_at', 'title'], default: 'created_at', description: '排序字段' },
          order: { type: 'string', enum: ['asc', 'desc'], default: 'desc', description: '排序方向' },
          search: { type: 'string', description: '搜索关键词' },
          language: { type: 'string', description: '语言过滤' },
          startDate: { type: 'string', format: 'date-time', description: '开始时间' },
          endDate: { type: 'string', format: 'date-time', description: '结束时间' }
        },
        responses: {
          200: {
            description: '获取成功',
            example: {
              success: true,
              data: [
                {
                  id: 'content-id',
                  title: '网页标题',
                  url: 'https://example.com',
                  summary: '摘要',
                  status: 'completed',
                  created_at: '2024-01-01T00:00:00Z'
                }
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 100,
                hasMore: true,
                totalPages: 10
              }
            }
          }
        }
      },

      detail: {
        path: '/api/content/{id}',
        method: 'GET',
        description: '获取单个内容详情',
        params: {
          id: { type: 'string', required: true, description: '内容ID' }
        },
        responses: {
          200: { description: '获取成功' },
          404: { description: '内容不存在' }
        }
      },

      update: {
        path: '/api/content/{id}',
        method: 'PUT',
        description: '更新内容',
        params: {
          id: { type: 'string', required: true, description: '内容ID' }
        },
        requestBody: {
          title: { type: 'string', description: '标题' },
          summary: { type: 'string', description: '摘要' },
          key_points: { type: 'array', items: { type: 'string' }, description: '关键点' },
          metadata: { type: 'object', description: '元数据' },
          language: { type: 'string', description: '语言' }
        },
        responses: {
          200: { description: '更新成功' },
          404: { description: '内容不存在' }
        }
      },

      delete: {
        path: '/api/content/{id}',
        method: 'DELETE',
        description: '删除内容',
        params: {
          id: { type: 'string', required: true, description: '内容ID' }
        },
        responses: {
          200: { description: '删除成功' },
          404: { description: '内容不存在' }
        }
      },

      regenerate: {
        path: '/api/content/{id}',
        method: 'PATCH',
        description: '重新生成摘要',
        params: {
          id: { type: 'string', required: true, description: '内容ID' }
        },
        requestBody: {
          action: { type: 'string', enum: ['regenerate-summary'], required: true },
          summaryType: { type: 'string', enum: ['brief', 'standard', 'detailed', 'bullet-points', 'key-insights', 'executive', 'technical', 'academic'] },
          language: { type: 'string' },
          customPrompt: { type: 'string' },
          maxTokens: { type: 'number', min: 100, max: 4000 }
        },
        responses: {
          200: { description: '重新生成成功' },
          404: { description: '内容不存在' }
        }
      }
    },

    // 批量操作API
    batch: {
      path: '/api/content/batch',
      method: 'POST',
      description: '批量操作内容',
      requestBody: {
        action: {
          type: 'string',
          enum: ['parse', 'delete', 'update'],
          required: true,
          description: '操作类型'
        },
        // 批量解析
        urls: {
          type: 'array',
          items: { type: 'string', format: 'url' },
          maxItems: 10,
          description: '批量解析时的URL列表'
        },
        // 批量删除/更新
        ids: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          maxItems: 50,
          description: '批量操作的内容ID列表'
        },
        // 批量更新数据
        updates: {
          type: 'object',
          description: '批量更新时的数据'
        },
        // 操作选项
        options: {
          type: 'object',
          properties: {
            continueOnError: { type: 'boolean', default: true, description: '遇到错误时是否继续' }
          }
        }
      },
      responses: {
        200: {
          description: '批量操作完成',
          example: {
            success: true,
            data: {
              results: [
                {
                  url: 'https://example.com',
                  success: true,
                  contentId: 'content-id'
                }
              ],
              summary: {
                total: 5,
                successful: 4,
                failed: 1,
                totalTokens: 2000,
                totalCost: 0.006,
                processingTime: 15000
              }
            }
          }
        }
      }
    },

    // 导出API
    export: {
      path: '/api/content/export',
      method: 'POST',
      description: '导出内容数据',
      requestBody: {
        format: {
          type: 'string',
          enum: ['json', 'csv', 'markdown', 'txt'],
          required: true,
          description: '导出格式'
        },
        filters: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
            language: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            ids: { type: 'array', items: { type: 'string', format: 'uuid' } }
          }
        },
        options: {
          type: 'object',
          properties: {
            includeSummary: { type: 'boolean', default: true },
            includeKeyPoints: { type: 'boolean', default: true },
            includeMetadata: { type: 'boolean', default: false },
            includeOriginalContent: { type: 'boolean', default: false }
          }
        }
      },
      responses: {
        200: {
          description: '导出成功',
          headers: {
            'Content-Type': 'application/json|text/csv|text/markdown|text/plain',
            'Content-Disposition': 'attachment; filename="content-compass-export-*.{format}"'
          }
        }
      }
    },

    // 用户统计API
    stats: {
      path: '/api/user/stats',
      method: 'GET',
      description: '获取用户统计数据',
      queryParams: {
        timeRange: { type: 'string', default: '30', description: '时间范围（天数）' },
        detailed: { type: 'boolean', default: false, description: '是否返回详细数据' }
      },
      responses: {
        200: {
          description: '获取成功',
          example: {
            success: true,
            data: {
              profile: {
                subscription_tier: 'free',
                api_usage_count: 50,
                api_usage_limit: 100,
                usage_percentage: 50,
                remaining_requests: 50
              },
              content: {
                total_content: 200,
                this_month_content: 25,
                this_week_content: 5,
                today_content: 1,
                total_tokens_used: 50000,
                this_month_tokens: 5000,
                total_cost: 12.5,
                this_month_cost: 1.25
              },
              performance_metrics: {
                average_processing_time: 5000,
                success_rate: 95,
                average_tokens_per_request: 800,
                average_cost_per_request: 0.002
              }
            }
          }
        }
      }
    }
  },

  // 错误代码
  errorCodes: {
    400: { description: '请求参数错误', example: { success: false, error: '请求参数无效' } },
    401: { description: '用户未认证', example: { success: false, error: '用户未认证' } },
    403: { description: '权限不足', example: { success: false, error: '权限不足' } },
    404: { description: '资源不存在', example: { success: false, error: '内容不存在' } },
    429: { description: 'API使用次数超限', example: { success: false, error: 'API使用次数不足' } },
    500: { description: '服务器内部错误', example: { success: false, error: '服务器内部错误' } }
  },

  // 数据模型
  models: {
    ParsedContent: {
      id: { type: 'string', format: 'uuid', description: '内容ID' },
      user_id: { type: 'string', format: 'uuid', description: '用户ID' },
      title: { type: 'string', description: '标题' },
      url: { type: 'string', format: 'url', description: '原始URL' },
      original_content: { type: 'string', description: '原始内容' },
      cleaned_content: { type: 'string', description: '清理后的内容' },
      summary: { type: 'string', description: 'AI生成的摘要' },
      key_points: { type: 'array', items: { type: 'string' }, description: '关键点' },
      metadata: { type: 'object', description: '元数据' },
      word_count: { type: 'number', description: '字数' },
      reading_time: { type: 'number', description: '阅读时间（分钟）' },
      language: { type: 'string', description: '语言' },
      status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'], description: '状态' },
      tokens_used: { type: 'number', description: '使用的token数' },
      processing_time_ms: { type: 'number', description: '处理时间（毫秒）' },
      error_message: { type: 'string', description: '错误信息' },
      created_at: { type: 'string', format: 'date-time', description: '创建时间' },
      updated_at: { type: 'string', format: 'date-time', description: '更新时间' }
    },

    APIResponse: {
      success: { type: 'boolean', description: '操作是否成功' },
      data: { type: 'any', description: '返回数据' },
      error: { type: 'string', description: '错误信息' },
      message: { type: 'string', description: '提示信息' },
      metadata: { type: 'object', description: '元数据' }
    }
  },

  // 使用限制
  limits: {
    requests: {
      free: { daily: 100, monthly: 1000 },
      premium: { daily: 1000, monthly: 10000 },
      enterprise: { daily: 10000, monthly: 100000 }
    },
    batch: {
      parse: { maxUrls: 10, maxConcurrency: 3 },
      delete: { maxIds: 50 },
      update: { maxIds: 50 }
    },
    export: {
      maxItems: 1000,
      formats: ['json', 'csv', 'markdown', 'txt']
    }
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const section = searchParams.get('section');

    // 如果指定了特定章节，只返回该章节
    if (section && section in apiDocumentation) {
      return NextResponse.json({
        success: true,
        data: {
          [section]: (apiDocumentation as any)[section]
        }
      });
    }

    // 根据格式返回文档
    if (format === 'html') {
      // 返回HTML格式的文档
      const html = generateHTMLDocs(apiDocumentation);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        }
      });
    }

    // 默认返回JSON格式
    return NextResponse.json({
      success: true,
      data: apiDocumentation
    });

  } catch (error) {
    console.error('API docs error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取API文档失败' 
      },
      { status: 500 }
    );
  }
}

// 生成HTML格式文档
function generateHTMLDocs(docs: any): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docs.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #e1e5e9; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 40px; }
        .endpoint { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #007bff; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; margin-right: 10px; }
        .method.GET { background: #28a745; }
        .method.POST { background: #007bff; }
        .method.PUT { background: #ffc107; color: #212529; }
        .method.DELETE { background: #dc3545; }
        .method.PATCH { background: #6f42c1; }
        .params { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; border: 1px solid #e1e5e9; }
        .param { margin: 8px 0; }
        .param-name { font-weight: bold; color: #0366d6; }
        .param-type { color: #6a737d; font-style: italic; }
        .example { background: #f1f8ff; padding: 15px; margin: 10px 0; border-radius: 4px; border: 1px solid #c8e1ff; }
        .code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        h1, h2, h3 { color: #24292e; }
        h1 { border-bottom: 1px solid #e1e5e9; padding-bottom: 10px; }
        h2 { margin-top: 30px; }
        .toc { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .toc ul { list-style: none; padding-left: 0; }
        .toc li { margin: 5px 0; }
        .toc a { text-decoration: none; color: #0366d6; }
        .toc a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${docs.title}</h1>
        <p><strong>版本:</strong> ${docs.version}</p>
        <p><strong>基础URL:</strong> <code>${docs.baseUrl}</code></p>
        <p>${docs.description}</p>
    </div>

    <div class="toc">
        <h2>目录</h2>
        <ul>
            <li><a href="#auth">认证</a></li>
            <li><a href="#endpoints">API端点</a></li>
            <li><a href="#models">数据模型</a></li>
            <li><a href="#errors">错误代码</a></li>
            <li><a href="#limits">使用限制</a></li>
        </ul>
    </div>

    <div class="section" id="auth">
        <h2>认证</h2>
        <p><strong>类型:</strong> ${docs.authentication.type}</p>
        <p><strong>说明:</strong> ${docs.authentication.description}</p>
        <p><strong>请求头:</strong> <code>${docs.authentication.header}</code></p>
        <p><strong>注意:</strong> ${docs.authentication.note}</p>
    </div>

    <div class="section" id="endpoints">
        <h2>API端点</h2>
        
        <div class="endpoint">
            <h3>内容解析</h3>
            <div>
                <span class="method POST">POST</span>
                <code>${docs.endpoints.parse.path}</code>
            </div>
            <p>${docs.endpoints.parse.description}</p>
        </div>

        <div class="endpoint">
            <h3>内容列表</h3>
            <div>
                <span class="method GET">GET</span>
                <code>${docs.endpoints.content.list.path}</code>
            </div>
            <p>${docs.endpoints.content.list.description}</p>
        </div>

        <div class="endpoint">
            <h3>内容详情</h3>
            <div>
                <span class="method GET">GET</span>
                <code>${docs.endpoints.content.detail.path}</code>
            </div>
            <p>${docs.endpoints.content.detail.description}</p>
        </div>

        <div class="endpoint">
            <h3>批量操作</h3>
            <div>
                <span class="method POST">POST</span>
                <code>${docs.endpoints.batch.path}</code>
            </div>
            <p>${docs.endpoints.batch.description}</p>
        </div>

        <div class="endpoint">
            <h3>导出数据</h3>
            <div>
                <span class="method POST">POST</span>
                <code>${docs.endpoints.export.path}</code>
            </div>
            <p>${docs.endpoints.export.description}</p>
        </div>

        <div class="endpoint">
            <h3>用户统计</h3>
            <div>
                <span class="method GET">GET</span>
                <code>${docs.endpoints.stats.path}</code>
            </div>
            <p>${docs.endpoints.stats.description}</p>
        </div>
    </div>

    <div class="section" id="models">
        <h2>数据模型</h2>
        <div class="params">
            <h3>ParsedContent</h3>
            <div class="param">
                <span class="param-name">id</span>
                <span class="param-type">string (uuid)</span>
                - 内容ID
            </div>
            <div class="param">
                <span class="param-name">title</span>
                <span class="param-type">string</span>
                - 标题
            </div>
            <div class="param">
                <span class="param-name">url</span>
                <span class="param-type">string (url)</span>
                - 原始URL
            </div>
            <div class="param">
                <span class="param-name">summary</span>
                <span class="param-type">string</span>
                - AI生成的摘要
            </div>
            <div class="param">
                <span class="param-name">status</span>
                <span class="param-type">enum</span>
                - 状态: pending, processing, completed, failed
            </div>
        </div>
    </div>

    <div class="section" id="errors">
        <h2>错误代码</h2>
        <div class="params">
            <div class="param"><strong>400</strong> - 请求参数错误</div>
            <div class="param"><strong>401</strong> - 用户未认证</div>
            <div class="param"><strong>403</strong> - 权限不足</div>
            <div class="param"><strong>404</strong> - 资源不存在</div>
            <div class="param"><strong>429</strong> - API使用次数超限</div>
            <div class="param"><strong>500</strong> - 服务器内部错误</div>
        </div>
    </div>

    <div class="section" id="limits">
        <h2>使用限制</h2>
        <div class="params">
            <h3>请求限制</h3>
            <div class="param"><strong>免费版:</strong> 每日100次，每月1000次</div>
            <div class="param"><strong>高级版:</strong> 每日1000次，每月10000次</div>
            <div class="param"><strong>企业版:</strong> 每日10000次，每月100000次</div>
            
            <h3>批量操作限制</h3>
            <div class="param"><strong>批量解析:</strong> 最多10个URL，最大并发3</div>
            <div class="param"><strong>批量删除/更新:</strong> 最多50个ID</div>
            
            <h3>导出限制</h3>
            <div class="param"><strong>最大项目数:</strong> 1000个</div>
            <div class="param"><strong>支持格式:</strong> JSON, CSV, Markdown, TXT</div>
        </div>
    </div>
</body>
</html>
  `;
}