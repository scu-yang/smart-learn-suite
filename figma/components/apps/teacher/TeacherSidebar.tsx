import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { cn } from '../../ui/utils';
import { 
  LayoutDashboard,
  BookOpen,
  Users,
  FileQuestion,
  FileText,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
  Bell,
  ChevronLeft,
  Plus,
  User,
  LogOut,
  Settings,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePermissions, ModuleGuard } from '../../../contexts/PermissionContext';

interface MenuItemProps {
  icon: any;
  label: string;
  path: string;
  description: string;
  badge?: string;
  urgent?: boolean;
  permission?: keyof import('../../../contexts/PermissionContext').TAPermissions;
  teacherOnly?: boolean;
}

interface TeacherSidebarProps {
  userRole?: 'teacher' | 'ta';
}

export function TeacherSidebar({ userRole }: TeacherSidebarProps = {}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { currentRole, logout } = useAuth();
  const { isTeacher, isTA, hasModuleAccess } = usePermissions();

  const effectiveRole = userRole || currentRole;
  const isTeacherRole = effectiveRole === 'teacher';
  const isTARole = effectiveRole === 'ta';

  const menuItems: MenuItemProps[] = [
    {
      icon: LayoutDashboard,
      label: '仪表盘',
      path: '/dashboard',
      description: isTeacherRole ? '教学概览' : '助教工作台'
    },
    {
      icon: BookOpen,
      label: '我的课程',
      path: '/courses',
      description: '课程管理',
      badge: '6',
      permission: 'courseManagement',
      teacherOnly: true
    },
    {
      icon: FileQuestion,
      label: '题库管理',
      path: '/questions',
      description: '题目资源',
      permission: 'questionBank',
      teacherOnly: true
    },
    {
      icon: Users,
      label: '我的班级',
      path: '/classes',
      description: '班级管理',
      badge: '3',
      permission: 'classManagement'
    },
    {
      icon: FileText,
      label: '考试管理',
      path: '/exams',
      description: '作业/练习',
      permission: 'examManagement'
    },
    {
      icon: ClipboardCheck,
      label: '批改中心',
      path: '/grading',
      description: '作业批改',
      badge: '23',
      urgent: true,
      permission: 'gradingCenter'
    },
    {
      icon: MessageSquare,
      label: '学生答疑',
      path: '/qa',
      description: '讨论区',
      badge: '5',
      permission: 'qaForum'
    },
    {
      icon: BarChart3,
      label: '学情报告',
      path: '/analytics',
      description: '数据分析',
      permission: 'analyticsReport'
    },
    {
      icon: Bell,
      label: '通知管理',
      path: '/notifications',
      description: '公告通知',
      permission: 'notificationManagement'
    }
  ];

  const settingsItems = [
    {
      icon: User,
      label: '个人设置',
      path: '/profile',
      description: '账户信息'
    }
  ];

  const devItems = [
    {
      icon: Zap,
      label: '数学性能测试',
      path: '/math-performance',
      description: '公式渲染优化'
    },
    {
      icon: Settings,
      label: '数学环境测试',
      path: '/math-environment-test',
      description: '环境渲染测试'
    },
    {
      icon: Settings,
      label: '功能测试',
      path: '/multi-select-test',
      description: '组件测试'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  // 过滤菜单项，根据权限和角色
  const getVisibleMenuItems = () => {
    return menuItems.filter(item => {
      // 如果是仅教师功能且当前是助教，则隐藏
      if (item.teacherOnly && isTARole) {
        return false;
      }
      
      // 如果需要特定权限，检查权限
      if (item.permission) {
        return hasModuleAccess(item.permission);
      }
      
      return true;
    });
  };

  const renderMenuItem = (item: any, showPermissionIcon = false) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="relative">
          <Icon className="w-5 h-5 flex-shrink-0" />
          {item.urgent && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          )}
        </div>
        
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.label}</p>
              <p className="text-xs text-muted-foreground truncate">{item.description}</p>
            </div>
            
            <div className="flex items-center gap-1">
              {showPermissionIcon && isTARole && (
                <Shield className="w-3 h-3 text-blue-500" />
              )}
              {item.badge && (
                <Badge 
                  variant={item.urgent ? "destructive" : "secondary"}
                  className="text-xs px-1.5 py-0.5"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          </>
        )}
        
        {isCollapsed && item.badge && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-chart-1 rounded-full" />
        )}
      </Link>
    );
  };

  const visibleMenuItems = getVisibleMenuItems();

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border transition-all duration-200 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-medium text-sidebar-foreground">
                {isTeacherRole ? '教师工作台' : '助教工作台'}
              </h2>
              <p className="text-xs text-sidebar-foreground/60">
                {isTeacherRole ? '智慧教学管理' : '教学辅助管理'}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* Quick Actions - 只对教师显示 */}
      {!isCollapsed && isTeacherRole && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="space-y-2">
            <Button size="sm" className="w-full justify-start gap-2">
              <Plus className="w-4 h-4" />
              创建课程
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start gap-2">
              <Plus className="w-4 h-4" />
              发布作业
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions - 助教版本 */}
      {!isCollapsed && isTARole && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="space-y-2">
            <ModuleGuard module="examManagement">
              <Button size="sm" className="w-full justify-start gap-2">
                <Plus className="w-4 h-4" />
                创建考试
              </Button>
            </ModuleGuard>
            <ModuleGuard module="notificationManagement">
              <Button size="sm" variant="outline" className="w-full justify-start gap-2">
                <Plus className="w-4 h-4" />
                发布通知
              </Button>
            </ModuleGuard>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {visibleMenuItems.map(item => renderMenuItem(item, !!item.permission))}
        </div>
      </nav>

      {/* Settings Section */}
      <div className="p-2 border-t border-sidebar-border">
        <div className="space-y-1">
          {settingsItems.map(item => renderMenuItem(item))}
        </div>
      </div>

      {/* Development Tools Section - 只对教师显示 */}
      {!isCollapsed && isTeacherRole && (
        <div className="p-2 border-t border-sidebar-border">
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
              开发工具
            </p>
          </div>
          <div className="space-y-1">
            {devItems.map(item => renderMenuItem(item))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {!isCollapsed && (
          <>
            <div className="text-center">
              <p className="text-xs text-sidebar-foreground/60">
                当前角色：{isTeacherRole ? '教师' : '助教'}
              </p>
              {isTARole && (
                <p className="text-xs text-blue-600 mt-1">
                  <Shield className="w-3 h-3 inline mr-1" />
                  权限受限
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </>
        )}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isTeacherRole ? 'bg-chart-2' : 'bg-blue-500'}`} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="w-8 h-8 text-sidebar-foreground hover:bg-sidebar-accent"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}