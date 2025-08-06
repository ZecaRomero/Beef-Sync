import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { 
  ClockIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon
} from "@heroicons/react/24/outline";

export default function SalesTimeline({ salesData = [], isLive = false }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timelineData, setTimelineData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(isLive);
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Simular dados de vendas em tempo real
  useEffect(() => {
    generateTimelineData();
  }, [salesData, selectedTimeRange]);

  // Atualizar tempo atual
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(new Date());
        // Simular novas vendas ocasionalmente
        if (Math.random() < 0.1) { // 10% chance a cada segundo
          addNewSale();
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Redesenhar timeline quando dados mudam
  useEffect(() => {
    drawTimeline();
  }, [timelineData, currentTime]);

  const generateTimelineData = () => {
    const now = new Date();
    const timeline = [];
    
    // Horários do leilão
    const leilaoStart = new Date(now);
    leilaoStart.setHours(8, 0, 0, 0); // 08:00
    
    const leilaoEnd = new Date(now);
    leilaoEnd.setHours(17, 0, 0, 0); // 17:00

    // Gerar vendas ao longo do dia
    const totalMinutes = (leilaoEnd - leilaoStart) / (1000 * 60);
    const salesCount = salesData.length || 98;
    
    for (let i = 0; i < salesCount; i++) {
      const randomMinute = Math.floor(Math.random() * totalMinutes);
      const saleTime = new Date(leilaoStart.getTime() + randomMinute * 60 * 1000);
      
      // Concentrar mais vendas em horários específicos
      let intensity = 1;
      const hour = saleTime.getHours();
      
      if (hour >= 9 && hour <= 11) intensity = 3; // Manhã ativa
      if (hour >= 14 && hour <= 16) intensity = 4; // Tarde ativa
      if (hour >= 15 && hour <= 15.5) intensity = 5; // Pico FIV
      
      if (Math.random() < intensity / 5) {
        timeline.push({
          id: i + 1,
          time: saleTime,
          animal: `CJCJ ${15000 + i}`,
          buyer: `Comprador ${Math.floor(i / 5) + 1}`,
          value: Math.floor(Math.random() * 50000) + 20000,
          type: Math.random() < 0.1 ? 'FIV' : 'IA',
          serie: ['CJCJ', 'BENT', 'CJCG'][Math.floor(Math.random() * 3)],
          status: saleTime <= now ? 'completed' : 'pending'
        });
      }
    }

    // Ordenar por tempo
    timeline.sort((a, b) => a.time - b.time);
    setTimelineData(timeline);
  };

  const addNewSale = () => {
    const newSale = {
      id: timelineData.length + 1,
      time: new Date(),
      animal: `CJCJ ${15000 + timelineData.length}`,
      buyer: `Comprador ${Math.floor(timelineData.length / 5) + 1}`,
      value: Math.floor(Math.random() * 50000) + 20000,
      type: Math.random() < 0.1 ? 'FIV' : 'IA',
      serie: ['CJCJ', 'BENT', 'CJCG'][Math.floor(Math.random() * 3)],
      status: 'completed'
    };

    setTimelineData(prev => [...prev, newSale].sort((a, b) => a.time - b.time));
  };

  const drawTimeline = () => {
    const canvas = canvasRef.current;
    if (!canvas || timelineData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Configurações
    const padding = 60;
    const timelineHeight = height - 2 * padding;
    const timelineWidth = width - 2 * padding;

    // Horários do leilão (8h às 17h)
    const startHour = 8;
    const endHour = 17;
    const totalHours = endHour - startHour;

    // Desenhar linha principal da timeline
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Desenhar marcadores de hora
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';

    for (let hour = startHour; hour <= endHour; hour++) {
      const y = padding + ((hour - startHour) / totalHours) * timelineHeight;
      
      // Linha de hora
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Label da hora
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`${hour}:00`, padding - 10, y + 4);
    }

    // Desenhar vendas na timeline
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    timelineData.forEach((sale, index) => {
      const saleHour = sale.time.getHours() + sale.time.getMinutes() / 60;
      
      if (saleHour >= startHour && saleHour <= endHour) {
        const y = padding + ((saleHour - startHour) / totalHours) * timelineHeight;
        const x = padding + 20 + (index % 10) * 15; // Espalhar horizontalmente

        // Cor baseada no tipo
        const color = sale.type === 'FIV' ? '#10b981' : '#3b82f6';
        const isCompleted = sale.status === 'completed';
        const isPending = saleHour > currentHour;

        // Círculo da venda
        ctx.fillStyle = isPending ? '#d1d5db' : color;
        ctx.beginPath();
        ctx.arc(x, y, isCompleted ? 6 : 4, 0, 2 * Math.PI);
        ctx.fill();

        // Borda para vendas concluídas
        if (isCompleted) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Linha conectora
        ctx.strokeStyle = isPending ? '#d1d5db' : color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(x - 6, y);
        ctx.stroke();

        // Tooltip no hover (simplificado)
        if (index < 5) { // Mostrar apenas os primeiros 5 para não poluir
          ctx.fillStyle = '#1f2937';
          ctx.font = '10px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(
            `${sale.animal} - R$ ${(sale.value / 1000).toFixed(0)}k`,
            x + 10,
            y - 5
          );
        }
      }
    });

    // Indicador de tempo atual
    if (currentHour >= startHour && currentHour <= endHour) {
      const currentY = padding + ((currentHour - startHour) / totalHours) * timelineHeight;
      
      // Linha vermelha do tempo atual
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(padding - 10, currentY);
      ctx.lineTo(width - padding, currentY);
      ctx.stroke();

      // Indicador "AGORA"
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('AGORA', width - padding - 50, currentY - 5);
    }

    // Título
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📅 Timeline de Vendas - Sistema', width / 2, 25);

    // Legenda
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    // FIV
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(width - 150, height - 40, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.fillText('FIV', width - 135, height - 35);

    // IA
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(width - 100, height - 40, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.fillText('IA', width - 85, height - 35);

    // Pendente
    ctx.fillStyle = '#d1d5db';
    ctx.beginPath();
    ctx.arc(width - 50, height - 40, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.fillText('Pendente', width - 35, height - 35);
  };

  // Estatísticas em tempo real
  const completedSales = timelineData.filter(s => s.status === 'completed');
  const totalValue = completedSales.reduce((sum, sale) => sum + sale.value, 0);
  const avgValue = completedSales.length > 0 ? totalValue / completedSales.length : 0;
  const fivSales = completedSales.filter(s => s.type === 'FIV').length;
  const iaSales = completedSales.filter(s => s.type === 'IA').length;

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
              <span>Timeline de Vendas em Tempo Real</span>
              {isLive && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-semibold">AO VIVO</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="sm"
                variant={isPlaying ? "default" : "outline"}
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentTime.toLocaleTimeString('pt-BR')}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{completedSales.length}</div>
                <div className="text-green-100">Vendas Realizadas</div>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  R$ {(totalValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-blue-100">Receita Total</div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  R$ {(avgValue / 1000).toFixed(0)}k
                </div>
                <div className="text-purple-100">Preço Médio</div>
              </div>
              <UserGroupIcon className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold">FIV: {fivSales} | IA: {iaSales}</div>
              <div className="text-orange-100">Distribuição</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Visual */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Timeline Visual - 08:00 às 17:00</CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg"
          />
        </CardContent>
      </Card>

      {/* Últimas Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>🕐 Últimas Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {completedSales.slice(-10).reverse().map((sale, index) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    sale.type === 'FIV' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <div className="font-semibold">{sale.animal}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {sale.time.toLocaleTimeString('pt-BR')} - {sale.buyer}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    R$ {sale.value.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-500">{sale.type}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}