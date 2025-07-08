# ContentCompass 部署指南

## 概述

本文档详细说明了ContentCompass在不同环境和平台上的部署方式。

## 环境要求

### 基础要求
- Node.js 18.0 或更高版本
- npm 9.0 或更高版本
- Git
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）

### 外部服务
- Supabase项目（PostgreSQL数据库 + 认证）
- OpenAI API账户

## 部署选项

### 1. Vercel 部署（推荐）

Vercel是Next.js的原生部署平台，提供最佳的性能和开发体验。

#### 步骤

1. **准备GitHub仓库**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **导入到Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 选择GitHub仓库
   - 导入项目

3. **配置环境变量**
   在Vercel项目设置中添加以下环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **部署**
   - Vercel自动检测Next.js项目
   - 首次部署通常需要2-3分钟
   - 后续推送自动触发重新部署

#### 自定义域名
```bash
# 在Vercel项目设置中
# 1. 进入 Domains 页面
# 2. 添加自定义域名
# 3. 配置DNS记录（CNAME指向Vercel）
```

### 2. Docker 部署

适合需要容器化部署的环境。

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 构建和运行
```bash
# 构建镜像
docker build -t content-compass .

# 运行容器
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_key \
  -e OPENAI_API_KEY=your_openai_key \
  -e NEXT_PUBLIC_APP_URL=https://your-domain.com \
  content-compass
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=your_url
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
      - SUPABASE_SERVICE_ROLE_KEY=your_service_key
      - OPENAI_API_KEY=your_openai_key
      - NEXT_PUBLIC_APP_URL=https://your-domain.com
    restart: unless-stopped
```

### 3. 传统服务器部署

适合VPS、云服务器等环境。

#### 准备服务器
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2（进程管理器）
sudo npm install -g pm2

# 安装Nginx（反向代理）
sudo apt install nginx
```

#### 部署应用
```bash
# 克隆代码
git clone https://github.com/your-username/content-compass.git
cd content-compass

# 安装依赖
npm install

# 构建项目
npm run build

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Nginx配置
```nginx
# /etc/nginx/sites-available/content-compass
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/content-compass /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL证书（Let's Encrypt）
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. AWS 部署

使用AWS的多种服务进行部署。

#### 4.1 AWS Amplify
```bash
# 安装Amplify CLI
npm install -g @aws-amplify/cli

# 初始化Amplify
amplify init

# 添加托管
amplify add hosting

# 部署
amplify publish
```

#### 4.2 AWS ECS (容器服务)
```yaml
# ecs-task-definition.json
{
  "family": "content-compass",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "content-compass",
      "image": "your-ecr-repo/content-compass:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NEXT_PUBLIC_SUPABASE_URL",
          "value": "your_url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/content-compass",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 5. Google Cloud Platform 部署

#### Cloud Run
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/content-compass', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/content-compass']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'content-compass'
      - '--image'
      - 'gcr.io/$PROJECT_ID/content-compass'
      - '--platform'
      - 'managed'
      - '--region'
      - 'us-central1'
```

```bash
# 部署到Cloud Run
gcloud builds submit --config cloudbuild.yaml
```

## 环境变量管理

### 开发环境
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 生产环境
```bash
# 生产环境变量
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 数据库迁移

### 生产环境迁移
```bash
# 连接到生产数据库
supabase link --project-ref your-project-ref

# 应用迁移
supabase db push

# 验证迁移
supabase db diff
```

### 备份策略
```bash
# 定期备份
pg_dump "postgresql://user:pass@host:port/db" > backup.sql

# 恢复备份
psql "postgresql://user:pass@host:port/db" < backup.sql
```

## 监控和日志

### 应用监控
```typescript
// 集成Sentry错误监控
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### 日志聚合
```bash
# 使用Winston进行结构化日志
npm install winston

# CloudWatch日志（AWS）
npm install aws-sdk
```

### 性能监控
```typescript
// Web Vitals监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## 安全配置

### HTTPS强制
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

### CSP头
```typescript
// 内容安全策略
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`
```

## 故障排除

### 常见部署问题

#### 1. 构建失败
```bash
# 检查Node.js版本
node --version

# 清理缓存
npm cache clean --force
rm -rf node_modules .next
npm install

# 检查内存限制
node --max-old-space-size=4096 node_modules/.bin/next build
```

#### 2. 环境变量问题
```bash
# 验证环境变量
printenv | grep NEXT_PUBLIC

# 运行时检查
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

#### 3. 数据库连接问题
```typescript
// 测试连接
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(url, key)

supabase.from('user_profiles').select('count', { count: 'exact' })
  .then(console.log)
  .catch(console.error)
```

#### 4. OpenAI API问题
```bash
# 测试API密钥
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 性能优化

#### 构建优化
```javascript
// next.config.js
module.exports = {
  experimental: {
    outputStandalone: true, // Docker优化
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['your-domain.com'],
  },
}
```

#### 缓存策略
```typescript
// API路由缓存
export const revalidate = 3600 // 1小时

// 静态资源缓存
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## 维护和更新

### 自动部署
```yaml
# GitHub Actions
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 健康检查
```bash
# 定期健康检查
curl -f https://your-domain.com/api/test?type=health || exit 1
```

### 备份和恢复
```bash
# 自动备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

---

更多部署相关问题，请参考主文档或提交Issue。