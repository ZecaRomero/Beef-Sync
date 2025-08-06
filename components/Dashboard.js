import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import MaterialsManager from './MaterialsManager';
import ReproductionManager from './ReproductionManager';
import MarketWidget from './MarketWidget';
import AnimalProtocols from './AnimalProtocols';
import FinancialDashboard from './FinancialDashboard';
import NotificationCenter from './NotificationCenter';
import QuickActions from './QuickActions';
import PerformanceMetrics from './PerformanceMetrics';
import SalesReport from './SalesReport';
import SalesBIDashboard from './SalesBIDashboard';
import BIPreviewWidget from './BIPreviewWidget';
import DashboardMainMetrics from './DashboardMainMetrics';

const Dashboard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showBIDashboard, setShowBIDashboard] = useState(false);
  const [quickStats, setQuickStats] = useState({
    totalAnimals: 0,
    totalValue: 0,
    pendingProtocols: 0,
    activeProcesses: 0,
    monthlyProfit: 0,
    marketTrend: 'stable'
  });

  const tabs = [
    {
      id: 'overview',
      label: '🏠 Visão Geral',
      icon: '🏠',
      description: 'Dashboard principal com métricas e resumos'
    },
    {
      id: 'materials',
      label: '📦 Materiais',
      icon: '📦',
      description: 'Gestão de estoque e materiais'
    },
    {
      id: 'reproduction',
      label: '🧬 Reprodução',
      icon: '🧬',
      description: 'Sistema FIV e reprodução assistida'
    },
    {
      id: 'protocols',
      label: '🎯 Protocolos',
      icon: '🎯',
      description: 'Protocolos sanitários inteligentes'
    },
    {
      id: 'financial',
      label: '💰 Financeiro',
      icon: '💰',
      description: 'Análises financeiras e ROI'
    },
    {
      id: 'market',
      label: '📈 Mercado',
      icon: '📈',
      description: 'Inteligência de mercado e preços'
    },
    {
      id: 'sales',
      label: '📊 Vendas',
      icon: '📊',
      description: 'Relatório de vendas e pós-venda'
    },
    {
      id: 'bi',
      label: '📈 BI Analytics',
      icon: '📈',
      description: 'Business Intelligence com gráficos avançados'
    }
  ];

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    // Simular carregamento de dados
    try {
      // Aqui você conectaria com suas APIs reais
      setQuickStats({
        totalAnimals: 1247,
        totalValue: 2850000,
        pendingProtocols: 23,
        activeProcesses: 8,
        monthlyProfit: 185000,
        marketTrend: 'up'
      });

      setNotifications([
        {
          id: 1,
          type: 'warning',
          title: 'Estoque Baixo',
          message: '3 materiais com estoque abaixo do mínimo',
          timestamp: new Date(),
          priority: 'high'
        },
        {
          id: 2,
          type: 'success',
          title: 'Processo FIV Concluído',
          message: 'Processo #1234 finalizado com 15 embriões',
          timestamp: new Date(),
          priority: 'medium'
        },
        {
          id: 3,
          type: 'info',
          title: 'Preço da Arroba',
          message: 'Boi gordo subiu 2.3% hoje - R$ 285/arroba',
          timestamp: new Date(),
          priority: 'low'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header com Boas-vindas */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                🐄 Beef Sync v4.0 Pro
              </h1>
              <p className="text-blue-100 text-lg">
                Bem-vindo ao sistema mais avançado de gestão bovina
              </p>
              <p className="text-blue-200 text-sm mt-1">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">🚀</div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                Sistema Ativo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <DashboardMainMetrics quickStats={quickStats} formatCurrency={formatCurrency} />
      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ações Rápidas */}
          <QuickActions onActionComplete={loadDashboardData} />
          {/* Métricas de Performance */}
          <PerformanceMetrics stats={quickStats} />
          {/* Notificações */}
          <NotificationCenter
            notifications={notifications}
            onNotificationRead={(id) => {
              setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
              );
            }}
          />
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Widget de Mercado */}
          <MarketWidget />
          {/* BI Preview Widget */}
          <BIPreviewWidget onOpenFullBI={() => setShowBIDashboard(true)} />
          {/* Resumo Financeiro */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-600">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center">
                💰 Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Lucro Mensal
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(quickStats.monthlyProfit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Tendência
                  </span>
                  <span className={`text-sm font-bold ${getTrendColor(quickStats.marketTrend)}`}>
                    {getTrendIcon(quickStats.marketTrend)}
                    {quickStats.marketTrend === 'up' ? 'Alta' :
                      quickStats.marketTrend === 'down' ? 'Baixa' : 'Estável'}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('financial')}
                    >
                      💰 Financeiro
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBIDashboard(true)}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200"
                    >
                      📊 BI Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Status do Sistema */}
          <Card className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-gray-700 dark:text-gray-300 flex items-center">
                ⚙️ Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    APIs de Mercado
                  </span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    ✅ Ativo
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Banco de Dados
                  </span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    ✅ Conectado
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Notificações
                  </span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    ✅ Funcionando
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Última Sincronização
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'materials':
        return <MaterialsManager userId={userId} />;
      case 'reproduction':
        return <ReproductionManager />;
      case 'protocols':
        return <AnimalProtocols materials={[]} animals={[]} onUpdateMaterial={() => { }} onCreateReminder={() => { }} />;
      case 'financial':
        return <FinancialDashboard />;
      case 'market':
        return <div className="p-6"><MarketWidget /></div>;
      case 'sales':
        return <SalesReport />;
      case 'bi':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-2">📊 Business Intelligence</h2>
              <p className="text-blue-100">Análise avançada de dados com gráficos interativos</p>
            </div>
            <Button
              onClick={() => setShowBIDashboard(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg"
            >
              🚀 Abrir Dashboard BI Completo
            </Button>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header de Navegação */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🐄</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Beef Sync v4.0 Pro
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sistema Integrado de Gestão Bovina
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                🟢 Online
              </Badge>
              <Button variant="outline" size="sm">
                ⚙️ Configurações
              </Button>
            </div>
          </div>

          {/* Navegação por Abas */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                title={tab.description}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6">
        {renderTabContent()}
      </div>

      {/* Modal do BI Dashboard */}
      <SalesBIDashboard
        isOpen={showBIDashboard}
        onClose={() => setShowBIDashboard(false)}
      />
    </div>
  );
};

export default Dashboard;
