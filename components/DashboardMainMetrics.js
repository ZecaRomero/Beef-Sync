import React from 'react';
import { Card, CardContent } from './ui/card';

const DashboardMainMetrics = ({ quickStats, formatCurrency }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            Total de Animais
                        </p>
                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                            {quickStats.totalAnimals.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            +12 este mês
                        </p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                        <span className="text-3xl">🐄</span>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            Valor do Rebanho
                        </p>
                        <p className="text-3xl font-black text-green-600 dark:text-green-400">
                            {formatCurrency(quickStats.totalValue)}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            +5.2% vs mês anterior
                        </p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                        <span className="text-3xl">💰</span>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            Protocolos Pendentes
                        </p>
                        <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                            {quickStats.pendingProtocols}
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            3 urgentes
                        </p>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-lg">
                        <span className="text-3xl">🎯</span>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            Processos FIV
                        </p>
                        <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                            {quickStats.activeProcesses}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                            2 em andamento
                        </p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                        <span className="text-3xl">🧬</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

export default DashboardMainMetrics;
