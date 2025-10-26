export const courseLessons: { [key: string]: { [key: string]: { title: string; lessons: { id: string; title: string; duration: string; videoUrl: string; isCompleted: boolean; description: string; }[] } } } = {
  'curso-1': {
    'modulo-1': {
      title: 'Módulo 1: Introdução à Colheita Inteligente',
      lessons: [
        { id: '1-1', title: 'Boas-vindas ao Curso', duration: '03:15', videoUrl: 'https://www.youtube.com/embed/mwher2r0mjk?si=OPoh0ZohjK-KdVQU', isCompleted: true, description: 'Uma introdução calorosa ao curso, apresentando os objetivos e o que você aprenderá.' },
        { id: '1-2', title: 'O que é Agricultura 4.0?', duration: '08:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: false, description: 'Explore os conceitos fundamentais da Agricultura 4.0 e como a tecnologia está revolucionando o campo.' }
      ]
    },
    'modulo-2': {
      title: 'Módulo 2: Sensores e Drones',
      lessons: [
        { id: '2-1', title: 'Utilizando Drones para Mapeamento', duration: '15:20', videoUrl: 'https://www.youtube.com/embed/R932C3G8_gY', isCompleted: false, description: 'Aprenda passo a passo como operar drones para mapear suas plantações de forma eficiente.' },
        { id: '2-2', title: 'Análise de Dados de Sensores', duration: '12:55', videoUrl: 'https://www.youtube.com/embed/PeGCPfturD0', isCompleted: false, description: 'Descubra como interpretar os dados coletados por sensores para tomar decisões mais inteligentes.' }
      ]
    },
    'modulo-3': {
        title: 'Módulo 3: Implementação Prática',
        lessons: [
            { id: '3-1', title: 'Estudo de Caso: Fazenda Conectada', duration: '22:10', videoUrl: 'https://www.youtube.com/embed/5y_hCj__h5c', isCompleted: false, description: 'Analise um estudo de caso real de uma fazenda que implementou com sucesso as tecnologias de IA.' },
            { id: '3-2', title: 'Próximos Passos na IA Agrícola', duration: '05:30', videoUrl: 'https://www.youtube.com/embed/sB2i3t5m88s', isCompleted: false, description: 'Conclusão do curso e uma visão sobre o futuro da inteligência artificial na agricultura.' }
        ]
    }
  },
  'curso-2': {
    'sora-modulo-1': {
      title: 'Módulo 1: Fundamentos do Sora 2',
      lessons: [
        { id: 's2-1-1', title: 'O que é o Sora 2?', duration: '07:30', videoUrl: 'https://www.youtube.com/embed/ad79nYk2keg', isCompleted: false, description: 'Descubra a revolução da geração de vídeos com IA e o potencial do Sora 2.' },
        { id: 's2-1-2', title: 'Acessando a Ferramenta', duration: '05:10', videoUrl: 'https://www.youtube.com/embed/R932C3G8_gY', isCompleted: false, description: 'Um guia passo a passo para obter acesso e configurar sua conta no Sora 2.' }
      ]
    },
    'sora-modulo-2': {
      title: 'Módulo 2: Técnicas de Prompt Avançadas',
      lessons: [
        { id: 's2-2-1', title: 'Anatomia de um Prompt Perfeito', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/PeGCPfturD0', isCompleted: false, description: 'Aprenda a estruturar seus prompts para obter os resultados mais precisos e criativos.' },
      ]
    }
  },
  'curso-3': {
    'membros-modulo-1': {
      title: 'Módulo 1: Planejamento e Estrutura',
      lessons: [
        { id: 'm3-1-1', title: 'Definindo seu Nicho e Conteúdo', duration: '11:45', videoUrl: 'https://www.youtube.com/embed/5y_hCj__h5c', isCompleted: false, description: 'Como escolher o nicho certo e planejar o conteúdo que seus membros vão amar.' },
      ]
    },
    'membros-modulo-2': {
      title: 'Módulo 2: Desenvolvimento com IA',
      lessons: [
        { id: 'm3-2-1', title: 'Gerando Código com IA', duration: '25:00', videoUrl: 'https://www.youtube.com/embed/sB2i3t5m88s', isCompleted: false, description: 'Veja na prática como usar IAs para gerar o código da sua plataforma, economizando tempo e recursos.' },
      ]
    },
    'membros-modulo-3': {
        title: 'Módulo 3: Monetização e Lançamento',
        lessons: [
            { id: 'm3-3-1', title: 'Modelos de Assinatura', duration: '13:30', videoUrl: 'https://www.youtube.com/embed/ad79nYk2keg', isCompleted: false, description: 'Escolha o modelo de monetização ideal para sua área de membros: mensal, anual ou vitalício.' },
        ]
    }
  },
  'curso-4': {
    'siteia-modulo-1': {
      title: 'Módulo 1: Fundamentos da Criação de Sites com IA',
      lessons: [
        { id: 'c4-1-1', title: 'Planejando seu Site', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/ad79nYk2keg', isCompleted: false, description: 'Como estruturar o prompt perfeito para a IA criar o site que você imaginou.' },
      ]
    },
    'siteia-modulo-2': {
      title: 'Módulo 2: Gerando e Personalizando o Código',
      lessons: [
        { id: 'c4-2-1', title: 'Deploy e Hospedagem Gratuita', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/R932C3G8_gY', isCompleted: false, description: 'Publique seu site gerado por IA na internet de forma gratuita e rápida.' },
      ]
    }
  },
  'curso-5': {
    'chatbot-modulo-1': {
      title: 'Módulo 1: Conceitos Essenciais de Chatbots',
      lessons: [
        { id: 'c5-1-1', title: 'Introdução aos Chatbots', duration: '09:20', videoUrl: 'https://www.youtube.com/embed/ad79nYk2keg', isCompleted: false, description: 'Entenda os fundamentos e a importância dos chatbots no cenário atual.' },
      ]
    },
    'chatbot-modulo-2': {
      title: 'Módulo 2: Construindo seu Primeiro Chatbot',
      lessons: [
        { id: 'c5-2-1', title: 'Ferramentas de IA para Chatbots', duration: '14:50', videoUrl: 'https://www.youtube.com/embed/R932C3G8_gY', isCompleted: false, description: 'Conheça as melhores ferramentas de IA para construir chatbots sem precisar programar.' },
      ]
    },
    'chatbot-modulo-3': {
      title: 'Módulo 3: Integração e Análise',
      lessons: [
          { id: 'c5-3-1', title: 'Integrando com WhatsApp e Sites', duration: '16:00', videoUrl: 'https://www.youtube.com/embed/sB2i3t5m88s', isCompleted: false, description: 'Conecte seu chatbot em diferentes plataformas para maximizar o alcance.' },
      ]
    }
  },
  'curso-6': {
    'fbads-modulo-1': {
        title: 'Módulo 1: Estratégias de Anúncios Click-to-WhatsApp',
        lessons: [
            { id: 'c6-1-1', title: 'Configurando sua Primeira Campanha', duration: '17:35', videoUrl: 'https://www.youtube.com/embed/PeGCPfturD0', isCompleted: false, description: 'Passo a passo para criar sua primeira campanha de anúncios focada em mensagens no WhatsApp.' },
        ]
    },
    'fbads-modulo-2': {
        title: 'Módulo 2: Otimização e Remarketing',
        lessons: [
            { id: 'c6-2-1', title: 'Analisando Métricas e Otimizando', duration: '13:10', videoUrl: 'https://www.youtube.com/embed/5y_hCj__h5c', isCompleted: false, description: 'Aprenda a ler as métricas do Facebook Ads e a otimizar suas campanhas para melhores resultados.' },
        ]
    },
    'fbads-modulo-3': {
      title: 'Módulo 3: Automação e Vendas',
      lessons: [
          { id: 'c6-3-1', title: 'Automação de Respostas no WhatsApp', duration: '18:20', videoUrl: 'https://www.youtube.com/embed/ad79nYk2keg', isCompleted: false, description: 'Use ferramentas para automatizar o primeiro contato e qualificar leads.' },
      ]
    }
  },
  'curso-7': {
    'kwai-modulo-1': {
        title: 'Módulo 1: Dominando o Kwai para Negócios',
        lessons: [
            { id: 'c7-1-1', title: 'Criando Conteúdo Viral', duration: '11:05', videoUrl: 'https://www.youtube.com/embed/sB2i3t5m88s', isCompleted: false, description: 'Descubra os segredos para criar vídeos curtos que viralizam no Kwai.' },
        ]
    },
    'kwai-modulo-2': {
        title: 'Módulo 2: Construindo um Funil de Vendas',
        lessons: [
            { id: 'c7-2-1', title: 'Da Visualização à Conversa', duration: '15:45', videoUrl: 'https://www.youtube.com/embed/ad79nYk2keg', isCompleted: false, description: 'Estratégias para criar uma chamada para ação eficaz e levar seus seguidores para o WhatsApp.' },
        ]
    },
    'kwai-modulo-3': {
      title: 'Módulo 3: Automação no WhatsApp',
      lessons: [
          { id: 'c7-3-1', title: 'Configurando Respostas Automáticas', duration: '14:00', videoUrl: 'https://www.youtube.com/embed/R932C3G8_gY', isCompleted: false, description: 'Aprenda a configurar ferramentas de automação para gerenciar o alto volume de leads.' },
      ]
    }
  },
  'curso-8': {
    'youtube-modulo-1': {
        title: 'Módulo 1: Canais Dark e Automação',
        lessons: [
            { id: 'c8-1-1', title: 'Criação de Roteiro com IA', duration: '19:20', videoUrl: 'https://www.youtube.com/embed/R932C3G8_gY', isCompleted: false, description: 'Como usar a IA para gerar roteiros de vídeo de alta qualidade em minutos.' },
        ]
    },
    'youtube-modulo-2': {
        title: 'Módulo 2: SEO e Crescimento de Canal',
        lessons: [
            { id: 'c8-2-1', title: 'Otimizando Títulos e Descrições', duration: '16:00', videoUrl: 'https://www.youtube.com/embed/PeGCPfturD0', isCompleted: false, description: 'Aprenda a usar palavras-chave e técnicas de SEO para que seus vídeos sejam encontrados.' },
        ]
    },
    'youtube-modulo-3': {
      title: 'Módulo 3: Estratégias de Monetização',
      lessons: [
          { id: 'c8-3-1', title: 'Além do AdSense', duration: '12:45', videoUrl: 'https://www.youtube.com/embed/5y_hCj__h5c', isCompleted: false, description: 'Descubra outras formas de monetizar seu canal, como marketing de afiliados e produtos próprios.' },
      ]
    }
  },
  'curso-9': {
    'lowticket-modulo-1': {
        title: 'Módulo 1: Criando Produtos Low-Ticket',
        lessons: [
            { id: 'c9-1-1', title: 'Ideias de Produtos Digitais', duration: '10:30', videoUrl: 'https://www.youtube.com/embed/5y_hCj__h5c', isCompleted: false, description: 'Brainstorming de ideias para e-books, planilhas e mini-cursos que você pode criar com IA.' },
        ]
    },
    'lowticket-modulo-2': {
        title: 'Módulo 2: Funis de Venda Automatizados',
        lessons: [
            { id: 'c9-2-1', title: 'Configurando a Página de Vendas', duration: '21:15', videoUrl: 'https://www.youtube.com/embed/sB2i3t5m88s', isCompleted: false, description: 'Como criar uma página de vendas de alta conversão para seu produto low-ticket.' },
        ]
    },
    'lowticket-modulo-3': {
      title: 'Módulo 3: Upsell e Esteira de Produtos',
      lessons: [
          { id: 'c9-3-1', title: 'Criando uma Esteira de Produtos', duration: '17:50', videoUrl: 'https://www.youtube.com/embed/sB2i3t5m88s', isCompleted: false, description: 'Aprenda a oferecer produtos de maior valor para clientes que compraram seu produto low-ticket.' },
      ]
    }
  },
  'curso-10': {
    'videoia-modulo-1': {
      title: 'Módulo 1: Ferramentas de Geração de Vídeo',
      lessons: [
        { id: 'c10-1-1', title: 'De Texto para Vídeo', duration: '12:30', videoUrl: 'https://www.youtube.com/embed/PeGCPfturD0', isCompleted: false, description: 'Use IAs como a InVideo AI para criar vídeos a partir de simples prompts de texto.' },
      ]
    },
    'videoia-modulo-2': {
      title: 'Módulo 2: Edição e Finalização com IA',
      lessons: [
        { id: 'c10-2-1', title: 'Legendas Automáticas e Dublagem', duration: '14:00', videoUrl: 'https://www.youtube.com/embed/5y_hCj__h5c', isCompleted: false, description: 'Adicione legendas e até mesmo dublagens em outros idiomas com ferramentas de IA.' },
      ]
    }
  },
  // Default fallback for courses without specific mock data
  'default': {
    'default-module': {
      title: 'Módulo de Exemplo',
      lessons: [
        { id: 'd-1', title: 'Aula de Exemplo 1', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: false, description: 'Esta é a descrição para a aula de exemplo 1.' },
        { id: 'd-2', title: 'Aula de Exemplo 2', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: false, description: 'Esta é a descrição para a aula de exemplo 2.' }
      ]
    }
  }
};