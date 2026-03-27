'use client';

import { Avatar } from '@/types';
import Link from 'next/link';

interface AvatarCardProps {
  avatar: Avatar;
}

export default function AvatarCard({ avatar }: AvatarCardProps) {
  return (
    <div className="glass-card p-6 avatar-container">
      {/* 状态气泡 */}
      <div className="status-bubble">
        <span>{avatar.currentStatus.emoji}</span>
        <span className="ml-2">{avatar.currentStatus.name}</span>
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
          {avatar.personality.traits.map((trait, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-xs"
              style={{ backgroundColor: avatar.personality.color + '30', color: avatar.personality.color }}
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
