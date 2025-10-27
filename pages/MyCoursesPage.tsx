import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import CoursePasswordModal from '../components/CoursePasswordModal';
import { useCourseAccess } from '../hooks/useCourseAccess';
import { Course } from '../types/course';
import { useAuth } from '../hooks/useAuth';

const MyCoursesPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { isCourseUnlocked, unlockCourse } = useCourseAccess();
  const navigate = useNavigate();
  const { getAllCourses } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const fetchedCourses = await getAllCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [getAllCourses]);

  const handleCourseClick = (course: Course) => {
    if (course.isLocked && !isCourseUnlocked(course.id)) {
      setSelectedCourse(course);
    } else {
      navigate(`/courses/${course.id}/modules`);
    }
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const handlePasswordSuccess = (courseId: string) => {
    unlockCourse(courseId);
    handleCloseModal();
    navigate(`/courses/${courseId}/modules`);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-300">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
          <UserHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                  Meus Cursos
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-gray-400">
                  Explore todo o catálogo de cursos disponíveis para você.
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => handleCourseClick(course)}
                      className="group/item cursor-pointer flex flex-col"
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-800 transform group-hover/item:scale-105 group-hover/item:shadow-2xl transition-all duration-300 h-full flex flex-col">
                        <img src={course.bannerUrl} alt={course.title} className="w-full aspect-[16/9] object-cover" />
                        {course.isLocked && !isCourseUnlocked(course.id) && (
                          <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full">
                            <LockIcon />
                          </div>
                        )}
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-base font-semibold text-white truncate">{course.title}</h3>
                          <p className="mt-1 text-xs text-gray-400 flex-grow h-12 overflow-hidden">{course.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      {selectedCourse && (
        <CoursePasswordModal
          course={selectedCourse}
          onClose={handleCloseModal}
          onSuccess={handlePasswordSuccess}
        />
      )}
    </>
  );
};

export default MyCoursesPage;
