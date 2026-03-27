-- Deep World 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT,
    avatar TEXT,
    points INTEGER DEFAULT 10,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建状态表（预定义）
CREATE TABLE IF NOT EXISTS "Status" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL
);

-- 创建性格表（预定义）
CREATE TABLE IF NOT EXISTS "Personality" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    traits TEXT NOT NULL,
    color TEXT NOT NULL
);

-- 创建虚拟形象表
CREATE TABLE IF NOT EXISTS "Avatar" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- person|animal|virtual
    style TEXT NOT NULL, -- anime|cartoon|realistic|pixel
    gender TEXT NOT NULL,
    age INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "statusId" TEXT NOT NULL REFERENCES "Status"(id),
    "currentMessage" TEXT,
    "personalityId" TEXT NOT NULL REFERENCES "Personality"(id),
    "positionX" FLOAT DEFAULT 50,
    "positionY" FLOAT DEFAULT 50,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建积分流水表
CREATE TABLE IF NOT EXISTS "PointsLog" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "avatarId" TEXT,
    change INTEGER NOT NULL,
    reason TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "Avatar_userId_idx" ON "Avatar"("userId");
CREATE INDEX IF NOT EXISTS "PointsLog_userId_idx" ON "PointsLog"("userId");

-- 插入预定义状态数据
INSERT INTO "Status" (id, name, emoji, description, duration) VALUES
('1', '开心', '😊', '心情愉悦', 60),
('2', '困倦', '😴', '想要睡觉', 60),
('3', '兴奋', '🤩', '非常激动', 45),
('4', '沉思', '🤔', '深入思考', 60),
('5', '放松', '😌', '悠闲自在', 60),
('6', '专注', '🎯', '专心致志', 60),
('7', '饥饿', '🍽️', '想要吃东西', 30),
('8', '运动', '⚽', '正在运动', 45)
ON CONFLICT (id) DO NOTHING;

-- 插入预定义性格数据
INSERT INTO "Personality" (id, name, traits, color) VALUES
('1', '活泼开朗', '["友好", "乐观", "外向"]', '#FF6B6B'),
('2', '冷静理智', '["理性", "聪明", "沉稳"]', '#4ECDC4'),
('3', '温柔善良', '["温柔", "体贴", "善良"]', '#FFE66D'),
('4', '神秘高冷', '["神秘", "独立", "冷静"]', '#6B5B95'),
('5', '幽默风趣', '["幽默", "风趣", "有趣"]', '#88B04B')
ON CONFLICT (id) DO NOTHING;

-- 创建测试用户（可选，密码：123456）
-- INSERT INTO "User" (email, password, nickname, points) 
-- VALUES ('test@example.com', '$2b$10$rHkzO.h5qJLqkqJkqJkqJ.vEhVZt5rHkzO.h5qJLqkqJkqJkqJkqJ', '测试用户', 10);
