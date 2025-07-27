import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Badge } from '../../ui/badge';
import { 
  LayoutDashboard,
  BookOpen,
  Target,
  FileText,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Calculator,
  LogOut,
  User,
  BrainCircuit,
  GraduationCap,
  X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useIsMobile } from '../../ui/use-mobile';

interface StudentSidebarProps {
  onClose?: () => void;
}

const navigationItems = [
  {
    title: '学习中心',
    items: [
      { name: '学习概览', path: '/dashboard', icon: LayoutDashboard },
      { name: '我的课程', path: '/courses', icon: BookOpen },
      { name: '练习中心', path: '/practice', icon: Target },
      { name: '考试中心', path: '/exams', icon: FileText },
      { name: '错题本', path: '/errors', icon: AlertTriangle, badge: '12' },
    ]
  },
  {
    title: '交流与分析',
    items: [
      { name: '问答论坛', path: '/forum', icon: MessageSquare },
      { name: '学习报告', path: '/report', icon: BarChart3 },
    ]
  },
  {
    title: '开发工具',
    items: [
      { name: '公式测试', path: '/math-test', icon: Calculator },
    ]
  },
  {
    title: '个人中心',
    items: [
      { name: '个人设置', path: '/profile', icon: User },
    ]
  }
];

export function StudentSidebar({ onClose }: StudentSidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    // Handle root path
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const handleLinkClick = () => {
    // 在移动端点击链接后关闭侧边栏
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'w-64'} bg-sidebar border-r border-sidebar-border flex flex-col h-full`}>
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">智慧教学</h2>
              <p className="text-xs text-sidebar-foreground/60">学生端</p>
            </div>
          </div>
          {/* 移动端关闭按钮 */}
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm text-sidebar-foreground">张同学</p>
            <p className="text-xs text-sidebar-foreground/60">计算机科学与技术</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigationItems.map((section, index) => (
          <div key={index}>
            <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} onClick={handleLinkClick}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        isActive(item.path) 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                      size="sm"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </Button>
      </div>
    </div>
  );
}