import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';

const toolDetails: { [key: string]: { title: string; icon: React.ReactElement } } = {
  'roteiro-video': { title: 'Gerador de Roteiro de Vídeo', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  'gerador-oferta': { title: 'Gerador de Oferta', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
  'criador-copys': { title: 'Criador de Copys para Anúncios', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
  'planejador-conteudo': { title: 'Planejador de Conteúdo', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  'gerador-site': { title: 'Gerador de Site', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
  'gerador-app': { title: 'Gerador de App', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
  'gerador-area-membros': { title: 'Gerador de Área de Membros', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  'analisador-nicho': { title: 'Analisador de Nicho', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
};

const PromptGeneratorPage: React.FC = () => {
  const { toolType } = useParams<{ toolType: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [niche, setNiche] = useState('');
  const [pain, setPain] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const tool = toolType ? toolDetails[toolType] : { title: 'Ferramenta não encontrada', icon: null };
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleGenerate = () => {
    setIsLoading(true);
    setResult('');
    setCopySuccess('');

    setTimeout(() => {
      let generatedResult = '';
      if (toolType === 'roteiro-video') {
        const videoJson = {
          prompt: `Crie um roteiro de vídeo detalhado para o YouTube com duração de aproximadamente 5 minutos sobre "${prompt}". O roteiro deve ter uma introdução cativante, 3 pontos principais bem desenvolvidos, e uma conclusão com uma chamada para ação clara. O tom deve ser informativo e acessível para iniciantes.`,
          cameraOptions: ["close-up", "wide shot", "medium shot", "b-roll de exemplos"],
          voiceOptions: ["calm", "energetic", "motivational", "professional"],
          videoFormat: ["16:9 (YouTube)", "9:16 (Shorts/Reels/TikTok)"],
          speechLanguage: ["pt-BR", "en-US"],
        };
        generatedResult = JSON.stringify(videoJson, null, 2);
      } else if (toolType === 'gerador-oferta') {
        generatedResult = `
## **Headline:**
"Finalmente, a solução definitiva para ${niche} que sofrem com ${pain}!"

## **Problema:**
Você está cansado de ${pain}? Sabemos como é frustrante tentar de tudo e não ver resultados. A falta de uma solução clara pode te impedir de alcançar seus objetivos e te deixar preso em um ciclo de tentativas e erros.

## **Solução:**
Apresentamos o [Nome do Produto/Ebook]! Uma solução completa e passo a passo projetada especificamente para o público de ${niche}. Nosso método testado e aprovado ataca a raiz do problema: ${pain}.

## **Benefícios:**
- **Benefício 1:** Conquiste [Resultado Desejado] em tempo recorde.
- **Benefício 2:** Economize tempo e dinheiro, evitando os erros mais comuns.
- **Benefício 3:** Tenha acesso a um método exclusivo que realmente funciona.

## **Call to Action:**
Não espere mais! Clique aqui para adquirir o [Nome do Produto/Ebook] agora mesmo com um desconto especial de lançamento e transforme sua realidade!
        `;
      } else if (toolType === 'gerador-site') {
        generatedResult = `Crie o código completo para um site com as seguintes características: ${prompt}. O site deve ser responsivo, construído com HTML, CSS e JavaScript modernos. Inclua uma seção de header, uma seção "sobre", uma galeria de produtos/serviços e um rodapé com informações de contato. O design deve ser limpo e profissional.`;
      } else if (toolType === 'gerador-app') {
        generatedResult = `Crie um prompt detalhado para gerar um aplicativo. A ideia é: "${prompt}". Especifique as tecnologias a serem usadas (ex: React Native, Firebase), as principais funcionalidades (ex: login de usuário, feed de notícias, chat), e o design da interface do usuário (UI/UX), focando em uma experiência intuitiva.`;
      } else if (toolType === 'gerador-area-membros') {
        generatedResult = `Crie um prompt para desenvolver uma área de membros segura. A plataforma é sobre: "${prompt}". O sistema deve incluir autenticação de usuários, diferentes níveis de acesso (ex: Grátis, Pro, Premium), integração com gateway de pagamento (ex: Stripe), e uma área para consumir conteúdo exclusivo (vídeos, textos).`;
      }
      else {
        generatedResult = `Resultado gerado com base na sua solicitação para "${tool.title}":\n\n- Ponto principal 1 derivado de "${prompt}".\n- Análise detalhada sobre o tópico.\n- Sugestão de próximos passos.`;
      }
      setResult(generatedResult.trim());
      setIsLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopySuccess('Copiado!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const renderInputs = () => {
    if (toolType === 'gerador-oferta') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nicho:</label>
            <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Ex: Marketing Digital para iniciantes" className="w-full bg-gray-700 text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Dor do Público:</label>
            <input type="text" value={pain} onChange={(e) => setPain(e.target.value)} placeholder="Ex: Dificuldade em gerar os primeiros leads" className="w-full bg-gray-700 text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Descreva o que você precisa:</label>
        <textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-gray-700 text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Seja o mais descritivo possível..."/>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <UserHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/ferramentas" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Voltar para Ferramentas
            </Link>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
                <div className="flex items-center mb-6">
                    {tool.icon}
                    <h1 className="text-3xl font-bold text-white">{tool.title}</h1>
                </div>
                <div className="space-y-6">
                    {renderInputs()}
                    <div className="text-right">
                        <button onClick={handleGenerate} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed inline-flex items-center justify-center min-w-[120px]">
                            {isLoading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Gerar'}
                        </button>
                    </div>
                    
                    {result && (
                        <div className="border-t border-gray-700 pt-6">
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-xl font-bold text-white">Resultado:</h2>
                              {toolType === 'roteiro-video' && (
                                  <button onClick={handleCopy} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                                      {copySuccess || 'Copiar JSON'}
                                  </button>
                              )}
                            </div>
                            <div className="bg-gray-900 rounded-md p-4 whitespace-pre-wrap text-gray-300 font-mono text-sm overflow-x-auto scrollbar-thin">
                                {result}
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PromptGeneratorPage;