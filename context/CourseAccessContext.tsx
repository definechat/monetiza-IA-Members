// src/context/CourseAccessContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface CourseAccessContextType {
  unlockedCourses: Set<string>;
  unlockCourse: (courseId: string) => void;
  isCourseUnlocked: (courseId: string) => boolean;
}

export const CourseAccessContext = createContext<CourseAccessContextType | undefined>(undefined);

interface CourseAccessProviderProps {
  children: ReactNode;
}

export const CourseAccessProvider: React.FC<CourseAccessProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [unlockedCourses, setUnlockedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load from localStorage on user change
    if (currentUser) {
      try {
        const key = `unlockedCourses_${currentUser.uid}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          setUnlockedCourses(new Set(JSON.parse(stored)));
        } else {
          setUnlockedCourses(new Set()); // Reset for user if nothing is stored
        }
      } catch (error) {
        console.error("Failed to parse unlocked courses from localStorage", error);
        if (currentUser) {
          localStorage.removeItem(`unlockedCourses_${currentUser.uid}`);
        }
        setUnlockedCourses(new Set());
      }
    } else {
      // No user, clear the set
      setUnlockedCourses(new Set());
    }
  }, [currentUser]);

  const unlockCourse = (courseId: string) => {
    if (!currentUser) return; // Cannot unlock if not logged in

    setUnlockedCourses(prev => {
      const newSet = new Set(prev);
      newSet.add(courseId);
      const key = `unlockedCourses_${currentUser.uid}`;
      localStorage.setItem(key, JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const isCourseUnlocked = (courseId: string) => {
    return unlockedCourses.has(courseId);
  };

  const value = { unlockedCourses, unlockCourse, isCourseUnlocked };

  return (
    <CourseAccessContext.Provider value={value}>
      {children}
    </CourseAccessContext.Provider>
  );
};