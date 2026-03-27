# 🚀 Vercel 部署完整指南

## ✅ 前置条件

- ✅ GitHub 仓库已创建：https://github.com/zmiszm-ctrl/deep-world-frontend
- ✅ Supabase 数据库已配置
- ✅ 代码已上传完成

---

## 📋 部署方案（二选一）

### 🎯 方案 A：Vercel Dashboard（推荐，简单直观）

#### Step 1: 登录 Vercel 并导入项目

1. **访问 Vercel**
   ```
   https://vercel.com/new
   ```

2. **使用 GitHub 账号登录**
   - 点击 **"Continue with GitHub"**
   - 授权 Vercel 访问你的 GitHub 账号

3. **导入 Git Repository**
   - 找到 **"Import Git Repository"** 部分
   - 搜索 `deep-world-frontend`
   - 你会看到 `zmiszm-ctrl/deep-world-frontend`
   - 点击 **"Import"**

---

#### Step 2: 配置项目设置

在 **"Configure Project"** 页面：

1. **Project Name**（可选修改）
   ```
   deep-world-frontend
   ```

2. **Framework Preset**
   - 应该自动识别为：**Next.js**
   - 如果不是，手动选择 Next.js

3. **Root Directory**
   - 如果代码在 `deep-world` 子目录中：
     - 点击 **"Edit"**
     - 输入：`deep-world`
   - 如果代码直接在根目录：
     - 保持默认（留空）

4. **Build and Output Settings**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **Environment Variables**（先跳过，稍后配置）

6. **点击 "Deploy"**
   - 等待 2-3 分钟
   - 会显示部署进度和日志

---

#### Step 3: 查看部署结果

部署完成后，你会看到：

✅ **Congratulations!**
- 🎉 Your deployment is live!
- 🌐 会显示访问 URL，例如：
  ```
  https://deep-world-frontend-xxx.vercel.app
  ```

**点击链接访问你的应用！**

---

#### Step 4: 配置环境变量（非常重要！）

⚠️ **必须配置，否则无法连接数据库！**

1. **进入项目设置**
   - 在 Vercel Dashboard 点击你的项目
   - 点击顶部 **"Settings"** 标签
   - 点击左侧 **"Environment Variables"**

2. **添加环境变量**

   点击 **"Add New"**，依次添加以下变量：

   **① DATABASE_URL**
   ```bash
   Key: DATABASE_URL
   Value: postgresql://postgres.x%2Ca9M%23fth37%21.w%2C@db.enupilsqydexyleejowa.supabase.co:5432/postgres?sslmode=require
   
   Environments: 
   ☑ Production
   ☑ Preview
   ☐ Development
   ```

   **② JWT_SECRET**
   ```bash
   Key: JWT_SECRET
   Value: [生成一个随机字符串，至少 32 位]
   示例：a8f5e2c9b1d4h7j3k6m0n2p5r8t1v4x7z9
   
   Environments:
   ☑ Production
   ☑ Preview
   ☐ Development
   ```

   **③ NEXT_PUBLIC_API_URL**（可选，Vercel 会自动生成）
   ```bash
   Key: NEXT_PUBLIC_API_URL
   Value: https://deep-world-frontend.vercel.app/api
   
   Environments:
   ☑ Production
   ☑ Preview
   ☐ Development
   ```

3. **保存环境变量**
   - 每个变量添加后点击 **"Save"**

---

#### Step 5: 重新部署（应用环境变量）

环境变量保存后，需要重新部署才能生效：

1. **进入 Deployments**
   - 在项目页面点击 **"Deployments"** 标签

2. **找到最新部署**
   - 通常是列表第一个

3. **点击右侧菜单 (...)**
   - 选择 **"Redeploy"**

4. **确认重新部署**
   - 勾选 **" Use existing Build Cache"**
   - 点击 **"Redeploy"**

5. **等待部署完成**
   - 大约 1-2 分钟
   - 部署成功后会自动应用新的环境变量

---

#### Step 6: 测试线上功能

1. **访问你的应用**
   ```
   https://deep-world-frontend.vercel.app
   ```

2. **测试注册功能**
   - 填写邮箱、密码
   - 点击注册
   - 应该成功跳转到 Dashboard

3. **测试登录功能**
   - 使用刚注册的账号登录
   - 应该成功进入系统

4. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 是否有错误

---

### 💻 方案 B：Vercel CLI（命令行）

如果你喜欢命令行，可以使用 Vercel CLI：

#### Step 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: 登录 Vercel

```bash
cd deep-world
vercel login
```

会选择以下方式之一：
- GitHub（推荐）
- GitLab
- Bitbucket
- Email

#### Step 3: 首次部署

```bash
vercel --prod
```

**交互式问题回答：**

