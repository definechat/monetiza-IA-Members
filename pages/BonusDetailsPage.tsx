import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Bonus } from '../types/bonus';

const BonusDetailsPage: React.FC = () => {
  const { bonusId } = useParams<{ bonusId: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bonus, setBonus] = useState<Bonus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bonusId) {
      setLoading(false);
      return;
    }
    const fetchBonus = async () => {
      setLoading(true);
      try {
        const bonusRef = doc(db, 'bonuses', bonusId);
        const bonusSnap = await getDoc(bonusRef);
        if (bonusSnap.exists()) {
          setBonus({ id: bonusSnap.id, ...bonusSnap.data() } as Bonus);
        }
      } catch (error) {
        console.error("Failed to fetch bonus details:", error);
      }
      setLoading(false);
    };
    fetchBonus();
  }, [bonusId]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(urlRegex).map((part, j) => 
          urlRegex.test(part) ? <a href={part} key={j} className="text-blue-400 hover:underline break-all" target="_blank" rel="noopener noreferrer">{part}</a> : part
        )}
        <br />
      </React.Fragment>
    ));
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-400">Carregando conteúdo...</div>;
    }

    if (!bonus) {
      return (
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
      );
    }
    
    return (
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
            </div>
          </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default BonusDetailsPage;