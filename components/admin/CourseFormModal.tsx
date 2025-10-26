import React, { useState, FormEvent, useEffect } from 'react';
import { Course } from '../../types/course';

interface CourseFormModalProps {
    course: Course | null;
    onClose: () => void;
    onSave: (course: Omit<Course, 'id'> | Course) => void;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ course, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');
    const [isLocked, setIsLocked] = useState(true);
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (course) {
            setTitle(course.title);
            setDescription(course.description);
            setBannerUrl(course.bannerUrl);
            setIsLocked(course.isLocked);
            setPassword(course.password || '');
        }
    }, [course]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const courseData = { title, description, bannerUrl, isLocked, password };
        if (course) {
            onSave({ ...course, ...courseData });
        } else {
            onSave(courseData);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">{course ? 'Editar' : 'Adicionar'} Curso</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-400 mb-1">URL do Banner</label>
                        <input id="bannerUrl" type="text" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} required className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" id="isLocked" checked={isLocked} onChange={e => setIsLocked(e.target.checked)} className="h-4 w-4 rounded text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                        <label htmlFor="isLocked" className="text-sm text-gray-300">Curso Exclusivo (Requer Senha)</label>
                    </div>
                    {isLocked && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Senha do Curso</label>
                            <input id="password" type="text" value={password} onChange={e => setPassword(e.target.value)} required={isLocked} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseFormModal;