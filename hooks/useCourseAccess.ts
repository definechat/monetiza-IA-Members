
import { useContext } from 'react';
import { CourseAccessContext } from '../context/CourseAccessContext';

export const useCourseAccess = () => {
  const context = useContext(CourseAccessContext);
  if (context === undefined) {
    throw new Error('useCourseAccess must be used within a CourseAccessProvider');
  }
  return context;
};
