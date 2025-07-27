// API 配置
export const API_CONFIG = {
  // 开关：是否使用 mock 数据
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'false' ? false : true,
  
  // 后端 API 基础 URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api',
  
  // API 端点
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
    },
    USER: {
      PROFILE: '/user/profile',
    },
    HEALTH: '/health',
  },
  
  // 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // 请求重试次数
  RETRY_COUNT: 3,
};

// 获取完整的 API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
