import React, { useState, useEffect, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Course } from '../../types/course';
import CourseFormModal from '../../components/admin/CourseFormModal';

// Toast Notification Component
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-md shadow-lg text-white bg-green-500 animate-fade-in-down">
            {message}
        </div>
    );
};

const AdminCoursesListPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<Course | null>(null);

    const { getAllCourses, addCourse, updateCourse, deleteCourse, updateCoursesOrder } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const fetchedCourses = await getAllCourses();
                setCourses(fetchedCourses);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
            setLoading(false);
        };
        fetchCourses();
    }, [getAllCourses]);

    // Drag and Drop Handlers
    const handleDragStart = (e: DragEvent<HTMLTableRowElement>, course: Course) => {
        setDraggedItem(course);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragOver = (e: DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLTableRowElement>, targetCourse: Course) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.id === targetCourse.id) {
            return;
        }

        const currentIndex = courses.findIndex(c => c.id === draggedItem.id);
        const targetIndex = courses.findIndex(c => c.id === targetCourse.id);

        let newCourses = [...courses];
        const [removed] = newCourses.splice(currentIndex, 1);
        newCourses.splice(targetIndex, 0, removed);
        
        setCourses(newCourses); // Optimistic update
        
        updateCoursesOrder(newCourses)
            .then(() => {
                setToastMessage("Ordem salva com sucesso!");
            })
            .catch(err => {
                console.error("Failed to save order:", err);
                setCourses(courses); // Revert on failure
            });
    };

    const handleDragEnd = (e: DragEvent<HTMLTableRowElement>) => {
        setDraggedItem(null);
        e.currentTarget.style.opacity = '1';
    };


    const handleOpenModal = (course?: Course) => {
        setEditingCourse(course || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };
    
    const handleSaveCourse = async (courseData: Omit<Course, 'id' | 'order'> | Course) => {
        try {
            if ('id' in courseData) {
                await updateCourse(courseData.id, courseData);
                setCourses(prev => prev.map(c => c.id === courseData.id ? { ...c, ...courseData } : c));
            } else {
                const newCourse = await addCourse(courseData);
                setCourses(prev => [...prev, newCourse]);
            }
        } catch(error) {
            console.error("Failed to save course", error);
        }
        handleCloseModal();
    };
    
    const handleDeleteCourse = async () => {
        if (!deletingCourse) return;
        try {
            await deleteCourse(deletingCourse.id);
            setCourses(prev => prev.filter(c => c.id !== deletingCourse.id));
        } catch(error) {
            console.error("Failed to delete course", error);
        }
        setDeletingCourse(null);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Gerenciador de Cursos</h1>
                            <p className="text-gray-400 mt-1">Adicione, edite e organize seus cursos.</p>
                        </div>
                        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                            Adicionar Curso
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            {courses.length === 0 ? (
                                <div className="text-center p-10 text-gray-500">Nenhum curso encontrado.</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700/50">
                                        <tr>
                                            <th className="px-4 py-3 w-12"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Curso</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {courses.map(course => (
                                            <tr 
                                                key={course.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, course)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, course)}
                                                onDragEnd={handleDragEnd}
                                                className="hover:bg-gray-700/50 transition-colors cursor-grab"
                                            >
                                                <td className="px-4 py-4 text-gray-500 hover:text-white">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-md object-cover" src={course.bannerUrl} alt={course.title} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-white">{course.title}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isLocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                                        {course.isLocked ? 'Exclusivo' : 'Aberto'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-4">
                                                        <button onClick={() => navigate(`/admin/courses/${course.id}/edit`)} className="text-blue-400 hover:text-blue-300">Gerenciar</button>
                                                        <button onClick={() => handleOpenModal(course)} className="text-indigo-400 hover:text-indigo-300">Editar</button>
                                                        <button onClick={() => setDeletingCourse(course)} className="text-red-500 hover:text-red-400">Deletar</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && <CourseFormModal course={editingCourse} onClose={handleCloseModal} onSave={handleSaveCourse} />}
            
            {deletingCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-white">Deletar Curso</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            Tem certeza que deseja deletar o curso <strong className="text-white">{deletingCourse.title}</strong>? Esta ação é irreversível.
                        </p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setDeletingCourse(null)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                            <button onClick={handleDeleteCourse} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Deletar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminCoursesListPage;