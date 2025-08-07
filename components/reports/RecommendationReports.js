import { useState, useEffect } from 'react';

export default function RecommendationReports() {
  const [selectedRecommendation, setSelectedRecommendation] = useState('all');
  const [sortBy, setSortBy] = useState('roi');
  const [showExportModal, setShowExportModal] = useState(false);
  const [analysisData, setAnalysisData] = useState([]);

  useEffect(() => {
    // Simular carregamento de dados
    setAnalysisData([]);
  }, []);

  const recommendations = [
    {
      id: 'all',
      label: '📊 Todos',
      description: 'Todos os animais',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    },
    {
      id: 'sell',
      label: '🟢 Vender',
      description: 'Recomendados para venda',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    {
      id: 'hold',
      label: '🟡 Manter',
      description: 'Aguardar melhor momento',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    },
    {
      id: 'improve',
      label: '🔴 Melhorar',
      description: 'Necessitam otimização',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  ];

  const getFilteredAnimals = () => {
    return [];
  };

  const getRecommendationStats = () => {
    return {
      sell: [],
      hold: [],
      improve: [],
      totalPotentialProfit: 0
    };
  };

  const exportReport = (format) => {
    console.log(`Exportando relatório em formato: ${format}`);
    setShowExportModal(false);
  };

  const filteredAnimals = getFilteredAnimals();
  const stats = getRecommendationStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 flex items-center">
                🎯 Relatórios de Recomendações
                <span className="ml-4 px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  IA Analytics
                </span>
              </h1>
              <p className="text-green-100 text-lg">
                Análise inteligente com recomendações personalizadas para cada animal
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{analysisData.length}</div>
              <div className="text-green-200">Animais Analisados</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
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

      {/* Resumo das Recomendações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.sell?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Vender</div>
            </div>
            <div className="text-3xl">🟢</div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            ROI &gt; 15% ou animais maduros
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.hold?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Manter</div>
            </div>
            <div className="text-3xl">🟡</div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            ROI 5-15% - aguardar
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.improve?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Melhorar</div>
            </div>
            <div className="text-3xl">🔴</div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            ROI &lt; 5% - otimizar
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                R$ {(stats.totalPotentialProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Lucro Potencial</div>
            </div>
            <div className="text-3xl">💰</div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Se vendidos hoje
          </div>
        </div>
      </div>
    </div>
  );
}