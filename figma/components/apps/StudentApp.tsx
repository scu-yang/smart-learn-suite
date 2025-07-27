import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TopNavigation } from '../common/TopNavigation';
import { StudentSidebar } from './student/StudentSidebar';
import { StudentMobileNav } from './student/StudentMobileNav';
import { StudentDashboard } from './student/StudentDashboard';
import { StudentCourses } from './student/StudentCourses';
import { StudentExams } from './student/StudentExams';
import { ExamTaking } from './student/ExamTaking';
import { ExamResult } from './student/ExamResult';
import { ExamDetail } from './student/ExamDetail';
import { CourseStudy } from './student/CourseStudy';
import { ChapterStudy } from './student/ChapterStudy';
import { PracticeCenter } from './student/PracticeCenter';
import { PracticeSession } from './student/PracticeSession';
import { PracticeResult } from './student/PracticeResult';
import { ErrorBook } from './student/ErrorBook';
import { LearningReport } from './student/LearningReport';
import { QAForum } from './student/QAForum';
import { ProfileSettings } from '../common/ProfileSettings';
import { NotificationCenter } from '../common/NotificationCenter';
import { ResizableSidebar } from '../common/ResizableLayout';
import { useIsMobile } from '../ui/use-mobile';

export function StudentApp() {
  const isMobile = useIsMobile();

  if (isMobile) {
    // 移动端布局 - 不使用可调整侧边栏
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/courses" element={<StudentCourses />} />
              <Route path="/course/:courseId" element={<CourseStudy />} />
              <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterStudy />} />
              <Route path="/exams" element={<StudentExams />} />
              <Route path="/exams/:examId" element={<ExamDetail />} />
              <Route path="/exams/:examId/taking" element={<ExamTaking />} />
              <Route path="/exams/result" element={<ExamResult />} />
              <Route path="/practice" element={<PracticeCenter />} />
              <Route path="/practice/session/:sessionId" element={<PracticeSession />} />
              <Route path="/practice/result" element={<PracticeResult />} />
              <Route path="/errors" element={<ErrorBook />} />
              <Route path="/reports" element={<LearningReport />} />
              <Route path="/qa" element={<QAForum />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/settings" element={<ProfileSettings />} />
              <Route path="/notification-center" element={<NotificationCenter />} />
            </Routes>
          </main>
          <StudentMobileNav />
        </div>
      </div>
    );
  }

  // 桌面端布局 - 使用可调整侧边栏
  return (
    <div className="flex h-screen bg-background">
      <ResizableSidebar 
        defaultWidth={250} 
        minWidth={200} 
        maxWidth={350}
        className="shrink-0"
      >
        <StudentSidebar />
      </ResizableSidebar>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/courses" element={<StudentCourses />} />
            <Route path="/course/:courseId" element={<CourseStudy />} />
            <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterStudy />} />
            <Route path="/exams" element={<StudentExams />} />
            <Route path="/exams/:examId" element={<ExamDetail />} />
            <Route path="/exams/:examId/taking" element={<ExamTaking />} />
            <Route path="/exams/result" element={<ExamResult />} />
            <Route path="/practice" element={<PracticeCenter />} />
            <Route path="/practice/session/:sessionId" element={<PracticeSession />} />
            <Route path="/practice/result" element={<PracticeResult />} />
            <Route path="/errors" element={<ErrorBook />} />
            <Route path="/reports" element={<LearningReport />} />
            <Route path="/qa" element={<QAForum />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/notification-center" element={<NotificationCenter />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}