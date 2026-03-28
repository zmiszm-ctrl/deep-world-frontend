'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Position, STATUS_LIST } from '@/types';
import { getUser, getAvatars, updateAvatar, getRandomStatus, generateAIMessage } from '@/lib/storage';

export default function WorldContent() {
  const router = useRouter();
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const [userAvatars, setUserAvatars] = useState<Avatar[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [allAvatars, setAllAvatars] = useState<Avatar[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取 URL 参数（仅在客户端）
  useEffect(() => {
    setIsClient(true);
    const params = new URLSearchParams(window.location.search);
    const id = params.get('avatar');
    setAvatarId(id);
  }, []);

  // 初始化
  useEffect(() => {
    if (!isClient) return;
    
    const checkAuthAndLoadData = async () => {
      try {
        // 先检查用户是否登录（通过 API）
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          console.log('⚠️ 未授权，跳转到登录页');
          router.push('/login-new');
          return;
        }
        
        const userData = await userResponse.json();
        console.log('✅ 用户已认证:', userData.user);
        
        // 从 API 获取用户的虚拟形象
        console.log('📡 请求 /api/avatars 获取虚拟形象列表');
        const avatarsResponse = await fetch('/api/avatars');
        let avatars: Avatar[] = [];
        if (avatarsResponse.ok) {
          const avatarsData = await avatarsResponse.json();
          avatars = avatarsData.avatars;
          console.log('✅ 获取到虚拟形象列表:', avatars.length);
        } else {
          console.warn('⚠️ 获取虚拟形象失败，使用空数组');
        }
        
        setUserAvatars(avatars);

        // 如果 URL 指定了虚拟形象，使用该形象；否则使用第一个
        if (avatarId && avatars.find(a => a.id === avatarId)) {
          setSelectedAvatarId(avatarId);
        } else if (avatars.length > 0) {
          setSelectedAvatarId(avatars[0].id);
        }

    // 模拟其他用户的虚拟形象
    const mockNames = [
      '马里亚纳仇人',
      '只会 E 点',
      '柠檬下午不喝茶',
      'AI-阿航',
      '共话繁花飞满天',
      '踩死蚂蚁都流泪',
      '戒不了烈酒放不下屠刀',
      '羁旅长堪醉',
      '痛的余味',
      '星墟',
      '洛枫',
      '星河在眼里',
      '沐洛兮',
      '朵朵奇葩向阳开',
      '南苼',
      '天使の眼泪',
      '深知你是梦',
      '偷鱼罐头的猫',
      '说爱太烫嘴',
      '我有罪',
      '叶子',
      '温酒对奕',
      '明我长相忆',
      '自渡',
      '戏中人',
      '初夏少女',
    ];

    // 随机选择 8 个不重复的名字
    const shuffledNames = [...mockNames].sort(() => Math.random() - 0.5);
    const selectedNames = shuffledNames.slice(0, 8);

    const mockAvatars: Avatar[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `mock-${i}`,
      userId: `user-${i}`,
      name: selectedNames[i],
      type: ['person', 'animal', 'virtual'][Math.floor(Math.random() * 3)] as any,
      style: ['anime', 'cartoon', 'realistic', 'pixel'][Math.floor(Math.random() * 4)] as any,
      gender: ['male', 'female', 'other'][Math.floor(Math.random() * 3)] as any,
      age: Math.floor(Math.random() * 50) + 10,
      imageUrl: '',
      currentStatus: getRandomStatus(),
      currentMessage: generateAIMessage(['活泼开朗', '冷静理智', '温柔善良', '神秘高冷', '幽默风趣'][Math.floor(Math.random() * 5)]),
      personality: {
        id: (i + 1).toString(),
        name: ['活泼开朗', '冷静理智', '温柔善良', '神秘高冷', '幽默风趣'][Math.floor(Math.random() * 5)],
        traits: ['友好', '聪明'],
        color: '#6366f1',
      },
      position: {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    setAllAvatars([...avatars, ...mockAvatars]);
      } catch (error) {
        console.error('💥 初始化失败:', error);
        router.push('/login-new');
      }
    };
    
    checkAuthAndLoadData();
  }, [avatarId, isClient, router]);

  // AI 自动语句更新（每 3 分钟）
  useEffect(() => {
    if (!selectedAvatarId || !isClient) return;

    const updateMessage = () => {
      const avatars = getAvatars();
      const avatar = avatars.find(a => a.id === selectedAvatarId);
      if (avatar) {
        const newMessage = generateAIMessage(avatar.personality.name);
        updateAvatar(selectedAvatarId, {
          currentMessage: newMessage,
        });
        
        // 更新本地状态
        setAllAvatars(prev => prev.map(a => 
          a.id === selectedAvatarId ? { ...a, currentMessage: newMessage } : a
        ));
      }
    };

    // 立即执行一次
    updateMessage();
    
    // 每 3 分钟更新一次
    const interval = setInterval(updateMessage, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedAvatarId, isClient]);

  // 状态随机派送（每 1 小时）
  useEffect(() => {
    if (!selectedAvatarId || !isClient) return;

    const updateStatus = () => {
      const newStatus = getRandomStatus();
      updateAvatar(selectedAvatarId, {
        currentStatus: newStatus,
      });
      
      // 更新本地状态
      setAllAvatars(prev => prev.map(a => 
        a.id === selectedAvatarId ? { ...a, currentStatus: newStatus } : a
      ));
    };

    // 每小时更新一次
    const interval = setInterval(updateStatus, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedAvatarId, isClient]);

  // 虚拟形象移动
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedAvatarId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    updateAvatar(selectedAvatarId, {
      position: { x, y },
    });

    setAllAvatars(prev => prev.map(a => 
      a.id === selectedAvatarId ? { ...a, position: { x, y } } : a
    ));
  };

  // 虚拟形象自动移动（AI 自主行为）
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setAllAvatars(prev => prev.map(avatar => {
        if (avatar.id.startsWith('mock-')) {
          // 模拟其他虚拟形象的随机移动
          const newX = Math.max(5, Math.min(95, avatar.position.x + (Math.random() - 0.5) * 10));
          const newY = Math.max(5, Math.min(95, avatar.position.y + (Math.random() - 0.5) * 10));
          return { ...avatar, position: { x: newX, y: newY } };
        }
        return avatar;
      }));
    }, 2000);

    return () => clearInterval(moveInterval);
  }, []);

  const selectedAvatar = allAvatars.find(a => a.id === selectedAvatarId);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
        >
          ← 返回
        </button>

        {/* 顶部信息栏 - 优化间距 */}
        <div className="glass-card p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">🌍 虚拟大世界</h1>
              <p className="text-xs text-gray-400">与其他虚拟形象一起互动吧！点击空地移动你的虚拟形象</p>
            </div>
            
            {/* 虚拟形象切换 */}
            <div className="flex gap-1.5">
              {userAvatars.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatarId(avatar.id)}
                  className={`px-3 py-1.5 rounded-lg border-2 transition-all text-sm ${
                    selectedAvatarId === avatar.id
                      ? 'border-indigo-400 bg-indigo-400/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {avatar.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 大世界地图 - 使用图片背景 */}
        <div
          ref={containerRef}
          onClick={handleMove}
          className="glass-card relative w-full h-[600px] cursor-pointer overflow-hidden"
          style={{
            background: 'url(/world-map.jpg) center/cover no-repeat',
            backgroundColor: '#1e1b4b',
          }}
        >
          {/* 半透明遮罩层，让虚拟形象更清晰 */}
          <div className="absolute inset-0 bg-black/20" />

          {/* 所有虚拟形象 */}
          {allAvatars.map(avatar => (
            <div
              key={avatar.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 group"
              style={{
                left: `${avatar.position.x}%`,
                top: `${avatar.position.y}%`,
              }}
            >
              {/* 虚拟形象本体 - 变小 */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                selectedAvatarId === avatar.id
                  ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent scale-110'
                  : 'hover:scale-105'
              }`} style={{
                background: avatar.id.startsWith('mock-') 
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'linear-gradient(135deg, #ec4899, #f59e0b)',
              }}>
                {avatar.type === 'person' ? '👤' : avatar.type === 'animal' ? '🐾' : '🌟'}
              </div>

              {/* 名字标签和状态 - 名字@状态格式 */}
              <div className="mt-1 text-center space-y-0.5">
                {/* 名字 */}
                <div className="text-[10px] font-medium text-white/90 px-1.5 py-0.5 bg-black/40 rounded backdrop-blur-sm">
                  {avatar.name}
                </div>
                {/* 状态 - 缩小版，在名字下面 */}
                <div className="text-[9px] text-gray-300/80 px-1 py-0.5 bg-black/30 rounded backdrop-blur-sm flex items-center justify-center gap-0.5">
                  <span className="text-[8px]">{avatar.currentStatus.emoji}</span>
                  <span>{avatar.currentStatus.name}</span>
                </div>
              </div>

              {/* AI 消息气泡 - 游戏对话风格，单行显示 */}
              {selectedAvatarId === avatar.id && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                  <div className="relative">
                    {/* 对话气泡背景 */}
                    <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-400/30 shadow-lg">
                      {/* 文字内容 - 单行小字 */}
                      <p className="text-[11px] text-white font-medium tracking-wide m-0 leading-tight">
                        {avatar.currentMessage}
                      </p>
                    </div>
                    {/* 对话气泡小三角 */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0">
                      <div className="border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-indigo-600/90"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 提示信息 */}
          {!selectedAvatar && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p>请先创建一个虚拟形象</p>
                <button
                  onClick={() => router.push('/create-avatar')}
                  className="gradient-btn mt-4 px-6 py-2"
                >
                  创建虚拟形象
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 操作说明 - 字体变小 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-4">
            <div className="text-2xl mb-1">🖱️</div>
            <h3 className="font-semibold text-white text-sm mb-1">点击移动</h3>
            <p className="text-xs text-gray-400">点击地图任意位置，你的虚拟形象会移动到该处</p>
          </div>
          
          <div className="glass-card p-4">
            <div className="text-2xl mb-1">🤖</div>
            <h3 className="font-semibold text-white text-sm mb-1">AI 自主行为</h3>
            <p className="text-xs text-gray-400">虚拟形象会自动说话，每 3 分钟更新一次</p>
          </div>
          
          <div className="glass-card p-4">
            <div className="text-2xl mb-1">🎲</div>
            <h3 className="font-semibold text-white text-sm mb-1">状态变化</h3>
            <p className="text-xs text-gray-400">系统每小时随机分配新的状态</p>
          </div>
        </div>
      </div>
    </div>
  );
}
