import { useState, useEffect } from 'react'

export default function MarketAnalysis() {
  const [animals, setAnimals] = useState([])
  const [marketPrices, setMarketPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Carregar animais ativos
      const animalsResponse = await fetch('/api/animals-list')
      const animalsData = await animalsResponse.json()
      const activeAnimals = animalsData.filter(a => a.status === 'ATIVO')

      // Carregar preços de mercado
      const pricesResponse = await fetch('/api/market-prices')
      const pricesData = await pricesResponse.json()

      setAnimals(activeAnimals)
      setMarketPrices(pricesData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeMarketOpportunity = (animal) => {
    // Simular análise de mercado baseada na categoria do animal
    const marketPrice = marketPrices.find(p => p.categoria === animal.categoria)

    if (!marketPrice) return { recommendation: 'HOLD', reason: 'Preço de mercado não disponível' }

    const estimatedValue = animal.peso * (marketPrice.precoMedio / 1000) // R$/kg
    const currentInvestment = animal.costs?.reduce((sum, cost) => sum + cost.valor, 0) || 0
    const potentialProfit = estimatedValue - currentInvestment
    const roi = currentInvestment > 0 ? (potentialProfit / currentInvestment) * 100 : 0

    if (roi > 25) {
      return {
        recommendation: 'SELL',
        reason: `ROI potencial de ${roi.toFixed(1)}%`,
        estimatedValue,
        potentialProfit,
        roi
      }
    } else if (roi > 15) {
      return {
        recommendation: 'CONSIDER',
        reason: `ROI moderado de ${roi.toFixed(1)}%`,
        estimatedValue,
        potentialProfit,
        roi
      }
    } else {
      return {
        recommendation: 'HOLD',
        reason: `ROI baixo de ${roi.toFixed(1)}% - aguardar melhor momento`,
        estimatedValue,
        potentialProfit,
        roi
      }
    }
  }

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'SELL': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'CONSIDER': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'HOLD': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case 'SELL': return '💰'
      case 'CONSIDER': return '🤔'
      case 'HOLD': return '⏳'
      default: return '📊'
    }
  }

  const filters = [
    { id: 'all', label: 'Todos', count: animals.length },
    { id: 'sell', label: 'Vender', count: animals.filter(a => analyzeMarketOpportunity(a).recommendation === 'SELL').length },
    { id: 'consider', label: 'Considerar', count: animals.filter(a => analyzeMarketOpportunity(a).recommendation === 'CONSIDER').length },
    { id: 'hold', label: 'Segurar', count: animals.filter(a => analyzeMarketOpportunity(a).recommendation === 'HOLD').length }
  ]

  const filteredAnimals = animals.filter(animal => {
    if (selectedFilter === 'all') return true
    const analysis = analyzeMarketOpportunity(animal)
    return analysis.recommendation === selectedFilter.toUpperCase()
  })

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-3 text-2xl">📈</span>
          Análise de Mercado
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Última atualização: {new Date().toLocaleTimeString('pt-BR')}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                {filters.find(f => f.id === 'sell').count}
              </div>
              <div className="text-xs sm:text-sm text-green-600 dark:text-green-400">Prontos para venda</div>
            </div>
            <div className="text-2xl sm:text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {filters.find(f => f.id === 'consider').count}
              </div>
              <div className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">Considerar venda</div>
            </div>
            <div className="text-2xl sm:text-3xl">🤔</div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 sm:p-4 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
                {filters.find(f => f.id === 'hold').count}
              </div>
              <div className="text-xs sm:text-sm text-red-600 dark:text-red-400">Manter no rebanho</div>
            </div>
            <div className="text-2xl sm:text-3xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Lista de Animais */}
      <div className="space-y-4">
        {filteredAnimals.map((animal, index) => {
          const analysis = analyzeMarketOpportunity(animal)
          const currentInvestment = animal.costs?.reduce((sum, cost) => sum + cost.valor, 0) || 0

          return (
            <div key={animal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getRecommendationIcon(analysis.recommendation)}</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {animal.brinco} - {animal.nome}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {animal.raca} • {animal.categoria} • {animal.peso}kg
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRecommendationColor(analysis.recommendation)}`}>
                  {analysis.recommendation === 'SELL' ? 'VENDER' :
                    analysis.recommendation === 'CONSIDER' ? 'CONSIDERAR' : 'SEGURAR'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Investimento:</span>
                  <div className="font-semibold text-red-600 dark:text-red-400">
                    R$ {(currentInvestment || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400">Valor Estimado:</span>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    R$ {analysis.estimatedValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || 'N/A'}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400">Lucro Potencial:</span>
                  <div className={`font-semibold ${analysis.potentialProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    R$ {analysis.potentialProfit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || 'N/A'}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400">ROI Potencial:</span>
                  <div className={`font-semibold ${analysis.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {analysis.roi?.toFixed(1) || 'N/A'}%
                  </div>
                </div>
              </div>

              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Recomendação:</strong> {analysis.reason}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum animal encontrado para o filtro selecionado
          </p>
        </div>
      )}
    </div>
  )
}
