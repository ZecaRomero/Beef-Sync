import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select } from './ui/select';

const FinancialDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [financialData, setFinancialData] = useState({
    revenue: 850000,
    costs: 620000,
    profit: 230000,
    roi: 18.5,
    cashFlow: 45000,
    investments: 180000
  });

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'revenue',
      category: 'sale',
      description: 'Venda de 15 animais - Frigorífico ABC',
      amount: 85000,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'cost',
      category: 'material',
      description: 'Compra de medicamentos - Vetfarma',
      amount: -12500,
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: 3,
      type: 'investment',
      category: 'fiv',
      description: 'Processo FIV - 8 doadoras',
      amount: -25000,
      date: '2024-01-12',
      status: 'pending'
    },
    {
      id: 4,
      type: 'revenue',
      category: 'sale',
      description: 'Venda de sêmen - Fazenda Sul',
      amount: 15000,
      date: '2024-01-10',
      status: 'completed'
    }
  ]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const getTransactionIcon = (type, category) => {
    const icons = {
      revenue: {
        sale: '💰',
        service: '🔧',
        other: '📈'
      },
      cost: {
        material: '📦',
        service: '🛠️',
        feed: '🌾',
        other: '💸'
      },
      investment: {
        fiv: '🧬',
        equipment: '🔧',
        infrastructure: '🏗️',
        other: '💼'
      }
    };
    return icons[type]?.[category] || '💼';
  };

  const getTransactionColor = (type) => {
    const colors = {
      revenue: 'text-green-600 dark:text-green-400',
      cost: 'text-red-600 dark:text-red-400',
      investment: 'text-blue-600 dark:text-blue-400'
    };
    return colors[type] || 'text-gray-600 dark:text-gray-400';
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">✅ Concluído</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">⏳ Pendente</Badge>,
      cancelled: <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">❌ Cancelado</Badge>
    };
    return badges[status] || badges.pending;
  };

  const profitMargin = ((financialData.profit / financialData.revenue) * 100).toFixed(1);
  const costRatio = ((financialData.costs / financialData.revenue) * 100).toFixed(1);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'sale', label: '💰 Vendas' },
    { value: 'material', label: '📦 Materiais' },
    { value: 'fiv', label: '🧬 FIV' },
    { value: 'feed', label: '🌾 Alimentação' }
  ];

  const periods = [
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Ano' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedCategory === 'all') return true;
    return transaction.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                💰 Dashboard Financeiro
              </h1>
              <p className="text-green-100 text-lg">
                Análise completa da performance financeira
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">📊</div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                Atualizado
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Período
              </label>
              <Select
                value={selectedPeriod}
                onValueChange={setSelectedPeriod}
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  Receita Total
                </p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                  {formatCurrency(financialData.revenue)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +12.5% vs período anterior
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                <span className="text-3xl">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  Custos Totais
                </p>
                <p className="text-3xl font-black text-red-600 dark:text-red-400">
                  {formatCurrency(financialData.costs)}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {costRatio}% da receita
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                <span className="text-3xl">📉</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  Lucro Líquido
                </p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {formatCurrency(financialData.profit)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Margem: {profitMargin}%
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                <span className="text-3xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  ROI
                </p>
                <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {financialData.roi}%
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  +2.3% vs mercado
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                <span className="text-3xl">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Fluxo de Caixa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            📊 Fluxo de Caixa Mensal
            <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              {selectedPeriod === 'month' ? 'Mensal' : selectedPeriod === 'week' ? 'Semanal' : 'Anual'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  +{formatCurrency(financialData.revenue)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Entradas</div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                  -{formatCurrency(financialData.costs)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saídas</div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  +{formatCurrency(financialData.cashFlow)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saldo</div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            💳 Transações Recentes
            <Badge className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {filteredTransactions.length} transações
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">
                    {getTransactionIcon(transaction.type, transaction.category)}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {transaction.description}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </div>
                  
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise e Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-600">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300 flex items-center">
              📈 Pontos Positivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>ROI excelente:</strong> 18.5% acima da média do setor
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Margem saudável:</strong> {profitMargin}% de margem de lucro
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Crescimento consistente:</strong> +12.5% vs período anterior
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-600">
          <CardHeader>
            <CardTitle className="text-orange-700 dark:text-orange-300 flex items-center">
              🎯 Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-orange-500">💡</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Reduzir custos:</strong> Otimizar gastos com materiais
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-orange-500">💡</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Diversificar receita:</strong> Expandir serviços de FIV
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-orange-500">💡</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Investir em tecnologia:</strong> Automatizar processos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;