import React from 'react';
import { NavLink } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive 
      ? 'bg-blue-600 text-white shadow-lg' 
      : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`;

  const iconClasses = "h-6 w-6 mr-3";

  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col p-4 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center mt-16 mb-4">
        <h2 className="text-lg font-semibold text-gray-300 uppercase">Admin</h2>
      </div>
      <nav className="flex-grow space-y-2">
        <NavLink to="/admin/dashboard" className={navLinkClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Dashboard
        </NavLink>
        <NavLink to="/admin/students" className={navLinkClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Alunos
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
