import { useState, useEffect, useRef } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

export default function InteractiveBICharts({ salesData, timeRange }) {
  const [selectedChart, setSelectedChart] = useState("revenue");
  const [animationProgress, setAnimationProgress] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (salesData.length > 0) {
      startAnimation();
    }
  }, [salesData, selectedChart]);

  const startAnimation = () => {
    setAnimationProgress(0);
    
    const animate = (timestamp) => {
      const progress = Math.min(timestamp / 2000, 1); // 2 segundos de animação
      setAnimationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  useEffect(() => {
    drawChart();
  }, [animationProgress, selectedChart]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || salesData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    ctx.clearRect(0, 0, width, height);

    switch (selectedChart) {
      case "revenue":
        drawRevenueChart(ctx, width, height);
        break;
      case "volume":
        drawVolumeChart(ctx, width, height);
        break;
      case "comparison":
        drawComparisonChart(ctx, width, height);
        break;
      case "heatmap":
        drawHeatmapChart(ctx, width, height);
        break;
    }
  };

  const drawRevenueChart = (ctx, width, height) => {
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Agrupar dados por data
    const dailyRevenue = {};
    salesData.forEach(item => {
      if (!dailyRevenue[item.date]) {
        dailyRevenue[item.date] = 0;
      }
      dailyRevenue[item.date] += item.valor;
    });

    const dates = Object.keys(dailyRevenue).sort();
    const revenues = dates.map(date => dailyRevenue[date]);
    const maxRevenue = Math.max(...revenues);
    const minRevenue = Math.min(...revenues);

    // Desenhar grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    // Linhas horizontais
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Linhas verticais
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Desenhar área sob a curva (gradiente)
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    revenues.forEach((revenue, index) => {
      const x = padding + (index / (revenues.length - 1)) * chartWidth * animationProgress;
      const y = height - padding - ((revenue - minRevenue) / (maxRevenue - minRevenue)) * chartHeight;
      
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(padding + chartWidth * animationProgress, height - padding);
    ctx.closePath();
    ctx.fill();

    // Desenhar linha principal
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    revenues.forEach((revenue, index) => {
      if (index / revenues.length <= animationProgress) {
        const x = padding + (index / (revenues.length - 1)) * chartWidth;
        const y = height - padding - ((revenue - minRevenue) / (maxRevenue - minRevenue)) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    });

    ctx.stroke();

    // Desenhar pontos
    ctx.fillStyle = '#10b981';
    revenues.forEach((revenue, index) => {
      if (index / revenues.length <= animationProgress) {
        const x = padding + (index / (revenues.length - 1)) * chartWidth;
        const y = height - padding - ((revenue - minRevenue) / (maxRevenue - minRevenue)) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Efeito de pulso no último ponto
        if (index === Math.floor(revenues.length * animationProgress) - 1) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 8 + Math.sin(Date.now() / 200) * 2, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    });

    // Labels do eixo Y
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const value = minRevenue + (maxRevenue - minRevenue) * (1 - i / 5);
      const y = padding + (i / 5) * chartHeight;
      ctx.fillText(`R$ ${(value / 1000).toFixed(0)}k`, padding - 10, y + 4);
    }

    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📈 Evolução da Receita', width / 2, 30);
  };

  const drawVolumeChart = (ctx, width, height) => {
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Agrupar dados por categoria
    const categoryData = {};
    salesData.forEach(item => {
      if (!categoryData[item.categoria]) {
        categoryData[item.categoria] = 0;
      }
      categoryData[item.categoria] += item.vendas;
    });

    const categories = Object.keys(categoryData);
    const volumes = Object.values(categoryData);
    const maxVolume = Math.max(...volumes);

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const barWidth = chartWidth / categories.length * 0.7;
    const barSpacing = chartWidth / categories.length * 0.3;

    // Desenhar barras com animação
    categories.forEach((category, index) => {
      const x = padding + index * (chartWidth / categories.length) + barSpacing / 2;
      const barHeight = (volumes[index] / maxVolume) * chartHeight * animationProgress;
      const y = height - padding - barHeight;

      // Gradiente para cada barra
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, colors[index % colors.length]);
      gradient.addColorStop(1, colors[index % colors.length] + '80');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Borda da barra
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Valor no topo da barra
      if (animationProgress > 0.8) {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(volumes[index].toString(), x + barWidth / 2, y - 10);
      }

      // Label da categoria
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(x + barWidth / 2, height - padding + 20);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText(category, 0, 0);
      ctx.restore();
    });

    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📊 Volume de Vendas por Categoria', width / 2, 30);
  };

  const drawComparisonChart = (ctx, width, height) => {
    const padding = 60;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Dados para comparação (atual vs anterior)
    const currentPeriod = salesData.slice(-15);
    const previousPeriod = salesData.slice(-30, -15);

    const currentTotal = currentPeriod.reduce((sum, item) => sum + item.valor, 0);
    const previousTotal = previousPeriod.reduce((sum, item) => sum + item.valor, 0);

    const currentAngle = (currentTotal / (currentTotal + previousTotal)) * 2 * Math.PI * animationProgress;
    const previousAngle = (previousTotal / (currentTotal + previousTotal)) * 2 * Math.PI * animationProgress;

    // Desenhar período atual
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + currentAngle);
    ctx.closePath();
    ctx.fill();

    // Desenhar período anterior
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2 + currentAngle, -Math.PI / 2 + currentAngle + previousAngle);
    ctx.closePath();
    ctx.fill();

    // Círculo interno para criar efeito donut
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fill();

    // Texto central
    if (animationProgress > 0.5) {
      const change = ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${change > 0 ? '+' : ''}${change}%`, centerX, centerY - 10);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('vs período anterior', centerX, centerY + 15);
    }

    // Legenda
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    // Período atual
    ctx.fillStyle = '#10b981';
    ctx.fillRect(50, height - 80, 15, 15);
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`Atual: R$ ${(currentTotal / 1000).toFixed(0)}k`, 75, height - 68);
    
    // Período anterior
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(50, height - 50, 15, 15);
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`Anterior: R$ ${(previousTotal / 1000).toFixed(0)}k`, 75, height - 38);

    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⚖️ Comparação de Períodos', width / 2, 30);
  };

  const drawHeatmapChart = (ctx, width, height) => {
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Criar matriz de dados por dia da semana e hora
    const heatmapData = {};
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Simular dados de heatmap
    for (let day = 0; day < 7; day++) {
      for (let hour = 8; hour < 18; hour++) {
        const key = `${day}-${hour}`;
        heatmapData[key] = Math.random() * 100 * animationProgress;
      }
    }

    const cellWidth = chartWidth / 10;
    const cellHeight = chartHeight / 7;
    const maxValue = Math.max(...Object.values(heatmapData));

    // Desenhar células do heatmap
    Object.entries(heatmapData).forEach(([key, value]) => {
      const [day, hour] = key.split('-').map(Number);
      const x = padding + (hour - 8) * cellWidth;
      const y = padding + day * cellHeight;
      
      const intensity = value / maxValue;
      const alpha = Math.floor(intensity * 255);
      
      ctx.fillStyle = `rgba(16, 185, 129, ${intensity})`;
      ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1);
      
      // Texto do valor se a intensidade for alta
      if (intensity > 0.5 && animationProgress > 0.7) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(value), x + cellWidth / 2, y + cellHeight / 2 + 3);
      }
    });

    // Labels dos dias
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    days.forEach((day, index) => {
      ctx.fillText(day, padding - 10, padding + index * cellHeight + cellHeight / 2 + 4);
    });

    // Labels das horas
    ctx.textAlign = 'center';
    for (let hour = 8; hour < 18; hour++) {
      ctx.fillText(`${hour}h`, padding + (hour - 8) * cellWidth + cellWidth / 2, height - padding + 20);
    }

    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 Mapa de Calor - Vendas por Horário', width / 2, 25);
  };

  const getChartStats = () => {
    const totalVendas = salesData.reduce((sum, item) => sum + item.vendas, 0);
    const totalReceita = salesData.reduce((sum, item) => sum + item.valor, 0);
    const mediaVendas = totalVendas / Math.max(salesData.length, 1);
    
    // Calcular tendência
    const recent = salesData.slice(-7);
    const previous = salesData.slice(-14, -7);
    const recentAvg = recent.reduce((sum, item) => sum + item.valor, 0) / recent.length;
    const previousAvg = previous.reduce((sum, item) => sum + item.valor, 0) / previous.length;
    const trend = recentAvg > previousAvg ? 'up' : recentAvg < previousAvg ? 'down' : 'stable';
    
    return { totalVendas, totalReceita, mediaVendas, trend };
  };

  const stats = getChartStats();

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
      {/* Header com seletor de gráfico */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Gráficos Interativos BI
        </h3>
        
        <div className="flex space-x-2">
          {[
            { key: 'revenue', label: '📈 Receita', color: 'green' },
            { key: 'volume', label: '📊 Volume', color: 'blue' },
            { key: 'comparison', label: '⚖️ Comparação', color: 'purple' },
            { key: 'heatmap', label: '🔥 Heatmap', color: 'orange' }
          ].map(chart => (
            <button
              key={chart.key}
              onClick={() => setSelectedChart(chart.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedChart === chart.key
                  ? `bg-${chart.color}-600 text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300'
              }`}
            >
              {chart.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.totalVendas}
          </div>
          <div className="text-sm text-gray-500">Total Vendas</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            R$ {(stats.totalReceita / 1000).toFixed(0)}k
          </div>
          <div className="text-sm text-gray-500">Receita</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {stats.mediaVendas.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">Média/Dia</div>
        </div>
        
        <div className="text-center flex items-center justify-center">
          <div className="flex items-center">
            {stats.trend === 'up' && <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mr-1" />}
            {stats.trend === 'down' && <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 mr-1" />}
            {stats.trend === 'stable' && <MinusIcon className="h-6 w-6 text-gray-600 mr-1" />}
            <span className={`font-bold ${
              stats.trend === 'up' ? 'text-green-600' : 
              stats.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {stats.trend === 'up' ? 'Alta' : stats.trend === 'down' ? 'Baixa' : 'Estável'}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas do gráfico */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-lg"
        />
        
        {/* Indicador de progresso da animação */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {Math.round(animationProgress * 100)}%
        </div>
      </div>

      {/* Botão para recarregar animação */}
      <div className="mt-4 text-center">
        <button
          onClick={startAnimation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Recarregar Animação
        </button>
      </div>
    </div>
  );
}