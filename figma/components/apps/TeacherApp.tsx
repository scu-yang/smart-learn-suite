import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionProvider } from '../../contexts/PermissionContext';
import { TopNavigation } from '../common/TopNavigation';
import { TeacherSidebar } from './teacher/TeacherSidebar';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { MyCourses } from './teacher/MyCourses';
import { CourseDetail } from './teacher/CourseDetail';
import { CourseCreation } from './teacher/CourseCreation';
import { AssignmentCreation } from './teacher/AssignmentCreation';
import { ClassManagement } from './teacher/ClassManagement';
import { QuestionBank } from './teacher/QuestionBank';
import { ExamManagement } from './teacher/ExamManagement';
import { ExamCreationWizard } from './teacher/ExamCreationWizard';
import { QuestionSelector } from './teacher/QuestionSelector';
import { QuestionBankBrowser } from './teacher/QuestionBankBrowser';
import { QuestionEditor } from './teacher/QuestionEditor';
import { GradingCenter } from './teacher/GradingCenter';
import { QAForum } from './teacher/QAForum';
import { AnalyticsReport } from './teacher/AnalyticsReport';
import { NotificationManagement } from './teacher/NotificationManagement';
import { OCRReviewPage } from './teacher/OCRReviewPage';
import { ProfileSettings } from '../common/ProfileSettings';
import { NotificationCenter } from '../common/NotificationCenter';
import { DataExportCenter } from '../common/DataExportCenter';
import { MathTest } from '../common/MathTest';
import { AdvancedMathTest } from '../common/AdvancedMathTest';
import { SimpleMathTest } from '../common/SimpleMathTest';
import { MultiSelectTest } from '../common/MultiSelectTest';
import { MathPerformanceTest } from '../common/MathPerformanceTest';
import { MathEnvironmentTest } from '../common/MathEnvironmentTest';
import { ClassDetailReport } from './teacher/ClassDetailReport';
import { ResizableSidebar } from '../common/ResizableLayout';
import ResizableLayoutDemo from '../common/ResizableLayoutDemo';

export function TeacherApp() {
  return (
    <PermissionProvider userRole="teacher">
      <div className="flex h-screen bg-background">
        <ResizableSidebar 
          defaultWidth={250} 
          minWidth={200} 
          maxWidth={400}
          className="shrink-0"
          enableCollapse={true}
          label="教师导航"
        >
          <TeacherSidebar />
        </ResizableSidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<TeacherDashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/courses" element={<MyCourses />} />
              <Route path="/courses/create" element={<CourseCreation />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/classes" element={<ClassManagement />} />
              <Route path="/questions" element={<QuestionBank />} />
              <Route path="/questions/select" element={<QuestionSelector />} />
              <Route path="/questions/browse" element={<QuestionBankBrowser />} />
              <Route path="/questions/create" element={<QuestionEditor />} />
              <Route path="/questions/edit/:id" element={<QuestionEditor />} />
              <Route path="/questions/ocr-review" element={<OCRReviewPage />} />
              <Route path="/questions/ocr-review/:taskId" element={<OCRReviewPage />} />
              <Route path="/exams" element={<ExamManagement />} />
              <Route path="/exams/create" element={<ExamCreationWizard />} />
              <Route path="/assignments/create" element={<AssignmentCreation />} />
              <Route path="/grading" element={<GradingCenter />} />
              <Route path="/qa" element={<QAForum />} />
              <Route path="/analytics" element={<AnalyticsReport />} />
              <Route path="/analytics/class/:classId" element={<ClassDetailReport />} />
              <Route path="/notifications" element={<NotificationManagement />} />
              <Route path="/notification-center" element={<NotificationCenter />} />
              <Route path="/data-export" element={<DataExportCenter />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/settings" element={<ProfileSettings />} />
              <Route path="/math-test" element={<MathTest />} />
              <Route path="/math-test/simple" element={<SimpleMathTest />} />
              <Route path="/math-test/advanced" element={<AdvancedMathTest />} />
              <Route path="/multi-select-test" element={<MultiSelectTest />} />
              <Route path="/math-performance" element={<MathPerformanceTest />} />
              <Route path="/math-environment-test" element={<MathEnvironmentTest />} />
              <Route path="/layout-demo" element={<ResizableLayoutDemo />} />
            </Routes>
          </main>
        </div>
      </div>
    </PermissionProvider>
  );
}