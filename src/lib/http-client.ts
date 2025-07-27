import { API_CONFIG, getApiUrl } from '@/config/api';
import { showToast } from '@/lib/toast';

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// API 错误类型
export class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(
    message: string,
    status?: number,
    code?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// HTTP 客户端类
class HttpClient {
  private timeout: number;

  constructor() {
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(endpoint);
    
    // 设置默认头部
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 合并传入的头部
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // 从本地存储获取 token
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 创建请求配置
    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      // 创建 AbortController 用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 解析响应
      let responseData: ApiResponse<T>;
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // 非 JSON 响应，包装成标准格式
        const text = await response.text();
        responseData = {
          success: response.ok,
          data: text as T,
          message: response.ok ? 'Success' : 'Request failed',
        };
      }

      // 检查 HTTP 状态
      if (!response.ok) {
        const errorMessage = responseData.message || `HTTP ${response.status}: ${response.statusText}`;
        
        // 显示错误提示
        showToast.error({ 
          title: "请求失败",
          description: errorMessage 
        });
        
        throw new ApiError(
          errorMessage,
          response.status,
          responseData.code?.toString()
        );
      }

      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        // 如果是 ApiError，已经显示过 toast，直接抛出
        throw error;
      }

      let errorMessage = 'Unknown error occurred';
      let errorCode = 'UNKNOWN_ERROR';
      let status = 0;

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '请求超时，请重试';
          errorCode = 'TIMEOUT';
          status = 408;
        } else {
          errorMessage = `网络错误: ${error.message}`;
          errorCode = 'NETWORK_ERROR';
        }
      }

      // 显示错误提示
      showToast.error({ 
        title: "网络错误",
        description: errorMessage 
      });

      throw new ApiError(errorMessage, status, errorCode);
    }
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH 请求
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 导出单例实例
export const httpClient = new HttpClient();
