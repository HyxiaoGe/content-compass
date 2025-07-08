# ContentCompass: 完整的0到1开发实施指南

## 项目概述

**项目名称**: ContentCompass  
**项目描述**: 智能网页内容解析和摘要平台，专注于AI产品更新监控  
**技术栈**: TypeScript + Next.js + Supabase + OpenAI  
**开发周期**: 3-6个月MVP，12个月商业化  

## 第一阶段：项目初始化 (第1周)

### 1.1 项目创建和基础设置

```bash
# 创建项目
npx create-next-app@latest content-compass --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 进入项目目录
cd content-compass

# 安装必要依赖
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @auth0/nextjs-auth0  # 或者使用 next-auth
npm install openai
npm install puppeteer @types/puppeteer
npm install prisma @prisma/client
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-toast
npm install react-hook-form @hookform/resolvers zod
npm install date-fns
npm install redis ioredis
npm install @sentry/nextjs

# 开发依赖
npm install --save-dev @types/node
```

### 1.2 项目文件结构

```
content-compass/
├── src/
│   ├── app/                    # App Router 页面
│   │   ├── (auth)/            # 认证相关页面
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # 仪表板
│   │   ├── api/              # API 路由
│   │   │   ├── auth/
│   │   │   ├── parse/
│   │   │   ├── content/
│   │   │   └── user/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── forms/            # 表单组件
│   │   ├── layout/           # 布局组件
│   │   └── dashboard/        # 仪表板组件
│   ├── lib/                  # 工具库
│   │   ├── auth/             # 认证相关
│   │   ├── database/         # 数据库操作
│   │   ├── scraper/          # 网页爬取
│   │   ├── ai/              # AI 服务
│   │   ├── utils/           # 工具函数
│   │   └── validations/     # 数据验证
│   ├── types/               # TypeScript 类型定义
│   │   ├── database.ts
│   │   ├── api.ts
│   │   └── scraper.ts
│   └── hooks/               # 自定义 Hooks
├── prisma/                  # Prisma schema
│   ├── schema.prisma
│   └── migrations/
├── public/                  # 静态资源
├── .env.local              # 环境变量
├── .env.example           # 环境变量模板
├── next.config.js         # Next.js 配置
├── tailwind.config.js     # Tailwind 配置
└── tsconfig.json          # TypeScript 配置
```

### 1.3 环境变量配置

```bash
# .env.example
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Redis (可选，用于缓存)
REDIS_URL=your_redis_url

# Auth (如果使用Auth0)
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# Sentry (可选，用于错误监控)
SENTRY_DSN=your_sentry_dsn
```

### 1.4 TypeScript 配置优化

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 第二阶段：数据库设计和认证 (第2周)

### 2.1 Supabase 数据库 Schema

```sql
-- 创建用户配置表
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    api_usage_count INTEGER DEFAULT 0,
    api_usage_limit INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建解析内容表
CREATE TABLE parsed_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    original_content TEXT,
    cleaned_content TEXT,
    summary TEXT,
    key_points TEXT[], -- PostgreSQL 数组类型
    metadata JSONB, -- 存储额外的元数据
    word_count INTEGER,
    reading_time INTEGER, -- 预估阅读时间（分钟）
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    tokens_used INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建监控规则表
CREATE TABLE monitoring_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    schedule TEXT DEFAULT 'daily' CHECK (schedule IN ('hourly', 'daily', 'weekly')),
    is_active BOOLEAN DEFAULT true,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    last_content_hash TEXT, -- 用于检测内容变化
    notification_settings JSONB DEFAULT '{"email": true, "webhook": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建使用统计表
CREATE TABLE usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('parse', 'monitor_check', 'api_call')),
    resource_id UUID, -- 可以关联到 parsed_content 或 monitoring_rules
    tokens_used INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建索引优化查询性能
CREATE INDEX idx_parsed_content_user_id ON parsed_content(user_id);
CREATE INDEX idx_parsed_content_created_at ON parsed_content(created_at DESC);
CREATE INDEX idx_parsed_content_status ON parsed_content(status);
CREATE INDEX idx_monitoring_rules_user_id ON monitoring_rules(user_id);
CREATE INDEX idx_monitoring_rules_active ON monitoring_rules(is_active);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parsed_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
-- 用户只能查看和修改自己的数据
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own content" ON parsed_content
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own monitoring rules" ON monitoring_rules
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage logs" ON usage_logs
    FOR SELECT USING (auth.uid() = user_id);

-- 创建触发器自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parsed_content_updated_at BEFORE UPDATE ON parsed_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monitoring_rules_updated_at BEFORE UPDATE ON monitoring_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.2 TypeScript 类型定义

```typescript
// src/types/database.ts
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          api_usage_count: number;
          api_usage_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          api_usage_count?: number;
          api_usage_limit?: number;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          api_usage_count?: number;
          api_usage_limit?: number;
        };
      };
      parsed_content: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string | null;
          original_content: string | null;
          cleaned_content: string | null;
          summary: string | null;
          key_points: string[] | null;
          metadata: Record<string, any> | null;
          word_count: number | null;
          reading_time: number | null;
          language: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          error_message: string | null;
          tokens_used: number;
          processing_time_ms: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title?: string | null;
          original_content?: string | null;
          cleaned_content?: string | null;
          summary?: string | null;
          key_points?: string[] | null;
          metadata?: Record<string, any> | null;
          word_count?: number | null;
          reading_time?: number | null;
          language?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          tokens_used?: number;
          processing_time_ms?: number | null;
        };
        Update: {
          title?: string | null;
          original_content?: string | null;
          cleaned_content?: string | null;
          summary?: string | null;
          key_points?: string[] | null;
          metadata?: Record<string, any> | null;
          word_count?: number | null;
          reading_time?: number | null;
          language?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          tokens_used?: number;
          processing_time_ms?: number | null;
        };
      };
      monitoring_rules: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          url: string;
          schedule: 'hourly' | 'daily' | 'weekly';
          is_active: boolean;
          last_checked_at: string | null;
          last_content_hash: string | null;
          notification_settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          url: string;
          schedule?: 'hourly' | 'daily' | 'weekly';
          is_active?: boolean;
          last_checked_at?: string | null;
          last_content_hash?: string | null;
          notification_settings?: Record<string, any>;
        };
        Update: {
          name?: string;
          url?: string;
          schedule?: 'hourly' | 'daily' | 'weekly';
          is_active?: boolean;
          last_checked_at?: string | null;
          last_content_hash?: string | null;
          notification_settings?: Record<string, any>;
        };
      };
    };
  };
}

