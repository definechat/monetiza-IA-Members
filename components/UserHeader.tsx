import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';

interface UserHeaderProps {
  className?: string;
  onToggleSidebar: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ className, onToggleSidebar }) => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const displayName = currentUser?.email?.split('@')[0] || (userRole === 'ADMIN' ? 'Administrador' : 'Usuário');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-30 ${className}`}>
      {/* Left Side: Toggle, Logo and Brand Name */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label="Toggle sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to="/dashboard" className="flex items-center">
          <img src="https://i.imgur.com/J8wO3gg.png" alt="Monetiza IA Logo" className="h-10 w-auto" />
          <span className="ml-3 text-xl font-bold text-white tracking-wider">Monetiza IA</span>
        </Link>
      </div>

      {/* Right Side: Actions and User Info */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <Link to="/dashboard" className="px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
          Meus Cursos
        </Link>
        <div className="relative" ref={notificationRef}>
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-gray-400 hover:text-white" aria-label="Notificações">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
          </button>
          {isNotificationsOpen && <NotificationDropdown />}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300 hidden md:inline">Olá, <span className="font-bold">{displayName}</span></span>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 hover:text-red-300 transition-colors"
            title="Sair"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;