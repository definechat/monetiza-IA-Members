// src/types/course.ts

export type LessonType = 'video' | 'text' | 'link';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  order: number;
  type: LessonType;
  videoUrl?: string;
  content?: string;
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