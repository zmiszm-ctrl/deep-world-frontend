-- ====================================
-- Deep World 数据库初始化脚本
-- 适用于 Supabase PostgreSQL
-- ====================================

-- 1. 创建 Statuses 表（虚拟形象状态）
CREATE TABLE IF NOT EXISTS "statuses" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "emoji" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "duration" INTEGER NOT NULL,
  CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- 2. 创建 Personalities 表（虚拟形象性格）
CREATE TABLE IF NOT EXISTS "personalities" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "traits" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  CONSTRAINT "personalities_pkey" PRIMARY KEY ("id")
);

-- 3. 创建 Users 表（用户）
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "nickname" TEXT,
  "avatar" TEXT,
  "points" INTEGER NOT NULL DEFAULT 10,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 4. 创建 Avatars 表（虚拟形象）
CREATE TABLE IF NOT EXISTS "avatars" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "style" TEXT NOT NULL,
  "gender" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "statusId" TEXT NOT NULL,
  "currentMessage" TEXT,
  "personalityId" TEXT NOT NULL,
  "positionX" DOUBLE PRECISION NOT NULL DEFAULT 50,
  "positionY" DOUBLE PRECISION NOT NULL DEFAULT 50,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "avatars_pkey" PRIMARY KEY ("id")
);

-- 5. 创建 PointsLogs 表（积分流水）
CREATE TABLE IF NOT EXISTS "points_logs" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "avatarId" TEXT,
  "change" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "points_logs_pkey" PRIMARY KEY ("id")
);

-- 6. 创建索引
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "avatars_userId_idx" ON "avatars"("userId");
CREATE INDEX IF NOT EXISTS "points_logs_userId_idx" ON "points_logs"("userId");

-- 7. 添加外键约束（如果不存在）
DO $$ BEGIN
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_statusId_fkey" 
    FOREIGN KEY ("statusId") REFERENCES "statuses"("id");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_personalityId_fkey" 
    FOREIGN KEY ("personalityId") REFERENCES "personalities"("id");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "points_logs" ADD CONSTRAINT "points_logs_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 8. 插入初始状态数据（10 种情绪状态）
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

-- 9. 插入初始性格数据（5 种性格类型）
INSERT INTO "personalities" ("id", "name", "traits", "color") VALUES
  ('1', '活泼开朗', '["乐观","外向","友好"]', '#FFD700'),
  ('2', '冷静理智', '["理性","沉稳","聪明"]', '#4169E1'),
  ('3', '温柔善良', '["体贴","耐心","温柔"]', '#FFB6C1'),
  ('4', '神秘高冷', '["独立","冷静","深邃"]', '#8B008B'),
  ('5', '幽默风趣', '["搞笑","机智","有趣"]', '#FFA500')
ON CONFLICT ("id") DO NOTHING;

-- ====================================
-- 验证查询
-- ====================================

-- 查看所有表
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- 查看状态数量
SELECT COUNT(*) as status_count FROM statuses;

-- 查看性格数量
SELECT COUNT(*) as personality_count FROM personalities;

-- 查看状态列表
SELECT * FROM statuses ORDER BY id;

-- 查看性格列表
SELECT * FROM personalities ORDER BY id;
