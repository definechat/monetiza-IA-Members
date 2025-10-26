import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';

const tools = [
  {
    slug: 'roteiro-video',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Gerador de Roteiro de Vídeo',
    description: 'Crie roteiros otimizados para seus vídeos com IA, aumentando o engajamento e a retenção da sua audiência.',
  },
  {
    slug: 'gerador-oferta',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    ),
    title: 'Gerador de Oferta',
    description: 'Desenvolva ofertas irresistíveis para produtos low-ticket e ebooks, focadas na dor do seu público-alvo.',
  },
  {
    slug: 'criador-copys',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Criador de Copys para Anúncios',
    description: 'Gere textos persuasivos e de alta conversão para seus anúncios em segundos, otimizados para qualquer plataforma.',
  },
  {
    slug: 'planejador-conteudo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Planejador de Conteúdo',
    description: 'Organize seu calendário de publicações com um cronograma inteligente que sugere os melhores horários e tópicos.',
  },
  {
    slug: 'gerador-site',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    title: 'Gerador de Site',
    description: 'Crie prompts detalhados para gerar sites completos, desde a estrutura de front-end até a lógica de back-end.',
  },
  {
    slug: 'gerador-app',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    title: 'Gerador de App',
    description: 'Elabore prompts para desenvolver aplicativos funcionais, especificando tecnologias, features e design.',
  },
  {
    slug: 'gerador-area-membros',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    title: 'Gerador de Área de Membros',
    description: 'Crie prompts para sistemas de membros seguros, com controle de acesso, conteúdo e pagamentos.',
  },
  {
    slug: 'analisador-nicho',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Analisador de Nicho',
    description: 'Descubra nichos de mercado com alto potencial e baixa concorrência usando análise de dados avançada.',
  },
];

const FerramentasPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                Ferramentas para Monetizar
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 sm:text-xl">
                Acelere seu crescimento com nossa suíte de ferramentas exclusivas baseadas em IA.
              </p>
            </div>

            <div className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool, index) => (
                <div key={index} className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/20">
                  {tool.icon}
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-gray-400 mb-6 flex-grow">{tool.description}</p>
                  <Link to={`/ferramentas/${tool.slug}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 text-center">
                    Usar Ferramenta
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FerramentasPage;