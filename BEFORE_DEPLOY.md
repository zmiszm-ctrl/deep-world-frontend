# 🚀 部署前准备清单

## ⚠️ 重要提示

在开始部署之前，请确保完成以下所有步骤！

---

## 第一步：安装依赖 (必须)

```bash
cd deep-world
npm install
```

**说明**：这会安装所有新增的依赖包（Prisma、bcryptjs、jose 等）

---

## 第二步：创建 Supabase 项目 (必须)

### 2.1 注册账号

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 登录（推荐）或邮箱注册

### 2.2 创建项目

1. 点击 "New Project"
2. 填写：
   ```
   Name: deep-world
   Database Password: [设置密码，请复制保存！]
   Region: [选择最近的区域]
   ```
3. 等待 2-3 分钟项目创建完成

### 2.3 获取数据库连接字符串

1. 进入项目控制台
2. 点击左侧 **Settings** (⚙️) → **Database**
3. 找到 **Connection string** 部分
4. 选择 **URI** 标签
5. 复制连接字符串（格式如下）：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

**⚠️ 注意**：
- 将 `[YOUR-PASSWORD]` 替换为您设置的密码
- 将 `[PROJECT-REF]` 替换为您的项目 ID

---

## 第三步：配置环境变量 (必须)

### 3.1 复制示例文件

```bash
cp .env.example .env.local
```

### 3.2 编辑 .env.local

```bash
# 数据库配置（从 Supabase 获取）
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT 密钥（生产环境请使用随机生成的安全密钥）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 应用配置
NEXT_PUBLIC_APP_NAME="数字飞升世界"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 3.3 生成安全的 JWT_SECRET

```bash
# 在终端运行
openssl rand -base64 32
```

将生成的字符串复制到 `JWT_SECRET`

---

## 第四步：初始化数据库 (必须)

### 4.1 生成 Prisma Client

```bash
npx prisma generate
```

**输出示例**：
```
✔ Generated Prisma Client (v6.0.0) to ./node_modules/@prisma/client
```

### 4.2 创建数据库迁移

```bash
npx prisma migrate dev --name init
```

**这个命令会**：
- ✅ 创建所有数据库表
- ✅ 生成迁移文件
- ✅ 自动运行种子数据（8 种状态 + 5 种性格）

**输出示例**：
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres"

Applying migration `20240325000000_init`

The following migration(s) have been created and applied from new schema changes:
migrations/
  └─ 20240325000000_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.0.0) to ./node_modules/@prisma/client

🌱 开始初始化种子数据...
📊 插入状态数据...
🎭 插入性格数据...
✅ 种子数据初始化完成！
   - 状态：8 个
   - 性格：5 个
```

### 4.3 验证数据（可选）

```bash
# 打开 Prisma Studio 查看数据
npx prisma studio
```

然后访问 http://localhost:5555

---

## 第五步：本地测试 (推荐)

### 5.1 启动开发服务器

```bash
npm run dev
```

### 5.2 测试注册功能

1. 访问 http://localhost:3000/register
2. 填写：
   - 邮箱：test@example.com
   - 密码：123456
   - 确认密码：123456
   - 昵称：测试用户（可选）
3. 点击注册
4. 应该成功注册并跳转到仪表盘

### 5.3 测试创建虚拟形象

1. 点击"创建虚拟形象"
2. 填写信息
3. 上传图片
4. 创建成功

**如果以上测试都通过，说明配置正确！** ✅

---

## 第六步：推送到 GitHub (必须)

### 6.1 初始化 Git（如果还没有）

```bash
git init
git add .
git commit -m "feat: 集成 Supabase 数据库和认证系统"
```

### 6.2 创建 GitHub 仓库

1. 访问 https://github.com
2. 点击 "New repository"
3. 填写仓库名：deep-world
4. 点击 "Create repository"

### 6.3 推送代码

```bash
git remote add origin https://github.com/YOUR_USERNAME/deep-world.git
git push -u origin main
```

**⚠️ 注意**：
- `.env.local` 文件不会被推送（已在 .gitignore 中）
- 这是正确的做法，永远不要将敏感信息上传到 GitHub

---

