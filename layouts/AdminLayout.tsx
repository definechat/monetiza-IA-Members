import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserHeader from '../components/UserHeader';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-[#0f172a]">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;