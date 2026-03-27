# 本地开发环境配置指南

## 问题原因

之前注册/登录失败的原因是缺少数据库配置。错误信息：
```
Environment variable not found: DATABASE_URL
```

## 解决方案

### 1. 已创建 `.env` 文件

包含必要的环境变量：
- `DATABASE_URL` - 数据库连接 URL
- `JWT_SECRET` - JWT 令牌密钥

### 2. 数据库配置

**本地开发使用 SQLite**（简单快捷）：
```bash
DATABASE_URL="file:./dev.db"
```

**生产环境使用 PostgreSQL**（如 Supabase）：
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

### 3. 已完成的操作

✅ 创建 `.env` 文件  
✅ 修改 Prisma schema 使用 SQLite  
✅ 生成 Prisma Client  
✅ 推送数据库结构 (`prisma db push`)  
✅ 初始化种子数据 (npm run db:seed)  
✅ 创建测试用户  

## 测试账号

可以使用以下测试账号登录：
- **邮箱**: test@example.com
- **密码**: 123456

或者直接在注册页面创建新账号。

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 查看数据库
npm run db:studio

# 重置数据库（清空所有数据）
rm dev.db && npx prisma db push && npm run db:seed

# 添加新的数据库迁移
npx prisma migrate dev --name your_migration_name

# 重新生成 Prisma Client
npx prisma generate
```

## 文件结构

```
deep-world/
├── .env              # 环境变量（已创建）
├── .env.example      # 环境变量示例（已创建）
├── prisma/
│   ├── schema.prisma # 数据库模型（已修改为 SQLite）
│   └── seed.ts       # 种子数据脚本
├── app/
│   ├── api/auth/
│   │   ├── register/ # 注册 API
│   │   └── login/    # 登录 API
│   ├── register/     # 注册页面
│   └── login-new/    # 登录页面
└── lib/
    ├── db.ts         # 数据库客户端
    └── auth.ts       # 认证工具函数
```

## 技术栈

- **前端**: Next.js 16 + React 19
- **数据库**: Prisma + SQLite (本地) / PostgreSQL (生产)
- **认证**: JWT + HTTP-only Cookie
- **密码加密**: bcryptjs

## 注意事项

1. `.env` 文件不应提交到 Git（已在 `.gitignore` 中）
2. 生产环境请使用强随机 JWT 密钥
3. 生产环境建议使用 PostgreSQL（如 Supabase）
4. 定期备份 SQLite 数据库文件
