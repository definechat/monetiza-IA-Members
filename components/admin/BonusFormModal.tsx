import React, { useState, FormEvent, useEffect } from 'react';
import { Bonus } from '../../types/bonus';

interface BonusFormModalProps {
    bonus: Bonus | null;
    onClose: () => void;
    onSave: (bonus: Omit<Bonus, 'id' | 'order'> | Bonus) => void;
}

const BonusFormModal: React.FC<BonusFormModalProps> = ({ bonus, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (bonus) {
            setTitle(bonus.title);
            setDescription(bonus.description);
            setContent(bonus.content || '');
        } else {
            setTitle('');
            setDescription('');
            setContent('');
        }
    }, [bonus]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const bonusData = { title, description, content };
        if (bonus) {
            onSave({ ...bonus, ...bonusData });
        } else {
            onSave(bonusData);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">{bonus ? 'Editar' : 'Adicionar'} Bônus</h3>
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
                        <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">Conteúdo (Entregáveis)</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={10} placeholder="Insira textos e links para arquivos aqui..." className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

export default BonusFormModal;