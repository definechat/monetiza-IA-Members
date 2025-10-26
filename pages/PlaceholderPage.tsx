import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';

const PlaceholderPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-blue-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                  Página em Construção
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                  Estamos trabalhando para trazer esta funcionalidade para você em breve.
              </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlaceholderPage;