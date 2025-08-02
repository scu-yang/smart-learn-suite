import type { LoginForm, RegisterForm, User } from '@/types';
import { API_CONFIG, LOCAL_STORAGE_KEYS } from '@/config/api';
import { httpClient, type ApiResponse } from '@/lib/http-client';
import type { LoginResponse, ProfileResponse } from '@/lib/model';


// 真实 API 实现
export const authApi = {
  async login(credentials: LoginForm): Promise<ApiResponse<LoginResponse>> {
    return httpClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  },

  async loginOut(): Promise<ApiResponse<{ message: boolean }>> {
    return httpClient.post<{ message: boolean }>(API_CONFIG.ENDPOINTS.AUTH.LOGIN_OUT);
  },

  async register(data: RegisterForm): Promise<ApiResponse<{ message: boolean }>> {
    return httpClient.post<{ message: boolean }>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  },

  async getProfile(): Promise<ApiResponse<ProfileResponse>> {
    return httpClient.post<ProfileResponse>(API_CONFIG.ENDPOINTS.USER.PROFILE);
  },

  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return httpClient.get<{ status: string; timestamp: string }>(API_CONFIG.ENDPOINTS.HEALTH);
  }
};

// 辅助函数：保存认证信息
export const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
};

// 辅助函数：清除认证信息
export const clearAuthData = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
};

// 辅助函数：获取当前用户信息
export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// 辅助函数：获取认证 token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) || null;
};

// 辅助函数：检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
