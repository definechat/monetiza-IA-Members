// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  UserCredential,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { UserRole, AdminUser } from '../types/user';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

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

  const signup = useCallback(async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create a user document in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      name: user.email?.split('@')[0] || 'Novo Usuário',
      creationDate: new Date().toLocaleString('pt-BR'),
      document: 'N/A',
      status: 'Ativo',
    });

    return userCredential;
  }, []);

  const login = useCallback((email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(() => {
    return signOut(auth);
  }, []);

  const resetPassword = useCallback((email: string) => {
    return sendPasswordResetEmail(auth, email);
  }, []);

  // --- Admin Functions ---
  
  const adminResetPassword = useCallback(async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  }, []);
  
  const adminGetAllUsers = useCallback(async (): Promise<AdminUser[]> => {
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => doc.data() as AdminUser);
    return userList;
  }, []);
  
  const adminUpdateUser = useCallback(async (userId: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updates);
    const updatedDoc = await getDoc(userRef);
    if (!updatedDoc.exists()) {
      throw new Error("User not found after update.");
    }
    return updatedDoc.data() as AdminUser;
  }, []);

  const adminDeleteUser = useCallback(async (userId: string) => {
     // Note: This only deletes the Firestore record, not the Firebase Auth user.
     // Deleting the auth user requires a backend environment (e.g., Firebase Functions).
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
  }, []);

  const value = useMemo(() => ({
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
  }), [currentUser, userRole, loading, signup, login, logout, resetPassword, adminResetPassword, adminDeleteUser, adminUpdateUser, adminGetAllUsers]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};