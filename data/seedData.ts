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
  // ... (rest of the courses with the same structure)
  {
    course: {
      title: "Aulão Monetiza IA",
      description: "Um aulão completo para você aprender a monetizar com Inteligência Artificial.",
      bannerUrl: "https://i.imgur.com/BMfQBfP.jpeg",
      isLocked: false,
    },
    modules: [
      {
        module: {
          title: "Módulo 1: Aulão Completo",
          description: "Assista à aula completa e aprofunde seus conhecimentos.",
        },
        lessons: [
          {
            title: "Aulão Completo - Parte Única",
            duration: "01:30:00",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Conteúdo detalhado do aulão, cobrindo todas as estratégias de monetização com IA.",
          },
        ],
      },
      {
        module: {
          title: "Módulo 2: Aulão Resumido",
          description: "Uma versão condensada da aula para revisão rápida dos pontos principais.",
        },
        lessons: [
          {
            title: "Resumo do Aulão",
            duration: "15:00",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Os principais insights e estratégias do aulão em um vídeo curto e objetivo.",
          },
        ],
      },
      {
        module: {
          title: "Módulo 3: Material de Apoio",
          description: "Baixe os materiais, links e recursos extras mencionados na aula.",
        },
        lessons: [
          {
            title: "Links e Recursos Adicionais",
            duration: "02:00",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Acesse todos os links, ferramentas e materiais de apoio para colocar em prática o que aprendeu.",
          },
        ],
      },
       {
        module: {
          title: "BÔNUS 'SORA 2'",
          description: "Um módulo bônus com conteúdo extra sobre o Sora 2.",
        },
        lessons: [
          {
            title: "Aula Bônus Sora 2",
            duration: "10:00",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Conteúdo exclusivo e avançado sobre a ferramenta Sora 2.",
          },
        ],
      },
    ],
  },
];

const SEED_DATA_VERSION = 2; // Increment to force re-seed on next load

export const seedInitialData = async () => {
  try {
    const currentVersion = parseInt(localStorage.getItem('seedVersion') || '0', 10);
    if (currentVersion >= SEED_DATA_VERSION) {
      // console.log("Database is up to date.");
      return;
    }

    for (const [courseIndex, courseData] of initialCoursesData.entries()) {
      const courseWithOrder = { ...courseData.course, order: courseIndex };
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, where("title", "==", courseWithOrder.title), limit(1));
      const snapshot = await getDocs(q);

      let courseId: string;
      const docRef = snapshot.empty ? null : snapshot.docs[0].ref;
      courseId = snapshot.empty ? '' : snapshot.docs[0].id;
      
      if (docRef) {
        await setDoc(docRef, courseWithOrder, { merge: true });
      } else {
        const newDocRef = await addDoc(coursesRef, courseWithOrder);
        courseId = newDocRef.id;
      }
      
      for (const [moduleIndex, moduleData] of courseData.modules.entries()) {
        const moduleWithOrder = { ...moduleData.module, order: moduleIndex };
        const modulesRef = collection(db, 'courses', courseId, 'modules');
        const moduleQuery = query(modulesRef, where("title", "==", moduleWithOrder.title), limit(1));
        const moduleSnapshot = await getDocs(moduleQuery);
        
        let moduleId: string;
        const moduleDocRef = moduleSnapshot.empty ? null : moduleSnapshot.docs[0].ref;
        moduleId = moduleSnapshot.empty ? '' : moduleSnapshot.docs[0].id;

        if(moduleDocRef) {
          await setDoc(moduleDocRef, moduleWithOrder, { merge: true });
          moduleId = moduleDocRef.id;
        } else {
          const newModuleRef = await addDoc(modulesRef, moduleWithOrder);
          moduleId = newModuleRef.id;
        }

        for (const [lessonIndex, lessonData] of moduleData.lessons.entries()) {
          const lessonWithOrder = { ...lessonData, order: lessonIndex };
          const lessonsRef = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
          const lessonQuery = query(lessonsRef, where("title", "==", lessonWithOrder.title), limit(1));
          const lessonSnapshot = await getDocs(lessonQuery);

          const lessonDocRef = lessonSnapshot.empty ? null : lessonSnapshot.docs[0].ref;

          if (lessonDocRef) {
            await setDoc(lessonDocRef, lessonWithOrder, { merge: true });
          } else {
            await addDoc(lessonsRef, lessonWithOrder);
          }
        }
      }
    }
    
    localStorage.setItem('seedVersion', SEED_DATA_VERSION.toString());
    // console.log("Database seeded/updated to version:", SEED_DATA_VERSION);

  } catch (error) {
    console.error("Error seeding initial data:", error);
    throw error; // Re-throw to be caught by the caller
  }
};