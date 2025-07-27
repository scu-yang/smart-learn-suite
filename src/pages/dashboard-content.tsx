import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      {/* 快速操作区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">快速操作</h2>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('zh-CN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 管理中心入口 */}
            {(user.currentRole === 'admin' || user.currentRole === 'teacher') && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  管理中心
                </Button>
              </Link>
            )}
            
            {/* 测试入口 */}
            <Link to="/dashboard-test">
              <Button variant="ghost" size="sm">
                UI测试
              </Button>
            </Link>
            
            <Link to="/role-dashboard-test">
              <Button variant="ghost" size="sm">
                角色测试
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 角色专用仪表盘内容 */}
      <div className="min-h-0 flex-1">
        {renderDashboard()}
      </div>
    </div>
  );
}

export function DashboardPage() {
  return <DashboardContent />;
}
