// Sistema completo de relatórios
import { useState } from 'react'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

export default function AdvancedReports() {
  const [reportType, setReportType] = useState('sales')
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    buyer: '',
    state: '',
    minValue: '',
    maxValue: ''
  })
  const [loading, setLoading] = useState(false)

  const reportTypes = [
    { id: 'sales', name: 'Relatório de Vendas', icon: '💰' },
    { id: 'invoices', name: 'Relatório de NFs', icon: '📋' },
    { id: 'financial', name: 'Relatório Financeiro', icon: '📊' },
    { id: 'buyers', name: 'Análise de Compradores', icon: '👥' },
    { id: 'performance', name: 'Performance de Vendas', icon: '📈' }
  ]

  const generateReport = async (format = 'pdf') => {
    setLoading(true)
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reportType, filters, format })
      })

      const data = await response.json()

      if (format === 'pdf') {
        generatePDFReport(data)
      } else if (format === 'xlsx') {
        generateExcelReport(data)
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePDFReport = (data) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text('Beef Sync - Relatório de Vendas', 20, 20)

    doc.setFontSize(12)
    doc.text(`Período: ${filters.dateFrom || 'Início'} até ${filters.dateTo || 'Hoje'}`, 20, 35)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 45)

    // Resumo
    let yPosition = 60
    doc.setFontSize(16)
    doc.text('Resumo Executivo', 20, yPosition)

    yPosition += 15
    doc.setFontSize(12)
    doc.text(`Total de Vendas: ${data.summary.totalSales}`, 20, yPosition)
    yPosition += 10
    doc.text(`Receita Total: ${formatCurrency(data.summary.totalRevenue)}`, 20, yPosition)
    yPosition += 10
    doc.text(`Preço Médio: ${formatCurrency(data.summary.averagePrice)}`, 20, yPosition)

    // Tabela de vendas
    yPosition += 25
    doc.setFontSize(16)
    doc.text('Detalhamento das Vendas', 20, yPosition)

    // Adicionar tabela (implementar com autoTable plugin)

    doc.save(`relatorio-vendas-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const generateExcelReport = (data) => {
    const workbook = XLSX.utils.book_new()

    // Aba de resumo
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total de Vendas', data.summary.totalSales],
      ['Receita Total', data.summary.totalRevenue],
      ['Preço Médio', data.summary.averagePrice],
      ['ROI Médio', data.summary.averageROI + '%']
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo')

    // Aba de vendas detalhadas
    const salesSheet = XLSX.utils.json_to_sheet(data.sales)
    XLSX.utils.book_append_sheet(workbook, salesSheet, 'Vendas')

    // Aba de compradores
    const buyersSheet = XLSX.utils.json_to_sheet(data.buyers)
    XLSX.utils.book_append_sheet(workbook, buyersSheet, 'Compradores')

    XLSX.writeFile(workbook, `relatorio-vendas-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📊 Relatórios Avançados
        </h2>

        {/* Seleção do tipo de relatório */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {reportTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                reportType === type.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.name}</div>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Data Inicial</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Data Final</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estado</label>
            <select
              value={filters.state}
              onChange={(e) => setFilters({...filters, state: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Todos os estados</option>
              <option value="SP">São Paulo</option>
              <option value="MG">Minas Gerais</option>
              <option value="GO">Goiás</option>
              {/* Adicionar outros estados */}
            </select>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4">
          <button
            onClick={() => generateReport('pdf')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            📄 Gerar PDF
          </button>
          <button
            onClick={() => generateReport('xlsx')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            📊 Gerar Excel
          </button>
          <button
            onClick={() => generateReport('csv')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            📋 Gerar CSV
          </button>
        </div>
      </div>
    </div>
  )
}
