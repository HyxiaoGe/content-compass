# ContentCompass: AI信息聚合站开发指南

## 项目重新定位

**项目名称**: ContentCompass  
**项目类型**: AI产品更新信息聚合站  
**核心价值**: 自动监控和AI处理AI产品的changelog，为用户提供精炼的信息摘要  
**目标用户**: 关注AI产品动态的开发者、研究者、从业者

## 业务架构设计

### 双层架构模式

**前台 - 信息展示站**：
- 🌐 **公开访问** - 无需登录，所有人可查看
- 📰 **信息聚合展示** - 类似Hacker News的内容卡片布局
- 🔍 **筛选和搜索** - 按产品、时间、重要度筛选
- 📱 **响应式设计** - 支持移动端访问

**后台 - 管理系统**：
- 🔐 **权限控制** - 基于邮箱白名单的管理员系统
- 🌐 **监控源管理** - 添加/管理AI产品的更新页面URL
- ⚡ **内容处理流程** - 手动触发爬取 → AI处理 → 审核发布
- 📊 **统计分析** - 处理记录、成本统计、性能监控

### 用户权限体系

**普通访客**：
- 浏览前台所有已发布内容
- 使用筛选和搜索功能
- 查看原文链接

**注册用户**：
- 所有访客权限
- 个人收藏功能（可选）
- 邮件订阅更新（可选）

**管理员用户**：
- 所有用户权限
- 访问后台管理界面
- 内容处理和发布权限
- 系统配置权限

**权限判断逻辑**：
```typescript
// 管理员邮箱白名单
const ADMIN_EMAILS = [
  'admin@contentcompass.dev',
  'your-email@example.com'
];

function isAdmin(userEmail: string): boolean {
  return ADMIN_EMAILS.includes(userEmail);
}
```

## 核心业务流程

### 管理员工作流程

**1. 添加监控源**
```
管理员登录 → 后台管理 → 添加新监控源
↓
输入信息：
- 产品名称 (如: Cursor)
- 监控URL (如: https://cursor.sh/changelog)
- 更新频率 (daily/weekly)
- 处理模式 (自动/手动)
```

**2. 内容处理流程**
```
检测到更新 → 自动爬取内容 → AI摘要处理
↓
管理员审核 → 编辑调整 → 发布到前台
↓
前台自动展示 → 用户可见
```

**3. 内容管理**
```
后台界面显示：
- 待处理队列
- 已发布内容
- 处理历史
- 错误日志
```

### 前台展示逻辑

**主页布局**：
```
顶部导航：ContentCompass | 筛选器 | 搜索 | 登录
↓
内容卡片列表：
[产品Logo] [标题] [AI摘要] [关键点] [时间] [查看原文]
↓
侧边栏：产品分类 | 最新更新 | 热门标签
↓
底部：关于我们 | 联系方式 | RSS订阅
```

**内容卡片设计**：
```typescript
interface ContentCard {
  id: string;
  product: {
    name: string;      // "Cursor"
    logo: string;      // logo URL
    category: string;  // "Code Editor"
  };
  title: string;       // 原始更新标题
  summary: string;     // AI生成的摘要
  keyPoints: string[]; // AI提取的要点
  importance: 'high' | 'medium' | 'low';
  publishedAt: Date;
  originalUrl: string;
  tags: string[];      // ["feature", "bug-fix", "ui"]
}
```

## 技术实现重点

### 数据库设计简化

**核心表结构**：
```sql
-- 用户表 (简化)
users: id, email, role, created_at

-- 监控源表
monitor_sources: id, name, url, logo, category, schedule, is_active

-- 内容表
content_items: id, source_id, title, summary, key_points, status, published_at

-- 处理日志表  
processing_logs: id, content_id, action, result, tokens_used, created_at
```

**权限控制**：
- 移除复杂的订阅和使用限制
- 简化为admin/user两级权限
- 基于邮箱白名单的管理员判断

### API 路由重构

**前台API** (公开):
```
GET /api/content          # 获取已发布内容列表
GET /api/content/[id]     # 获取具体内容详情  
GET /api/sources          # 获取监控源列表
```

