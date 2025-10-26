import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Course, Module, Lesson } from '../../types/course';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ModuleFormModal from '../../components/admin/ModuleFormModal';
import LessonFormModal from '../../components/admin/LessonFormModal';

const AdminCourseEditPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { getModulesForCourse, getLessonsForModule, addModule, updateModule, deleteModule, addLesson, updateLesson, deleteLesson } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [lessons, setLessons] = useState<{ [moduleId: string]: Lesson[] }>({});
    const [loading, setLoading] = useState(true);

    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
    
    const [deletingItem, setDeletingItem] = useState<{ type: 'module' | 'lesson'; item: Module | Lesson } | null>(null);

    const loadData = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        try {
            const courseRef = doc(db, 'courses', courseId);
            const courseSnap = await getDoc(courseRef);
            if(courseSnap.exists()) setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);

            const fetchedModules = await getModulesForCourse(courseId);
            setModules(fetchedModules);

            const lessonsMap: { [moduleId: string]: Lesson[] } = {};
            for (const module of fetchedModules) {
                lessonsMap[module.id] = await getLessonsForModule(courseId, module.id);
            }
            setLessons(lessonsMap);
        } catch (error) {
            console.error("Failed to load course data", error);
        }
        setLoading(false);
    }, [courseId, getModulesForCourse, getLessonsForModule]);

    useEffect(() => {
        loadData();
    }, [loadData]);
    
    // Module Handlers
    const handleSaveModule = async (moduleData: Omit<Module, 'id'> | Module) => {
        if (!courseId) return;
        try {
            if ('id' in moduleData) {
                await updateModule(courseId, moduleData.id, moduleData);
            } else {
                await addModule(courseId, moduleData);
            }
            loadData();
        } catch (error) { console.error("Failed to save module", error); }
        setIsModuleModalOpen(false);
        setEditingModule(null);
    };

    // Lesson Handlers
    const handleSaveLesson = async (lessonData: Omit<Lesson, 'id'> | Lesson) => {
        if (!courseId || !currentModuleId) return;
        try {
            if ('id' in lessonData) {
                await updateLesson(courseId, currentModuleId, lessonData.id, lessonData);
            } else {
                await addLesson(courseId, currentModuleId, lessonData);
            }
            loadData();
        } catch (error) { console.error("Failed to save lesson", error); }
        setIsLessonModalOpen(false);
        setEditingLesson(null);
        setCurrentModuleId(null);
    };
    
    const handleDelete = async () => {
        if (!deletingItem || !courseId) return;
        const { type, item } = deletingItem;
        try {
            if (type === 'module') {
                await deleteModule(courseId, item.id);
            } else if (type === 'lesson') {
                const moduleId = Object.keys(lessons).find(mId => lessons[mId].some(l => l.id === item.id));
                if (moduleId) {
                    await deleteLesson(courseId, moduleId, item.id);
                }
            }
            loadData();
        } catch (error) { console.error(`Failed to delete ${type}`, error); }
        setDeletingItem(null);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    if (!course) {
        return <div className="text-center p-10 text-gray-400">Curso não encontrado.</div>;
    }

    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Link to="/admin/courses" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Voltar para Cursos
                    </Link>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Gerenciar: {course.title}</h1>
                            <p className="text-gray-400 mt-1">Adicione módulos e aulas ao seu curso.</p>
                        </div>
                        <button onClick={() => { setEditingModule(null); setIsModuleModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                            Adicionar Módulo
                        </button>
                    </div>

                    <div className="space-y-6">
                        {modules.length === 0 ? (
                             <div className="text-center p-10 bg-gray-800 rounded-lg text-gray-500">Nenhum módulo adicionado ainda.</div>
                        ) : modules.map(module => (
                            <div key={module.id} className="bg-gray-800 rounded-lg shadow-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-white">{module.title}</h2>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => { setEditingModule(module); setIsModuleModalOpen(true); }} className="text-indigo-400 hover:text-indigo-300 text-sm">Editar Módulo</button>
                                        <button onClick={() => setDeletingItem({ type: 'module', item: module })} className="text-red-500 hover:text-red-400 text-sm">Deletar Módulo</button>
                                        <button onClick={() => { setCurrentModuleId(module.id); setEditingLesson(null); setIsLessonModalOpen(true); }} className="bg-blue-600/50 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm">Adicionar Aula</button>
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    {lessons[module.id]?.length > 0 ? lessons[module.id].map(lesson => (
                                        <li key={lesson.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
                                            <div>
                                                <p className="font-medium text-white">{lesson.title}</p>
                                                <p className="text-xs text-gray-400">{lesson.duration}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button onClick={() => { setCurrentModuleId(module.id); setEditingLesson(lesson); setIsLessonModalOpen(true); }} className="text-indigo-400 hover:text-indigo-300 text-sm">Editar</button>
                                                <button onClick={() => setDeletingItem({ type: 'lesson', item: lesson })} className="text-red-500 hover:text-red-400 text-sm">Deletar</button>
                                            </div>
                                        </li>
                                    )) : <p className="text-gray-500 text-sm px-3">Nenhuma aula neste módulo.</p>}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isModuleModalOpen && <ModuleFormModal module={editingModule} onClose={() => setIsModuleModalOpen(false)} onSave={handleSaveModule} />}
            {isLessonModalOpen && <LessonFormModal lesson={editingLesson} onClose={() => setIsLessonModalOpen(false)} onSave={handleSaveLesson} />}
            {deletingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-white">Deletar {deletingItem.type === 'module' ? 'Módulo' : 'Aula'}</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            Tem certeza que deseja deletar <strong className="text-white">{deletingItem.item.title}</strong>? Esta ação é irreversível.
                        </p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setDeletingItem(null)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Deletar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminCourseEditPage;