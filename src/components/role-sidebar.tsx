import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft,
  LogOut,
  GraduationCap,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions, ModuleGuard } from '@/contexts/PermissionContext';
import { getMenusByRole, getRoleDisplayName, getRoleDescription } from '@/config/roleMenus';
import type { MenuItem, MenuSection } from '@/config/roleMenus';

interface RoleSidebarProps {
  className?: string;
}

export function RoleSidebar({ className = '' }: RoleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { } = usePermissions();
  
  if (!user) return null;

  const menuSections = getMenusByRole(user.currentRole);
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.path);
    
    return (
      <Link key={item.id} to={item.path}>
        <Button
          variant={active ? 'secondary' : 'ghost'}
          className={`w-full justify-start gap-3 mb-1 h-auto py-3 ${
            isCollapsed ? 'px-3' : 'px-4'
          } ${active ? 'bg-blue-50 text-blue-700 border-blue-200' : 'hover:bg-gray-50'}`}
        >
          <item.icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-500'} shrink-0`} />
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-1">
                  {item.urgent && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                  {item.badge && (
                    <Badge variant={item.urgent ? 'destructive' : 'secondary'} className="text-xs px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              )}
            </div>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-72'
    } ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">
                  {getRoleDisplayName(user.currentRole)}工作台
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {getRoleDescription(user.currentRole)}
                  {user.currentRole === 'ta' && (
                    <Shield className="w-3 h-3 text-blue-500" />
                  )}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 p-0 hover:bg-gray-100"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-medium">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-blue-600">{user.school}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-6">
          {menuSections.map((section: MenuSection, sectionIndex: number) => (
            <div key={sectionIndex}>
              {!isCollapsed && (
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item: MenuItem) => {
                  // 对于需要权限检查的菜单项，使用ModuleGuard包装
                  if (item.id === 'questions' && user.currentRole === 'ta') {
                    return (
                      <ModuleGuard key={item.id} module="questionBank">
                        {renderMenuItem(item)}
                      </ModuleGuard>
                    );
                  }
                  
                  if (item.id === 'courses' && user.currentRole === 'ta') {
                    return (
                      <ModuleGuard key={item.id} module="courses">
                        {renderMenuItem(item)}
                      </ModuleGuard>
                    );
                  }

                  return renderMenuItem(item);
                })}
              </div>
              {sectionIndex < menuSections.length - 1 && !isCollapsed && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Role Switcher */}
      {!isCollapsed && user.availableRoles.length > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">切换角色</p>
            <div className="grid grid-cols-1 gap-1">
              {user.availableRoles.map((role) => (
                <Button
                  key={role}
                  variant={user.currentRole === role ? 'secondary' : 'ghost'}
                  size="sm"
                  className="justify-start h-8"
                  onClick={() => {
                    // TODO: 实现角色切换
                    console.log('切换到角色:', role);
                  }}
                >
                  {getRoleDisplayName(role)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="text-center text-xs text-gray-500">
              <p>川大在线考试系统</p>
              <p>v2.0.0</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-8 h-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
