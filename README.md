# ContentCompass - 智能网页内容解析平台

<div align="center">

![ContentCompass Logo](https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=CC)

**使用AI技术将任意网页内容转化为结构化摘要的智能解析平台**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 📖 目录

- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [环境配置](#-环境配置)
- [部署指南](#-部署指南)
- [API文档](#-api文档)
- [开发指南](#-开发指南)
- [维护指南](#-维护指南)
- [故障排除](#-故障排除)
- [性能优化](#-性能优化)
- [安全性](#-安全性)
- [扩展功能](#-扩展功能)
- [更新日志](#-更新日志)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

## 🚀 功能特性

### 🔍 智能内容提取
- **先进的网页解析**：自动识别并提取网页核心内容
- **噪音过滤**：智能过滤广告、导航、页脚等无关信息
- **多种网站支持**：新闻、博客、学术论文、技术文档等

### 🤖 AI驱动摘要
- **GPT-4集成**：使用最新的OpenAI GPT-4模型
- **8种摘要类型**：简要、标准、详细、要点、洞察、执行、技术、学术
- **多语言支持**：支持12种语言的输入和输出
- **自定义提示词**：允许用户定制AI处理逻辑

### 📊 数据管理
- **内容存储**：完整的内容管理和版本控制
- **批量处理**：一次性处理多个URL，支持并发
- **多格式导出**：JSON、CSV、Markdown、TXT格式
- **实时统计**：详细的使用分析和性能监控

### 🔐 用户系统
- **认证系统**：邮箱注册/登录 + Google OAuth
- **用户管理**：个人资料、使用配额、订阅管理
- **权限控制**：基于RLS的数据安全保护

### 📱 现代化界面
- **响应式设计**：完美适配移动端和桌面设备
- **实时更新**：WebSocket支持的实时状态更新
- **加载状态**：友好的加载动画和进度指示
- **错误处理**：全面的错误边界和用户友好提示

## 🛠️ 技术栈

### 前端技术
- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript 5.x
- **样式**：Tailwind CSS 3.x
- **UI组件**：Radix UI + 自定义组件库
- **状态管理**：React Hooks + Server State

### 后端技术
- **运行时**：Node.js 18+
- **API路由**：Next.js API Routes
- **数据库**：Supabase (PostgreSQL)
- **认证**：Supabase Auth
- **文件存储**：Supabase Storage

### 第三方服务
- **AI服务**：OpenAI GPT-4o-mini
- **网页爬取**：Puppeteer + 自定义解析器
- **邮件服务**：Supabase (可扩展)
- **监控**：内置监控系统

### 开发工具
- **包管理**：npm
- **代码规范**：ESLint + Prettier
- **类型检查**：TypeScript
- **版本控制**：Git
- **部署**：Vercel (推荐)

## 📁 项目结构

```
content-compass/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/               # API 路由
│   │   │   ├── parse/         # 内容解析API
│   │   │   ├── content/       # 内容管理API
│   │   │   ├── user/          # 用户相关API
│   │   │   ├── docs/          # API文档
│   │   │   ├── test/          # 测试端点
│   │   │   └── monitoring/    # 监控API
│   │   ├── auth/              # 认证页面
│   │   ├── dashboard/         # 仪表板
│   │   ├── content/           # 内容管理页面
│   │   ├── parse/             # 解析页面
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础UI组件
│   │   ├── layout/           # 布局组件
│   │   ├── auth/             # 认证组件
│   │   ├── dashboard/        # 仪表板组件
│   │   ├── content/          # 内容组件
│   │   └── parse/            # 解析组件
│   ├── lib/                  # 核心库文件
│   │   ├── database/         # 数据库操作
│   │   ├── scraper/          # 网页爬取
│   │   ├── ai/               # AI服务
│   │   ├── supabase/         # Supabase客户端
│   │   └── utils.ts          # 工具函数
│   ├── types/                # TypeScript类型定义
│   │   └── database.ts       # 数据库类型
│   └── middleware.ts         # 中间件
├── supabase/                 # Supabase配置
│   ├── migrations/           # 数据库迁移
│   └── config.toml           # Supabase配置
├── public/                   # 静态资源
├── docs/                     # 项目文档
└── package.json              # 项目配置
```

## 🚀 快速开始

### 系统要求
- Node.js 18+ 
- npm 或 yarn
- Git
- 现代浏览器

### 1. 克隆项目
```bash
git clone https://github.com/your-username/content-compass.git
cd content-compass
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
创建 `.env.local` 文件：
```bash
cp .env.example .env.local
```

配置环境变量：
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI 配置
OPENAI_API_KEY=your_openai_api_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. 数据库设置
```bash
# 安装 Supabase CLI (如果未安装)
npm install -g @supabase/cli

# 登录 Supabase
supabase login

# 运行数据库迁移
supabase db push
```

### 5. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 开始使用！

## ⚙️ 环境配置

### 必需环境变量

| 变量名 | 描述 | 获取方式 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase项目URL | Supabase控制台 → 设置 → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名密钥 | Supabase控制台 → 设置 → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase服务密钥 | Supabase控制台 → 设置 → API |
| `OPENAI_API_KEY` | OpenAI API密钥 | OpenAI平台 → API Keys |

### 可选环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_APP_URL` | 应用基础URL | `http://localhost:3000` |
| `NODE_ENV` | 运行环境 | `development` |

### Supabase设置

1. **创建Supabase项目**
   ```bash
   # 访问 https://supabase.com
   # 创建新项目并获取API密钥
   ```

2. **配置认证提供商**
   ```bash
   # Supabase控制台 → 认证 → 提供商
   # 启用Google OAuth（可选）
   ```

3. **设置RLS策略**
   ```sql
   # 数据库已包含完整的RLS策略
   # 运行 supabase db push 自动应用
   ```

### OpenAI设置

1. **获取API密钥**
   ```bash
   # 访问 https://platform.openai.com
   # 创建API密钥并设置使用限制
   ```

2. **配置模型**
   ```typescript
   // src/lib/ai/openai-service.ts
   // 默认使用 gpt-4o-mini，可根据需要调整
   ```

## 🚀 部署指南

### Vercel部署（推荐）

1. **连接GitHub**
   ```bash
   # 推送代码到GitHub仓库
   git push origin main
   ```

2. **导入到Vercel**
   ```bash
   # 访问 https://vercel.com
   # 点击 "New Project" → 导入GitHub仓库
   ```

3. **配置环境变量**
   ```bash
   # 在Vercel项目设置中添加所有环境变量
   # 确保NEXT_PUBLIC_APP_URL设置为你的域名
   ```

4. **部署**
   ```bash
   # Vercel自动部署，通常2-3分钟完成
   ```

### Docker部署

1. **构建镜像**
   ```bash
   docker build -t content-compass .
   ```

2. **运行容器**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your_url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
     -e SUPABASE_SERVICE_ROLE_KEY=your_service_key \
     -e OPENAI_API_KEY=your_openai_key \
     content-compass
   ```

### 传统服务器部署

1. **构建生产版本**
   ```bash
   npm run build
   ```

2. **启动应用**
   ```bash
   npm start
   ```

3. **使用PM2管理**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

## 📚 API文档

### 内置API文档
访问 `/api/docs` 获取完整的API文档，包括：
- 交互式API explorer
- 请求/响应示例
- 认证说明
- 错误代码参考

### 核心API端点

#### 内容解析
```http
POST /api/parse
Content-Type: application/json

{
  "url": "https://example.com/article",
  "options": {
    "summaryType": "standard",
    "language": "auto",
    "maxTokens": 1000
  }
}
```

#### 内容管理
```http
GET /api/content?page=1&limit=10&status=completed
GET /api/content/{id}
PUT /api/content/{id}
DELETE /api/content/{id}
PATCH /api/content/{id} # 重新生成摘要
```

#### 批量操作
```http
POST /api/content/batch
Content-Type: application/json

{
  "action": "parse",
  "urls": ["url1", "url2"],
  "options": {...}
}
```

#### 用户统计
```http
GET /api/user/stats?timeRange=30&detailed=true
```

#### 系统监控
```http
GET /api/status
GET /api/monitoring
GET /api/test?type=health
```

## 🛠️ 开发指南

### 代码结构

#### 组件开发
```typescript
// 基础组件结构
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ComponentProps {
  // 类型定义
}

export function Component({ prop }: ComponentProps) {
  // 组件逻辑
  return (
    // JSX
  )
}
```

#### API路由开发
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import type { APIResponse } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    // API逻辑
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error message' },
      { status: 500 }
    )
  }
}
```

#### 数据库操作
```typescript
// src/lib/database/example.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

export class ExampleService {
  async getData(userId: string) {
    // 数据库操作
  }
}
```

### 本地开发

#### 启动开发环境
```bash
# 开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码格式化
npm run lint
npm run lint:fix
```

#### 数据库操作
```bash
# 查看数据库状态
supabase status

# 重置数据库
supabase db reset

# 生成类型
supabase gen types typescript --local > src/types/database.ts
```

#### 测试
```bash
# 运行测试（如果配置了）
npm test

# 健康检查
curl http://localhost:3000/api/test?type=health
```

### 添加新功能

#### 1. 数据库更改
```sql
-- supabase/migrations/new_feature.sql
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- 其他字段
);
```

#### 2. 类型定义
```typescript
// src/types/database.ts
export interface NewTable {
  id: string
  // 其他字段类型
}
```

#### 3. 服务层
```typescript
// src/lib/database/new-service.ts
export class NewService {
  // 业务逻辑
}
```

#### 4. API路由
```typescript
// src/app/api/new-feature/route.ts
export async function GET() {
  // API实现
}
```

#### 5. 前端组件
```typescript
// src/components/new-feature/component.tsx
export function NewFeatureComponent() {
  // 组件实现
}
```

## 🔧 维护指南

### 日常维护

#### 1. 监控检查
```bash
# 系统状态
curl https://your-domain.com/api/status

# 性能监控
curl https://your-domain.com/api/monitoring

# 健康检查
curl https://your-domain.com/api/test?type=health&detailed=true
```

#### 2. 数据库维护
```sql
-- 查看数据库大小
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::text)) as size
FROM pg_tables 
WHERE schemaname = 'public';

-- 清理旧数据（根据需要）
DELETE FROM parsed_content 
WHERE created_at < NOW() - INTERVAL '90 days' 
AND status = 'failed';
```

#### 3. 日志分析
```bash
# Vercel日志
vercel logs

# 应用错误监控
# 检查 /api/monitoring 端点
```

### 性能优化

#### 1. 数据库优化
```sql
-- 创建索引
CREATE INDEX idx_parsed_content_user_created 
ON parsed_content(user_id, created_at DESC);

CREATE INDEX idx_parsed_content_status 
ON parsed_content(status) WHERE status != 'completed';

-- 分析查询性能
EXPLAIN ANALYZE SELECT * FROM parsed_content 
WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10;
```

#### 2. 缓存策略
```typescript
// 添加Redis缓存（可选）
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// 缓存用户统计
const cacheKey = `user_stats:${userId}`
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached)

// 设置缓存
await redis.setex(cacheKey, 300, JSON.stringify(stats))
```

#### 3. API限流
```typescript
// 实现rate limiting
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

export async function POST(request: NextRequest) {
  const ip = request.ip || 'anonymous'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // 继续处理请求
}
```

### 更新和升级

#### 1. 依赖更新
```bash
# 检查过期依赖
npm outdated

# 更新依赖
npm update

# 主要版本升级
npm install package@latest
```

#### 2. Next.js升级
```bash
# 升级Next.js
npm install next@latest react@latest react-dom@latest

# 检查breaking changes
npx @next/codemod@latest
```

#### 3. 数据库迁移
```bash
# 创建新迁移
supabase migration new migration_name

# 应用迁移
supabase db push

# 回滚迁移（如果需要）
supabase db reset
```

## 🐛 故障排除

### 常见问题

#### 1. 环境变量问题
```bash
# 检查环境变量
echo $NEXT_PUBLIC_SUPABASE_URL
echo $OPENAI_API_KEY

# 验证Supabase连接
npm run test:supabase
```

#### 2. 数据库连接问题
```typescript
// 测试数据库连接
const { data, error } = await supabase
  .from('user_profiles')
  .select('count', { count: 'exact' })
  .limit(1)

if (error) {
  console.error('Database connection failed:', error)
}
```

#### 3. OpenAI API问题
```bash
# 测试OpenAI连接
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 4. 部署问题
```bash
# 检查构建日志
npm run build 2>&1 | tee build.log

# 验证生产构建
npm run start
```

### 错误代码参考

| 错误代码 | 描述 | 解决方案 |
|----------|------|----------|
| 401 | 用户未认证 | 检查认证状态，重新登录 |
| 403 | 权限不足 | 验证用户权限，检查RLS策略 |
| 429 | 请求过多 | 实现率限制，检查API配额 |
| 500 | 服务器错误 | 检查日志，验证环境配置 |

### 日志分析

#### 1. 应用日志
```typescript
// 结构化日志
console.log(JSON.stringify({
  level: 'error',
  message: 'API request failed',
  userId,
  error: error.message,
  timestamp: new Date().toISOString()
}))
```

#### 2. 性能监控
```typescript
// 性能追踪
const startTime = Date.now()
// ... 操作
const duration = Date.now() - startTime
console.log(`Operation took ${duration}ms`)
```

## ⚡ 性能优化

### 前端优化

#### 1. 代码分割
```typescript
// 动态导入
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
```

#### 2. 图片优化
```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // 对于首屏图片
  placeholder="blur" // 模糊占位符
/>
```

#### 3. 缓存策略
```typescript
// API缓存
const response = await fetch('/api/data', {
  next: { revalidate: 60 } // 60秒缓存
})

// 静态生成
export const revalidate = 3600 // 1小时重新验证
```

### 后端优化

#### 1. 数据库查询优化
```sql
-- 使用合适的索引
CREATE INDEX CONCURRENTLY idx_content_user_status 
ON parsed_content(user_id, status, created_at DESC);

-- 查询优化
SELECT id, title, status, created_at 
FROM parsed_content 
WHERE user_id = $1 AND status = 'completed'
ORDER BY created_at DESC 
LIMIT 20;
```

#### 2. API响应优化
```typescript
// 分页查询
const { from, to } = getPaginationRange(page, limit)
const { data, error, count } = await supabase
  .from('parsed_content')
  .select('*', { count: 'exact' })
  .range(from, to)

// 字段选择
const { data } = await supabase
  .from('parsed_content')
  .select('id, title, status, created_at') // 只选择需要的字段
```

#### 3. 并发处理
```typescript
// 批量操作优化
const batchSize = 5
const batches = chunk(urls, batchSize)

for (const batch of batches) {
  await Promise.all(
    batch.map(url => processUrl(url))
  )
}
```

## 🔒 安全性

### 认证和授权

#### 1. RLS策略
```sql
-- 用户只能访问自己的数据
CREATE POLICY "Users can only access their own content" 
ON parsed_content FOR ALL 
USING (auth.uid() = user_id);

-- 管理员可以访问所有数据
CREATE POLICY "Admins can access all content" 
ON parsed_content FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### 2. API安全
```typescript
// 输入验证
import { z } from 'zod'

const schema = z.object({
  url: z.string().url(),
  options: z.object({
    summaryType: z.enum(['brief', 'standard', 'detailed']),
    maxTokens: z.number().min(100).max(4000)
  })
})

const validationResult = schema.safeParse(body)
if (!validationResult.success) {
  return NextResponse.json(
    { error: 'Invalid input' },
    { status: 400 }
  )
}
```

#### 3. 敏感数据保护
```typescript
// 环境变量验证
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY'
]

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})

// API密钥保护
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey || !apiKey.startsWith('sk-')) {
  throw new Error('Invalid OpenAI API key')
}
```

### 数据保护

#### 1. 数据加密
```sql
-- 使用Supabase内置加密
SELECT vault.create_secret('encryption_key', 'your-secret-key');

-- 加密敏感字段（如果需要）
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data text)
RETURNS text AS $$
BEGIN
  RETURN vault.encrypt(data, 'encryption_key');
END;
$$ LANGUAGE plpgsql;
```

#### 2. 审计日志
```typescript
// 记录重要操作
async function auditLog(action: string, userId: string, details: any) {
  await supabase.from('audit_logs').insert({
    action,
    user_id: userId,
    details,
    ip_address: request.ip,
    user_agent: request.headers.get('user-agent'),
    created_at: new Date().toISOString()
  })
}
```

## 🚀 扩展功能

### 添加新的AI提供商

#### 1. 创建服务类
```typescript
// src/lib/ai/anthropic-service.ts
export class AnthropicService {
  async generateSummary(content: string, options: SummaryOptions) {
    // Anthropic API实现
  }
}
```

#### 2. 更新AI管理器
```typescript
// src/lib/ai/ai-service-manager.ts
import { AnthropicService } from './anthropic-service'

export class AIServiceManager {
  private services = {
    openai: new OpenAIService(),
    anthropic: new AnthropicService()
  }

  async generateSummary(content: string, options: SummaryOptions) {
    const service = this.services[options.provider || 'openai']
    return await service.generateSummary(content, options)
  }
}
```

### 添加新的输出格式

#### 1. 扩展导出服务
```typescript
// src/lib/export/export-service.ts
export class ExportService {
  async exportToPDF(content: ParsedContent[]): Promise<Buffer> {
    // PDF生成逻辑
  }

  async exportToWord(content: ParsedContent[]): Promise<Buffer> {
    // Word文档生成逻辑
  }
}
```

#### 2. 更新API
```typescript
// src/app/api/content/export/route.ts
const format = validationResult.data.format

switch (format) {
  case 'pdf':
    return await exportService.exportToPDF(contents)
  case 'word':
    return await exportService.exportToWord(contents)
  // 其他格式
}
```

### 添加实时功能

#### 1. WebSocket支持
```typescript
// src/lib/websocket/socket-manager.ts
export class SocketManager {
  async broadcastUpdate(userId: string, data: any) {
    // 实时更新逻辑
  }
}
```

#### 2. 实时组件
```typescript
// src/components/realtime/live-updates.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function LiveUpdates() {
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('content-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'parsed_content'
      }, (payload) => {
        // 处理实时更新
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <div>Live Updates Component</div>
}
```

## 📝 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始版本发布
- 🚀 基础内容解析功能
- 🔐 用户认证系统
- 📊 仪表板界面
- 🤖 AI摘要生成
- 📱 响应式设计

### 计划功能
- [ ] 多语言界面支持
- [ ] 移动端应用
- [ ] 团队协作功能
- [ ] 高级分析工具
- [ ] API限流和配额管理
- [ ] 企业级集成

## 🤝 贡献指南

### 开发流程

1. **Fork项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建Pull Request**

### 代码规范

- 使用TypeScript进行类型安全
- 遵循ESLint和Prettier配置
- 编写单元测试（如果适用）
- 更新相关文档

### 提交信息格式
```
类型(作用域): 描述

详细说明（可选）

类型: feat, fix, docs, style, refactor, test, chore
作用域: api, ui, auth, database, etc.
```

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Supabase](https://supabase.com/) - 后端即服务
- [OpenAI](https://openai.com/) - AI服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Radix UI](https://www.radix-ui.com/) - UI组件库

## 📞 支持

如果您有任何问题或需要帮助：

- 📧 邮箱：support@contentcompass.com
- 💬 GitHub Issues：[提交问题](https://github.com/your-username/content-compass/issues)
- 📚 文档：[在线文档](https://docs.contentcompass.com)
- 🌐 官网：[ContentCompass](https://contentcompass.com)

---

<div align="center">

**[⬆ 回到顶部](#contentcompass---智能网页内容解析平台)**

Made with ❤️ by the ContentCompass team

</div>
