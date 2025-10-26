import React from 'react';

const notifications = [
    { id: 1, text: 'Novo curso "Sistema Colheita" adicionado!', time: '2h atrás' },
    { id: 2, text: 'Manutenção programada para amanhã às 02:00.', time: '1d atrás' },
    { id: 3, text: 'Você concluiu a aula "Introdução aos Chatbots".', time: '3d atrás' },
];

const NotificationDropdown: React.FC = () => {
    return (
        <div className="absolute right-0 mt-2 w-80 bg-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
            <div className="p-4 border-b border-gray-600">
                <h3 className="text-lg font-semibold text-white">Notificações</h3>
            </div>
            <ul className="divide-y divide-gray-600 max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                    <li key={notification.id} className="p-4 hover:bg-gray-600 transition-colors">
                        <p className="text-sm text-gray-300">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationDropdown;