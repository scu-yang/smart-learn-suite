import { useState, createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginForm, RegisterForm, AuthContextType } from '@/types';

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查本地存储的用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('解析用户数据失败:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginForm): Promise<void> => {
    setIsLoading(true);
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功 - 根据用户名判断角色
      let role: 'student' | 'teacher' | 'admin' = 'student';
      if (credentials.username.includes('admin')) {
        role = 'admin';
      } else if (credentials.username.includes('teacher')) {
        role = 'teacher';
      }
      
      const mockUser: User = {
        id: "1",
        username: credentials.username,
        email: `${credentials.username}@scu.edu.cn`,
        role,
        department: role === 'admin' ? '系统管理' : role === 'teacher' ? '计算机学院' : '计算机学院',
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      
      // 在实际应用中，这里应该保存 JWT token 到 localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterForm): Promise<void> => {
    setIsLoading(true);
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟注册成功
      console.log('注册成功:', data);
    } catch (error) {
      throw new Error('注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 使用认证的 hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
