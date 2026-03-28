# 🚀 Supabase 数据库初始化快速指南

## ⚡ 最快解决方案（推荐）

由于 Prisma 连接池问题，直接使用 SQL 脚本是最快的方法。

---

## 📝 操作步骤

### **步骤 1️⃣：登录 Supabase Dashboard**

访问：https://supabase.com/dashboard

选择您的项目，进入左侧菜单的 **SQL Editor**

---

### **步骤 2️⃣：执行 SQL 脚本**

1. 点击 **New Query** 按钮
2. 复制 `prisma/supabase-init.sql` 文件的全部内容
3. 粘贴到 SQL Editor
4. 点击 **Run** 按钮执行

**预期输出**：
```
✅ 数据库初始化完成！
statuses_count: 10
personalities_count: 5
```

---

### **步骤 3️⃣：验证数据库表**

在 Supabase Dashboard 左侧菜单，进入 **Table Editor**

您应该能看到以下 5 张表：
- ✅ `users` - 用户表
- ✅ `avatars` - 虚拟形象表
- ✅ `statuses` - 状态表（应该有 10 条数据）
- ✅ `personalities` - 性格表（应该有 5 条数据）
- ✅ `points_logs` - 积分流水表

---

### **步骤 4️⃣：配置 Vercel 环境变量**

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目 `deep-world-frontend`
3. 进入 **Settings** → **Environment Variables**
4. 添加或更新以下变量：

```
DATABASE_URL=postgresql://postgres.enupilsqydexyleejowa:x%2Ca9M%23fth37%21.w%2C@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
JWT_SECRET=a8f5e2c9b1d4h7j3k6m0n2p5r8t1v4x7z9
```

**注意**：
- Vercel 中使用 Pooler Mode（带 `?pgbouncer=true`）
- JWT_SECRET 使用强随机字符串

---

### **步骤 5️⃣：重新部署到 Vercel**

1. 进入 Vercel 项目的 **Deployments** 页面
2. 点击 **Redeploy** 最新部署
3. 等待部署完成（约 2-3 分钟）

---

## ✅ 测试流程

部署完成后，访问您的网站进行测试：

1. **访问网站**：https://deep-world-frontend-lt44a2x9f-zmiszm-ctrls-projects.vercel.app
2. **注册账户**：填写邮箱和密码
3. **登录**：使用刚注册的账户登录
4. **创建虚拟形象**：
   - 点击 "创建虚拟形象"
   - 填写基本信息（名称、类型等）
   - 上传头像（可选）
   - 点击 "创建虚拟形象" 按钮
5. **成功标志**：应该成功创建并跳转到 Dashboard

---

## 🔧 故障排查

### 问题 1：SQL 执行失败

**错误**：`relation "users" already exists`

**解决**：说明表已经存在，可以直接跳过此步骤或检查数据是否存在：

```sql
SELECT COUNT(*) FROM statuses;
SELECT COUNT(*) FROM personalities;
```

如果数量分别是 10 和 5，说明数据已存在，无需重复执行。

### 问题 2：仍然无法创建虚拟形象

**可能原因**：
1. DATABASE_URL 未正确配置到 Vercel
2. 使用了错误的连接字符串格式

**验证方法**：
在 Supabase SQL Editor 中执行：
```sql
SELECT * FROM statuses LIMIT 1;
```

如果能返回数据，说明数据库正常，问题可能在 Vercel 配置。

### 问题 3：Vercel 部署失败

查看 Vercel 部署日志，常见错误：
- `Can't reach database server` → DATABASE_URL 格式错误
- `prepared statement already exists` → 需要使用 `?pgbouncer=true`

---

## 📞 需要帮助？

如果遇到问题，请提供以下信息：

1. **Supabase SQL Editor 执行结果截图**
2. **Vercel 部署日志中的完整错误信息**
3. **Table Editor 中看到的表列表截图**

---

## 🎉 成功标志

当您看到以下内容时，说明一切正常：

- ✅ Supabase 中有 5 张表
- ✅ `statuses` 表有 10 条记录
- ✅ `personalities` 表有 5 条记录
- ✅ Vercel 部署成功（绿色勾）
- ✅ 可以成功创建虚拟形象
- ✅ 可以进入大世界页面

---

**祝你好运！🌟**
