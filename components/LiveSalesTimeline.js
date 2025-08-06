import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import SalesTimeline from "./SalesTimeline";
import RealTimeSalesTracker from "./RealTimeSalesTracker";
import LiveSaleEntry from "./LiveSaleEntry";
import { 
  ClockIcon, 
  PlayIcon, 
  PauseIcon,
  ChartBarIcon 
} from "@heroicons/react/24/outline";

export default function LiveSalesTimeline({ isOpen, onClose }) {
  const [isLive, setIsLive] = useState(true);
  const [salesData, setSalesData] = useState([]);

  // Simular dados de vendas em tempo real
  useEffect(() => {
    // Carregar dados iniciais
    loadSalesData();
    
    // Atualizar dados periodicamente se estiver ao vivo
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        loadSalesData();
      }, 5000); // Atualizar a cada 5 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  const loadSalesData = async () => {
    try {
      console.log('🔄 Carregando dados reais de vendas...');
      
      // Buscar vendas reais do banco
      const salesResponse = await fetch('/api/sales-list');
      const realSales = await salesResponse.json();
      
      console.log('📊 Vendas encontradas:', realSales.length);
      
      if (realSales.length > 0) {
        // Converter vendas reais para formato da timeline
        const timelineData = realSales.map((sale, index) => {
          const saleTime = sale.dataVenda ? new Date(sale.dataVenda) : new Date();
          
          return {
            id: sale.id || index + 1,
            time: saleTime,
            animal: sale.animal?.brinco || sale.animalId || `CJCJ ${15000 + index}`,
            buyer: sale.nomeComprador || sale.buyer || `Comprador ${index + 1}`,
            value: parseFloat(sale.valorVenda) || parseFloat(sale.valor) || 0,
            type: sale.animal?.serie === 'FIV' || Math.random() < 0.15 ? 'FIV' : 'IA',
            serie: sale.animal?.serie || 'CJCJ',
            status: 'completed',
            realSale: true // Marcar como venda real
          };
        });

        console.log('✅ Timeline com dados reais:', timelineData.length);
        setSalesData(timelineData);
      } else {
        console.log('⚠️ Nenhuma venda real encontrada, usando dados de exemplo');
        setSalesData([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar vendas reais:', error);
      // Fallback para dados simulados
      setSalesData([]);
    }
  };

  const generateMockSales = () => {
    const mockSales = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const saleTime = new Date(now.getTime() - Math.random() * 8 * 60 * 60 * 1000); // Últimas 8 horas
      
      mockSales.push({
        id: i + 1,
        time: saleTime,
        animal: `CJCJ ${15000 + i}`,
        buyer: `Comprador ${Math.floor(i / 5) + 1}`,
        value: Math.floor(Math.random() * 50000) + 20000,
        type: Math.random() < 0.15 ? 'FIV' : 'IA',
        serie: ['CJCJ', 'BENT', 'CJCG'][Math.floor(Math.random() * 3)],
        status: 'completed'
      });
    }

    return mockSales.sort((a, b) => a.time - b.time);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-green-600">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                📅 Timeline de Vendas - Sistema
              </h2>
              <p className="text-blue-100">
                Acompanhe as vendas em tempo real
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsLive(!isLive)}
              size="sm"
              className={`${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
            >
              {isLive ? (
                <>
                  <PauseIcon className="h-4 w-4 mr-2" />
                  Pausar Live
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Iniciar Live
                </>
              )}
            </Button>
            
            {isLive && (
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">AO VIVO</span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Formulário de Entrada de Vendas */}
          <LiveSaleEntry 
            onSaleRegistered={(sale) => {
              console.log('Nova venda registrada:', sale);
              // Recarregar dados após nova venda
              setTimeout(() => {
                loadSalesData();
              }, 1000);
            }}
          />
          
          {/* Tracker de Vendas Reais */}
          <div className="mt-6">
            <RealTimeSalesTracker />
          </div>
          
          {/* Timeline Visual */}
          <div className="mt-6">
            <SalesTimeline 
              salesData={salesData}
              isLive={isLive}
            />
          </div>
        </div>
      </div>
    </div>
  );
}