-- ====================================
-- 清理重复表（删除大写驼峰命名的表）
-- 在 Supabase SQL Editor 中执行
-- ====================================

-- ⚠️ 警告：此操作会删除表及其所有数据！
-- 请确保小写表（avatars, personalities, statuses, users, points_logs）已有正确数据

-- 1. 删除 Avatar 表（保留 avatars）
DROP TABLE IF EXISTS "Avatar" CASCADE;

-- 2. 删除 Personality 表（保留 personalities）
DROP TABLE IF EXISTS "Personality" CASCADE;

-- 3. 删除 Status 表（保留 statuses）
DROP TABLE IF EXISTS "Status" CASCADE;

-- 4. 删除 User 表（保留 users）
DROP TABLE IF EXISTS "User" CASCADE;

-- 5. 删除 PointsLog 表（保留 points_logs）
DROP TABLE IF EXISTS "PointsLog" CASCADE;

-- 验证：查看剩余表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 应该只剩下：avatars, personalities, statuses, users, points_logs
