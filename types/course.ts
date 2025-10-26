// src/types/course.ts

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  isLocked: boolean;
  password?: string;
}
