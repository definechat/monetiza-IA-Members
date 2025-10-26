import React from 'react';
import { AdminUser } from '../../types/user';

interface UsersChartProps {
    users: AdminUser[];
}

const UsersChart: React.FC<UsersChartProps> = ({ users }) => {
    
    if (!users || users.length === 0) {
        return (
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Cadastros de Alunos</h3>
                <div className="text-center py-16 bg-gray-900/30 rounded-lg">
                    <p className="text-gray-500">Nenhum dado de cadastro para exibir.</p>
                </div>
            </div>
        );
    }

    const processUserData = (users: AdminUser[]) => {
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const monthlySignups: { [key: string]: number } = {};

        // Initialize months
        monthNames.forEach(month => {
            monthlySignups[month] = 0;
        });

        users.forEach(user => {
            // Assuming date format is DD/MM/YYYY HH:MM:SS
            const parts = user.creationDate.split(' ')[0].split('/');
            if (parts.length === 3) {
                const monthIndex = parseInt(parts[1], 10) - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    const monthName = monthNames[monthIndex];
                    monthlySignups[monthName]++;
                }
            }
        });

        return monthNames.map(month => ({ month, value: monthlySignups[month] }));
    };

    const chartData = processUserData(users);
    const chartHeight = 250;
    const chartWidth = 600;
    const maxValue = Math.max(...chartData.map(d => d.value), 5); // Ensure a minimum height for the y-axis

    const points = chartData.map((point, i) => {
        const x = (i / (chartData.length - 1)) * chartWidth;
        const y = chartHeight - (point.value / maxValue) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Cadastros de Alunos</h3>
            <select className="bg-gray-700 text-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Este ano</option>
            </select>
        </div>
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-[600px]">
            {/* Y-axis lines */}
            {[0.25, 0.5, 0.75, 1].map(val => (
                <line 
                key={val}
                x1="0" y1={chartHeight - (chartHeight * val)}
                x2={chartWidth} y2={chartHeight - (chartHeight * val)}
                stroke="#4A5568" strokeWidth="1" strokeDasharray="3 3" 
                />
            ))}
            {/* Gradient for area under the curve */}
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Area under the curve */}
            <polyline
                fill="url(#chartGradient)"
                points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
            />
            {/* The line */}
            <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                points={points}
            />
            {/* Data points */}
            {chartData.map((point, i) => {
                const x = (i / (chartData.length - 1)) * chartWidth;
                const y = chartHeight - (point.value / maxValue) * chartHeight;
                return <circle key={i} cx={x} cy={y} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />;
            })}
            </svg>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
            {chartData.map(d => <span key={d.month}>{d.month}</span>)}
        </div>
        </div>
    );
};

export default UsersChart;
