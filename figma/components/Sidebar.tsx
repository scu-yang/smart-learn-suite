import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileQuestion, 
  FileText, 
  Bell, 
  ClipboardCheck, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Home
} from 'lucide-react';
import { cn } from './ui/utils';

const menuItems = [
  { icon: Home, label: '仪表盘', path: '/' },
  { icon: BookOpen, label: '我的课程', path: '/courses' },
  { icon: Users, label: '班级管理', path: '/classes' },
  { icon: FileQuestion, label: '题目管理', path: '/questions' },
  { icon: FileText, label: '考试管理', path: '/exams' },
  { icon: Bell, label: '通知管理', path: '/notifications' },
  { icon: ClipboardCheck, label: '批改中心', path: '/grading' },
  { icon: MessageSquare, label: '学生答疑', path: '/qa' },
  { icon: BarChart3, label: '学情报告', path: '/analytics' },
  { icon: Settings, label: '个人设置', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="w-8 h-8 text-sidebar-primary" />
          <span className="text-xl font-medium text-sidebar-foreground">教师门户</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}