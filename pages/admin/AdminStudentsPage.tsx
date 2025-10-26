import React, { useState, useMemo } from 'react';
import { adminUsers, AdminUser } from '../../data/adminMockData';
import { useAuth } from '../../hooks/useAuth';

const AdminStudentsPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [filters, setFilters] = useState({ email: '', name: '', status: '' });
  const [isResetModalOpen, setIsResetModalOpen] = useState<AdminUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<AdminUser | null>(null);
  
  const { adminResetPassword, adminDeleteUser } = useAuth();
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(filters.email.toLowerCase());
      const statusMatch = filters.status ? user.status === filters.status : true;
      return nameMatch && emailMatch && statusMatch;
    });
  }, [users, filters]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleResetPassword = async () => {
    if (!isResetModalOpen) return;
    // NOTE: This is a simulated call.
    await adminResetPassword(isResetModalOpen.email);
    setIsResetModalOpen(null);
  };
  
  const handleDeleteUser = async () => {
    if (!isDeleteModalOpen) return;
     // NOTE: This is a simulated call.
    await adminDeleteUser(isDeleteModalOpen.id);
    setUsers(prev => prev.filter(u => u.id !== isDeleteModalOpen.id));
    setIsDeleteModalOpen(null);
  };
  
  const statusClasses: { [key: string]: string } = {
    'Ativo': 'bg-green-500/20 text-green-400',
    'Inativo': 'bg-red-500/20 text-red-400',
  };

  const ActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; className: string; title: string; }> = ({ onClick, icon, className, title }) => (
    <button onClick={onClick} title={title} className={`p-1.5 rounded-md transition-colors ${className}`}>
      {icon}
    </button>
  );

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Alunos</h1>
            <p className="text-gray-400 mt-1">Gerencie os usuários da sua plataforma.</p>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Filtrar por Nome" className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="email" value={filters.email} onChange={handleFilterChange} placeholder="Filtrar por Email" className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Filtrar por status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Filtrar</button>
            </div>
          </div>
          
          {/* Users Table */}
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aluno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data de Criação</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Documento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.creationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.document}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[user.status]}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                           <ActionButton onClick={() => alert('Função de edição não implementada.')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>} className="text-gray-400 hover:text-white hover:bg-gray-700" title="Editar Usuário" />
                           <ActionButton onClick={() => setIsResetModalOpen(user)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>} className="text-gray-400 hover:text-white hover:bg-gray-700" title="Resetar Senha" />
                           <ActionButton onClick={() => setIsDeleteModalOpen(user)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>} className="text-red-500 hover:text-red-400 hover:bg-red-500/20" title="Deletar Usuário" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold text-white">Redefinir Senha</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Tem certeza que deseja enviar um link de redefinição de senha para <strong className="text-white">{isResetModalOpen.email}</strong>?
                  </p>
                  <div className="mt-6 flex justify-end space-x-3">
                      <button onClick={() => setIsResetModalOpen(null)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                      <button onClick={handleResetPassword} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Confirmar</button>
                  </div>
              </div>
          </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold text-white">Deletar Usuário</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Esta ação é irreversível. Tem certeza que deseja deletar o usuário <strong className="text-white">{isDeleteModalOpen.name}</strong>?
                  </p>
                  <div className="mt-6 flex justify-end space-x-3">
                      <button onClick={() => setIsDeleteModalOpen(null)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                      <button onClick={handleDeleteUser} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Deletar</button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default AdminStudentsPage;
