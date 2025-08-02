import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { authApi, saveAuthData, clearAuthData, getCurrentUser, isAuthenticated } from '@/lib/api';
import type { ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { isSuccess } from '@/lib/http-client';
import { toUser } from '@/lib/model';

interface AuthContextType {
  user: User | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
  testAccounts: TestAccount[];
}

export interface TestAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  description: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// 测试账号数据
export const testAccounts: TestAccount[] = [
  {
    email: 'teacher@scu.edu.cn',
    password: 'teacher123',
    role: 'Teacher',
    name: '张教授',
    description: '教师账号 - 可管理课程、题库、批改作业'
  },
  {
    email: 'student@scu.edu.cn', 
    password: 'student123',
    role: 'Student',
    name: '李同学',
    description: '学生账号 - 可学习课程、参加考试、查看成绩'
  },
  {
    email: 'ta@scu.edu.cn',
    password: 'ta123', 
    role: 'Ta',
    name: '王助教',
    description: '助教账号 - 协助教学、批改作业、管理学生'
  },
  {
    email: 'admin@scu.edu.cn',
    password: 'admin123',
    role: 'Admin', 
    name: '系统管理员',
    description: '系统管理员 - 管理用户、监控系统、配置权限'
  },
  {
    email: 'school@scu.edu.cn',
    password: 'school123',
    role: 'SchoolAdmin',
    name: '学校管理员', 
    description: '学校管理员 - 管理校级数据、生成报表'
  }
];

// Mock user data based on role
const createMockUser = (account: TestAccount): User => {
  const baseUser = {
    id: account.role + '_001',
    username: account.email.split('@')[0],
    name: account.name,
    email: account.email,
    school: '四川大学',
    department: account.role === 'Teacher' ? '数学学院' : account.role === 'Student' ? '计算机学院' : '管理学院',
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
    primaryRole: account.role,
    currentRole: account.role,
    createdAt: new Date().toISOString()
  };

  // Define available roles for each primary role
  const rolePermissions: Record<UserRole, UserRole[]> = {
    teacher: ['teacher', 'student'], // Teachers can switch to student view
    ta: ['ta', 'student'], // TAs can switch to student view
    student: ['student'], // Students only have student role
    admin: ['admin', 'teacher', 'student'], // Admins can switch to any role
    school_admin: ['school_admin', 'teacher', 'student'] // School admins can switch to teaching roles
  };

  return {
    ...baseUser,
    availableRoles: rolePermissions[account.role]
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 初始化时检查现有的认证状态
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // 检查本地存储中的用户信息
        const savedUser = getCurrentUser();
        const token = localStorage.getItem('x_token');
        
        if (savedUser && token && isAuthenticated()) {
          // 验证 token 是否仍然有效
          try {
            const response = await authApi.getProfile();
            if (isSuccess(response) && response.data) {
              const user = toUser(response.data);
              setUser(user);
            } else {
              console.warn('Token 无效，清除本地数据');
              clearAuthData();
              setUser(null);
            }
          } catch (error) {
            // API 调用失败，可能是网络问题或 token 过期
            console.warn('获取用户信息失败，使用本地缓存:', error);
            setUser(savedUser);
          }
        } else {
          // 没有有效的认证信息
          setUser(null);
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({
        email: email, 
        password: password
      });
      console.log('登录请求:', { email, password });
      if(isSuccess(response) && response.data) {
        const user = toUser(response.data);
        // 保存认证信息
        saveAuthData(response.data.token, user);
        setUser(user);

        // 登录成功后跳转到 dashboard
        router.navigate({ to: '/dashboard' });
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // 清除认证数据（包括新的 API 层认证信息）
    clearAuthData();
    
    // 清除本地状态
    localStorage.removeItem('auth_token');
    localStorage.removeItem('saved_role');
    setUser(null);
    
    // 跳转到登录页面
    router.navigate({ to: '/login' });
  };

  const switchRole = (role: UserRole) => {
    if (user && user.availableRoles.includes(role)) {
      const updatedUser = { ...user, currentRole: role };
      setUser(updatedUser);
      
      // 保存更新的用户信息到本地存储
      const token = localStorage.getItem('auth_token');
      if (token) {
        saveAuthData(token, updatedUser);
      }
    }
  };

  const value = {
    user,
    currentRole: user?.currentRole || null,
    isAuthenticated: !!user,
    login,
    logout,
    switchRole,
    isLoading,
    testAccounts
  };
  console.log('AuthContext value:', value);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
