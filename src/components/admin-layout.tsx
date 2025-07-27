import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Database,
  Bell,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Shield,
  GraduationCap
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function AdminLayout({ children, currentPage, onPageChange }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const adminMenuItems = [
    { id: 'dashboard', label: '管理概览', icon: BarChart3, color: 'from-blue-500 to-blue-600', adminOnly: false },
    { id: 'class-management', label: '班级管理', icon: Users, color: 'from-green-500 to-green-600', adminOnly: false },
    { id: 'course-management', label: '课程管理', icon: BookOpen, color: 'from-purple-500 to-purple-600', adminOnly: false },
    { id: 'exam-management', label: '考试管理', icon: FileText, color: 'from-yellow-500 to-yellow-600', adminOnly: false },
    { id: 'question-bank', label: '题库管理', icon: Database, color: 'from-indigo-500 to-indigo-600', adminOnly: false },
    { id: 'notification-management', label: '通知管理', icon: Bell, color: 'from-pink-500 to-pink-600', adminOnly: false },
    { id: 'user-management', label: '用户管理', icon: User, color: 'from-red-500 to-red-600', adminOnly: true },
    { id: 'system-settings', label: '系统设置', icon: Settings, color: 'from-gray-500 to-gray-600', adminOnly: true }
  ];

  const teacherMenuItems = [
    { id: 'dashboard', label: '教师概览', icon: BarChart3, color: 'from-blue-500 to-blue-600', adminOnly: false },
    { id: 'class-management', label: '班级管理', icon: Users, color: 'from-green-500 to-green-600', adminOnly: false },
    { id: 'course-management', label: '课程管理', icon: BookOpen, color: 'from-purple-500 to-purple-600', adminOnly: false },
    { id: 'exam-management', label: '考试管理', icon: FileText, color: 'from-yellow-500 to-yellow-600', adminOnly: false },
    { id: 'question-bank', label: '题库管理', icon: Database, color: 'from-indigo-500 to-indigo-600', adminOnly: false },
    { id: 'notification-management', label: '通知管理', icon: Bell, color: 'from-pink-500 to-pink-600', adminOnly: false }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : teacherMenuItems;
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* 侧边栏 */}
      <div className={`relative z-10 bg-white/80 backdrop-blur-lg shadow-xl border-0 transition-all duration-300 flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-4 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                user?.role === 'admin' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}>
                {user?.role === 'admin' ? <Shield className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {user?.role === 'admin' ? '管理员中心' : '教师中心'}
                  </h2>
                  <p className="text-sm text-gray-600">{user?.username}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === 'question-bank') {
                        window.location.href = '/admin/question-bank';
                      } else {
                        onPageChange(item.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                      currentPage === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                        : 'text-gray-700 hover:bg-white/60 hover:shadow-md hover:scale-105'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === item.id 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 group-hover:bg-white/80'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        currentPage === item.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                      }`} />
                    </div>
                    {sidebarOpen && (
                      <span className={`font-medium transition-colors ${
                        currentPage === item.id ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 快速返回按钮 */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200/60">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-3" />
              返回学生端
            </Button>
          </div>
        )}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* 顶部栏 */}
        <header className="bg-white/80 backdrop-blur-lg shadow-lg border-0 px-6 py-4 min-h-[80px]">
          <div className="flex justify-between items-center h-full">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {filteredMenuItems.find(item => item.id === currentPage)?.label || '管理中心'}
              </h1>
              <p className="text-gray-600">
                {user?.role === 'admin' ? '系统管理员' : '教师'} · {user?.department}
              </p>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className="relative h-12 w-12 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    tabIndex={0}
                    role="button"
                    aria-label="用户菜单"
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64 bg-white/95 backdrop-blur-lg border border-gray-200/60 shadow-xl rounded-xl p-2"
                  align="end" 
                  forceMount
                  sideOffset={5}
                >
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900">{user?.username}</p>
                      <p className="text-xs leading-none text-gray-500">
                        {user?.role === 'admin' ? '系统管理员' : '教师'} · {user?.department}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-gray-200/60" />
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/dashboard'}
                    className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors px-3 py-2 rounded-lg mx-1"
                  >
                    <Home className="h-4 w-4 mr-3 text-blue-600" />
                    <span>返回学生端</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-gray-200/60" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 cursor-pointer transition-colors px-3 py-2 rounded-lg mx-1"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
