import type { UserRole } from '@/hooks/useAuth';
import { 
  LayoutDashboard,
  BookOpen,
  Target,
  FileText,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Calculator,
  User,
  Users,
  ClipboardCheck,
  FileQuestion,
  Bell,
  Settings,
  Shield,
  Database,
  Award,
  GraduationCap,
  TrendingUp,
  Monitor,
  Archive
} from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon: any;
  badge?: string;
  urgent?: boolean;
  description?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

// 学生菜单配置
export const getStudentMenus = (): MenuSection[] => [
  {
    title: '学习中心',
    items: [
      { id: 'dashboard', name: '学习概览', path: '/dashboard', icon: LayoutDashboard, description: '查看学习进度和任务' },
      // pages/courses.tsx
      { id: 'courses', name: '我的课程', path: '/courses', icon: BookOpen, description: '课程学习和资料' },
      { id: 'practice', name: '练习中心', path: '/practice', icon: Target, description: '自主练习训练' },
      { id: 'exams', name: '考试中心', path: '/exams', icon: FileText, description: '参加考试和测验' },
      { id: 'errors', name: '错题本', path: '/errors', icon: AlertTriangle, badge: '12', description: '错题回顾和复习' },
    ]
  },
  {
    title: '交流与分析',
    items: [
      { id: 'qa', name: '问答论坛', path: '/qa', icon: MessageSquare, badge: '3', description: '学习交流讨论' },
      { id: 'reports', name: '学习报告', path: '/reports', icon: BarChart3, description: '成绩分析和学习建议' },
    ]
  },
  {
    title: '工具与设置',
    items: [
      { id: 'math-test', name: '公式测试', path: '/math-test', icon: Calculator, description: '数学公式渲染测试' },
      { id: 'profile', name: '个人设置', path: '/profile', icon: User, description: '账户信息和偏好设置' },
    ]
  }
];

// 教师菜单配置
export const getTeacherMenus = (): MenuSection[] => [
  {
    title: '教学管理',
    items: [
      { id: 'dashboard', name: '教学概览', path: '/dashboard', icon: LayoutDashboard, description: '教学工作台' },
      { id: 'courses', name: '我的课程', path: '/courses', icon: BookOpen, badge: '6', description: '课程管理' },
      { id: 'classes', name: '我的班级', path: '/classes', icon: Users, badge: '3', description: '班级管理' },
      { id: 'questions', name: '题库管理', path: '/questions', icon: FileQuestion, description: '题目资源' },
    ]
  },
  {
    title: '考试批改',
    items: [
      { id: 'exams', name: '考试管理', path: '/exams', icon: FileText, description: '作业/练习' },
      { id: 'grading', name: '批改中心', path: '/grading', icon: ClipboardCheck, badge: '23', urgent: true, description: '作业批改' },
    ]
  },
  {
    title: '分析交流',
    items: [
      { id: 'qa', name: '学生答疑', path: '/qa', icon: MessageSquare, badge: '5', description: '讨论区' },
      { id: 'analytics', name: '学情报告', path: '/analytics', icon: BarChart3, description: '数据分析' },
      { id: 'notifications', name: '通知管理', path: '/notifications', icon: Bell, description: '公告通知' },
    ]
  },
  {
    title: '设置',
    items: [
      { id: 'profile', name: '个人设置', path: '/profile', icon: User, description: '账户信息' },
    ]
  }
];

// 助教菜单配置  
export const getTAMenus = (): MenuSection[] => [
  {
    title: '辅助教学',
    items: [
      { id: 'dashboard', name: '助教工作台', path: '/dashboard', icon: LayoutDashboard, description: '工作概览' },
      { id: 'courses', name: '协助课程', path: '/courses', icon: BookOpen, badge: '4', description: '协助管理的课程' },
      { id: 'classes', name: '班级管理', path: '/classes', icon: Users, badge: '2', description: '学生管理' },
      { id: 'grading', name: '批改任务', path: '/grading', icon: ClipboardCheck, badge: '15', urgent: true, description: '作业批改' },
    ]
  },
  {
    title: '考试管理',
    items: [
      { id: 'exams', name: '考试管理', path: '/exams', icon: FileText, description: '考试安排' },
    ]
  },
  {
    title: '交流分析',
    items: [
      { id: 'qa', name: '学生答疑', path: '/qa', icon: MessageSquare, badge: '8', description: '答疑解惑' },
      { id: 'analytics', name: '学情报告', path: '/analytics', icon: BarChart3, description: '数据查看' },
      { id: 'notifications', name: '通知管理', path: '/notifications', icon: Bell, description: '公告发布' },
    ]
  },
  {
    title: '设置',
    items: [
      { id: 'profile', name: '个人设置', path: '/profile', icon: User, description: '账户信息' },
    ]
  }
];

