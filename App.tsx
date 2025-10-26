import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ComunidadePage from './pages/ComunidadePage';
import FerramentasPage from './pages/FerramentasPage';
import ProfilePage from './pages/ProfilePage';
import PromptGeneratorPage from './pages/PromptGeneratorPage';
import ModulesPage from './pages/ModulesPage';
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/AdminRoute';
import VideoLessonPage from './pages/VideoLessonPage';
import PlaceholderPage from './pages/PlaceholderPage';
import BonusPage from './pages/BonusPage';
import BonusDetailsPage from './pages/BonusDetailsPage';
import { CourseAccessProvider } from './context/CourseAccessContext';

function App() {
  return (
    <AuthProvider>
      <CourseAccessProvider>
        <HashRouter>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/modules"
              element={
                <ProtectedRoute>
                  <ModulesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/modules/:moduleId/lessons/:lessonId"
              element={
                <ProtectedRoute>
                  <VideoLessonPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comunidade"
              element={
                <ProtectedRoute>
                  <ComunidadePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ferramentas"
              element={
                <ProtectedRoute>
                  <FerramentasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ferramentas/:toolType"
              element={
                <ProtectedRoute>
                  <PromptGeneratorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
           <Route
              path="/bonus"
              element={
                <ProtectedRoute>
                  <BonusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bonus/:bonusId"
              element={
                <ProtectedRoute>
                  <BonusDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/anotacoes"
              element={
                <ProtectedRoute>
                  <PlaceholderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meus-dados"
              element={
                <ProtectedRoute>
                  <PlaceholderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meus-pedidos"
              element={
                <ProtectedRoute>
                  <PlaceholderPage />
                </ProtectedRoute>
              }
            />
           <Route
              path="/minha-senha"
              element={
                <ProtectedRoute>
                  <PlaceholderPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </CourseAccessProvider>
    </AuthProvider>
  );
}

export default App;
