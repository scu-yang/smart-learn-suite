import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TopNavigation } from '../common/TopNavigation';
import { SchoolAdminSidebar } from './schooladmin/SchoolAdminSidebar';
import { SchoolAdminDashboard } from './schooladmin/SchoolAdminDashboard';
import { SchoolUserManagement } from './schooladmin/SchoolUserManagement';
import { SchoolCourseManagement } from './schooladmin/SchoolCourseManagement';
import { SchoolApprovalManagement } from './schooladmin/SchoolApprovalManagement';
import { SchoolDataReports } from './schooladmin/SchoolDataReports';
import { SchoolNotificationManagement } from './schooladmin/SchoolNotificationManagement';
import { ProfileSettings } from '../common/ProfileSettings';
import { NotificationCenter } from '../common/NotificationCenter';
import { DataExportCenter } from '../common/DataExportCenter';
import { ResizableSidebar } from '../common/ResizableLayout';

export function SchoolAdminApp() {
  return (
    <div className="flex h-screen bg-background">
      <ResizableSidebar 
        defaultWidth={270} 
        minWidth={220} 
        maxWidth={400}
        className="shrink-0"
      >
        <SchoolAdminSidebar />
      </ResizableSidebar>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<SchoolAdminDashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/users" element={<SchoolUserManagement />} />
            <Route path="/courses" element={<SchoolCourseManagement />} />
            <Route path="/approvals" element={<SchoolApprovalManagement />} />
            <Route path="/reports" element={<SchoolDataReports />} />
            <Route path="/notifications" element={<SchoolNotificationManagement />} />
            <Route path="/notification-center" element={<NotificationCenter />} />
            <Route path="/data-export" element={<DataExportCenter />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/settings" element={<ProfileSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}