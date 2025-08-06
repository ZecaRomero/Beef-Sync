import { useState } from 'react'

export default function AnimalPerformance() {
  const [sortBy, setSortBy] = useState('roi')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Calcular performance dos animais
  const calculatePerformance = () => {
    return []; // Dados reais serão carregados da API
  }

  const animals = calculatePerformance();

  const filters = [
    { id: 'all', label: 'Todos', count: animals.length },
    { id: 'excellent', label: 'Excelentes', count: animals.filter(a => a.performance === 'Excelente').length },
    { id: 'good', label: 'Bons', count: animals.filter(a => a.performance === 'Boa').length },
    { id: 'regular', label: 'Regulares', count: animals.filter(a => a.performance === 'Regular').length },
    { id: 'poor', label: 'Ruins', count: animals.filter(a => a.performance === 'Ruim').length }
  ]

  const filteredAnimals = selectedFilter === 'all' 
    ? animals 
    : animals.filter(animal => {
        switch (selectedFilter) {
          case 'excellent': return animal.performance === 'Excelente'
          case 'good': return animal.performance === 'Boa'
          case 'regular': return animal.performance === 'Regular'
          case 'poor': return animal.performance === 'Ruim'
          default: return true
        }
      })

  const sortedAnimals = [...filteredAnimals].sort((a, b) => {
    switch (sortBy) {
      case 'roi': return b.roi - a.roi
      case 'profit': return b.profit - a.profit
      case 'cost': return b.custoTotal - a.custoTotal
      case 'age': return b.meses - a.meses
      default: return 0
    }
  })

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excelente': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Boa': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Regular': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Ruim': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Alto': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Baixo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-3 text-2xl">🏆</span>
          Performance dos Animais
        </h2>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="roi">ROI</option>
            <option value="profit">Lucro</option>
            <option value="cost">Custo</option>
            <option value="age">Idade</option>
          </select>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              selectedFilter === filter.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Mensagem quando não há dados */}
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-2">🐄</div>
        <div className="text-sm">Nenhum animal cadastrado</div>
        <div className="text-xs mt-1">Dados reais serão carregados da API</div>
      </div>

      {/* Resumo Estatístico */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              0
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Excelentes</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              0
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Lucrativos</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              0
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Alto Risco</div>
          </div>
        </div>
      </div>
    </div>
  );
}