// 系统管理员菜单配置
export const getAdminMenus = (): MenuSection[] => [
  {
    title: '系统概览',
    items: [
      { id: 'dashboard', name: '管理概览', path: '/dashboard', icon: LayoutDashboard, description: '系统概览' },
      { id: 'system-monitor', name: '系统监控', path: '/system-monitor', icon: Monitor, description: '性能监控' },
    ]
  },
  {
    title: '用户管理',
    items: [
      { id: 'users', name: '用户管理', path: '/users', icon: Users, description: '用户CRUD' },
      { id: 'permissions', name: '权限配置', path: '/permissions', icon: Shield, description: '角色权限' },
    ]
  },
  {
    title: '内容管理',
    items: [
      { id: 'courses', name: '课程管理', path: '/courses', icon: BookOpen, description: '课程监控' },
      { id: 'classes', name: '班级管理', path: '/classes', icon: Users, description: '班级监控' },
      { id: 'questions', name: '题库管理', path: '/questions', icon: Database, description: '题目资源' },
    ]
  },
  {
    title: '系统管理',
    items: [
      { id: 'audit-logs', name: '日志审计', path: '/audit-logs', icon: Archive, description: '操作日志' },
      { id: 'notifications', name: '通知管理', path: '/notifications', icon: Bell, description: '系统通知' },
      { id: 'settings', name: '系统设置', path: '/settings', icon: Settings, description: '参数配置' },
    ]
  },
  {
    title: '个人',
    items: [
      { id: 'profile', name: '个人设置', path: '/profile', icon: User, description: '账户设置' },
    ]
  }
];

// 学校管理员菜单配置
export const getSchoolAdminMenus = (): MenuSection[] => [
  {
    title: '校级概览',
    items: [
      { id: 'dashboard', name: '校级概览', path: '/dashboard', icon: LayoutDashboard, description: '数据大屏' },
      { id: 'analytics', name: '数据报表', path: '/analytics', icon: TrendingUp, description: '统计分析' },
    ]
  },
  {
    title: '人员管理',
    items: [
      { id: 'teachers', name: '教师管理', path: '/teachers', icon: GraduationCap, description: '教师信息' },
      { id: 'students', name: '学生管理', path: '/students', icon: Users, description: '学生信息' },
    ]
  },
  {
    title: '资源配置',
    items: [
      { id: 'course-allocation', name: '课程与用户分配', path: '/course-allocation', icon: BookOpen, description: '资源调配' },
      { id: 'resource-management', name: '资源管理', path: '/resources', icon: Database, description: '教学资源' },
    ]
  },
  {
    title: '审批管理',
    items: [
      { id: 'course-approval', name: '课程审批', path: '/course-approval', icon: Award, description: '课程审核' },
      { id: 'notifications', name: '通知管理', path: '/notifications', icon: Bell, description: '校级公告' },
    ]
  },
  {
    title: '设置',
    items: [
      { id: 'profile', name: '个人设置', path: '/profile', icon: User, description: '账户设置' },
    ]
  }
];

// 根据角色获取菜单配置
export function getMenusByRole(role: UserRole): MenuSection[] {
  switch (role) {
    case 'student':
      return getStudentMenus();
    case 'teacher':
      return getTeacherMenus();
    case 'ta':
      return getTAMenus();
    case 'admin':
      return getAdminMenus();
    case 'school_admin':
      return getSchoolAdminMenus();
    default:
      return getStudentMenus();
  }
}

// 角色显示名称
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'student': return '智慧教学系统';
    case 'teacher': return '教师工作台';
    case 'ta': return '助教工作台';
    case 'admin': return '系统管理员工作台';
    case 'school_admin': return '学校管理员工作台';
    default: return '智慧教学系统';
  }
}

// 角色描述
export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case 'student': return '智能学习体验';
    case 'teacher': return '智慧教学管理';
    case 'ta': return '教学辅助管理';
    case 'admin': return '系统管理中心';
    case 'school_admin': return '校级数据管理';
    default: return '在线学习平台';
  }
}
