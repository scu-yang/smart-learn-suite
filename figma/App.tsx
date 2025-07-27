import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ForgotPasswordSentPage } from './components/auth/ForgotPasswordSentPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { ResetPasswordSuccessPage } from './components/auth/ResetPasswordSuccessPage';
import { TeacherApp } from './components/apps/TeacherApp';
import { StudentApp } from './components/apps/student/StudentApp';
import { TAApp } from './components/apps/TAApp';
import { AdminApp } from './components/apps/AdminApp';
import { SchoolAdminApp } from './components/apps/SchoolAdminApp';
import { LoadingScreen } from './components/common/LoadingScreen';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, currentRole, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || !currentRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user, currentRole } = useAuth();

  if (!user || !currentRole) {
    return <Navigate to="/login" replace />;
  }

  switch (currentRole) {
    case 'teacher':
      return <TeacherApp />;
    case 'student':
      return <StudentApp />;
    case 'ta':
      return <TAApp />;
    case 'admin':
      return <AdminApp />;
    case 'school_admin':
      return <SchoolAdminApp />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Authentication routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route 
        path="/forgot-password" 
        element={user ? <Navigate to="/" replace /> : <ForgotPasswordPage />} 
      />
      <Route 
        path="/forgot-password-sent" 
        element={user ? <Navigate to="/" replace /> : <ForgotPasswordSentPage />} 
      />
      <Route 
        path="/reset-password" 
        element={user ? <Navigate to="/" replace /> : <ResetPasswordPage />} 
      />
      <Route 
        path="/reset-password-success" 
        element={user ? <Navigate to="/" replace /> : <ResetPasswordSuccessPage />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
}