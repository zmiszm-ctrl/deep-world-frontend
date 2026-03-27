# 生产环境部署方案

## 📋 目录

1. [技术栈选型](#技术栈选型)
2. [后端服务架构](#后端服务架构)
3. [数据库选型](#数据库选型)
4. [部署方案](#部署方案)
5. [环境变量配置](#环境变量配置)
6. [安全建议](#安全建议)

---

## 🛠️ 技术栈选型

### 推荐方案（全栈开源）

#### 后端框架
- **Next.js API Routes**（轻量级）
  - 优点：与前端同构，开发效率高，免费托管 Vercel
  - 缺点：复杂业务逻辑受限

- **NestJS**（企业级）⭐ **推荐**
  - 优点：TypeScript 优先，模块化架构，易于维护
  - 缺点：需要单独部署

- **Express**（简单灵活）
  - 优点：生态丰富，上手简单
  - 缺点：缺少架构约束

#### 数据库
- **PostgreSQL** ⭐ **推荐**
  - 优点：开源免费，功能强大，支持 JSON 字段
  - 缺点：需要运维

- **MySQL**
  - 优点：普及率高，资料多
  - 缺点：功能相对 PostgreSQL 较少

- **MongoDB**
  - 优点：NoSQL，灵活 schema
  - 缺点：事务支持较弱

#### ORM 工具
- **Prisma** ⭐ **推荐**
  - 优点：类型安全，自动迁移，开发体验好
  - 缺点：冷启动稍慢

- **TypeORM**
  - 优点：成熟稳定，支持多种数据库
  - 缺点：配置复杂

---

## 🏗️ 后端服务架构

### 方案一：Next.js 全栈（快速启动）⭐ **初期推荐**

```
deep-world-frontend/
├── app/                    # 前端页面
├── app/api/               # 后端 API
│   ├── auth/             # 认证相关
│   │   ├── route.ts      # POST /api/auth/login
│   │   └── wechat/       # POST /api/auth/wechat
│   ├── avatars/          # 虚拟形象管理
│   │   ├── route.ts      # GET/POST /api/avatars
│   │   └── [id]/         # GET/PUT/DELETE /api/avatars/:id
│   ├── feed/             # 投喂功能
│   │   └── route.ts      # POST /api/feed
│   └── world/            # 大世界互动
│       └── route.ts      # GET /api/world/avatars
├── lib/
│   ├── db.ts             # 数据库连接
│   ├── prisma.ts         # Prisma 客户端
│   └── auth.ts           # 认证工具
├── prisma/
│   ├── schema.prisma     # 数据模型定义
│   └── migrations/       # 数据库迁移文件
└── .env                  # 环境变量
```

**优点**：
- ✅ 前后端同一仓库，管理方便
- ✅ 类型共享，无需定义两套类型
- ✅ 可部署到 Vercel（免费额度够用）
- ✅ 开发体验最佳

**部署平台**：
- **Vercel**（首选）：https://vercel.com
- **Netlify**：https://netlify.com
- **Railway**：https://railway.app

---

### 方案二：NestJS 独立后端（企业级）⭐ **长期推荐**

#### 项目结构

```
deep-world-backend/
├── src/
│   ├── auth/              # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── strategies/    # Passport 策略
│   ├── avatar/            # 虚拟形象模块
│   │   ├── avatar.controller.ts
│   │   ├── avatar.service.ts
│   │   ├── avatar.module.ts
│   │   └── dto/           # 数据传输对象
│   ├── world/             # 大世界模块
│   ├── feed/              # 投喂模块
│   ├── user/              # 用户模块
│   ├── common/            # 公共模块
│   │   ├── filters/       # 异常过滤器
│   │   ├── guards/        # 守卫
│   │   └── interceptors/  # 拦截器
│   ├── config/            # 配置
│   └── main.ts            # 入口文件
├── prisma/
│   └── schema.prisma
├── test/                  # 测试
├── .env
└── Dockerfile
```

**技术栈**：
```json
{
  "framework": "NestJS",
  "language": "TypeScript",
  "orm": "Prisma",
  "database": "PostgreSQL",
  "auth": "Passport + JWT",
  "cache": "Redis",
  "websocket": "Socket.io"
}
```

**优点**：
- ✅ 架构清晰，易于维护扩展
- ✅ 支持 WebSocket 实时通信
- ✅ 可独立部署和扩展
- ✅ 适合复杂业务逻辑

**部署平台**：
- **Railway**：https://railway.app（推荐，支持 PostgreSQL）
- **Render**：https://render.com
- **AWS EC2**：传统云服务器
- **阿里云 ECS**：国内部署

---

## 🗄️ 数据库选型

### 推荐：PostgreSQL + Prisma

#### 数据模型设计

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String    @id @default(uuid())
  openId         String    @unique  // 微信 OpenID
  unionId        String?   @unique  // 微信 UnionID
  nickname       String?
  avatar         String?
  points         Int       @default(10)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  avatars        Avatar[]
  pointsLogs     PointsLog[]
}

model Avatar {
  id             String    @id @default(uuid())
  userId         String
  user           User      @relation(fields: [userId], references: [id])
  name           String
  type           String    // person|animal|virtual
  style          String    // anime|cartoon|realistic|pixel
  gender         String
  age            Int
  imageUrl       String
  statusId       String
  status         Status    @relation(fields: [statusId], references: [id])
  currentMessage String?
  personalityId  String
  personality    Personality @relation(fields: [personalityId], references: [id])
  positionX      Float     @default(50)
  positionY      Float     @default(50)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([userId])
}

model Status {
  id          String   @id
  name        String
  emoji       String
  description String
  duration    Int
  avatars     Avatar[]
}

model Personality {
  id          String   @id
  name        String
  traits      String   // JSON array
  color       String
  avatars     Avatar[]
}

model PointsLog {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  avatarId  String?
  change    Int
  reason    String
  createdAt DateTime @default(now())

  @@index([userId])
}
```

#### 数据库托管服务

**国内**：
1. **阿里云 RDS PostgreSQL**
   - 价格：约 ¥100/月 起
   - 优势：国内访问快，备案支持

2. **腾讯云 CDB PostgreSQL**
   - 价格：约 ¥90/月 起
   - 优势：微信生态集成

**国际**：
1. **Supabase** ⭐ **推荐（免费）**
   - 免费额度：500MB 数据库，50GB 带宽
   - 网址：https://supabase.com
   - 优势：PostgreSQL + 实时订阅 + 认证

2. **Neon** ⭐ **推荐（免费）**
   - 免费额度：500MB 存储
   - 网址：https://neon.tech
   - 优势：Serverless PostgreSQL，自动休眠

3. **Railway PostgreSQL**
   - 免费额度：$5 额度
   - 网址：https://railway.app
   - 优势：与 Railway 部署无缝集成

---

## 🚀 部署方案

### 方案一：Vercel + Supabase（零成本启动）⭐ **推荐**

```yaml
前端 + 后端：Vercel
数据库：Supabase PostgreSQL
认证：Supabase Auth 或 NextAuth.js
文件存储：Supabase Storage 或 Vercel Blob
```

**步骤**：

1. **创建 Supabase 项目**
   ```bash
   # 访问 https://supabase.com 创建项目
   # 获取 DATABASE_URL
   ```
postgresql://postgres:[YOUR-PASSWORD]@db.enupilsqydexyleejowa.supabase.co:5432/postgres





2. **配置 Prisma**
   ```bash
   npx prisma init
   # 编辑 .env 设置 DATABASE_URL
   npx prisma migrate dev --name init
   npx prisma generate
   ```

3. **部署到 Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

4. **设置环境变量**
   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
   ```

**成本**：$0/月（免费额度内）

---

### 方案二：Railway 全托管（省心）⭐ **推荐**

```yaml
前端：Vercel
后端 + 数据库：Railway
```

**步骤**：

1. **创建 Railway 项目**
   ```bash
   # 访问 https://railway.app
   # 创建 PostgreSQL 数据库
   # 创建 Node.js 服务
   ```

2. **部署后端**
   ```bash
   # 推送代码到 GitHub
   # Railway 自动部署
   ```

3. **配置环境变量**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   PORT=3000
   JWT_SECRET=your-secret
   ```

**成本**：约 $5-10/月

---

### 方案三：传统服务器（可控性强）

```yaml
服务器：阿里云/腾讯云 ECS
数据库：自建 PostgreSQL 或 RDS
反向代理：Nginx
进程管理：PM2
容器化：Docker（可选）
```

**服务器配置推荐**：
- CPU：2 核
- 内存：4GB
- 硬盘：40GB SSD
- 带宽：3-5Mbps

**成本**：约 ¥100-200/月

**部署脚本**：

```bash
# 1. 安装依赖
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
npm install -g pm2

# 2. 安装 PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 3. 配置数据库
sudo -u postgres psql
CREATE DATABASE deep_world;
CREATE USER deep_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE deep_world TO deep_user;

# 4. 部署应用
git clone <your-repo>
cd deep-world-backend
npm install
npx prisma migrate deploy
npx prisma generate

# 5. 启动服务
pm2 start npm --name "deep-world-api" -- start
pm2 save
pm2 startup

# 6. 配置 Nginx
sudo nano /etc/nginx/sites-available/deep-world
```

**Nginx 配置**：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 环境变量配置

### 开发环境 (.env.local)

```bash
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/deep_world"

# 认证
JWT_SECRET="your-development-secret"
NEXTAUTH_SECRET="next-auth-secret"
NEXTAUTH_URL="http://localhost:3000"

# 微信登录（开发测试用）
WECHAT_APP_ID="test-app-id"
WECHAT_APP_SECRET="test-app-secret"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 生产环境 (.env.production)

```bash
# 数据库
DATABASE_URL="postgresql://user:password@host:5432/deep_world?sslmode=require"

# 认证
JWT_SECRET="${JWT_SECRET}"  # 从 Vercel/Railway 环境变量读取
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="https://your-domain.com"

# 微信登录
WECHAT_APP_ID="${WECHAT_APP_ID}"
WECHAT_APP_SECRET="${WECHAT_APP_SECRET}"

# API
NEXT_PUBLIC_API_URL="https://your-domain.com/api"

# 监控（可选）
SENTRY_DSN="${SENTRY_DSN}"
```

---

## 🛡️ 安全建议

### 1. 认证安全

```typescript
// 使用 bcrypt 加密密码
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);

// JWT Token 过期时间
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }  // 7 天过期
);
```

### 2. 数据库安全

```typescript
// 使用参数化查询防止 SQL 注入
// ❌ 错误
const user = await db.user.findFirst({
  where: {
    nickname: req.query.nickname  // 可能被注入
  }
});

// ✅ 正确
const user = await db.user.findFirst({
  where: {
    nickname: String(req.query.nickname)
  }
});
```

### 3. API 限流

```typescript
// 使用 rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 最多 100 次请求
  message: '请求过于频繁，请稍后再试'
});

app.use('/api/', limiter);
```

### 4. CORS 配置

```typescript
// Next.js API Routes
export const config = {
  api: {
    externalCors: {
      origin: ['https://your-domain.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  },
};
```

### 5. 数据验证

```typescript
// 使用 Zod 验证输入
import { z } from 'zod';

const createAvatarSchema = z.object({
  name: z.string().min(2).max(20),
  type: z.enum(['person', 'animal', 'virtual']),
  style: z.enum(['anime', 'cartoon', 'realistic', 'pixel']),
  age: z.number().min(1).max(150),
});

// 在 API 中使用
const result = createAvatarSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ error: 'Invalid input' });
}
```

---

## 📊 监控与日志

### 推荐工具

1. **错误监控**：Sentry
   - 免费额度：5000 错误/月
   - 网址：https://sentry.io

2. **性能监控**：Vercel Analytics
   - 免费，集成在 Vercel 中

3. **日志管理**：
   - Railway Logs（内置）
   - Papertrail：https://papertrailapp.com

---

## 💰 成本估算

### 方案对比

| 方案 | 月成本 | 适合阶段 | 优点 | 缺点 |
|------|--------|----------|------|------|
| Vercel + Supabase | $0 | MVP/初期 | 免费，快速启动 | 有额度限制 |
| Railway 全托管 | $5-10 | 成长期 | 省心，自动扩展 | 依赖单一平台 |
| 传统服务器 | ¥100-200 | 成熟期 | 完全可控 | 需要运维 |

### 推荐路径

1. **启动阶段**：Vercel + Supabase（$0/月）
2. **用户增长**：升级到 Railway（$5-10/月）
3. **规模化**：自建服务器或企业级方案（¥200+/月）

---

## 📝 部署检查清单

### 上线前检查

- [ ] 数据库迁移完成
- [ ] 环境变量配置正确
- [ ] HTTPS 证书配置
- [ ] CORS 策略设置
- [ ] 错误监控集成
- [ ] 备份策略配置
- [ ] 性能测试通过
- [ ] 安全审计完成

### 运维监控

- [ ] 服务器健康检查
- [ ] 数据库备份自动化
- [ ] 日志收集
- [ ] 告警通知设置
- [ ] 性能指标监控

---

## 🔗 相关资源

- **Prisma 文档**：https://www.prisma.io/docs
- **Next.js 部署**：https://nextjs.org/docs/deployment
- **NestJS 文档**：https://docs.nestjs.com
- **Supabase 文档**：https://supabase.com/docs
- **Railway 文档**：https://docs.railway.app

---

## 💡 总结建议

### 快速启动（推荐）
```
前端 + 后端：Next.js API Routes
部署平台：Vercel
数据库：Supabase PostgreSQL
成本：$0/月
时间：1-2 小时部署完成
```

### 长期发展（推荐）
```
前端：Next.js（Vercel）
后端：NestJS（Railway）
数据库：PostgreSQL（Railway）
缓存：Redis（Upstash）
成本：$10-20/月
时间：半天部署完成
```

选择最适合您当前阶段的方案，快速上线验证产品！🚀
