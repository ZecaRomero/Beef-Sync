import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useApp } from '../../contexts/AppContext';

const RecentActivity = () => {
  const { state } = useApp();

  // Combinar atividades recentes de diferentes fontes
  const activities = [
    ...state.sales.slice(0, 3).map(sale => ({
      id: `sale-${sale.id}`,
      type: 'sale',
      title: `Venda para ${sale.client}`,
      description: `${sale.animals.length} animais vendidos`,
      value: sale.totalValue,
      date: sale.date,
      icon: '💰',
      color: 'green'
    })),
    ...state.materials.filter(m => m.quantity <= m.minStock).slice(0, 2).map(material => ({
      id: `material-${material.id}`,
      type: 'alert',
      title: 'Estoque baixo',
      description: `${material.name} - ${material.quantity} ${material.unit}`,
      date: new Date().toISOString().split('T')[0],
      icon: '⚠️',
      color: 'red'
    })),
    ...state.animals.slice(0, 2).map(animal => ({
      id: `animal-${animal.id}`,
      type: 'animal',
      title: `Animal ${animal.name}`,
      description: `${animal.breed} - ${animal.weight}kg`,
      date: animal.birthDate,
      icon: '🐄',
      color: 'blue'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeLabel = (type) => {
    const labels = {
      sale: 'Venda',
      alert: 'Alerta',
      animal: 'Animal',
      process: 'Processo'
    };
    return labels[type] || type;
  };

  const getBadgeColor = (color) => {
    const colors = {
      green: 'bg-green-600 text-white',
      red: 'bg-red-600 text-white',
      blue: 'bg-blue-600 text-white',
      purple: 'bg-purple-600 text-white'
    };
    return colors[color] || 'bg-gray-600 text-white';
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-600 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white flex items-center">
          📋 Atividade Recente
          <Badge className="ml-2 bg-gray-600 text-white">
            {activities.length} itens
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma atividade recente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="text-2xl">{activity.icon}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {activity.title}
                    </h4>
                    <Badge className={`text-xs ${getBadgeColor(activity.color)}`}>
                      {getTypeLabel(activity.type)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(activity.date)}
                    </span>
                    {activity.value && (
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(activity.value)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;