# 🚀 快速开始指南

## 概述

本项目已集成 **Supabase PostgreSQL** 数据库和完整的认证系统，支持：
- ✅ 邮箱密码注册登录
- ✅ JWT Token 认证
- ✅ Prisma ORM
- ✅ Vercel 一键部署

---

## 📦 第一步：安装依赖

```bash
cd deep-world
npm install
```

这会自动安装：
- `@prisma/client` - 数据库客户端
- `prisma` - 数据库工具
- `bcryptjs` - 密码加密
- `jose` - JWT 认证

---

## 🗄️ 第二步：配置 Supabase 数据库

### 2.1 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 填写信息：
   - **Name**: deep-world
   - **Database Password**: [设置密码，请妥善保管]
   - **Region**: 选择最近的区域
4. 点击 "Create new project"

### 2.2 获取数据库连接字符串

1. 进入项目控制台
2. 点击 **Settings** (⚙️) → **Database**
3. 找到 **Connection string** 部分
4. 复制 **URI** 标签下的连接字符串

格式如下：
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2.3 创建环境变量文件

```bash
# 复制示例文件
cp .env.example .env.local
```

### 2.4 配置 .env.local

```bash
# 数据库配置（替换为您的 Supabase 连接字符串）
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT 密钥（生成安全密钥）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 应用配置
NEXT_PUBLIC_APP_NAME="数字飞升世界"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

**生成安全的 JWT_SECRET**：
```bash
openssl rand -base64 32
```

---

## 🔧 第三步：初始化数据库

### 3.1 生成 Prisma Client

```bash
npx prisma generate
```

### 3.2 创建数据库迁移

```bash
npx prisma migrate dev --name init
```

这个命令会：
- ✅ 创建所有数据库表（User, Avatar, Status, Personality, PointsLog）
- ✅ 生成迁移文件
- ✅ 自动运行种子数据（8 种状态 + 5 种性格）

### 3.3 验证数据

```bash
# 打开 Prisma Studio 查看数据
npx prisma studio
```

访问 http://localhost:5555，您应该能看到：
- **Status** 表：8 种状态（开心、困倦、兴奋等）
- **Personality** 表：5 种性格（活泼开朗、冷静理智等）

---

## 🧪 第四步：本地测试

### 4.1 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4.2 测试注册功能

1. 访问 http://localhost:3000/register
2. 填写邮箱和密码（无需验证）
3. 点击注册
4. 注册成功后自动登录并跳转到仪表盘

### 4.3 测试创建虚拟形象

1. 登录后进入仪表盘
2. 点击"创建虚拟形象"
3. 填写信息并上传图片
4. 创建成功后可在大世界页面查看

---

## 🚀 第五步：部署到 Vercel

### 5.1 推送到 GitHub

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "feat: 集成 Supabase 数据库和认证系统"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/your-username/deep-world.git
git push -u origin main
```

### 5.2 在 Vercel 部署

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 导入您的 GitHub 仓库

### 5.3 配置环境变量

在 Vercel 项目设置中添加：

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="[使用 openssl 生成的安全密钥]"
NEXT_PUBLIC_APP_NAME="数字飞升世界"
```

**⚠️ 重要**：
- 生产环境必须添加 `?sslmode=require`
- JWT_SECRET 使用强随机密钥

### 5.4 执行生产迁移

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录并链接项目
vercel login
vercel link

# 拉取生产环境变量
vercel env pull .env.production.local

# 执行生产迁移
npx prisma migrate deploy
```

### 5.5 完成部署

访问您的 Vercel 域名：`https://your-project.vercel.app`

---

## 📊 数据库管理

### 查看和管理数据

```bash
# 使用 Prisma Studio（图形化界面）
npx prisma studio
```

### 添加新数据

在 Supabase 控制台：
1. 点击 **Table Editor**
2. 选择对应表（如 Status、Personality）
3. 点击 **Insert** 添加新数据

