import React from 'react';
import { NavLink } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
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
        <h2 className="text-lg font-semibold text-gray-300 uppercase">ADMINISTRADOR</h2>
      </div>
      <nav className="flex-grow space-y-2">
        <NavLink to="/admin/dashboard" className={navLinkClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Painel
        </NavLink>
        <NavLink to="/admin/students" className={navLinkClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Alunos
        </NavLink>
        <NavLink to="/admin/courses" className={navLinkClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Cursos
        </NavLink>
      </nav>

      {/* Toggle Button */}
      <button 
        onClick={onToggle}
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-gray-700 hover:bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center focus:outline-none z-50 transition-all"
        aria-label="Toggle sidebar"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
};

export default AdminSidebar;