// 便捷类型别名
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type ParsedContent = Database['public']['Tables']['parsed_content']['Row'];
export type MonitoringRule = Database['public']['Tables']['monitoring_rules']['Row'];

// API 相关类型
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ParseURLRequest {
  url: string;
  options?: {
    summary_length?: 'brief' | 'detailed' | 'comprehensive';
    extract_images?: boolean;
    extract_links?: boolean;
    custom_prompt?: string;
  };
}

export interface ParseURLResponse extends ParsedContent {}
```

### 2.3 Supabase 客户端配置

```typescript
// src/lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// 客户端组件使用
export const createClient = () => createClientComponentClient<Database>();

// 服务端组件使用
export const createServerClient = () => 
  createServerComponentClient<Database>({ cookies });

// API 路由使用
export const createServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseServiceKey,
  });
};
```

### 2.4 数据库操作封装

```typescript
// src/lib/database/content.ts
import { createClient } from '@/lib/supabase/client';
import type { Database, ParsedContent, APIResponse } from '@/types/database';

export class ContentService {
  private supabase = createClient();

  async createContent(
    userId: string,
    data: Database['public']['Tables']['parsed_content']['Insert']
  ): Promise<APIResponse<ParsedContent>> {
    try {
      const { data: content, error } = await this.supabase
        .from('parsed_content')
        .insert({ ...data, user_id: userId })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: content };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async updateContent(
    id: string,
    userId: string,
    updates: Database['public']['Tables']['parsed_content']['Update']
  ): Promise<APIResponse<ParsedContent>> {
    try {
      const { data, error } = await this.supabase
        .from('parsed_content')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getUserContent(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: string;
      orderBy?: 'created_at' | 'updated_at';
      orderDirection?: 'asc' | 'desc';
    } = {}
  ): Promise<APIResponse<ParsedContent[]>> {
    try {
      const {
        limit = 10,
        offset = 0,
        status,
        orderBy = 'created_at',
        orderDirection = 'desc'
      } = options;

      let query = this.supabase
        .from('parsed_content')
        .select('*')
        .eq('user_id', userId)
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getContentById(
    id: string,
    userId: string
  ): Promise<APIResponse<ParsedContent>> {
    try {
      const { data, error } = await this.supabase
        .from('parsed_content')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async deleteContent(
    id: string,
    userId: string
  ): Promise<APIResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('parsed_content')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // 获取用户使用统计
  async getUserStats(userId: string): Promise<APIResponse<{
    total_content: number;
    this_month_content: number;
    total_tokens_used: number;
    this_month_tokens: number;
  }>> {
    try {
      // 使用 Supabase 的 RPC 调用或者多个查询
      const { data: totalContent, error: totalError } = await this.supabase
        .from('parsed_content')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

      if (totalError) {
        return { success: false, error: totalError.message };
      }

      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const { data: monthlyContent, error: monthlyError } = await this.supabase
        .from('parsed_content')
        .select('tokens_used')
        .eq('user_id', userId)
        .gte('created_at', thisMonth.toISOString());

      if (monthlyError) {
        return { success: false, error: monthlyError.message };
      }

      const { data: allContent, error: allError } = await this.supabase
        .from('parsed_content')
        .select('tokens_used')
        .eq('user_id', userId);

      if (allError) {
        return { success: false, error: allError.message };
      }

      const stats = {
        total_content: totalContent?.length || 0,
        this_month_content: monthlyContent?.length || 0,
        total_tokens_used: allContent?.reduce((sum, item) => sum + (item.tokens_used || 0), 0) || 0,
        this_month_tokens: monthlyContent?.reduce((sum, item) => sum + (item.tokens_used || 0), 0) || 0,
      };

      return { success: true, data: stats };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const contentService = new ContentService();
```

## 第三阶段：网页爬取服务 (第3周)

### 3.1 爬取服务类型定义

```typescript
// src/types/scraper.ts
export interface ScrapingOptions {
  timeout?: number;
  waitForSelector?: string;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  blockResources?: string[];
  extractImages?: boolean;
  extractLinks?: boolean;
  followRedirects?: boolean;
  maxRedirects?: number;
}

export interface ScrapingResult {
  success: boolean;
  data?: {
    url: string;
    title: string;
    content: string;
    cleanedContent: string;
    metadata: {
      description?: string;
      keywords?: string[];
      author?: string;
      publishDate?: string;
      images: string[];
      links: string[];
      wordCount: number;
      language?: string;
      readingTime: number; // 分钟
    };
    rawHtml?: string;
  };
  error?: string;
  processingTime?: number;
}

export interface ContentCleaner {
  removeAds(html: string): string;
  removeNavigation(html: string): string;
  extractMainContent(html: string): string;
  cleanWhitespace(text: string): string;
}
```

### 3.2 网页爬取核心服务

```typescript
// src/lib/scraper/puppeteer-scraper.ts
import puppeteer, { Browser, Page } from 'puppeteer';
import type { ScrapingOptions, ScrapingResult } from '@/types/scraper';
import { ContentCleaner } from './content-cleaner';

export class PuppeteerScraper {
  private browser: Browser | null = null;
  private contentCleaner = new ContentCleaner();

  async initialize(): Promise<void> {
    if (this.browser) return;

    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async scrape(url: string, options: ScrapingOptions = {}): Promise<ScrapingResult> {
    const startTime = Date.now();

    try {
      await this.initialize();
      
      if (!this.browser) {
        throw new Error('Failed to initialize browser');
      }

      const page = await this.browser.newPage();
      
      try {
        // 配置页面选项
        await this.configurePage(page, options);

        // 访问页面
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: options.timeout || 30000
        });

        // 等待特定选择器（如果指定）
        if (options.waitForSelector) {
          await page.waitForSelector(options.waitForSelector, { timeout: 5000 });
        }

        // 提取页面数据
        const scrapedData = await page.evaluate(() => {
          // 在浏览器上下文中执行的代码
          const title = document.title || '';
          const description = (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content || '';
          const keywords = (document.querySelector('meta[name="keywords"]') as HTMLMetaElement)?.content?.split(',').map(k => k.trim()) || [];
          const author = (document.querySelector('meta[name="author"]') as HTMLMetaElement)?.content || '';
          
          // 尝试提取发布日期
          const publishDateSelectors = [
            'meta[property="article:published_time"]',
            'meta[name="date"]',
            'time[datetime]',
            '.published-date',
            '.publish-date'
          ];
          
          let publishDate = '';
          for (const selector of publishDateSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              publishDate = element.getAttribute('content') || element.getAttribute('datetime') || element.textContent || '';
              if (publishDate) break;
            }
          }

          // 提取主要内容
          const contentSelectors = [
            'article',
            'main',
            '.content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '#content',
            '.main-content'
          ];

          let mainContent = '';
          for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent && element.textContent.length > 100) {
              mainContent = element.textContent;
              break;
            }
          }

          // 如果没有找到主要内容，使用 body
          if (!mainContent) {
            mainContent = document.body.textContent || '';
          }

          // 提取图片
          const images = Array.from(document.querySelectorAll('img'))
            .map(img => img.src)
            .filter(src => src && src.startsWith('http'));

          // 提取链接
          const links = Array.from(document.querySelectorAll('a'))
            .map(link => link.href)
            .filter(href => href && href.startsWith('http'));

          // 语言检测
          const language = document.documentElement.lang || 
                          (document.querySelector('meta[http-equiv="content-language"]') as HTMLMetaElement)?.content || 
                          'en';

          return {
            title,
            content: mainContent,
            rawHtml: document.documentElement.outerHTML,
            metadata: {
              description,
              keywords,
              author,
              publishDate,
              images: [...new Set(images)], // 去重
              links: [...new Set(links)], // 去重
              language,
              url: window.location.href
            }
          };
        });

        // 清理和处理内容
        const cleanedContent = this.contentCleaner.cleanContent(scrapedData.content);
        const wordCount = this.calculateWordCount(cleanedContent);
        const readingTime = this.calculateReadingTime(wordCount);

        const processingTime = Date.now() - startTime;

        return {
          success: true,
          data: {
            url: scrapedData.metadata.url,
            title: scrapedData.title,
            content: scrapedData.content,
            cleanedContent,
            metadata: {
              ...scrapedData.metadata,
              wordCount,
              readingTime
            },
            rawHtml: options.extractImages || options.extractLinks ? scrapedData.rawHtml : undefined
          },
          processingTime
        };

      } finally {
        await page.close();
      }

    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown scraping error',
        processingTime
      };
    }
  }

  private async configurePage(page: Page, options: ScrapingOptions): Promise<void> {
    // 设置用户代理
    if (options.userAgent) {
      await page.setUserAgent(options.userAgent);
    } else {
      await page.setUserAgent('Mozilla/5.0 (compatible; ContentCompass/1.0; +https://contentcompass.dev)');
    }

    // 设置视窗
    if (options.viewport) {
      await page.setViewport(options.viewport);
    } else {
      await page.setViewport({ width: 1280, height: 720 });
    }

    // 阻止不需要的资源加载
    const defaultBlockedResources = ['image', 'font', 'media'];
    const blockedResources = options.blockResources || defaultBlockedResources;

    if (blockedResources.length > 0) {
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const resourceType = request.resourceType();
        if (blockedResources.includes(resourceType)) {
          request.abort();
        } else {
          request.continue();
        }
      });
    }

    // 设置额外的HTTP头
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9,zh;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });
  }

  private calculateWordCount(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private calculateReadingTime(wordCount: number): number {
    // 假设平均阅读速度为 200 词/分钟
    return Math.ceil(wordCount / 200);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
```

### 3.3 内容清理服务

```typescript
// src/lib/scraper/content-cleaner.ts
export class ContentCleaner {
  private readonly AD_PATTERNS = [
    /advertisement/gi,
    /sponsored/gi,
    /\bad\b/gi,
    /promo/gi,
    /banner/gi
  ];

  private readonly NAVIGATION_PATTERNS = [
    /navigation/gi,
    /menu/gi,
    /header/gi,
    /footer/gi,
    /sidebar/gi,
    /breadcrumb/gi
  ];

  cleanContent(rawContent: string): string {
    let cleaned = rawContent;

    // 移除多余的空白字符
    cleaned = this.cleanWhitespace(cleaned);

    // 移除常见的非内容元素
    cleaned = this.removeCommonNoise(cleaned);

    // 移除重复的句子
    cleaned = this.removeDuplicateSentences(cleaned);

    return cleaned.trim();
  }

  private cleanWhitespace(text: string): string {
    return text
      .replace(/\s+/g, ' ') // 多个空白字符替换为单个空格
      .replace(/\n+/g, '\n') // 多个换行符替换为单个换行符
      .replace(/\t+/g, ' ') // 制表符替换为空格
      .trim();
  }

  private removeCommonNoise(text: string): string {
    const noisePatterns = [
      /cookie policy/gi,
      /terms of service/gi,
      /privacy policy/gi,
      /subscribe to our newsletter/gi,
      /follow us on/gi,
      /share this article/gi,
      /related articles/gi,
      /you might also like/gi,
      /read more:/gi,
      /continue reading/gi,
      /comments \(\d+\)/gi,
      /\d+ comments/gi
    ];

    let cleaned = text;
    for (const pattern of noisePatterns) {
      cleaned = cleaned.replace(pattern, '');
    }

    return cleaned;
  }

  private removeDuplicateSentences(text: string): string {
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
    const uniqueSentences = [...new Set(sentences)];
    return uniqueSentences.join('. ') + '.';
  }

  // 检测内容语言
  detectLanguage(text: string): string {
    const sample = text.substring(0, 1000);
    
    // 简单的语言检测逻辑
    const chinesePattern = /[\u4e00-\u9fff]/;
    const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/;
    const koreanPattern = /[\uac00-\ud7af]/;
    
    if (chinesePattern.test(sample)) return 'zh';
    if (japanesePattern.test(sample)) return 'ja';
    if (koreanPattern.test(sample)) return 'ko';
    
    return 'en'; // 默认英语
  }

  // 提取关键信息
  extractKeyInfo(text: string): {
    summary: string;
    keywords: string[];
  } {
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
    
    // 简单的摘要：取前3个最长的句子
    const summary = sentences
      .sort((a, b) => b.length - a.length)
      .slice(0, 3)
      .join('. ') + '.';

    // 简单的关键词提取：查找重复出现的词汇
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordCount: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (!this.isStopWord(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordCount)
      .filter(([_, count]) => count > 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10)
      .map(([word, _]) => word);

    return { summary, keywords };
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
      'before', 'after', 'above', 'below', 'between', 'among', 'this', 'that',
      'these', 'those', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'shall'
    ]);
    
    return stopWords.has(word.toLowerCase());
  }
}
```

### 3.4 爬取服务的使用封装

```typescript
// src/lib/scraper/scraper-service.ts
import { PuppeteerScraper } from './puppeteer-scraper';
import type { ScrapingOptions, ScrapingResult } from '@/types/scraper';

export class ScraperService {
  private scraper = new PuppeteerScraper();
  private rateLimiter = new Map<string, number>();

  async scrapeURL(url: string, options: ScrapingOptions = {}): Promise<ScrapingResult> {
    try {
      // URL 验证
      if (!this.isValidURL(url)) {
        return {
          success: false,
          error: 'Invalid URL format'
        };
      }

      // 速率限制检查
      if (!this.checkRateLimit(url)) {
        return {
          success: false,
          error: 'Rate limit exceeded for this domain'
        };
      }

      // 执行爬取
      const result = await this.scraper.scrape(url, {
        timeout: 30000,
        blockResources: ['image', 'font', 'media'],
        ...options
      });

      return result;

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  private checkRateLimit(url: string): boolean {
    try {
      const domain = new URL(url).hostname;
      const now = Date.now();
      const lastRequest = this.rateLimiter.get(domain) || 0;
      
      // 同一域名至少间隔 2 秒
      if (now - lastRequest < 2000) {
        return false;
      }

      this.rateLimiter.set(domain, now);
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.scraper.close();
  }
}

export const scraperService = new ScraperService();
```

## 第四阶段：AI 摘要服务 (第4周)

### 4.1 OpenAI 服务封装

```typescript
// src/lib/ai/openai-service.ts
import OpenAI from 'openai';
import type { ChatCompletionCreateParams } from 'openai/resources/chat/completions';

export interface SummaryOptions {
  model?: 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo';
  maxTokens?: number;
  temperature?: number;
  summaryType?: 'brief' | 'detailed' | 'bullet-points' | 'key-insights';
  language?: 'en' | 'zh' | 'auto';
  customPrompt?: string;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  wordCount: number;
  tokensUsed: number;
  processingTime: number;
  model: string;
}

export class OpenAIService {
  private client: OpenAI;
  private readonly DEFAULT_MODEL = 'gpt-4o-mini';
  private readonly MAX_CONTENT_LENGTH = 50000; // 约50k字符

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.client = new OpenAI({ apiKey });
  }

  async generateSummary(
    content: string, 
    options: SummaryOptions = {}
  ): Promise<SummaryResult> {
    const startTime = Date.now();

    try {
      // 内容长度检查和截断
      const processedContent = this.preprocessContent(content);
      
      if (processedContent.length < 100) {
        throw new Error('Content too short for meaningful summary');
      }

      const {
        model = this.DEFAULT_MODEL,
        maxTokens = 1000,
        temperature = 0.3,
        summaryType = 'detailed',
        language = 'auto',
        customPrompt
      } = options;

      // 构建提示词
      const systemPrompt = customPrompt || this.buildSystemPrompt(summaryType, language);
      const userPrompt = this.buildUserPrompt(processedContent, language);

      const params: ChatCompletionCreateParams = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      };

      const response = await this.client.chat.completions.create(params);
      
      const summary = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;
      const processingTime = Date.now() - startTime;

      if (!summary) {
        throw new Error('No summary generated');
      }

      // 提取关键点
      const keyPoints = this.extractKeyPoints(summary, summaryType);

      return {
        summary: summary.trim(),
        keyPoints,
        wordCount: this.calculateWordCount(summary),
        tokensUsed,
        processingTime,
        model
      };

    } catch (error) {
      throw new Error(`Summary generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private preprocessContent(content: string): string {
    let processed = content.trim();

    // 移除过多的空白字符
    processed = processed.replace(/\s+/g, ' ');
    
    // 如果内容太长，智能截断
    if (processed.length > this.MAX_CONTENT_LENGTH) {
      // 尝试在句子边界截断
      const truncated = processed.substring(0, this.MAX_CONTENT_LENGTH);
      const lastSentenceEnd = Math.max(
        truncated.lastIndexOf('.'),
        truncated.lastIndexOf('!'),
        truncated.lastIndexOf('?')
      );
      
      if (lastSentenceEnd > this.MAX_CONTENT_LENGTH * 0.8) {
        processed = truncated.substring(0, lastSentenceEnd + 1);
      } else {
        processed = truncated + '...';
      }
    }

    return processed;
  }

  private buildSystemPrompt(summaryType: string, language: string): string {
    const basePrompt = "You are an expert content summarizer. Your task is to create clear, concise, and accurate summaries.";
    
    const typePrompts = {
      brief: "Provide a very concise summary in 2-3 sentences that captures the core message.",
      detailed: "Provide a comprehensive summary that covers all major points while remaining clear and organized.",
      'bullet-points': "Provide a summary in bullet point format, with each point being a key insight or important information.",
      'key-insights': "Focus on extracting the most important insights, trends, or actionable information from the content."
    };

    const languagePrompts = {
      en: "Respond in English.",
      zh: "请用中文回复。",
      auto: "Respond in the same language as the input content."
    };

    return `${basePrompt} ${typePrompts[summaryType as keyof typeof typePrompts] || typePrompts.detailed} ${languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.auto}`;
  }

  private buildUserPrompt(content: string, language: string): string {
    const prompts = {
      en: `Please summarize the following content:\n\n${content}`,
      zh: `请总结以下内容:\n\n${content}`,
      auto: `Please summarize the following content:\n\n${content}`
    };

    return prompts[language as keyof typeof prompts] || prompts.auto;
  }

  private extractKeyPoints(summary: string, summaryType: string): string[] {
    if (summaryType === 'bullet-points') {
      return summary
        .split('\n')
        .filter(line => line.trim().match(/^[•\-\*]\s/) || line.trim().match(/^\d+\./))
        .map(line => line.trim().replace(/^[•\-\*]\s*/, '').replace(/^\d+\.\s*/, ''))
        .filter(point => point.length > 0);
    }

    // 对于其他类型，尝试提取句子作为关键点
    const sentences = summary
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 200);

    return sentences.slice(0, 5); // 最多5个关键点
  }

  private calculateWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // 批量处理多个内容
  async batchGenerateSummaries(
    contents: { id: string; content: string }[],
    options: SummaryOptions = {}
  ): Promise<{ id: string; result: SummaryResult | { error: string } }[]> {
    const results = [];

    for (const { id, content } of contents) {
      try {
        const result = await this.generateSummary(content, options);
        results.push({ id, result });
        
        // 添加延迟避免速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          id,
          result: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
    }

    return results;
  }

  // 估算token数量（粗略估算）
  estimateTokens(text: string): number {
    // 粗略估算：1 token ≈ 4 字符（英文）或 1.5 字符（中文）
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const otherChars = text.length - chineseChars;
    
    return Math.ceil(chineseChars / 1.5 + otherChars / 4);
  }

  // 计算预估成本
  estimateCost(tokens: number, model: string = this.DEFAULT_MODEL): number {
    const pricing = {
      'gpt-4o-mini': { input: 0.00015, output: 0.0006 }, // per 1K tokens
      'gpt-4o': { input: 0.005, output: 0.015 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 }
    };

    const rates = pricing[model as keyof typeof pricing] || pricing['gpt-4o-mini'];
    
    // 假设输入输出比例为 3:1
    const inputTokens = tokens * 0.75;
    const outputTokens = tokens * 0.25;
    
    return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
  }
}

export const openAIService = new OpenAIService();
```

### 4.2 AI 服务管理器

```typescript
// src/lib/ai/ai-service-manager.ts
import { openAIService, type SummaryOptions, type SummaryResult } from './openai-service';

export interface AIProvider {
  name: string;
  generateSummary(content: string, options: SummaryOptions): Promise<SummaryResult>;
  estimateCost(tokens: number): number;
}

export class AIServiceManager {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProvider = 'openai';
  private fallbackProvider = 'openai';

  constructor() {
    // 注册 OpenAI 提供商
    this.providers.set('openai', {
      name: 'OpenAI',
      generateSummary: openAIService.generateSummary.bind(openAIService),
      estimateCost: openAIService.estimateCost.bind(openAIService)
    });
  }

  async generateSummary(
    content: string, 
    options: SummaryOptions & { provider?: string } = {}
  ): Promise<SummaryResult> {
    const { provider = this.defaultProvider, ...aiOptions } = options;
    
    const aiProvider = this.providers.get(provider);
    if (!aiProvider) {
      throw new Error(`AI provider '${provider}' not found`);
    }

    try {
      return await aiProvider.generateSummary(content, aiOptions);
    } catch (error) {
      // 如果主要提供商失败，尝试回退提供商
      if (provider !== this.fallbackProvider) {
        console.warn(`Provider ${provider} failed, trying fallback:`, error);
        const fallbackProvider = this.providers.get(this.fallbackProvider);
        if (fallbackProvider) {
          return await fallbackProvider.generateSummary(content, aiOptions);
        }
      }
      throw error;
    }
  }

  registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  setDefaultProvider(provider: string): void {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider '${provider}' not registered`);
    }
    this.defaultProvider = provider;
  }

  estimateCost(content: string, provider: string = this.defaultProvider): number {
    const aiProvider = this.providers.get(provider);
    if (!aiProvider) {
      throw new Error(`Provider '${provider}' not found`);
    }

    const tokens = openAIService.estimateTokens(content);
    return aiProvider.estimateCost(tokens);
  }
}

export const aiServiceManager = new AIServiceManager();
```

## 第五阶段：API 路由实现 (第5周)

### 5.1 内容解析 API

```typescript
// src/app/api/parse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { scraperService } from '@/lib/scraper/scraper-service';
import { aiServiceManager } from '@/lib/ai/ai-service-manager';
import { contentService } from '@/lib/database/content';
import type { Database, ParseURLRequest, APIResponse, ParsedContent } from '@/types/database';
import { z } from 'zod';

// 请求验证 schema
const parseRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
  options: z.object({
    summary_length: z.enum(['brief', 'detailed', 'comprehensive']).optional(),
    extract_images: z.boolean().optional(),
    extract_links: z.boolean().optional(),
    custom_prompt: z.string().optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as APIResponse,
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
          error: 'Invalid request data',
          details: validationResult.error.errors
        } as APIResponse,
        { status: 400 }
      );
    }

    const { url, options = {} } = validationResult.data;

    // 检查用户使用限制
    const userProfile = await getUserProfile(supabase, user.id);
    if (!userProfile.success || !userProfile.data) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' } as APIResponse,
        { status: 404 }
      );
    }