### 备份数据

在 Supabase 控制台：
1. **Settings** → **Database** → **Backups**
2. 启用自动备份（免费计划包含 7 天）

---

## 🔐 安全建议

### 1. 生产环境配置

```bash
# 使用强随机密钥
openssl rand -base64 64

# 在 Vercel 设置严格的安全策略
SECURE_COOKIES=true
ALLOWED_ORIGINS=https://your-domain.com
```

### 2. 数据库安全

- ✅ 已配置 SSL 连接
- ✅ 使用参数化查询防止 SQL 注入
- ✅ 密码使用 bcrypt 加密

### 3. API 保护

所有 API 路由都已实现：
- ✅ JWT Token 验证
- ✅ HTTP-only Cookie
- ✅ CORS 策略

---

## 🛠️ 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 数据库
npm run db:migrate       # 创建新迁移
npm run db:seed          # 运行种子数据
npm run db:studio        # 打开 Prisma Studio
npm run db:push          # 推送 schema 到数据库

# 生产
npm run db:migrate:prod  # 生产环境迁移
```

---

## 📁 项目结构

```
deep-world/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/     # 注册 API
│   │   │   ├── login/        # 登录 API
│   │   │   ├── me/           # 获取当前用户
│   │   │   └── logout/       # 登出 API
│   │   └── avatars/          # 虚拟形象管理 API
│   ├── register/             # 注册页面
│   ├── login-new/            # 登录页面
│   └── ...
├── lib/
│   ├── db.ts                 # 数据库连接
│   └── auth.ts               # 认证工具
├── prisma/
│   ├── schema.prisma         # 数据模型定义
│   ├── seed.ts               # 种子数据
│   └── migrations/           # 数据库迁移文件
└── .env.local                # 环境变量
```

---

## 🎯 功能清单

### ✅ 已实现

- [x] 用户注册（邮箱 + 密码）
- [x] 用户登录
- [x] JWT Token 认证
- [x] 密码加密存储
- [x] 数据库集成（PostgreSQL）
- [x] Prisma ORM
- [x] 虚拟形象 CRUD
- [x] 状态和性格系统
- [x] 积分系统
- [x] 投喂功能
- [x] 大世界互动

### 🚧 可选增强

- [ ] 邮箱验证（使用 Resend）
- [ ] 密码重置
- [ ] 第三方登录（微信、GitHub）
- [ ] 图片存储（Supabase Storage）
- [ ] 实时更新（Supabase Realtime）

---

## 🐛 常见问题

### Q1: "Can't reach database server"

**解决方案**：
1. 检查 `DATABASE_URL` 是否正确
2. 确认密码已 URL 编码（如有特殊字符）
3. 添加 `?sslmode=require` 参数

### Q2: Prisma 生成错误

```bash
# 清理并重新生成
rm -rf node_modules/.prisma
npx prisma generate
```

### Q3: 迁移失败

```bash
# 重置数据库（开发环境）
npx prisma migrate reset

# 重新迁移
npx prisma migrate dev
```

### Q4: Cookie 不工作

- 清除浏览器缓存
- 检查是否使用 HTTPS（生产环境必须）
- 确认 `JWT_SECRET` 一致

---

## 📚 学习资源

- **Prisma 文档**: https://www.prisma.io/docs
- **Supabase 文档**: https://supabase.com/docs
- **Next.js 认证**: https://nextjs.org/docs/authentication
- **Vercel 部署**: https://vercel.com/docs

---

## 💡 下一步

完成部署后，您可以：

1. **自定义域名** - 在 Vercel 配置
2. **错误监控** - 集成 Sentry
3. **性能分析** - 使用 Vercel Analytics
4. **邮件通知** - 集成 Resend
5. **文件存储** - 使用 Supabase Storage

---

**🎉 恭喜！您已完成配置！**

开始享受开发的乐趣吧！✨
