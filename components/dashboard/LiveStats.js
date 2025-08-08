import { useState, useEffect } from 'react'

export default function LiveStats({ data }) {
  const [animatedValues, setAnimatedValues] = useState({
    totalAnimals: 0,
    activeAnimals: 0,
    totalInvested: 0,
    totalRevenue: 0
  })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [modalData, setModalData] = useState([])

  // Animar valores quando os dados mudam
  useEffect(() => {
    const animateValue = (start, end, duration, key) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = start + (end - start) * progress

        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    animateValue(animatedValues.totalAnimals, data.totalAnimals, 1000, 'totalAnimals')
    animateValue(animatedValues.activeAnimals, data.activeAnimals, 1000, 'activeAnimals')
    animateValue(animatedValues.totalInvested, data.totalInvested, 1500, 'totalInvested')
    animateValue(animatedValues.totalRevenue, data.totalRevenue, 1500, 'totalRevenue')
  }, [data])

  const handleCardClick = async (type) => {
    setModalType(type)
    setShowModal(true)

    try {
      // Carregar dados específicos baseado no tipo
      const response = await fetch('/api/animals-list')
      const animals = await response.json()

      let filteredData = []

      switch (type) {
        case 'totalAnimals':
          filteredData = animals.map(animal => ({
            brinco: animal.brinco,
            nome: animal.nome,
            raca: animal.raca,
            status: animal.status,
            categoria: animal.categoria,
            peso: animal.peso,
            dataNasc: animal.dataNasc
          }))
          break

        case 'activeAnimals':
          filteredData = animals.filter(a => a.status === 'ATIVO').map(animal => ({
            brinco: animal.brinco,
            nome: animal.nome,
            raca: animal.raca,
            categoria: animal.categoria,
            peso: animal.peso,
            dataNasc: animal.dataNasc,
            custoTotal: animal.costs?.reduce((sum, cost) => sum + cost.valor, 0) || 0
          }))
          break

        case 'totalInvested':
          filteredData = animals.map(animal => ({
            brinco: animal.brinco,
            nome: animal.nome,
            custoTotal: animal.costs?.reduce((sum, cost) => sum + cost.valor, 0) || 0,
            custos: animal.costs || []
          })).filter(animal => animal.custoTotal > 0)
          break

        case 'totalRevenue':
          const salesResponse = await fetch('/api/sales-list')
          const sales = await salesResponse.json()
          filteredData = sales.map(sale => ({
            animal: sale.animal?.brinco || 'N/A',
            valor: sale.valor,
            comprador: sale.comprador,
            dataVenda: sale.dataVenda,
            tipoVenda: sale.animal?.tipoVenda || 'N/A'
          }))
          break

        case 'avgROI':
          const salesForROI = await fetch('/api/sales-list')
          const salesData = await salesForROI.json()
          filteredData = salesData.map(sale => {
            const animal = animals.find(a => a.id === sale.animalId)
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
      }

      setModalData(filteredData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setModalData([])
    }
  }

  const stats = [
    {
      label: 'Animais Totais',
      value: animatedValues.totalAnimals,
      icon: '🐄',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      type: 'totalAnimals',
      description: 'Lista completa de todos os animais'
    },
    {
      label: 'Ativos',
      value: animatedValues.activeAnimals,
      icon: '✅',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      type: 'activeAnimals',
      description: 'Animais ativos no rebanho'
    },
    {
      label: 'Investido',
      value: `R$ ${(animatedValues.totalInvested / 1000).toFixed(0)}k`,
      icon: '💰',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      type: 'totalInvested',
      description: 'Total investido em todos os animais'
    },
    {
      label: 'Receita',
      value: `R$ ${(animatedValues.totalRevenue / 1000).toFixed(0)}k`,
      icon: '📈',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      type: 'totalRevenue',
      description: 'Receita total das vendas'
    },
    {
      label: 'ROI Médio',
      value: `${data.avgROI?.toFixed(1) || 0}%`,
      icon: '📊',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      type: 'avgROI',
      description: 'Retorno médio sobre investimento'
    }
  ]

  const getModalTitle = (type) => {
    switch (type) {
      case 'totalAnimals': return 'Todos os Animais'
      case 'activeAnimals': return 'Animais Ativos'
      case 'totalInvested': return 'Investimentos por Animal'
      case 'totalRevenue': return 'Histórico de Vendas'
      case 'avgROI': return 'Análise de ROI'
      default: return 'Detalhes'
    }
  }

  const getModalDescription = (type) => {
    switch (type) {
      case 'totalAnimals': return 'Lista completa de todos os animais cadastrados'
      case 'activeAnimals': return 'Animais atualmente ativos no rebanho'
      case 'totalInvested': return 'Detalhamento dos investimentos por animal'
      case 'totalRevenue': return 'Histórico completo de vendas realizadas'
      case 'avgROI': return 'Análise de retorno sobre investimento por animal'
      default: return 'Detalhes dos dados'
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-3 text-2xl">⚡</span>
            Stats em Tempo Real
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Ao vivo</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              onClick={() => handleCardClick(stat.type)}
              className={`
                p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer
                ${stat.bgColor} border border-gray-200 dark:border-gray-600
                hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600
              `}
              style={{ animationDelay: `${index * 100}ms` }}
              title={`Clique para ver ${stat.description}`}
            >
              <div className="text-center">
                <div className="text-lg sm:text-2xl mb-1 sm:mb-2">{stat.icon}</div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
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
                      {modalType === 'totalAnimals' || modalType === 'activeAnimals' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Brinco:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.brinco}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Nome:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.nome}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Raça:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.raca}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Categoria:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.categoria}</div>
                          </div>
                        </div>
                      ) : modalType === 'totalInvested' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Animal:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.brinco}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Investimento:</span>
                            <div className="font-semibold text-sm sm:text-base text-red-600 dark:text-red-400">
                              R$ {(item.custoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Custos:</span>
                            <div className="text-xs sm:text-sm">{item.custos.length} registros</div>
                          </div>
                        </div>
                      ) : modalType === 'totalRevenue' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Animal:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.animal}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Valor:</span>
                            <div className="font-semibold text-sm sm:text-base text-green-600 dark:text-green-400">
                              R$ {(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Comprador:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.comprador}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Tipo:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.tipoVenda}</div>
                          </div>
                        </div>
                      ) : modalType === 'avgROI' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Animal:</span>
                            <div className="font-semibold text-sm sm:text-base">{item.animal}</div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Venda:</span>
                            <div className="font-semibold text-sm sm:text-base text-green-600 dark:text-green-400">
                              R$ {(item.valorVenda || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Custo:</span>
                            <div className="font-semibold text-sm sm:text-base text-red-600 dark:text-red-400">
                              R$ {(item.custoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Lucro:</span>
                            <div className={`font-semibold text-sm sm:text-base ${item.lucro >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              R$ {(item.lucro || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ROI:</span>
                            <div className={`font-semibold text-sm sm:text-base ${item.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {item.roi.toFixed(1)}%
                            </div>
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
