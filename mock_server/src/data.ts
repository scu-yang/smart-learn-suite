import { User, UserRole } from './types';

// 模拟用户数据库
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'teacher001',
    name: '张老师',
    email: 'teacher@scu.edu.cn',
    password: 'teacher123', // 在实际应用中应该使用 bcrypt 哈希
    primaryRole: 'teacher',
    availableRoles: ['teacher'],
    currentRole: 'teacher',
    department: '数学系',
    school: '四川大学',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    username: 'student001',
    name: '李同学',
    email: 'student@scu.edu.cn',
    password: 'student123',
    primaryRole: 'student',
    availableRoles: ['student'],
    currentRole: 'student',
    department: '计算机学院',
    school: '四川大学',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    username: 'ta001',
    name: '王助教',
    email: 'ta@scu.edu.cn',
    password: 'ta123',
    primaryRole: 'ta',
    availableRoles: ['ta', 'student'],
    currentRole: 'ta',
    department: '数学系',
    school: '四川大学',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '4',
    username: 'admin001',
    name: '系统管理员',
    email: 'admin@scu.edu.cn',
    password: 'admin123',
    primaryRole: 'admin',
    availableRoles: ['admin', 'teacher', 'student'],
    currentRole: 'admin',
    department: '信息中心',
    school: '四川大学',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '5',
    username: 'school_admin001',
    name: '学校管理员',
    email: 'school@scu.edu.cn',
    password: 'school123',
    primaryRole: 'school_admin',
    availableRoles: ['school_admin', 'teacher', 'student'],
    currentRole: 'school_admin',
    department: '教务处',
    school: '四川大学',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// 查找用户
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const findUserByUsername = (username: string): User | undefined => {
  return mockUsers.find(user => user.username === username);
};

export const findUserByEmailOrUsername = (identifier: string): User | undefined => {
  return mockUsers.find(user => user.email === identifier || user.username === identifier);
};

// 添加新用户
export const addUser = (user: User): void => {
  mockUsers.push(user);
};

// 验证邮箱是否已存在
export const isEmailTaken = (email: string): boolean => {
  return mockUsers.some(user => user.email === email);
};

// 验证用户名是否已存在
export const isUsernameTaken = (username: string): boolean => {
  return mockUsers.some(user => user.username === username);
};
