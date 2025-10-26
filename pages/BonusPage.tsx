import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import { bonusData } from '../data/bonusData';

const BonusPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                Bônus Exclusivos
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Acesse materiais exclusivos para acelerar ainda mais seus resultados.
              </p>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {bonusData.map((bonus) => (
                <div 
                  key={bonus.id} 
                  className="group bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/20 flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2">{bonus.title}</h3>
                    <p className="text-gray-400 mb-6 flex-grow">{bonus.description}</p>
                    <Link 
                      to={`/bonus/${bonus.id}`} 
                      className="mt-auto w-full bg-blue-600 group-hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 text-center"
                    >
                      Ver Conteúdo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BonusPage;