    const profile = userProfile.data;
    if (profile.api_usage_count >= profile.api_usage_limit) {
      return NextResponse.json(
        { success: false, error: 'API usage limit exceeded' } as APIResponse,
        { status: 429 }
      );
    }

    // 创建初始内容记录
    const initialContent = await contentService.createContent(user.id, {
      url,
      status: 'processing'
    });

    if (!initialContent.success || !initialContent.data) {
      return NextResponse.json(
        { success: false, error: 'Failed to create content record' } as APIResponse,
        { status: 500 }
      );
    }

    const contentId = initialContent.data.id;

    try {
      // 执行网页爬取
      const scrapingResult = await scraperService.scrapeURL(url, {
        extractImages: options.extract_images,
        extractLinks: options.extract_links,
        timeout: 30000
      });

      if (!scrapingResult.success || !scrapingResult.data) {
        await contentService.updateContent(contentId, user.id, {
          status: 'failed',
          error_message: scrapingResult.error || 'Scraping failed'
        });

        return NextResponse.json(
          { success: false, error: scrapingResult.error || 'Failed to scrape content' } as APIResponse,
          { status: 400 }
        );
      }

      const { title, content, cleanedContent, metadata } = scrapingResult.data;

      // 执行 AI 摘要
      const summaryResult = await aiServiceManager.generateSummary(cleanedContent, {
        summaryType: options.summary_length === 'brief' ? 'brief' : 
                    options.summary_length === 'comprehensive' ? 'key-insights' : 'detailed',
        customPrompt: options.custom_prompt
      });

      // 更新内容记录
      const updateResult = await contentService.updateContent(contentId, user.id, {
        title,
        original_content: content,
        cleaned_content: cleanedContent,
        summary: summaryResult.summary,
        key_points: summaryResult.keyPoints,
        metadata: {
          ...metadata,
          processing_time: scrapingResult.processingTime,
          ai_processing_time: summaryResult.processingTime
        },
        word_count: metadata.wordCount,
        reading_time: metadata.readingTime,
        language: metadata.language || 'en',
        status: 'completed',
        tokens_used: summaryResult.tokensUsed,
        processing_time_ms: (scrapingResult.processingTime || 0) + summaryResult.processingTime
      });

      if (!updateResult.success || !updateResult.data) {
        return NextResponse.json(
          { success: false, error: 'Failed to update content' } as APIResponse,
          { status: 500 }
        );
      }

      // 更新用户使用统计
      await updateUserUsage(supabase, user.id, summaryResult.tokensUsed);

      // 记录使用日志
      await logUsage(supabase, user.id, 'parse', contentId, summaryResult.tokensUsed);

      return NextResponse.json({
        success: true,
        data: updateResult.data
      } as APIResponse<ParsedContent>);

    } catch (error) {
      // 处理过程中的错误
      await contentService.updateContent(contentId, user.id, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Processing failed'
      });

