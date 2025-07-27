import React, { useState } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut, 
  RefreshCw,
  ChevronDown,
  User,
  GraduationCap,
  Shield,
  Users,
  Menu
} from 'lucide-react';
import { useIsMobile } from '../ui/use-mobile';

interface TopNavigationProps {
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
}

const roleIcons = {
  student: User,
  teacher: GraduationCap,
  ta: Users,
  admin: Shield,
  school_admin: Shield
};

const roleNames = {
  student: '学生',
  teacher: '教师',
  ta: '助教',
  admin: '系统管理员',
  school_admin: '学校管理员'
};

export function TopNavigation({ showSidebarToggle, onSidebarToggle }: TopNavigationProps) {
  const { user, currentRole, switchRole, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  if (!user || !currentRole) return null;

  const notifications = [
    { id: 1, title: '新的作业提交', content: '高等数学A - 第三章练习', time: '2分钟前', unread: true },
    { id: 2, title: '考试提醒', content: '线性代数期中考试将于明天开始', time: '1小时前', unread: true },
    { id: 3, title: '学生提问', content: '张同学在概率论讨论区提出了新问题', time: '3小时前', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Searching for:', searchQuery);
  };

  const CurrentRoleIcon = roleIcons[currentRole];

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
      {/* Left section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile sidebar toggle */}
        {isMobile && showSidebarToggle && onSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-base sm:text-lg font-medium hidden sm:block">智慧教学系统</h1>
        </div>
        
        {/* Search - 移动端隐藏 */}
        {!isMobile && (
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索课程、题目、用户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile search button */}
        {isMobile && (
          <Button variant="ghost" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        )}

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <h4 className="font-medium">通知中心</h4>
              <p className="text-sm text-muted-foreground">{unreadCount} 条未读消息</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b last:border-b-0 hover:bg-accent cursor-pointer ${
                    notification.unread ? 'bg-accent/50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-chart-1 rounded-full flex-shrink-0 ml-2 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{notification.content}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t">
              <Button variant="ghost" className="w-full" size="sm">
                查看所有通知
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Help - 移动端隐藏 */}
        {!isMobile && (
          <Button variant="ghost" size="icon">
            <HelpCircle className="w-4 h-4" />
          </Button>
        )}

        {/* Role Switcher - 移动端简化 */}
        {user.availableRoles.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`gap-2 ${isMobile ? 'px-2' : ''}`}>
                <CurrentRoleIcon className="w-4 h-4" />
                {!isMobile && <span>{roleNames[currentRole]}</span>}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>切换角色</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.availableRoles.map((role) => {
                const RoleIcon = roleIcons[role];
                return (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={currentRole === role ? 'bg-accent' : ''}
                  >
                    <RoleIcon className="w-4 h-4 mr-2" />
                    {roleNames[role]}
                    {currentRole === role && (
                      <Badge variant="secondary" className="ml-auto">
                        当前
                      </Badge>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`gap-2 pl-2 ${isMobile ? 'pr-0' : ''}`}>
              <Avatar className="w-7 h-7">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <div className="text-left">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.school}</p>
                </div>
              )}
              <ChevronDown className={`w-3 h-3 ${isMobile ? 'hidden' : ''}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              个人设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}