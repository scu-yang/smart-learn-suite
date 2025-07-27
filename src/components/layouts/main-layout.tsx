import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionProvider } from '@/contexts/PermissionContext';
import { RoleSidebar } from '@/components/role-sidebar';
import { TopNavbar } from './top-navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
}

export function MainLayout({ children, title, showSearch = true }: MainLayoutProps) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <PermissionProvider userRole={user.currentRole}>
      <div className="flex h-screen bg-gray-50">
        {/* 侧边栏 */}
        <RoleSidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 顶部导航栏 */}
          <TopNavbar 
            title={title}
            showSearch={showSearch}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          {/* 页面内容 */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PermissionProvider>
  );
}
