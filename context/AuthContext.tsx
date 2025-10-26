// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
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
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { Course, Module, Lesson } from '../types/course';
import { seedInitialData } from '../data/seedData';

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
  // Admin User Functions
  adminResetPassword: (email: string) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminUpdateUser: (userId: string, updates: Partial<AdminUser>) => Promise<AdminUser>;
  adminGetAllUsers: () => Promise<AdminUser[]>;
  // Admin Course Functions
  getAllCourses: () => Promise<Course[]>;
  addCourse: (courseData: Omit<Course, 'id'>) => Promise<Course>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  // Admin Module Functions
  getModulesForCourse: (courseId: string) => Promise<Module[]>;
  addModule: (courseId: string, moduleData: Omit<Module, 'id'>) => Promise<Module>;
  updateModule: (courseId: string, moduleId: string, moduleData: Partial<Module>) => Promise<void>;
  deleteModule: (courseId: string, moduleId: string) => Promise<void>;
  // Admin Lesson Functions
  getLessonsForModule: (courseId: string, moduleId: string) => Promise<Lesson[]>;
  addLesson: (courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id'>) => Promise<Lesson>;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lessonData: Partial<Lesson>) => Promise<void>;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const seededRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          setUserRole(UserRole.ADMIN);
        } else {
          setUserRole(UserRole.MEMBER);
        }

        // Seed the database only once after a user is authenticated
        if (!seededRef.current) {
          seededRef.current = true; // Mark as attempting to seed
          try {
            await seedInitialData();
          } catch (error) {
            console.error("Error seeding database:", error);
          }
        }
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
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      name: user.email?.split('@')[0] || 'Novo Usuário',
      creationDate: new Date().toLocaleString('pt-BR'),
      document: 'N/A',
      status: 'Ativo',
      enrolledCourses: [],
    });
    return userCredential;
  }, []);

  const login = useCallback((email: string, password: string) => signInWithEmailAndPassword(auth, email, password), []);
  const logout = useCallback(() => signOut(auth), []);
  const resetPassword = useCallback((email: string) => sendPasswordResetEmail(auth, email), []);
  
  // --- Admin User Functions ---
  const adminResetPassword = useCallback((email: string) => sendPasswordResetEmail(auth, email), []);
  
  const adminGetAllUsers = useCallback(async (): Promise<AdminUser[]> => {
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => doc.data() as AdminUser);
  }, []);
  
  const adminUpdateUser = useCallback(async (userId: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updates);
    const updatedDoc = await getDoc(userRef);
    if (!updatedDoc.exists()) throw new Error("User not found after update.");
    return updatedDoc.data() as AdminUser;
  }, []);

  const adminDeleteUser = useCallback(async (userId: string) => {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
  }, []);
  
  // --- Admin Course/Content Functions ---
  const getAllCourses = useCallback(async (): Promise<Course[]> => {
    const coursesCol = collection(db, 'courses');
    const coursesSnapshot = await getDocs(query(coursesCol, orderBy('title')));
    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  }, []);

  const addCourse = useCallback(async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    const coursesCol = collection(db, 'courses');
    const docRef = await addDoc(coursesCol, courseData);
    return { id: docRef.id, ...courseData };
  }, []);

  const updateCourse = useCallback(async (courseId: string, courseData: Partial<Course>) => {
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, courseData);
  }, []);
  
  const deleteCourse = useCallback(async (courseId: string) => {
    // Note: This doesn't delete subcollections in Firestore. For a full delete, a Firebase Function is needed.
    const courseRef = doc(db, 'courses', courseId);
    await deleteDoc(courseRef);
  }, []);
  
  const getModulesForCourse = useCallback(async (courseId: string): Promise<Module[]> => {
    const modulesCol = collection(db, 'courses', courseId, 'modules');
    const modulesSnapshot = await getDocs(query(modulesCol, orderBy('title')));
    return modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
  }, []);

  const addModule = useCallback(async (courseId: string, moduleData: Omit<Module, 'id'>): Promise<Module> => {
    const modulesCol = collection(db, 'courses', courseId, 'modules');
    const docRef = await addDoc(modulesCol, moduleData);
    return { id: docRef.id, ...moduleData };
  }, []);

  const updateModule = useCallback(async (courseId: string, moduleId: string, moduleData: Partial<Module>) => {
    const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
    await updateDoc(moduleRef, moduleData);
  }, []);

  const deleteModule = useCallback(async (courseId: string, moduleId: string) => {
    const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
    await deleteDoc(moduleRef);
  }, []);
  
  const getLessonsForModule = useCallback(async (courseId: string, moduleId: string): Promise<Lesson[]> => {
    const lessonsCol = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
    const lessonsSnapshot = await getDocs(query(lessonsCol, orderBy('title')));
    return lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
  }, []);

  const addLesson = useCallback(async (courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id'>): Promise<Lesson> => {
    const lessonsCol = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
    const docRef = await addDoc(lessonsCol, lessonData);
    return { id: docRef.id, ...lessonData };
  }, []);

  const updateLesson = useCallback(async (courseId: string, moduleId: string, lessonId: string, lessonData: Partial<Lesson>) => {
    const lessonRef = doc(db, 'courses', courseId, 'modules', moduleId, 'lessons', lessonId);
    await updateDoc(lessonRef, lessonData);
  }, []);

  const deleteLesson = useCallback(async (courseId: string, moduleId: string, lessonId: string) => {
    const lessonRef = doc(db, 'courses', courseId, 'modules', moduleId, 'lessons', lessonId);
    await deleteDoc(lessonRef);
  }, []);


  const value = useMemo(() => ({
    currentUser, userRole, loading, signup, login, logout, resetPassword,
    adminResetPassword, adminDeleteUser, adminUpdateUser, adminGetAllUsers,
    getAllCourses, addCourse, updateCourse, deleteCourse,
    getModulesForCourse, addModule, updateModule, deleteModule,
    getLessonsForModule, addLesson, updateLesson, deleteLesson,
  }), [currentUser, userRole, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};