import React from 'react';
import { useApp } from '../contexts/AppContext';
import MainLayout from './layout/MainLayout';
import StatsCards from './dashboard/StatsCards';
import QuickStats from './dashboard/QuickStats';
import RecentActivity from './dashboard/RecentActivity';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import MarketWidget from './MarketWidget';

const NewDashboard = () => {
  const { state, actions } = useApp();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bem-vindo ao Beef Sync v4.0 Pro! 🐄
                </h1>
                <p className="text-blue-100 text-lg">
                  Sistema completo de gestão bovina com IA integrada
                </p>
                <p className="text-blue-200 text-sm mt-2">
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-6xl mb-2">🚀</div>
                <div className="text-sm text-blue-200">
                  Sistema Ativo
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats */}
        <StatsCards />

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Sidebar Content - 1 column */}
          <div className="space-y-6">
            {/* Market Widget */}
            <MarketWidget />

            {/* Quick Actions */}
            <Card className="border-2 border-gray-200 dark:border-gray-600 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  ⚡ Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => actions.addNotification({
                      id: Date.now(),
                      title: 'Novo Animal',
                      message: 'Animal adicionado com sucesso!',
                      type: 'success',
                      timestamp: new Date(),
                      read: false
                    })}
                  >
                    <span className="text-2xl">🐄</span>
                    <span className="text-sm font-semibold">Novo Animal</span>
                  </Button>

                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => actions.addNotification({
                      id: Date.now(),
                      title: 'Material Adicionado',
                      message: 'Material cadastrado no estoque!',
                      type: 'success',
                      timestamp: new Date(),
                      read: false
                    })}
                  >
                    <span className="text-2xl">📦</span>
                    <span className="text-sm font-semibold">Novo Material</span>
                  </Button>

                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => actions.addNotification({
                      id: Date.now(),
                      title: 'Processo FIV',
                      message: 'Novo processo iniciado!',
                      type: 'info',
                      timestamp: new Date(),
                      read: false
                    })}
                  >
                    <span className="text-2xl">🧬</span>
                    <span className="text-sm font-semibold">Processo FIV</span>
                  </Button>

                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => actions.addNotification({
                      id: Date.now(),
                      title: 'Nova Venda',
                      message: 'Venda registrada com sucesso!',
                      type: 'success',
                      timestamp: new Date(),
                      read: false
                    })}
                  >
                    <span className="text-2xl">💰</span>
                    <span className="text-sm font-semibold">Nova Venda</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-2 border-gray-200 dark:border-gray-600 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  ⚙️ Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Banco de Dados
                    </span>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                      ✅ Conectado
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      APIs de Mercado
                    </span>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                      ✅ Ativo
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Notificações
                    </span>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                      ✅ Funcionando
                    </span>
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

        {/* Performance Insights */}
        <Card className="border-2 border-gray-200 dark:border-gray-600 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              📊 Insights de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  +12.5%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Crescimento vs mês anterior
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  94.2%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Eficiência operacional
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl mb-2">💡</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  18.5%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ROI médio
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NewDashboard;