import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin-layout';
import { AdminDashboardPage } from '@/pages/admin/dashboard';
import { ClassManagementPage } from '@/pages/admin/class-management';
import { CourseManagementPage } from '@/pages/admin/course-management';
import { ExamManagementPage } from '@/pages/admin/exam-management';
import { NotificationManagementPage } from '@/pages/admin/notification-management';

export function AdminPortalPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问管理端</p>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboardPage />;
      case 'class-management':
        return <ClassManagementPage />;
      case 'course-management':
        return <CourseManagementPage />;
      case 'exam-management':
        return <ExamManagementPage />;
      case 'notification-management':
        return <NotificationManagementPage />;
      case 'user-management':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">用户管理</h2>
            <p className="text-gray-600">用户管理功能开发中...</p>
          </div>
        );
      case 'system-settings':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">系统设置</h2>
            <p className="text-gray-600">系统设置功能开发中...</p>
          </div>
        );
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </AdminLayout>
  );
}
