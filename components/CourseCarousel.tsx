import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseAccess } from '../hooks/useCourseAccess';
import { Course } from '../types/course';

interface CourseCarouselProps {
  title: string;
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ title, courses, onCourseClick }) => {
  const { isCourseUnlocked } = useCourseAccess();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkArrowVisibility = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5); // Show if scrolled more than 5px
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // Show if there's more to scroll
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkArrowVisibility();
      container.addEventListener('scroll', checkArrowVisibility);
      window.addEventListener('resize', checkArrowVisibility);

      return () => {
        container.removeEventListener('scroll', checkArrowVisibility);
        window.removeEventListener('resize', checkArrowVisibility);
      };
    }
  }, [courses, checkArrowVisibility]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
        <div className="relative group">
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
          >
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleClick(course)}
                className="group/item flex-shrink-0 w-64 lg:w-[calc(20%-0.8rem)] cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-800 transform group-hover/item:scale-105 group-hover/item:z-10 group-hover/item:shadow-2xl transition-all duration-300">
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
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;