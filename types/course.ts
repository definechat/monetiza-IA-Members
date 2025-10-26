// src/types/course.ts

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  isLocked: boolean;
  password?: string;
  order: number;
}