export interface AdminUser {
  id: string;
  name: string;
  email: string;
  creationDate: string;
  document: string;
  status: 'Ativo' | 'Inativo';
}

export const adminUsers: AdminUser[] = [
  { id: '1296657', name: 'Eunice Alves Pires PRIM', email: 'eunicepires@yahoo.com.br', creationDate: '22/10/2025 16:41:58', document: '86085425953', status: 'Ativo' },
  { id: '1292150', name: 'ADRIANO BRASIL OLIVEIRA', email: 'trrunion1979@gmail.com', creationDate: '17/10/2025 09:58:07', document: '08539192837', status: 'Ativo' },
  { id: '1290564', name: 'Alex Alves Vieira', email: 'investor@gmail.com', creationDate: '14/10/2025 23:11:25', document: '21354319826', status: 'Ativo' },
  { id: '1288721', name: 'Carlos Andrade', email: 'carlos.a@example.com', creationDate: '12/10/2025 11:30:00', document: '12345678901', status: 'Ativo' },
  { id: '1288720', name: 'Beatriz Costa', email: 'bia.costa@example.com', creationDate: '11/10/2025 19:45:10', document: '98765432109', status: 'Inativo' },
  { id: '1288719', name: 'Daniel Ferreira', email: 'daniel.f@example.com', creationDate: '10/10/2025 08:00:00', document: '45678901234', status: 'Ativo' },
  { id: 'admin-001', name: 'Admin User', email: 'admin@monetiza.ia', creationDate: '01/01/2025 00:00:00', document: '00000000000', status: 'Ativo' },
];
