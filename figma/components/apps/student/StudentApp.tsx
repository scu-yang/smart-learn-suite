import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentDashboard } from './StudentDashboard';
import { StudentCourses } from './StudentCourses';
import { CourseStudy } from './CourseStudy';
import { ChapterStudy } from './ChapterStudy';
import { PracticeCenter } from './PracticeCenter';
import { PracticeSession } from './PracticeSession';
import { PracticeResult } from './PracticeResult';
import { StudentExams } from './StudentExams';
import { ExamDetail } from './ExamDetail';
import { ExamTaking } from './ExamTaking';
import { ExamResult } from './ExamResult';
import { ErrorBook } from './ErrorBook';
import { QAForum } from './QAForum';
import { LearningReport } from './LearningReport';
import { MathTest } from '../../common/MathTest';
import { ProfileSettings } from '../../common/ProfileSettings';

export function StudentApp() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/courses" element={<StudentCourses />} />
          <Route path="/course-study" element={<CourseStudy />} />
          <Route path="/course-study/chapter/:chapterId" element={<ChapterStudy />} />
          <Route path="/practice" element={<PracticeCenter />} />
          <Route path="/practice/session/:sessionId" element={<PracticeSession />} />
          <Route path="/practice/result/:resultId" element={<PracticeResult />} />
          <Route path="/exams" element={<StudentExams />} />
          <Route path="/exam/:examId" element={<ExamDetail />} />
          <Route path="/exam/:examId/taking" element={<ExamTaking />} />
          <Route path="/exam/:examId/result" element={<ExamResult />} />
          <Route path="/errors" element={<ErrorBook />} />
          <Route path="/forum" element={<QAForum />} />
          <Route path="/report" element={<LearningReport />} />
          <Route path="/math-test" element={<MathTest />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Routes>
      </div>
    </div>
  );
}