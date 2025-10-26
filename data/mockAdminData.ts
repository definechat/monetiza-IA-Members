import { UserRole } from '../types/user';

export interface AdminUserData {
  id: string;
  email: string;
  role: UserRole;
}

export const mockUsers: AdminUserData[] = [
  { id: 'uid-admin-01', email: 'admin@monetiza.ia', role: UserRole.ADMIN },
  { id: 'uid-member-02', email: 'carlos.silva@example.com', role: UserRole.MEMBER },
  { id: 'uid-member-03', email: 'juliana.alves@example.com', role: UserRole.MEMBER },
  { id: 'uid-member-04', email: 'bob.williams@example.com', role: UserRole.MEMBER },
];
