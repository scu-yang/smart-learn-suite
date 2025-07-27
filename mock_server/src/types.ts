export type UserRole = 'student' | 'teacher' | 'ta' | 'admin' | 'school_admin';

export interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  password: string; // 在实际应用中应该是哈希后的密码
  avatar?: string;
  primaryRole: UserRole;
  availableRoles: UserRole[];
  currentRole: UserRole;
  department?: string;
  school?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  data?: {
    token: string;
    user: Omit<User, 'password'>;
  };
  timestamp: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
  school?: string;
  department?: string;
  name?: string;
}

export interface RegisterResponse {
  code: number;
  message: string;
  data?: {
    user: Omit<User, 'password'>;
  };
  timestamp: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  errors?: string[];
  timestamp: string;
}
