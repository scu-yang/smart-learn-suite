/**
 * 退出登录功能测试和验证
 */

import { clearAuthData, getAuthToken, getCurrentUser } from '@/lib/api';

// 测试退出登录功能
const testLogoutFunctionality = () => {
  console.log('🧪 开始测试退出登录功能...');
  
  // 1. 检查登录前状态
  console.log('📋 登录前状态:');
  console.log('- Token:', getAuthToken());
  console.log('- 用户信息:', getCurrentUser());
  
  // 2. 模拟登录状态
  localStorage.setItem('auth_token', 'test_token_12345');
  localStorage.setItem('user_data', JSON.stringify({
    id: '1',
    username: 'testuser',
    name: '测试用户',
    email: 'test@scu.edu.cn'
  }));
  localStorage.setItem('saved_role', 'student');
  
  console.log('\n📋 模拟登录后状态:');
  console.log('- Token:', getAuthToken());
  console.log('- 用户信息:', getCurrentUser());
  console.log('- 保存的角色:', localStorage.getItem('saved_role'));
  
  // 3. 执行退出登录清除
  console.log('\n🚪 执行退出登录清除...');
  clearAuthData();
  
  // 4. 检查清除后状态
  console.log('\n📋 退出登录后状态:');
  console.log('- Token:', getAuthToken());
  console.log('- 用户信息:', getCurrentUser());
  console.log('- auth_token:', localStorage.getItem('auth_token'));
  console.log('- user_data:', localStorage.getItem('user_data'));
  console.log('- saved_role:', localStorage.getItem('saved_role'));
  
  // 5. 验证结果
  const isCleared = !getAuthToken() && !getCurrentUser() && !localStorage.getItem('saved_role');
  console.log('\n✅ 清除结果:', isCleared ? '成功' : '失败');
  
  return isCleared;
};

// 在开发环境中暴露测试函数
if (import.meta.env.DEV) {
  (window as any).testLogout = testLogoutFunctionality;
  
  console.log(`
🔧 退出登录测试工具已加载
运行测试: window.testLogout()

📋 退出登录功能特性:
✅ 清除 localStorage 中的认证 token
✅ 清除用户数据
✅ 清除保存的角色信息
✅ 跳转到登录页面
✅ 确认对话框防止误操作

🎯 使用方法:
1. 登录系统
2. 点击右上角用户头像
3. 选择"退出登录"
4. 确认对话框中点击"确定"
5. 自动跳转到登录页面
  `);
}

export { testLogoutFunctionality };
