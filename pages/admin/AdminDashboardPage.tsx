import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import UsersChart from '../../components/admin/UsersChart';
import { allCourses } from '../../data/mockCourses';
import { AdminUser } from '../../data/adminMockData';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { adminGetAllUsers } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const fetchedUsers = await adminGetAllUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };
    fetchUsers();
  }, [adminGetAllUsers]);

  const activeStudents = users.filter(u => u.status === 'Ativo').length;
  const inactiveStudents = users.length - activeStudents;
  const totalCourses = allCourses.length;
  const completionPercentage = 42; // Mocked data

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral da sua plataforma.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Alunos Ativos" 
            value={activeStudents.toString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            color="bg-cyan-500"
          />
          <StatCard 
            title="Alunos Inativos" 
            value={inactiveStudents.toString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            color="bg-rose-500"
          />
          <StatCard 
            title="Cursos" 
            value={totalCourses.toString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            color="bg-orange-500"
          />
          <StatCard 
            title="% que concluíram" 
            value={`${completionPercentage}%`}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
            color="bg-green-500"
          />
        </div>

        {/* Chart */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <UsersChart users={users} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;