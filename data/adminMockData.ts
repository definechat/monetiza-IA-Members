export interface AdminUser {
  id: string;
  name: string;
  email: string;
  creationDate: string;
  document: string;
  status: 'Ativo' | 'Inativo';
}

export const adminUsers: AdminUser[] = [];
