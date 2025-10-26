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
import { adminUsers, AdminUser } from '../data/adminMockData';

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
  
  // This is now a REAL function, not simulated.
  const adminResetPassword = async (email: string) => {
    console.log(`[Admin Action] Sending password reset for: ${email}`);
    // The client SDK allows sending a reset email to any address.
    return sendPasswordResetEmail(auth, email);
  };

  // The following functions are simulated as they require a backend with Firebase Admin SDK.
  // They manipulate mock data to provide a functional UI experience.
  
  const adminGetAllUsers = async (): Promise<AdminUser[]> => {
    console.log('[Admin Action] Simulating fetching all users.');
    // In a real app, this would fetch from a Firestore collection or a backend endpoint.
    return Promise.resolve([...adminUsers]); // Return a copy to avoid direct mutation
  };
  
  const adminUpdateUser = async (userId: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
    console.log(`[Admin Action] Simulating update for user ${userId} with`, updates);
    const userIndex = adminUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error("User not found");
    }
    // Update the mock data source
    const updatedUser = { ...adminUsers[userIndex], ...updates };
    adminUsers[userIndex] = updatedUser;
    return Promise.resolve(updatedUser);
  };

  const adminDeleteUser = async (userId: string) => {
    console.log(`[Admin Action] Simulating deletion of user: ${userId}`);
    const userIndex = adminUsers.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        adminUsers.splice(userIndex, 1);
    }
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