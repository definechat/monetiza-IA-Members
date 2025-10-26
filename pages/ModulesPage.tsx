import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import { allCourses } from '../data/mockCourses';
import { courseModules } from '../data/mockModules';
import { courseLessons } from '../data/mockLessons';
import { useCourseAccess } from '../hooks/useCourseAccess';

const ModulesPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isCourseUnlocked } = useCourseAccess();
  const course = allCourses.find(c => c.id === courseId);
  const modules = (courseId ? courseModules[courseId] : null) || [];

  if (course && course.isLocked && !isCourseUnlocked(course.id)) {
    // If course is locked and not in the unlocked set, redirect
    return <Navigate to="/dashboard" replace />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Curso não encontrado</h1>
        <Link to="/dashboard" className="mt-4 text-blue-400 hover:underline">
          Voltar para o Dashboard
        </Link>
      </div>
    );
  }
  
  const getFirstLessonId = (moduleId: string): string | null => {
    if (!courseId) return null;
    const lessonsForModule = courseLessons[courseId]?.[moduleId]?.lessons;
    return lessonsForModule && lessonsForModule.length > 0 ? lessonsForModule[0].id : null;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                Módulos: {course.title}
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Selecione um módulo para começar a aprender.
              </p>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => {
                const firstLessonId = getFirstLessonId(module.id);
                if (!firstLessonId) return null; // Or render a disabled card

                return (
                  <Link 
                    to={`/courses/${courseId}/modules/${module.id}/lessons/${firstLessonId}`} 
                    key={module.id} 
                    className="group bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/20 flex flex-col"
                  >
                    <img src={course.bannerUrl} alt={module.title} className="w-full h-48 object-cover" />
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                      <p className="text-gray-400 mb-6 flex-grow">{module.description}</p>
                      <span className="mt-auto w-full bg-blue-600 group-hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 text-center">
                          Acessar Módulo
                        </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModulesPage;
