import { useState, useEffect, useRef } from "react";
import {
  ChartBarIcon,
  PresentationChartLineIcon,
  ClockIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import BIReportGenerator from "./BIReportGenerator";
import InteractiveBICharts from "./InteractiveBICharts";

export default function SalesBIDashboard({ isOpen, onClose }) {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("30"); // dias
  const [chartType, setChartType] = useState("line");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const timelineChartRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadSalesData();
    }
  }, [isOpen, timeRange]);

  useEffect(() => {
    if (salesData.length > 0) {
      renderCharts();
    }
  }, [salesData, chartType]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      // Simulando dados de vendas - substitua pela sua API
      const mockData = []; // Dados reais serão carregados da API
      setSalesData(mockData);
    } catch (error) {
      console.error("Erro ao carregar dados de vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função removida - dados reais serão carregados da API
  const generateMockSalesData = (days) => {
    return []; // Retorna array vazio
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        vendas: Math.floor(Math.random() * 50) + 10,
        valor: Math.floor(Math.random() * 100000) + 20000,
        categoria: ['Garrote', 'Novilha', 'Boi Gordo', 'Vaca Gorda'][Math.floor(Math.random() * 4)],
        regiao: ['Norte', 'Sul', 'Leste', 'Oeste'][Math.floor(Math.random() * 4)]
      });
    }
    
    return data;
  };

  const renderCharts = () => {
    renderLineChart();
    renderPieChart();
    renderTimelineChart();
  };

  const renderLineChart = () => {
    const canvas = lineChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurações
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Dados para o gráfico
    const dates = salesData.map(d => d.date);
    const values = salesData.map(d => d.valor);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    // Desenhar eixos
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Eixo Y
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Eixo X
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Desenhar linha de vendas
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    values.forEach((value, index) => {
      const x = padding + (index / (values.length - 1)) * chartWidth;
      const y = height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Desenhar pontos
    ctx.fillStyle = '#10b981';
    values.forEach((value, index) => {
      const x = padding + (index / (values.length - 1)) * chartWidth;
      const y = height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Labels do eixo Y
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (maxValue - minValue) * (i / 5);
      const y = height - padding - (i / 5) * chartHeight;
      ctx.fillText(`R$ ${(value / 1000).toFixed(0)}k`, padding - 10, y + 4);
    }
    
    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Evolução das Vendas', width / 2, 30);
  };

  const renderPieChart = () => {
    const canvas = pieChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Agrupar dados por categoria
    const categoryData = {};
    salesData.forEach(item => {
      if (!categoryData[item.categoria]) {
        categoryData[item.categoria] = 0;
      }
      categoryData[item.categoria] += item.valor;
    });
    
    const categories = Object.keys(categoryData);
    const values = Object.values(categoryData);
    const total = values.reduce((sum, val) => sum + val, 0);
    
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    let currentAngle = -Math.PI / 2;
    
    // Desenhar fatias
    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      
      // Desenhar borda
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      currentAngle += sliceAngle;
    });
    
    // Legenda
    ctx.font = '12px Arial';
    categories.forEach((category, index) => {
      const y = 20 + index * 20;
      
      // Cor da legenda
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(10, y - 8, 12, 12);
      
      // Texto da legenda
      ctx.fillStyle = '#1f2937';
      const percentage = ((values[index] / total) * 100).toFixed(1);
      ctx.fillText(`${category} (${percentage}%)`, 30, y + 2);
    });
    
    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Vendas por Categoria', width / 2, height - 10);
  };

  const renderTimelineChart = () => {
    const canvas = timelineChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Agrupar dados por data
    const dailyData = {};
    salesData.forEach(item => {
      if (!dailyData[item.date]) {
        dailyData[item.date] = { vendas: 0, valor: 0 };
      }
      dailyData[item.date].vendas += item.vendas;
      dailyData[item.date].valor += item.valor;
    });
    
    const dates = Object.keys(dailyData).sort();
    const vendas = dates.map(date => dailyData[date].vendas);
    const maxVendas = Math.max(...vendas);
    
    // Desenhar barras
    const barWidth = chartWidth / dates.length * 0.8;
    const barSpacing = chartWidth / dates.length * 0.2;
    
    dates.forEach((date, index) => {
      const x = padding + index * (chartWidth / dates.length) + barSpacing / 2;
      const barHeight = (dailyData[date].vendas / maxVendas) * chartHeight;
      const y = height - padding - barHeight;
      
      // Gradiente para as barras
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#059669');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Valor no topo da barra
      ctx.fillStyle = '#1f2937';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(dailyData[date].vendas.toString(), x + barWidth / 2, y - 5);
    });
    
    // Eixos
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Timeline de Vendas Diárias', width / 2, 25);
  };

  const handleSendWhatsApp = async (message) => {
    if (!whatsappNumber) {
      setShowWhatsAppModal(true);
      return;
    }

    try {
      const response = await fetch('/api/whatsapp/send-bi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: whatsappNumber,
          message: message
        })
      });

      if (response.ok) {
        alert('Relatório BI enviado via WhatsApp com sucesso!');
        setShowWhatsAppModal(false);
      } else {
        alert('Erro ao enviar relatório via WhatsApp');
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      alert('Erro ao enviar relatório via WhatsApp');
    }
  };

  const WhatsAppModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Enviar Relatório BI via WhatsApp
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número do WhatsApp
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+55 11 99999-9999"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowWhatsAppModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (whatsappNumber) {
                handleSendWhatsApp("Relatório BI será enviado...");
              }
            }}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Business Intelligence - Vendas
              </h2>
              <p className="text-blue-100">
                Análise visual de vendas com gráficos interativos
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filtro de Período */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="7" className="text-gray-900">Últimos 7 dias</option>
              <option value="30" className="text-gray-900">Últimos 30 dias</option>
              <option value="90" className="text-gray-900">Últimos 90 dias</option>
              <option value="365" className="text-gray-900">Último ano</option>
            </select>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin text-4xl">📊</div>
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">
                Carregando dados de BI...
              </span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Métricas Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <div className="text-2xl font-bold">
                    {salesData.reduce((sum, item) => sum + item.vendas, 0)}
                  </div>
                  <div className="text-green-100">Total de Vendas</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="text-2xl font-bold">
                    R$ {(salesData.reduce((sum, item) => sum + item.valor, 0) / 1000).toFixed(0)}k
                  </div>
                  <div className="text-blue-100">Receita Total</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                  <div className="text-2xl font-bold">
                    R$ {salesData.length > 0 ? (salesData.reduce((sum, item) => sum + item.valor, 0) / salesData.reduce((sum, item) => sum + item.vendas, 0) / 1000).toFixed(1) : 0}k
                  </div>
                  <div className="text-purple-100">Ticket Médio</div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                  <div className="text-2xl font-bold">
                    {Math.round(salesData.reduce((sum, item) => sum + item.vendas, 0) / Math.max(parseInt(timeRange), 1))}
                  </div>
                  <div className="text-orange-100">Vendas/Dia</div>
                </div>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Linha */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <PresentationChartLineIcon className="h-5 w-5 mr-2 text-green-600" />
                      Evolução das Vendas
                    </h3>
                  </div>
                  <canvas
                    ref={lineChartRef}
                    width={400}
                    height={300}
                    className="w-full"
                  />
                </div>

                {/* Gráfico de Pizza */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Vendas por Categoria
                    </h3>
                  </div>
                  <canvas
                    ref={pieChartRef}
                    width={400}
                    height={300}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Timeline Chart */}
              <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Timeline de Vendas Diárias
                  </h3>
                </div>
                <canvas
                  ref={timelineChartRef}
                  width={800}
                  height={300}
                  className="w-full"
                />
              </div>

              {/* Tabela de Dados Detalhados */}
              <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Dados Detalhados
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600">
                        <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Data</th>
                        <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">Vendas</th>
                        <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">Valor</th>
                        <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">Categoria</th>
                        <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">Região</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.slice(0, 10).map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="p-3 text-gray-900 dark:text-white">
                            {new Date(item.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-3 text-center text-gray-900 dark:text-white font-medium">
                            {item.vendas}
                          </td>
                          <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                            R$ {item.valor.toLocaleString('pt-BR')}
                          </td>
                          <td className="p-3 text-center text-gray-600 dark:text-gray-300">
                            {item.categoria}
                          </td>
                          <td className="p-3 text-center text-gray-600 dark:text-gray-300">
                            {item.regiao}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gráficos Interativos Avançados */}
              <InteractiveBICharts 
                salesData={salesData}
                timeRange={timeRange}
              />

              {/* Gerador de Relatórios BI */}
              <BIReportGenerator 
                salesData={salesData}
                onSendWhatsApp={handleSendWhatsApp}
              />
            </div>
          )}
        </div>
        
        {/* Modal do WhatsApp */}
        {showWhatsAppModal && <WhatsAppModal />}
      </div>
    </div>
  );
}