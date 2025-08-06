import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import SalesTimeline from "./SalesTimeline";
import BIPieChart from './BIPieChart';

export default function BIChartsVisual({ salesData, onSendWhatsApp }) {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (salesData.length > 0) {
      startAnimation();
    }
  }, [salesData]);

  const startAnimation = () => {
    setAnimationProgress(0);
    const animate = (timestamp) => {
      const progress = Math.min(timestamp / 2000, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        drawCharts();
      }
    };
    requestAnimationFrame(animate);
  };

  const drawCharts = () => {
    drawPieChart();
    drawBarChart();
    drawLineChart();
  };

  const drawPieChart = () => {
    const canvas = pieChartRef.current;
    if (!canvas || salesData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dados para o gráfico de pizza
    const fivAnimals = salesData.filter(sale => sale.tipoCobertura === 'FIV').length;
    const iaAnimals = salesData.length - fivAnimals;
    const total = salesData.length;

    if (total === 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Cores
    const fivColor = '#10b981'; // Verde
    const iaColor = '#3b82f6';  // Azul

    // Ângulos
    const fivAngle = (fivAnimals / total) * 2 * Math.PI * animationProgress;
    const iaAngle = (iaAnimals / total) * 2 * Math.PI * animationProgress;

    // Desenhar FIV
    ctx.fillStyle = fivColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + fivAngle);
    ctx.closePath();
    ctx.fill();

    // Desenhar IA
    ctx.fillStyle = iaColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2 + fivAngle, -Math.PI / 2 + fivAngle + iaAngle);
    ctx.closePath();
    ctx.fill();

    // Círculo interno (efeito donut)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fill();

    // Texto central
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(total.toString(), centerX, centerY - 5);
    ctx.font = '14px Arial';
    ctx.fillText('Animais', centerX, centerY + 15);

    // Legenda
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';

    // FIV
    ctx.fillStyle = fivColor;
    ctx.fillRect(20, height - 60, 15, 15);
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`FIV: ${fivAnimals} (${((fivAnimals / total) * 100).toFixed(1)}%)`, 45, height - 48);

    // IA
    ctx.fillStyle = iaColor;
    ctx.fillRect(20, height - 35, 15, 15);
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`IA: ${iaAnimals} (${((iaAnimals / total) * 100).toFixed(1)}%)`, 45, height - 23);

    // Título
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📊 FIV vs IA', width / 2, 25);
  };

  const drawBarChart = () => {
    const canvas = barChartRef.current;
    if (!canvas || salesData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Dados por série
    const seriesData = {};
    salesData.forEach(sale => {
      const serie = sale.serie || 'CJCJ';
      seriesData[serie] = (seriesData[serie] || 0) + 1;
    });

    const series = Object.keys(seriesData);
    const values = Object.values(seriesData);
    const maxValue = Math.max(...values);

    if (maxValue === 0) return;

    const barWidth = chartWidth / series.length * 0.7;
    const barSpacing = chartWidth / series.length * 0.3;

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    // Desenhar barras
    series.forEach((serie, index) => {
      const x = padding + index * (chartWidth / series.length) + barSpacing / 2;
      const barHeight = (values[index] / maxValue) * chartHeight * animationProgress;
      const y = height - padding - barHeight;

      // Gradiente
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, colors[index % colors.length]);
      gradient.addColorStop(1, colors[index % colors.length] + '80');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Valor no topo
      if (animationProgress > 0.8) {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(values[index].toString(), x + barWidth / 2, y - 10);
      }

      // Label da série
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.fillText(serie, x + barWidth / 2, height - padding + 20);
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
    ctx.fillText('📈 Vendas por Série', width / 2, 25);
  };

  const drawLineChart = () => {
    const canvas = lineChartRef.current;
    if (!canvas || salesData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Simular dados temporais (últimos 7 dias)
    const days = [];
    const values = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));

      // Simular vendas por dia
      const dailySales = Math.floor(Math.random() * 20) + 5;
      values.push(dailySales);
    }

    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    if (maxValue === minValue) return;

    // Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Área sob a curva
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    values.forEach((value, index) => {
      if (index / values.length <= animationProgress) {
        const x = padding + (index / (values.length - 1)) * chartWidth;
        const y = height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(padding + chartWidth * animationProgress, height - padding);
    ctx.closePath();
    ctx.fill();

    // Linha principal
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    values.forEach((value, index) => {
      if (index / values.length <= animationProgress) {
        const x = padding + (index / (values.length - 1)) * chartWidth;
        const y = height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    });

    ctx.stroke();

    // Pontos
    ctx.fillStyle = '#10b981';
    values.forEach((value, index) => {
      if (index / values.length <= animationProgress) {
        const x = padding + (index / (values.length - 1)) * chartWidth;
        const y = height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Labels do eixo X
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    days.forEach((day, index) => {
      const x = padding + (index / (days.length - 1)) * chartWidth;
      ctx.fillText(day, x, height - padding + 35);
    });

    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📅 Vendas nos Últimos 7 Dias', width / 2, 25);
  };

  return (
    <div className="space-y-6">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <Card>
          <CardHeader>
            <CardTitle>Análise FIV vs IA</CardTitle>
          </CardHeader>
          <CardContent>
            <BIPieChart
              salesData={salesData}
              animationProgress={animationProgress}
              pieChartRef={pieChartRef}
            />
          </CardContent>
        </Card>
        {/* Gráfico de Barras permanece igual */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Série</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={barChartRef}
              width={400}
              height={300}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
      {/* Timeline de Vendas em Tempo Real */}
      <SalesTimeline
        salesData={salesData}
        isLive={true}
      />
      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => onSendWhatsApp && onSendWhatsApp()}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          📱 Enviar para Múltiplos Contatos
        </Button>
        <Button
          onClick={startAnimation}
          variant="outline"
          className="px-8 py-3 text-lg"
        >
          🔄 Recarregar Gráficos
        </Button>
      </div>
    </div>
  );
}
