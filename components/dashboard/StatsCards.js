import React from 'react';
import { Card, CardContent } from '../ui/card';
import { useApp } from '../../contexts/AppContext';

const StatsCards = () => {
  const { state } = useApp();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    {
      title: 'Total de Animais',
      value: state.stats.totalAnimals,
      icon: '🐄',
      color: 'blue',
      change: '+5 este mês'
    },
    {
      title: 'Valor do Rebanho',
      value: formatCurrency(state.stats.totalValue),
      icon: '💰',
      color: 'green',
      change: '+12.5% vs mês anterior'
    },
    {
      title: 'Lucro Mensal',
      value: formatCurrency(state.stats.monthlyProfit),
      icon: '📈',
      color: 'purple',
      change: '+8.3% vs mês anterior'
    },
    {
      title: 'Tarefas Pendentes',
      value: state.stats.pendingTasks,
      icon: '⚠️',
      color: state.stats.pendingTasks > 0 ? 'red' : 'gray',
      change: state.stats.pendingTasks > 0 ? 'Requer atenção' : 'Tudo em dia'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20',
      green: 'border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900/20',
      purple: 'border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20',
      red: 'border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/20',
      gray: 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20'
    };
    return colors[color] || colors.gray;
  };

  const getTextColor = (color) => {
    const colors = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      red: 'text-red-600 dark:text-red-400',
      gray: 'text-gray-600 dark:text-gray-400'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`border-2 shadow-lg hover:shadow-xl transition-shadow ${getColorClasses(card.color)}`}
        >
          <CardContent className="pt-3 sm:pt-4 md:pt-6 p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
                  {card.title}
                </p>
                <p className={`text-lg sm:text-xl md:text-3xl font-black ${getTextColor(card.color)} mb-2`}>
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {card.change}
                </p>
              </div>
              <div className={`text-2xl sm:text-3xl md:text-4xl p-2 sm:p-3 rounded-lg ${getColorClasses(card.color)} flex-shrink-0 ml-2`}>
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
