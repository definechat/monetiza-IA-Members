import React, { useState, useMemo, useEffect } from 'react';
import { AdminUser } from '../../types/user';
import { Course } from '../../types/course';
import { useAuth } from '../../hooks/useAuth';
import EditUserModal from '../../components/admin/EditUserModal';

// A simple toast component for notifications
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseClasses = 'fixed top-5 right-5 z-50 px-4 py-3 rounded-md shadow-lg text-white animate-fade-in-down';
    const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {message}
        </div>
    );
};


const AdminStudentsPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ email: '', name: '', status: '', courseId: '' });
  
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [resettingUser, setResettingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const { adminGetAllUsers, adminResetPassword, adminDeleteUser, adminUpdateUser, getAllCourses } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [fetchedUsers, fetchedCourses] = await Promise.all([
                adminGetAllUsers(),
                getAllCourses(),
            ]);
            setUsers(fetchedUsers);
            setCourses(fetchedCourses);
        } catch (error) {
            setToast({ message: 'Falha ao carregar dados.', type: 'error' });
        }
        setLoading(false);
    };
    fetchData();
  }, [adminGetAllUsers, getAllCourses]);
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(filters.email.toLowerCase());
      const statusMatch = filters.status ? user.status === filters.status : true;
      const courseMatch = filters.courseId ? (user.enrolledCourses || []).includes(filters.courseId) : true;
      return nameMatch && emailMatch && statusMatch && courseMatch;
    });
  }, [users, filters]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveUser = async (updatedUser: AdminUser) => {
    try {
        const result = await adminUpdateUser(updatedUser.id, updatedUser);
        setUsers(currentUsers => currentUsers.map(u => (u.id === result.id ? result : u)));
        setToast({ message: 'Usuário atualizado com sucesso!', type: 'success' });
    } catch (error) {
        setToast({ message: 'Falha ao atualizar usuário.', type: 'error' });
    }
    setEditingUser(null);
  };
  
  const handleResetPassword = async () => {
    if (!resettingUser) return;
    try {
        await adminResetPassword(resettingUser.email);
        setToast({ message: `E-mail de redefinição de senha enviado para ${resettingUser.email}!`, type: 'success' });
    } catch (error) {
        setToast({ message: 'Falha ao enviar e-mail. Verifique se o e-mail é válido.', type: 'error' });
    }
    setResettingUser(null);
  };
  
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
        await adminDeleteUser(deletingUser.id);
        setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
        setToast({ message: 'Usuário deletado com sucesso!', type: 'success' });
    } catch (error) {
        setToast({ message: 'Falha ao deletar usuário.', type: 'error' });
    }
    setDeletingUser(null);
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Alunos</h1>
            <p className="text-gray-400 mt-1">Gerencie os usuários da sua plataforma.</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Filtrar por Nome" className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="email" value={filters.email} onChange={handleFilterChange} placeholder="Filtrar por Email" className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Filtrar por status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
              <select name="courseId" value={filters.courseId} onChange={handleFilterChange} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Filtrar por Curso</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-md h-full">Filtrar</button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center p-10 text-gray-400">Carregando usuários...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center p-10 text-gray-500">Nenhum usuário encontrado.</div>
              ) : (
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
                             <ActionButton onClick={() => setEditingUser(user)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>} className="text-gray-400 hover:text-white hover:bg-gray-700" title="Editar Usuário" />
                             <ActionButton onClick={() => setResettingUser(user)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>} className="text-gray-400 hover:text-white hover:bg-gray-700" title="Resetar Senha" />
                             <ActionButton onClick={() => setDeletingUser(user)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>} className="text-red-500 hover:text-red-400 hover:bg-red-500/20" title="Deletar Usuário" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />}
      
      {resettingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold text-white">Redefinir Senha</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Tem certeza que deseja enviar um link de redefinição de senha para <strong className="text-white">{resettingUser.email}</strong>?
                  </p>
                  <div className="mt-6 flex justify-end space-x-3">
                      <button onClick={() => setResettingUser(null)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                      <button onClick={handleResetPassword} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Confirmar</button>
                  </div>
              </div>
          </div>
      )}

      {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold text-white">Deletar Usuário</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Esta ação é irreversível. Tem certeza que deseja deletar o usuário <strong className="text-white">{deletingUser.name}</strong>?
                  </p>
                  <div className="mt-6 flex justify-end space-x-3">
                      <button onClick={() => setDeletingUser(null)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                      <button onClick={handleDeleteUser} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Deletar</button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default AdminStudentsPage;