      throw error;
    }

  } catch (error) {
    console.error('Parse API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

// 获取用户配置
async function getUserProfile(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// 更新用户使用统计
async function updateUserUsage(supabase: any, userId: string, tokensUsed: number) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        api_usage_count: supabase.raw('api_usage_count + 1')
      })
      .eq('id', userId);

    if (error) {
      console.error('Failed to update user usage:', error);
    }
  } catch (error) {
    console.error('Failed to update user usage:', error);
  }
}

// 记录使用日志
async function logUsage(
  supabase: any, 
  userId: string, 
  actionType: string, 
  resourceId: string, 
  tokensUsed: number
) {
  try {
    const { error } = await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        action_type: actionType,
        resource_id: resourceId,
        tokens_used: tokensUsed,
        success: true
      });

    if (error) {
      console.error('Failed to log usage:', error);
    }
  } catch (error) {
    console.error('Failed to log usage:', error);
  }
}
```

### 5.2 内容管理 API

```typescript
// src/app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { contentService } from '@/lib/database/content';
import type { Database, APIResponse, ParsedContent } from '@/types/database';
import { z } from 'zod';

// 查询参数验证
const querySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  sort: z.enum(['created_at', 'updated_at']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as APIResponse,
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
          error: 'Invalid query parameters',
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
      order = 'desc' 
    } = validationResult.data;

    // 获取用户内容
    const result = await contentService.getUserContent(user.id, {
      limit,
      offset: (page - 1) * limit,
      status,
      orderBy: sort,
      orderDirection: order
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
      pagination: {
        page,
        limit,
        hasMore: result.data!.length === limit
      }
    } as APIResponse<ParsedContent[]>);

  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

