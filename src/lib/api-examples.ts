/**
 * API 使用示例
 * 
 * 这个文件展示了如何使用重构后的 API 层
 */

import { authApi, api, saveAuthData, clearAuthData, isAuthenticated } from '@/lib/api';
import type { LoginForm, RegisterForm } from '@/types';
import { isSuccess } from './http-client';
import { toUser } from './model';

// 1. 认证相关示例
export const authExamples = {
  // 登录示例
  async login() {
    try {
      const credentials: LoginForm = {
        email: 'student@scu.edu.cn',
        password: 'student123'
      };

      const response = await authApi.login(credentials);
      if (isSuccess(response) && response.data) {
        // 保存认证信息
        const user = toUser(response.data);
        saveAuthData(response.data.token, user);
        console.log('登录成功:', user);
        return user;
      }
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 注册示例
  async register() {
    try {
      const registerData: RegisterForm = {
        username: 'newuser',
        email: 'newuser@scu.edu.cn',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await authApi.register(registerData);
      if (response.success && response.data) {
        console.log('注册成功:', response.data.message);
        return response.data.user;
      }
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 获取用户信息示例
  async getUserProfile() {
    try {
      if (!isAuthenticated()) {
        throw new Error('用户未登录');
      }

      const response = await authApi.getProfile();
      if (response.success && response.data) {
        console.log('用户信息:', response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },

  // 登出示例
  logout() {
    clearAuthData();
    console.log('已登出');
  },

  // 健康检查示例
  async checkHealth() {
    try {
      const response = await authApi.checkHealth();
      if (response.success && response.data) {
        console.log('服务状态:', response.data.status);
        return response.data;
      }
    } catch (error) {
      console.error('健康检查失败:', error);
      throw error;
    }
  }
};

// 2. 数据获取示例
export const dataExamples = {
  // 获取考试列表
  async getExams() {
    try {
      const exams = await api.getExams();
      console.log('考试列表:', exams);
      return exams;
    } catch (error) {
      console.error('获取考试列表失败:', error);
      throw error;
    }
  },

  // 获取课程列表
  async getCourses() {
    try {
      const courses = await api.getCourses();
      console.log('课程列表:', courses);
      return courses;
    } catch (error) {
      console.error('获取课程列表失败:', error);
      throw error;
    }
  },

  // 获取通知列表
  async getNotifications() {
    try {
      const notifications = await api.getNotifications({
        isRead: false,
        limit: 10
      });
      console.log('未读通知:', notifications);
      return notifications;
    } catch (error) {
      console.error('获取通知失败:', error);
      throw error;
    }
  }
};

// 3. 切换 API 模式示例
export const switchModeExamples = {
  // 检查当前使用的是 Mock 还是真实 API
  getCurrentMode() {
    const isMock = import.meta.env.VITE_USE_MOCK === 'true';
    console.log(`当前使用 ${isMock ? 'Mock' : '真实'} API`);
    return isMock ? 'mock' : 'real';
  },

  // 在运行时切换模式（需要重新加载页面）
  showSwitchInstructions() {
    console.log(`
切换 API 模式步骤：
1. 编辑 .env 文件
2. 修改 VITE_USE_MOCK 的值：
   - true: 使用 Mock 数据
   - false: 使用真实后端 API
3. 重新启动开发服务器

当前配置：
- VITE_USE_MOCK: ${import.meta.env.VITE_USE_MOCK}
- VITE_API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL}
    `);
  }
};

// 4. 完整的登录流程示例
export const loginFlow = async () => {
  try {
    console.log('开始登录流程...');
    
    // 1. 检查健康状态
    await authExamples.checkHealth();
    
    // 2. 执行登录
    const user = await authExamples.login();
    
    // 3. 获取用户数据
    const exams = await dataExamples.getExams();
    const courses = await dataExamples.getCourses();
    const notifications = await dataExamples.getNotifications();
    
    console.log('登录流程完成:', {
      user,
      stats: {
        exams: exams.length,
        courses: courses.length,
        notifications: notifications.length
      }
    });
    
    return { user, exams, courses, notifications };
  } catch (error) {
    console.error('登录流程失败:', error);
    throw error;
  }
};

// 在开发环境中暴露到 window 对象，方便调试
if (import.meta.env.DEV) {
  (window as any).apiExamples = {
    auth: authExamples,
    data: dataExamples,
    switch: switchModeExamples,
    loginFlow
  };
  
  console.log(`
🚀 API 示例已加载到 window.apiExamples
可以在控制台中运行以下命令：

// 登录
await window.apiExamples.auth.login()

// 获取数据
await window.apiExamples.data.getExams()

// 完整登录流程
await window.apiExamples.loginFlow()

// 查看当前模式
window.apiExamples.switch.getCurrentMode()
  `);
}
