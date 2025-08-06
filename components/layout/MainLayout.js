import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ErrorBoundary from '../common/ErrorBoundary';
import LoadingSpinner from '../common/LoadingSpinner';

const MainLayout = ({ children }) => {
  const { state, actions } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '🏠 Dashboard', icon: '🏠' },
    { id: 'animals', label: '🐄 Animais', icon: '🐄' },
    { id: 'materials', label: '📦 Materiais', icon: '📦' },
    { id: 'reproduction', label: '🧬 Reprodução', icon: '🧬' },
    { id: 'sales', label: '💰 Vendas', icon: '💰' },
    { id: 'reports', label: '📊 Relatórios', icon: '📊' },
    { id: 'settings', label: '⚙️ Configurações', icon: '⚙️' }
  ];

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" message="Carregando Beef Sync..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🐄</div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Beef Sync
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  v4.0 Pro
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              ✕
            </Button>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Stats Sidebar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Animais:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {state.stats.totalAnimals}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Valor:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  R$ {state.stats.totalValue.toLocaleString('pt-BR')}
                </span>
              </div>
              {state.stats.pendingTasks > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pendências:</span>
                  <Badge className="bg-red-600 text-white">
                    {state.stats.pendingTasks}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  ☰
                </Button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <Button variant="ghost" size="sm">
                    🔔
                    {state.notifications.filter(n => !n.read).length > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                        {state.notifications.filter(n => !n.read).length}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={actions.toggleTheme}
                >
                  {state.theme === 'light' ? '🌙' : '☀️'}
                </Button>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {state.user?.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {state.user?.role || 'Proprietário'}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {(state.user?.name || 'U')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span className="text-red-700 dark:text-red-300 font-medium">
                    {state.error}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.setError(null)}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}
            {children}
          </main>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;