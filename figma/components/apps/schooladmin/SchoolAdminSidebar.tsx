import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  BookOpen, 
  BarChart3, 
  Bell, 
  CheckSquare, 
  Settings,
  School
} from 'lucide-react';

const menuItems = [
  {
    title: '校级概览',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: '用户管理',
    href: '/users',
    icon: Users,
  },
  {
    title: '课程管理',
    href: '/courses',
    icon: BookOpen,
  },
  {
    title: '数据报表',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: '通知管理',
    href: '/notifications',
    icon: Bell,
  },
  {
    title: '审批管理',
    href: '/approvals',
    icon: CheckSquare,
  },
  {
    title: '个人设置',
    href: '/settings',
    icon: Settings,
  },
];

export function SchoolAdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <School className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold">学校管理</h1>
            <p className="text-sm text-muted-foreground">School Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
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
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-900">学校管理员</p>
          <p className="text-xs text-blue-700 mt-1">
            管理本校的教学资源和用户
          </p>
        </div>
      </div>
    </div>
  );
}