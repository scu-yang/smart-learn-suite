import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  GraduationCap, 
  CheckSquare, 
  MessageSquare, 
  Bell, 
  Settings, 
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Shield,
  Download
} from 'lucide-react';
import { usePermissions } from '../../../contexts/PermissionContext';

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  requiredPermission?: {
    module: keyof import('../../../contexts/PermissionContext').TAPermissions;
    action: keyof import('../../../contexts/PermissionContext').Permission;
  };
}

const menuItems: MenuItem[] = [
  {
    title: '工作台',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: '我的课程',
    href: '/courses',
    icon: BookOpen,
    requiredPermission: {
      module: 'courseResourceManagement',
      action: 'view'
    }
  },
  {
    title: '班级管理',
    href: '/classes',
    icon: Users,
    requiredPermission: {
      module: 'classStudentManagement',
      action: 'view'
    }
  },
  {
    title: '批改中心',
    href: '/grading',
    icon: CheckSquare,
    requiredPermission: {
      module: 'homeworkGrading',
      action: 'view'
    }
  },
  {
    title: '题库管理',
    href: '/question-bank',
    icon: FileText,
    requiredPermission: {
      module: 'courseResourceManagement',
      action: 'view'
    }
  },
  {
    title: '考试管理',
    href: '/exams',
    icon: GraduationCap,
    requiredPermission: {
      module: 'courseResourceManagement',
      action: 'view'
    }
  },
  {
    title: '学习分析',
    href: '/analytics',
    icon: BarChart3,
    requiredPermission: {
      module: 'learningDataView',
      action: 'view'
    }
  },
  {
    title: '学生答疑',
    href: '/qa',
    icon: MessageSquare,
    requiredPermission: {
      module: 'discussionManagement',
      action: 'view'
    }
  },
  {
    title: '通知管理',
    href: '/notifications',
    icon: Bell,
    requiredPermission: {
      module: 'classAnnouncementManagement',
      action: 'view'
    }
  },
  {
    title: '数据导出',
    href: '/export',
    icon: Download,
    requiredPermission: {
      module: 'learningDataView',
      action: 'view'
    }
  },
  {
    title: '权限设置',
    href: '/permissions',
    icon: Shield,
  },
  {
    title: '个人设置',
    href: '/settings',
    icon: Settings,
  },
];

export function TASidebar() {
  const location = useLocation();
  const { hasPermission, isTeacher, userRole } = usePermissions();

  // 根据权限过滤菜单项
  const visibleMenuItems = menuItems.filter(item => {
    if (!item.requiredPermission) return true;
    return hasPermission(item.requiredPermission.module, item.requiredPermission.action);
  });

  return (
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold">
              {isTeacher ? '教师工作台' : '助教工作台'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isTeacher ? 'Teacher Platform' : 'Teaching Assistant'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.requiredPermission && !isTeacher && (
                    <Shield className="h-3 w-3 text-blue-500 ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className={`p-3 rounded-lg ${isTeacher ? 'bg-green-50' : 'bg-blue-50'}`}>
          <p className={`text-sm font-medium ${isTeacher ? 'text-green-900' : 'text-blue-900'}`}>
            {isTeacher ? '教师权限' : '助教权限'}
          </p>
          <p className={`text-xs mt-1 ${isTeacher ? 'text-green-700' : 'text-blue-700'}`}>
            {isTeacher 
              ? '您拥有完整的教学管理权限' 
              : '您的权限由主讲教师分配和管理'
            }
          </p>
        </div>
      </div>
    </div>
  );
}