**后台API** (需要管理员权限):
```
POST /api/admin/sources   # 添加监控源
POST /api/admin/process   # 手动处理内容
PUT /api/admin/publish    # 发布内容
GET /api/admin/stats      # 获取统计信息
```

**认证API**:
```
POST /api/auth/login      # 用户登录
GET /api/auth/me          # 获取当前用户信息
POST /api/auth/logout     # 用户登出
```

### 页面结构调整

```
src/app/
├── page.tsx                 # 前台主页 - 信息聚合展示
├── login/page.tsx           # 登录页面
├── admin/                   # 管理后台 (需要权限)
│   ├── page.tsx            # 后台首页/仪表板
│   ├── sources/page.tsx    # 监控源管理
│   ├── content/page.tsx    # 内容管理
│   └── settings/page.tsx   # 系统设置
├── api/
│   ├── content/            # 前台内容API
│   ├── admin/              # 后台管理API
│   └── auth/               # 认证相关API
└── components/
    ├── front/              # 前台组件
    ├── admin/              # 后台组件
    └── common/             # 通用组件
```

## 开发阶段规划

### 第一阶段：基础架构 (1-2周)
- [x] 项目初始化和依赖安装
- [x] 数据库设计和Supabase配置
- [x] 基础TypeScript类型定义
- [ ] 简化用户认证系统
- [ ] 权限中间件实现

### 第二阶段：后台管理系统 (2-3周)  
- [ ] 管理员登录和权限验证
- [ ] 监控源管理界面
- [ ] 内容处理工作流
- [ ] AI摘要集成和测试
- [ ] 发布审核系统

### 第三阶段：前台展示系统 (2-3周)
- [ ] 信息聚合展示页面  
- [ ] 筛选和搜索功能
- [ ] 响应式设计优化
- [ ] 性能优化和SEO

### 第四阶段：优化和部署 (1-2周)
- [ ] 错误处理和日志系统
- [ ] 性能监控和统计
- [ ] 部署到Vercel/云服务
- [ ] 域名配置和SSL

## 监控的AI产品清单

### 优先级产品 (第一批):
- **Cursor** - https://cursor.sh/changelog
- **Claude** - https://docs.anthropic.com/claude/docs
- **OpenAI** - https://platform.openai.com/docs/changelog  
- **Notion** - https://www.notion.so/releases
- **GitHub Copilot** - GitHub Release Notes

### 扩展产品 (后续添加):
- **Vercel** - Platform Updates
- **Linear** - Product Updates  
- **Figma** - What's New
- **Framer** - Release Notes
- **Midjourney** - Update Announcements

## 内容处理标准

### AI摘要要求：
- **简洁性**: 控制在150-300字
- **结构化**: 包含背景、主要更新、影响分析
- **关键点**: 3-5个要点，突出最重要信息
- **可读性**: 避免技术术语，普通用户也能理解

### 内容质量控制：
- 管理员最终审核确保质量
- 重要更新优先处理和展示
- 过滤无关或营销性内容
- 保持信息的时效性和准确性

## 成本控制策略

### LLM使用优化：
- 使用GPT-4o mini降低成本
- 批量处理减少API调用
- 缓存相似内容避免重复处理
- 监控token使用量设置预算警报

### 基础设施成本：
- MVP阶段：Vercel免费层 + Supabase免费层
- 预估月成本：$0-50（主要是OpenAI API）
- 扩展阶段：按需升级付费计划

## 商业化考虑 (长期)

### 可能的收入模式：
- **高级订阅**: 邮件推送、RSS、API访问
- **企业服务**: 私有部署、定制监控
- **广告合作**: 相关AI产品的展示位
- **数据服务**: AI行业趋势报告

### 社区建设：
- Discord/Telegram社群
- 用户反馈和建议收集
- 开源部分组件吸引开发者
- 与AI产品团队建立合作

## 技术债务管理

### 代码质量保证：
- TypeScript严格模式
- ESLint和Prettier配置  
- 单元测试覆盖核心逻辑
- 定期代码审查和重构

### 可维护性设计：
- 模块化架构便于功能扩展
- 配置文件管理监控源
- 错误处理和降级策略
- 文档完善便于后续开发

这个重构后的指南更适合当前的MVP需求，专注于核心功能实现，避免过度工程化，为后续扩展留下灵活性。