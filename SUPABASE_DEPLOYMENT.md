# Supabase + Vercel 部署指南

## 📋 概述

本指南将帮助您：
1. 在 Supabase 创建 PostgreSQL 数据库
2. 配置 Prisma 并迁移数据库
3. 部署到 Vercel 实现一键托管
4. 使用邮箱密码简单注册登录

---

## 第一步：创建 Supabase 项目

### 1.1 注册 Supabase

1. 访问 https://supabase.com
2. 点击 "Start your project" 或 "Sign In"
3. 使用 GitHub 账号登录（推荐）或邮箱注册

### 1.2 创建新项目

1. 点击 "New Project"
2. 填写项目信息：
   ```
   Name: deep-world
   Database Password: [设置一个强密码，请妥善保管]
   Region: [选择离您最近的区域]
   ```
3. 点击 "Create new project"

### 1.3 获取数据库连接字符串

1. 项目创建完成后，进入项目控制台
2. 点击左侧菜单 "Settings" (⚙️图标)
3. 点击 "Database"
4. 找到 "Connection string" 部分
5. 选择 "URI" 标签
6. 复制连接字符串，格式如下：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

**⚠️ 重要**：
- 将 `[YOUR-PASSWORD]` 替换为您设置的数据库密码
- 将 `[PROJECT-REF]` 替换为您的项目 ID

---

## 第二步：配置本地项目

### 2.1 安装依赖

```bash
cd deep-world
npm install
```

### 2.2 创建环境变量文件

```bash
# 复制示例文件
cp .env.example .env.local
```

### 2.3 配置环境变量

编辑 `.env.local` 文件：

```bash
# 数据库配置（从 Supabase 获取）
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT 密钥（生产环境请使用随机生成的安全密钥）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 应用配置
NEXT_PUBLIC_APP_NAME="数字飞升世界"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

**生成安全的 JWT_SECRET**：
```bash
# 在终端运行
openssl rand -base64 32
```

---

## 第三步：初始化数据库

### 3.1 生成 Prisma 客户端

```bash
npx prisma generate
```

### 3.2 创建数据库迁移

```bash
npx prisma migrate dev --name init
```

这个命令会：
- 创建数据库表
- 生成迁移文件
- 自动运行种子数据（状态和性格数据）

### 3.3 验证数据

```bash
# 打开 Prisma Studio 查看数据
npx prisma studio
```

访问 http://localhost:5555，您应该能看到：
- Status 表：8 种状态数据
- Personality 表：5 种性格数据

---

## 第四步：本地测试

### 4.1 启动开发服务器

```bash
npm run dev
```

### 4.2 测试注册功能

1. 访问 http://localhost:3000
2. 点击注册
3. 填写邮箱和密码（无需验证）
4. 注册成功后自动登录

### 4.3 测试创建虚拟形象

1. 登录后进入仪表盘
2. 点击"创建虚拟形象"
3. 填写信息并上传图片
4. 创建成功后可查看

---

## 第五步：部署到 Vercel

### 5.1 准备 GitHub 仓库

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit with Supabase integration"

# 推送到 GitHub
git remote add origin https://github.com/your-username/deep-world.git
git push -u origin main
```

### 5.2 在 Vercel 创建项目

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 导入您的 GitHub 仓库

### 5.3 配置环境变量

在 Vercel 项目设置中，添加以下环境变量：

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=[使用 openssl 生成的安全密钥]
NEXT_PUBLIC_APP_NAME=数字飞升世界
```

**⚠️ 重要**：
- 生产环境的 `DATABASE_URL` 需要添加 `?sslmode=require`
- 示例：
  ```
  DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?sslmode=require"
  ```

### 5.4 部署

1. 点击 "Deploy"
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后，您会获得一个 `https://your-project.vercel.app` 域名

### 5.5 生产环境数据库迁移

```bash
# 安装 Vercel CLI（如果还没有）
npm install -g vercel

# 登录 Vercel
vercel login

# 链接项目
vercel link

# 运行生产迁移
vercel env pull .env.production.local
npx prisma migrate deploy
```

---

## 第六步：配置 Supabase 白名单（可选）

如果您的数据库连接失败，可能需要配置 IP 白名单：

1. 进入 Supabase 控制台
2. Settings → Database
3. 找到 "Connection pooling" 部分
4. 确保 "Allowed IPs" 包含 `0.0.0.0/0`（允许所有 IP）

