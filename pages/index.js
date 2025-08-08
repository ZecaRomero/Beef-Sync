import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import ModernDashboard from "../components/ModernDashboard";
import AuctionManager from "../components/AuctionManager";
import SimpleAnimalManager from "../components/SimpleAnimalManager";
import DirectInvoiceManager from "../components/DirectInvoiceManager";
import BIChartsVisual from "../components/BIChartsVisual";
import WhatsAppMultiSender from "../components/WhatsAppMultiSender";
import LiveSalesTimeline from "../components/LiveSalesTimeline";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [showAuctionManager, setShowAuctionManager] = useState(false);
  const [showDirectInvoice, setShowDirectInvoice] = useState(false);
  const [showAnimalManager, setShowAnimalManager] = useState(false);
  const [showBIDashboard, setShowBIDashboard] = useState(false);
  const [showWhatsAppMulti, setShowWhatsAppMulti] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showManejoModal, setShowManejoModal] = useState(false);
  const [showComercialModal, setShowComercialModal] = useState(false);
  const [showBoletimModal, setShowBoletimModal] = useState(false);
  const [showNascimentosModal, setShowNascimentosModal] = useState(false);
  const [showMortesModal, setShowMortesModal] = useState(false);
  const [showFIVModal, setShowFIVModal] = useState(false);
  const [showVacinacaoModal, setShowVacinacaoModal] = useState(false);
  const [showSaudeModal, setShowSaudeModal] = useState(false);
  const [showRelatoriosModal, setShowRelatoriosModal] = useState(false);
  const [showTransferenciasModal, setShowTransferenciasModal] = useState(false);
  // Estados para modais COMERCIAL
  const [showGestaoVendasModal, setShowGestaoVendasModal] = useState(false);
  const [showVendaDiretaModal, setShowVendaDiretaModal] = useState(false);
  const [showLeilaoModal, setShowLeilaoModal] = useState(false);
  const [showVendaAbateModal, setShowVendaAbateModal] = useState(false);
  const [showVendaDescarteModal, setShowVendaDescarteModal] = useState(false);
  const [showRelatorioDetalhadoModal, setShowRelatorioDetalhadoModal] =
    useState(false);
  const [showEstadoDetalheModal, setShowEstadoDetalheModal] = useState(false);
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);
  const [showRelatoriosVendasModal, setShowRelatoriosVendasModal] =
    useState(false);
  const [showControleFinanceiroModal, setShowControleFinanceiroModal] =
    useState(false);
  const [showAnalyticsBIModal, setShowAnalyticsBIModal] = useState(false);
  const [showMetasVendasModal, setShowMetasVendasModal] = useState(false);
  const [showNotasFiscaisModal, setShowNotasFiscaisModal] = useState(false);
  const [showClientesModal, setShowClientesModal] = useState(false);
  const [showWhatsAppBusinessModal, setShowWhatsAppBusinessModal] =
    useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Debug - verificar usuário
  console.log("Usuário atual:", user);
  console.log("Role do usuário:", user?.role);
  console.log("É visitante?", user && user.role === "visitor");
  console.log("É desenvolvedor?", user && user.role === "developer");

  // Dados reais serão carregados da API
  const salesData = [];

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Se não há usuário, mostrar loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Modal MANEJO
  const ManejoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const manejoOptions = [
      {
        icon: "🐮",
        title: "Nascimentos",
        desc: "Registro de novos nascimentos",
      },
      { icon: "📋", title: "Boletim de Gado", desc: "Relatórios do rebanho" },
      { icon: "💀", title: "Controle de Mortes", desc: "Registro de óbitos" },
      { icon: "🧬", title: "Programa FIV", desc: "Fertilização in vitro" },
      { icon: "💉", title: "Vacinação", desc: "Controle de vacinas" },
      { icon: "🏥", title: "Saúde Animal", desc: "Monitoramento veterinário" },
      { icon: "📊", title: "Relatórios", desc: "Análises de manejo" },
      { icon: "🔄", title: "Transferências", desc: "Movimentação de animais" },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="text-3xl md:text-4xl">🐄</div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  MANEJO
                </h2>
                <p className="text-green-100 text-sm md:text-base">
                  Gestão completa do rebanho
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {manejoOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (option.title === "Boletim de Gado") {
                      setShowBoletimModal(true);
                      // NÃO fecha o modal MANEJO
                    } else if (option.title === "Nascimentos") {
                      setShowNascimentosModal(true);
                      // NÃO fecha o modal MANEJO
                    } else if (option.title === "Controle de Mortes") {
                      setShowMortesModal(true);
                      // NÃO fecha o modal MANEJO
                    } else if (option.title === "Programa FIV") {
                      setShowFIVModal(true);
                      // NÃO fecha o modal MANEJO
                    } else if (option.title === "Vacinação") {
                      setShowVacinacaoModal(true);
                      // NÃO fecha o modal MANEJO
                    } else if (option.title === "Saúde Animal") {
                      setShowSaudeModal(true);
                      // NÃO fecha o modal MANEJO
                    } else if (option.title === "Relatórios") {
                      setShowRelatoriosModal(true);
                      // NÃO fecha o modal MANEJO
                    } else if (option.title === "Transferências") {
                      setShowTransferenciasModal(true);
                      // NÃO fecha o modal MANEJO
                    }
                  }}
                  className="p-4 md:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                      {option.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {option.desc}
                    </p>
                    <div className="mt-3 text-xs text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Clique para mais detalhes
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-center text-blue-700 dark:text-blue-300">
                💡 <strong>Demonstração:</strong> Estas funcionalidades estão
                disponíveis na versão completa do sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal COMERCIAL
  const ComercialModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const comercialOptions = [
      {
        icon: "💼",
        title: "Gestão de Vendas",
        desc: "Todos os tipos de venda",
      },
      {
        icon: "📈",
        title: "Relatórios de Vendas",
        desc: "Análises comerciais",
      },
      { icon: "💰", title: "Controle Financeiro", desc: "Receitas e despesas" },
      { icon: "📊", title: "Analytics BI", desc: "Inteligência de negócios" },
      {
        icon: "🎯",
        title: "Metas de Vendas",
        desc: "Acompanhamento de objetivos",
      },
      { icon: "📋", title: "Notas Fiscais", desc: "Emissão de documentos" },
      { icon: "👥", title: "Clientes", desc: "Gestão de compradores" },
      { icon: "📱", title: "WhatsApp Business", desc: "Comunicação comercial" },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="text-3xl md:text-4xl">💰</div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  COMERCIAL
                </h2>
                <p className="text-blue-100 text-sm md:text-base">
                  Vendas e relatórios financeiros
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {comercialOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (option.title === "Gestão de Vendas") {
                      setShowGestaoVendasModal(true);
                      // NÃO fecha o modal COMERCIAL
                    } else if (option.title === "Relatórios de Vendas") {
                      setShowRelatoriosVendasModal(true);
                      // NÃO fecha o modal COMERCIAL
                    } else if (option.title === "Controle Financeiro") {
                      setShowControleFinanceiroModal(true);
                      // NÃO fecha o modal COMERCIAL
                    } else if (option.title === "Analytics BI") {
                      setShowAnalyticsBIModal(true);
                      // NÃO fecha o modal COMERCIAL
                    } else if (option.title === "Metas de Vendas") {
                      setShowMetasVendasModal(true);
                      // NÃO fecha o modal COMERCIAL
                    } else if (option.title === "Notas Fiscais") {
                      setShowNotasFiscaisModal(true);
                      // NÃO fecha o modal COMERCIAL
                    } else if (option.title === "Clientes") {
                      setShowClientesModal(true);
                      // NÃO fecha o modal COMERCIAL
                    } else if (option.title === "WhatsApp Business") {
                      setShowWhatsAppBusinessModal(true);
                      // NÃO fecha o modal COMERCIAL
                    }
                  }}
                  className="p-4 md:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                      {option.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {option.desc}
                    </p>
                    <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Clique para mais detalhes
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-center text-purple-700 dark:text-purple-300">
                💡 <strong>Demonstração:</strong> Estas funcionalidades estão
                disponíveis na versão completa do sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal BOLETIM DE GADO
  const BoletimModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Dados mockados do rebanho para demonstração
    const dadosRebanho = {
      totalAnimais: 1247,
      machos: 623,
      femeas: 624,
      bezerros: 156,
      novilhas: 234,
      vacas: 234,
      touros: 89,
      bois: 534,
      nascimentosMes: 23,
      mortesMes: 3,
      vacinados: 1180,
      pendentesVacina: 67,
    };

    const animaisRecentes = [
      {
        id: "001",
        nome: "Estrela",
        sexo: "F",
        idade: "2 anos",
        peso: "450kg",
        status: "Prenha",
      },
      {
        id: "002",
        nome: "CRIVO SANT ANNA",
        sexo: "M",
        idade: "4 anos",
        peso: "780kg",
        status: "Reprodutor",
      },
      {
        id: "003",
        nome: "Mimosa",
        sexo: "F",
        idade: "1 ano",
        peso: "280kg",
        status: "Crescimento",
      },
      {
        id: "004",
        nome: "JATOBÁ SANT ANNA",
        sexo: "M",
        idade: "3 anos",
        peso: "650kg",
        status: "Engorda",
      },
      {
        id: "005",
        nome: "Bonita",
        sexo: "F",
        idade: "5 anos",
        peso: "520kg",
        status: "Lactante",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📋</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Boletim de Gado
                </h2>
                <p className="text-green-100">
                  Relatórios completos do rebanho
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Resumo Geral */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {dadosRebanho.totalAnimais}
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Total de Animais
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {dadosRebanho.nascimentosMes}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Nascimentos (Mês)
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {dadosRebanho.vacinados}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Vacinados
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {dadosRebanho.pendentesVacina}
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Pendentes Vacina
                </div>
              </div>
            </div>

            {/* Distribuição por Categoria */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📊 Distribuição por Categoria
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Machos
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {dadosRebanho.machos}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Fêmeas
                    </span>
                    <span className="font-bold text-pink-600 dark:text-pink-400">
                      {dadosRebanho.femeas}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Bezerros
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {dadosRebanho.bezerros}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Vacas
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {dadosRebanho.vacas}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Animais Recentes */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🐄 Animais Cadastrados Recentemente
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sexo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Idade
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Peso
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {animaisRecentes.map((animal, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {animal.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {animal.nome}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              animal.sexo === "M"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                            }`}
                          >
                            {animal.sexo === "M" ? "Macho" : "Fêmea"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {animal.idade}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {animal.peso}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                            {animal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">
                  📊
                </div>
                <div className="font-semibold text-blue-800 dark:text-blue-200">
                  Gerar Relatório Completo
                </div>
              </button>
              <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                <div className="text-green-600 dark:text-green-400 text-2xl mb-2">
                  📋
                </div>
                <div className="font-semibold text-green-800 dark:text-green-200">
                  Exportar para Excel
                </div>
              </button>
              <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                <div className="text-purple-600 dark:text-purple-400 text-2xl mb-2">
                  🔄
                </div>
                <div className="font-semibold text-purple-800 dark:text-purple-200">
                  Atualizar Dados
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal NASCIMENTOS
  const NascimentosModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const nascimentosRecentes = [
      {
        id: "CJCJ 16002",
        mae: "Estrela",
        pai: "CRIVO SANT ANNA",
        data: "15/12/2024",
        sexo: "F",
        peso: "32kg",
        status: "Saudável",
      },
      {
        id: "CJCJ 15559",
        mae: "Bonita",
        pai: "JATOBÁ SANT ANNA",
        data: "12/12/2024",
        sexo: "M",
        peso: "35kg",
        status: "Saudável",
      },
      {
        id: "CJCJ 16050",
        mae: "Mimosa",
        pai: "CRIVO SANT ANNA",
        data: "10/12/2024",
        sexo: "F",
        peso: "30kg",
        status: "Observação",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🐮</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Nascimentos</h2>
                <p className="text-green-100">Registro de novos nascimentos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  23
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Este Mês
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  156
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Este Ano
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  95%
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Taxa Sucesso
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🐮 Nascimentos Recentes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Mãe
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Pai
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Sexo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Peso
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {nascimentosRecentes.map((nascimento, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {nascimento.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {nascimento.mae}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {nascimento.pai}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {nascimento.data}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            nascimento.sexo === "M"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {nascimento.sexo === "M" ? "Macho" : "Fêmea"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {nascimento.peso}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            nascimento.status === "Saudável"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {nascimento.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal PROGRAMA FIV
  const FIVModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="flex items-center space-x-3">
              <div className="text-3xl md:text-4xl">🧬</div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Programa FIV
                </h2>
                <p className="text-purple-100 text-sm md:text-base">
                  Fertilização in vitro
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  15
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Procedimentos FIV
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  12
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Sucessos
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  80%
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Taxa Sucesso
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-center text-blue-700 dark:text-blue-300">
                💡 <strong>Demonstração:</strong> Esta funcionalidade está
                disponível na versão completa do sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal VACINAÇÃO
  const VacinacaoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-blue-600">
            <div className="flex items-center space-x-3">
              <div className="text-3xl md:text-4xl">💉</div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Vacinação
                </h2>
                <p className="text-green-100 text-sm md:text-base">
                  Controle de vacinas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  1180
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Animais Vacinados
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  67
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Pendentes
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  95%
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Cobertura
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-center text-blue-700 dark:text-blue-300">
                💡 <strong>Demonstração:</strong> Esta funcionalidade está
                disponível na versão completa do sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal SAÚDE ANIMAL
  const SaudeModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-600 to-pink-600">
            <div className="flex items-center space-x-3">
              <div className="text-3xl md:text-4xl">🏥</div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Saúde Animal
                </h2>
                <p className="text-red-100 text-sm md:text-base">
                  Monitoramento veterinário
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  1200
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Animais Saudáveis
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  25
                </div>
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  Em Observação
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  3
                </div>
                <div className="text-sm text-red-800 dark:text-red-300">
                  Em Tratamento
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-center text-blue-700 dark:text-blue-300">
                💡 <strong>Demonstração:</strong> Esta funcionalidade está
                disponível na versão completa do sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal RELATÓRIOS
  const RelatoriosModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="text-3xl md:text-4xl">📊</div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Relatórios
                </h2>
                <p className="text-indigo-100 text-sm md:text-base">
                  Análises de manejo
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">
                  📈
                </div>
                <div className="font-semibold text-blue-800 dark:text-blue-200">
                  Relatório de Produtividade
                </div>
              </button>
              <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                <div className="text-green-600 dark:text-green-400 text-2xl mb-2">
                  🐄
                </div>
                <div className="font-semibold text-green-800 dark:text-green-200">
                  Relatório do Rebanho
                </div>
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-center text-blue-700 dark:text-blue-300">
                💡 <strong>Demonstração:</strong> Esta funcionalidade está
                disponível na versão completa do sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal TRANSFERÊNCIAS
  const TransferenciasModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-600 to-cyan-600">
            <div className="flex items-center space-x-3">
              <div className="text-3xl md:text-4xl">🔄</div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Transferências
                </h2>
                <p className="text-teal-100 text-sm md:text-base">
                  Movimentação de animais
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  45
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Transferências Este Mês
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  12
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Pendentes
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  3
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Fazendas Conectadas
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-center text-blue-700 dark:text-blue-300">
                💡 <strong>Demonstração:</strong> Esta funcionalidade está
                disponível na versão completa do sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal CONTROLE DE MORTES
  const MortesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const mortesRecentes = [
      {
        id: "CJCJ 17000",
        nome: "Maluco Sant Anna",
        idade: "8 anos",
        data: "05/12/2024",
        causa: "Idade Avançada",
        peso: "520kg",
      },
      {
        id: "CJCJ 17050",
        nome: "Morbito Sant Anna",
        idade: "2 meses",
        data: "28/11/2024",
        causa: "Doença",
        peso: "45kg",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-600 to-orange-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">💀</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Controle de Mortes
                </h2>
                <p className="text-red-100">Registro de óbitos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  3
                </div>
                <div className="text-sm text-red-800 dark:text-red-300">
                  Este Mês
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  18
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Este Ano
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  1.4%
                </div>
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  Taxa Mortalidade
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 Registros Recentes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Idade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Causa
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Peso
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {mortesRecentes.map((morte, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {morte.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {morte.nome}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {morte.idade}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {morte.data}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {morte.causa}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {morte.peso}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal GESTÃO DE VENDAS
  const GestaoVendasModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const tiposVenda = [
      {
        icon: "🤝",
        title: "Venda Direta",
        desc: "Venda direta ao cliente",
        vendas: 45,
        valor: "R$ 1.250.000",
        cor: "blue",
      },
      {
        icon: "🏛️",
        title: "Leilão",
        desc: "Vendas em leilões",
        vendas: 32,
        valor: "R$ 890.000",
        cor: "purple",
      },
      {
        icon: "🥩",
        title: "Venda Abate",
        desc: "Animais para abate",
        vendas: 28,
        valor: "R$ 420.000",
        cor: "red",
      },
      {
        icon: "📦",
        title: "Venda Descarte",
        desc: "Descarte de animais",
        vendas: 15,
        valor: "R$ 180.000",
        cor: "orange",
      },
      {
        icon: "📝",
        title: "Outro (Especificar)",
        desc: "Outros tipos de venda",
        vendas: 8,
        valor: "R$ 95.000",
        cor: "gray",
      },
    ];

    const totalVendas = tiposVenda.reduce((acc, tipo) => acc + tipo.vendas, 0);
    const totalValor = tiposVenda.reduce(
      (acc, tipo) => acc + parseInt(tipo.valor.replace(/[^\d]/g, "")),
      0
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">💼</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Gestão de Vendas
                </h2>
                <p className="text-indigo-100">Todos os tipos de venda</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {totalVendas}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Total de Vendas
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  R$ {(totalValor / 1000000).toFixed(2)}M
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Faturamento Total
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  R$ {Math.round(totalValor / totalVendas / 1000)}K
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Ticket Médio
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              📊 Tipos de Venda
            </h3>

            {/* Cards dos Tipos de Venda */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tiposVenda.map((tipo, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (tipo.title === "Venda Direta") {
                      setShowVendaDiretaModal(true);
                    } else if (tipo.title === "Leilão") {
                      setShowLeilaoModal(true);
                    } else if (tipo.title === "Venda Abate") {
                      setShowVendaAbateModal(true);
                    } else if (tipo.title === "Venda Descarte") {
                      setShowVendaDescarteModal(true);
                    }
                  }}
                  className={`bg-${tipo.cor}-50 dark:bg-${tipo.cor}-900/20 p-6 rounded-xl border border-${tipo.cor}-200 dark:border-${tipo.cor}-800 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{tipo.icon}</div>
                    <h4
                      className={`text-lg font-semibold text-${tipo.cor}-800 dark:text-${tipo.cor}-200 mb-2`}
                    >
                      {tipo.title}
                    </h4>
                    <p
                      className={`text-sm text-${tipo.cor}-600 dark:text-${tipo.cor}-400 mb-4`}
                    >
                      {tipo.desc}
                    </p>
                    <div className="space-y-2">
                      <div
                        className={`text-2xl font-bold text-${tipo.cor}-600 dark:text-${tipo.cor}-400`}
                      >
                        {tipo.vendas}
                      </div>
                      <div
                        className={`text-xs text-${tipo.cor}-500 dark:text-${tipo.cor}-500`}
                      >
                        vendas
                      </div>
                      <div
                        className={`text-lg font-semibold text-${tipo.cor}-700 dark:text-${tipo.cor}-300`}
                      >
                        {tipo.valor}
                      </div>
                    </div>
                    <div
                      className={`mt-3 text-xs text-${tipo.cor}-600 dark:text-${tipo.cor}-400 opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      Clique para detalhes
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">
                  ➕
                </div>
                <div className="font-semibold text-blue-800 dark:text-blue-200">
                  Nova Venda
                </div>
              </button>
              <button
                onClick={() => setShowRelatorioDetalhadoModal(true)}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <div className="text-green-600 dark:text-green-400 text-2xl mb-2">
                  📊
                </div>
                <div className="font-semibold text-green-800 dark:text-green-200">
                  Relatório Detalhado
                </div>
              </button>
              <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                <div className="text-purple-600 dark:text-purple-400 text-2xl mb-2">
                  📋
                </div>
                <div className="font-semibold text-purple-800 dark:text-purple-200">
                  Exportar Excel
                </div>
              </button>
              <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
                <div className="text-orange-600 dark:text-orange-400 text-2xl mb-2">
                  🔄
                </div>
                <div className="font-semibold text-orange-800 dark:text-orange-200">
                  Atualizar Dados
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal VENDAS EM LEILÃO (mantido para compatibilidade)
  const VendasLeilaoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const leiloesRecentes = [
      {
        id: "L001",
        data: "15/12/2024",
        local: "Fazenda Sant'Anna",
        animais: 45,
        arrecadacao: "R$ 1.250.000",
        status: "Concluído",
      },
      {
        id: "L002",
        data: "20/12/2024",
        local: "Virtual_Programa",
        animais: 32,
        arrecadacao: "R$ 890.000",
        status: "Agendado",
      },
      {
        id: "L003",
        data: "10/12/2024",
        local: "Fazenda Sant'Anna",
        animais: 28,
        arrecadacao: "R$ 720.000",
        status: "Concluído",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🏛️</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Vendas em Leilão
                </h2>
                <p className="text-blue-100">Gestão de leilões e vendas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ 2.86M
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Arrecadação Total
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  105
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Animais Vendidos
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  R$ 27.2K
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Preço Médio
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  3
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Leilões Realizados
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🏛️ Leilões Recentes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Local
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Animais
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Arrecadação
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {leiloesRecentes.map((leilao, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {leilao.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leilao.data}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leilao.local}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leilao.animais}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {leilao.arrecadacao}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            leilao.status === "Concluído"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {leilao.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal CONTROLE FINANCEIRO
  const ControleFinanceiroModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const dadosFinanceiros = {
      receitaTotal: "R$ 2.860.000",
      despesaTotal: "R$ 1.240.000",
      lucroLiquido: "R$ 1.620.000",
      margemLucro: "56.6%",
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">💰</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Controle Financeiro
                </h2>
                <p className="text-green-100">Receitas e despesas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {dadosFinanceiros.receitaTotal}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Receita Total
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {dadosFinanceiros.despesaTotal}
                </div>
                <div className="text-sm text-red-800 dark:text-red-300">
                  Despesa Total
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {dadosFinanceiros.lucroLiquido}
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Lucro Líquido
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {dadosFinanceiros.margemLucro}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Margem de Lucro
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📈 Principais Receitas
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Vendas de Animais
                    </span>
                    <span className="font-semibold text-green-600">
                      R$ 2.650.000
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Serviços Veterinários
                    </span>
                    <span className="font-semibold text-green-600">
                      R$ 120.000
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Aluguel de Pastos
                    </span>
                    <span className="font-semibold text-green-600">
                      R$ 90.000
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📉 Principais Despesas
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Ração e Alimentação
                    </span>
                    <span className="font-semibold text-red-600">
                      R$ 680.000
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Medicamentos
                    </span>
                    <span className="font-semibold text-red-600">
                      R$ 240.000
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Mão de Obra
                    </span>
                    <span className="font-semibold text-red-600">
                      R$ 320.000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal VENDA DIRETA
  const VendaDiretaModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const compradores = [
      {
        nome: "Luciano Abramo Ciambelli",
        estado: "SP",
        compras: 8,
        valor: "R$ 280.000",
        contato: "(11) 99999-1234",
        ultimaCompra: "15/12/2024",
      },
      {
        nome: "Dona Monica",
        estado: "RJ",
        compras: 6,
        valor: "R$ 210.000",
        contato: "(21) 88888-5678",
        ultimaCompra: "10/12/2024",
      },
      {
        nome: "Reginaldo Faria",
        estado: "MG",
        compras: 12,
        valor: "R$ 420.000",
        contato: "(31) 77777-9012",
        ultimaCompra: "08/12/2024",
      },
      {
        nome: "Ana Oliveira",
        estado: "RS",
        compras: 4,
        valor: "R$ 140.000",
        contato: "(51) 66666-3456",
        ultimaCompra: "05/12/2024",
      },
      {
        nome: "Carlos Mendes",
        estado: "GO",
        compras: 15,
        valor: "R$ 525.000",
        contato: "(62) 55555-7890",
        ultimaCompra: "20/11/2024",
      },
    ];

    const maiorComprador = compradores.reduce((prev, current) =>
      prev.valor > current.valor ? prev : current
    );
    const menorComprador = compradores.reduce((prev, current) =>
      prev.valor < current.valor ? prev : current
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🤝</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Venda Direta</h2>
                <p className="text-blue-100">
                  Análise detalhada de vendas diretas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  45
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Total Vendas
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ 1.25M
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Faturamento
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  R$ 27.8K
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Preço Médio
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  5
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Estados
                </div>
              </div>
            </div>

            {/* Maior e Menor Comprador */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  🏆 Maior Comprador
                </h4>
                <div className="space-y-2">
                  <p className="text-green-700 dark:text-green-300">
                    <strong>{maiorComprador.nome}</strong> -{" "}
                    {maiorComprador.estado}
                  </p>
                  <p className="text-green-600 dark:text-green-400">
                    {maiorComprador.compras} compras - {maiorComprador.valor}
                  </p>
                  <p className="text-sm text-green-500">
                    Contato: {maiorComprador.contato}
                  </p>
                  <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    📞 Sugerir Nova Compra
                  </button>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border-l-4 border-orange-500">
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">
                  📈 Menor Comprador
                </h4>
                <div className="space-y-2">
                  <p className="text-orange-700 dark:text-orange-300">
                    <strong>{menorComprador.nome}</strong> -{" "}
                    {menorComprador.estado}
                  </p>
                  <p className="text-orange-600 dark:text-orange-400">
                    {menorComprador.compras} compras - {menorComprador.valor}
                  </p>
                  <p className="text-sm text-orange-500">
                    Contato: {menorComprador.contato}
                  </p>
                  <button className="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                    🎯 Estratégia de Vendas
                  </button>
                </div>
              </div>
            </div>

            {/* Tabela de Compradores */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              👥 Compradores por Estado
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Compras
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Valor Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Contato
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Última Compra
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {compradores.map((comprador, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {comprador.nome}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {comprador.estado}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {comprador.compras}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {comprador.valor}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {comprador.contato}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {comprador.ultimaCompra}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">
                          📞
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          💬
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal VENDA DESCARTE
  const VendaDescarteModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const descartes = [
      {
        id: "D001",
        animal: "Vaca Velha 123",
        idade: "12 anos",
        motivo: "Idade Avançada",
        valor: "R$ 8.000",
        comprador: "Frigorífico ABC",
        data: "15/12/2024",
      },
      {
        id: "D002",
        animal: "Touro Machucado",
        idade: "6 anos",
        motivo: "Lesão Permanente",
        valor: "R$ 12.000",
        comprador: "Açougue Central",
        data: "10/12/2024",
      },
      {
        id: "D003",
        animal: "Novilha Improdutiva",
        idade: "4 anos",
        motivo: "Baixa Produtividade",
        valor: "R$ 15.000",
        comprador: "Fazenda Vizinha",
        data: "08/12/2024",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-600 to-red-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📦</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Venda Descarte
                </h2>
                <p className="text-orange-100">Gestão de animais descartados</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  15
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Animais Descartados
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  R$ 180K
                </div>
                <div className="text-sm text-red-800 dark:text-red-300">
                  Valor Recuperado
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  R$ 12K
                </div>
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  Valor Médio
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  1.2%
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Taxa Descarte
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 Descartes Recentes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Animal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Idade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Motivo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Comprador
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {descartes.map((descarte, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {descarte.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {descarte.animal}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {descarte.idade}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            descarte.motivo.includes("Idade")
                              ? "bg-yellow-100 text-yellow-800"
                              : descarte.motivo.includes("Lesão")
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {descarte.motivo}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {descarte.valor}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {descarte.comprador}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {descarte.data}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal LEILÃO
  const LeilaoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const leiloes = [
      {
        id: "L001",
        data: "15/12/2024",
        local: "Fazenda Sant'Anna",
        animais: 45,
        arrecadacao: "R$ 1.250.000",
        leiloeiro: "João Martins",
        comissao: "5%",
        status: "Concluído",
        melhorLance: "R$ 45.000",
        piorLance: "R$ 18.000",
      },
      {
        id: "L002",
        data: "20/12/2024",
        local: "Virtual_Programa",
        animais: 32,
        arrecadacao: "R$ 890.000",
        leiloeiro: "Maria Silva",
        comissao: "4.5%",
        status: "Agendado",
        melhorLance: "R$ 38.000",
        piorLance: "R$ 22.000",
      },
    ];

    const topCompradores = [
      {
        nome: "Roberto de Biasi",
        lances: 12,
        valor: "R$ 420.000",
        estado: "SP",
      },
      {
        nome: "Nelson Coletto",
        lances: 8,
        valor: "R$ 280.000",
        estado: "MG",
      },
      {
        nome: "Gil Medeiros",
        lances: 6,
        valor: "R$ 210.000",
        estado: "RS",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🏛️</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Gestão de Leilões
                </h2>
                <p className="text-purple-100">Análise completa de leilões</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  77
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Animais Vendidos
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ 2.14M
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Arrecadação Total
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  R$ 27.8K
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Preço Médio
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  R$ 45K
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Melhor Lance
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  4.75%
                </div>
                <div className="text-sm text-red-800 dark:text-red-300">
                  Comissão Média
                </div>
              </div>
            </div>

            {/* Top Compradores */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🏆 Top Compradores em Leilões
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topCompradores.map((comprador, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      index === 0
                        ? "bg-yellow-50 border-yellow-500"
                        : index === 1
                        ? "bg-gray-50 border-gray-500"
                        : "bg-orange-50 border-orange-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {comprador.nome}
                      </h4>
                      <span className="text-2xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {comprador.estado} • {comprador.lances} lances
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {comprador.valor}
                    </p>
                    <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      📞 Convidar para Próximo Leilão
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de Leilões */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 Histórico de Leilões
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Local
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Animais
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Arrecadação
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Leiloeiro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Comissão
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {leiloes.map((leilao, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {leilao.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leilao.data}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leilao.local}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leilao.animais}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {leilao.arrecadacao}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leilao.leiloeiro}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {leilao.comissao}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            leilao.status === "Concluído"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {leilao.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal VENDA ABATE
  const VendaAbateModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const vendasAbate = [
      {
        id: "A001",
        animal: "Boi Gordo 456",
        peso: "520kg",
        idade: "30 meses",
        valor: "R$ 18.000",
        frigorífico: "JBS Friboi",
        data: "15/12/2024",
        precoArroba: "R$ 280",
        rendimento: "58%",
      },
      {
        id: "A002",
        animal: "Novilho Premium",
        peso: "480kg",
        idade: "28 meses",
        valor: "R$ 16.800",
        frigorífico: "Marfrig",
        data: "12/12/2024",
        precoArroba: "R$ 275",
        rendimento: "60%",
      },
      {
        id: "A003",
        animal: "Vaca Gorda 789",
        peso: "450kg",
        idade: "48 meses",
        valor: "R$ 15.300",
        frigorífico: "Minerva Foods",
        data: "10/12/2024",
        precoArroba: "R$ 270",
        rendimento: "56%",
      },
    ];

    const frigorificos = [
      {
        nome: "JBS Friboi",
        compras: 12,
        valor: "R$ 216.000",
        precoMedio: "R$ 278",
      },
      {
        nome: "Marfrig",
        compras: 8,
        valor: "R$ 134.400",
        precoMedio: "R$ 275",
      },
      {
        nome: "Minerva Foods",
        compras: 8,
        valor: "R$ 122.400",
        precoMedio: "R$ 272",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-600 to-pink-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🥩</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Venda para Abate
                </h2>
                <p className="text-red-100">
                  Gestão de vendas para frigoríficos
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  28
                </div>
                <div className="text-sm text-red-800 dark:text-red-300">
                  Animais Abatidos
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ 420K
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Faturamento
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  R$ 275
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Preço Médio/@
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  483kg
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Peso Médio
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  58%
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Rendimento Médio
                </div>
              </div>
            </div>

            {/* Frigoríficos Parceiros */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🏭 Frigoríficos Parceiros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {frigorificos.map((frigorífico, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {frigorífico.nome}
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {frigorífico.compras} compras realizadas
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {frigorífico.valor}
                      </p>
                      <p className="text-sm text-blue-600">
                        Preço médio: {frigorífico.precoMedio}/@
                      </p>
                      <button className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                        📞 Negociar Preços
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de Vendas para Abate */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🥩 Vendas para Abate
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Animal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Peso
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Idade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Preço/@
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Frigorífico
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Rendimento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {vendasAbate.map((venda, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {venda.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {venda.animal}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                        {venda.peso}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {venda.idade}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {venda.valor}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-blue-600">
                        {venda.precoArroba}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {venda.frigorífico}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            parseFloat(venda.rendimento) >= 58
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {venda.rendimento}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {venda.data}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal RELATÓRIO DETALHADO
  const RelatorioDetalhadoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const vendasPorPai = [
      {
        pai: "TREM BALA_EAO",
        filhos: 15,
        vendas: 12,
        valor: "R$ 420.000",
        precoMedio: "R$ 35.000",
      },
      {
        pai: "GREGO FIV FVC",
        filhos: 23,
        vendas: 18,
        valor: "R$ 486.000",
        precoMedio: "R$ 27.000",
      },
      {
        pai: "LINEAR SANT ANNA",
        filhos: 18,
        vendas: 14,
        valor: "R$ 378.000",
        precoMedio: "R$ 27.000",
      },
      {
        pai: "REM HERMOSO FIV GEN",
        filhos: 12,
        vendas: 9,
        valor: "R$ 243.000",
        precoMedio: "R$ 27.000",
      },
    ];

    const vendasPorEstado = [
      { estado: "SP", vendas: 32, valor: "R$ 896.000", compradores: 12 },
      { estado: "MG", vendas: 28, valor: "R$ 756.000", compradores: 8 },
      { estado: "RJ", vendas: 18, valor: "R$ 486.000", compradores: 6 },
      { estado: "RS", vendas: 15, valor: "R$ 405.000", compradores: 5 },
      { estado: "GO", vendas: 12, valor: "R$ 324.000", compradores: 4 },
    ];

    const sazonalidade = [
      { mes: "Janeiro", vendas: 8, valor: "R$ 216.000" },
      { mes: "Fevereiro", vendas: 12, valor: "R$ 324.000" },
      { mes: "Março", vendas: 15, valor: "R$ 405.000" },
      { mes: "Abril", vendas: 18, valor: "R$ 486.000" },
      { mes: "Maio", vendas: 22, valor: "R$ 594.000" },
      { mes: "Junho", vendas: 25, valor: "R$ 675.000" },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📊</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Relatório Detalhado de Vendas
                </h2>
                <p className="text-indigo-100">
                  Análise completa por pai, estado e sazonalidade
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Performance por Pai */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🐂 Performance por Pai (Linhagem)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Pai
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Filhos
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Vendas
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Taxa Venda
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Valor Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Preço Médio
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Ranking
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {vendasPorPai.map((pai, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {pai.pai}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {pai.filhos}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {pai.vendas}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              pai.vendas / pai.filhos >= 0.8
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {((pai.vendas / pai.filhos) * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                          {pai.valor}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-blue-600">
                          {pai.precoMedio}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span className="text-2xl">
                            {index === 0
                              ? "🥇"
                              : index === 1
                              ? "🥈"
                              : index === 2
                              ? "🥉"
                              : "📊"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendas por Estado */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🗺️ Vendas por Estado (UF)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {vendasPorEstado.map((estado, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setEstadoSelecionado(estado);
                      setShowEstadoDetalheModal(true);
                    }}
                    className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {estado.estado}
                      </div>
                      <div className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                        {estado.vendas} vendas
                      </div>
                      <div className="text-lg font-semibold text-green-600 mb-1">
                        {estado.valor}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {estado.compradores} compradores
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Clique para detalhes
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sazonalidade */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📅 Resumo Vendas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {sazonalidade.map((mes, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center"
                  >
                    <div className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                      {mes.mes}
                    </div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {mes.vendas}
                    </div>
                    <div className="text-xs text-purple-500">vendas</div>
                    <div className="text-sm font-semibold text-green-600 mt-2">
                      {mes.valor}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights e Recomendações */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💡 Insights e Recomendações
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                    🎯 Oportunidades
                  </h5>
                  <ul className="space-y-1 text-sm text-indigo-700 dark:text-indigo-300">
                    <li>
                      • <strong>TREM BALA_EAO:</strong> Maior preço médio (R$
                      35K) - Investir em mais FIV
                    </li>
                    <li>
                      • <strong>São Paulo:</strong> Maior mercado (32 vendas) -
                      Expandir network
                    </li>
                    <li>
                      • <strong>Maio-Junho:</strong> Pico de vendas - Concentrar
                      esforços
                    </li>
                    <li>
                      • <strong>Rio Grande do Sul:</strong> Menor participação -
                      Potencial crescimento
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    📈 Ações Recomendadas
                  </h5>
                  <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                    <li>• Aumentar programa FIV com CRIVO SANT ANNA</li>
                    <li>• Desenvolver parceiros no RS e GO</li>
                    <li>• Planejar leilões para maio-junho</li>
                    <li>
                      • Melhorar genética dos touros com menor performance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal DETALHES DO ESTADO
  const EstadoDetalheModal = ({ isOpen, onClose, estado }) => {
    if (!isOpen || !estado) return null;

    // Dados detalhados por estado
    const dadosDetalhados = {
      SP: {
        vendas: [
          {
            id: "SP001",
            animal: "Touro Elite SP",
            comprador: "Fazenda Boa Vista",
            cidade: "Ribeirão Preto",
            valor: "R$ 45.000",
            data: "15/12/2024",
            tipo: "Venda Direta",
          },
          {
            id: "SP002",
            animal: "Novilha Premium",
            comprador: "Agropecuária Moderna",
            cidade: "São José do Rio Preto",
            valor: "R$ 32.000",
            data: "12/12/2024",
            tipo: "Leilão",
          },
          {
            id: "SP003",
            animal: "Boi Gordo 456",
            comprador: "JBS Friboi",
            cidade: "Barretos",
            valor: "R$ 18.000",
            data: "10/12/2024",
            tipo: "Abate",
          },
          {
            id: "SP004",
            animal: "Vaca Reprodutora",
            comprador: "Pecuária São Paulo",
            cidade: "Araçatuba",
            valor: "R$ 28.000",
            data: "08/12/2024",
            tipo: "Venda Direta",
          },
          {
            id: "SP005",
            animal: "Touro FIV",
            comprador: "Fazenda Três Irmãos",
            cidade: "Presidente Prudente",
            valor: "R$ 52.000",
            data: "05/12/2024",
            tipo: "Leilão",
          },
        ],
        cidades: [
          { nome: "Ribeirão Preto", vendas: 8, valor: "R$ 280.000" },
          { nome: "São José do Rio Preto", vendas: 6, valor: "R$ 210.000" },
          { nome: "Barretos", vendas: 5, valor: "R$ 175.000" },
          { nome: "Araçatuba", vendas: 4, valor: "R$ 140.000" },
          { nome: "Presidente Prudente", vendas: 9, valor: "R$ 315.000" },
        ],
        compradores: [
          {
            nome: "Fazenda Boa Vista",
            compras: 8,
            valor: "R$ 280.000",
            contato: "(16) 99999-1234",
          },
          {
            nome: "Agropecuária Moderna",
            compras: 6,
            valor: "R$ 210.000",
            contato: "(17) 88888-5678",
          },
          {
            nome: "JBS Friboi",
            compras: 5,
            valor: "R$ 175.000",
            contato: "(17) 77777-9012",
          },
          {
            nome: "Pecuária São Paulo",
            compras: 4,
            valor: "R$ 140.000",
            contato: "(18) 66666-3456",
          },
          {
            nome: "Fazenda Três Irmãos",
            compras: 9,
            valor: "R$ 315.000",
            contato: "(18) 55555-7890",
          },
        ],
      },
      MG: {
        vendas: [
          {
            id: "MG001",
            animal: "Nelore Campeão",
            comprador: "Fazenda Minas",
            cidade: "Uberaba",
            valor: "R$ 38.000",
            data: "14/12/2024",
            tipo: "Leilão",
          },
          {
            id: "MG002",
            animal: "Vaca Leiteira",
            comprador: "Laticínios BH",
            cidade: "Belo Horizonte",
            valor: "R$ 25.000",
            data: "11/12/2024",
            tipo: "Venda Direta",
          },
          {
            id: "MG003",
            animal: "Boi para Abate",
            comprador: "Marfrig",
            cidade: "Uberlândia",
            valor: "R$ 16.000",
            data: "09/12/2024",
            tipo: "Abate",
          },
        ],
        cidades: [
          { nome: "Uberaba", vendas: 12, valor: "R$ 420.000" },
          { nome: "Uberlândia", vendas: 8, valor: "R$ 280.000" },
          { nome: "Belo Horizonte", vendas: 5, valor: "R$ 175.000" },
          { nome: "Montes Claros", vendas: 3, valor: "R$ 105.000" },
        ],
        compradores: [
          {
            nome: "Fazenda Minas",
            compras: 12,
            valor: "R$ 420.000",
            contato: "(34) 99999-1234",
          },
          {
            nome: "Laticínios BH",
            compras: 8,
            valor: "R$ 280.000",
            contato: "(31) 88888-5678",
          },
          {
            nome: "Marfrig",
            compras: 5,
            valor: "R$ 175.000",
            contato: "(34) 77777-9012",
          },
          {
            nome: "Agro Triângulo",
            compras: 3,
            valor: "R$ 105.000",
            contato: "(38) 66666-3456",
          },
        ],
      },
    };

    const dadosEstado = dadosDetalhados[estado.estado] || {
      vendas: [],
      cidades: [],
      compradores: [],
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🗺️</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Vendas em {estado.estado}
                </h2>
                <p className="text-blue-100">Análise detalhada do estado</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Resumo do Estado */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {estado.vendas}
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Total de Vendas
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {estado.valor}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Faturamento
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {estado.compradores}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Compradores
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  R${" "}
                  {Math.round(
                    parseInt(estado.valor.replace(/[^\d]/g, "")) /
                      estado.vendas /
                      1000
                  )}
                  K
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Preço Médio
                </div>
              </div>
            </div>

            {/* Vendas por Cidade */}
            {dadosEstado.cidades.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🏙️ Vendas por Cidade
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {dadosEstado.cidades.map((cidade, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {cidade.nome}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {cidade.vendas} vendas
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {cidade.valor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Compradores do Estado */}
            {dadosEstado.compradores.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🏆 Top Compradores em {estado.estado}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dadosEstado.compradores
                    .slice(0, 4)
                    .map((comprador, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {comprador.nome}
                          </h4>
                          <span className="text-2xl">
                            {index === 0
                              ? "🥇"
                              : index === 1
                              ? "🥈"
                              : index === 2
                              ? "🥉"
                              : "🏅"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {comprador.compras} compras
                        </p>
                        <p className="text-lg font-bold text-green-600 mb-2">
                          {comprador.valor}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {comprador.contato}
                        </p>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          📞 Contatar
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Vendas Detalhadas */}
            {dadosEstado.vendas.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📋 Vendas Detalhadas
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 dark:bg-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Animal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Comprador
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Cidade
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Valor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {dadosEstado.vendas.map((venda, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {venda.id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {venda.animal}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {venda.comprador}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {venda.cidade}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                            {venda.valor}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                venda.tipo === "Leilão"
                                  ? "bg-purple-100 text-purple-800"
                                  : venda.tipo === "Venda Direta"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {venda.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {venda.data}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mensagem para estados sem dados detalhados */}
            {dadosEstado.vendas.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Dados Detalhados de {estado.estado}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {estado.vendas} vendas realizadas • {estado.valor} em
                  faturamento
                </p>
                <p className="text-sm text-gray-500">
                  Dados detalhados serão carregados da base de dados em breve
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal RELATÓRIOS DE VENDAS</div>
  const RelatoriosVendasModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const vendasMensais = [
      {
        mes: "Dezembro",
        vendas: 45,
        valor: "R$ 1.250.000",
        crescimento: "+12%",
      },
      {
        mes: "Novembro",
        vendas: 38,
        valor: "R$ 1.120.000",
        crescimento: "+8%",
      },
      {
        mes: "Outubro",
        vendas: 42,
        valor: "R$ 1.180.000",
        crescimento: "+15%",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📈</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Relatórios de Vendas
                </h2>
                <p className="text-purple-100">
                  Análises comerciais detalhadas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  125
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Vendas Totais
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ 3.55M
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Faturamento
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  R$ 28.4K
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Ticket Médio
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  +11.7%
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Crescimento
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 Performance Mensal
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Mês
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Vendas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Valor Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Crescimento
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {vendasMensais.map((venda, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {venda.mes}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {venda.vendas}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {venda.valor}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {venda.crescimento}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal CLIENTES
  const ClientesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const clientesAtivos = [
      {
        id: "C001",
        nome: "Luciano Abramo Ciambelli",
        cidade: "São Paulo",
        compras: 12,
        valor: "R$ 340.000",
        status: "VIP",
      },
      {
        id: "C002",
        nome: "Dona Monica",
        cidade: "Rio de Janeiro",
        compras: 8,
        valor: "R$ 220.000",
        status: "Ativo",
      },
      {
        id: "C003",
        nome: "Reginaldo Faria",
        cidade: "Belo Horizonte",
        compras: 15,
        valor: "R$ 450.000",
        status: "VIP",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">👥</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Clientes</h2>
                <p className="text-indigo-100">Gestão de compradores</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  156
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Clientes Ativos
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  23
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Clientes VIP
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  R$ 22.8K
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Ticket Médio
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  89%
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Satisfação
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              👥 Principais Clientes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Cidade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Compras
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Valor Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {clientesAtivos.map((cliente, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {cliente.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {cliente.nome}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {cliente.cidade}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {cliente.compras}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {cliente.valor}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            cliente.status === "VIP"
                              ? "bg-gold-100 text-gold-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {cliente.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal ANALYTICS BI
  const AnalyticsBIModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-cyan-600 to-blue-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📊</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Analytics BI</h2>
                <p className="text-cyan-100">Inteligência de negócios</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  94.2%
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Taxa de Conversão
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  R$ 28.4K
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Valor Médio por Animal
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  156
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Clientes Únicos
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  +18.5%
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Crescimento Anual
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📈 Tendências de Mercado
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Demanda por Nelore
                    </span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <span className="text-green-600 font-semibold">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Demanda por GIR
                    </span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                      <span className="text-blue-600 font-semibold">72%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Demanda por Brahman
                    </span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                      <span className="text-purple-600 font-semibold">68%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎯 Metas vs Realizado
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Vendas (Meta: 120)
                      </span>
                      <span className="text-green-600 font-semibold">
                        125 (104%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "104%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Receita (Meta: R$ 3.2M)
                      </span>
                      <span className="text-blue-600 font-semibold">
                        R$ 3.55M (111%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "111%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔍 Insights Principais
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Melhor período:</strong> Dezembro apresentou 12%
                  mais vendas que a média
                </li>
                <li>
                  • <strong>Perfil ideal:</strong> Clientes de SP e RJ
                  representam 60% do faturamento
                </li>
                <li>
                  • <strong>Oportunidade:</strong> Animais FIV têm margem 23%
                  superior
                </li>
                <li>
                  • <strong>Recomendação:</strong> Investir em marketing digital
                  para região Sul
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal METAS DE VENDAS
  const MetasVendasModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const metas2024 = [
      {
        trimestre: "Q1 2024",
        meta: "R$ 800.000",
        realizado: "R$ 650.000",
        percentual: 84,
        status: "Vamos conseguir",
      },
      {
        trimestre: "Q2 2024",
        meta: "R$ 900.000",
        realizado: "R$ 920.000",
        percentual: 102,
        status: "Superado",
      },
      {
        trimestre: "Q3 2024",
        meta: "R$ 950.000",
        realizado: "R$ 980.000",
        percentual: 103,
        status: "Bora pra cima",
      },
      {
        trimestre: "Q4 2024",
        meta: "R$ 1.100.000",
        realizado: "R$ 1.250.000",
        percentual: 114,
        status: "Superado",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-pink-600 to-rose-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🎯</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Metas de Vendas
                </h2>
                <p className="text-pink-100">Acompanhamento de objetivos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  106%
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Meta Anual Atingida
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  R$ 4.0M
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Realizado 2024
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  R$ 3.75M
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Meta 2024
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  R$ 4.5M
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Meta 2025
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 Performance por Trimestre
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Período
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Meta
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Realizado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      %
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {metas2024.map((meta, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {meta.trimestre}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {meta.meta}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {meta.realizado}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">
                        {meta.percentual}%
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {meta.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🏆 Conquistas 2024
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-green-700 dark:text-green-300">
                    ✅ Meta anual superada em 6%
                  </p>
                  <p className="text-green-700 dark:text-green-300">
                    ✅ Todos os trimestres acima da meta
                  </p>
                  <p className="text-green-700 dark:text-green-300">
                    ✅ Melhor performance: Q4 (114%)
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 dark:text-blue-300">
                    🎯 Meta 2025: R$ 4.5M (+12.5%)
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    🎯 Foco: Expansão regional
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    🎯 Estratégia: Animais premium
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal NOTAS FISCAIS
  const NotasFiscaisModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [showGTAForm, setShowGTAForm] = useState(false);
    const [gtaNumber, setGtaNumber] = useState("");
    const [emissionDate, setEmissionDate] = useState("");
    const [followUpTasks, setFollowUpTasks] = useState([]);

    const notasRecentes = [
      {
        numero: "NF-001234",
        cliente: "Luciano Abramo Ciambelli",
        valor: "R$ 45.000",
        data: "15/12/2024",
        status: "Emitida",
        gta: "1234567",
        followUp: "Ativo",
      },
      {
        numero: "NF-001235",
        cliente: "Dona Monica",
        valor: "R$ 32.000",
        data: "14/12/2024",
        status: "Emitida",
        gta: "1234568",
        followUp: "Pendente",
      },
      {
        numero: "NF-001236",
        cliente: "Reginaldo Faria",
        valor: "R$ 67.000",
        data: "13/12/2024",
        status: "Cancelada",
        gta: "-",
        followUp: "-",
      },
    ];

    const handleGTASubmit = () => {
      if (gtaNumber && emissionDate) {
        const emissionDateObj = new Date(emissionDate);

        // Criar tarefas de follow-up automatizadas
        const tasks = [
          {
            type: "Confirmação de Chegada",
            date: new Date(
              emissionDateObj.getTime() + 20 * 24 * 60 * 60 * 1000
            ), // +20 dias
            message: "Ligar para confirmar se os animais chegaram bem",
            status: "Agendado",
          },
          {
            type: "Follow-up Satisfação",
            date: new Date(
              emissionDateObj.getTime() + 60 * 24 * 60 * 60 * 1000
            ), // +2 meses
            message: "Ligar para verificar satisfação com os animais",
            status: "Agendado",
          },
          {
            type: "Oferta Novos Animais",
            date: new Date(
              emissionDateObj.getTime() + 240 * 24 * 60 * 60 * 1000
            ), // +8 meses
            message: "Ligar para oferecer novos animais",
            status: "Agendado",
          },
        ];

        setFollowUpTasks(tasks);
        alert(
          `GTA ${gtaNumber} cadastrada com sucesso!\nFollow-ups automáticos criados para:\n- 20 dias: Confirmação chegada\n- 2 meses: Verificação satisfação\n- 8 meses: Oferta novos animais`
        );
        setGtaNumber("");
        setEmissionDate("");
        setShowGTAForm(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-600 to-teal-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📋</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Notas Fiscais</h2>
                <p className="text-emerald-100">Emissão de documentos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Seção GTA - Cadastro Manual */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">📋</div>
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    Cadastro de GTA
                  </h3>
                </div>
                <button
                  onClick={() => setShowGTAForm(!showGTAForm)}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  {showGTAForm ? "Cancelar" : "+ Cadastrar GTA"}
                </button>
              </div>

              {showGTAForm && (
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número da GTA (máx. 7 dígitos)
                      </label>
                      <input
                        type="text"
                        value={gtaNumber}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 7);
                          setGtaNumber(value);
                        }}
                        placeholder="1234567"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        maxLength="7"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data de Emissão
                      </label>
                      <input
                        type="date"
                        value={emissionDate}
                        onChange={(e) => setEmissionDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      🤖 Follow-up Automático Pós-Venda:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>
                        • <strong>20 dias:</strong> Ligação para confirmar
                        chegada dos animais
                      </li>
                      <li>
                        • <strong>2 meses:</strong> Ligação para verificar
                        satisfação
                      </li>
                      <li>
                        • <strong>8 meses:</strong> Ligação para oferecer novos
                        animais
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleGTASubmit}
                    disabled={!gtaNumber || !emissionDate}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Cadastrar GTA e Ativar Follow-up
                  </button>
                </div>
              )}

              {followUpTasks.length > 0 && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    ✅ Tarefas de Follow-up Criadas:
                  </h4>
                  {followUpTasks.map((task, index) => (
                    <div
                      key={index}
                      className="text-sm text-green-700 dark:text-green-300 mb-1"
                    >
                      <strong>{task.type}:</strong>{" "}
                      {task.date.toLocaleDateString("pt-BR")} - {task.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  156
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  NFs Emitidas
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  R$ 3.55M
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Valor Total
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  3
                </div>
                <div className="text-sm text-red-800 dark:text-red-300">
                  Canceladas
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  12
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Follow-ups Ativos
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                📋 Notas Fiscais e GTAs
              </h3>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                + Nova NF
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Número NF
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      GTA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Follow-up
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {notasRecentes.map((nota, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {nota.numero}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {nota.cliente}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {nota.valor}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {nota.data}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-mono">
                          {nota.gta}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            nota.followUp === "Ativo"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : nota.followUp === "Pendente"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {nota.followUp}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            nota.status === "Emitida"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {nota.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button className="text-blue-600 hover:text-blue-800 mr-2 text-xs">
                          Ver
                        </button>
                        <button className="text-green-600 hover:text-green-800 mr-2 text-xs">
                          PDF
                        </button>
                        {nota.followUp !== "-" && (
                          <button className="text-purple-600 hover:text-purple-800 text-xs">
                            Follow-up
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Seção de Follow-ups Pendentes */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                <div className="text-2xl mr-2">📞</div>
                Follow-ups Pendentes Hoje
              </h3>
              <div className="space-y-2">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Luciano Abramo Ciambelli
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      GTA: 1234567 - Confirmação de chegada (20 dias)
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Ligar Agora
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Dona Monica
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      GTA: 1234568 - Verificação satisfação (2 meses)
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Ligar Agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal WHATSAPP BUSINESS
  const WhatsAppBusinessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const campanhas = [
      {
        nome: "Leilão Dezembro",
        enviadas: 245,
        abertas: 198,
        cliques: 67,
        conversoes: 12,
      },
      {
        nome: "Promoção Black Friday",
        enviadas: 180,
        abertas: 156,
        cliques: 89,
        conversoes: 23,
      },
      {
        nome: "Animais Premium",
        enviadas: 120,
        abertas: 98,
        cliques: 45,
        conversoes: 8,
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📱</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  WhatsApp Business
                </h2>
                <p className="text-green-100">Comunicação comercial</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  545
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Mensagens Enviadas
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  452
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Mensagens Abertas
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  201
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  Cliques
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  43
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  Conversões
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                📊 Campanhas Ativas
              </h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                + Nova Campanha
              </button>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Campanha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Enviadas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Abertas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Cliques
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Conversões
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Taxa
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {campanhas.map((campanha, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {campanha.nome}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {campanha.enviadas}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {campanha.abertas}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {campanha.cliques}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">
                        {campanha.conversoes}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {(
                            (campanha.conversoes / campanha.enviadas) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📝 Modelos de Mensagem
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-green-500">
                    <p className="text-sm font-medium">Leilão Disponível</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Para divulgação de leilões
                    </p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                    <p className="text-sm font-medium">Animal Premium</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Para animais de alta qualidade
                    </p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-purple-500">
                    <p className="text-sm font-medium">Promoção Especial</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Para ofertas limitadas
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📈 Performance
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Taxa de Abertura
                      </span>
                      <span className="text-green-600 font-semibold">
                        82.9%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "82.9%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Taxa de Clique
                      </span>
                      <span className="text-blue-600 font-semibold">36.9%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "36.9%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Taxa de Conversão
                      </span>
                      <span className="text-purple-600 font-semibold">
                        7.9%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: "7.9%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // TELA PARA VISITANTES - VERSÃO SIMPLIFICADA
  if (user && user.role === "visitor") {
    return (
      <Layout>
        <div className="space-y-3 md:space-y-8">
          {/* Header de Boas-vindas para Visitante - Versão Compacta */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg md:rounded-xl p-3 md:p-6 text-white text-center">
            <div className="flex items-center justify-center space-x-2 md:space-x-4">
              <img
                src="/logo-fazendas-santanna.jpg"
                alt="Fazendas Sant'Anna"
                className="w-10 h-10 md:w-16 md:h-16 object-contain rounded-lg bg-white/10 p-1"
              />
              <div>
                <h1 className="text-base md:text-2xl font-bold">
                  Beef Sync - Fazendas Sant'Anna
                </h1>
                <p className="text-blue-100 text-xs md:text-base">
                  Escolha uma opção para explorar o sistema
                </p>
              </div>
            </div>
          </div>

          {/* Cards Principais - MANEJO e COMERCIAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 max-w-4xl mx-auto">
            {/* Card MANEJO */}
            <button
              onClick={() => setShowManejoModal(true)}
              className="group relative p-3 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl hover:shadow-xl md:hover:shadow-3xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-3xl md:text-6xl mb-1 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  🐄
                </div>
                <h3 className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-3">
                  MANEJO
                </h3>
                <p className="text-xs md:text-lg text-gray-600 dark:text-gray-400 mb-1 md:mb-4">
                  Gestão completa do rebanho
                </p>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-500 space-y-0.5 md:space-y-1">
                  <p>• Nascimentos</p>
                  <p>• Boletim de Gado</p>
                  <p>• Controle de Mortes</p>
                  <p className="hidden md:block">• Programa FIV</p>
                  <p className="hidden md:block">• E muito mais...</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Card COMERCIAL */}
            <button
              onClick={() => setShowComercialModal(true)}
              className="group relative p-3 md:p-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl hover:shadow-xl md:hover:shadow-3xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-3xl md:text-6xl mb-1 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  💰
                </div>
                <h3 className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-3">
                  COMERCIAL
                </h3>
                <p className="text-xs md:text-lg text-gray-600 dark:text-gray-400 mb-1 md:mb-4">
                  Vendas e relatórios financeiros
                </p>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-500 space-y-0.5 md:space-y-1">
                  <p>• Vendas em Leilão</p>
                  <p>• Relatórios de Vendas</p>
                  <p>• Análises Financeiras</p>
                  <p className="hidden md:block">• Controle de Receitas</p>
                  <p className="hidden md:block">• E muito mais...</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 shadow-md md:shadow-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2 md:mb-4">
                <img
                  src="/logo-fazendas-santanna.jpg"
                  alt="Fazendas Sant'Anna"
                  className="w-10 h-10 md:w-16 md:h-16 object-contain rounded-lg"
                />
              </div>
              <h3 className="text-base md:text-2xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-4">
                🚀 Sobre o Beef Sync - Fazendas Sant'Anna
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-lg leading-relaxed">
                O Beef Sync é um sistema completo de gestão bovina desenvolvido
                especialmente para as Fazendas Sant'Anna. Oferece controle total
                sobre o manejo do rebanho e operações comerciais, com tecnologia
                avançada e interface intuitiva para facilitar a administração da
                fazenda.By Zec@
              </p>
            </div>
          </div>

          {/* Sistema de Notificações para Visitante */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">🔔</div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  Notificações do Sistema
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  Follow-ups e oportunidades ativas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                <div className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400">3</div>
                <div className="text-xs md:text-sm text-red-800 dark:text-red-300">Urgentes</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
                <div className="text-lg md:text-xl font-bold text-yellow-600 dark:text-yellow-400">5</div>
                <div className="text-xs md:text-sm text-yellow-800 dark:text-yellow-300">Agendados</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                <div className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">12</div>
                <div className="text-xs md:text-sm text-green-800 dark:text-green-300">Concluídos</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">8</div>
                <div className="text-xs md:text-sm text-blue-800 dark:text-blue-300">Oportunidades</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 text-sm md:text-base">
                      📞 Follow-up Urgente
                    </h4>
                    <p className="text-xs md:text-sm text-red-600 dark:text-red-300">
                      Luciano Abramo Ciambelli - Confirmação de chegada vencida
                    </p>
                  </div>
                  <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                    Ligar
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm md:text-base">
                      💰 Oportunidade de Venda
                    </h4>
                    <p className="text-xs md:text-sm text-blue-600 dark:text-blue-300">
                      Reginaldo Faria - Pronto para nova oferta de animais
                    </p>
                  </div>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                    Oferecer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              🔒 Acesso como visitante - Funcionalidades limitadas para
              demonstração
            </p>
          </div>
        </div>

        {/* Modais */}
        <ManejoModal
          isOpen={showManejoModal}
          onClose={() => setShowManejoModal(false)}
        />
        <ComercialModal
          isOpen={showComercialModal}
          onClose={() => setShowComercialModal(false)}
        />
        <BoletimModal
          isOpen={showBoletimModal}
          onClose={() => {
            setShowBoletimModal(false);
            setShowManejoModal(true);
          }}
        />
        <NascimentosModal
          isOpen={showNascimentosModal}
          onClose={() => {
            setShowNascimentosModal(false);
            setShowManejoModal(true);
          }}
        />
        <MortesModal
          isOpen={showMortesModal}
          onClose={() => {
            setShowMortesModal(false);
            setShowManejoModal(true);
          }}
        />
        <FIVModal
          isOpen={showFIVModal}
          onClose={() => {
            setShowFIVModal(false);
            setShowManejoModal(true);
          }}
        />
        <VacinacaoModal
          isOpen={showVacinacaoModal}
          onClose={() => {
            setShowVacinacaoModal(false);
            setShowManejoModal(true);
          }}
        />
        <SaudeModal
          isOpen={showSaudeModal}
          onClose={() => {
            setShowSaudeModal(false);
            setShowManejoModal(true);
          }}
        />
        <RelatoriosModal
          isOpen={showRelatoriosModal}
          onClose={() => {
            setShowRelatoriosModal(false);
            setShowManejoModal(true);
          }}
        />
        <TransferenciasModal
          isOpen={showTransferenciasModal}
          onClose={() => {
            setShowTransferenciasModal(false);
            setShowManejoModal(true);
          }}
        />
        <GestaoVendasModal
          isOpen={showGestaoVendasModal}
          onClose={() => {
            setShowGestaoVendasModal(false);
            setShowComercialModal(true);
          }}
        />
        <VendaDiretaModal
          isOpen={showVendaDiretaModal}
          onClose={() => {
            setShowVendaDiretaModal(false);
            setShowGestaoVendasModal(true);
          }}
        />
        <VendaDescarteModal
          isOpen={showVendaDescarteModal}
          onClose={() => {
            setShowVendaDescarteModal(false);
            setShowGestaoVendasModal(true);
          }}
        />
        <LeilaoModal
          isOpen={showLeilaoModal}
          onClose={() => {
            setShowLeilaoModal(false);
            setShowGestaoVendasModal(true);
          }}
        />
        <VendaAbateModal
          isOpen={showVendaAbateModal}
          onClose={() => {
            setShowVendaAbateModal(false);
            setShowGestaoVendasModal(true);
          }}
        />
        <RelatorioDetalhadoModal
          isOpen={showRelatorioDetalhadoModal}
          onClose={() => {
            setShowRelatorioDetalhadoModal(false);
            setShowGestaoVendasModal(true);
          }}
        />
        <EstadoDetalheModal
          isOpen={showEstadoDetalheModal}
          onClose={() => {
            setShowEstadoDetalheModal(false);
            setShowRelatorioDetalhadoModal(true);
          }}
          estado={estadoSelecionado}
        />
        <ControleFinanceiroModal
          isOpen={showControleFinanceiroModal}
          onClose={() => {
            setShowControleFinanceiroModal(false);
            setShowComercialModal(true);
          }}
        />
        <RelatoriosVendasModal
          isOpen={showRelatoriosVendasModal}
          onClose={() => {
            setShowRelatoriosVendasModal(false);
            setShowComercialModal(true);
          }}
        />
        <ClientesModal
          isOpen={showClientesModal}
          onClose={() => {
            setShowClientesModal(false);
            setShowComercialModal(true);
          }}
        />
        <AnalyticsBIModal
          isOpen={showAnalyticsBIModal}
          onClose={() => {
            setShowAnalyticsBIModal(false);
            setShowComercialModal(true);
          }}
        />
        <MetasVendasModal
          isOpen={showMetasVendasModal}
          onClose={() => {
            setShowMetasVendasModal(false);
            setShowComercialModal(true);
          }}
        />
        <NotasFiscaisModal
          isOpen={showNotasFiscaisModal}
          onClose={() => {
            setShowNotasFiscaisModal(false);
            setShowComercialModal(true);
          }}
        />
        <WhatsAppBusinessModal
          isOpen={showWhatsAppBusinessModal}
          onClose={() => {
            setShowWhatsAppBusinessModal(false);
            setShowComercialModal(true);
          }}
        />
      </Layout>
    );
  }

  // TELA COMPLETA PARA DESENVOLVEDOR (ZECA)
  if (user && user.role === "developer") {
    const getBIReportMessage = () => {
      return `
🐄 *RELATÓRIO BI - VENDAS*

📊 *RESUMO GERAL*
• Total de Animais: 98
• Animais Vendidos: 98
• Taxa de Venda: 100.0%
• Receita Total: R$ 2.850.000
• Preço Médio: R$ 29.082

📈 *ANÁLISE FIV vs IA*
• FIV: 3 animais - Média: R$ 35.000
• IA: 95 animais - Média: R$ 28.500

🏆 *TOP TOUROS (Mais Filhos)*
• Dados reais serão carregados da API
• Sistema limpo de dados mockados

📅 *CRONOGRAMA*
• 08:00 - Abertura
• 09:00 - Início dos Lances
• 15:00 - Animais FIV
• 17:00 - Encerramento

📊 *GRÁFICOS INCLUSOS*
• 🥧 Análise FIV vs IA
• 📊 Vendas por Série
• 📈 Timeline dos Últimos 7 Dias

---
🤖 Beef Sync - Gestão Bovina Inteligente 🐄
      `.trim();
    };

    // Sistema de Notificações Globais
    const GlobalNotificationSystem = () => {
      const [notifications, setNotifications] = useState([
        {
          id: 1,
          type: "follow-up",
          priority: "high",
          title: "Follow-up Urgente",
          message: "Luciano Abramo Ciambelli - GTA 1234567 - Confirmação de chegada vencida há 2 dias",
          date: "2024-12-23",
          assignedTo: "Equipe Comercial",
          status: "pending",
          client: "Luciano Abramo Ciambelli",
          phone: "(11) 99999-9999"
        },
        {
          id: 2,
          type: "follow-up",
          priority: "medium",
          title: "Follow-up Agendado",
          message: "Dona Monica - GTA 1234568 - Verificação de satisfação hoje",
          date: "2024-12-25",
          assignedTo: "Vendedor João",
          status: "scheduled",
          client: "Dona Monica",
          phone: "(11) 88888-8888"
        },
        {
          id: 3,
          type: "opportunity",
          priority: "high",
          title: "Oportunidade de Venda",
          message: "Reginaldo Faria - GTA 1234569 - Pronto para nova oferta de animais",
          date: "2024-12-25",
          assignedTo: "Vendedor Carlos",
          status: "ready",
          client: "Reginaldo Faria",
          phone: "(11) 77777-7777"
        },
        {
          id: 4,
          type: "system",
          priority: "low",
          title: "Sistema Atualizado",
          message: "Nova funcionalidade de GTA manual implementada com sucesso",
          date: "2024-12-25",
          assignedTo: "Todos os usuários",
          status: "info"
        }
      ]);

      const markAsCompleted = (notificationId) => {
        setNotifications(notifications.map(notif => 
          notif.id === notificationId ? { ...notif, status: "completed" } : notif
        ));
      };

      const getPriorityColor = (priority) => {
        switch (priority) {
          case "high": return "border-red-500 bg-red-50 dark:bg-red-900/20";
          case "medium": return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
          case "low": return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
          default: return "border-gray-500 bg-gray-50 dark:bg-gray-900/20";
        }
      };

      const getTypeIcon = (type) => {
        switch (type) {
          case "follow-up": return "📞";
          case "opportunity": return "💰";
          case "system": return "⚙️";
          default: return "📋";
        }
      };

      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔔</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Central de Notificações
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Acompanhe follow-ups e oportunidades em tempo real
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm">
                {notifications.filter(n => n.priority === "high" && n.status !== "completed").length} Urgentes
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                {notifications.filter(n => n.status === "pending" || n.status === "scheduled").length} Pendentes
              </span>
            </div>
          </div>

          {/* Dashboard de Notificações */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {notifications.filter(n => n.priority === "high" && n.status !== "completed").length}
              </div>
              <div className="text-sm text-red-800 dark:text-red-300">Urgentes</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {notifications.filter(n => n.status === "scheduled").length}
              </div>
              <div className="text-sm text-yellow-800 dark:text-yellow-300">Agendados</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {notifications.filter(n => n.status === "completed").length}
              </div>
              <div className="text-sm text-green-800 dark:text-green-300">Concluídos</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {notifications.filter(n => n.type === "opportunity").length}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Oportunidades</div>
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Notificações Ativas
            </h3>
            {notifications
              .filter(n => n.status !== "completed")
              .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              })
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg p-4 border-l-4 ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>📅 {new Date(notification.date).toLocaleDateString('pt-BR')}</span>
                        <span>👤 {notification.assignedTo}</span>
                        {notification.phone && (
                          <span>📞 {notification.phone}</span>
                        )}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            notification.priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : notification.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {notification.priority === "high" ? "🔴 Urgente" : 
                           notification.priority === "medium" ? "🟡 Médio" : "🔵 Baixo"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {notification.type === "follow-up" && (
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          📞 Ligar
                        </button>
                      )}
                      {notification.type === "opportunity" && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                          💰 Oferecer
                        </button>
                      )}
                      <button
                        onClick={() => markAsCompleted(notification.id)}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        ✓ Concluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Integração com WhatsApp */}
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
              <span className="text-2xl mr-2">📱</span>
              Integração WhatsApp Business
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                📤 Enviar Follow-ups Pendentes
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                📊 Relatório de Oportunidades
              </button>
            </div>
          </div>
        </div>
      );
    };

    // Sistema de Gestão de GTA Integrado
    const GTAManagementSystem = () => {
      const [showGTAForm, setShowGTAForm] = useState(false);
      const [gtaNumber, setGtaNumber] = useState("");
      const [emissionDate, setEmissionDate] = useState("");
      const [clientName, setClientName] = useState("");
      const [animalCount, setAnimalCount] = useState("");
      const [followUpTasks, setFollowUpTasks] = useState([
        {
          id: 1,
          client: "Luciano Abramo Ciambelli",
          gta: "1234567",
          type: "Confirmação de Chegada",
          date: "2024-12-25",
          status: "Pendente",
          phone: "(11) 99999-9999",
        },
        {
          id: 2,
          client: "Dona Monica",
          gta: "1234568",
          type: "Verificação Satisfação",
          date: "2024-12-26",
          status: "Pendente",
          phone: "(11) 88888-8888",
        },
        {
          id: 3,
          client: "Reginaldo Faria",
          gta: "1234569",
          type: "Oferta Novos Animais",
          date: "2024-12-27",
          status: "Agendado",
          phone: "(11) 77777-7777",
        },
      ]);

      const handleGTASubmit = () => {
        if (gtaNumber && emissionDate && clientName && animalCount) {
          const emissionDateObj = new Date(emissionDate);

          // Criar tarefas de follow-up automatizadas
          const newTasks = [
            {
              id: Date.now() + 1,
              client: clientName,
              gta: gtaNumber,
              type: "Confirmação de Chegada",
              date: new Date(
                emissionDateObj.getTime() + 20 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
              status: "Agendado",
              phone: "A definir",
            },
            {
              id: Date.now() + 2,
              client: clientName,
              gta: gtaNumber,
              type: "Verificação Satisfação",
              date: new Date(
                emissionDateObj.getTime() + 60 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
              status: "Agendado",
              phone: "A definir",
            },
            {
              id: Date.now() + 3,
              client: clientName,
              gta: gtaNumber,
              type: "Oferta Novos Animais",
              date: new Date(
                emissionDateObj.getTime() + 240 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
              status: "Agendado",
              phone: "A definir",
            },
          ];

          setFollowUpTasks([...followUpTasks, ...newTasks]);
          alert(
            `✅ GTA ${gtaNumber} cadastrada com sucesso!\n\n🤖 Follow-ups automáticos criados:\n• ${newTasks[0].date}: Confirmação chegada\n• ${newTasks[1].date}: Verificação satisfação\n• ${newTasks[2].date}: Oferta novos animais\n\n📞 Cliente: ${clientName}\n🐄 Animais: ${animalCount}`
          );

          // Limpar formulário
          setGtaNumber("");
          setEmissionDate("");
          setClientName("");
          setAnimalCount("");
          setShowGTAForm(false);
        }
      };

      const markTaskAsCompleted = (taskId) => {
        setFollowUpTasks(
          followUpTasks.map((task) =>
            task.id === taskId ? { ...task, status: "Concluído" } : task
          )
        );
      };

      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📋</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sistema GTA & Follow-up Pós-Venda
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Cadastro manual de GTA com automação comercial
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGTAForm(!showGTAForm)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showGTAForm ? "Cancelar" : "+ Nova GTA"}
            </button>
          </div>

          {/* Formulário de Cadastro GTA */}
          {showGTAForm && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">
                📝 Cadastrar Nova GTA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número da GTA (máx. 7 dígitos) *
                  </label>
                  <input
                    type="text"
                    value={gtaNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 7);
                      setGtaNumber(value);
                    }}
                    placeholder="1234567"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    maxLength="7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Emissão *
                  </label>
                  <input
                    type="date"
                    value={emissionDate}
                    onChange={(e) => setEmissionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome completo do cliente"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantidade de Animais *
                  </label>
                  <input
                    type="number"
                    value={animalCount}
                    onChange={(e) => setAnimalCount(e.target.value)}
                    placeholder="Ex: 5"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🤖 Follow-up Automático Pós-Venda:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    • <strong>20 dias:</strong> Ligação para confirmar chegada
                    dos animais
                  </li>
                  <li>
                    • <strong>2 meses:</strong> Ligação para verificar
                    satisfação
                  </li>
                  <li>
                    • <strong>8 meses:</strong> Ligação para oferecer novos
                    animais
                  </li>
                </ul>
              </div>

              <button
                onClick={handleGTASubmit}
                disabled={
                  !gtaNumber || !emissionDate || !clientName || !animalCount
                }
                className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cadastrar GTA e Ativar Follow-up Automático
              </button>
            </div>
          )}

          {/* Dashboard de Follow-ups */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {followUpTasks.filter((t) => t.status === "Pendente").length}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                Follow-ups Hoje
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {followUpTasks.filter((t) => t.status === "Agendado").length}
              </div>
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                Agendados
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {followUpTasks.filter((t) => t.status === "Concluído").length}
              </div>
              <div className="text-sm text-green-800 dark:text-green-300">
                Concluídos
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {followUpTasks.length}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-300">
                Total
              </div>
            </div>
          </div>

          {/* Lista de Follow-ups */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="text-2xl mr-2">📞</div>
              Agenda de Follow-ups
            </h3>
            <div className="space-y-3">
              {followUpTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 ${
                    task.status === "Pendente"
                      ? "border-red-500"
                      : task.status === "Agendado"
                      ? "border-yellow-500"
                      : "border-green-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {task.client}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          GTA: {task.gta}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.status === "Pendente"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : task.status === "Agendado"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>{task.type}</strong> -{" "}
                        {new Date(task.date).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        📞 {task.phone}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {task.status !== "Concluído" && (
                        <>
                          <button
                            onClick={() => markTaskAsCompleted(task.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            ✓ Concluir
                          </button>
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            📞 Ligar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const BIDashboardModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="h-8 w-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  📊 BI Analytics - Sistema de Vendas
                </h2>
                <p className="text-purple-100">
                  Gráficos visuais e análises avançadas
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowWhatsAppMulti(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📱 Enviar WhatsApp
              </button>
              <button
                onClick={() => setShowBIDashboard(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            <BIChartsVisual
              salesData={salesData}
              onSendWhatsApp={() => setShowWhatsAppMulti(true)}
            />
          </div>
        </div>
      </div>
    );

    return (
      <Layout>
        {/* Header com Logo para Desenvolvedor */}
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center">
            <img
              src="/logo-fazendas-santanna.jpg"
              alt="Fazendas Sant'Anna"
              className="w-24 h-24 object-contain mb-4 rounded-lg shadow-lg"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Fazendas Sant'Anna - Sistema Completo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bem-vindo, Zeca! Acesso total ao sistema
            </p>
          </div>
        </div>

        {/* Botões de Acesso Rápido */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <button
            onClick={() => setShowAnimalManager(true)}
            className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 flex items-center font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            <UserGroupIcon className="h-6 w-6 mr-3" />
            🐄 CADASTRO DE ANIMAIS
          </button>

          <button
            onClick={() => setShowBIDashboard(true)}
            className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            <ChartBarIcon className="h-6 w-6 mr-3" />
            📊 BI ANALYTICS
          </button>

          <button
            onClick={() => setShowTimeline(true)}
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            <ClockIcon className="h-6 w-6 mr-3" />
            📅 TIMELINE VENDAS
          </button>

          <button
            onClick={() => setShowDirectInvoice(true)}
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            <CurrencyDollarIcon className="h-6 w-6 mr-3" />
            📋 CRIAR NOTA FISCAL
          </button>
        </div>

        <ModernDashboard />

        {/* Sistema GTA Integrado - Desenvolvedor */}
        <GTAManagementSystem />

        {/* Sistema de Notificações Globais */}
        <GlobalNotificationSystem />

        {/* Modais do Desenvolvedor */}
        <AuctionManager
          isOpen={showAuctionManager}
          onClose={() => setShowAuctionManager(false)}
          onSalesComplete={() => {
            console.log("Vendas do leilão completadas!");
          }}
        />

        <DirectInvoiceManager
          isOpen={showDirectInvoice}
          onClose={() => setShowDirectInvoice(false)}
        />

        <SimpleAnimalManager
          isOpen={showAnimalManager}
          onClose={() => setShowAnimalManager(false)}
        />

        {showBIDashboard && <BIDashboardModal />}

        <LiveSalesTimeline
          isOpen={showTimeline}
          onClose={() => setShowTimeline(false)}
        />

        <WhatsAppMultiSender
          isOpen={showWhatsAppMulti}
          onClose={() => setShowWhatsAppMulti(false)}
          reportMessage={getBIReportMessage()}
        />
      </Layout>
    );
  }

  // FALLBACK - Se não for visitante nem desenvolvedor, mostrar tela básica
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Acesso Restrito
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Seu perfil não tem permissão para acessar esta área.
        </p>
      </div>
    </Layout>
  );
}
