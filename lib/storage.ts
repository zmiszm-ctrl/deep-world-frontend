import { STATUS_LIST, FOOD_LIST, Avatar, User } from '@/types';

// 模拟本地存储
const STORAGE_KEY = 'deep-world-data';

interface StorageData {
  user: User | null;
  avatars: Avatar[];
  pointsLogs: any[];
}

// 初始化存储数据
export const initStorage = (): StorageData => {
  return {
    user: null,
    avatars: [],
    pointsLogs: [],
  };
};

// 获取存储数据
export const getStorageData = (): StorageData => {
  if (typeof window === 'undefined') return initStorage();
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return initStorage();
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse storage data:', error);
    return initStorage();
  }
};

// 保存存储数据
export const saveStorageData = (data: StorageData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// 用户相关操作
export const getUser = (): User | null => {
  const data = getStorageData();
  return data.user;
};

export const setUser = (user: User) => {
  const data = getStorageData();
  data.user = user;
  saveStorageData(data);
};

export const updateUserPoints = (points: number) => {
  const data = getStorageData();
  if (data.user) {
    data.user.points = points;
    saveStorageData(data);
  }
};

// 虚拟形象相关操作
export const getAvatars = (): Avatar[] => {
  const data = getStorageData();
  return data.avatars;
};

export const addAvatar = (avatar: Avatar) => {
  const data = getStorageData();
  data.avatars.push(avatar);
  saveStorageData(data);
};

export const updateAvatar = (avatarId: string, updates: Partial<Avatar>) => {
  const data = getStorageData();
  const index = data.avatars.findIndex(a => a.id === avatarId);
  if (index !== -1) {
    data.avatars[index] = { ...data.avatars[index], ...updates };
    saveStorageData(data);
  }
};

export const deleteAvatar = (avatarId: string) => {
  const data = getStorageData();
  data.avatars = data.avatars.filter(a => a.id !== avatarId);
  saveStorageData(data);
};

// 随机状态分配
export const getRandomStatus = () => {
  const randomIndex = Math.floor(Math.random() * STATUS_LIST.length);
  return STATUS_LIST[randomIndex];
};

// 随机性格生成
export const getRandomPersonality = () => {
  const personalities = [
    { id: '1', name: '活泼开朗', traits: ['乐观', '外向', '友好'], color: '#FFD700' },
    { id: '2', name: '冷静理智', traits: ['理性', '沉稳', '聪明'], color: '#4169E1' },
    { id: '3', name: '温柔善良', traits: ['体贴', '耐心', '温柔'], color: '#FFB6C1' },
    { id: '4', name: '神秘高冷', traits: ['独立', '冷静', '深邃'], color: '#8B008B' },
    { id: '5', name: '幽默风趣', traits: ['搞笑', '机智', '有趣'], color: '#FFA500' },
  ];
  const randomIndex = Math.floor(Math.random() * personalities.length);
  return personalities[randomIndex];
};

// AI 语句生成（简化版）
export const generateAIMessage = (personalityName: string): string => {
  const messages: Record<string, string[]> = {
    '活泼开朗': [
      '今天天气真好呀！✨',
      '一起来玩游戏吧！🎮',
      '嘻嘻，好开心哦～ 😊',
      '发现了好玩的东西！🌟',
      '能量满满！💪',
    ],
    '冷静理智': [
      '正在分析当前情况... 🤔',
      '逻辑告诉我应该这样做。',
      '让我思考一下。📚',
      '数据表明这是最优解。',
      '保持冷静，继续观察。👁️',
    ],
    '温柔善良': [
      '希望你今天过得愉快～ 💕',
      '需要我帮忙吗？😊',
      '大家都要开开心心的！🌸',
      '温暖的一天呢～ ☀️',
      '关心身边的每一个人～ 💝',
    ],
    '神秘高冷': [
      '......',
      '有些事不必多说。🌙',
      '独自思考中。',
      '保持距离感。❄️',
      '深邃的夜空真美。⭐',
    ],
    '幽默风趣': [
      '你知道为什么我这么帅吗？😎',
      '生活需要一点笑声！🤣',
      '开个玩笑啦～ 😜',
      '我是这个世界的开心果！🍊',
      '幽默是一种智慧！💡',
    ],
  };

  const personalityMessages = messages[personalityName] || messages['活泼开朗'];
  const randomIndex = Math.floor(Math.random() * personalityMessages.length);
  return personalityMessages[randomIndex];
};

// 积分投喂操作
export const feedAvatar = (avatarId: string, foodId: string): boolean => {
  const data = getStorageData();
  const food = FOOD_LIST.find(f => f.id === foodId);
  
  if (!food || !data.user) return false;
  
  if (data.user.points >= food.price) {
    // 扣除积分
    data.user.points -= food.price;
    
    // 记录积分日志
    data.pointsLogs.push({
      id: Date.now().toString(),
      userId: data.user.id,
      avatarId,
      change: -food.price,
      reason: `投喂${food.name}`,
      createdAt: new Date().toISOString(),
    });
    
    saveStorageData(data);
    return true;
  }
  
  return false;
};

// 生成唯一 ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
