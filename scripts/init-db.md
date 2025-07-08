# 数据库初始化指南

## 1. 在 Supabase 控制台中执行以下步骤：

### 步骤 1: 运行主要 Schema
在 Supabase 控制台的 SQL 编辑器中执行 `supabase/schema.sql` 文件的内容。

### 步骤 2: 运行数据库函数
在 Supabase 控制台的 SQL 编辑器中执行 `supabase/functions.sql` 文件的内容。

### 步骤 3: 验证表结构
确认以下表已创建：
- `user_profiles` - 用户配置表
- `parsed_content` - 解析内容表
- `monitoring_rules` - 监控规则表
- `usage_logs` - 使用日志表

### 步骤 4: 验证安全策略
确认所有表的 RLS (Row Level Security) 已启用并且策略已创建。

### 步骤 5: 验证触发器
确认以下触发器已创建：
- `on_auth_user_created` - 自动创建用户配置
- 自动更新 `updated_at` 字段的触发器

## 2. 测试数据库连接

运行以下命令测试数据库连接：

```bash
npm run dev
```

然后访问 `http://localhost:3000/api/health` 查看数据库健康状态。

## 3. 环境变量检查

确保 `.env.local` 文件包含以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
```

## 4. 常见问题排解

### 问题 1: RLS 策略错误
如果遇到 RLS 策略错误，确保：
- 用户已正确认证
- 策略使用 `auth.uid()` 正确匹配用户 ID

### 问题 2: 函数权限错误
如果函数无法执行，确保：
- 函数使用 `SECURITY DEFINER` 标记
- 服务角色密钥配置正确

### 问题 3: 触发器不工作
如果自动创建用户配置失败：
- 检查 `handle_new_user()` 函数是否正确创建
- 验证触发器是否绑定到 `auth.users` 表