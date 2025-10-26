import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, limit, setDoc } from 'firebase/firestore';

const initialCoursesData = [
  {
    course: {
      title: "Sistema Colheita",
      description: "Aprenda tudo sobre Sistema Colheita neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/2I5Bu3U.jpeg",
      isLocked: true,
      password: "123",
    },
    modules: [
      {
        module: {
          title: "Módulo 1: Introdução à Colheita Inteligente",
          description: "Boas-vindas ao curso e introdução aos conceitos de Agricultura 4.0.",
        },
        lessons: [
          {
            title: "Boas-vindas ao Curso",
            duration: "03:15",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Uma introdução calorosa ao curso, apresentando os objetivos e o que você aprenderá.",
          },
        ],
      },
      {
        module: {
          title: "Módulo 2: Sensores e Drones",
          description: "Aprenda a utilizar drones para mapeamento e a analisar os dados dos sensores.",
        },
        lessons: [
          {
            title: "Operação de Drones",
            duration: "12:30",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Guia prático para operar drones em campo para mapeamento agrícola.",
          },
        ],
      },
      {
        module: {
          title: "Módulo 3: Implementação Prática",
          description: "Estudos de caso práticos e os próximos passos na sua jornada com IA na agricultura.",
        },
        lessons: [
          {
            title: "Estudo de Caso Real",
            duration: "15:00",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Análise de um projeto de implementação de colheita inteligente do início ao fim.",
          },
        ],
      },
    ],
  },
  {
    course: {
      title: "Sora 2 Vídeo Infinito Grátis",
      description: "Aprenda tudo sobre Sora 2 neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/RAfF8wz.jpeg",
      isLocked: true,
      password: "123",
    },
    modules: [
      {
        module: { title: "Módulo 1: Introdução ao Sora 2", description: "Conceitos fundamentais da nova geração de vídeos com IA." },
        lessons: [{ title: "O que é o Sora 2?", duration: "04:50", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Descubra o poder da geração de vídeo com IA." }]
      },
      {
        module: { title: "Módulo 2: Criando seus Primeiros Vídeos", description: "Guia prático para gerar vídeos impressionantes." },
        lessons: [{ title: "Guia Prático", duration: "11:20", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Siga o passo a passo para criar seu primeiro vídeo." }]
      },
      {
        module: { title: "Módulo 3: Técnicas Avançadas", description: "Dicas e truques para levar suas criações a outro nível." },
        lessons: [{ title: "Prompts Avançados", duration: "09:10", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Aprenda a escrever prompts que geram resultados incríveis." }]
      },
    ],
  },
  {
    course: {
      title: "Criando Área de Membros com IA",
      description: "Aprenda tudo sobre Área de Membros com IA neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/nBM59eu.jpeg",
      isLocked: true,
      password: "123",
    },
    modules: [
      {
        module: { title: "Módulo 1: Planejamento", description: "Definindo a estrutura e as ferramentas para sua área de membros." },
        lessons: [{ title: "Estrutura Ideal", duration: "07:15", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Como planejar sua área de membros para o sucesso." }]
      },
      {
        module: { title: "Módulo 2: Construção com IA", description: "Utilize IA para acelerar o desenvolvimento do front-end e back-end." },
        lessons: [{ title: "Desenvolvimento Acelerado", duration: "14:00", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Veja como a IA pode construir o código para você." }]
      },
      {
        module: { title: "Módulo 3: Lançamento", description: "Estratégias para lançar e monetizar sua nova plataforma." },
        lessons: [{ title: "Estratégias de Venda", duration: "08:30", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Como vender o acesso à sua área de membros." }]
      },
    ],
  },
  {
    course: {
      title: "Criando Site Com IA (Grátis)",
      description: "Aprenda tudo sobre Site Com IA neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/K4v8GtW.jpeg",
      isLocked: false,
    },
    modules: [
      {
        module: { title: "Módulo 1: Conceitos Iniciais", description: "Entendendo como a IA pode criar um site do zero." },
        lessons: [{ title: "Introdução à Criação de Sites com IA", duration: "06:40", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Uma visão geral das ferramentas e possibilidades." }]
      },
      {
        module: { title: "Módulo 2: Mão na Massa", description: "Gerando o código e a estrutura do seu primeiro site." },
        lessons: [{ title: "Gerando o Código", duration: "12:55", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Um guia prático para gerar e customizar seu site." }]
      },
      {
        module: { title: "Módulo 3: Publicação", description: "Colocando seu site no ar de forma gratuita." },
        lessons: [{ title: "Hospedagem Gratuita", duration: "09:05", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Aprenda a publicar seu site sem custos." }]
      },
    ],
  },
  {
    course: {
      title: "Criando Chatbot Com IA",
      description: "Aprenda tudo sobre ChatBot Com IA neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/OH06Kq5.jpeg",
      isLocked: true,
      password: "123",
    },
    modules: [
       {
        module: { title: "Módulo 1: Fundamentos do Chatbot", description: "Entenda os conceitos básicos e a arquitetura de um chatbot com IA." },
        lessons: [{ title: "Introdução aos Chatbots", duration: "05:20", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Uma visão geral sobre o que são chatbots e como eles podem ser usados para automatizar o atendimento." }]
      },
      {
        module: { title: "Módulo 2: Construindo seu Primeiro Chatbot", description: "Passo a passo prático para criar e treinar seu primeiro chatbot." },
        lessons: [{ title: "Configurando o Ambiente", duration: "10:00", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Aprenda a configurar as ferramentas necessárias para o desenvolvimento do seu chatbot." }]
      },
      {
        module: { title: "Módulo 3: Publicação e Bônus", description: "Aprenda a publicar seu chatbot e acesse materiais extras." },
        lessons: [{ title: "Deploy do Chatbot", duration: "07:45", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Como publicar seu chatbot em plataformas como WhatsApp ou um site." }]
      },
    ],
  },
  {
    course: {
      title: "Facebook Ads para WhatsApp",
      description: "Aprenda tudo sobre Facebook Ads para WhatsApp neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/gB1xN7O.jpeg",
      isLocked: true,
      password: "123",
    },
    modules: [
      {
        module: { title: "Módulo 1: Estratégia de Campanha", description: "Planejando campanhas de alta conversão para WhatsApp." },
        lessons: [{ title: "O Funil 'Click-to-WhatsApp'", duration: "08:10", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Entenda a jornada do cliente do anúncio ao contato." }]
      },
      {
        module: { title: "Módulo 2: Criação dos Anúncios", description: "Criando copys e criativos que geram cliques." },
        lessons: [{ title: "Copy que Converte", duration: "11:45", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Técnicas de copywriting para anúncios de WhatsApp." }]
      },
      {
        module: { title: "Módulo 3: Otimização", description: "Analisando métricas e otimizando o custo por conversa." },
        lessons: [{ title: "Análise de Métricas", duration: "10:20", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Como ler os dados e tomar decisões para melhorar os resultados." }]
      },
    ],
  },
  {
    course: {
      title: "Kwai (Funil para o WhatsApp)",
      description: "Aprenda tudo sobre Kwai (Funil para o WhatsApp) neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/UMdT7Tr.jpeg",
      isLocked: true,
      password: "123",
    },
    modules: [
       {
        module: { title: "Módulo 1: Entendendo o Kwai", description: "Como funciona o algoritmo e o público da plataforma." },
        lessons: [{ title: "O Algoritmo do Kwai", duration: "06:30", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Segredos para viralizar no Kwai." }]
      },
      {
        module: { title: "Módulo 2: Criando Conteúdo Viral", description: "Ideias e formatos de vídeos que funcionam no Kwai." },
        lessons: [{ title: "Formatos de Sucesso", duration: "09:50", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Aprenda a criar vídeos que o público adora compartilhar." }]
      },
      {
        module: { title: "Módulo 3: O Funil para WhatsApp", description: "Como levar o tráfego do Kwai para uma conversa de vendas." },
        lessons: [{ title: "Convertendo Views em Leads", duration: "12:00", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Estratégias para transformar seguidores em clientes." }]
      },
    ],
  },
  {
    course: {
      title: "Monetizando com IA no YouTube",
      description: "Aprenda tudo sobre IA no YouTube neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/la4tUfX.jpeg",
      isLocked: true,
      password: "123",
    },
    modules: [
       {
        module: { title: "Módulo 1: Canais Dark com IA", description: "Crie canais de sucesso sem aparecer." },
        lessons: [{ title: "O que é um Canal Dark?", duration: "05:55", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Descubra o potencial de canais anônimos." }]
      },
      {
        module: { title: "Módulo 2: Produção Automatizada", description: "Use IA para criar roteiros, narrações e vídeos." },
        lessons: [{ title: "Ferramentas de Automação", duration: "13:40", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "O arsenal de IA para youtubers." }]
      },
      {
        module: { title: "Módulo 3: Monetização", description: "Estratégias para ganhar dinheiro com seu canal." },
        lessons: [{ title: "Fontes de Renda", duration: "10:10", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Além do AdSense: como monetizar de verdade." }]
      },
    ],
  },
  {
    course: {
      title: "lowTicket com IA",
      description: "Aprenda tudo sobre lowTicket neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/7gK2QyS.png",
      isLocked: true,
      password: "123",
    },
    modules: [
      {
        module: { title: "Módulo 1: Produto de Baixo Custo", description: "Como criar um produto digital irresistível e de baixo custo." },
        lessons: [{ title: "Ideação de Produto", duration: "08:00", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Encontrando a ideia perfeita para seu produto low-ticket." }]
      },
      {
        module: { title: "Módulo 2: Página de Vendas com IA", description: "Crie uma landing page de alta conversão usando inteligência artificial." },
        lessons: [{ title: "Copy e Design com IA", duration: "11:30", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Deixe a IA criar sua página de vendas." }]
      },
      {
        module: { title: "Módulo 3: Tráfego e Escala", description: "Estratégias para atrair compradores e escalar suas vendas." },
        lessons: [{ title: "Fontes de Tráfego", duration: "10:50", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Como levar as pessoas certas para sua oferta." }]
      },
    ],
  },
  {
    course: {
      title: "Criaçao de video com IA",
      description: "Aprenda tudo sobre criação de vídeos com IA neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/WQbRONq.jpeg",
      isLocked: true,
      password: "123",
    },
    modules: [
       {
        module: { title: "Módulo 1: Ferramentas de Geração de Vídeo", description: "Uma visão geral das melhores IAs para criar vídeos a partir de texto." },
        lessons: [{ title: "Top 5 Ferramentas de IA", duration: "09:25", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Análise das principais plataformas do mercado." }]
      },
      {
        module: { title: "Módulo 2: Do Roteiro à Renderização", description: "O processo completo para criar um vídeo com IA." },
        lessons: [{ title: "Guia Passo a Passo", duration: "15:00", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Crie seu primeiro vídeo, do início ao fim." }]
      },
      {
        module: { title: "Módulo 3: Editando e Finalizando", description: "Como editar o vídeo gerado pela IA para dar um toque profissional." },
        lessons: [{ title: "Dicas de Edição", duration: "10:15", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Ajustes finos para um resultado impecável." }]
      },
    ],
  },
];

export const seedInitialData = async () => {
  try {
    for (const courseData of initialCoursesData) {
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, where("title", "==", courseData.course.title), limit(1));
      const snapshot = await getDocs(q);

      let courseId: string;

      if (snapshot.empty) {
        // Course doesn't exist, create it
        const courseDocRef = await addDoc(coursesRef, courseData.course);
        courseId = courseDocRef.id;
      } else {
        // Course exists, forcefully update it using setDoc with merge to ensure data is correct
        const docRef = snapshot.docs[0].ref;
        courseId = snapshot.docs[0].id;
        await setDoc(docRef, courseData.course, { merge: true });
      }

      // Sync modules and lessons for the course
      for (const moduleData of courseData.modules) {
        const modulesRef = collection(db, 'courses', courseId, 'modules');
        const moduleQuery = query(modulesRef, where("title", "==", moduleData.module.title), limit(1));
        const moduleSnapshot = await getDocs(moduleQuery);
        
        let moduleId: string;

        if (moduleSnapshot.empty) {
          const moduleDocRef = await addDoc(modulesRef, moduleData.module);
          moduleId = moduleDocRef.id;
        } else {
          const moduleDocRef = moduleSnapshot.docs[0].ref;
          moduleId = moduleSnapshot.docs[0].id;
          await setDoc(moduleDocRef, moduleData.module, { merge: true });
        }

        for (const lessonData of moduleData.lessons) {
          const lessonsRef = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
          const lessonQuery = query(lessonsRef, where("title", "==", lessonData.title), limit(1));
          const lessonSnapshot = await getDocs(lessonQuery);

          if (lessonSnapshot.empty) {
            await addDoc(lessonsRef, lessonData);
          } else {
            const lessonDocRef = lessonSnapshot.docs[0].ref;
            await setDoc(lessonDocRef, lessonData, { merge: true });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
    throw error; // Re-throw to be caught by the caller
  }
};