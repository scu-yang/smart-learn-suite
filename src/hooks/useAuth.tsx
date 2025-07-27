import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'student' | 'teacher' | 'ta' | 'admin' | 'school_admin';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  school: string;
  avatar?: string;
  role: UserRole;
  primaryRole: UserRole;
  availableRoles: UserRole[];
  currentRole: UserRole;
}

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
    role: 'teacher',
    name: '张教授',
    description: '教师账号 - 可管理课程、题库、批改作业'
  },
  {
    email: 'student@scu.edu.cn', 
    password: 'student123',
    role: 'student',
    name: '李同学',
    description: '学生账号 - 可学习课程、参加考试、查看成绩'
  },
  {
    email: 'ta@scu.edu.cn',
    password: 'ta123', 
    role: 'ta',
    name: '王助教',
    description: '助教账号 - 协助教学、批改作业、管理学生'
  },
  {
    email: 'admin@scu.edu.cn',
    password: 'admin123',
    role: 'admin', 
    name: '系统管理员',
    description: '系统管理员 - 管理用户、监控系统、配置权限'
  },
  {
    email: 'school@scu.edu.cn',
    password: 'school123',
    role: 'school_admin',
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
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
    role: account.role,
    primaryRole: account.role,
    currentRole: account.role
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

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    const savedRole = localStorage.getItem('saved_role') as UserRole;
    
    if (token && savedRole) {
      // Find the test account for the saved role
      const account = testAccounts.find(acc => acc.role === savedRole);
      if (account) {
        const mockUser = createMockUser(account);
        setUser(mockUser);
      }
    } else {
      // Auto-login with a default student account for demonstration
      const defaultAccount = testAccounts.find(acc => acc.role === 'student');
      if (defaultAccount) {
        const mockUser = createMockUser(defaultAccount);
        setUser(mockUser);
        localStorage.setItem('auth_token', 'demo_token');
        localStorage.setItem('saved_role', defaultAccount.role);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if credentials match any test account
      const account = testAccounts.find(
        acc => acc.email === email && acc.password === password
      );
      
      if (!account) {
        throw new Error('用户名或密码错误');
      }

      // Create mock user based on the matching account
      const mockUser = createMockUser(account);
      
      // Save session
      localStorage.setItem('auth_token', 'mock_jwt_token_' + account.role);
      localStorage.setItem('saved_role', account.role);
      
      setUser(mockUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('saved_role');
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user && user.availableRoles.includes(role)) {
      const updatedUser = { ...user, currentRole: role };
      setUser(updatedUser);
      localStorage.setItem('saved_role', role);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
