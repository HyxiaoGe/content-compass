# 🤖 自动化爬取系统部署指南

## 🎯 系统概述

ContentCompass 自动化爬取系统采用 **Serverless 架构**，通过以下组件实现：

- **Netlify Functions** - 无服务器函数，执行爬取任务
- **GitHub Actions** - 定时触发爬取任务
- **OpenAI API** - 智能内容分析与处理
- **Supabase** - 数据存储与管理

## 🏗️ 架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  GitHub Actions │───▶│ Netlify Function│───▶│   ProductCrawler│
│   (定时触发)     │    │  (crawl-products)│    │    (核心爬取器)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Supabase     │◀───│ ContentAnalyzer │◀───│   网站爬取      │
│   (数据存储)     │    │   (AI内容分析)   │    │  (获取原始数据)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 部署步骤

### 1. 环境变量配置

在 **Netlify** 中设置以下环境变量：

```bash
# 必需的环境变量
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的Supabase服务角色密钥
OPENAI_API_KEY=你的OpenAI API密钥
```

### 2. GitHub Secrets 配置

在 **GitHub 仓库设置** 中添加以下 Secrets：

```bash
# Netlify相关
NETLIFY_SITE_ID=你的Netlify站点ID
NETLIFY_AUTH_TOKEN=你的Netlify访问令牌

# 可选：通知相关
SLACK_WEBHOOK_URL=Slack通知URL（可选）
EMAIL_SERVICE_KEY=邮件服务密钥（可选）
```

### 3. 获取必要的API密钥

#### 3.1 OpenAI API 密钥
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建新的API密钥
3. 确保账户有足够的余额（建议至少 $10）

#### 3.2 Netlify 访问令牌
1. 登录 [Netlify](https://app.netlify.com/)
2. 访问 User settings → Applications → Personal access tokens
3. 生成新的访问令牌
4. 复制令牌值

#### 3.3 Supabase Service Role 密钥
1. 登录 [Supabase](https://supabase.com/)
2. 进入项目 → Settings → API
3. 复制 `service_role` 密钥（用于服务端操作）

### 4. 部署验证

#### 4.1 手动测试爬取功能
```bash
# 测试单个产品
curl "https://your-site.netlify.app/.netlify/functions/crawl-products?products=openai"

# 测试所有产品
curl "https://your-site.netlify.app/.netlify/functions/crawl-products"
```

#### 4.2 验证GitHub Actions
1. 在GitHub仓库中查看 Actions 标签
2. 确认工作流已正确配置
3. 可以手动触发测试

## ⚙️ 系统配置

### 1. 爬取频率设置

在 `.github/workflows/crawl-products.yml` 中修改：

```yaml
schedule:
  - cron: '0 0 * * *'  # 每天UTC 00:00 (北京时间 08:00)
  - cron: '0 12 * * *' # 每天UTC 12:00 (北京时间 20:00)
```

### 2. 支持的产品列表

当前MVP阶段支持以下产品：

- ✅ **OpenAI** - 官方博客
- ✅ **GitHub Copilot** - Release页面
- ✅ **Cursor** - 官方更新日志
- ✅ **Anthropic Claude** - 官方新闻

### 3. AI分析配置

在 `src/lib/ai/content-analyzer.ts` 中可以调整：

```typescript
model: 'gpt-4o-mini', // 使用成本较低的模型
temperature: 0.3,     // 降低随机性
max_tokens: 1000,     // 限制输出长度
```

## 💰 成本估算

### 月度运行成本预估：

| 服务 | 预估成本 | 说明 |
|------|---------|------|
| OpenAI API | $15-30/月 | 基于每日10-20条更新 |
| Netlify Functions | $0-5/月 | 免费额度通常足够 |
| GitHub Actions | $0 | 公共仓库免费 |
| Supabase | $0 | 免费额度足够 |
| **总计** | **$15-35/月** | 主要成本来自AI分析 |

### 成本优化建议：

1. **使用 gpt-4o-mini** 而非 gpt-4（成本降低90%）
2. **限制分析频率** - 仅处理新内容
3. **设置置信度阈值** - 低质量内容使用降级处理
4. **批量处理** - 减少API调用次数

## 🔧 维护与监控

### 1. 日志查看

**Netlify Functions 日志：**
```bash
# 在Netlify控制台查看
Functions → crawl-products → View logs
```

**GitHub Actions 日志：**
```bash
# 在GitHub仓库查看
Actions → 选择工作流 → 查看执行日志
```

### 2. 错误处理

系统包含多层错误处理：

1. **网络错误** - 自动重试机制
2. **API限制** - 请求间隔控制
3. **数据解析错误** - 降级处理
4. **AI分析失败** - 基于规则的备用分析

### 3. 性能监控

定期检查以下指标：

- **爬取成功率** - 目标 >90%
- **AI分析质量** - 置信度均值 >0.7
- **响应时间** - 单次爬取 <2分钟
- **成本控制** - 月度OpenAI费用

## 🚀 扩展计划

### 阶段2：完整产品支持

计划添加支持：
- **DeepSeek** - 官方更新
- **Midjourney** - Discord公告
- **Gemini** - Google AI博客
- **其他AI产品**

### 阶段3：高级功能

- **RSS订阅支持**
- **内容去重优化**
- **用户自定义通知**
- **数据可视化面板**

## 🐛 常见问题

### Q1: 爬取任务失败怎么办？
**A:** 检查以下项目：
1. 环境变量是否正确设置
2. API密钥是否有效
3. 网络连接是否正常
4. 查看详细错误日志

### Q2: AI分析结果不准确？
**A:** 可以：
1. 调整提示词模板
2. 提高模型version（如用gpt-4）
3. 增加训练样本
4. 手动标注优化

### Q3: 成本过高怎么控制？
**A:** 优化策略：
1. 减少爬取频率
2. 使用更便宜的模型
3. 设置月度预算限制
4. 优化内容过滤

### Q4: 如何添加新产品？
**A:** 需要：
1. 在`ProductCrawler`中添加配置
2. 实现对应的爬取逻辑
3. 测试爬取效果
4. 更新MVP产品列表

## 📞 技术支持

如遇到问题，请：

1. **查看日志** - 先检查详细错误信息
2. **检查配置** - 确认所有环境变量正确
3. **查看文档** - 参考相关技术文档
4. **提交Issue** - 在GitHub仓库中反馈问题

---

**系统状态检查**：
- 🟢 正常运行
- 🟡 部分功能异常
- 🔴 系统故障

最后更新时间：2025-01-09