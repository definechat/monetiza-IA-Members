import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import { useAuth } from '../hooks/useAuth';
import { allUsers, User as CommunityUser } from '../data/mockUsers';

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
    content: 'Para quem está começando com automação de marketing, recomendo fortemente focar em segmentação de leads. A IA pode analisar o comportamento do usuário e criar clusters de público-alvo muito mais precisos do que qualquer análise manual. O que você acha, @Carlos Silva?',
    videoUrl: 'https://www.youtube.com/embed/R932C3G8_gY',
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [newPostContent, setNewPostContent] = useState<string>('');
    const [newPostImage, setNewPostImage] = useState<string | null>(null);
    const [newPostVideoUrl, setNewPostVideoUrl] = useState<string>('');
    const [showVideoInput, setShowVideoInput] = useState<boolean>(false);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mentionDropdownRef = useRef<HTMLDivElement>(null);

    const [mentionQuery, setMentionQuery] = useState<string>('');
    const [showMentions, setShowMentions] = useState<boolean>(false);
    const [mentionPosition, setMentionPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [mentionStartIndex, setMentionStartIndex] = useState<number>(-1);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMentions && mentionDropdownRef.current && !mentionDropdownRef.current.contains(event.target as Node)) {
                setShowMentions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMentions]);

    const getYouTubeEmbedUrl = (url: string): string | null => {
        if (!url) return null;
        let videoId = '';
        const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(youtubeRegex);
        if (match && match[1]) {
            videoId = match[1];
        } else {
            return null;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };
    
    const handleNewPostChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value, selectionStart } = e.target;
        setNewPostContent(value);
    
        const textBeforeCursor = value.substring(0, selectionStart);
        const atMatch = textBeforeCursor.match(/@(\w*)$/);
    
        if (atMatch && textareaRef.current) {
            setMentionQuery(atMatch[1]);
            setShowMentions(true);
            setMentionStartIndex(atMatch.index ?? 0);
        } else {
            setShowMentions(false);
        }
    };
    
    const handleSelectMention = (user: CommunityUser) => {
        const text = newPostContent;
        const before = text.substring(0, mentionStartIndex);
        const after = text.substring(mentionStartIndex + 1 + mentionQuery.length);
        const newText = `${before}@${user.name} ${after}`;
        setNewPostContent(newText);
        setShowMentions(false);
        textareaRef.current?.focus();
    };

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase())
    ).slice(0, 5);

    const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewPostImage(URL.createObjectURL(file));
        }
    };

    const handleCreatePost = () => {
        if (!currentUser || (newPostContent.trim() === '' && !newPostImage && !newPostVideoUrl.trim())) return;

        const embedUrl = getYouTubeEmbedUrl(newPostVideoUrl);
        const newPost: Post = {
            id: Date.now(),
            author: {
                name: currentUser.email?.split('@')[0] || 'Usuário',
                avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.email || 'User'}`,
            },
            timestamp: 'Agora',
            content: newPostContent,
            imageUrl: newPostImage || undefined,
            videoUrl: embedUrl || undefined,
            likes: 0,
            comments: 0,
        };
        setPosts([newPost, ...posts]);
        setNewPostContent('');
        setNewPostImage(null);
        setNewPostVideoUrl('');
        setShowVideoInput(false);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const renderPostContent = (content: string) => {
        const regex = /(@[a-zA-Z\s]+)/g;
        return (
            <>{content.split(regex).map((part, i) =>
                i % 2 === 1 ? <span key={i} className="text-blue-400 font-semibold">{part}</span> : part
            )}</>
        );
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-300">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
                <UserHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-6">Comunidade</h1>

                        {/* Create Post */}
                        <div className="bg-gray-800 rounded-lg shadow-xl p-4 mb-8 relative">
                            <textarea
                                ref={textareaRef}
                                value={newPostContent}
                                onChange={handleNewPostChange}
                                className="w-full bg-gray-700 text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder={`No que você está pensando, ${currentUser?.email?.split('@')[0] || 'usuário'}? Use @ para mencionar.`}
                            />
                             {showMentions && filteredUsers.length > 0 && (
                                <div ref={mentionDropdownRef} className="absolute bg-gray-700 rounded-md shadow-lg p-2 z-10 w-64 mt-1">
                                    <ul>
                                        {filteredUsers.map(user => (
                                            <li key={user.id} onClick={() => handleSelectMention(user)} className="flex items-center p-2 rounded-md hover:bg-gray-600 cursor-pointer">
                                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                                                <span className="text-sm text-white">{user.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {newPostImage && (
                                <div className="mt-4 relative w-max">
                                    <img src={newPostImage} alt="Preview" className="rounded-lg max-w-full max-h-80" />
                                    <button onClick={() => { setNewPostImage(null); if (imageInputRef.current) imageInputRef.current.value = ''; }} className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            )}
                            {newPostVideoUrl && getYouTubeEmbedUrl(newPostVideoUrl) && (
                                <div className="mt-4 relative aspect-video"><iframe src={getYouTubeEmbedUrl(newPostVideoUrl)!} title="YouTube video preview" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-lg"></iframe></div>
                            )}
                            <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center space-x-4">
                                    <input type="file" ref={imageInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                                    <button onClick={() => imageInputRef.current?.click()} className="text-gray-400 hover:text-blue-500 transition-colors" aria-label="Add image">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </button>
                                    <button onClick={() => setShowVideoInput(!showVideoInput)} className="text-gray-400 hover:text-green-500 transition-colors" aria-label="Add video">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                                <button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed" disabled={!newPostContent.trim() && !newPostImage && !newPostVideoUrl.trim()}>Publicar</button>
                            </div>
                            {showVideoInput && (
                                <div className="mt-3"><input type="text" value={newPostVideoUrl} onChange={(e) => setNewPostVideoUrl(e.target.value)} placeholder="Cole a URL do vídeo (YouTube)" className="w-full bg-gray-700 text-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
                            )}
                        </div>

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {posts.map(post => (
                                <div key={post.id} className="bg-gray-800 rounded-lg shadow-xl p-5">
                                    <div className="flex items-start">
                                        <img className="h-10 w-10 rounded-full object-cover mr-4" src={post.author.avatar} alt={post.author.name} />
                                        <div className="flex-1">
                                            <div className="flex items-baseline">
                                                <p className="font-bold text-white">{post.author.name}</p>
                                                <p className="text-xs text-gray-500 ml-2">{post.timestamp}</p>
                                            </div>
                                            {post.content && <p className="mt-2 text-gray-300 whitespace-pre-wrap">{renderPostContent(post.content)}</p>}
                                            {post.imageUrl && <div className="mt-4"><img src={post.imageUrl} alt="Post attachment" className="rounded-lg max-w-full border border-gray-700" /></div>}
                                            {post.videoUrl && <div className="mt-4 aspect-video"><iframe src={post.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-lg"></iframe></div>}
                                            <div className="mt-4 flex items-center space-x-6 text-gray-500">
                                                <button className="flex items-center space-x-1 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg><span>{post.likes}</span></button>
                                                <button className="flex items-center space-x-1 hover:text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.91 8.91 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.416 14.584A6.94 6.94 0 0010 16c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6c0 1.288.482 2.475 1.32 3.395L4.416 14.584z" clipRule="evenodd" /></svg><span>{post.comments}</span></button>
                                            </div>
                                        </div>
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
