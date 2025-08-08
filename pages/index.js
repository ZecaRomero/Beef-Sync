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
  const [showVendasLeilaoModal, setShowVendasLeilaoModal] = useState(false);
  const [showRelatoriosVendasModal, setShowRelatoriosVendasModal] = useState(false);
  const [showControleFinanceiroModal, setShowControleFinanceiroModal] = useState(false);
  const [showAnalyticsBIModal, setShowAnalyticsBIModal] = useState(false);
  const [showMetasVendasModal, setShowMetasVendasModal] = useState(false);
  const [showNotasFiscaisModal, setShowNotasFiscaisModal] = useState(false);
  const [showClientesModal, setShowClientesModal] = useState(false);
  const [showWhatsAppBusinessModal, setShowWhatsAppBusinessModal] = useState(false);
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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🐄</div>
              <div>
                <h2 className="text-2xl font-bold text-white">MANEJO</h2>
                <p className="text-green-100">Gestão completa do rebanho</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {manejoOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (option.title === "Boletim de Gado") {
                      setShowBoletimModal(true);
                      onClose(); // Fecha o modal MANEJO
                    } else if (option.title === "Nascimentos") {
                      setShowNascimentosModal(true);
                      onClose();
                    } else if (option.title === "Controle de Mortes") {
                      setShowMortesModal(true);
                      onClose();
                    } else if (option.title === "Programa FIV") {
                      setShowFIVModal(true);
                      onClose();
                    } else if (option.title === "Vacinação") {
                      setShowVacinacaoModal(true);
                      onClose();
                    } else if (option.title === "Saúde Animal") {
                      setShowSaudeModal(true);
                      onClose();
                    } else if (option.title === "Relatórios") {
                      setShowRelatoriosModal(true);
                      onClose();
                    } else if (option.title === "Transferências") {
                      setShowTransferenciasModal(true);
                      onClose();
                    }
                  }}
                  className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg cursor-pointer"
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
      { icon: "🏛️", title: "Vendas em Leilão", desc: "Gestão de leilões" },
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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">💰</div>
              <div>
                <h2 className="text-2xl font-bold text-white">COMERCIAL</h2>
                <p className="text-blue-100">Vendas e relatórios financeiros</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comercialOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (option.title === "Vendas em Leilão") {
                      setShowVendasLeilaoModal(true);
                      onClose();
                    } else if (option.title === "Relatórios de Vendas") {
                      setShowRelatoriosVendasModal(true);
                      onClose();
                    } else if (option.title === "Controle Financeiro") {
                      setShowControleFinanceiroModal(true);
                      onClose();
                    } else if (option.title === "Analytics BI") {
                      setShowAnalyticsBIModal(true);
                      onClose();
                    } else if (option.title === "Metas de Vendas") {
                      setShowMetasVendasModal(true);
                      onClose();
                    } else if (option.title === "Notas Fiscais") {
                      setShowNotasFiscaisModal(true);
                      onClose();
                    } else if (option.title === "Clientes") {
                      setShowClientesModal(true);
                      onClose();
                    } else if (option.title === "WhatsApp Business") {
                      setShowWhatsAppBusinessModal(true);
                      onClose();
                    }
                  }}
                  className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg cursor-pointer"
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
        nome: "Touro Bravo",
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
        nome: "Guerreiro",
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
        id: "N001",
        mae: "Estrela",
        pai: "Touro Bravo",
        data: "15/12/2024",
        sexo: "F",
        peso: "32kg",
        status: "Saudável",
      },
      {
        id: "N002",
        mae: "Bonita",
        pai: "Guerreiro",
        data: "12/12/2024",
        sexo: "M",
        peso: "35kg",
        status: "Saudável",
      },
      {
        id: "N003",
        mae: "Mimosa",
        pai: "Touro Bravo",
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

  // Modal CONTROLE DE MORTES
  const MortesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const mortesRecentes = [
      {
        id: "M001",
        nome: "Velho João",
        idade: "8 anos",
        data: "05/12/2024",
        causa: "Idade Avançada",
        peso: "520kg",
      },
      {
        id: "M002",
        nome: "Bezerro 123",
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

  // Modal VENDAS EM LEILÃO
  const VendasLeilaoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const leiloesRecentes = [
      { id: "L001", data: "15/12/2024", local: "Fazenda Sant'Anna", animais: 45, arrecadacao: "R$ 1.250.000", status: "Concluído" },
      { id: "L002", data: "20/12/2024", local: "Centro de Leilões", animais: 32, arrecadacao: "R$ 890.000", status: "Agendado" },
      { id: "L003", data: "10/12/2024", local: "Fazenda Sant'Anna", animais: 28, arrecadacao: "R$ 720.000", status: "Concluído" },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🏛️</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Vendas em Leilão</h2>
                <p className="text-blue-100">Gestão de leilões e vendas</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold">×</button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 2.86M</div>
                <div className="text-sm text-green-800 dark:text-green-300">Arrecadação Total</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">105</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Animais Vendidos</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">R$ 27.2K</div>
                <div className="text-sm text-purple-800 dark:text-purple-300">Preço Médio</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</div>
                <div className="text-sm text-orange-800 dark:text-orange-300">Leilões Realizados</div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🏛️ Leilões Recentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Local</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Animais</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Arrecadação</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {leiloesRecentes.map((leilao, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{leilao.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{leilao.data}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{leilao.local}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{leilao.animais}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">{leilao.arrecadacao}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={`px-2 py-1 rounded-full text-xs ${leilao.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
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
      margemLucro: "56.6%"
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">💰</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Controle Financeiro</h2>
                <p className="text-green-100">Receitas e despesas</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold">×</button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{dadosFinanceiros.receitaTotal}</div>
                <div className="text-sm text-green-800 dark:text-green-300">Receita Total</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">{dadosFinanceiros.despesaTotal}</div>
                <div className="text-sm text-red-800 dark:text-red-300">Despesa Total</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{dadosFinanceiros.lucroLiquido}</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Lucro Líquido</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{dadosFinanceiros.margemLucro}</div>
                <div className="text-sm text-purple-800 dark:text-purple-300">Margem de Lucro</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Principais Receitas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Vendas de Animais</span>
                    <span className="font-semibold text-green-600">R$ 2.650.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Serviços Veterinários</span>
                    <span className="font-semibold text-green-600">R$ 120.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Aluguel de Pastos</span>
                    <span className="font-semibold text-green-600">R$ 90.000</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📉 Principais Despesas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ração e Alimentação</span>
                    <span className="font-semibold text-red-600">R$ 680.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Medicamentos</span>
                    <span className="font-semibold text-red-600">R$ 240.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mão de Obra</span>
                    <span className="font-semibold text-red-600">R$ 320.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal RELATÓRIOS DE VENDAS
  const RelatoriosVendasModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const vendasMensais = [
      { mes: "Dezembro", vendas: 45, valor: "R$ 1.250.000", crescimento: "+12%" },
      { mes: "Novembro", vendas: 38, valor: "R$ 1.120.000", crescimento: "+8%" },
      { mes: "Outubro", vendas: 42, valor: "R$ 1.180.000", crescimento: "+15%" },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📈</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Relatórios de Vendas</h2>
                <p className="text-purple-100">Análises comerciais detalhadas</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold">×</button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">125</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Vendas Totais</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 3.55M</div>
                <div className="text-sm text-green-800 dark:text-green-300">Faturamento</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">R$ 28.4K</div>
                <div className="text-sm text-purple-800 dark:text-purple-300">Ticket Médio</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">+11.7%</div>
                <div className="text-sm text-orange-800 dark:text-orange-300">Crescimento</div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📊 Performance Mensal</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Mês</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Vendas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Valor Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Crescimento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {vendasMensais.map((venda, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{venda.mes}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{venda.vendas}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">{venda.valor}</td>
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
      { id: "C001", nome: "João Silva", cidade: "São Paulo", compras: 12, valor: "R$ 340.000", status: "VIP" },
      { id: "C002", nome: "Maria Santos", cidade: "Rio de Janeiro", compras: 8, valor: "R$ 220.000", status: "Ativo" },
      { id: "C003", nome: "Pedro Costa", cidade: "Belo Horizonte", compras: 15, valor: "R$ 450.000", status: "VIP" },
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
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold">×</button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">156</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Clientes Ativos</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">23</div>
                <div className="text-sm text-green-800 dark:text-green-300">Clientes VIP</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">R$ 22.8K</div>
                <div className="text-sm text-purple-800 dark:text-purple-300">Ticket Médio</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">89%</div>
                <div className="text-sm text-orange-800 dark:text-orange-300">Satisfação</div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">👥 Principais Clientes</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Cidade</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Compras</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Valor Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {clientesAtivos.map((cliente, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cliente.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{cliente.nome}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{cliente.cidade}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{cliente.compras}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold text-green-600">{cliente.valor}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={`px-2 py-1 rounded-full text-xs ${cliente.status === 'VIP' ? 'bg-gold-100 text-gold-800' : 'bg-blue-100 text-blue-800'}`}>
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

  // TELA PARA VISITANTES - VERSÃO SIMPLIFICADA
  if (user && user.role === "visitor") {
    return (
      <Layout>
        <div className="space-y-8">
          {/* Header de Boas-vindas para Visitante - Versão Compacta */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
            <div className="flex items-center justify-center space-x-4">
              <img
                src="/logo-fazendas-santanna.jpg"
                alt="Fazendas Sant'Anna"
                className="w-16 h-16 object-contain rounded-lg bg-white/10 p-1"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  Beef Sync - Fazendas Sant'Anna
                </h1>
                <p className="text-blue-100">
                  Escolha uma opção para explorar o sistema
                </p>
              </div>
            </div>
          </div>

          {/* Cards Principais - MANEJO e COMERCIAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card MANEJO */}
            <button
              onClick={() => setShowManejoModal(true)}
              className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🐄
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  MANEJO
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Gestão completa do rebanho
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <p>• Nascimentos</p>
                  <p>• Boletim de Gado</p>
                  <p>• Controle de Mortes</p>
                  <p>• Programa FIV</p>
                  <p>• E muito mais...</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Card COMERCIAL */}
            <button
              onClick={() => setShowComercialModal(true)}
              className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  💰
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  COMERCIAL
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Vendas e relatórios financeiros
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <p>• Vendas em Leilão</p>
                  <p>• Relatórios de Vendas</p>
                  <p>• Análises Financeiras</p>
                  <p>• Controle de Receitas</p>
                  <p>• E muito mais...</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img
                  src="/logo-fazendas-santanna.jpg"
                  alt="Fazendas Sant'Anna"
                  className="w-16 h-16 object-contain rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                🚀 Sobre o Beef Sync - Fazendas Sant'Anna
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                O Beef Sync é um sistema completo de gestão bovina desenvolvido
                especialmente para as Fazendas Sant'Anna. Oferece controle total
                sobre o manejo do rebanho e operações comerciais, com tecnologia
                avançada e interface intuitiva para facilitar a administração da
                fazenda.
              </p>
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
          onClose={() => setShowBoletimModal(false)}
        />
        <NascimentosModal
          isOpen={showNascimentosModal}
          onClose={() => setShowNascimentosModal(false)}
        />
        <MortesModal
          isOpen={showMortesModal}
          onClose={() => setShowMortesModal(false)}
        />
        <VendasLeilaoModal
          isOpen={showVendasLeilaoModal}
          onClose={() => setShowVendasLeilaoModal(false)}
        />
        <ControleFinanceiroModal
          isOpen={showControleFinanceiroModal}
          onClose={() => setShowControleFinanceiroModal(false)}
        />
        <RelatoriosVendasModal
          isOpen={showRelatoriosVendasModal}
          onClose={() => setShowRelatoriosVendasModal(false)}
        />
        <ClientesModal
          isOpen={showClientesModal}
          onClose={() => setShowClientesModal(false)}
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
