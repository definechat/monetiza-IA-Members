import React, { useState, FormEvent, useEffect } from 'react';
import { Lesson, LessonType } from '../../types/course';
import { getYouTubeEmbedUrl } from '../../utils/youtube';

interface LessonFormModalProps {
    lesson: Lesson | null;
    onClose: () => void;
    onSave: (lesson: Omit<Lesson, 'id' | 'order'> | Lesson) => void;
}

const LessonFormModal: React.FC<LessonFormModalProps> = ({ lesson, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<LessonType>('video');
    const [videoUrl, setVideoUrl] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (lesson) {
            setTitle(lesson.title);
            setDuration(lesson.duration);
            setDescription(lesson.description);
            setType(lesson.type);
            setVideoUrl(lesson.videoUrl || '');
            setContent(lesson.content || '');
        } else {
            setTitle('');
            setDuration('');
            setDescription('');
            setType('video');
            setVideoUrl('');
            setContent('');
        }
    }, [lesson]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        let lessonData: Omit<Lesson, 'id' | 'order'> = { 
            title, 
            duration, 
            description, 
            type,
        };
        
        if (type === 'video') {
            lessonData.videoUrl = getYouTubeEmbedUrl(videoUrl);
        } else {
            lessonData.content = content;
        }

        if (lesson) {
            onSave({ ...lesson, ...lessonData });
        } else {
            onSave(lessonData);
        }
    };
    
    const renderPreview = () => {
        if (type === 'video' && videoUrl) {
            const embedUrl = getYouTubeEmbedUrl(videoUrl);
            if (embedUrl) {
                return (
                    <div className="aspect-video">
                        <iframe 
                            src={embedUrl} 
                            title="Pré-visualização do Vídeo" 
                            className="w-full h-full rounded-md"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                        ></iframe>
                    </div>
                );
            }
        } else if (type === 'text' && content) {
            return (
                <div className="bg-gray-900 p-4 rounded-md border border-gray-600 max-h-48 overflow-y-auto">
                    <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
                </div>
            );
        } else if (type === 'link' && content) {
            return (
                <div>
                    <a href={content} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        Testar Link do Material
                    </a>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">{lesson ? 'Editar' : 'Adicionar'} Aula</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Título da Aula</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-1">Duração (ex: 08:40 ou N/A)</label>
                        <input id="duration" type="text" value={duration} onChange={e => setDuration(e.target.value)} required className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">Tipo de Aula</label>
                        <select id="type" value={type} onChange={e => setType(e.target.value as LessonType)} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="video">Vídeo</option>
                            <option value="text">Texto</option>
                            <option value="link">Link / Material de Apoio</option>
                        </select>
                    </div>
                    
                    {type === 'video' && (
                        <div>
                            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-400 mb-1">Link do YouTube</label>
                            <input id="videoUrl" type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required placeholder="Cole o link do YouTube aqui" className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}

                    {(type === 'text' || type === 'link') && (
                        <div>
                             <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">
                                {type === 'text' ? 'Conteúdo do Texto' : 'URL do Material de Apoio'}
                            </label>
                            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={type === 'text' ? 8 : 2} placeholder={type === 'text' ? 'Escreva o conteúdo da aula aqui...' : 'https://...'} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {(videoUrl || content) && (
                        <div className="border-t border-gray-700 pt-4">
                            <h4 className="text-md font-semibold text-white mb-2">Pré-visualização</h4>
                            {renderPreview()}
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

export default LessonFormModal;