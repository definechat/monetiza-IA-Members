import React from 'react';
import { User } from '../data/mockUsers';

interface UserListModalProps {
  title: string;
  users: User[];
  followingList: string[];
  onClose: () => void;
  onToggleFollow: (userId: string) => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ title, users, followingList, onClose, onToggleFollow }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {users.length > 0 ? (
            <ul className="space-y-3">
              {users.map((user) => {
                const isFollowing = followingList.includes(user.id);
                return (
                  <li key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="ml-3 font-medium text-white">{user.name}</span>
                    </div>
                    <button 
                      onClick={() => onToggleFollow(user.id)}
                      className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${
                        isFollowing 
                        ? 'bg-gray-600 text-white hover:bg-gray-500' 
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-8">
                {title === 'Seguidores' ? 'Nenhum seguidor ainda.' : 'Não está seguindo ninguém.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
