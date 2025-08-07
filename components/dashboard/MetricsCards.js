import { useState, useEffect } from 'react'

export default function MetricsCards({ timeRange, onReportClick }) {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [realData, setRealData] = useState({
    animals: [],
    sales: [],
    loading: true
  })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [modalData, setModalData] = useState([])

  useEffect(() => {
    loadRealData()
  }, [])

  const loadRealData = async () => {
    try {
      console.log('🔄 MetricsCards: Carregando dados reais...');

      // Carregar animais reais da API
      const animalsResponse = await fetch('/api/animals-list');
      const animals = animalsResponse.ok ? await animalsResponse.json() : [];

      // Carregar vendas reais da API
      const salesResponse = await fetch('/api/sales-list');
      const sales = salesResponse.ok ? await salesResponse.json() : [];

      console.log('📊 MetricsCards: Animais carregados:', animals.length);
      console.log('💰 MetricsCards: Vendas carregadas:', sales.length);

      setRealData({
        animals: animals || [],
        sales: sales || [],
        loading: false
      });
    } catch (error) {
      console.error('❌ MetricsCards: Erro ao carregar dados reais:', error);
      setRealData({
        animals: [],
        sales: [],
        loading: false
      });
    }
  };

  const handleCardClick = async (type) => {
    setModalType(type)
    setShowModal(true)

    try {
      let filteredData = []

      switch (type) {
        case 'invested':
          filteredData = realData.animals.map(animal => ({
            brinco: animal.brinco,
            nome: animal.nome,
            custoTotal: animal.costs?.reduce((sum, cost) => sum + cost.valor, 0) || 0,
            custos: animal.costs || [],
            categoria: animal.categoria,
            peso: animal.peso
          })).filter(animal => animal.custoTotal > 0)
          break

        case 'revenue':
          filteredData = realData.sales.map(sale => ({
            animal: sale.animal?.brinco || 'N/A',
            valor: sale.valor,
            comprador: sale.comprador,
            dataVenda: sale.dataVenda,
            tipoVenda: sale.animal?.tipoVenda || 'N/A'
          }))
          break

        case 'profit':
          filteredData = realData.sales.map(sale => {
            const animal = realData.animals.find(a => a.id === sale.animalId)
            const custoTotal = animal?.costs?.reduce((sum, cost) => sum + cost.valor, 0) || 0
            const lucro = sale.valor - custoTotal

            return {
              animal: animal?.brinco || 'N/A',
              valorVenda: sale.valor,
              custoTotal: custoTotal,
              lucro: lucro,
              margem: sale.valor > 0 ? (lucro / sale.valor) * 100 : 0,
              comprador: sale.comprador
            }
          }).sort((a, b) => b.lucro - a.lucro)
          break

        case 'roi':
          filteredData = realData.sales.map(sale => {
            const animal = realData.animals.find(a => a.id === sale.animalId)
            const custoTotal = animal?.costs?.reduce((sum, cost) => sum + cost.valor, 0) || 0
            const roi = custoTotal > 0 ? ((sale.valor - custoTotal) / custoTotal) * 100 : 0

            return {
              animal: animal?.brinco || 'N/A',
              valorVenda: sale.valor,
              custoTotal: custoTotal,
              lucro: sale.valor - custoTotal,
              roi: roi,
              comprador: sale.comprador
            }
          }).sort((a, b) => b.roi - a.roi)
          break

        case 'activeAnimals':
          filteredData = realData.animals.filter(a => a.status === 'ATIVO').map(animal => ({
            brinco: animal.brinco,
            nome: animal.nome,
            raca: animal.raca,
            categoria: animal.categoria,
            peso: animal.peso,
            dataNasc: animal.dataNasc,
            custoTotal: animal.costs?.reduce((sum, cost) => sum + cost.valor, 0) || 0
          }))
          break

        case 'soldAnimals':
          filteredData = realData.sales.map(sale => ({
            animal: sale.animal?.brinco || 'N/A',
            valor: sale.valor,
            comprador: sale.comprador,
            dataVenda: sale.dataVenda,
            tipoVenda: sale.animal?.tipoVenda || 'N/A'
          }))
          break
      }

      setModalData(filteredData)
    } catch (error) {
      console.error('Erro ao carregar dados do modal:', error)
      setModalData([])
    }
  }

  const getModalTitle = (type) => {
    switch (type) {
      case 'invested': return 'Investimentos por Animal'
      case 'revenue': return 'Histórico de Vendas'
      case 'profit': return 'Análise de Lucros'
      case 'roi': return 'Análise de ROI'
      case 'activeAnimals': return 'Animais Ativos'
      case 'soldAnimals': return 'Animais Vendidos'
      default: return 'Detalhes'
    }
  }

  const getModalDescription = (type) => {
    switch (type) {
      case 'invested': return 'Detalhamento dos investimentos por animal'
      case 'revenue': return 'Histórico completo de vendas realizadas'
      case 'profit': return 'Análise detalhada de lucros por venda'
      case 'roi': return 'Análise de retorno sobre investimento por animal'
      case 'activeAnimals': return 'Animais atualmente ativos no rebanho'
      case 'soldAnimals': return 'Histórico de animais vendidos'
      default: return 'Detalhes dos dados'
    }
  }

  // Calcular métricas baseadas nos dados reais do banco
  const calculateMetrics = () => {
    const animals = realData.animals || []
    const sales = realData.sales || []

    // Calcular investimento total
    const totalInvested = animals.reduce((acc, animal) => {
      const costs = animal.costs || []
      const totalCost = costs
        .filter(cost => cost.tipo !== 'VENDA')
        .reduce((sum, cost) => sum + cost.valor, 0)
      return acc + totalCost
    }, 0)

    // Calcular receita total
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.valor, 0)

    // Calcular lucro total
    const totalProfit = sales.reduce((acc, sale) => {
      const animal = animals.find(a => a.id === sale.animalId)
      const costs = animal?.costs || []
      const totalCost = costs
        .filter(cost => cost.tipo !== 'VENDA')
        .reduce((sum, cost) => sum + cost.valor, 0)
      return acc + (sale.valor - totalCost)
    }, 0)

    // Calcular ROI médio
    let totalROI = 0
    let validROICount = 0

    sales.forEach(sale => {
      const animal = animals.find(a => a.id === sale.animalId)
      if (animal) {
        const costs = animal.costs || []
        const totalCost = costs
          .filter(cost => cost.tipo !== 'VENDA')
          .reduce((sum, cost) => sum + cost.valor, 0)

        if (totalCost > 0) {
          const roi = ((sale.valor - totalCost) / totalCost) * 100
          totalROI += roi
          validROICount += 1
        }
      }
    })

    const avgROI = validROICount > 0 ? totalROI / validROICount : 0

    // Contar animais ativos e vendidos
    const activeAnimals = animals.filter(a => a.status === 'ATIVO').length
    const soldAnimals = sales.length
    const conversionRate = animals.length > 0 ? (soldAnimals / animals.length) * 100 : 0

    return {
      totalInvested,
      totalRevenue,
      totalProfit,
      avgROI,
      activeAnimals,
      soldAnimals,
      conversionRate
    }
  }

  const metrics = calculateMetrics()

  const cards = [
    {
      id: 'invested',
      title: 'Total Investido',
      value: `R$ ${metrics.totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: realData.loading ? '...' : 'Atual',
      trend: 'stable',
      icon: '💰',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: 'Investimento total em todos os animais',
      details: `${realData.animals.length} animais cadastrados`,
      type: 'invested'
    },
    {
      id: 'revenue',
      title: 'Receita Total',
      value: `R$ ${metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: realData.loading ? '...' : (metrics.soldAnimals > 0 ? 'Com vendas' : 'Sem vendas'),
      trend: metrics.soldAnimals > 0 ? 'up' : 'stable',
      icon: '📈',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Receita com vendas realizadas',
      details: `${metrics.soldAnimals} animais vendidos`,
      type: 'revenue'
    },
    {
      id: 'profit',
      title: 'Lucro Líquido',
      value: `R$ ${metrics.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: realData.loading ? '...' : (metrics.totalProfit > 0 ? 'Positivo' : 'Negativo'),
      trend: metrics.totalProfit > 0 ? 'up' : 'down',
      icon: '💵',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Lucro líquido das operações',
      details: `Margem: ${metrics.totalRevenue > 0 ? ((metrics.totalProfit / metrics.totalRevenue) * 100).toFixed(1) : 0}%`,
      type: 'profit'
    },
    {
      id: 'roi',
      title: 'ROI Médio',
      value: `${metrics.avgROI.toFixed(1)}%`,
      change: realData.loading ? '...' : (metrics.avgROI > 0 ? 'Positivo' : 'Negativo'),
      trend: metrics.avgROI > 0 ? 'up' : 'down',
      icon: '📊',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Retorno médio sobre investimento',
      details: `Taxa de conversão: ${metrics.conversionRate.toFixed(1)}%`,
      type: 'roi'
    },
    {
      id: 'activeAnimals',
      title: 'Animais Ativos',
      value: metrics.activeAnimals.toString(),
      change: realData.loading ? '...' : `${((metrics.activeAnimals / realData.animals.length) * 100).toFixed(1)}% do rebanho`,
      trend: 'stable',
      icon: '🐄',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Animais ativos no rebanho',
      details: `${metrics.activeAnimals} animais ativos`,
      type: 'activeAnimals'
    },
    {
      id: 'soldAnimals',
      title: 'Animais Vendidos',
      value: metrics.soldAnimals.toString(),
      change: realData.loading ? '...' : `${metrics.conversionRate.toFixed(1)}% de conversão`,
      trend: metrics.soldAnimals > 0 ? 'up' : 'stable',
      icon: '💰',
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Animais vendidos no período',
      details: `${metrics.soldAnimals} animais vendidos`,
      type: 'soldAnimals'
    }
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.type)}
            className={`
              relative overflow-hidden rounded-2xl p-6 cursor-pointer
              transition-all duration-500 hover:scale-105 hover:shadow-2xl
              ${card.bgColor} border border-gray-200 dark:border-gray-600
              hover:border-blue-300 dark:hover:border-blue-600
            `}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ animationDelay: `${index * 100}ms` }}
            title={`Clique para ver ${card.description}`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 transition-opacity duration-300 ${hoveredCard === card.id ? 'opacity-20' : 'opacity-10'
              }`}></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <div className={`
                px-3 py-1 rounded-full text-xs font-semibold flex items-center
                ${card.trend === 'up'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : card.trend === 'down'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }
              `}>
                  <span className="mr-1">{card.trend === 'up' ? '↗️' : card.trend === 'down' ? '↘️' : '→'}</span>
                  {card.change}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.description}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {card.details}
                </p>
              </div>

              {/* Progress Bar (simulado) */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all duration-1000`}
                    style={{
                      width: `${Math.min(100, Math.abs(parseFloat(card.change)) * 5)}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Click Indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getModalTitle(modalType)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {getModalDescription(modalType)}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {modalData.length > 0 ? (
                <div className="space-y-4">
                  {modalData.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      {modalType === 'invested' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Animal:</span>
                            <div className="font-semibold">{item.brinco}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Investimento:</span>
                            <div className="font-semibold text-red-600 dark:text-red-400">
                              R$ {(item.custoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Custos:</span>
                            <div className="text-sm">{item.custos.length} registros</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Categoria:</span>
                            <div className="font-semibold">{item.categoria}</div>
                          </div>
                        </div>
                      ) : modalType === 'revenue' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Animal:</span>
                            <div className="font-semibold">{item.animal}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Valor:</span>
                            <div className="font-semibold text-green-600 dark:text-green-400">
                              R$ {(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Comprador:</span>
                            <div className="font-semibold">{item.comprador}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Tipo:</span>
                            <div className="font-semibold">{item.tipoVenda}</div>
                          </div>
                        </div>
                      ) : modalType === 'profit' ? (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Animal:</span>
                            <div className="font-semibold">{item.animal}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Venda:</span>
                            <div className="font-semibold text-green-600 dark:text-green-400">
                              R$ {(item.valorVenda || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Custo:</span>
                            <div className="font-semibold text-red-600 dark:text-red-400">
                              R$ {(item.custoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Lucro:</span>
                            <div className={`font-semibold ${item.lucro >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              R$ {(item.lucro || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Margem:</span>
                            <div className={`font-semibold ${item.margem >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {item.margem.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ) : modalType === 'roi' ? (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Animal:</span>
                            <div className="font-semibold">{item.animal}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Venda:</span>
                            <div className="font-semibold text-green-600 dark:text-green-400">
                              R$ {(item.valorVenda || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Custo:</span>
                            <div className="font-semibold text-red-600 dark:text-red-400">
                              R$ {(item.custoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Lucro:</span>
                            <div className={`font-semibold ${item.lucro >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              R$ {(item.lucro || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">ROI:</span>
                            <div className={`font-semibold ${item.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {item.roi.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ) : modalType === 'activeAnimals' || modalType === 'soldAnimals' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Brinco:</span>
                            <div className="font-semibold">{item.brinco || item.animal}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Nome:</span>
                            <div className="font-semibold">{item.nome || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Raça:</span>
                            <div className="font-semibold">{item.raca || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Categoria:</span>
                            <div className="font-semibold">{item.categoria || 'N/A'}</div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
