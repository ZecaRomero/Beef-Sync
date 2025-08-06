import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const PerformanceMetrics = ({ stats }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [metrics, setMetrics] = useState({
    growth: {
      animals: 5.2,
      value: 8.7,
      profit: 12.3
    },
    efficiency: {
      protocols: 94.5,
      fiv: 87.2,
      sales: 91.8
    },
    comparison: {
      market: 15.3,
      sector: 8.9,
      region: 22.1
    }
  });

  const periods = [
    { id: 'week', label: 'Semana', icon: '📅' },
    { id: 'month', label: 'Mês', icon: '📊' },
    { id: 'quarter', label: 'Trimestre', icon: '📈' },
    { id: 'year', label: 'Ano', icon: '🗓️' }
  ];

  const getGrowthColor = (value) => {
    if (value > 10) return 'text-green-600 dark:text-green-400';
    if (value > 5) return 'text-blue-600 dark:text-blue-400';
    if (value > 0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGrowthIcon = (value) => {
    if (value > 10) return '🚀';
    if (value > 5) return '📈';
    if (value > 0) return '➡️';
    return '📉';
  };

  const getEfficiencyColor = (value) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 80) return 'bg-blue-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      title: 'ROI Médio',
      value: '18.5%',
      change: '+2.3%',
      trend: 'up',
      description: 'Retorno sobre investimento',
      icon: '💹'
    },
    {
      title: 'Conversão FIV',
      value: '87.2%',
      change: '+5.1%',
      trend: 'up',
      description: 'Taxa de sucesso em FIV',
      icon: '🧬'
    },
    {
      title: 'Tempo Médio Venda',
      value: '18 meses',
      change: '-2 meses',
      trend: 'up',
      description: 'Tempo até venda',
      icon: '⏱️'
    },
    {
      title: 'Margem de Lucro',
      value: '24.8%',
      change: '+1.2%',
      trend: 'up',
      description: 'Margem sobre vendas',
      icon: '💰'
    }
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            📊 Métricas de Performance
            <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              ↗️ Em alta
            </Badge>
          </CardTitle>
          
          <div className="flex space-x-1">
            {periods.map(period => (
              <Button
                key={period.id}
                variant={selectedPeriod === period.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period.id)}
                className={`text-xs ${
                  selectedPeriod === period.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {period.icon} {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{kpi.icon}</span>
                  <Badge 
                    className={`text-xs ${
                      kpi.trend === 'up' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    {kpi.change}
                  </Badge>
                </div>
                
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {kpi.value}
                </div>
                
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {kpi.title}
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {kpi.description}
                </div>
              </div>
            ))}
          </div>

          {/* Crescimento */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              📈 Crescimento ({selectedPeriod === 'month' ? 'Mensal' : selectedPeriod === 'week' ? 'Semanal' : selectedPeriod === 'quarter' ? 'Trimestral' : 'Anual'})
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getGrowthColor(metrics.growth.animals)}`}>
                  {getGrowthIcon(metrics.growth.animals)} +{metrics.growth.animals}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rebanho</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${getGrowthColor(metrics.growth.value)}`}>
                  {getGrowthIcon(metrics.growth.value)} +{metrics.growth.value}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Valor</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${getGrowthColor(metrics.growth.profit)}`}>
                  {getGrowthIcon(metrics.growth.profit)} +{metrics.growth.profit}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Lucro</div>
              </div>
            </div>
          </div>

          {/* Eficiência Operacional */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              ⚡ Eficiência Operacional
            </h4>
            
            <div className="space-y-3">
              {[
                { label: 'Protocolos Sanitários', value: metrics.efficiency.protocols, icon: '💉' },
                { label: 'Processos FIV', value: metrics.efficiency.fiv, icon: '🧬' },
                { label: 'Vendas Planejadas', value: metrics.efficiency.sales, icon: '💰' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getEfficiencyColor(item.value)}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white w-12">
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparação com Mercado */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              🎯 Performance vs Mercado
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  +{metrics.comparison.market}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">vs Mercado</div>
                <Badge className="mt-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                  Acima
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  +{metrics.comparison.sector}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">vs Setor</div>
                <Badge className="mt-1 bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
                  Superior
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{metrics.comparison.region}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">vs Região</div>
                <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Líder
                </Badge>
              </div>
            </div>
          </div>

          {/* Insights e Recomendações */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              💡 Insights e Recomendações
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Excelente performance:</strong> ROI 15.3% acima do mercado
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-blue-500">💡</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Oportunidade:</strong> Expandir processos FIV (87.2% de sucesso)
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-orange-500">⚠️</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Atenção:</strong> Otimizar tempo de venda (18 meses atual)
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;