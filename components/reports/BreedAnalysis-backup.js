import { useState } from 'react';

export default function BreedAnalysis() {
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [sortBy, setSortBy] = useState('roi');

  // Dados mockados para evitar erros
  const breedData = {
    'Nelore': {
      count: 0,
      totalInvested: 0,
      totalRevenue: 0,
      totalProfit: 0,
      soldCount: 0,
      activeCount: 0,
      avgAge: 0,
      avgInvestment: 0,
      avgRevenue: 0,
      roi: 0,
      conversionRate: 0,
      profitMargin: 0
    }
  };

  const breeds = Object.keys(breedData);

  const getBreedIcon = (breed) => {
    const icons = {
      'Nelore': '🐂',
      'Brahman': '🐄',
      'Gir': '🐮',
      'Receptora': '🐄',
      'Angus': '⚫',
      'Senepol': '🔴'
    };
    return icons[breed] || '🐄';
  };

  const getPerformanceLevel = (roi) => {
    if (roi >= 30) return { level: 'Excelente', color: 'text-green-600 bg-green-100', icon: '🏆' };
    if (roi >= 15) return { level: 'Boa', color: 'text-blue-600 bg-blue-100', icon: '⭐' };
    if (roi >= 5) return { level: 'Regular', color: 'text-yellow-600 bg-yellow-100', icon: '📊' };
    if (roi >= 0) return { level: 'Baixa', color: 'text-orange-600 bg-orange-100', icon: '📉' };
    return { level: 'Prejuízo', color: 'text-red-600 bg-red-100', icon: '❌' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              🐄 Análise por Raça
              <span className="ml-3 px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                Detalhado
              </span>
            </h1>
            <p className="text-green-100 text-lg">
              Performance comparativa entre diferentes raças do rebanho
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{breeds.length}</div>
            <div className="text-green-200">Raças Diferentes</div>
          </div>
        </div>
      </div>

      {/* Mensagem de dados em desenvolvimento */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-yellow-600 dark:text-yellow-400 mr-3">⚠️</div>
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
              Dados em Desenvolvimento
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              Esta funcionalidade será conectada aos dados reais da API em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}