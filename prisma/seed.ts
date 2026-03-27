import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化种子数据...');

  // 初始化状态数据
  const statuses = [
    { id: '1', name: '开心', emoji: '😊', description: '心情愉悦', duration: 60 },
    { id: '2', name: '困倦', emoji: '😴', description: '想要睡觉', duration: 60 },
    { id: '3', name: '兴奋', emoji: '🤩', description: '非常激动', duration: 45 },
    { id: '4', name: '沉思', emoji: '🤔', description: '深入思考', duration: 60 },
    { id: '5', name: '放松', emoji: '😌', description: '悠闲自在', duration: 60 },
    { id: '6', name: '专注', emoji: '🎯', description: '专心致志', duration: 60 },
    { id: '7', name: '饥饿', emoji: '🍽️', description: '想要吃东西', duration: 30 },
    { id: '8', name: '运动', emoji: '⚽', description: '正在运动', duration: 45 },
  ];

  console.log('📊 插入状态数据...');
  for (const status of statuses) {
    await prisma.status.upsert({
      where: { id: status.id },
      update: status,
      create: status,
    });
  }

  // 初始化性格数据
  const personalities = [
    {
      id: '1',
      name: '活泼开朗',
      traits: JSON.stringify(['友好', '乐观', '外向']),
      color: '#FF6B6B',
    },
    {
      id: '2',
      name: '冷静理智',
      traits: JSON.stringify(['理性', '聪明', '沉稳']),
      color: '#4ECDC4',
    },
    {
      id: '3',
      name: '温柔善良',
      traits: JSON.stringify(['温柔', '体贴', '善良']),
      color: '#FFE66D',
    },
    {
      id: '4',
      name: '神秘高冷',
      traits: JSON.stringify(['神秘', '独立', '冷静']),
      color: '#6B5B95',
    },
    {
      id: '5',
      name: '幽默风趣',
      traits: JSON.stringify(['幽默', '风趣', '有趣']),
      color: '#88B04B',
    },
  ];

  console.log('🎭 插入性格数据...');
  for (const personality of personalities) {
    await prisma.personality.upsert({
      where: { id: personality.id },
      update: personality,
      create: personality,
    });
  }

  console.log('✅ 种子数据初始化完成！');
  console.log(`   - 状态：${statuses.length} 个`);
  console.log(`   - 性格：${personalities.length} 个`);
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
