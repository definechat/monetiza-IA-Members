import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import { useCourseAccess } from '../hooks/useCourseAccess';
import { Course, Module, Lesson } from '../types/course';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const VideoLessonPage: React.FC = () => {
  const { courseId, moduleId, lessonId } = useParams<{ courseId: string; moduleId: string; lessonId: string }>();
  const { isCourseUnlocked } = useCourseAccess();
  const { getLessonsForModule } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  
  const [course, setCourse] = useState<Course | null>(null);
  const [moduleInfo, setModuleInfo] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (!courseId || !moduleId) {
      setLoading(false);
      return;
    }
    
    const fetchLessonData = async () => {
      try {
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
          setCourse(courseData);

          if (courseData.isLocked && !isCourseUnlocked(courseId)) {
            setLoading(false);
            return;
          }
          
          const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
          const moduleSnap = await getDoc(moduleRef);
          if (moduleSnap.exists()) {
            setModuleInfo({ id: moduleSnap.id, ...moduleSnap.data() } as Module);
          }

          const fetchedLessons = await getLessonsForModule(courseId, moduleId);
          setLessons(fetchedLessons);
        }
      } catch (error) {
        console.error("Failed to fetch lesson data:", error);
      }
      setLoading(false);
    };
    
    fetchLessonData();

  }, [courseId, moduleId, isCourseUnlocked, getLessonsForModule]);
  
  const currentLessonIndex = lessons.findIndex(l => l.id === lessonId);
  const currentLesson = lessons[currentLessonIndex];
  
  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

  const toggleComplete = (id: string) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      // Auto-navigate to next lesson if available
      if (nextLesson) {
          navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`);
      }
      return newSet;
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (course && course.isLocked && !isCourseUnlocked(course.id)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!course || !moduleInfo || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Conteúdo não encontrado</h1>
        <p className="mt-2 text-lg text-gray-400">A aula que você está procurando não existe ou foi movida.</p>
        <Link to="/dashboard" className="mt-6 text-blue-400 hover:underline">
          Voltar para o Dashboard
        </Link>
      </div>
    );
  }

  const showSidebar = isSidebarOpen && !isCinemaMode;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Sidebar isOpen={showSidebar} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${showSidebar ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={toggleSidebar} className={`${isCinemaMode ? 'hidden' : ''}`} />
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          <div className="flex-grow bg-black transition-all duration-300 ease-in-out flex flex-col">
            <div className="w-full aspect-video flex-shrink-0">
              <iframe src={currentLesson.videoUrl} title={currentLesson.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="w-full h-full"></iframe>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 flex-grow">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{currentLesson.title}</h1>
              <p className="text-gray-400 mt-1">{course.title}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 my-6 border-y border-gray-800 py-4">
                <button onClick={() => setIsCinemaMode(!isCinemaMode)} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>Modo Cinema</span>
                </button>
                <button onClick={() => setIsLiked(!isLiked)} className="p-2 text-gray-300 transition-colors bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLiked ? 'text-red-500' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={() => setShowAnnotation(!showAnnotation)} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                  <span>{showAnnotation ? 'Fechar Anotação' : 'Adicionar Anotação'}</span>
                </button>
              </div>
              {showAnnotation && (
                <div className="mb-6 transition-all duration-300">
                  <h2 className="font-semibold text-white text-lg mb-2">Minhas Anotações</h2>
                  <textarea value={annotationText} onChange={(e) => setAnnotationText(e.target.value)} className="w-full bg-gray-800 text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5} placeholder="Digite suas anotações aqui..."></textarea>
                </div>
              )}
              <div className="mb-8">
                <h2 className="font-semibold text-white text-lg mb-2">Descrição e Material de Apoio</h2>
                <p className="text-gray-400 whitespace-pre-wrap">{currentLesson.description}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-800 pt-6">
                <Link to={prevLesson ? `/courses/${courseId}/modules/${moduleId}/lessons/${prevLesson.id}` : '#'} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!prevLesson ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Anterior</Link>
                <button onClick={() => toggleComplete(currentLesson.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${completedLessons.has(currentLesson.id) ? 'bg-green-600/20 text-green-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span>{completedLessons.has(currentLesson.id) ? 'Aula Concluída' : 'Concluir Aula'}</span>
                </button>
                <Link to={nextLesson ? `/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}` : '#'} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!nextLesson ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>Próxima Aula</Link>
              </div>
            </div>
          </div>
          <aside className={`w-full lg:w-1/4 lg:max-w-sm bg-gray-800 scrollbar-thin transition-all duration-300 ease-in-out ${isCinemaMode ? 'hidden' : 'flex-shrink-0'}`}>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-4">{moduleInfo.title}</h2>
              <ul className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isActive = lesson.id === lessonId;
                  return (
                    <li key={lesson.id}>
                      <Link to={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`} className={`flex items-start p-3 rounded-lg transition-colors w-full text-left ${isActive ? 'bg-blue-500/20' : 'hover:bg-gray-700'}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                            {completedLessons.has(lesson.id) ? 
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> :
                            <span className="text-sm font-bold">{index + 1}</span>
                            }
                        </div>
                        <div>
                          <p className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{lesson.title}</p>
                          <p className="text-xs text-gray-400">{lesson.duration}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="p-4 border-t border-gray-700">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>
                    <span>Entrar no grupo</span>
                </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default VideoLessonPage;