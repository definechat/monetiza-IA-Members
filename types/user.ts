export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  creationDate: string;
  document: string;
  status: 'Ativo' | 'Inativo';
  enrolledCourses?: string[];
}