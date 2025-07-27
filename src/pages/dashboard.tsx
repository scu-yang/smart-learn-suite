import { useEffect } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { RoleSidebar } from "@/components/role-sidebar";
import { 
  StudentDashboard, 
  TeacherDashboard, 
  TADashboard, 
  AdminDashboard, 
  SchoolAdminDashboard 
} from "@/components/role-dashboards";

function DashboardContent() {
  const { user } = useAuth();

  if (!user) return null;

  // 根据用户角色显示不同的仪表盘
  const renderDashboard = () => {
    switch (user.currentRole) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'ta':
        return <TADashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'school_admin':
        return <SchoolAdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <PermissionProvider userRole={user.currentRole}>
      <div className="flex h-screen bg-gray-50">
        {/* 侧边栏 */}
        <RoleSidebar />
        
        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 顶部导航栏 */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('zh-CN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* 管理中心入口 */}
                {(user.currentRole === 'admin' || user.currentRole === 'teacher') && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      管理中心
                    </Button>
                  </Link>
                )}
                
                {/* 个人资料 */}
                <Link to="/profile">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </header>

          {/* 主内容 */}
          <main className="flex-1 overflow-auto p-6">
            {renderDashboard()}
          </main>
        </div>
      </div>
    </PermissionProvider>
  );
}

export function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // 如果用户未登录且不在加载中，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !user) {
      try {
        router.navigate({ to: '/login' });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }, [user, isLoading, router]);

  // 如果用户数据还在加载中，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  // 如果用户未登录，显示空状态（将被重定向）
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">正在跳转到登录页面...</div>
      </div>
    );
  }

  return <DashboardContent />;
}