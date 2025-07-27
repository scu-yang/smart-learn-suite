import type { LoginForm, RegisterForm, User } from '@/types';
import { API_CONFIG } from '@/config/api';
import { httpClient, type ApiResponse } from '@/lib/http-client';

// 认证相关的 API 响应类型
interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

interface RegisterResponse {
  user: User;
  message: string;
}

interface ProfileResponse {
  user: User;
}

// Mock 数据
const mockUser: User = {
  id: "1",
  username: "student123",
  name: "张三",
  email: "student123@scu.edu.cn",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student123",
  primaryRole: "student",
  availableRoles: ["student"],
  currentRole: "student",
  department: "计算机学院",
  school: "四川大学",
  createdAt: "2024-09-01T00:00:00Z"
};

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API 实现
const mockAuthApi = {
  async login(credentials: LoginForm): Promise<ApiResponse<LoginResponse>> {
    await delay(1000);
    
    // 简单的模拟验证
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const response: LoginResponse = {
        user: { ...mockUser, username: 'admin', primaryRole: 'admin', currentRole: 'admin' },
        token: 'mock_admin_token_' + Date.now(),
        expiresIn: 3600
      };
      return { success: true, data: response };
    }
    
    if (credentials.username === 'student' && credentials.password === 'student123') {
      const response: LoginResponse = {
        user: mockUser,
        token: 'mock_student_token_' + Date.now(),
        expiresIn: 3600
      };
      return { success: true, data: response };
    }
    
    throw new Error('用户名或密码错误');
  },

  async register(data: RegisterForm): Promise<ApiResponse<RegisterResponse>> {
    await delay(1200);
    
    // 模拟注册验证
    if (data.username === 'existing_user') {
      throw new Error('用户名已存在');
    }
    
    if (data.email === 'existing@email.com') {
      throw new Error('邮箱已被使用');
    }
    
    const newUser: User = {
      ...mockUser,
      id: 'new_user_' + Date.now(),
      username: data.username,
      email: data.email,
      name: data.username,
      createdAt: new Date().toISOString()
    };
    
    const response: RegisterResponse = {
      user: newUser,
      message: '注册成功'
    };
    
    return { success: true, data: response };
  },

  async getProfile(): Promise<ApiResponse<ProfileResponse>> {
    await delay(500);
    const response: ProfileResponse = {
      user: mockUser
    };
    return { success: true, data: response };
  },

  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    await delay(200);
    return {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString()
      }
    };
  }
};

// 真实 API 实现
const realAuthApi = {
  async login(credentials: LoginForm): Promise<ApiResponse<LoginResponse>> {
    return httpClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  },

  async register(data: RegisterForm): Promise<ApiResponse<RegisterResponse>> {
    return httpClient.post<RegisterResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  },

  async getProfile(): Promise<ApiResponse<ProfileResponse>> {
    return httpClient.get<ProfileResponse>(API_CONFIG.ENDPOINTS.USER.PROFILE);
  },

  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return httpClient.get<{ status: string; timestamp: string }>(API_CONFIG.ENDPOINTS.HEALTH);
  }
};

// 根据配置选择使用 Mock 还是真实 API
export const authApi = API_CONFIG.USE_MOCK ? mockAuthApi : realAuthApi;

// 辅助函数：保存认证信息
export const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_data', JSON.stringify(user));
};

// 辅助函数：清除认证信息
export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

// 辅助函数：获取当前用户信息
export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// 辅助函数：获取认证 token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// 辅助函数：检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
