# ContentCompass 部署指南

## 🚀 Netlify 部署

### 1. 准备工作

确保你已经完成以下步骤：
- ✅ 数据库schema-v2.sql已在Supabase中执行
- ✅ 测试数据seed-data.sql已添加到数据库
- ✅ 代码已推送到GitHub仓库

### 2. 环境变量配置

在Netlify控制台中设置以下环境变量：

```bash
# 必需的环境变量
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# 可选的环境变量（管理功能）
SUPABASE_SERVICE_ROLE_KEY=你的Supabase服务角色密钥
```

**获取Supabase凭据：**
1. 登录 [Supabase](https://supabase.com) 
2. 进入你的项目 > Settings > API
3. 复制 `URL` 和 `anon public` 密钥

### 3. Netlify部署步骤

**方法1：GitHub自动部署（推荐）**
1. 登录 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择GitHub并授权
4. 选择 `content-compass` 仓库
5. 配置构建设置：
   - Branch: `master`
   - Build command: `npm run build`
   - Publish directory: `.next`
6. 点击 "Deploy site"

**方法2：手动部署**
```bash
# 本地构建
npm run build

# 安装Netlify CLI
npm install -g netlify-cli

# 登录Netlify
netlify login

# 部署到Netlify
netlify deploy --prod --dir=.next
```

### 4. 部署后验证

部署完成后，访问分配的域名验证以下功能：

- ✅ 首页显示AI产品更新卡片
- ✅ 点击卡片能跳转到产品详情页
- ✅ 产品详情页显示完整的更新记录
- ✅ 时间过滤功能正常工作
- ✅ 所有动画效果正常

### 5. 自定义域名（可选）

1. 在Netlify控制台中：Domain settings > Add custom domain
2. 添加你的域名
3. 配置DNS记录指向Netlify
4. 启用HTTPS（自动配置）

### 6. 性能优化建议

**已配置的优化：**
- ✅ 静态生成（SSG）用于产品页面
- ✅ 服务端渲染（SSR）用于首页
- ✅ 图片优化（Next.js Image组件）
- ✅ 代码分割和懒加载
- ✅ CDN缓存优化

**额外优化（可选）：**
- 启用Netlify Analytics
- 配置表单处理
- 设置重定向规则
- 启用Split Testing

## 🔧 构建命令说明

```bash
# 开发环境
npm run dev          # 启动开发服务器

# 生产环境
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 代码检查
npm run lint         # ESLint检查
npm run type-check   # TypeScript检查
```

## 📊 部署状态监控

部署后可以通过以下方式监控：

1. **Netlify控制台**：查看部署日志和状态
2. **Supabase控制台**：监控数据库查询和性能
3. **网站分析**：通过Netlify Analytics或Google Analytics

## 🐛 常见问题

**Q: 部署失败，提示构建错误**
A: 检查环境变量是否正确设置，特别是Supabase相关变量

**Q: 页面显示"数据正在同步中"**
A: 确认数据库中有产品更新记录，可能需要重新执行seed-data.sql

**Q: 产品详情页404错误**
A: 检查netlify.toml中的重定向规则是否正确

**Q: 图片加载失败**
A: 检查next.config.ts中的图片域名配置

## 🔄 CI/CD流程

项目已配置自动化部署流程：

1. **代码推送** → GitHub仓库
2. **自动构建** → Netlify检测到更改
3. **自动部署** → 部署到生产环境
4. **通知** → 部署状态通知

## 📈 后续迭代计划

- [ ] 添加定时数据爬取功能
- [ ] 实现RSS订阅
- [ ] 添加搜索功能
- [ ] 移动端优化
- [ ] PWA支持

---

**支持联系**：如果遇到部署问题，请检查：
1. 环境变量配置
2. 数据库连接状态
3. 构建日志错误信息
4. Netlify部署日志