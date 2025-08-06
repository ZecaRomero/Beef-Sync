import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import TestSales from '../components/TestSales';
import MaterialsManager from '../components/MaterialsManager';
import ReproductionManager from '../components/ReproductionManager';

export default function DashboardTest() {
  const [activeTab, setActiveTab] = useState('vendas');

  const tabs = [
    { id: 'vendas', label: '📊 Vendas', component: TestSales },
    { id: 'materials', label: '📦 Materiais', component: MaterialsManager },
    { id: 'reproduction', label: '🧬 Reprodução', component: ReproductionManager }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🐄 Beef Sync - Teste
          </h1>
        </div>

        {/* Navegação */}
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'bg-blue-600 text-white' : ''}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {ActiveComponent && <ActiveComponent userId="test" />}
      </div>
    </div>
  );
}