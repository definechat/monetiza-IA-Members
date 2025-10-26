import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Course } from '../../types/course';
import CourseFormModal from '../../components/admin/CourseFormModal';

const AdminCoursesListPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

    const { getAllCourses, addCourse, updateCourse, deleteCourse } = useAuth();
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

    const handleOpenModal = (course?: Course) => {
        setEditingCourse(course || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };
    
    const handleSaveCourse = async (courseData: Omit<Course, 'id'> | Course) => {
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Curso</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {courses.map(course => (
                                            <tr key={course.id}>
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