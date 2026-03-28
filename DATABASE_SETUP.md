# 🚀 数据库初始化完整指南

## ⚠️ 问题说明

创建虚拟形象时报错：`The table 'public.statuses' does not exist`

**原因**：数据库中没有创建 `Status` 和 `Personality` 表，以及缺少初始数据。

---

## 📋 解决方案步骤

### 步骤 1️⃣：获取 Supabase DATABASE_URL

1. 登录 [Supabase](https://supabase.com)
2. 选择您的项目
3. 进入 **Settings** → **Database**
4. 找到 **Connection string** 部分
5. 复制 **URI** 模式的连接字符串

**格式示例**：
```
postgresql://postgres.xxxxxxxxxxxxx@db.xxxxxx.supabase.co:5432/postgres?pgbouncer=true
```

或者使用 **Session Mode**（推荐用于迁移）：
```
postgresql://postgres.xxxxxxxxxxxxx@db.xxxxxx.supabase.co:5432/postgres
```

### 步骤 2️⃣：配置本地环境变量

编辑 `.env.development` 文件：

```bash
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx@db.xxxxxx.supabase.co:5432/postgres"
JWT_SECRET="your-secret-key-change-in-production-12345"
```

**注意**：
- 使用 Session Mode（不带 `?pgbouncer=true`）进行迁移
- 生产环境在 Vercel 部署时使用 Pooler Mode（带 `?pgbouncer=true`）

### 步骤 3️⃣：执行 Prisma 迁移

在项目根目录执行：

```bash
# 1. 生成并应用迁移文件
npx prisma migrate dev --name init_database

# 2. 验证迁移成功
npx prisma db seed
```

**预期输出**：
```
Applying migration `.../migration.sql`
The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260325120000_init_database/
      └─ migration.sql

Your database is now in sync with your schema.

🌱 开始 seeding 数据库...
✅ 状态数据插入完成
✅ 性格数据插入完成
🎉 数据库 seeding 完成！
```

### 步骤 4️⃣：验证数据库表

在 Supabase Dashboard 的 **SQL Editor** 中执行：

```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 查看 Status 表数据
SELECT * FROM statuses ORDER BY id;

-- 查看 Personality 表数据
SELECT * FROM personalities ORDER BY id;
```

**应该看到的表**：
- ✅ `users`
- ✅ `avatars`
- ✅ `statuses`
- ✅ `personalities`
- ✅ `points_logs`

**应该看到的数据**：
- `statuses` 表：10 条状态记录
- `personalities` 表：5 条性格记录

### 步骤 5️⃣：更新 Vercel 环境变量

登录 [Vercel Dashboard](https://vercel.com/dashboard)：

1. 选择您的项目
2. 进入 **Settings** → **Environment Variables**
3. 添加或更新以下变量：

```
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxx@db.xxxxxx.supabase.co:5432/postgres?pgbouncer=true
JWT_SECRET=your-secret-key-change-in-production-12345
```

**重要**：
- Vercel 中使用 **Pooler Mode**（带 `?pgbouncer=true`）
- 点击 **Deploy** 重新部署以应用新环境变量

### 步骤 6️⃣：测试完整流程

1. **访问网站**：https://deep-world-frontend-lt44a2x9f-zmiszm-ctrls-projects.vercel.app
2. **注册账户**：填写邮箱和密码
3. **登录**：使用注册的账户登录
4. **创建虚拟形象**：
   - 点击 "创建虚拟形象"
   - 填写基本信息
   - 上传头像（可选）
   - 点击 "创建虚拟形象" 按钮
5. **验证**：应该成功创建并跳转到 Dashboard

---

## 🔧 故障排查

### 问题 1：Prisma migrate 失败

**错误**：`Can't reach database server at ...`

**解决**：
- 检查 `DATABASE_URL` 是否正确
- 确保 Supabase 项目处于活跃状态
- 尝试使用 Session Mode（去掉 `?pgbouncer=true`）

### 问题 2：Seeding 失败

**错误**：`Unique constraint failed on the fields: id`

**解决**：
```bash
# 重置数据库（谨慎使用！）
npx prisma migrate reset

# 重新 seeding
npx prisma db seed
```

### 问题 3：仍然报错 "statuses 表不存在"

**可能原因**：迁移未正确应用

**解决**：
```bash
# 1. 查看已应用的迁移
npx prisma migrate status

# 2. 如果迁移未应用，手动执行
npx prisma migrate deploy

# 3. 验证表是否存在
npx prisma db pull
```

---

## 📞 需要帮助？

如果遇到问题，请提供以下信息：

1. **完整的错误信息**
2. **当前执行的命令**
3. **DATABASE_URL 格式**（隐藏敏感信息）
4. **Prisma 版本**：`npx prisma -v`
5. **Node.js 版本**：`node -v`

---

## ✅ 验证清单

- [ ] 已获取 Supabase DATABASE_URL
- [ ] 已配置 `.env.development`
- [ ] 已执行 `prisma migrate dev`
- [ ] 已执行 `prisma db seed`
- [ ] 在 Supabase 中看到 5 张表
- [ ] `statuses` 表有 10 条数据
- [ ] `personalities` 表有 5 条数据
- [ ] 已在 Vercel 配置环境变量
- [ ] 已重新部署到 Vercel
- [ ] 可以成功创建虚拟形象

---

**祝你好运！🎉**
