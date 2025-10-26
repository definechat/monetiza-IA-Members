import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCarousel from '../components/CourseCarousel';
import HeroBanner from '../components/HeroBanner';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import CoursePasswordModal from '../components/CoursePasswordModal';
import { useCourseAccess } from '../hooks/useCourseAccess';
import { Course, allCourses } from '../data/mockCourses';

// IDs for the carousels
const popularCourseIds = ['curso-1', 'curso-2', 'curso-3', 'curso-4', 'curso-5'];
const newCourseIds = ['curso-6', 'curso-7', 'curso-8', 'curso-9', 'curso-10'];

const popularCourses = allCourses.filter(course => popularCourseIds.includes(course.id));
const newCourses = allCourses.filter(course => newCourseIds.includes(course.id));


const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { unlockCourse } = useCourseAccess();
  const navigate = useNavigate();

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

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-300">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
          <UserHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto">
            <HeroBanner />
            <div className="relative z-10 -mt-10 sm:-mt-16 md:-mt-20">
              <CourseCarousel title="Cursos Populares" courses={popularCourses} onCourseClick={handleCourseClick} />
              <CourseCarousel title="Novos Lançamentos" courses={newCourses} onCourseClick={handleCourseClick} />
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
