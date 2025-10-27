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
// FIX: import 'limit' from 'firebase/firestore' to resolve 'Cannot find name' errors.
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc, addDoc, query, orderBy, writeBatch, limit } from 'firebase/firestore';
import { Course, Module, Lesson } from '../types/course';
import { Bonus } from '../types/bonus';
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
  addCourse: (courseData: Omit<Course, 'id' | 'order'>) => Promise<Course>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  updateCoursesOrder: (orderedCourses: Course[]) => Promise<void>;
  // Admin Module Functions
  getModulesForCourse: (courseId: string) => Promise<Module[]>;
  addModule: (courseId: string, moduleData: Omit<Module, 'id' | 'order'>) => Promise<Module>;
  updateModule: (courseId: string, moduleId: string, moduleData: Partial<Module>) => Promise<void>;
  deleteModule: (courseId: string, moduleId: string) => Promise<void>;
  updateModulesOrder: (courseId: string, orderedModules: Module[]) => Promise<void>;
  // Admin Lesson Functions
  getLessonsForModule: (courseId: string, moduleId: string) => Promise<Lesson[]>;
  addLesson: (courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id' | 'order'>) => Promise<Lesson>;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lessonData: Partial<Lesson>) => Promise<void>;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => Promise<void>;
  // Admin Bonus Functions
  getAllBonuses: () => Promise<Bonus[]>;
  addBonus: (bonusData: Omit<Bonus, 'id' | 'order'>) => Promise<Bonus>;
  updateBonus: (bonusId: string, bonusData: Partial<Bonus>) => Promise<void>;
  deleteBonus: (bonusId: string) => Promise<void>;
  updateBonusesOrder: (orderedBonuses: Bonus[]) => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          setUserRole(UserRole.ADMIN);
        } else {
          setUserRole(UserRole.MEMBER);
        }
        
        try {
          await seedInitialData();
        } catch (error) {
          console.error("Error seeding initial data:", error);
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
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
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
    const coursesSnapshot = await getDocs(query(coursesCol, orderBy('order')));
    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  }, []);

  const addCourse = useCallback(async (courseData: Omit<Course, 'id' | 'order'>): Promise<Course> => {
    const coursesCol = collection(db, 'courses');
    const snapshot = await getDocs(query(coursesCol, orderBy('order', 'desc'), limit(1)));
    const maxOrder = snapshot.empty ? -1 : snapshot.docs[0].data().order;
    const newCourse = { ...courseData, order: maxOrder + 1 };

    const docRef = await addDoc(coursesCol, newCourse);
    return { id: docRef.id, ...newCourse };
  }, []);

  const updateCourse = useCallback(async (courseId: string, courseData: Partial<Course>) => {
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, courseData);
  }, []);
  
  const deleteCourse = useCallback(async (courseId: string) => {
    const courseRef = doc(db, 'courses', courseId);
    await deleteDoc(courseRef);
  }, []);
  
  const updateCoursesOrder = useCallback(async (orderedCourses: Course[]) => {
    const batch = writeBatch(db);
    orderedCourses.forEach((course, index) => {
      const courseRef = doc(db, 'courses', course.id);
      batch.update(courseRef, { order: index });
    });
    await batch.commit();
  }, []);
  
  const getModulesForCourse = useCallback(async (courseId: string): Promise<Module[]> => {
    const modulesCol = collection(db, 'courses', courseId, 'modules');
    const modulesSnapshot = await getDocs(query(modulesCol, orderBy('order')));
    return modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
  }, []);

  const addModule = useCallback(async (courseId: string, moduleData: Omit<Module, 'id' | 'order'>): Promise<Module> => {
    const modulesCol = collection(db, 'courses', courseId, 'modules');
    const snapshot = await getDocs(query(modulesCol, orderBy('order', 'desc'), limit(1)));
    const maxOrder = snapshot.empty ? -1 : snapshot.docs[0].data().order;
    const newModule = { ...moduleData, order: maxOrder + 1 };
    
    const docRef = await addDoc(modulesCol, newModule);
    return { id: docRef.id, ...newModule };
  }, []);

  const updateModule = useCallback(async (courseId: string, moduleId: string, moduleData: Partial<Module>) => {
    const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
    await updateDoc(moduleRef, moduleData);
  }, []);

  const deleteModule = useCallback(async (courseId: string, moduleId: string) => {
    const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
    await deleteDoc(moduleRef);
  }, []);
  
  const updateModulesOrder = useCallback(async (courseId: string, orderedModules: Module[]) => {
    const batch = writeBatch(db);
    orderedModules.forEach((module, index) => {
      const moduleRef = doc(db, 'courses', courseId, 'modules', module.id);
      batch.update(moduleRef, { order: index });
    });
    await batch.commit();
  }, []);

  const getLessonsForModule = useCallback(async (courseId: string, moduleId: string): Promise<Lesson[]> => {
    const lessonsCol = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
    const lessonsSnapshot = await getDocs(query(lessonsCol, orderBy('order')));
    return lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
  }, []);

  const addLesson = useCallback(async (courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id' | 'order'>): Promise<Lesson> => {
    const lessonsCol = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
    const snapshot = await getDocs(query(lessonsCol, orderBy('order', 'desc'), limit(1)));
    const maxOrder = snapshot.empty ? -1 : snapshot.docs[0].data().order;
    const newLesson = { ...lessonData, order: maxOrder + 1 };

    const docRef = await addDoc(lessonsCol, newLesson);
    return { id: docRef.id, ...newLesson };
  }, []);

  const updateLesson = useCallback(async (courseId: string, moduleId: string, lessonId: string, lessonData: Partial<Lesson>) => {
    const lessonRef = doc(db, 'courses', courseId, 'modules', moduleId, 'lessons', lessonId);
    await updateDoc(lessonRef, lessonData);
  }, []);

  const deleteLesson = useCallback(async (courseId: string, moduleId: string, lessonId: string) => {
    const lessonRef = doc(db, 'courses', courseId, 'modules', moduleId, 'lessons', lessonId);
    await deleteDoc(lessonRef);
  }, []);

  // --- Admin Bonus Functions ---
  const getAllBonuses = useCallback(async (): Promise<Bonus[]> => {
    const bonusesCol = collection(db, 'bonuses');
    const bonusesSnapshot = await getDocs(query(bonusesCol, orderBy('order')));
    return bonusesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bonus));
  }, []);

  const addBonus = useCallback(async (bonusData: Omit<Bonus, 'id' | 'order'>): Promise<Bonus> => {
    const bonusesCol = collection(db, 'bonuses');
    const snapshot = await getDocs(query(bonusesCol, orderBy('order', 'desc'), limit(1)));
    const maxOrder = snapshot.empty ? -1 : snapshot.docs[0].data().order;
    const newBonus = { ...bonusData, order: maxOrder + 1 };

    const docRef = await addDoc(bonusesCol, newBonus);
    return { id: docRef.id, ...newBonus };
  }, []);
  
  const updateBonus = useCallback(async (bonusId: string, bonusData: Partial<Bonus>) => {
    const bonusRef = doc(db, 'bonuses', bonusId);
    await updateDoc(bonusRef, bonusData);
  }, []);

  const deleteBonus = useCallback(async (bonusId: string) => {
    const bonusRef = doc(db, 'bonuses', bonusId);
    await deleteDoc(bonusRef);
  }, []);

  const updateBonusesOrder = useCallback(async (orderedBonuses: Bonus[]) => {
    const batch = writeBatch(db);
    orderedBonuses.forEach((bonus, index) => {
      const bonusRef = doc(db, 'bonuses', bonus.id);
      batch.update(bonusRef, { order: index });
    });
    await batch.commit();
  }, []);


  const value = useMemo(() => ({
    currentUser, userRole, loading, signup, login, logout, resetPassword,
    adminResetPassword, adminDeleteUser, adminUpdateUser, adminGetAllUsers,
    getAllCourses, addCourse, updateCourse, deleteCourse, updateCoursesOrder,
    getModulesForCourse, addModule, updateModule, deleteModule, updateModulesOrder,
    getLessonsForModule, addLesson, updateLesson, deleteLesson,
    getAllBonuses, addBonus, updateBonus, deleteBonus, updateBonusesOrder,
  }), [currentUser, userRole, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};