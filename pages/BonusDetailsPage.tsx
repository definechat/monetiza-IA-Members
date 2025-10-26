import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import { bonusData } from '../data/bonusData';

const BonusDetailsPage: React.FC = () => {
  const { bonusId } = useParams<{ bonusId: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const bonus = bonusId ? bonusData.find(b => b.id === bonusId) : undefined;

  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(urlRegex).map((part, j) => 
          urlRegex.test(part) ? <a href={part} key={j} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{part}</a> : part
        )}
        <br />
      </React.Fragment>
    ));
  };

  if (!bonus) {
    return (
      <div className="flex h-screen bg-gray-900 text-gray-300">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
          <UserHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                Bônus não encontrado
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                O conteúdo que você está procurando não existe ou foi movido.
              </p>
              <Link to="/bonus" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors">
                Voltar para Bônus
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/bonus" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Voltar para Bônus
            </Link>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
              <h1 className="text-3xl font-bold text-white mb-2">{bonus.title}</h1>
              <p className="text-gray-400 mb-8">{bonus.description}</p>

              {bonus.content && (
                <div className="bg-gray-900 rounded-md p-4 whitespace-pre-wrap text-gray-300 text-sm overflow-x-auto scrollbar-thin">
                    {linkify(bonus.content)}
                </div>
              )}

              {bonus.fileUrl && (
                <div className="mt-8">
                  <a 
                    href={bonus.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Baixar Arquivo
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BonusDetailsPage;