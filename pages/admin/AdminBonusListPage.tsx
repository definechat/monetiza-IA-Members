import React, { useState, useEffect, DragEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bonus } from '../../types/bonus';
import BonusFormModal from '../../components/admin/BonusFormModal';

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

const AdminBonusListPage: React.FC = () => {
    const [bonuses, setBonuses] = useState<Bonus[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);
    const [deletingBonus, setDeletingBonus] = useState<Bonus | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<Bonus | null>(null);

    const { getAllBonuses, addBonus, updateBonus, deleteBonus, updateBonusesOrder } = useAuth();

    useEffect(() => {
        const fetchBonuses = async () => {
            setLoading(true);
            try {
                const fetchedBonuses = await getAllBonuses();
                setBonuses(fetchedBonuses);
            } catch (error) {
                console.error("Failed to fetch bonuses", error);
            }
            setLoading(false);
        };
        fetchBonuses();
    }, [getAllBonuses]);

    // Drag and Drop Handlers
    const handleDragStart = (e: DragEvent<HTMLTableRowElement>, bonus: Bonus) => {
        setDraggedItem(bonus);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragOver = (e: DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLTableRowElement>, targetBonus: Bonus) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.id === targetBonus.id) {
            return;
        }

        const currentIndex = bonuses.findIndex(b => b.id === draggedItem.id);
        const targetIndex = bonuses.findIndex(b => b.id === targetBonus.id);

        let newBonuses = [...bonuses];
        const [removed] = newBonuses.splice(currentIndex, 1);
        newBonuses.splice(targetIndex, 0, removed);
        
        setBonuses(newBonuses); // Optimistic update
        
        updateBonusesOrder(newBonuses)
            .then(() => {
                setToastMessage("Ordem salva com sucesso!");
            })
            .catch(err => {
                console.error("Failed to save order:", err);
                setBonuses(bonuses); // Revert on failure
            });
    };

    const handleDragEnd = (e: DragEvent<HTMLTableRowElement>) => {
        setDraggedItem(null);
        e.currentTarget.style.opacity = '1';
    };

    const handleOpenModal = (bonus?: Bonus) => {
        setEditingBonus(bonus || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBonus(null);
    };
    
    const handleSaveBonus = async (bonusData: Omit<Bonus, 'id' | 'order'> | Bonus) => {
        try {
            if ('id' in bonusData) {
                await updateBonus(bonusData.id, bonusData);
                setBonuses(prev => prev.map(b => b.id === bonusData.id ? { ...b, ...bonusData } : b));
            } else {
                const newBonus = await addBonus(bonusData);
                setBonuses(prev => [...prev, newBonus]);
            }
        } catch(error) {
            console.error("Failed to save bonus", error);
        }
        handleCloseModal();
    };
    
    const handleDeleteBonus = async () => {
        if (!deletingBonus) return;
        try {
            await deleteBonus(deletingBonus.id);
            setBonuses(prev => prev.filter(b => b.id !== deletingBonus.id));
        } catch(error) {
            console.error("Failed to delete bonus", error);
        }
        setDeletingBonus(null);
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
                            <h1 className="text-3xl font-bold text-white">Gerenciador de Bônus</h1>
                            <p className="text-gray-400 mt-1">Adicione, edite e organize seus materiais bônus.</p>
                        </div>
                        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                            Adicionar Bônus
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            {bonuses.length === 0 ? (
                                <div className="text-center p-10 text-gray-500">Nenhum bônus encontrado.</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700/50">
                                        <tr>
                                            <th className="px-4 py-3 w-12"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Título</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {bonuses.map(bonus => (
                                            <tr 
                                                key={bonus.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, bonus)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, bonus)}
                                                onDragEnd={handleDragEnd}
                                                className="hover:bg-gray-700/50 transition-colors cursor-grab"
                                            >
                                                <td className="px-4 py-4 text-gray-500 hover:text-white">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-white">{bonus.title}</div>
                                                    <div className="text-sm text-gray-400">{bonus.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-4">
                                                        <button onClick={() => handleOpenModal(bonus)} className="text-indigo-400 hover:text-indigo-300">Editar</button>
                                                        <button onClick={() => setDeletingBonus(bonus)} className="text-red-500 hover:text-red-400">Deletar</button>
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

            {isModalOpen && <BonusFormModal bonus={editingBonus} onClose={handleCloseModal} onSave={handleSaveBonus} />}
            
            {deletingBonus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-white">Deletar Bônus</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            Tem certeza que deseja deletar o bônus <strong className="text-white">{deletingBonus.title}</strong>? Esta ação é irreversível.
                        </p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setDeletingBonus(null)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                            <button onClick={handleDeleteBonus} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Deletar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminBonusListPage;