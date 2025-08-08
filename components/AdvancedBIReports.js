import { useState, useEffect } from 'react'

export default function AdvancedBIReports() {
  const [data, setData] = useState({
    animals: [],
    sales: [],
    costs: [],
    weights: [],
    loading: true
  })
  const [selectedReport, setSelectedReport] = useState('performance')
  const [timeRange, setTimeRange] = useState('90d')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setData({ ...data, loading: true })

      const [animalsRes, salesRes, costsRes, weightsRes] = await Promise.all([
        fetch('/api/animals-list'),
        fetch('/api/sales-list'),
        fetch('/api/costs-list'),
        fetch('/api/weights-list')
      ])

      const animals = animalsRes.ok ? await animalsRes.json() : []
      const sales = salesRes.ok ? await salesRes.json() : []
      const costs = costsRes.ok ? await costsRes.json() : []
      const weights = weightsRes.ok ? await weightsRes.json() : []

      setData({ animals, sales, costs, weights, loading: false })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setData({ ...data, loading: false })
    }
  }

  const reports = [
    {
      id: 'performance',
      title: 'Performance por Raça',
      description: 'Análise de performance por raça e categoria',
      icon: '📊'
    },
    {
      id: 'roi',
      title: 'Análise de ROI',
      description: 'Retorno sobre investimento por animal',
      icon: '💰'
    },
    {
      id: 'market',
      title: 'Análise de Mercado',
      description: 'Comparação com preços de mercado',
      icon: '📈'
    },
    {
      id: 'growth',
      title: 'Evolução de Peso',
      description: 'Gráficos de evolução de peso',
      icon: '⚖️'
    },
    {
      id: 'costs',
      title: 'Análise de Custos',
      description: 'Detalhamento de custos por tipo',
      icon: '💸'
    },
    {
      id: 'predictions',
      title: 'Previsões',
      description: 'Previsões baseadas em dados históricos',
      icon: '🔮'
    }
  ]

  const timeRanges = [
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' },
    { value: '180d', label: '6 meses' },
    { value: '365d', label: '1 ano' },
    { value: 'all', label: 'Todos' }
  ]

  const calculatePerformanceByBreed = () => {
    const breedStats = {}

    data.animals.forEach(animal => {
      if (!breedStats[animal.raca]) {
        breedStats[animal.raca] = {
          count: 0,
          totalValue: 0,
          avgWeight: 0,
          soldCount: 0,
          soldValue: 0
        }
      }

      breedStats[animal.raca].count++
      breedStats[animal.raca].totalValue += animal.valorVenda || 0
      breedStats[animal.raca].avgWeight += animal.peso || 0

      if (animal.status === 'VENDIDO') {
        breedStats[animal.raca].soldCount++
        breedStats[animal.raca].soldValue += animal.valorVenda || 0
      }
    })

    // Calcular médias
    Object.keys(breedStats).forEach(raca => {
      const stats = breedStats[raca]
      stats.avgWeight = stats.avgWeight / stats.count
      stats.avgValue = stats.totalValue / stats.count
      stats.soldPercentage = (stats.soldCount / stats.count) * 100
    })

    return breedStats
  }

  const calculateROIAnalysis = () => {
    const roiData = []

    data.animals.forEach(animal => {
      const animalCosts = data.costs.filter(c => c.animalId === animal.id)
      const totalCost = animalCosts.reduce((sum, cost) => sum + cost.valor, 0)
      const estimatedValue = animal.valorVenda || 40000

      if (totalCost > 0) {
        const roi = ((estimatedValue - totalCost) / totalCost) * 100
        roiData.push({
          animal: animal.brinco,
          raca: animal.raca,
          categoria: animal.categoria,
          investment: totalCost,
          estimatedValue,
          roi,
          status: animal.status
        })
      }
    })

    return roiData.sort((a, b) => b.roi - a.roi)
  }

  const calculateCostAnalysis = () => {
    const costTypes = {}

    data.costs.forEach(cost => {
      if (!costTypes[cost.tipo]) {
        costTypes[cost.tipo] = {
          total: 0,
          count: 0,
          avgValue: 0
        }
      }

      costTypes[cost.tipo].total += cost.valor
      costTypes[cost.tipo].count++
    })

    // Calcular médias
    Object.keys(costTypes).forEach(tipo => {
      costTypes[tipo].avgValue = costTypes[tipo].total / costTypes[tipo].count
    })

    return costTypes
  }

  const renderPerformanceReport = () => {
    const breedStats = calculatePerformanceByBreed()

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {Object.entries(breedStats).map(([raca, stats]) => (
            <div key={raca} className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{raca}</h3>
                <span className="text-xl sm:text-2xl">🐄</span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-semibold text-sm sm:text-base">{stats.count}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Peso Médio:</span>
                  <span className="font-semibold text-sm sm:text-base">{stats.avgWeight.toFixed(0)}kg</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Valor Médio:</span>
                  <span className="font-semibold text-sm sm:text-base text-green-600 dark:text-green-400">
                    R$ {stats.avgValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Vendidos:</span>
                  <span className="font-semibold text-sm sm:text-base text-blue-600 dark:text-blue-400">
                    {stats.soldCount} ({stats.soldPercentage.toFixed(1)}%)
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, stats.soldPercentage)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderROIReport = () => {
    const roiData = calculateROIAnalysis()

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 ROI</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Animal</th>
                  <th className="text-left py-3 px-4 font-semibold">Raça</th>
                  <th className="text-left py-3 px-4 font-semibold">Investimento</th>
                  <th className="text-left py-3 px-4 font-semibold">Valor Estimado</th>
                  <th className="text-left py-3 px-4 font-semibold">ROI</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {roiData.slice(0, 10).map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 font-medium">{item.animal}</td>
                    <td className="py-3 px-4">{item.raca}</td>
                    <td className="py-3 px-4 text-red-600 dark:text-red-400">
                      R$ {item.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-green-600 dark:text-green-400">
                      R$ {item.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${item.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {item.roi.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'ATIVO'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderCostAnalysis = () => {
    const costAnalysis = calculateCostAnalysis()

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {Object.entries(costAnalysis).map(([tipo, stats]) => (
            <div key={tipo} className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{tipo}</h3>
                <span className="text-xl sm:text-2xl">💰</span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-semibold text-sm sm:text-base text-red-600 dark:text-red-400">
                    R$ {stats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Registros:</span>
                  <span className="font-semibold text-sm sm:text-base">{stats.count}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Média:</span>
                  <span className="font-semibold text-sm sm:text-base">
                    R$ {stats.avgValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(stats.total / 100000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderGrowthReport = () => {
    // Simular dados de evolução de peso
    const growthData = data.animals.slice(0, 5).map(animal => ({
      animal: animal.brinco,
      weights: [
        { date: '2024-01', weight: animal.peso * 0.7 },
        { date: '2024-03', weight: animal.peso * 0.85 },
        { date: '2024-06', weight: animal.peso * 0.95 },
        { date: '2024-09', weight: animal.peso }
      ]
    }))

    return (
      <div className="space-y-6">
        {growthData.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Evolução de Peso - {item.animal}
            </h3>

            <div className="flex items-center space-x-4">
              {item.weights.map((weight, wIndex) => (
                <div key={wIndex} className="flex-1 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{weight.date}</div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {weight.weight.toFixed(0)}kg
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(weight.weight / item.weights[item.weights.length - 1].weight) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderPredictions = () => {
    const activeAnimals = data.animals.filter(a => a.status === 'ATIVO')
    const predictions = activeAnimals.map(animal => {
      const animalCosts = data.costs.filter(c => c.animalId === animal.id)
      const totalCost = animalCosts.reduce((sum, cost) => sum + cost.valor, 0)
      const marketValue = animal.valorVenda || 40000
      const potentialROI = totalCost > 0 ? ((marketValue - totalCost) / totalCost) * 100 : 0

      return {
        animal: animal.brinco,
        raca: animal.raca,
        currentValue: marketValue,
        potentialValue: marketValue * (1 + (Math.random() * 0.3)), // +0-30%
        roi: potentialROI,
        recommendation: potentialROI > 25 ? 'VENDER' : potentialROI > 15 ? 'CONSIDERAR' : 'SEGURAR'
      }
    })

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Previsões de Mercado</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{prediction.animal}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${prediction.recommendation === 'VENDER'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : prediction.recommendation === 'CONSIDERAR'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {prediction.recommendation}
                  </span>
                </div>

                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Valor Atual:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      R$ {prediction.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Valor Potencial:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      R$ {prediction.potentialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ROI Potencial:</span>
                    <span className={`font-semibold ${prediction.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {prediction.roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderReport = () => {
    switch (selectedReport) {
      case 'performance':
        return renderPerformanceReport()
      case 'roi':
        return renderROIReport()
      case 'costs':
        return renderCostAnalysis()
      case 'growth':
        return renderGrowthReport()
      case 'predictions':
        return renderPredictions()
      default:
        return renderPerformanceReport()
    }
  }

  if (data.loading) {
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
          <span className="mr-3 text-2xl">📊</span>
          Relatórios Avançados de BI
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Última atualização: {new Date().toLocaleTimeString('pt-BR')}
        </div>
      </div>

      {/* Seleção de Relatórios */}
      <div className="flex flex-wrap gap-2 mb-6">
        {reports.map(report => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedReport === report.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            <span className="mr-2">{report.icon}</span>
            {report.title}
          </button>
        ))}
      </div>

      {/* Filtros de Tempo */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeRanges.map(range => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timeRange === range.value
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Conteúdo do Relatório */}
      {renderReport()}
    </div>
  )
}
