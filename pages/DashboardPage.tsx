import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCarousel from '../components/CourseCarousel';
import HeroBanner from '../components/HeroBanner';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import CoursePasswordModal from '../components/CoursePasswordModal';
import { useCourseAccess } from '../hooks/useCourseAccess';
import { Course } from '../types/course';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { unlockCourse } = useCourseAccess();
  const navigate = useNavigate();
  const { getAllCourses } = useAuth();
  
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getAllCourses();
        setAllCourses(courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [getAllCourses]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const handlePasswordSuccess = (courseId: string) => {
    unlockCourse(courseId);
    handleCloseModal();
    navigate(`/courses/${courseId}/modules`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Example of splitting courses into categories. In a real app, this might come from the course data itself.
  const popularCourses = allCourses.slice(0, 5);
  const newCourses = allCourses.slice(5);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-300">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
          <UserHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto">
            <HeroBanner />
            <div className="relative z-10 -mt-10 sm:-mt-16 md:-mt-20">
              <CourseCarousel title="Cursos Populares" courses={popularCourses} onCourseClick={handleCourseClick} />
              {newCourses.length > 0 && <CourseCarousel title="Novos Lançamentos" courses={newCourses} onCourseClick={handleCourseClick} />}
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

export default DashboardPage;