# 🚀 部署检查清单

## ✅ 数据库配置状态

### 已完成的工作

- [x] ✅ 创建 Supabase 项目
- [x] ✅ 获取 DATABASE_URL
- [x] ✅ 修改 prisma/schema.prisma 为 PostgreSQL
- [x] ✅ 配置 .env 文件（含 URL 编码）
- [x] ✅ 创建 SQL 初始化脚本（prisma/init-db.sql）
- [x] ✅ 创建配置指南（SUPABASE_SETUP.md）
- [x] ✅ 生成 Prisma Client

### ⏳ 待完成的工作

#### 1️⃣ **执行 SQL 建表**（必须）

**位置**: Supabase Dashboard → SQL Editor

**步骤**:
1. 登录 https://supabase.com/dashboard
2. 进入你的项目 `deep-world`
3. 点击左侧 **SQL Editor**
4. 新建查询
5. 复制 `prisma/init-db.sql` 的全部内容
6. 粘贴并执行
7. 验证表已创建（Table Editor 中查看）

**预计时间**: 2-3 分钟

---

#### 2️⃣ **测试数据库连接**（推荐）

在项目根目录执行：

```bash
# 创建测试脚本
cat > test-db.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const statuses = await prisma.status.findMany();
    console.log('✅ 数据库连接成功！');
    console.log(`📊 状态记录：${statuses.length} 个`);
    
    const users = await prisma.user.findMany();
    console.log(`👤 用户数：${users.length}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ 连接失败:', error);
    process.exit(1);
  }
}

test();
EOF

# 运行测试
npx tsx test-db.ts
```

**预期输出**:
```
✅ 数据库连接成功！
📊 状态记录：8 个
👤 用户数：0
```

---

#### 3️⃣ **清理本地开发文件**（建议）

删除本地 SQLite 数据库文件（如果存在）：

```bash
# 删除本地 SQLite 数据库
rm -f dev.db
rm -f dev.db-journal
```

---

#### 4️⃣ **准备上传 GitHub**（必须）

**需要确认的文件**:

✅ **应该包含**:
- `app/` - 所有页面和 API 路由
- `lib/` - 工具函数
- `prisma/` - Schema 和迁移文件
- `.env.example` - 环境变量示例
- `.gitignore` - Git 忽略规则
- `package.json` - 依赖配置
- `README.md` - 项目说明
- `SUPABASE_SETUP.md` - 数据库配置指南
- `DEPLOYMENT.md` - 部署指南

❌ **不应该包含**:
- `.env` - 实际环境变量（已在 .gitignore 中）
- `node_modules/` - 依赖包
- `.next/` - 构建产物
- `dev.db` - 本地 SQLite 数据库

**检查命令**:
```bash
# 查看哪些文件会被提交
git status

# 预览添加的文件
git add .
git status
```

---

#### 5️⃣ **上传到 GitHub**（必须）

**方式一：使用 GitHub CLI**（推荐）

```bash
# 安装 GitHub CLI（如果没有）
brew install gh  # macOS
# 或
sudo apt install gh  # Linux

# 认证
gh auth login

# 创建仓库并推送
gh repo create deep-world-frontend --private --source=. --remote=origin --push
```

**方式二：手动操作**

```bash
# 1. 在 GitHub 创建空仓库
# 访问 https://github.com/new
# 仓库名：deep-world-frontend
# 设为私有或公开

# 2. 关联远程仓库
git init
git add .
git commit -m "Initial commit: Deep World with Supabase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/deep-world-frontend.git

# 3. 推送代码
git push -u origin main
```

---

#### 6️⃣ **部署到 Vercel**（必须）

**方式一：使用 Vercel CLI**

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd deep-world
vercel --prod

# 设置环境变量
# 访问 Vercel Dashboard → Project Settings → Environment Variables
# 添加以下变量：
# - DATABASE_URL
# - JWT_SECRET
# - NEXT_PUBLIC_API_URL
```

**方式二：通过 Vercel 网站**

1. 访问 https://vercel.com
2. 点击 **Add New Project**
3. 选择 **Import Git Repository**
4. 选择 `deep-world-frontend`
5. 点击 **Deploy**
6. 部署完成后，在 Settings → Environment Variables 中添加环境变量

---

## 📋 完整检查清单

### 数据库阶段
- [ ] 在 Supabase SQL Editor 执行 `prisma/init-db.sql`
- [ ] 验证所有表已创建（User, Avatar, Status, Personality, PointsLog）
- [ ] 验证预定义数据已插入（8 个状态，5 个性格）
- [ ] （可选）运行测试脚本验证连接

### 本地清理
- [ ] 删除本地 SQLite 数据库文件
- [ ] 确认 `npm run dev` 仍能正常运行
- [ ] 测试注册/登录功能

### GitHub 上传
- [ ] 检查 `.gitignore` 正确配置
- [ ] 执行 `git add .`
- [ ] 执行 `git commit -m "Initial commit"`
- [ ] 在 GitHub 创建仓库
- [ ] 执行 `git push -u origin main`
- [ ] 验证 GitHub 仓库内容正确

### Vercel 部署
- [ ] 在 Vercel 导入 GitHub 仓库
- [ ] 配置环境变量
- [ ] 执行部署
- [ ] 测试线上功能
- [ ] 配置自定义域名（可选）

---

## 🔧 快速命令参考

```bash
# 本地开发
npm run dev              # 启动开发服务器

# 数据库相关
npx prisma generate      # 生成 Prisma Client
npx prisma studio        # 打开数据库可视化界面

# Git 相关
git status               # 查看文件状态
git add .                # 添加所有文件
git commit -m "msg"      # 提交
git push                 # 推送

# 部署相关
vercel                   # 部署到 Vercel
vercel --prod           # 生产环境部署
```

---

## 🎯 当前进度

```
数据库配置 ████████████░░░░░░░░ 60%
├─ ✅ Supabase 项目创建
├─ ✅ 环境变量配置
├─ ✅ Prisma Schema 配置
├─ ⏳ SQL 执行（待完成）
└─ ⏳ 连接测试（待完成）

GitHub 上传 ░░░░░░░░░░░░░░░░░░░░ 0%
└─ ⏳ 等待数据库配置完成后执行

Vercel 部署 ░░░░░░░░░░░░░░░░░░░░ 0%
└─ ⏳ 等待代码上传后执行
```

---

## 💡 下一步行动

### 立即执行（按顺序）

1. **打开 Supabase Dashboard**
   - 网址：https://supabase.com/dashboard
   
2. **执行 SQL 脚本**
   - 复制 `prisma/init-db.sql` 内容
   - 在 SQL Editor 中执行
   
3. **验证结果**
   - 检查表是否创建成功
   - 检查数据是否插入成功

4. **回复我**
   - 告诉我执行结果
   - 我会帮你继续 GitHub 上传和 Vercel 部署

---

## 📞 需要帮助？

如果遇到问题：

1. **SQL 执行失败** → 查看 `SUPABASE_SETUP.md` 故障排查部分
2. **连接问题** → 检查 `.env` 中的 DATABASE_URL 是否正确
3. **其他问题** → 随时问我！

---

**准备好了吗？让我们开始第一步：执行 SQL 脚本！** 🚀
