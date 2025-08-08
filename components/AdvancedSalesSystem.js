import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  TrendingUpIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import DirectInvoiceManager from "./DirectInvoiceManager";
import SalesReportsManager from "./SalesReportsManager";
import SalesAnalytics from "./SalesAnalytics";
import SalesHistory from "./SalesHistory";

export default function AdvancedSalesSystem({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalAnimals: 0,
    totalRevenue: 0,
    averagePrice: 0,
    topBuyers: [],
    salesByState: [],
    salesByMonth: [],
    recentSales: [],
  });
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      id: "dashboard",
      name: "📊 Dashboard",
      icon: ChartBarIcon,
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: "create",
      name: "📋 Nova Venda",
      icon: PlusIcon,
      color: "from-green-600 to-emerald-600",
    },
    {
      id: "history",
      name: "📚 Histórico",
      icon: CalendarIcon,
      color: "from-purple-600 to-pink-600",
    },
    {
      id: "reports",
      name: "📈 Relatórios",
      icon: DocumentTextIcon,
      color: "from-orange-600 to-red-600",
    },
    {
      id: "analytics",
      name: "🔍 Analytics",
      icon: TrendingUpIcon,
      color: "from-cyan-600 to-blue-600",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      loadSalesData();
    }
  }, [isOpen]);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados - substituir por APIs reais
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSalesData({
        totalSales: 156,
        totalAnimals: 1247,
        totalRevenue: 2850000,
        averagePrice: 29082,
        topBuyers: [
          { name: "Luciano Abramo Ciambelli", sales: 45, revenue: 850000, state: "SP" },
          { name: "Dona Monica", sales: 32, revenue: 620000, state: "MG" },
          { name: "Reginaldo Faria", sales: 28, revenue: 580000, state: "GO" },
          { name: "Ana Oliveira", sales: 25, revenue: 450000, state: "MT" },
          { name: "Carlos Lima", sales: 22, revenue: 380000, state: "MS" },
        ],
        salesByState: [
          { state: "SP", sales: 45, revenue: 1200000, animals: 380 },
          { state: "MG", sales: 32, revenue: 850000, animals: 290 },
          { state: "GO", sales: 28, revenue: 650000, animals: 220 },
          { state: "MT", sales: 25, revenue: 580000, animals: 195 },
          { state: "MS", sales: 18, revenue: 420000, animals: 162 },
        ],
        salesByMonth: [
          { month: "Jan", sales: 12, revenue: 280000 },
          { month: "Fev", sales: 15, revenue: 350000 },
          { month: "Mar", sales: 18, revenue: 420000 },
          { month: "Abr", sales: 22, revenue: 510000 },
          { month: "Mai", sales: 25, revenue: 580000 },
          { month: "Jun", sales: 28, revenue: 650000 },
          { month: "Jul", sales: 36, revenue: 850000 },
        ],
        recentSales: [
          { id: 1, nf: "001", buyer: "Luciano Abramo Ciambelli", animals: 12, value: 85000, date: "2025-08-04", state: "SP" },
          { id: 2, nf: "002", buyer: "Dona Monica", animals: 8, value: 62000, date: "2025-08-03", state: "MG" },
          { id: 3, nf: "003", buyer: "Reginaldo Faria", animals: 15, value: 95000, date: "2025-08-02", state: "GO" },
          { id: 4, nf: "004", buyer: "Ana Oliveira", animals: 6, value: 45000, date: "2025-08-01", state: "MT" },
          { id: 5, nf: "005", buyer: "Carlos Lima", animals: 10, value: 72000, date: "2025-07-31", state: "MS" },
        ],
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                🚀 Sistema Avançado de Vendas
              </h2>
              <p className="text-blue-100">
                Analytics, Relatórios e Gestão Completa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <SalesDashboard 
              salesData={salesData} 
              loading={loading}
              onCreateSale={() => setActiveTab("create")}
            />
          )}

          {/* Nova Venda */}
          {activeTab === "create" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📋 Criar Nova Venda
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Cadastre animais e gere nota fiscal em uma única tela
                </p>
              </div>
              <DirectInvoiceManager 
                isOpen={true} 
                onClose={() => {}} 
                embedded={true}
                onSaleComplete={() => {
                  setActiveTab("dashboard");
                  loadSalesData();
                }}
              />
            </div>
          )}

          {/* Histórico */}
          {activeTab === "history" && (
            <SalesHistory 
              salesData={salesData}
              onRefresh={loadSalesData}
            />
          )}

          {/* Relatórios */}
          {activeTab === "reports" && (
            <SalesReportsManager 
              salesData={salesData}
              onRefresh={loadSalesData}
            />
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <SalesAnalytics 
              salesData={salesData}
              onRefresh={loadSalesData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function SalesDashboard({ salesData, loading, onCreateSale }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <div className="text-gray-600 dark:text-gray-400">
            Carregando dados de vendas...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Vendas</p>
              <p className="text-3xl font-bold">{salesData.totalSales}</p>
              <p className="text-blue-100 text-sm">+12% vs mês anterior</p>
            </div>
            <DocumentTextIcon className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Animais Vendidos</p>
              <p className="text-3xl font-bold">{salesData.totalAnimals.toLocaleString()}</p>
              <p className="text-green-100 text-sm">+8% vs mês anterior</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Receita Total</p>
              <p className="text-3xl font-bold">
                R$ {(salesData.totalRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-purple-100 text-sm">+15% vs mês anterior</p>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Preço Médio</p>
              <p className="text-3xl font-bold">
                R$ {salesData.averagePrice.toLocaleString()}
              </p>
              <p className="text-orange-100 text-sm">+5% vs mês anterior</p>
            </div>
            <TrendingUpIcon className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          ⚡ Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onCreateSale}
            className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center shadow-lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            📋 Nova Venda
          </button>
          <button className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-lg">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            📊 Gerar Relatório
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center shadow-lg">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            💾 Exportar Dados
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Estado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🗺️ Vendas por Estado
          </h3>
          <div className="space-y-3">
            {salesData.salesByState.map((state, index) => (
              <div key={state.state} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {state.state}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {state.sales} vendas
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    R$ {(state.revenue / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Compradores */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🏆 Top Compradores
          </h3>
          <div className="space-y-3">
            {salesData.topBuyers.map((buyer, index) => (
              <div key={buyer.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {buyer.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {buyer.state}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {buyer.sales} vendas
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    R$ {(buyer.revenue / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendas Recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            📋 Vendas Recentes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">NF</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Comprador</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Estado</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Animais</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Valor</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Data</th>
              </tr>
            </thead>
            <tbody>
              {salesData.recentSales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      #{sale.nf}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {sale.buyer}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                      {sale.state}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {sale.animals}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-green-600 dark:text-green-400">
                      R$ {sale.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-400">
                    {new Date(sale.date).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}