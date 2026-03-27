import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 正在连接数据库...\n');
    
    // 测试查询 Status 表
    const statuses = await prisma.status.findMany();
    console.log('✅ 数据库连接成功！');
    console.log(`📊 Status 表：${statuses.length} 条记录`);
    
    if (statuses.length > 0) {
      console.log('   第一个状态:', statuses[0].name, statuses[0].emoji);
    }
    
    // 测试查询 Personality 表
    const personalities = await prisma.personality.findMany();
    console.log(`\n🎭 Personality 表：${personalities.length} 条记录`);
    
    // 测试查询 User 表
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        points: true,
      },
    });
    console.log(`\n👤 User 表：${users.length} 个用户`);
    
    if (users.length > 0) {
      console.log('   用户列表:');
      users.forEach(user => {
        console.log(`   - ${user.nickname} (${user.email}) - ${user.points} 积分`);
      });
    } else {
      console.log('   （暂无用户）');
    }
    
    console.log('\n✨ 所有测试通过！数据库运行正常\n');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ 数据库连接失败！\n');
    console.error('错误信息:', error.message);
    console.error('\n可能的原因:');
    console.error('1. DATABASE_URL 配置不正确');
    console.error('2. 网络连接问题');
    console.error('3. Supabase 项目未正确配置\n');
    
    if (process.env.DATABASE_URL) {
      const url = process.env.DATABASE_URL;
      const maskedUrl = url.replace(/:[^:@]+@/, ':****@');
      console.error('当前 DATABASE_URL:', maskedUrl);
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

testDatabase();
