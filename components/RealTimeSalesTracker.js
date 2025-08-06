import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import AuctionCalculator from "./AuctionCalculator";

export default function RealTimeSalesTracker() {
  const [realSales, setRealSales] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Monitorar vendas reais a cada 2 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      await loadRealSales();
    }, 2000);

    // Carregar dados iniciais
    loadRealSales();

    return () => clearInterval(interval);
  }, []);

  const loadRealSales = async () => {
    try {
      const response = await fetch('/api/sales-list');
      const sales = await response.json();
      
      if (sales.length > 0) {
        // Processar vendas reais
        const processedSales = sales.map(sale => ({
          id: sale.id,
          animal: sale.animal?.brinco || sale.animalId,
          value: parseFloat(sale.valorVenda) || parseFloat(sale.valor) || 0,
          time: new Date(sale.dataVenda || sale.createdAt),
          buyer: sale.nomeComprador || 'Comprador',
          status: 'completed'
        }));

        // Calcular totais
        const total = processedSales.reduce((sum, sale) => sum + sale.value, 0);
        const average = processedSales.length > 0 ? total / processedSales.length : 0;

        setRealSales(processedSales);
        setTotalValue(total);
        setAveragePrice(average);
        setLastUpdate(new Date());

        console.log(`📊 ${processedSales.length} vendas reais carregadas. Total: R$ ${total.toLocaleString('pt-BR')}`);
      }
    } catch (error) {
      console.error('Erro ao carregar vendas reais:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{realSales.length}</div>
              <div className="text-green-100">Vendas Reais</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                R$ {(totalValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-blue-100">Receita Total</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                R$ {(averagePrice / 1000).toFixed(0)}k
              </div>
              <div className="text-purple-100">Preço Médio</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold">
                {lastUpdate.toLocaleTimeString('pt-BR')}
              </div>
              <div className="text-orange-100">Última Atualização</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Vendas Reais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>💰 Vendas Registradas em Tempo Real</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-semibold">MONITORANDO</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {realSales.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">⏳</div>
                <div>Aguardando vendas reais...</div>
                <div className="text-sm mt-2">
                  As vendas aparecerão aqui automaticamente quando você registrá-las
                </div>
              </div>
            ) : (
              realSales.slice().reverse().map((sale, index) => (
                <div
                  key={sale.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    index === 0 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-bold text-lg">{sale.animal}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {sale.time.toLocaleTimeString('pt-BR')} - {sale.buyer}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {sale.value.toLocaleString('pt-BR')}
                    </div>
                    {index === 0 && (
                      <div className="text-sm text-green-500 font-semibold">
                        ✨ NOVA VENDA
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calculadora Avançada do Leilão */}
      <AuctionCalculator currentSales={realSales} />
    </div>
  );
}