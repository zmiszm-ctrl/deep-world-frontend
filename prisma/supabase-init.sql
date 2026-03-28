-- ====================================
-- Deep World 数据库快速初始化脚本
-- 直接在 Supabase SQL Editor 中执行
-- ====================================

-- 创建所有表
CREATE TABLE IF NOT EXISTS "statuses" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "emoji" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "duration" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "personalities" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "traits" TEXT NOT NULL,
  "color" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "nickname" TEXT,
  "avatar" TEXT,
  "points" INTEGER NOT NULL DEFAULT 10,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "avatars" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "style" TEXT NOT NULL,
  "gender" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "statusId" TEXT NOT NULL REFERENCES "statuses"("id"),
  "currentMessage" TEXT,
  "personalityId" TEXT NOT NULL REFERENCES "personalities"("id"),
  "positionX" DOUBLE PRECISION DEFAULT 50,
  "positionY" DOUBLE PRECISION DEFAULT 50,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "points_logs" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "avatarId" TEXT,
  "change" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "avatars_userId_idx" ON "avatars"("userId");
CREATE INDEX IF NOT EXISTS "points_logs_userId_idx" ON "points_logs"("userId");

-- 插入初始数据（10 种状态）
INSERT INTO "statuses" ("id", "name", "emoji", "description", "duration") VALUES
  ('1', '开心', '😊', '心情愉快，充满活力', 60),
  ('2', '难过', '😢', '情绪低落，需要安慰', 90),
  ('3', '生气', '😠', '愤怒不满，想要发泄', 45),
  ('4', '惊讶', '😲', '感到意外，难以置信', 30),
  ('5', '害怕', '😨', '恐惧不安，想要逃避', 60),
  ('6', '期待', '🤩', '充满期待，跃跃欲试', 120),
  ('7', '疲惫', '😫', '精力耗尽，需要休息', 180),
  ('8', '兴奋', '🎉', '非常激动，难以平静', 90),
  ('9', '平静', '😌', '心态平和，安静祥和', 150),
  ('10', '困惑', '🤔', '疑惑不解，陷入思考', 60)
ON CONFLICT ("id") DO NOTHING;

-- 插入性格数据（5 种性格）
INSERT INTO "personalities" ("id", "name", "traits", "color") VALUES
  ('1', '活泼开朗', '["乐观","外向","友好"]', '#FFD700'),
  ('2', '冷静理智', '["理性","沉稳","聪明"]', '#4169E1'),
  ('3', '温柔善良', '["体贴","耐心","温柔"]', '#FFB6C1'),
  ('4', '神秘高冷', '["独立","冷静","深邃"]', '#8B008B'),
  ('5', '幽默风趣', '["搞笑","机智","有趣"]', '#FFA500')
ON CONFLICT ("id") DO NOTHING;

-- 验证
SELECT '✅ 数据库初始化完成！' as status;
SELECT COUNT(*) as statuses_count FROM statuses;
SELECT COUNT(*) as personalities_count FROM personalities;
