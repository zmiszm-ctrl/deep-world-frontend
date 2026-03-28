'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser, getAvatars } from '@/lib/storage';
import { User, Avatar } from '@/types';
import AvatarCard from '@/components/AvatarCard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从 API 获取当前用户信息
    const fetchUser = async () => {
      try {
        console.log('📡 请求 /api/auth/me 获取用户信息');
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          console.log('⚠️ 未授权，跳转到登录页');
          router.push('/login-new');
          return;
        }
        
        const data = await response.json();
        console.log('✅ 获取到用户信息:', data.user);
        
        setUser(data.user);
        
        // 从 API 获取头像列表
        console.log('📡 请求 /api/avatars 获取虚拟形象列表');
        const avatarsResponse = await fetch('/api/avatars');
        if (avatarsResponse.ok) {
          const avatarsData = await avatarsResponse.json();
          console.log('✅ 获取到虚拟形象列表:', avatarsData.avatars);
          setAvatars(avatarsData.avatars);
        } else {
          console.warn('⚠️ 获取虚拟形象失败:', await avatarsResponse.text());
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('💥 获取用户失败:', error);
        router.push('/login-new');
      }
    };
    
    fetchUser();
  }, [router]);

  if (isLoading) {
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
      {/* 顶部导航栏 */}
      <header className="glass-card p-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              数字飞升世界
            </h1>
            <p className="text-sm text-gray-400 mt-1">Deep World</p>
          </div>
          
          <div className="flex items-center gap-6">
            {user && (
              <div className="points-display">
                <span>💰</span>
                <span>{user.points} 积分</span>
              </div>
            )}
            
            <Link href="/create-avatar" className="gradient-btn">
              + 创建虚拟形象
            </Link>
            
            <Link href="/world" className="gradient-btn">
              🌍 进入大世界
            </Link>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">我的虚拟形象</h2>
          
          {avatars.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">还没有虚拟形象</h3>
              <p className="text-gray-400 mb-6">创建你的第一个虚拟形象，开始数字飞升之旅！</p>
              <Link href="/create-avatar" className="gradient-btn inline-block">
                立即创建
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avatars.map((avatar) => (
                <AvatarCard key={avatar.id} avatar={avatar} />
              ))}
            </div>
          )}
        </section>

        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">玩法说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-3xl mb-2">🎲</div>
              <h3 className="font-semibold text-white">状态随机派送</h3>
              <p className="text-sm text-gray-400">系统每 1 小时为每个形象随机分配 1 种状态</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl mb-2">🍔</div>
              <h3 className="font-semibold text-white">积分投喂</h3>
              <p className="text-sm text-gray-400">使用积分兑换食物投喂虚拟形象</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold text-white">AI 自动语句</h3>
              <p className="text-sm text-gray-400">基于性格，AI 生成日常用语每 3 分钟切换</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
