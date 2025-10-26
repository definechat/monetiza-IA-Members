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
import { UserRole } from '../types/user';

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

  // --- Admin Functions (Simulated) ---
  // In a real application, these would call Firebase Functions that use the Admin SDK.
  
  const adminResetPassword = async (email: string) => {
    console.log(`[Admin Action] Simulating password reset for: ${email}`);
    // This requires the Admin SDK on a server to generate a link for another user.
    alert(`Funcionalidade simulada: um e-mail de redefinição de senha seria enviado para ${email}.`);
    return Promise.resolve();
  };

  const adminDeleteUser = async (userId: string) => {
    console.log(`[Admin Action] Simulating deletion of user: ${userId}`);
    // This requires the Admin SDK on a server to delete users.
    alert(`Funcionalidade simulada: o usuário com ID ${userId} seria deletado.`);
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
    adminDeleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};