/**
 * API 切换测试脚本
 * 在浏览器控制台运行此脚本来测试 API 切换功能
 */

// 测试函数
async function testAPI() {
  const { authApi, api } = await import('@/lib/api');
  const { API_CONFIG } = await import('@/config/api');
  
  console.log('🧪 开始 API 测试...');
  console.log(`📊 当前配置: ${API_CONFIG.USE_MOCK ? 'Mock 模式' : '真实 API 模式'}`);
  console.log(`🔗 API 地址: ${API_CONFIG.BASE_URL}`);
  
  try {
    // 测试健康检查
    console.log('\n🏥 测试健康检查...');
    const health = await authApi.checkHealth();
    console.log('✅ 健康检查通过:', health);
    
    // 测试获取考试列表
    console.log('\n📝 测试获取考试列表...');
    const exams = await api.getExams();
    console.log(`✅ 获取到 ${exams.length} 个考试`);
    
    // 测试获取课程列表
    console.log('\n📚 测试获取课程列表...');
    const courses = await api.getCourses();
    console.log(`✅ 获取到 ${courses.length} 个课程`);
    
    // 测试获取通知
    console.log('\n🔔 测试获取通知...');
    const notifications = await api.getNotifications({ limit: 5 });
    console.log(`✅ 获取到 ${notifications.length} 个通知`);
    
    console.log('\n🎉 所有测试通过！');
    
    return {
      status: 'success',
      mode: API_CONFIG.USE_MOCK ? 'mock' : 'real',
      results: {
        health,
        examsCount: exams.length,
        coursesCount: courses.length,
        notificationsCount: notifications.length
      }
    };
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    return {
      status: 'error',
      mode: API_CONFIG.USE_MOCK ? 'mock' : 'real',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// 在开发环境中暴露测试函数
if (import.meta.env.DEV) {
  (window as any).testAPI = testAPI;
  
  console.log(`
🔧 API 测试工具已加载
运行测试: await window.testAPI()

📋 当前环境变量:
- VITE_USE_MOCK: ${import.meta.env.VITE_USE_MOCK}
- VITE_API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL}

💡 切换 API 模式:
1. 编辑 .env 文件中的 VITE_USE_MOCK
2. 重新启动开发服务器
  `);
}

export { testAPI };
