// 测试 /api/avatars 接口
// 在浏览器 Console 中执行此代码

async function testAvatarsAPI() {
  try {
    console.log('📡 测试 GET /api/avatars...');
    
    const response = await fetch('/api/avatars', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 Cookie
    });
    
    console.log('📊 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (response.ok) {
      console.log('✅ API 调用成功！');
      console.log('虚拟形象数量:', data.avatars?.length || 0);
      if (data.avatars && data.avatars.length > 0) {
        console.log('第一个虚拟形象:', data.avatars[0]);
      }
    } else {
      console.log('❌ API 调用失败:', data.error);
    }
  } catch (error) {
    console.error('💥 发生错误:', error);
  }
}

// 执行测试
testAvatarsAPI();
