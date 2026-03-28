'use client';

import { Avatar } from '@/types';
import Link from 'next/link';

interface AvatarCardProps {
  avatar: Avatar;
}

export default function AvatarCard({ avatar }: AvatarCardProps) {
  // 安全检查：确保关联数据存在
  const currentStatus = avatar.currentStatus || { emoji: '😊', name: '开心' };
  
  // personality.traits 可能是字符串（JSON）或数组，需要解析
  let personalityTraits: string[] = ['友好'];
  let personalityColor = '#6366f1';
  
  if (avatar.personality) {
    personalityColor = avatar.personality.color || '#6366f1';
    // 如果 traits 是字符串，解析 JSON
    if (typeof avatar.personality.traits === 'string') {
      try {
        personalityTraits = JSON.parse(avatar.personality.traits);
      } catch (e) {
        console.warn('解析 personality.traits 失败:', e);
        personalityTraits = ['友好'];
      }
    } else if (Array.isArray(avatar.personality.traits)) {
      personalityTraits = avatar.personality.traits;
    }
  }
  
  return (
    <div className="glass-card p-6 avatar-container">
      {/* 状态气泡 */}
      <div className="status-bubble">
        <span>{currentStatus.emoji}</span>
        <span className="ml-2">{currentStatus.name}</span>
      </div>

      {/* 虚拟形象图片 */}
      <div className="w-full h-48 mb-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center overflow-hidden">
        {avatar.imageUrl ? (
          <img
            src={avatar.imageUrl}
            alt={avatar.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-2">
              {avatar.type === 'person' ? '👤' : avatar.type === 'animal' ? '🐾' : '🌟'}
            </div>
            <p className="text-sm text-gray-400">暂无图片</p>
          </div>
        )}
      </div>

      {/* 基本信息 */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{avatar.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span className="px-2 py-1 bg-indigo-500/20 rounded text-xs">
            {avatar.type === 'person' ? '人物' : avatar.type === 'animal' ? '动物' : '虚拟生命'}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 rounded text-xs">
            {avatar.style === 'anime' ? '动漫' : avatar.style === 'cartoon' ? '动画' : avatar.style === 'realistic' ? '写实' : '像素风'}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          <span>{avatar.gender === 'male' ? '男' : avatar.gender === 'female' ? '女' : '其他'}</span>
          <span className="mx-2">•</span>
          <span>{avatar.age}岁</span>
        </div>
      </div>

      {/* 性格 */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-1">性格</div>
        <div className="flex flex-wrap gap-1">
          {personalityTraits.map((trait: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-xs"
              style={{ backgroundColor: personalityColor + '30', color: personalityColor }}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* AI 消息气泡 */}
      <div className="message-bubble">
        <p className="text-sm">{avatar.currentMessage}</p>
      </div>

      {/* 操作按钮 */}
      <div className="mt-12 flex gap-2">
        <Link href={`/feed/${avatar.id}`} className="gradient-btn flex-1 text-center py-2 text-sm">
          🍔 投喂
        </Link>
        <Link href={`/world?avatar=${avatar.id}`} className="gradient-btn flex-1 text-center py-2 text-sm">
          🌍 外出
        </Link>
      </div>
    </div>
  );
}