**⚠️ 安全提示**：
- 生产环境建议限制为 Vercel 的 IP 范围
- 或使用 Supabase 的 Connection Pooling 功能

---

## 第七步：测试生产环境

### 7.1 访问部署的应用

打开浏览器访问：`https://your-project.vercel.app`

### 7.2 测试注册登录

1. 注册新账号
2. 登录
3. 创建虚拟形象
4. 所有功能应该正常工作

### 7.3 查看数据库

在 Supabase 控制台：
1. Table Editor（表格编辑器）
2. 查看 `User`、`Avatar` 等表
3. 确认数据已正确保存

---

## 🔧 常见问题

### Q1: 迁移失败 "Can't reach database server"

**解决方案**：
1. 检查 `DATABASE_URL` 是否正确
2. 确认密码没有特殊字符（需要 URL 编码）
3. 检查 Supabase 项目是否运行正常
4. 添加 `?sslmode=require` 参数

### Q2: 部署后注册失败

**解决方案**：
1. 检查 Vercel 环境变量是否配置
2. 查看 Vercel Functions 日志
3. 确认 `JWT_SECRET` 已设置

### Q3: Cookie 在生产环境不工作

**解决方案**：
1. 确保使用 HTTPS（Vercel 自动提供）
2. 检查 Cookie 的 `secure` 选项
3. 清除浏览器缓存后重试

### Q4: Prisma 生成错误

**解决方案**：
```bash
# 清理并重新生成
rm -rf node_modules/.prisma
npx prisma generate
```

---

## 📊 数据库管理

### 查看数据

```bash
# 使用 Prisma Studio
npx prisma studio
```

### 备份数据

在 Supabase 控制台：
1. 点击 "Database"
2. 选择 "Backups"
3. 启用自动备份（免费计划包含 7 天备份）

### 重置数据库

```bash
# 开发环境
npx prisma migrate reset

# ⚠️ 警告：这会删除所有数据！
```

---

## 🚀 优化建议

### 1. 性能优化

- 启用 Supabase Connection Pooling
- 添加数据库索引（Prisma schema 中已包含）
- 使用 Vercel Edge Functions（可选）

### 2. 安全加固

```bash
# 生成更强的 JWT 密钥
openssl rand -base64 64
```

在 `.env.local` 和 Vercel 中更新 `JWT_SECRET`

### 3. 监控

- 集成 Sentry 错误监控
- 使用 Vercel Analytics
- 配置 Supabase Query Stats

---

## 💰 成本估算

### Supabase 免费计划

- ✅ 500MB 数据库
- ✅ 50,000 月活跃用户
- ✅ 2GB 带宽
- ✅ 社区支持

**适合**：MVP、小型项目、测试

### Supabase Pro 计划

- 💰 $25/月
- ✅ 8GB 数据库
- ✅ 无限月活用户
- ✅ 5GB 文件存储
- ✅ 邮件支持

**适合**：成长期项目

### Vercel 免费计划

- ✅ 100GB 带宽
- ✅ 自动 HTTPS
- ✅ 持续部署
- ✅ 分析功能

**适合**：个人项目、初创公司

---

## 📝 检查清单

### 部署前

- [ ] Supabase 项目创建
- [ ] 数据库连接字符串获取
- [ ] 环境变量配置
- [ ] 本地迁移完成
- [ ] 种子数据初始化
- [ ] 本地测试通过

### 部署后

- [ ] Vercel 环境变量设置
- [ ] 生产迁移执行
- [ ] 注册登录测试
- [ ] 创建虚拟形象测试
- [ ] 数据库数据验证
- [ ] 错误日志检查

---

## 🔗 相关资源

- **Supabase 文档**：https://supabase.com/docs
- **Prisma 文档**：https://www.prisma.io/docs
- **Vercel 文档**：https://vercel.com/docs
- **Next.js 认证**：https://nextjs.org/docs/authentication

---

## 🎯 下一步

完成部署后，您可以：

1. **自定义域名**：在 Vercel 配置自定义域名
2. **邮件通知**：集成 Resend 发送邮件（可选）
3. **文件存储**：使用 Supabase Storage 存储图片
4. **实时功能**：使用 Supabase Realtime 实现实时更新
5. **数据分析**：集成 PostHog 或 Mixpanel

---

**🎉 恭喜！您已成功部署数字飞升世界！**

如有问题，请查看日志或联系技术支持。
