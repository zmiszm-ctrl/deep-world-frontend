// 用户类型定义
export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  points: number;
  createdAt: Date;
  lastLoginAt?: Date;
}

// 虚拟形象类型定义
export interface Avatar {
  id: string;
  userId: string;
  name: string;
  type: 'person' | 'animal' | 'virtual';
  style: 'anime' | 'cartoon' | 'realistic' | 'pixel';
  gender: 'male' | 'female' | 'other';
  age: number;
  imageUrl: string;
  currentStatus: Status;
  currentMessage: string;
  personality: Personality;
  position: Position;
  createdAt: Date;
  updatedAt: Date;
}

// 状态类型定义
export interface Status {
  id: string;
  name: string;
  emoji: string;
  description: string;
  duration: number; // 持续时间（分钟）
}

// 性格类型定义
export interface Personality {
  id: string;
  name: string;
  traits: string[];
  color: string;
}

// 位置类型定义
export interface Position {
  x: number;
  y: number;
}

// 积分记录类型定义
export interface PointsLog {
  id: string;
  userId: string;
  avatarId: string;
  change: number;
  reason: string;
  createdAt: Date;
}

// 食物类型定义
export interface Food {
  id: string;
  name: string;
  price: number;
  effect: string;
  emoji: string;
}

// 预设状态列表
export const STATUS_LIST: Status[] = [
  { id: '1', name: '开心', emoji: '😊', description: '心情愉悦', duration: 60 },
  { id: '2', name: '困倦', emoji: '😴', description: '想要睡觉', duration: 60 },
  { id: '3', name: '饥饿', emoji: '😋', description: '需要进食', duration: 60 },
  { id: '4', name: '兴奋', emoji: '🎉', description: '充满活力', duration: 60 },
  { id: '5', name: '思考', emoji: '🤔', description: '深度思考中', duration: 60 },
  { id: '6', name: '运动', emoji: '🏃', description: '正在运动', duration: 60 },
  { id: '7', name: '社交', emoji: '💬', description: '与他人互动', duration: 60 },
  { id: '8', name: '学习', emoji: '📚', description: '学习中', duration: 60 },
];

// 预设性格列表
export const PERSONALITY_LIST: Personality[] = [
  { id: '1', name: '活泼开朗', traits: ['乐观', '外向', '友好'], color: '#FFD700' },
  { id: '2', name: '冷静理智', traits: ['理性', '沉稳', '聪明'], color: '#4169E1' },
  { id: '3', name: '温柔善良', traits: ['体贴', '耐心', '温柔'], color: '#FFB6C1' },
  { id: '4', name: '神秘高冷', traits: ['独立', '冷静', '深邃'], color: '#8B008B' },
  { id: '5', name: '幽默风趣', traits: ['搞笑', '机智', '有趣'], color: '#FFA500' },
];

// 食物列表
export const FOOD_LIST: Food[] = [
  { id: '1', name: '苹果', price: 2, effect: '恢复体力', emoji: '🍎' },
  { id: '2', name: '汉堡', price: 5, effect: '大幅增加体力', emoji: '🍔' },
  { id: '3', name: '蛋糕', price: 3, effect: '提升心情', emoji: '🍰' },
  { id: '4', name: '咖啡', price: 4, effect: '提神醒脑', emoji: '☕' },
  { id: '5', name: '水果沙拉', price: 6, effect: '健康营养', emoji: '🥗' },
];
