import React, { useState, FormEvent, useEffect } from 'react';
import { Lesson } from '../../types/course';

interface LessonFormModalProps {
    lesson: Lesson | null;
    onClose: () => void;
    onSave: (lesson: Omit<Lesson, 'id'> | Lesson) => void;
}

const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    let videoId = '';
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        videoId = match[1];
    } else {
        return url; // Return original url if not a valid YouTube link
    }
    return `https://www.youtube.com/embed/${videoId}`;
};

const LessonFormModal: React.FC<LessonFormModalProps> = ({ lesson, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (lesson) {
            setTitle(lesson.title);
            setDuration(lesson.duration);
            setVideoUrl(lesson.videoUrl);
            setDescription(lesson.description);
        } else {
            setTitle('');
            setDuration('');
            setVideoUrl('');
            setDescription('');
        }
    }, [lesson]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const embedUrl = getYouTubeEmbedUrl(videoUrl);
        const lessonData = { title, duration, videoUrl: embedUrl, description };
        if (lesson) {
            onSave({ ...lesson, ...lessonData });
        } else {
            onSave(lessonData);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">{lesson ? 'Editar' : 'Adicionar'} Aula</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Título da Aula</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-1">Duração (ex: 08:40)</label>
                        <input id="duration" type="text" value={duration} onChange={e => setDuration(e.target.value)} required className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                     <div>
                        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-400 mb-1">Link do YouTube</label>
                        <input id="videoUrl" type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required placeholder="Cole o link do YouTube aqui" className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Descrição / Material de Apoio</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonFormModal;