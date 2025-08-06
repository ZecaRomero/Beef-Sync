import { useState, useEffect } from "react";
import {
  DocumentChartBarIcon,
  ShareIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function BIReportGenerator({ salesData, onSendWhatsApp }) {
  const [reportType, setReportType] = useState("summary");
  const [generating, setGenerating] = useState(false);

  const generateReport = async (type = "whatsapp") => {
    setGenerating(true);
    
    try {
      const report = {
        periodo: "Últimos 30 dias",
        totalVendas: salesData.reduce((sum, item) => sum + item.vendas, 0),
        receitaTotal: salesData.reduce((sum, item) => sum + item.valor, 0),
        ticketMedio: salesData.length > 0 ? 
          salesData.reduce((sum, item) => sum + item.valor, 0) / salesData.reduce((sum, item) => sum + item.vendas, 0) : 0,
        vendasPorDia: Math.round(salesData.reduce((sum, item) => sum + item.vendas, 0) / 30),
        
        // Análise por categoria
        categorias: getCategoryAnalysis(),
        
        // Tendências
        tendencia: getTrendAnalysis(),
        
        // Top performers
        topDias: getTopPerformingDays(),
        
        // Insights
        insights: generateInsights()
      };

      if (type === "whatsapp") {
        const message = formatWhatsAppMessage(report);
        onSendWhatsApp(message);
      } else if (type === "pdf") {
        generatePDFReport(report);
      }
      
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Erro ao gerar relatório");
    } finally {
      setGenerating(false);
    }
  };

  const getCategoryAnalysis = () => {
    const categoryData = {};
    salesData.forEach(item => {
      if (!categoryData[item.categoria]) {
        categoryData[item.categoria] = { vendas: 0, valor: 0 };
      }
      categoryData[item.categoria].vendas += item.vendas;
      categoryData[item.categoria].valor += item.valor;
    });

    return Object.entries(categoryData)
      .map(([categoria, data]) => ({
        categoria,
        vendas: data.vendas,
        valor: data.valor,
        participacao: (data.valor / salesData.reduce((sum, item) => sum + item.valor, 0) * 100).toFixed(1)
      }))
      .sort((a, b) => b.valor - a.valor);
  };

  const getTrendAnalysis = () => {
    if (salesData.length < 7) return "Dados insuficientes";
    
    const recent = salesData.slice(-7).reduce((sum, item) => sum + item.valor, 0) / 7;
    const previous = salesData.slice(-14, -7).reduce((sum, item) => sum + item.valor, 0) / 7;
    
    const change = ((recent - previous) / previous * 100).toFixed(1);
    
    if (change > 5) return `📈 Crescimento de ${change}%`;
    if (change < -5) return `📉 Queda de ${Math.abs(change)}%`;
    return `➡️ Estável (${change}%)`;
  };

  const getTopPerformingDays = () => {
    const dailyData = {};
    salesData.forEach(item => {
      if (!dailyData[item.date]) {
        dailyData[item.date] = { vendas: 0, valor: 0 };
      }
      dailyData[item.date].vendas += item.vendas;
      dailyData[item.date].valor += item.valor;
    });

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        data: new Date(date).toLocaleDateString('pt-BR'),
        vendas: data.vendas,
        valor: data.valor
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 3);
  };

  const generateInsights = () => {
    const insights = [];
    const categoryAnalysis = getCategoryAnalysis();
    
    // Insight sobre categoria líder
    if (categoryAnalysis.length > 0) {
      const leader = categoryAnalysis[0];
      insights.push(`🏆 ${leader.categoria} lidera com ${leader.participacao}% das vendas`);
    }
    
    // Insight sobre performance
    const totalVendas = salesData.reduce((sum, item) => sum + item.vendas, 0);
    if (totalVendas > 100) {
      insights.push(`🚀 Excelente performance com ${totalVendas} vendas no período`);
    } else if (totalVendas > 50) {
      insights.push(`✅ Boa performance com ${totalVendas} vendas no período`);
    } else {
      insights.push(`⚠️ Performance abaixo do esperado: ${totalVendas} vendas`);
    }
    
    // Insight sobre ticket médio
    const ticketMedio = salesData.length > 0 ? 
      salesData.reduce((sum, item) => sum + item.valor, 0) / salesData.reduce((sum, item) => sum + item.vendas, 0) : 0;
    
    if (ticketMedio > 50000) {
      insights.push(`💰 Ticket médio alto: R$ ${(ticketMedio/1000).toFixed(0)}k`);
    }
    
    return insights;
  };

  const formatWhatsAppMessage = (report) => {
    return `
🐄 *RELATÓRIO BI - VENDAS DE GADO*
📅 Período: ${report.periodo}

📊 *RESUMO EXECUTIVO*
• Total de Vendas: ${report.totalVendas} cabeças
• Receita Total: R$ ${(report.receitaTotal/1000).toFixed(0)}k
• Ticket Médio: R$ ${(report.ticketMedio/1000).toFixed(1)}k
• Vendas/Dia: ${report.vendasPorDia} cabeças

📈 *ANÁLISE POR CATEGORIA*
${report.categorias.map(cat => 
  `• ${cat.categoria}: ${cat.vendas} vendas (${cat.participacao}%)`
).join('\n')}

📊 *TENDÊNCIA*
${report.tendencia}

🏆 *TOP 3 MELHORES DIAS*
${report.topDias.map((dia, index) => 
  `${index + 1}. ${dia.data}: ${dia.vendas} vendas - R$ ${(dia.valor/1000).toFixed(0)}k`
).join('\n')}

💡 *INSIGHTS*
${report.insights.join('\n')}

---
🤖 Relatório gerado automaticamente pelo BeefSync
📱 Sistema de Gestão de Leilão
    `.trim();
  };

  const generatePDFReport = (report) => {
    // Simular geração de PDF
    const element = document.createElement('a');
    const file = new Blob([formatWhatsAppMessage(report)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-bi-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <DocumentChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
          Gerador de Relatórios BI
        </h3>
      </div>

      <div className="space-y-4">
        {/* Tipo de Relatório */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Relatório
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          >
            <option value="summary">Resumo Executivo</option>
            <option value="detailed">Relatório Detalhado</option>
            <option value="trends">Análise de Tendências</option>
            <option value="categories">Análise por Categorias</option>
          </select>
        </div>

        {/* Preview do Relatório */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Preview do Relatório
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <div className="flex justify-between">
              <span>Total de Vendas:</span>
              <span className="font-medium">
                {salesData.reduce((sum, item) => sum + item.vendas, 0)} cabeças
              </span>
            </div>
            <div className="flex justify-between">
              <span>Receita Total:</span>
              <span className="font-medium text-green-600">
                R$ {(salesData.reduce((sum, item) => sum + item.valor, 0)/1000).toFixed(0)}k
              </span>
            </div>
            <div className="flex justify-between">
              <span>Período:</span>
              <span className="font-medium">Últimos 30 dias</span>
            </div>
            <div className="flex justify-between">
              <span>Tendência:</span>
              <span className="font-medium">{getTrendAnalysis()}</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => generateReport("whatsapp")}
            disabled={generating}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            {generating ? "Gerando..." : "Enviar WhatsApp"}
          </button>

          <button
            onClick={() => generateReport("pdf")}
            disabled={generating}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download TXT
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Imprimir
          </button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {getCategoryAnalysis().length}
            </div>
            <div className="text-xs text-gray-500">Categorias</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(salesData.reduce((sum, item) => sum + item.vendas, 0) / 30)}
            </div>
            <div className="text-xs text-gray-500">Vendas/Dia</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {getTopPerformingDays().length > 0 ? getTopPerformingDays()[0].vendas : 0}
            </div>
            <div className="text-xs text-gray-500">Melhor Dia</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {generateInsights().length}
            </div>
            <div className="text-xs text-gray-500">Insights</div>
          </div>
        </div>
      </div>
    </div>
  );
}