const generateDescription = (title: string) => `Aprenda tudo sobre ${title} neste curso completo. Este curso detalhado irá guiá-lo através dos conceitos fundamentais e avançados, com exemplos práticos e projetos do mundo real. Prepare-se para se tornar um especialista.`;

export interface Course {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  isLocked: boolean;
  password?: string;
}

export const allCourses: Course[] = [
    { id: 'curso-1', title: 'Sistema Colheita', description: generateDescription('Sistema Colheita'), bannerUrl: 'https://i.imgur.com/3NOqnpJ.jpeg', isLocked: true, password: 'colheita2025#' },
    { id: 'curso-2', title: 'Sora 2 Vídeo Infinito Grátis', description: generateDescription('Sora 2'), bannerUrl: 'https://i.imgur.com/QvkKjHm.jpeg', isLocked: true, password: 'sora456' },
    { id: 'curso-3', title: 'Criando Área de Membros com IA', description: generateDescription('Área de Membros com IA'), bannerUrl: 'https://i.imgur.com/cmCKCQx.jpeg', isLocked: true, password: 'membros789' },
    { id: 'curso-4', title: 'Criando Site Com IA (Grátis)', description: generateDescription('Site Com IA'), bannerUrl: 'https://i.imgur.com/F9clnzY.jpeg', isLocked: true, password: 'site101' },
    { id: 'curso-5', title: 'Criando ChatBot Com IA', description: generateDescription('ChatBot Com IA'), bannerUrl: 'https://i.imgur.com/kp7zPIM.jpeg', isLocked: true, password: 'chatbot112' },
    { id: 'curso-6', title: 'Facebook Ads para WhatsApp', description: generateDescription('Facebook Ads para WhatsApp'), bannerUrl: 'https://i.imgur.com/nXC5Afq.jpeg', isLocked: true, password: 'fbads131' },
    { id: 'curso-7', title: 'Kwai (Funil para o WhatsApp)', description: generateDescription('Kwai (Funil para o WhatsApp)'), bannerUrl: 'https://i.imgur.com/LGMB5nR.jpeg', isLocked: true, password: 'kwai415' },
    { id: 'curso-8', title: 'Monetizando com IA no YouTube', description: generateDescription('IA no YouTube'), bannerUrl: 'https://i.imgur.com/kCBmpPY.jpeg', isLocked: true, password: 'youtube161' },
    { id: 'curso-9', title: 'lowTicket com IA', description: generateDescription('lowTicket com IA'), bannerUrl: 'https://i.imgur.com/v5b1r6E.jpeg', isLocked: true, password: 'lowticket171' },
    { id: 'curso-10', title: 'Criaçao de video com IA', description: generateDescription('Criaçao de video com IA'), bannerUrl: 'https://i.imgur.com/FP9JGUw.jpeg', isLocked: true, password: 'videoia181' },
];