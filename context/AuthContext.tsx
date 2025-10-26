// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  UserCredential,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';
import { UserRole, AdminUser } from '../types/user';

// Hardcoded admin email for demonstration
const ADMIN_EMAIL = 'admin@monetiza.ia';

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  adminResetPassword: (email: string) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminUpdateUser: (userId: string, updates: Partial<AdminUser>) => Promise<AdminUser>;
  adminGetAllUsers: () => Promise<AdminUser[]>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Determine user role based on email
      if (user && user.email === ADMIN_EMAIL) {
        setUserRole(UserRole.ADMIN);
      } else if (user) {
        setUserRole(UserRole.MEMBER);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  // --- Admin Functions ---
  
  const adminResetPassword = async (email: string) => {
    console.log(`[Admin Action] Sending password reset for: ${email}`);
    return sendPasswordResetEmail(auth, email);
  };
  
  const adminGetAllUsers = async (): Promise<AdminUser[]> => {
    console.log('[Admin Action] Simulating fetching all users. No mock data is used.');
    // In a real app, this would fetch from a backend.
    // This is empty because the client-side SDK cannot list users for security reasons.
    return Promise.resolve([]);
  };
  
  const adminUpdateUser = async (userId: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
    console.log(`[Admin Action] Simulating update for user ${userId} with`, updates);
    // This is a simulation. In a real app, it would call a backend endpoint.
    if (!updates.id) throw new Error('Simulation error: user object missing.');
    return Promise.resolve(updates as AdminUser); // Return the updated object to simulate success.
  };

  const adminDeleteUser = async (userId: string) => {
    console.log(`[Admin Action] Simulating deletion of user: ${userId}`);
    // This is a simulation of a successful API call.
    return Promise.resolve();
  };

  const value = {
    currentUser,
    userRole,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    adminResetPassword,
    adminDeleteUser,
    adminUpdateUser,
    adminGetAllUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
