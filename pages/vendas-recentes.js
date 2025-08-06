import { useState, useEffect } from 'react';

export default function VendasRecentes() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarVendasRecentes();
  }, []);

  const carregarVendasRecentes = async () => {
    try {
      const response = await fetch('/api/sales-list');
      const todasVendas = await response.json();

      // Pegar as 5 vendas mais recentes
      const vendasRecentes = todasVendas.slice(0, 5);
      setVendas(vendasRecentes);

      console.log('📊 Vendas encontradas:', vendasRecentes.length);
    } catch (error) {
      console.error('❌ Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Componente do Gráfico de Linha
  const GraficoLinha = ({ vendas }) => {
    if (vendas.length === 0) return null;

    // Preparar dados para o gráfico
    const dadosGrafico = vendas.map((venda, index) => ({
      x: index,
      y: venda.valor || 0,
      label: venda.animal?.brinco || `Venda ${index + 1}`,
      data: venda.createdAt
    })).reverse(); // Reverter para mostrar cronologicamente

    const maxValor = Math.max(...dadosGrafico.map(d => d.y));
    const minValor = Math.min(...dadosGrafico.map(d => d.y));
    const amplitude = maxValor - minValor;

    // Função para calcular posição Y no SVG (invertida)
    const calcularY = (valor) => {
      if (amplitude === 0) return 150; // Linha reta se todos valores iguais
      return 50 + ((maxValor - valor) / amplitude) * 200; // 50-250 range
    };

    // Gerar pontos da linha
    const pontos = dadosGrafico.map((d, i) => {
      const x = 50 + (i * (500 / Math.max(dadosGrafico.length - 1, 1)));
      const y = calcularY(d.y);
      return { x, y, ...d };
    });

    // Criar path da linha
    const pathData = pontos.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          📈 Gráfico de Variação dos Preços
        </h2>

        <div className="relative">
          <svg width="600" height="300" className="w-full h-auto">
            {/* Grid de fundo */}
            <defs>
              <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Linha do gráfico */}
            <path
              d={pathData}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              className="drop-shadow-sm"
            />

            {/* Área sob a linha (gradiente) */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
              </linearGradient>
            </defs>
            <path
              d={`${pathData} L ${pontos[pontos.length-1]?.x || 0} 250 L ${pontos[0]?.x || 0} 250 Z`}
              fill="url(#areaGradient)"
            />

            {/* Pontos da linha */}
            {pontos.map((ponto, i) => (
              <g key={i}>
                {/* Círculo do ponto */}
                <circle
                  cx={ponto.x}
                  cy={ponto.y}
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-sm hover:r-8 transition-all cursor-pointer"
                />

                {/* Tooltip no hover */}
                <g className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <rect
                    x={ponto.x - 40}
                    y={ponto.y - 35}
                    width="80"
                    height="25"
                    fill="#1f2937"
                    rx="4"
                    className="drop-shadow-lg"
                  />
                  <text
                    x={ponto.x}
                    y={ponto.y - 18}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {formatarValor(ponto.y)}
                  </text>
                </g>

                {/* Label do animal */}
                <text
                  x={ponto.x}
                  y={270}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="10"
                  className="dark:fill-gray-400"
                >
                  {ponto.label}
                </text>
              </g>
            ))}

            {/* Eixo Y - valores */}
            <g>
              <text x="20" y="60" fill="#6b7280" fontSize="12" className="dark:fill-gray-400">
                {formatarValor(maxValor)}
              </text>
              <text x="20" y="155" fill="#6b7280" fontSize="12" className="dark:fill-gray-400">
                {formatarValor((maxValor + minValor) / 2)}
              </text>
              <text x="20" y="245" fill="#6b7280" fontSize="12" className="dark:fill-gray-400">
                {formatarValor(minValor)}
              </text>
            </g>
          </svg>
        </div>

        {/* Estatísticas do gráfico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatarValor(maxValor)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Maior Valor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatarValor(dadosGrafico.reduce((sum, d) => sum + d.y, 0) / dadosGrafico.length)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Valor Médio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatarValor(minValor)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Menor Valor</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">🔄 Carregando vendas...</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💰 5 Vendas Mais Recentes</h1>

      {/* Gráfico de Linha */}
      <GraficoLinha vendas={vendas} />

      {vendas.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-600">Nenhuma venda encontrada</h2>
          <p className="text-gray-500 mt-2">Ainda não há vendas registradas no sistema.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendas.map((venda, index) => (
            <div key={venda.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{venda.animal?.sexo === 'Macho' ? '🐂' : '🐄'}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {venda.animal?.brinco || `Animal ${venda.animalId}`}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {venda.animal?.nome || 'Nome não informado'} • {venda.animal?.raca || 'Raça não informada'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">👤 Comprador:</span>
                      <p className="text-gray-900 dark:text-white">{venda.comprador || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">📅 Data/Hora:</span>
                      <p className="text-gray-900 dark:text-white font-mono">{formatarData(venda.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">💳 Pagamento:</span>
                      <p className="text-gray-900 dark:text-white">{venda.formaPagamento || 'Não informado'}</p>
                    </div>
                  </div>

                  {venda.observacoes && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">📝 Observações:</span>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{venda.observacoes}</p>
                    </div>
                  )}
                </div>

                <div className="text-right ml-6">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatarValor(venda.valor)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Venda #{index + 1}
                  </div>
                  {venda.saleEvent && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      📍 {venda.saleEvent.nome}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={carregarVendasRecentes}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Atualizar Vendas
        </button>
      </div>
    </div>
  );
}
