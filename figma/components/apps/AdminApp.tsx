import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TopNavigation } from '../common/TopNavigation';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminDashboard } from './admin/AdminDashboard';
import { UserManagement } from './admin/UserManagement';
import { SystemSettings } from './admin/SystemSettings';
import { SystemMonitor } from './admin/SystemMonitor';
import { DataManagement } from './admin/DataManagement';
import { PermissionConfig } from './admin/PermissionConfig';
import { AuditLogs } from './admin/AuditLogs';
import { ProfileSettings } from '../common/ProfileSettings';
import { NotificationCenter } from '../common/NotificationCenter';
import { DataExportCenter } from '../common/DataExportCenter';
import { ApiDocCenter } from '../admin/ApiDocCenter';
import { ResizableSidebar } from '../common/ResizableLayout';

export function AdminApp() {
  return (
    <div className="flex h-screen bg-background">
      <ResizableSidebar 
        defaultWidth={280} 
        minWidth={220} 
        maxWidth={400}
        className="shrink-0"
      >
        <AdminSidebar />
      </ResizableSidebar>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/system-monitor" element={<SystemMonitor />} />
            <Route path="/data-management" element={<DataManagement />} />
            <Route path="/permissions" element={<PermissionConfig />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/api-docs" element={<ApiDocCenter />} />
            <Route path="/data-export" element={<DataExportCenter />} />
            <Route path="/notification-center" element={<NotificationCenter />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/settings" element={<ProfileSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}