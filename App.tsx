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
import AdminRoute from './components/AdminRoute';
import LessonPage from './pages/LessonPage';
import PlaceholderPage from './pages/PlaceholderPage';
import BonusPage from './pages/BonusPage';
import BonusDetailsPage from './pages/BonusDetailsPage';
import { CourseAccessProvider } from './context/CourseAccessContext';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminCoursesListPage from './pages/admin/AdminCoursesListPage';
import AdminCourseEditPage from './pages/admin/AdminCourseEditPage';
import AdminBonusListPage from './pages/admin/AdminBonusListPage';
import MyCoursesPage from './pages/MyCoursesPage';

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
              path="/meus-cursos"
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
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
                  <LessonPage />
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
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="courses" element={<AdminCoursesListPage />} />
              <Route path="courses/:courseId/edit" element={<AdminCourseEditPage />} />
              <Route path="bonus" element={<AdminBonusListPage />} />
            </Route>
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