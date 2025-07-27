import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionProvider } from '../../contexts/PermissionContext';
import { TopNavigation } from '../common/TopNavigation';
import { TeacherSidebar } from './teacher/TeacherSidebar';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { ClassManagement } from './teacher/ClassManagement';
import { ExamManagement } from './teacher/ExamManagement';
import { ExamCreationWizard } from './teacher/ExamCreationWizard';
import { GradingCenter } from './teacher/GradingCenter';
import { AnalyticsReport } from './teacher/AnalyticsReport';
import { ClassDetailReport } from './teacher/ClassDetailReport';
import { QAForum } from './teacher/QAForum';
import { NotificationManagement } from './teacher/NotificationManagement';
import { ProfileSettings } from '../common/ProfileSettings';
import { NotificationCenter } from '../common/NotificationCenter';
import { DataExportCenter } from '../common/DataExportCenter';
import { ResizableSidebar } from '../common/ResizableLayout';

// 助教权限配置
const taPermissions = {
  // 班级管理权限（针对特定班级）
  classManagement: { view: true, create: false, edit: true, delete: false },
  // 考试管理权限
  examManagement: { view: true, create: true, edit: true, delete: false },
  // 批改中心权限
  gradingCenter: { view: true, create: false, edit: true, delete: false },
  // 学情报告权限  
  analyticsReport: { view: true, create: false, edit: false, delete: false },
  // 学生答疑权限（完整权限）
  qaForum: { view: true, create: true, edit: true, delete: true },
  // 通知管理权限
  notificationManagement: { view: true, create: true, edit: true, delete: true },
  // 禁用的功能
  courseManagement: { view: false, create: false, edit: false, delete: false },
  questionBank: { view: false, create: false, edit: false, delete: false },
  assignmentCreation: { view: false, create: false, edit: false, delete: false }
};

export function TAApp() {
  return (
    <PermissionProvider userRole="ta" customPermissions={taPermissions}>
      <div className="flex h-screen bg-background">
        <ResizableSidebar 
          defaultWidth={250} 
          minWidth={200} 
          maxWidth={400}
          className="shrink-0"
          enableCollapse={true}
          label="助教导航"
        >
          <TeacherSidebar userRole="ta" />
        </ResizableSidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<TeacherDashboard userRole="ta" />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 班级管理 - 助教有权限 */}
              <Route path="/classes" element={<ClassManagement userRole="ta" />} />
              
              {/* 考试管理 - 助教有权限 */}
              <Route path="/exams" element={<ExamManagement userRole="ta" />} />
              <Route path="/exams/create" element={<ExamCreationWizard userRole="ta" />} />
              
              {/* 批改中心 - 助教有权限 */}
              <Route path="/grading" element={<GradingCenter userRole="ta" />} />
              
              {/* 学情报告 - 助教有权限 */}
              <Route path="/analytics" element={<AnalyticsReport userRole="ta" />} />
              <Route path="/analytics/class/:classId" element={<ClassDetailReport userRole="ta" />} />
              
              {/* 学生答疑 - 助教有完整权限 */}
              <Route path="/qa" element={<QAForum userRole="ta" />} />
              
              {/* 通知管理 - 助教有权限 */}
              <Route path="/notifications" element={<NotificationManagement userRole="ta" />} />
              
              {/* 通用功能 */}
              <Route path="/notification-center" element={<NotificationCenter />} />
              <Route path="/data-export" element={<DataExportCenter />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/settings" element={<ProfileSettings />} />
              
              {/* 重定向不允许的路由 */}
              <Route path="/courses/*" element={<Navigate to="/dashboard" replace />} />
              <Route path="/questions/*" element={<Navigate to="/dashboard" replace />} />
              <Route path="/assignments/*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </PermissionProvider>
  );
}