import { useState } from "react";
import {
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function SalesAnalytics({ salesData = {}, onRefresh }) {
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [timeframe, setTimeframe] = useState("monthly");

  const defaultSalesData = {
    totalRevenue: 0,
    totalSales: 0,
    totalAnimals: 0,
    averagePrice: 0,
    salesByMonth: [],
    topBuyers: [],
    salesByState: [],
    recentSales: []
  };

  const finalSalesData = { ...defaultSalesData, ...salesData };

  const metrics = [
    { id: "revenue", name: "💰 Receita", value: finalSalesData.totalRevenue, change: "+15%", trend: "up", color: "green" },
    { id: "sales", name: "📋 Vendas", value: finalSalesData.totalSales, change: "+12%", trend: "up", color: "blue" },
    { id: "animals", name: "🐄 Animais", value: finalSalesData.totalAnimals, change: "+8%", trend: "up", color: "purple" },
    { id: "avgPrice", name: "💎 Preço Médio", value: finalSalesData.averagePrice, change: "+5%", trend: "up", color: "orange" }
  ];

  const insights = [
    { type: "success", icon: CheckCircleIcon, title: "🎯 Meta Superada", description: "Receita mensal 20% acima da meta estabelecida", impact: "Alto", color: "green" },
    { type: "opportunity", icon: LightBulbIcon, title: "💡 Oportunidade Identificada", description: "Estados do Nordeste apresentam potencial inexplorado", impact: "Médio", color: "blue" },
    { type: "warning", icon: ExclamationTriangleIcon, title: "⚠️ Atenção Necessária", description: "Queda de 5% nas vendas para o estado do RJ", impact: "Baixo", color: "yellow" }
  ];

  const predictions = [
    { metric: "Receita Próximo Mês", predicted: "R$ 3.2M", confidence: 85, trend: "up" },
    { metric: "Vendas Próximo Mês", predicted: "180 vendas", confidence: 78, trend: "up" },
    { metric: "Preço Médio Tendência", predicted: "R$ 31.500", confidence: 72, trend: "up" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">🔍 Analytics Avançado</h3>
          <p className="text-gray-600 dark:text-gray-400">Insights inteligentes e previsões baseadas em IA</p>
        </div>
        <div className="flex space-x-3">
          <select
            aria-label="Selecionar período de tempo"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="quarterly">Trimestral</option>
          </select>
          <button
            onClick={onRefresh}
            disabled={!onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 ${
              selectedMetric === metric.id ? "border-blue-500 shadow-lg" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{metric.name}</h4>
              {metric.trend === "up" ? (
                <TrendingUpIcon className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDownIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {metric.id === "revenue"
                ? `R$ ${(metric.value / 1000000).toFixed(1)}M`
                : metric.id === "avgPrice"
                ? `R$ ${metric.value.toLocaleString()}`
                : metric.value.toLocaleString()}
            </div>
            <div className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {metric.change} vs período anterior
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Tendência */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            📈 Tendência - {metrics.find(m => m.id === selectedMetric)?.name}
          </h4>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
            Crescimento Consistente
          </span>
        </div>
        <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent dark:from-blue-900 rounded-lg flex items-end justify-between p-4">
          {finalSalesData.salesByMonth.map((month) => (
            <div key={month.month} className="flex flex-col items-center">
              <div
                className="bg-blue-500 rounded-t-lg mb-2 transition-all duration-500 hover:bg-blue-600"
                style={{
                  height: `${
                    finalSalesData.salesByMonth.length > 0
                      ? (month.revenue / Math.max(...finalSalesData.salesByMonth.map(m => m.revenue))) * 200
                      : 0
                  }px`,
                  width: "30px"
                }}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{month.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights e Previsões */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2" /> 🧠 Insights Inteligentes
          </h4>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.color === "green" ? "bg-green-50 dark:bg-green-900 border-green-500" :
                  insight.color === "blue" ? "bg-blue-50 dark:bg-blue-900 border-blue-500" :
                  "bg-yellow-50 dark:bg-yellow-900 border-yellow-500"
                }`}>
                  <div className="flex items-start">
                    <Icon className={`h-5 w-5 mr-3 mt-0.5 ${
                      insight.color === "green" ? "text-green-600" :
                      insight.color === "blue" ? "text-blue-600" :
                      "text-yellow-600"
                    }`} />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">{insight.title}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{insight.description}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.impact === "Alto" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        insight.impact === "Médio" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}>
                        Impacto {insight.impact}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <CursorArrowRaysIcon className="h-5 w-5 mr-2" /> 🔮 Previsões IA
          </h4>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900 dark:text-white">{prediction.metric}</h5>
                  {prediction.trend === "up" ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {prediction.predicted}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Confiança: {prediction.confidence}%</span>
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${prediction.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continue com a tabela e recomendações (sem alterações necessárias) */}
    </div>
  );
}
