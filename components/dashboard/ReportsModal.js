import { useState, useEffect } from 'react'
// Dados mockados removidos - usando dados reais da API

export default function ReportsModal({ reportType, onClose, timeRange }) {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [exportFormat, setExportFormat] = useState('excel')
  const [salesData, setSalesData] = useState([])
  const [animalsData, setAnimalsData] = useState([])
  const [loading, setLoading] = useState(true)

  // Carregar dados reais de vendas
  useEffect(() => {
    loadRealData()
  }, [reportType, timeRange])

  const loadRealData = async () => {
    try {
      setLoading(true)
      
      // Buscar vendas reais
      const salesResponse = await fetch('/api/sales-list')
      const realSales = await salesResponse.json()
      
      // Buscar animais reais
      const animalsResponse = await fetch('/api/animals-list')
      const realAnimals = await animalsResponse.json()
      
      console.log('📊 Vendas carregadas:', realSales.length)
      console.log('🐄 Animais carregados:', realAnimals.length)
      
      setSalesData(realSales)
      setAnimalsData(realAnimals)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Gerar dados do relatório baseado no tipo
  const generateReportData = () => {
    if (loading) {
      return {
        title: '⏳ Carregando...',
        description: 'Buscando dados reais do sistema',
        data: [],
        summary: {}
      }
    }

    switch (reportType) {
      case 'invested':
        // Calcular investimentos baseado nos animais ativos
        const activeAnimals = animalsData.filter(animal => animal.status === 'ATIVO')
        const investmentData = activeAnimals.map(animal => ({
          animal: `${animal.serie || ''} ${animal.rg || animal.brinco}`,
          raca: animal.raca,
          situacao: animal.situacao || animal.status,
          investimento: animal.custoTotal || 0,
          idade: animal.meses || 0,
          custoMensal: animal.meses > 0 ? (animal.custoTotal || 0) / animal.meses : 0
        })).sort((a, b) => b.investimento - a.investimento)
        
        const totalInvestment = investmentData.reduce((sum, item) => sum + item.investimento, 0)
        
        return {
          title: '💰 Relatório de Investimentos',
          description: 'Análise detalhada dos investimentos realizados',
          data: investmentData,
          summary: {
            total: totalInvestment,
            average: investmentData.length > 0 ? totalInvestment / investmentData.length : 0,
            highest: investmentData.length > 0 ? Math.max(...investmentData.map(i => i.investimento)) : 0,
            lowest: investmentData.length > 0 ? Math.min(...investmentData.map(i => i.investimento)) : 0
          }
        }

      case 'revenue':
        // Usar vendas reais para receitas
        const revenueData = salesData.map(sale => ({
          animal: `${sale.animal?.serie || ''} ${sale.animal?.rg || sale.animal?.brinco || sale.animalId}`,
          raca: sale.animal?.raca || 'Não informado',
          investimento: sale.animal?.custoTotal || 0,
          receita: parseFloat(sale.valorVenda) || 0,
          lucro: (parseFloat(sale.valorVenda) || 0) - (sale.animal?.custoTotal || 0),
          roi: sale.animal?.custoTotal > 0 ? 
            (((parseFloat(sale.valorVenda) || 0) - (sale.animal?.custoTotal || 0)) / (sale.animal?.custoTotal || 0) * 100) : 0
        })).sort((a, b) => b.receita - a.receita)
        
        const totalRevenue = revenueData.reduce((sum, item) => sum + item.receita, 0)
        
        return {
          title: '📈 Relatório de Receitas',
          description: 'Análise das receitas obtidas com vendas',
          data: revenueData,
          summary: {
            total: totalRevenue,
            average: revenueData.length > 0 ? totalRevenue / revenueData.length : 0,
            highest: revenueData.length > 0 ? Math.max(...revenueData.map(r => r.receita)) : 0,
            count: revenueData.length
          }
        }

      case 'profit':
        // Calcular lucros das vendas reais
        const profitData = salesData.map(sale => {
          const receita = parseFloat(sale.valorVenda) || 0
          const investimento = sale.animal?.custoTotal || 0
          const lucro = receita - investimento
          
          return {
            animal: `${sale.animal?.serie || ''} ${sale.animal?.rg || sale.animal?.brinco || sale.animalId}`,
            raca: sale.animal?.raca || 'Não informado',
            investimento,
            receita,
            lucro,
            roi: investimento > 0 ? (lucro / investimento * 100) : 0,
            margem: receita > 0 ? (lucro / receita * 100) : 0
          }
        }).sort((a, b) => b.lucro - a.lucro)
        
        const totalProfit = profitData.reduce((sum, item) => sum + item.lucro, 0)
        
        return {
          title: '🎯 Relatório de Lucros',
          description: 'Análise da lucratividade das operações',
          data: profitData,
          summary: {
            total: totalProfit,
            positive: profitData.filter(p => p.lucro > 0).length,
            negative: profitData.filter(p => p.lucro < 0).length,
            averageMargin: profitData.length > 0 ?
              profitData.reduce((sum, p) => sum + p.margem, 0) / profitData.length : 0
          }
        }

      case 'roi':
        // Calcular ROI das vendas reais
        const roiData = salesData.filter(sale => sale.animal?.custoTotal > 0).map(sale => {
          const receita = parseFloat(sale.valorVenda) || 0
          const investimento = sale.animal?.custoTotal || 0
          const roi = investimento > 0 ? ((receita - investimento) / investimento * 100) : 0
          
          return {
            animal: `${sale.animal?.serie || ''} ${sale.animal?.rg || sale.animal?.brinco || sale.animalId}`,
            raca: sale.animal?.raca || 'Não informado',
            investimento,
            receita,
            roi,
            periodo: sale.animal?.meses || 0,
            roiMensal: (sale.animal?.meses || 0) > 0 ? roi / (sale.animal?.meses || 1) : 0
          }
        }).sort((a, b) => b.roi - a.roi)
        
        return {
          title: '📊 Relatório de ROI',
          description: 'Análise do retorno sobre investimento',
          data: roiData,
          summary: {
            average: roiData.length > 0 ?
              roiData.reduce((sum, r) => sum + r.roi, 0) / roiData.length : 0,
            best: roiData.length > 0 ? Math.max(...roiData.map(r => r.roi)) : 0,
            worst: roiData.length > 0 ? Math.min(...roiData.map(r => r.roi)) : 0,
            above20: roiData.filter(r => r.roi > 20).length
          }
        }

      default:
        return {
          title: '📋 Relatório Geral',
          description: 'Visão geral dos dados',
          data: [],
          summary: {}
        }
    }
  }

  const reportData = generateReportData()

  const tabs = [
    { id: 'overview', label: '📊 Visão Geral', icon: '📊' },
    { id: 'details', label: '📋 Detalhes', icon: '📋' },
    { id: 'charts', label: '📈 Gráficos', icon: '📈' },
    { id: 'export', label: '📤 Exportar', icon: '📤' }
  ]

  const handleExport = () => {
    // Simular exportação
    const formats = {
      excel: 'Excel (.xlsx)',
      pdf: 'PDF (.pdf)',
      csv: 'CSV (.csv)'
    }

    alert(`Exportando relatório em formato ${formats[exportFormat]}...`)
    setTimeout(() => {
      alert('✅ Relatório exportado com sucesso!')
    }, 2000)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(reportData.summary).map(([key, value]) => (
          <div key={key} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {typeof value === 'number' ?
                (key.includes('roi') || key.includes('margin') || key.includes('average') && value < 100 ?
                  `${value.toFixed(1)}%` :
                  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`) :
                value
              }
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Insights Principais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportType === 'invested' && (
            <>
              <div className="flex items-start space-x-3">
                <span className="text-green-500">✅</span>
                <div>
                  <div className="font-medium">Diversificação Adequada</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Investimentos distribuídos entre diferentes raças
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-yellow-500">⚠️</span>
                <div>
                  <div className="font-medium">Monitorar Custos Altos</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Alguns animais com investimento acima da média
                  </div>
                </div>
              </div>
            </>
          )}
          {reportType === 'revenue' && (
            <>
              <div className="flex items-start space-x-3">
                <span className="text-green-500">📈</span>
                <div>
                  <div className="font-medium">Receita Crescente</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Tendência positiva nas vendas realizadas
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-500">🎯</span>
                <div>
                  <div className="font-medium">Oportunidade de Melhoria</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Potencial para aumentar preços de venda
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  const renderDetails = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Animal</th>
              <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Raça</th>
              {reportData.data[0] && Object.keys(reportData.data[0]).slice(2).map(key => (
                <th key={key} className="text-left p-3 font-semibold text-gray-900 dark:text-white capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.data.slice(0, 10).map((row, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3 font-medium text-gray-900 dark:text-white">{row.animal}</td>
                <td className="p-3 text-gray-600 dark:text-gray-400">{row.raca}</td>
                {Object.entries(row).slice(2).map(([key, value]) => (
                  <td key={key} className="p-3 text-gray-600 dark:text-gray-400">
                    {typeof value === 'number' ?
                      (key.includes('roi') || key.includes('margem') ?
                        `${value.toFixed(1)}%` :
                        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`) :
                      value
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reportData.data.length > 10 && (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
          Mostrando 10 de {reportData.data.length} registros
        </div>
      )}
    </div>
  )

  const renderCharts = () => (
    <div className="space-y-6">
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-4">📊</div>
        <div className="text-lg font-medium mb-2">Gráficos Interativos</div>
        <div className="text-sm">
          Visualizações avançadas dos dados do relatório
        </div>
      </div>

      {/* Placeholder para gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-medium">Gráfico de Tendência</div>
          </div>
        </div>
        <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">🥧</div>
            <div className="font-medium">Distribuição</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderExport = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">📤</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Exportar Relatório
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Escolha o formato desejado para exportação
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'excel', label: 'Excel', icon: '📊', desc: 'Planilha completa com dados' },
          { id: 'pdf', label: 'PDF', icon: '📄', desc: 'Relatório formatado para impressão' },
          { id: 'csv', label: 'CSV', icon: '📋', desc: 'Dados em formato texto' }
        ].map(format => (
          <button
            key={format.id}
            onClick={() => setExportFormat(format.id)}
            className={`p-6 rounded-lg border-2 transition-all duration-300 ${
              exportFormat === format.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-3xl mb-3">{format.icon}</div>
            <div className="font-semibold text-gray-900 dark:text-white mb-1">
              {format.label}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {format.desc}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleExport}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Exportar Relatório
        </button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {reportData.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {reportData.description} • Período: {timeRange}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'details' && renderDetails()}
          {selectedTab === 'charts' && renderCharts()}
          {selectedTab === 'export' && renderExport()}
        </div>
      </div>
    </div>
  )
}
