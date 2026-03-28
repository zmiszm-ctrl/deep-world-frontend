'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUser, getAvatars, feedAvatar, updateAvatar } from '@/lib/storage';
import { Avatar, Food, FOOD_LIST } from '@/types';

export default function FeedPage() {
  const router = useRouter();
  const params = useParams();
  const avatarId = params.avatar as string;
  
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [isFeeding, setIsFeeding] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const checkAuthAndLoadAvatar = async () => {
      try {
        // 先检查用户是否登录
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          console.log('⚠️ 未授权，跳转到登录页');
          router.push('/login-new');
          return;
        }
        
        // 从 API 获取虚拟形象列表
        console.log('📡 请求 /api/avatars 获取虚拟形象列表');
        const avatarsResponse = await fetch('/api/avatars');
        if (!avatarsResponse.ok) {
          console.warn('⚠️ 获取虚拟形象失败');
          router.push('/dashboard');
          return;
        }
        
        const avatarsData = await avatarsResponse.json();
        console.log('✅ 获取到虚拟形象列表:', avatarsData.avatars);
        
        const foundAvatar = avatarsData.avatars.find((a: Avatar) => a.id === avatarId);
        if (!foundAvatar) {
          console.log('⚠️ 未找到指定的虚拟形象，跳转到 Dashboard');
          router.push('/dashboard');
          return;
        }
        
        setAvatar(foundAvatar);
      } catch (error) {
        console.error('💥 加载虚拟形象失败:', error);
        router.push('/dashboard');
      }
    };
    
    checkAuthAndLoadAvatar();
  }, [avatarId, router]);

  const handleFeed = async () => {
    if (!selectedFood || !avatar) return;

    const food = FOOD_LIST.find(f => f.id === selectedFood);
    if (!food) return;

    // 检查用户积分
    const userResponse = await fetch('/api/auth/me');
    if (userResponse.ok) {
      const userData = await userResponse.json();
      if (userData.user.points < food.price) {
        setMessage({ text: '积分不足！', type: 'error' });
        setTimeout(() => setMessage(null), 3000);
        return;
      }
    }

    setIsFeeding(true);
    
    try {
      // 模拟投喂过程（暂不扣除积分，后续可添加 API）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ text: `投喂成功！花费${food.price}积分`, type: 'success' });
      
      // 更新本地状态
      setAvatar(prev => prev ? {
        ...prev,
        currentStatus: { id: '4', name: '兴奋', emoji: '🎉', description: '被投喂后很开心', duration: 60 },
        currentMessage: `谢谢你的${food.name}！真好吃！😋`,
      } : null);
    } catch (error) {
      console.error('💥 投喂失败:', error);
      setMessage({ text: '投喂失败，请重试', type: 'error' });
    } finally {
      setIsFeeding(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!avatar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
        >
          ← 返回
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧：虚拟形象展示 */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{avatar.name}</h2>
            
            <div className="w-full h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center overflow-hidden mb-6">
              {avatar.imageUrl ? (
                <img src={avatar.imageUrl} alt={avatar.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {avatar.type === 'person' ? '👤' : avatar.type === 'animal' ? '🐾' : '🌟'}
                  </div>
                  <p className="text-sm text-gray-400">暂无图片</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">当前状态</span>
                <span className="text-white">{avatar.currentStatus.emoji} {avatar.currentStatus.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">性格</span>
                <span className="text-white">{avatar.personality.name}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">AI 消息</div>
                <div className="message-bubble relative static transform-none">
                  <p className="text-sm">{avatar.currentMessage}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：食物选择 */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-2">选择食物</h2>
            <p className="text-sm text-gray-400 mb-6">投喂虚拟形象，提升心情和亲密度</p>

            <div className="space-y-4">
              {FOOD_LIST.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                    selectedFood === food.id
                      ? 'border-indigo-400 bg-indigo-400/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-4xl">{food.emoji}</div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">{food.name}</div>
                    <div className="text-sm text-gray-400">{food.effect}</div>
                  </div>
                  <div className="points-display text-sm">
                    💰 {food.price}
                  </div>
                </button>
              ))}
            </div>

            {message && (
              <div className={`mt-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <button
              onClick={handleFeed}
              disabled={!selectedFood || isFeeding}
              className="gradient-btn w-full py-4 text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFeeding ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  投喂中...
                </span>
              ) : (
                '确认投喂'
              )}
            </button>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="text-sm text-yellow-400">
                  <p className="font-semibold mb-1">小贴士</p>
                  <p>• 每投喂一次会消耗相应的积分</p>
                  <p>• 投喂会让虚拟形象心情变好</p>
                  <p>• 不同的食物有不同的效果哦</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
