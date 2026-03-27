# 📝 Supabase 数据库配置指南

## ⚠️ 问题说明

Supabase 的 DATABASE_URL 连接字符串格式有特殊要求，直接连接可能遇到问题。我们推荐使用 **SQL Editor 手动执行建表语句** 的方式初始化数据库。

---

## 🔧 方案选择

### ✅ 推荐方案：手动执行 SQL（简单可靠）

**优点**：
- 无需配置复杂的连接字符串
- 可以直观看到创建的表结构
- 避免 Prisma 迁移的兼容性问题

**缺点**：
- 需要手动执行一次 SQL

---

## 📋 操作步骤

### 第一步：在 Supabase 执行 SQL 建表

1. **登录 Supabase 控制台**
   - 网址：https://supabase.com/dashboard

2. **进入你的项目**
   - 找到 `deep-world` 项目

3. **打开 SQL Editor**
   - 点击左侧菜单 **SQL Editor**
   - 点击 **New query**

4. **复制并执行 SQL 脚本**
   - 打开项目中的文件：`prisma/init-db.sql`
   - 复制全部内容
   - 粘贴到 Supabase SQL Editor
   - 点击 **Run** 或按 `Cmd/Ctrl + Enter`

5. **验证执行结果**
   - 应该看到提示：`Success. No rows returned`
   - 如果看到错误，请检查错误信息

6. **查看已创建的表**
   - 点击左侧菜单 **Table Editor**
   - 应该能看到以下表：
     - ✅ User
     - ✅ Avatar
     - ✅ Status
     - ✅ Personality
     - ✅ PointsLog

---

### 第二步：配置 .env 文件

当前 `.env` 文件已配置好正确的 DATABASE_URL：

```bash
# 数据库配置 (Supabase PostgreSQL)
# 使用事务连接池模式（推荐）
DATABASE_URL="postgresql://postgres.x%2Ca9M%23fth37%21.w%2C@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

# JWT 密钥
JWT_SECRET="your-secret-key-change-in-production-12345"

# API URL（部署后修改为实际的 Vercel 域名）
NEXT_PUBLIC_API_URL="https://your-app.vercel.app/api"
```

**注意事项**：
- ✅ 密码中的特殊字符已进行 URL 编码
- ✅ 使用了连接池端口（6543）
- ✅ 启用了 SSL 模式

---

### 第三步：生成 Prisma Client

虽然不能直接用 `prisma migrate`，但可以生成客户端：

```bash
# 在项目根目录执行
cd deep-world

# 重新生成 Prisma Client
npx prisma generate
```

这会输出：
```
✔ Generated Prisma Client (v6.x.x) to ./node_modules/@prisma/client
```

---

### 第四步：测试数据库连接

创建一个简单的测试脚本：

```bash
# 创建测试文件
cat > test-db.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    // 尝试查询状态表
    const statuses = await prisma.status.findMany();
    console.log('✅ 数据库连接成功！');
    console.log(`📊 找到 ${statuses.length} 个状态记录`);
    
    // 尝试查询用户表
    const users = await prisma.user.findMany();
    console.log(`👤 当前有 ${users.length} 个用户`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
}

test();
EOF

# 运行测试
npx tsx test-db.ts
```

如果看到类似输出，说明连接成功：
```
✅ 数据库连接成功！
📊 找到 8 个状态记录
👤 当前有 0 个用户
```

---

## 🔍 故障排查

### 问题 1：SQL 执行失败

**错误示例**：`relation "User" already exists`

**解决方案**：
- 这说明表已经存在，是正常的
- 可以直接跳过或先删除旧表再执行

**删除所有表（谨慎使用）**：
```sql
DROP TABLE IF EXISTS "PointsLog" CASCADE;
DROP TABLE IF EXISTS "Avatar" CASCADE;
DROP TABLE IF EXISTS "Status" CASCADE;
DROP TABLE IF EXISTS "Personality" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
```

### 问题 2：本地测试失败

**错误示例**：`Can't reach database server`

**解决方案**：
1. 检查 `.env` 文件中的 DATABASE_URL 是否正确
2. 确保网络可以访问 Supabase
3. 尝试使用直连模式（非连接池）：
   ```bash
   # 替换为你的实际项目 ID
   DATABASE_URL="postgresql://postgres.[YOUR-PASSWORD]@db.enupilsqydexyleejowa.supabase.co:5432/postgres?sslmode=require"
   ```

### 问题 3：Prisma schema 不同步

如果发现 Prisma schema 和实际数据库不一致：

```bash
# 从数据库拉取最新 schema
npx prisma db pull

# 这会更新 prisma/schema.prisma 文件
```

---

## 📊 数据库表结构

### User（用户表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | UUID 主键 |
| email | TEXT | 邮箱（唯一） |
| password | TEXT | bcrypt 加密密码 |
| nickname | TEXT | 昵称 |
| avatar | TEXT | 头像 URL |
| points | INTEGER | 积分（默认 10） |
| createdAt | TIMESTAMP | 创建时间 |
| updatedAt | TIMESTAMP | 更新时间 |

### Avatar（虚拟形象表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | UUID 主键 |
| userId | TEXT | 关联用户 ID |
| name | TEXT | 名字 |
| type | TEXT | 类型（person/animal/virtual） |
| style | TEXT | 风格（anime/cartoon/realistic/pixel） |
| gender | TEXT | 性别 |
| age | INTEGER | 年龄 |
| imageUrl | TEXT | 图片 URL |
| statusId | TEXT | 关联状态 ID |
| personalityId | TEXT | 关联性格 ID |
| positionX | FLOAT | X 坐标（默认 50） |
| positionY | FLOAT | Y 坐标（默认 50） |

### Status（状态表）
预定义 8 种状态：开心、困倦、兴奋、沉思、放松、专注、饥饿、运动

### Personality（性格表）
预定义 5 种性格：活泼开朗、冷静理智、温柔善良、神秘高冷、幽默风趣

### PointsLog（积分流水表）
记录所有积分变化

---

## 🎯 下一步

数据库配置完成后：

1. ✅ 确认 SQL 执行成功
2. ✅ 确认 `.env` 配置正确
3. ✅ 运行 `npx prisma generate`
4. ✅ 测试本地运行：`npm run dev`
5. ⏭️ 上传代码到 GitHub
6. ⏭️ 部署到 Vercel

---

## 💡 常见问题

**Q: 为什么不直接用 Prisma migrate？**  
A: Supabase 的连接字符串格式特殊，Prisma migrate 可能遇到兼容性问题。手动执行 SQL 更稳定。

**Q: 可以在本地用 SQLite，生产用 PostgreSQL 吗？**  
A: 可以，但需要两套 schema。建议统一使用 PostgreSQL 避免意外。

**Q: 如何备份数据库？**  
A: Supabase 自动备份。也可以手动导出：Settings → Database → Backup & Recovery

**Q: 如何重置数据库？**  
A: 执行上面的 DROP TABLE 语句，然后重新执行 init-db.sql

---

## 🔗 相关资源

- [Supabase SQL Editor 文档](https://supabase.com/docs/guides/database/sql-editor)
- [Prisma 与 Supabase 集成](https://www.prisma.io/docs/guides/database/supabase)
- [PostgreSQL URL 编码](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
