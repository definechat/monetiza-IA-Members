import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import Sidebar from '../components/Sidebar';
import UserHeader from '../components/UserHeader';
import { useAuth } from '../hooks/useAuth';
import UserListModal from '../components/UserListModal';
import { allUsers, User } from '../data/mockUsers';
import { getYouTubeEmbedUrl } from '../utils/youtube';

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [profileImage, setProfileImage] = useState<string>(`https://api.dicebear.com/8.x/initials/svg?seed=${currentUser?.email || 'User'}`);
  const [displayName, setDisplayName] = useState<string>(currentUser?.email?.split('@')[0] || 'Usuário Anônimo');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  
  // Post state
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newPostVideoUrl, setNewPostVideoUrl] = useState<string>('');
  const [showVideoInput, setShowVideoInput] = useState<boolean>(false);

  // Follower/Following State
  const [followers, setFollowers] = useState<string[]>(['user-2', 'user-4']);
  const [following, setFollowing] = useState<string[]>(['user-3', 'user-5', 'user-6']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState<User[]>([]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };
  
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
      setDisplayName(event.target.value);
  }

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter') {
        setIsEditingName(false);
    }
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewPostImage(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = () => {
    if (newPostContent.trim() !== '' || newPostImage || newPostVideoUrl.trim() !== '') {
      const embedUrl = getYouTubeEmbedUrl(newPostVideoUrl);
      const newPost: Post = {
        id: Date.now(),
        content: newPostContent,
        imageUrl: newPostImage || undefined,
        videoUrl: embedUrl || undefined,
        timestamp: new Date().toLocaleString('pt-BR'),
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
    }
  };
  
  const showUserList = (type: 'followers' | 'following') => {
    const userIds = type === 'followers' ? followers : following;
    const usersToShow = allUsers.filter(user => userIds.includes(user.id));
    
    setModalTitle(type === 'followers' ? 'Seguidores' : 'Seguindo');
    setModalUsers(usersToShow);
    setIsModalOpen(true);
  };
  
  const handleToggleFollow = (userId: string) => {
    setFollowing(currentFollowing => {
        if (currentFollowing.includes(userId)) {
            return currentFollowing.filter(id => id !== userId); // Unfollow
        } else {
            return [...currentFollowing, userId]; // Follow
        }
    });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-300">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
          <UserHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="relative group">
                    <img
                      className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-blue-500"
                      src={profileImage}
                      alt="User profile"
                    />
                    <button
                      onClick={handleImageClick}
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="Change profile picture"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start">
                      {isEditingName ? (
                          <div className="flex items-center space-x-2">
                              <input 
                                  type="text" 
                                  value={displayName} 
                                  onChange={handleNameChange}
                                  onKeyDown={handleNameKeyDown}
                                  autoFocus
                                  className="bg-gray-700 text-white text-2xl md:text-3xl font-bold rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button onClick={() => setIsEditingName(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md transition-colors">
                                  Salvar
                              </button>
                          </div>
                      ) : (
                          <>
                              <h1 className="text-2xl md:text-3xl font-bold text-white">{displayName}</h1>
                              <button onClick={() => setIsEditingName(true)} className="ml-3 text-gray-400 hover:text-white" aria-label="Edit name">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                              </button>
                          </>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{currentUser?.email}</p>
                    <p className="text-base text-gray-300 mt-3">
                      Entusiasta de Inteligência Artificial e aprendiz contínuo na plataforma Monetiza IA.
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-8 border-t border-gray-700 pt-6 flex justify-center md:justify-start space-x-8">
                  <button onClick={() => showUserList('followers')} className="text-center focus:outline-none hover:opacity-80 transition-opacity">
                    <p className="text-2xl font-bold text-white">{followers.length}</p>
                    <p className="text-sm text-gray-400">Seguidores</p>
                  </button>
                  <button onClick={() => showUserList('following')} className="text-center focus:outline-none hover:opacity-80 transition-opacity">
                    <p className="text-2xl font-bold text-white">{following.length}</p>
                    <p className="text-sm text-gray-400">Seguindo</p>
                  </button>
                </div>
              </div>

              {/* Post Creation */}
              <div className="mt-10 bg-gray-800 rounded-lg shadow-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Criar Publicação</h2>
                  <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="w-full bg-gray-700 text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="No que você está pensando?"
                  ></textarea>
                  
                  {/* Previews */}
                  {newPostImage && (
                    <div className="mt-4 relative w-max">
                      <img src={newPostImage} alt="Preview" className="rounded-lg max-w-full max-h-80" />
                      <button
                        onClick={() => {
                          setNewPostImage(null);
                          if (imageInputRef.current) imageInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-opacity"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  )}
                  {newPostVideoUrl && getYouTubeEmbedUrl(newPostVideoUrl) && (
                    <div className="mt-4 relative aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(newPostVideoUrl)!}
                        title="YouTube video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg"
                        referrerPolicy="strict-origin-when-cross-origin"
                      ></iframe>
                    </div>
                  )}

                  {/* Actions */}
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
                      <button
                          onClick={handleCreatePost}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
                          disabled={!newPostContent.trim() && !newPostImage && !newPostVideoUrl.trim()}
                      >
                          Publicar
                      </button>
                  </div>
                  {showVideoInput && (
                      <div className="mt-3">
                          <input 
                              type="text"
                              value={newPostVideoUrl}
                              onChange={(e) => setNewPostVideoUrl(e.target.value)}
                              placeholder="Cole a URL do vídeo (YouTube)"
                              className="w-full bg-gray-700 text-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                      </div>
                  )}
              </div>


              {/* Posts Section */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2 mb-6">Publicações</h2>
                {posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map(post => (
                      <div key={post.id} className="bg-gray-800 rounded-lg shadow-xl p-5">
                        <div className="flex items-start">
                          <img className="h-10 w-10 rounded-full object-cover mr-4" src={profileImage} alt="User" />
                          <div className="flex-1">
                            <div className="flex items-baseline">
                              <p className="font-bold text-white">{displayName}</p>
                              <p className="text-xs text-gray-500 ml-2">{post.timestamp}</p>
                            </div>
                            {post.content && <p className="mt-2 text-gray-300 whitespace-pre-wrap">{post.content}</p>}
                            {post.imageUrl && (
                                <div className="mt-4">
                                    <img src={post.imageUrl} alt="Post attachment" className="rounded-lg max-w-full border border-gray-700" />
                                </div>
                            )}
                            {post.videoUrl && (
                                <div className="mt-4 aspect-video">
                                    <iframe
                                        src={post.videoUrl}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full rounded-lg"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                    ></iframe>
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center bg-gray-800 rounded-lg p-10">
                      <p className="text-gray-400">Nenhuma publicação ainda. Comece a compartilhar suas ideias!</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {isModalOpen && (
        <UserListModal
          title={modalTitle}
          users={modalUsers}
          followingList={following}
          onClose={() => setIsModalOpen(false)}
          onToggleFollow={handleToggleFollow}
        />
      )}
    </>
  );
};

export default ProfilePage;