```
? Set up and deploy "~/Documents/cursor file/deep-world-frontend/deep-world"? [Y/n]
→ Y

? Which scope do you want to deploy to?
→ 选择你的账号

? Link to existing project? [y/N]
→ N（首次部署选 No）

? What's your project's name?
→ deep-world-frontend

? In which directory is your code located?
→ ./（直接回车）

? Want to override the settings? [y/N]
→ N（直接回车，使用默认）
```

然后等待部署完成...

#### Step 4: 配置环境变量

**方式 1：通过命令添加**

```bash
# 添加 DATABASE_URL
vercel env add DATABASE_URL postgresql://postgres.x%2Ca9M%23fth37%21.w%2C@db.enupilsqydexyleejowa.supabase.co:5432/postgres?sslmode=require

# 添加 JWT_SECRET
vercel env add JWT_SECRET your-random-secret-key-here

# 添加 API URL
vercel env add NEXT_PUBLIC_API_URL https://deep-world-frontend.vercel.app/api
```

**方式 2：通过 Vercel Dashboard**
- 参考方案 A 的 Step 4

#### Step 5: 重新部署

```bash
vercel --prod --force
```

---

## 🔍 故障排查

### 问题 1: 部署失败 - Build Error

**错误信息**: `Command "npm run build" exited with 1`

**解决方案**:
1. 检查 `package.json` 中的 `build` 脚本
2. 确保所有 TypeScript 类型正确
3. 查看详细构建日志定位错误

### 问题 2: 运行时错误 - DATABASE_URL not found

**错误信息**: `Environment variable not found: DATABASE_URL`

**解决方案**:
1. 确认已在 Vercel Dashboard 添加环境变量
2. 确认环境变量作用域包含 Production
3. **重新部署**以应用环境变量

### 问题 3: 数据库连接失败

**错误信息**: `Can't reach database server`

**解决方案**:
1. 检查 DATABASE_URL 是否正确（特别是密码部分）
2. 确认 Supabase 项目正常运行
3. 检查 Supabase 白名单设置（Settings → Database → Connection Pooling）

### 问题 4: CORS 错误

**错误信息**: `Access to fetch at '...' has been blocked by CORS policy`

**解决方案**:
- Next.js API Routes 默认支持 CORS
- 如果遇到，检查 API 路由配置

---

## 📊 部署后检查清单

### ✅ 功能测试

- [ ] 首页能正常访问
- [ ] 注册功能正常
- [ ] 登录功能正常
- [ ] 能访问 Dashboard 页面
- [ ] World 页面正常

### ✅ 数据库检查

- [ ] 新用户能成功保存到 Supabase
- [ ] 登录验证正常
- [ ] 用户数据查询正常

### ✅ 性能检查

- [ ] 页面加载速度快
- [ ] API 响应及时
- [ ] 无明显卡顿

---

## 🎁 额外功能配置

### 自定义域名（可选）

1. **进入 Settings → Domains**
2. **添加你的域名**
   ```
   your-domain.com
   www.your-domain.com
   ```
3. **配置 DNS**
   - 按照 Vercel 提示添加 CNAME 或 A 记录
4. **等待 DNS 生效**（通常几分钟到几小时）

### 自动 HTTPS

- ✅ Vercel 自动提供 HTTPS
- ✅ 无需额外配置
- ✅ 自动续期

### 分析统计（可选）

1. **Vercel Analytics**
   - Settings → Analytics → Enable
   
2. **Google Analytics**
   - 安装 `react-ga4`
   - 在 `layout.tsx` 中添加追踪代码

---

## 💡 最佳实践

### 环境变量管理

1. **开发环境**: `.env.local`
2. **预览环境**: Vercel Preview 环境变量
3. **生产环境**: Vercel Production 环境变量

### 部署流程

1. **本地开发测试** → `npm run dev`
2. **推送到 GitHub** → 自动触发 Vercel Preview 部署
3. **合并到 main 分支** → 自动触发 Production 部署
4. **检查部署结果** → Vercel Dashboard

### 监控和维护

1. **Vercel Dashboard** - 查看部署状态
2. **Vercel Analytics** - 查看访问统计
3. **Error Logs** - 查看错误日志
4. **Supabase Dashboard** - 查看数据库状态

---

## 🔗 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Vercel 环境变量](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase 最佳实践](https://supabase.com/docs/guides/platform)

---

## 🎉 总结

恭喜你完成了从本地开发到云端部署的全过程！

**技术栈**:
- 前端：Next.js 16 + React 19
- 后端：Next.js API Routes
- 数据库：Supabase PostgreSQL
- 部署：Vercel
- 认证：JWT + bcrypt

**访问地址**:
- 开发环境：http://localhost:3000
- 生产环境：https://deep-world-frontend.vercel.app

**下一步**:
- 继续开发新功能
- 优化用户体验
- 添加更多互动玩法
- 收集用户反馈

**祝你部署成功！🚀**
