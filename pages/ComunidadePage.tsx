import React, { useState, useRef, ChangeEvent } from 'react';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import { useAuth } from '../hooks/useAuth';

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: { name: 'Carlos Silva', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Carlos' },
    timestamp: '2h atrás',
    content: 'Acabei de fechar um novo cliente usando a estratégia de chatbot com IA que aprendi aqui. O ROI foi incrível! Alguém mais teve sucesso com essa abordagem?',
    imageUrl: 'https://picsum.photos/seed/ia-success/800/400',
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    author: { name: 'Juliana Alves', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Juliana' },
    timestamp: '5h atrás',
    content: 'Para quem está começando com automação de marketing, recomendo fortemente focar em segmentação de leads. A IA pode analisar o comportamento do usuário e criar clusters de público-alvo muito mais precisos do que qualquer análise manual. Deixo um vídeo que explica bem o conceito.',
    videoUrl: 'https://www.youtube.com/embed/R932C3G8_gY?rel=0',
    likes: 78,
    comments: 15,
  },
  {
    id: 3,
    author: { name: 'Admin Monetiza IA', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=MIA' },
    timestamp: '1d atrás',
    content: '🚀 Bem-vindos à comunidade Monetiza IA! Este é um espaço para compartilhar suas vitórias, tirar dúvidas e fazer networking. Lembrem-se: o conhecimento compartilhado é conhecimento multiplicado. Vamos crescer juntos!',
    likes: 150,
    comments: 2,
  },
];

const ComunidadePage: React.FC = () => {
    const { currentUser } = useAuth();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [newPostContent, setNewPostContent] = useState<string>('');
    const [newPostImage, setNewPostImage] = useState<string | null>(null);
    const [newPostVideoUrl, setNewPostVideoUrl] = useState<string>('');
    const [showVideoInput, setShowVideoInput] = useState<boolean>(false);

    const getYouTubeEmbedUrl = (url: string): string | null => {
        if (!url) return null;
        let videoId = '';
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        if (match && match[1]) {
            videoId = match[1];
        } else {
            return null; // Not a valid YouTube URL
        }
        
        try {
            const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
            embedUrl.searchParams.set('rel', '0');
            embedUrl.searchParams.set('origin', window.location.origin);
            return embedUrl.toString();
        } catch (e) {
            console.error("Failed to construct embed URL", e);
            return `https://www.youtube.com/embed/${videoId}?rel=0`;
        }
    };

    const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewPostImage(URL.createObjectURL(file));
        }
    };

    const handleCreatePost = () => {
        if (!newPostContent.trim() && !newPostImage && !newPostVideoUrl.trim()) return;

        const embedUrl = getYouTubeEmbedUrl(newPostVideoUrl);
        const newPost: Post = {
            id: Date.now(),
            author: {
                name: currentUser?.email?.split('@')[0] || 'Usuário',
                avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser?.email || 'User'}`
            },
            timestamp: 'Agora mesmo',
            content: newPostContent,
            imageUrl: newPostImage || undefined,
            videoUrl: embedUrl || undefined,
            likes: 0,
            comments: 0,
        };
        setPosts([newPost, ...posts]);

        // Reset form
        setNewPostContent('');
        setNewPostImage(null);
        setNewPostVideoUrl('');
        setShowVideoInput(false);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };
    
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const processedPosts = posts.map(post => ({
        ...post,
        videoUrl: post.videoUrl ? getYouTubeEmbedUrl(post.videoUrl) || post.videoUrl : undefined,
    }));

    return (
        <div className="flex h-screen bg-gray-900 text-gray-300">
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
                <UserHeader onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Create Post Card */}
                        <div className="bg-gray-800 rounded-lg shadow-xl p-4 mb-8">
                            <div className="flex items-start">
                                <img 
                                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${currentUser?.email || 'User'}`} 
                                    alt="Seu avatar" 
                                    className="w-12 h-12 rounded-full mr-4" 
                                />
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="w-full bg-gray-700 text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    rows={3}
                                    placeholder="O que você tem em mente para monetizar?"
                                ></textarea>
                            </div>
                            
                            {/* Previews */}
                            {newPostImage && (
                                <div className="mt-4 pl-16 relative w-max">
                                    <img src={newPostImage} alt="Preview" className="rounded-lg max-w-full max-h-80" />
                                    <button
                                        onClick={() => {
                                        setNewPostImage(null);
                                        if (imageInputRef.current) imageInputRef.current.value = '';
                                        }}
                                        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            )}
                            {newPostVideoUrl && getYouTubeEmbedUrl(newPostVideoUrl) && (
                                <div className="mt-4 pl-16 relative aspect-video">
                                    <iframe src={getYouTubeEmbedUrl(newPostVideoUrl)!} title="YouTube preview" className="w-full h-full rounded-lg" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"></iframe>
                                </div>
                            )}
                            
                            {/* Actions */}
                            <div className="flex justify-between items-center mt-3 pl-16">
                                <div className="flex items-center space-x-4">
                                    <input type="file" ref={imageInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                                    <button onClick={() => imageInputRef.current?.click()} className="text-gray-400 hover:text-blue-500 transition-colors" title="Adicionar Imagem">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </button>
                                    <button onClick={() => setShowVideoInput(!showVideoInput)} className="text-gray-400 hover:text-red-500 transition-colors" title="Adicionar Vídeo">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                    <button className="text-gray-400 hover:text-purple-500 transition-colors" title="Adicionar Arquivo (Em Breve)">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                    </button>
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
                                    disabled={!newPostContent.trim() && !newPostImage && !newPostVideoUrl.trim()}
                                >
                                    Publicar
                                </button>
                            </div>
                            {showVideoInput && (
                                <div className="mt-3 pl-16">
                                    <input 
                                        type="text" value={newPostVideoUrl} onChange={(e) => setNewPostVideoUrl(e.target.value)}
                                        placeholder="Cole a URL do vídeo (YouTube)"
                                        className="w-full bg-gray-700 text-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Feed */}
                        <div className="space-y-6">
                            {processedPosts.map(post => (
                                <div key={post.id} className="bg-gray-800 rounded-lg shadow-xl p-5">
                                    {/* Post Header */}
                                    <div className="flex items-center mb-4">
                                        <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div className="ml-3">
                                            <p className="font-bold text-white">{post.author.name}</p>
                                            <p className="text-xs text-gray-400">{post.timestamp}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Post Body */}
                                    {post.content && <p className="mb-4 text-gray-300 whitespace-pre-wrap">{post.content}</p>}

                                    {/* Post Media */}
                                    {post.imageUrl && <img src={post.imageUrl} alt="Anexo do post" className="rounded-lg max-w-full border border-gray-700 mb-4" />}
                                    {post.videoUrl && (
                                        <div className="aspect-video mb-4">
                                            <iframe src={post.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-lg" referrerPolicy="strict-origin-when-cross-origin"></iframe>
                                        </div>
                                    )}

                                    {/* Post Actions */}
                                    <div className="border-t border-gray-700 pt-3 flex items-center space-x-6 text-gray-400">
                                        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.865.802V10.333z" /></svg>
                                            <span className="text-sm font-semibold">{post.likes}</span>
                                        </button>
                                        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
                                            <span className="text-sm font-semibold">{post.comments}</span>
                                        </button>
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

export default ComunidadePage;