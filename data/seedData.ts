import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, limit, updateDoc, setDoc } from 'firebase/firestore';

const initialCoursesData = [
  {
    course: {
      title: "Sistema Colheita",
      description: "Aprenda tudo sobre Sistema Colheita neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/kR11h4A.png",
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
      bannerUrl: "https://i.imgur.com/9xS2M8A.png",
      isLocked: true,
      password: "123",
    },
    modules: [],
  },
  {
    course: {
      title: "Criando Área de Membros com IA",
      description: "Aprenda tudo sobre Área de Membros com IA neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/6XFSOxJ.png",
      isLocked: true,
      password: "123",
    },
    modules: [],
  },
  {
    course: {
      title: "Criando Site Com IA (Grátis)",
      description: "Aprenda tudo sobre Site Com IA neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/rN9eBqi.png",
      isLocked: false,
    },
    modules: [],
  },
  {
    course: {
      title: "Criando Chatbot Com IA",
      description: "Aprenda tudo sobre ChatBot Com IA neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/PcxMFfM.png",
      isLocked: true,
      password: "123",
    },
    modules: [],
  },
  {
    course: {
      title: "Facebook Ads para WhatsApp",
      description: "Aprenda tudo sobre Facebook Ads para WhatsApp neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/pYcWxKb.png",
      isLocked: true,
      password: "123",
    },
    modules: [],
  },
  {
    course: {
      title: "Kwai (Funil para o WhatsApp)",
      description: "Aprenda tudo sobre Kwai (Funil para o WhatsApp) neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/5J3d2qM.png",
      isLocked: true,
      password: "123",
    },
    modules: [],
  },
  {
    course: {
      title: "Monetizando com IA no YouTube",
      description: "Aprenda tudo sobre IA no YouTube neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/e8C6T0D.png",
      isLocked: true,
      password: "123",
    },
    modules: [],
  },
  {
    course: {
      title: "lowTicket com IA",
      description: "Aprenda tudo sobre lowTicket neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/7gK2QyS.png",
      isLocked: true,
      password: "123",
    },
    modules: [],
  },
  {
    course: {
      title: "Criaçao de video com IA",
      description: "Aprenda tudo sobre criação de vídeos com IA neste curso completo. Este curso detalhado.",
      bannerUrl: "https://i.imgur.com/7106gM9.png",
      isLocked: true,
      password: "123",
    },
    modules: [],
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
