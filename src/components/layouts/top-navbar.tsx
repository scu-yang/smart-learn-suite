import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Shield
} from 'lucide-react';

interface TopNavbarProps {
  title?: string;
  showSearch?: boolean;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function TopNavbar({ 
  title = '智慧教学系统', 
  showSearch = true, 
  onToggleSidebar 
}: TopNavbarProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3); // 模拟通知数量

  const handleLogout = () => {
    // 添加确认对话框
    if (window.confirm('确定要退出登录吗？')) {
      logout();
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'student': '学生',
      'teacher': '教师',
      'ta': '助教',
      'admin': '管理员',
      'school_admin': '学校管理员'
    };
    return roleMap[role] || '用户';
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'student': 'bg-blue-100 text-blue-800',
      'teacher': 'bg-green-100 text-green-800', 
      'ta': 'bg-purple-100 text-purple-800',
      'admin': 'bg-red-100 text-red-800',
      'school_admin': 'bg-orange-100 text-orange-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左侧：菜单按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">
              欢迎回来，{user?.name}
            </p>
          </div>
        </div>

        {/* 中间：搜索框 */}
        {showSearch && (
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="搜索课程、考试、通知..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>
        )}

        {/* 右侧：通知和用户菜单 */}
        <div className="flex items-center gap-4">
          {/* 通知按钮 */}
          <Button variant="ghost" size="sm" className="relative" asChild>
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* 消息按钮 */}
          <Button variant="ghost" size="sm" asChild>
            <Link to="/messages">
              <MessageSquare className="h-5 w-5" />
            </Link>
          </Button>

          {/* 用户下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                    {user?.name ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getRoleBadgeColor(user?.currentRole || '')}`}
                  >
                    {user?.currentRole === 'ta' && <Shield className="w-3 h-3 mr-1" />}
                    {getRoleDisplayName(user?.currentRole || '')}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  个人资料
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  设置
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
