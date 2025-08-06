import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  ShareIcon,
  DocumentArrowDownIcon
} from "@heroicons/react/24/outline";

// Ícones que podem não existir - usando alternativas
const TrophyIcon = ({ className }) => <span className={className}>🏆</span>;
const DevicePhoneMobileIcon = ({ className }) => <span className={className}>📱</span>;
import animalDataManager from "../services/animalDataManager";
// Dados mockados removidos - usando dados reais da API

// Mock WhatsApp API para evitar erros
const WhatsAppAPI = {
  sendInvite: async (data) => {
    console.log('Mock WhatsApp send:', data);
    return { success: true };
  }
};

export default function AuctionManager({ isOpen, onClose, onSalesComplete }) {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [auctionData, setAuctionData] = useState({
    nome: "Sistema de Vendas",
    data: new Date().toISOString().split('T')[0],
    local: "Fazenda",
    tipo: "VENDA"
  });
  const [salesData, setSalesData] = useState({});
  const [activeTab, setActiveTab] = useState('timeline');
  const [showBIModal, setShowBIModal] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [analytics, setAnalytics] = useState({
    fivAnimals: [],
    iaAnimals: [],
    topBulls: [],
    priceAnalysis: {}
  });

  useEffect(() => {
    if (isOpen) {
      loadActiveAnimals();
      generateTimeline();
    }
  }, [isOpen]);

  useEffect(() => {
    if (filteredAnimals.length > 0) {
      analyzeAnimals();
    }
  }, [filteredAnimals, salesData]);

  // Filtrar animais baseado na busca
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAnimals(animals);
    } else {
      const filtered = animals.filter(animal => {
        const searchLower = searchTerm.toLowerCase();
        const serie = animal.serie || extractSerieFromBrinco(animal.brinco);
        return (
          animal.brinco?.toLowerCase().includes(searchLower) ||
          serie?.toLowerCase().includes(searchLower) ||
          animal.raca?.toLowerCase().includes(searchLower) ||
          animal.nome?.toLowerCase().includes(searchLower) ||
          animal.id?.toString().includes(searchLower) // busca por id
        );
      });
      setFilteredAnimals(filtered);
    }
  }, [searchTerm, animals]);

  // Função para extrair série do brinco
  const extractSerieFromBrinco = (brinco) => {
    if (!brinco) return 'CJCJ';
    const match = brinco.match(/^[A-Z]+/);
    return match ? match[0] : 'CJCJ';
  };

  // Gerar timeline do leilão
  const generateTimeline = () => {
    const events = [
      {
        time: '08:00',
        title: 'Abertura do Leilão',
        description: 'Recepção dos participantes e credenciamento',
        status: 'pending',
        icon: '🎪'
      },
      {
        time: '08:30',
        title: 'Apresentação dos Animais',
        description: `${filteredAnimals.length} animais disponíveis para venda`,
        status: 'pending',
        icon: '🐂'
      },
      {
        time: '09:00',
        title: 'Início dos Lances',
        description: 'Primeira categoria: Touros e Reprodutores',
        status: 'pending',
        icon: '🔨'
      },
      {
        time: '10:30',
        title: 'Intervalo',
        description: 'Coffee break e networking',
        status: 'pending',
        icon: '☕'
      },
      {
        time: '11:00',
        title: 'Segunda Rodada',
        description: 'Novilhas e Fêmeas Jovens',
        status: 'pending',
        icon: '🐄'
      },
      {
        time: '14:00',
        title: 'Almoço',
        description: 'Pausa para refeição',
        status: 'pending',
        icon: '🍽️'
      },
      {
        time: '15:00',
        title: 'Rodada Final',
        description: 'Animais FIV e Genética Superior',
        status: 'pending',
        icon: '🧬'
      },
      {
        time: '17:00',
        title: 'Encerramento',
        description: 'Finalização e acerto de contas',
        status: 'pending',
        icon: '🏁'
      }
    ];
    setTimeline(events);
  };

  // Analisar dados dos animais
  const analyzeAnimals = () => {
    const fivAnimals = filteredAnimals.filter(animal =>
      animal.observacoes?.toLowerCase().includes('fiv') ||
      animal.categoria?.toLowerCase().includes('fiv')
    );

    const iaAnimals = filteredAnimals.filter(animal =>
      !animal.observacoes?.toLowerCase().includes('fiv') &&
      !animal.categoria?.toLowerCase().includes('fiv')
    );

    // Análise por touro (pai)
    const bullStats = {};
    filteredAnimals.forEach(animal => {
      if (animal.pai) {
        if (!bullStats[animal.pai]) {
          bullStats[animal.pai] = {
            name: animal.pai,
            count: 0,
            animals: [],
            avgPrice: 0
          };
        }
        bullStats[animal.pai].count++;
        bullStats[animal.pai].animals.push(animal);
      }
    });

    const topBulls = Object.values(bullStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Análise de preços FIV vs IA
    const fivPrices = fivAnimals.map(a => salesData[a.id]?.valor || 0).filter(p => p > 0);
    const iaPrices = iaAnimals.map(a => salesData[a.id]?.valor || 0).filter(p => p > 0);

    const priceAnalysis = {
      fiv: {
        count: fivAnimals.length,
        avgPrice: fivPrices.length > 0 ? fivPrices.reduce((a, b) => a + b, 0) / fivPrices.length : 0,
        maxPrice: fivPrices.length > 0 ? Math.max(...fivPrices) : 0,
        minPrice: fivPrices.length > 0 ? Math.min(...fivPrices) : 0
      },
      ia: {
        count: iaAnimals.length,
        avgPrice: iaPrices.length > 0 ? iaPrices.reduce((a, b) => a + b, 0) / iaPrices.length : 0,
        maxPrice: iaPrices.length > 0 ? Math.max(...iaPrices) : 0,
        minPrice: iaPrices.length > 0 ? Math.min(...iaPrices) : 0
      }
    };

    setAnalytics({
      fivAnimals,
      iaAnimals,
      topBulls,
      priceAnalysis
    });
  };

  // Gerar relatório BI
  const generateBIReport = () => {
    const totalAnimals = filteredAnimals.length;
    const soldAnimals = Object.keys(salesData).length;
    const totalRevenue = Object.values(salesData).reduce((sum, sale) => sum + (sale.valor || 0), 0);

    return {
      summary: {
        totalAnimals,
        soldAnimals,
        totalRevenue,
        avgPrice: soldAnimals > 0 ? totalRevenue / soldAnimals : 0,
        saleRate: totalAnimals > 0 ? (soldAnimals / totalAnimals) * 100 : 0
      },
      fivVsIa: analytics.priceAnalysis,
      topBulls: analytics.topBulls,
      timeline: timeline
    };
  };

  // Enviar BI via WhatsApp
  const sendBIReport = async (phoneNumber) => {
    try {
      const report = generateBIReport();

      const message = `
📋 *RELATÓRIO DE VENDAS - BI*

📊 *RESUMO GERAL*
• Total de Animais: ${report.summary.totalAnimals}
• Animais Vendidos: ${report.summary.soldAnimals}
• Taxa de Venda: ${report.summary.saleRate.toFixed(1)}%
• Receita Total: R$ ${report.summary.totalRevenue.toLocaleString('pt-BR')}
• Preço Médio: R$ ${report.summary.avgPrice.toLocaleString('pt-BR')}

🧬 *ANÁLISE FIV vs IA*
• FIV: ${report.fivVsIa.fiv.count} animais - Média: R$ ${report.fivVsIa.fiv.avgPrice.toLocaleString('pt-BR')}
• IA: ${report.fivVsIa.ia.count} animais - Média: R$ ${report.fivVsIa.ia.avgPrice.toLocaleString('pt-BR')}

🏆 *TOP TOUROS (Mais Filhos)*
${report.topBulls.slice(0, 3).map((bull, i) =>
        `${i + 1}. ${bull.name}: ${bull.count} filhos`
      ).join('\n')}

⏰ *CRONOGRAMA*
• 08:00 - Abertura
• 09:00 - Início dos Lances
• 15:00 - Animais FIV
• 17:00 - Encerramento

*Beef Sync* - Gestão Bovina Inteligente 🐂
      `;

      // Abrir WhatsApp Web com a mensagem
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      alert('✅ Relatório BI enviado!\n\nO WhatsApp Web foi aberto com o relatório pronto para enviar.');
    } catch (error) {
      console.error('Erro ao enviar BI:', error);
      alert('Erro ao enviar relatório BI');
    }
  };

  const loadActiveAnimals = async () => {
    try {
      setLoading(true);

      // Usar API real para buscar animais (sem autenticação por enquanto)
      const response = await fetch('/api/animals');

      if (response.ok) {
        const animalsData = await response.json();
        console.log('Animais carregados da API:', animalsData);

        // Filtrar apenas animais ativos
        const activeAnimals = animalsData.filter(animal =>
          animal.status === 'ATIVO' || !animal.status || animal.status === 'ativo'
        );

        console.log('Animais ativos filtrados:', activeAnimals);

        // Inicializar salesData para cada animal
        const initialSalesData = {};
        activeAnimals.forEach(animal => {
          initialSalesData[animal.id] = {
            selected: false,
            valor: ''
          };
        });

        setAnimals(activeAnimals);
        setFilteredAnimals(activeAnimals);
        setSalesData(initialSalesData);
      } else {
        console.error('Erro ao carregar animais da API:', response.status);
        // Sem dados se API falhar
        const animalsData = [];
        const initialSalesData = {};
        animalsData.forEach(animal => {
          initialSalesData[animal.id] = {
            selected: false,
            valor: ''
          };
        });
        setAnimals(animalsData);
        setFilteredAnimals(animalsData);
        setSalesData(initialSalesData);
      }
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      // Sem dados em caso de erro
      const animalsData = [];
      const initialSalesData = {};
      animalsData.forEach(animal => {
        initialSalesData[animal.id] = {
          selected: false,
          valor: ''
        };
      });
      setAnimals(animalsData);
      setFilteredAnimals(animalsData);
      setSalesData(initialSalesData);
    } finally {
      setLoading(false);
    }
  };

  const handleAnimalToggle = (animalId) => {
    setSalesData(prev => ({
      ...prev,
      [animalId]: {
        ...prev[animalId],
        selected: !prev[animalId].selected
      }
    }));
  };

  const handleValueChange = (animalId, valor) => {
    setSalesData(prev => ({
      ...prev,
      [animalId]: {
        ...prev[animalId],
        valor: valor,
        selected: valor ? true : prev[animalId].selected
      }
    }));
  };

  const getSelectedAnimals = () => {
    const selected = Object.entries(salesData)
      .filter(([id, data]) => data.selected && data.valor)
      .map(([id, data]) => ({
        animalId: id,
        animal: animals.find(a => a.id === id),
        valor: parseFloat(data.valor)
      }));

    console.log('🔍 Animais selecionados:', selected);
    console.log('📊 SalesData atual:', salesData);

    return selected;
  };

  const handleSaveAuction = async () => {
    console.log('🔄 Iniciando salvamento de vendas...');
    const selectedSales = getSelectedAnimals();
    console.log('📋 Vendas selecionadas:', selectedSales);

    if (selectedSales.length === 0) {
      alert('Selecione pelo menos um animal e informe o valor de venda');
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Salvando vendas no banco...');

      // Salvar vendas no banco de dados
      const salesPromises = selectedSales.map(sale => {
        console.log(`🔄 Salvando animal ${sale.animalId} com valor ${sale.valor}`);
        return fetch('/api/animals/' + sale.animalId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'VENDIDO',
            valorVenda: sale.valor,
            dataVenda: new Date().toISOString()
          })
        });
      });

      const responses = await Promise.all(salesPromises);
      console.log('✅ Respostas da API:', responses);

      // Verificar se todas as vendas foram salvas
      const allSuccessful = responses.every(response => response.ok);
      if (!allSuccessful) {
        throw new Error('Algumas vendas não puderam ser salvas');
      }

      // Gerar relatório de vendas
      const report = generateBIReport();
      console.log('📊 Relatório gerado:', report);

      // Mostrar resumo das vendas
      const totalRevenue = selectedSales.reduce((sum, sale) => sum + sale.valor, 0);
      const avgPrice = totalRevenue / selectedSales.length;

      alert(`✅ Vendas registradas com sucesso!

📊 RESUMO:
• ${selectedSales.length} animais vendidos
• Receita total: R$ ${totalRevenue.toLocaleString('pt-BR')}
• Preço médio: R$ ${avgPrice.toLocaleString('pt-BR')}

📋 Relatórios disponíveis na aba "Relatórios"
📱 Use "Enviar BI" para compartilhar via WhatsApp`);

      // Atualizar dados locais
      const updatedAnimals = animals.map(animal => {
        const sale = selectedSales.find(s => s.animalId === animal.id);
        if (sale) {
          return { ...animal, status: 'VENDIDO', valorVenda: sale.valor };
        }
        return animal;
      });

      setAnimals(updatedAnimals);
      setFilteredAnimals(updatedAnimals);

      // Limpar seleções
      setSalesData({});

      if (onSalesComplete) {
        onSalesComplete();
      }

      onClose();
    } catch (error) {
      console.error('❌ Erro ao salvar vendas:', error);
      alert('Erro ao salvar vendas: ' + error.message);
    } finally {
      setSaving(false);
    }
  };



  const totalValue = getSelectedAnimals().reduce((sum, sale) => sum + sale.valor, 0);
  const selectedCount = getSelectedAnimals().length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="flex items-center space-x-3">
            <CurrencyDollarIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">📋 Sistema de Vendas e NF</h2>
              <p className="text-green-100">Gestão de Vendas, Preços, Compradores e Notas Fiscais</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBIModal(true)}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Enviar BI
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {[
            { id: 'timeline', label: 'Cronograma', icon: ClockIcon },
            { id: 'analytics', label: 'Análises', icon: ChartBarIcon },
            { id: 'animals', label: 'Animais', icon: CurrencyDollarIcon },
            { id: 'reports', label: 'Relatórios', icon: DocumentArrowDownIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ⏰ Cronograma do Leilão
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Acompanhe a programação completa do evento
                </p>
              </div>

              <div className="relative">
                {timeline.map((event, index) => (
                  <div key={index} className="flex items-start mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-2xl">
                      {event.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📊 Análises do Leilão
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Insights e estatísticas dos animais
                </p>
              </div>

              {/* FIV vs IA Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                    🧬 Animais FIV
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Quantidade:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {analytics.priceAnalysis.fiv?.count || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Preço Médio:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        R$ {(analytics.priceAnalysis.fiv?.avgPrice || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Maior Valor:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        R$ {(analytics.priceAnalysis.fiv?.maxPrice || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                    🐄 Animais IA
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Quantidade:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {analytics.priceAnalysis.ia?.count || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Preço Médio:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        R$ {(analytics.priceAnalysis.ia?.avgPrice || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Maior Valor:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        R$ {(analytics.priceAnalysis.ia?.maxPrice || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Bulls */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  🏆 Top Touros (Mais Filhos no Leilão)
                </h4>
                <div className="space-y-3">
                  {analytics.topBulls.length > 0 ? analytics.topBulls.map((bull, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {bull.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Touro reprodutor
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 dark:text-blue-400">
                          {bull.count} filhos
                        </div>
                        <div className="text-sm text-gray-500">
                          no leilão
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <div className="text-2xl mb-2">🐂</div>
                      <p>Nenhum dado de touro disponível</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Resumo */}
          {selectedCount > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{selectedCount}</span> animais selecionados
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Valor total: <span className="font-bold text-green-600 dark:text-green-400">
                      R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSaveAuction}
                  disabled={saving || selectedCount === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? '💾 Salvando...' : '💾 Registrar Leilão'}
                </button>
              </div>
            </div>
          )}

          {/* Lista de Animais */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando animais...</p>
              </div>
            ) : animals.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">🐄</div>
                <p>Nenhum animal ativo encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Campo de Busca */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="🔍 Buscar por brinco, série, raça ou nome..."
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Contador de Resultados */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    {searchTerm ? (
                      <span>
                        {filteredAnimals.length} de {animals.length} animais encontrados
                        {searchTerm && <span className="ml-2 font-medium">para "{searchTerm}"</span>}
                      </span>
                    ) : (
                      <span>{animals.length} animais ativos disponíveis</span>
                    )}
                  </div>
                  <div>
                    💡 <strong>Dica:</strong> Marque os animais vendidos e informe o valor
                  </div>
                </div>

                {/* Lista de Animais Filtrados */}
                <div className="space-y-3">
                  {filteredAnimals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-2">🔍</div>
                      <p>Nenhum animal encontrado para "{searchTerm}"</p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Limpar busca
                      </button>
                    </div>
                  ) : (
                    filteredAnimals.map((animal) => (
                      <div
                        key={animal.id}
                        className={`border rounded-lg p-4 transition-all ${salesData[animal.id]?.selected
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={salesData[animal.id]?.selected || false}
                            onChange={() => handleAnimalToggle(animal.id)}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />

                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">
                                {animal.sexo === 'Macho' ? '🐂' : '🐄'}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {animal.serie || extractSerieFromBrinco(animal.brinco)} {animal.brinco}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {animal.raca} • {animal.sexo} • {animal.categoria || 'Bezerro'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Custo Total</div>
                              <div className="font-medium text-red-600 dark:text-red-400">
                                R$ {(animal.costs?.reduce((sum, cost) => sum + (cost.valor || 0), 0) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                            </div>

                            <div className="w-32">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Valor Venda
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={salesData[animal.id]?.valor || ''}
                                onChange={(e) => handleValueChange(animal.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-right"
                                placeholder="0,00"
                              />
                            </div>

                            {salesData[animal.id]?.valor && (
                              <div className="text-right">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Resultado</div>
                                <div className={`font-bold ${(parseFloat(salesData[animal.id].valor) - (animal.costs?.reduce((sum, cost) => sum + (cost.valor || 0), 0) || 0)) >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                                  }`}>
                                  R$ {(parseFloat(salesData[animal.id].valor) - (animal.costs?.reduce((sum, cost) => sum + (cost.valor || 0), 0) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                💡 Os animais vendidos terão status alterado para "VENDIDO" automaticamente
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAuction}
                  disabled={saving || selectedCount === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? '💾 Salvando...' : `💾 Registrar ${selectedCount} Vendas`}
                </button>
              </div>
            </div>
          </div>
          {activeTab === 'animals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  🐄 Animais do Leilão
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredAnimals.length} animais disponíveis
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="🔍 Buscar animais..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Animals List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAnimals.map(animal => {
                  const serie = animal.serie || extractSerieFromBrinco(animal.brinco);
                  const saleData = salesData[animal.id] || {};

                  return (
                    <div key={animal.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={saleData.selected || false}
                            onChange={() => handleAnimalToggle(animal.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {serie} {animal.brinco}
                            </div>
                            <div className="text-sm text-gray-500">
                              {animal.raca} • {animal.sexo} • {animal.categoria}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="number"
                            value={saleData.valor || ''}
                            onChange={(e) => handleValueChange(animal.id, e.target.value)}
                            className="w-32 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Valor R$"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              {getSelectedAnimals().length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {getSelectedAnimals().length} animais selecionados
                      </span>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Valor total: R$ {getSelectedAnimals().reduce((sum, sale) => sum + sale.valor, 0).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <button
                      onClick={handleSaveAuction}
                      disabled={saving}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? '💾 Salvando...' : '💾 Registrar Vendas'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📋 Relatórios do Leilão
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Resumos e estatísticas para compartilhar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📊 Resumo Executivo
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total de Animais:</span>
                      <span className="font-bold">{animals.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Animais Ativos:</span>
                      <span className="font-bold text-green-600">{animals.filter(a => a.status === 'ATIVO').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Animais Vendidos:</span>
                      <span className="font-bold text-blue-600">{animals.filter(a => a.status === 'VENDIDO').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Receita Total:</span>
                      <span className="font-bold text-green-600">
                        R$ {animals.filter(a => a.status === 'VENDIDO').reduce((sum, a) => sum + (a.valorVenda || 0), 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📱 Compartilhar BI
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Envie relatórios detalhados via WhatsApp para compradores e interessados
                  </p>
                  <button
                    onClick={() => setShowBIModal(true)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <DevicePhoneMobileIcon className="h-4 w-4 mr-2" />
                    Enviar BI via WhatsApp
                  </button>
                </div>
              </div>

              {/* Lista de Vendas */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  💰 Vendas Realizadas
                </h4>
                <div className="space-y-3">
                  {animals.filter(a => a.status === 'VENDIDO').length > 0 ? (
                    animals.filter(a => a.status === 'VENDIDO').map(animal => (
                      <div key={animal.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">🐂</div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {animal.serie} {animal.brinco}
                            </div>
                            <div className="text-sm text-gray-500">
                              {animal.raca} • {animal.sexo}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            R$ {(animal.valorVenda || 0).toLocaleString('pt-BR')}
                          </div>
                          <div className="text-sm text-gray-500">
                            Vendido
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <div className="text-2xl mb-2">💰</div>
                      <p>Nenhuma venda registrada ainda</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BI Modal */}
        {showBIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📱 Enviar BI via WhatsApp
                  </h3>
                  <button
                    onClick={() => setShowBIModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número do WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="+55 11 99999-9999"
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      O relatório incluirá:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Resumo geral do leilão</li>
                      <li>• Análise FIV vs IA com preços</li>
                      <li>• Top touros com mais filhos</li>
                      <li>• Cronograma do evento</li>
                      <li>• Gráficos otimizados para celular</li>
                    </ul>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowBIModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        const phone = document.getElementById('whatsappNumber').value;
                        if (phone) {
                          sendBIReport(phone);
                          setShowBIModal(false);
                        } else {
                          alert('Por favor, informe o número do WhatsApp');
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enviar BI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
