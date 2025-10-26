import React, { useState, useEffect, FormEvent } from 'react';
import { AdminUser } from '../../types/user';

interface EditUserModalProps {
    user: AdminUser;
    onClose: () => void;
    onSave: (user: AdminUser) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<AdminUser>(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Editar Usuário</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="name">Nome</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">E-mail</label>
                        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="status">Status</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-700 text-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
