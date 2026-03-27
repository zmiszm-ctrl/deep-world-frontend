# ⚡ 快速部署步骤（3 分钟完成）

## 🎯 立即执行（按顺序）

### Step 1: 访问 Vercel 导入项目

1. **打开链接**
   ```
   https://vercel.com/new
   ```

2. **使用 GitHub 登录**
   - 点击 "Continue with GitHub"
   - 授权 Vercel

3. **导入项目**
   - 搜索：`deep-world-frontend`
   - 找到 `zmiszm-ctrl/deep-world-frontend`
   - 点击 **"Import"**

---

### Step 2: 配置并部署

4. **Project Name**: `deep-world-frontend`

5. **Framework Preset**: Next.js（自动识别）

6. **Root Directory**: 
   - 如果提示找不到 package.json
   - 点击 Edit，输入：`deep-world`

7. **点击 "Deploy"**
   - ⏳ 等待 2-3 分钟

---

### Step 3: 配置环境变量（必须！）

8. **部署完成后**
   - 点击 **"Add Environment Variables"**

9. **添加以下变量**：

   **DATABASE_URL**
   ```
   Key: DATABASE_URL
   Value: postgresql://postgres.x%2Ca9M%23fth37%21.w%2C@db.enupilsqydexyleejowa.supabase.co:5432/postgres?sslmode=require
   ```

   **JWT_SECRET**
   ```
   Key: JWT_SECRET  
   Value: [随机生成一个至少 32 位的字符串]
   示例：k8j3h5g7f2d9s4a6p1o0i2u7y5t3r8e6w1q4
   ```

   **NEXT_PUBLIC_API_URL**
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://你的项目名.vercel.app/api
   （替换为你的实际 Vercel 域名）
   ```

10. **保存所有环境变量**

---

### Step 4: 重新部署

11. **进入 Deployments 标签**

12. **找到最新部署**
    - 点击右侧 **...** → **Redeploy**
    - 勾选 "Use existing Build Cache"
    - 点击 **Redeploy**

13. **⏳ 等待 1-2 分钟**

---

### Step 5: 测试

14. **访问你的应用**
    ```
    https://deep-world-frontend.vercel.app
    ```
    （替换为你的实际 URL）

15. **测试功能**
    - ✅ 注册新用户
    - ✅ 登录
    - ✅ 访问 Dashboard

---

## ✅ 完成！

如果一切正常，你的应用已经上线了！🎉

**遇到问题？**
- 查看 [`VERCEL_DEPLOYMENT_GUIDE.md`](./VERCEL_DEPLOYMENT_GUIDE.md) 详细指南
- 或随时问我！

---

## 📱 重要信息

**GitHub 仓库**: https://github.com/zmiszm-ctrl/deep-world-frontend

**Vercel Dashboard**: https://vercel.com/dashboard

**Supabase Dashboard**: https://supabase.com/dashboard/project/enupilsqydexyleejowa
