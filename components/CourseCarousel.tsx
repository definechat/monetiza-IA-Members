import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseAccess } from '../hooks/useCourseAccess';
// Fix: Updated course type import from missing mock file to the correct type definition file.
import { Course } from '../types/course';

interface CourseCarouselProps {
  title: string;
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ title, courses, onCourseClick }) => {
  const { isCourseUnlocked } = useCourseAccess();
  const navigate = useNavigate();

  const handleClick = (course: Course) => {
    if (course.isLocked && !isCourseUnlocked(course.id)) {
      onCourseClick(course);
    } else {
      navigate(`/courses/${course.id}/modules`);
    }
  };

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-2">
          {title}
        </h2>
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin px-4 sm:px-6 lg:px-8 py-4">
            {courses.map((course) => (
              <div 
                key={course.id} 
                onClick={() => handleClick(course)} 
                className="group flex-shrink-0 w-64 lg:w-[calc(20%-0.8rem)] cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-800 transform group-hover:scale-110 group-hover:z-10 group-hover:shadow-2xl transition-all duration-300">
                  <img src={course.bannerUrl} alt={course.title} className="w-full aspect-[16/9] object-cover" />
                  {course.isLocked && !isCourseUnlocked(course.id) && (
                    <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full">
                      <LockIcon />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="text-base font-semibold text-white truncate">{course.title}</h3>
                    <p className="mt-1 text-xs text-gray-400 h-8 overflow-hidden">{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;