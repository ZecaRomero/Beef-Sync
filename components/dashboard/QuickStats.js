import React from 'react';
import { Card, CardContent } from '../ui/card';
import { useApp } from '../../contexts/AppContext';

const QuickStats = () => {
  const { state } = useApp();

  const quickStats = [
    {
      label: 'Animais Ativos',
      value: state.animals.filter(a => a.status === 'Ativo').length,
      total: state.animals.length,
      icon: '🐄',
      color: 'blue'
    },
    {
      label: 'Materiais OK',
      value: state.materials.filter(m => m.quantity > m.minStock).length,
      total: state.materials.length,
      icon: '📦',
      color: 'green'
    },
    {
      label: 'Vendas Mês',
      value: state.sales.filter(s => {
        const saleDate = new Date(s.date);
        const now = new Date();
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }).length,
      total: state.sales.length,
      icon: '💰',
      color: 'purple'
    },
    {
      label: 'Alertas',
      value: state.stats.pendingTasks,
      total: state.stats.pendingTasks,
      icon: '⚠️',
      color: state.stats.pendingTasks > 0 ? 'red' : 'gray'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
      red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
      gray: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30'
    };
    return colors[color] || colors.gray;
  };

  const getProgressColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {quickStats.map((stat, index) => (
        <Card key={index} className="border border-gray-200 dark:border-gray-600">
          <CardContent className="pt-3 sm:pt-4 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                <span className="text-lg sm:text-lg">{stat.icon}</span>
              </div>
              <div className="text-right">
                <div className={`text-xl sm:text-2xl font-bold ${getColorClasses(stat.color).split(' ')[0]}`}>
                  {stat.value}
                </div>
                {stat.total > 0 && stat.color !== 'red' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    de {stat.total}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-2">
              <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.label}
              </div>
            </div>

            {stat.total > 0 && stat.color !== 'red' && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(stat.color)}`}
                  style={{ width: `${(stat.value / stat.total) * 100}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