## 第七步：部署到 Vercel (必须)

### 7.1 在 Vercel 创建项目

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择您的 GitHub 仓库
5. 点击 "Import"

### 7.2 配置环境变量

在 Vercel 项目设置中，添加以下环境变量：

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?sslmode=require
JWT_SECRET=[使用 openssl 生成的安全密钥]
NEXT_PUBLIC_APP_NAME=数字飞升世界
```

**⚠️ 重要**：
- 生产环境必须添加 `?sslmode=require`
- JWT_SECRET 使用强随机密钥

### 7.3 部署

1. 点击 "Deploy"
2. 等待 2-3 分钟
3. 部署成功后会显示预览链接

### 7.4 执行生产迁移

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 拉取生产环境变量
vercel env pull .env.production.local

# 执行生产迁移
npx prisma migrate deploy
```

---

## 第八步：验证生产环境 (必须)

### 8.1 访问部署的应用

打开浏览器访问：`https://your-project.vercel.app`

### 8.2 测试注册登录

1. 注册新账号
2. 登录
3. 创建虚拟形象
4. 所有功能应该正常工作

### 8.3 查看数据库

在 Supabase 控制台：
1. 点击 **Table Editor**
2. 查看 `User`、`Avatar` 等表
3. 确认数据已正确保存

---

## ✅ 完成检查清单

### 本地环境

- [ ] 依赖安装完成
- [ ] Supabase 项目创建
- [ ] 数据库连接字符串获取
- [ ] .env.local 配置完成
- [ ] JWT_SECRET 生成
- [ ] Prisma generate 成功
- [ ] 数据库迁移成功
- [ ] 种子数据初始化
- [ ] 本地测试通过
- [ ] 代码推送到 GitHub

### 生产环境

- [ ] Vercel 项目创建
- [ ] 环境变量配置
- [ ] 部署成功
- [ ] 生产迁移执行
- [ ] 注册登录测试通过
- [ ] 创建虚拟形象测试通过
- [ ] 数据库数据验证

---

## 🐛 常见问题

### Q1: npm install 失败

**解决方案**：
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### Q2: Prisma migrate 失败

**解决方案**：
```bash
# 重置数据库（仅开发环境！）
npx prisma migrate reset

# 重新迁移
npx prisma migrate dev
```

### Q3: 数据库连接失败

**检查清单**：
1. DATABASE_URL 是否正确
2. 密码是否 URL 编码（特殊字符）
3. 是否添加 `?sslmode=require`
4. Supabase 项目是否运行正常

### Q4: 部署后注册失败

**解决方案**：
1. 检查 Vercel 环境变量
2. 查看 Vercel Functions 日志
3. 确认 JWT_SECRET 已设置

---

## 📞 获取帮助

如果遇到问题：

1. **查看日志**：
   ```bash
   # 开发环境
   npm run dev
   
   # 生产环境（Vercel）
   vercel logs
   ```

2. **查看文档**：
   - `QUICK_START.md` - 快速开始
   - `SUPABASE_DEPLOYMENT.md` - 部署详解
   - `SUPABASE_INTEGRATION_SUMMARY.md` - 集成总结

3. **Supabase 控制台**：
   - 查看数据库连接
   - 查看查询日志

---

## 💡 提示

### 安全建议

1. **永远不要**将 `.env.local` 上传到 GitHub
2. **永远不要**在代码中硬编码密码或密钥
3. **一定要**使用强随机 JWT_SECRET
4. **一定要**在生产环境使用 HTTPS

### 性能优化

1. 启用 Supabase Connection Pooling
2. 使用 Vercel Edge Functions
3. 配置 CDN 缓存

### 监控建议

1. 集成 Sentry 错误监控
2. 使用 Vercel Analytics
3. 配置数据库告警

---

## 🎉 下一步

完成部署后，您可以：

1. **自定义域名** - 在 Vercel 配置
2. **邮件通知** - 集成 Resend
3. **文件存储** - Supabase Storage
4. **实时更新** - Supabase Realtime
5. **第三方登录** - 微信/GitHub

---

**🎊 恭喜！您已完成所有准备工作！**

**现在可以开始部署了！** 🚀
