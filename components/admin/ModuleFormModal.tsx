import React, { useState, FormEvent, useEffect } from 'react';
import { Module } from '../../types/course';

interface ModuleFormModalProps {
    module: Module | null;
    onClose: () => void;
    onSave: (module: Omit<Module, 'id'> | Module) => void;
}

const ModuleFormModal: React.FC<ModuleFormModalProps> = ({ module, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (module) {
            setTitle(module.title);
            setDescription(module.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [module]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const moduleData = { title, description };
        if (module) {
            onSave({ ...module, ...moduleData });
        } else {
            onSave(moduleData);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">{module ? 'Editar' : 'Adicionar'} Módulo</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

export default ModuleFormModal;