// src/app/api/content/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as APIResponse,
        { status: 401 }
      );
    }

    const result = await contentService.getContentById(params.id, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error } as APIResponse,
        { status: result.error === 'Content not found' ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    } as APIResponse<ParsedContent>);

  } catch (error) {
    console.error('Content detail API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      } as APIResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as APIResponse,
        { status: 401 }
      );
    }

    const result = await contentService.deleteContent(params.id, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error } as APIResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    } as APIResponse);

  } catch (error) {
    console.error('Content delete API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      } as APIResponse,
      { status: 500 }
    );
  }
}
```

### 5.3 用户统计 API

```typescript
// src/app/api/user/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { contentService } from '@/lib/database/content';
import type { Database, APIResponse } from '@/types/database';

interface UserStats {
  profile: {
    subscription_tier: string;
    api_usage_count: number;
    api_usage_limit: number;
    usage_percentage: number;
  };
  content: {
    total_content: number;
    this_month_content: number;
    total_tokens_used: number;
    this_month_tokens: number;
  };
  recent_activity: Array<{
    date: string;
    content_count: number;
    tokens_used: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as APIResponse,
        { status: 401 }
      );
    }

    // 获取用户档案
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_tier, api_usage_count, api_usage_limit')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user profile' } as APIResponse,
        { status: 500 }
      );
    }

    // 获取内容统计
    const contentStats = await contentService.getUserStats(user.id);
    if (!contentStats.success) {
      return NextResponse.json(
        { success: false, error: contentStats.error } as APIResponse,
        { status: 500 }
      );
    }

    // 获取最近30天的活动数据
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentActivity, error: activityError } = await supabase
      .from('parsed_content')
      .select('created_at, tokens_used')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (activityError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch activity data' } as APIResponse,
        { status: 500 }
      );
    }

    // 按日期聚合活动数据
    const activityMap = new Map<string, { content_count: number; tokens_used: number }>();
    
    recentActivity?.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      const existing = activityMap.get(date) || { content_count: 0, tokens_used: 0 };
      activityMap.set(date, {
        content_count: existing.content_count + 1,
        tokens_used: existing.tokens_used + (item.tokens_used || 0)
      });
    });

    const recent_activity = Array.from(activityMap.entries()).map(([date, stats]) => ({
      date,
      ...stats
    }));

    const stats: UserStats = {
      profile: {
        ...profile,
        usage_percentage: Math.round((profile.api_usage_count / profile.api_usage_limit) * 100)
      },
      content: contentStats.data!,
      recent_activity
    };

    return NextResponse.json({
      success: true,
      data: stats
    } as APIResponse<UserStats>);

  } catch (error) {
    console.error('User stats API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      } as APIResponse,
      { status: 500 }
    );
  }
}
```

## 项目命名和总结

**项目名称**: **ContentCompass**

**命名含义**:
- **Content**: 核心功能是内容处理和分析
- **Compass**: 寓意在信息海洋中为用户提供方向指引，帮助找到重要信息

**品牌标语**: "Navigate through information, discover what matters"
**中文标语**: "在信息海洋中导航，发现重要价值"

### 下一步行动计划

1. **立即开始** (本周):
   - 使用 Claude Code 执行项目初始化
   - 设置开发环境和基础架构
   - 创建 Supabase 项目并执行数据库脚本

2. **第2周**: 实现认证系统和基础 UI 组件

3. **第3周**: 开发网页爬取和内容清理功能

4. **第4周**: 集成 AI 摘要服务

5. **第5周**: 完成 API 路由和前端集成

6. **第6周**: 测试、优化和部署

这个指南提供了完整的技术实现细节，Claude Code 可以直接使用这些代码和架构进行开发。每个模块都有详细的 TypeScript 实现，包括错误处理、类型安全和最佳实践。