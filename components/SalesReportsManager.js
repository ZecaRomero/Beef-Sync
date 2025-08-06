import { useState } from "react";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  CalendarIcon,
  FunnelIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function SalesReportsManager({ salesData, onRefresh }) {
  const [selectedReport, setSelectedReport] = useState("summary");
  const [dateRange, setDateRange] = useState({
    start: "2025-01-01",
    end: "2025-08-04"
  });
  const [filters, setFilters] = useState({
    state: "",
    buyer: "",
    minValue: "",
    maxValue: ""
  });

  const reportTypes = [
    {
      id: "summary",
      name: "📊 Resumo Executivo",
      description: "Visão geral das vendas e KPIs principais",
      icon: ChartBarIcon,
      color: "from-blue-600 to-indigo-600"
    },
    {
      id: "detailed",
      name: "📋 Relatório Detalhado",
      description: "Lista completa de todas as vendas",
      icon: DocumentTextIcon,
      color: "from-green-600 to-emerald-600"
    },
    {
      id: "financial",
      name: "💰 Análise Financeira",
      description: "Receitas, custos e margem de lucro",
      icon: CurrencyDollarIcon,
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "geographic",
      name: "🗺️ Análise Geográfica",
      description: "Vendas por estado e região",
      icon: FunnelIcon,
      color: "from-orange-600 to-red-600"
    }
  ];

  const generateReport = (type) => {
    // Simular geração de relatório
    alert(`Gerando relatório: ${reportTypes.find(r => r.id === type)?.name}`);
  };

  const exportReport = (format) => {
    alert(`Exportando relatório em formato ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            📈 Central de Relatórios
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Gere relatórios personalizados e análises detalhadas
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => exportReport('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            PDF
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Excel
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <FunnelIcon className="h-5 w-5 mr-2" />
          🔍 Filtros e Período
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filters.state}
              onChange={(e) => setFilters({...filters, state: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os estados</option>
              <option value="SP">São Paulo</option>
              <option value="MG">Minas Gerais</option>
              <option value="GO">Goiás</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor Mínimo
            </label>
            <input
              type="number"
              value={filters.minValue}
              onChange={(e) => setFilters({...filters, minValue: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="R$ 0"
            />
          </div>
        </div>
      </div>

      {/* Tipos de Relatório */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selectedReport === report.id
                ? "border-blue-500 shadow-lg"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${report.color}`}>
                  <report.icon className="h-6 w-6 text-white" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    generateReport(report.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Gerar
                </button>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {report.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {report.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview do Relatório */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            👁️ Preview - {reportTypes.find(r => r.id === selectedReport)?.name}
          </h4>
        </div>
        <div className="p-6">
          {selectedReport === "summary" && (
            <SummaryReport salesData={salesData} />
          )}
          {selectedReport === "detailed" && (
            <DetailedReport salesData={salesData} />
          )}
          {selectedReport === "financial" && (
            <FinancialReport salesData={salesData} />
          )}
          {selectedReport === "geographic" && (
            <GeographicReport salesData={salesData} />
          )}
        </div>
      </div>
    </div>
  );
}

// Componentes de Relatório
function SummaryReport({ salesData }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📊 RELATÓRIO EXECUTIVO DE VENDAS
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Período: Janeiro - Agosto 2025
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {salesData.totalSales}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            Total de Vendas
          </div>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {salesData.totalAnimals.toLocaleString()}
          </div>
          <div className="text-sm text-green-800 dark:text-green-200">
            Animais Vendidos
          </div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            R$ {(salesData.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-200">
            Receita Total
          </div>
        </div>
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            R$ {salesData.averagePrice.toLocaleString()}
          </div>
          <div className="text-sm text-orange-800 dark:text-orange-200">
            Preço Médio
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h3>📈 Análise de Performance</h3>
        <ul>
          <li>Crescimento de 15% na receita comparado ao período anterior</li>
          <li>Aumento de 12% no número total de vendas</li>
          <li>São Paulo lidera com 45 vendas (28.8% do total)</li>
          <li>Preço médio por animal: R$ {salesData.averagePrice.toLocaleString()}</li>
          <li>Taxa de conversão de leads: 85%</li>
        </ul>

        <h3>🎯 Principais Conquistas</h3>
        <ul>
          <li>Meta mensal superada em 120%</li>
          <li>Expansão para 5 novos estados</li>
          <li>Fidelização de 78% dos compradores</li>
          <li>Redução de 15% no tempo médio de venda</li>
        </ul>
      </div>
    </div>
  );
}

function DetailedReport({ salesData }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        📋 Relatório Detalhado de Vendas
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">NF</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Data</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Comprador</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">Estado</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">Animais</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {salesData.recentSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-mono">
                  #{sale.nf}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">
                  {new Date(sale.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">
                  {sale.buyer}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                  {sale.state}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                  {sale.animals}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 text-right font-bold">
                  R$ {sale.value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FinancialReport({ salesData }) {
  const costs = salesData.totalRevenue * 0.3; // 30% de custos estimados
  const profit = salesData.totalRevenue - costs;
  const margin = (profit / salesData.totalRevenue) * 100;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        💰 Análise Financeira Detalhada
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
          <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">
            💵 Receita Bruta
          </h4>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            R$ {salesData.totalRevenue.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900 rounded-lg p-6">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">
            💸 Custos Estimados
          </h4>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            R$ {costs.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
            💎 Lucro Líquido
          </h4>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            R$ {profit.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Margem: {margin.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4">
          📊 Breakdown de Custos (Estimado)
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Alimentação e Manejo</span>
            <span className="font-bold">R$ {(costs * 0.4).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Veterinário e Medicamentos</span>
            <span className="font-bold">R$ {(costs * 0.25).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Transporte e Logística</span>
            <span className="font-bold">R$ {(costs * 0.2).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Impostos e Taxas</span>
            <span className="font-bold">R$ {(costs * 0.15).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GeographicReport({ salesData }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        🗺️ Análise Geográfica de Vendas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">
            📊 Vendas por Estado
          </h4>
          <div className="space-y-3">
            {salesData.salesByState.map((state, index) => (
              <div key={state.state} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="font-medium">{state.state}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{state.sales} vendas</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {state.animals} animais
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">
            💰 Receita por Estado
          </h4>
          <div className="space-y-3">
            {salesData.salesByState.map((state) => (
              <div key={state.state} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium">{state.state}</span>
                <div className="text-right">
                  <div className="font-bold text-green-600 dark:text-green-400">
                    R$ {state.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {((state.revenue / salesData.totalRevenue) * 100).toFixed(1)}% do total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}