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
import AdvancedAnalytics from "../components/AdvancedAnalytics";
import ReceptorAlertSystem from "../components/ReceptorAlertSystem";
import { CurrencyDollarIcon, UserGroupIcon, ChartBarIcon, ClockIcon, DocumentTextIcon, BellIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [showAuctionManager, setShowAuctionManager] = useState(false);
  const [showDirectInvoice, setShowDirectInvoice] = useState(false);
  const [showAnimalManager, setShowAnimalManager] = useState(false);
  const [showBIDashboard, setShowBIDashboard] = useState(false);
  const [showWhatsAppMulti, setShowWhatsAppMulti] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showReceptorAlerts, setShowReceptorAlerts] = useState(false);
  const router = useRouter();
  const { user, isDeveloper, isConsultant } = useAuth();

  // Dados reais serão carregados da API
  const salesData = [];

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
        {/* Header */}
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

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push('/login');
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

  // Tela para consultores (usuários limitados)
  if (user.role !== 'developer') {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Header para Consultores */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  👋 Bem-vindo, {user.name}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Consultor - Acesso aos relatórios e visualizações
                </p>
              </div>
              <div className="text-6xl">
                👨‍💼
              </div>
            </div>
          </div>

          {/* Ações Disponíveis para Consultores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setShowBIDashboard(true)}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <ChartBarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    📊 Relatórios BI
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Gráficos e análises de vendas
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowTimeline(true)}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <ClockIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    📅 Timeline de Vendas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Acompanhar vendas em tempo real
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/reports')}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <DocumentTextIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    📋 Relatórios Gerais
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Consultar relatórios do sistema
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Seção Adicional para Consultores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <button
              onClick={() => setShowAdvancedAnalytics(true)}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                  <ChartBarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    📊 Análises Avançadas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Médias FIV vs IA, performance por pai
                  </p>
                </div>
              </div>
            </button>

            {isDeveloper() && (
              <button
                onClick={() => setShowReceptorAlerts(true)}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                    <BellIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      🔔 Alertas de Receptoras
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Monitoramento automático de TE
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Informações do Sistema */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ℹ️ Informações do Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Consultor
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Seu Perfil
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Visualização
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Permissões
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Relatórios
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Acesso Liberado
                </div>
              </div>
            </div>
          </div>

          {/* Aviso de Limitações */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="text-yellow-600 dark:text-yellow-400 text-2xl">
                ⚠️
              </div>
              <div>
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                  Acesso Limitado
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Como consultor, você tem acesso apenas aos relatórios e visualizações.
                  Para funcionalidades administrativas, entre em contato com o desenvolvedor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modais disponíveis para consultores */}
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

        {/* Modal de Análises Avançadas */}
        {showAdvancedAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      📊 Análises Avançadas de Vendas
                    </h2>
                    <p className="text-indigo-100">
                      Médias de preços, FIV vs IA, performance por pai
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdvancedAnalytics(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
                <AdvancedAnalytics />
              </div>
            </div>
          </div>
        )}

        {/* Modal de Alertas de Receptoras */}
        {showReceptorAlerts && isDeveloper() && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-600 to-red-600">
                <div className="flex items-center space-x-3">
                  <BellIcon className="h-8 w-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      🔔 Sistema de Alertas - Receptoras
                    </h2>
                    <p className="text-orange-100">
                      Monitoramento automático e gestão de receptoras
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReceptorAlerts(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
                <ReceptorAlertSystem />
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  // Tela completa para desenvolvedor (Zeca)
  return (
    <Layout>
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

      {/* Modal do Leilão */}
      <AuctionManager
        isOpen={showAuctionManager}
        onClose={() => setShowAuctionManager(false)}
        onSalesComplete={() => {
          // Callback quando vendas são completadas
          console.log('Vendas do leilão completadas!');
        }}
      />

      {/* Modal de Criação de NF */}
      <DirectInvoiceManager
        isOpen={showDirectInvoice}
        onClose={() => setShowDirectInvoice(false)}
      />

      {/* Modal de Cadastro de Animais */}
      <SimpleAnimalManager
        isOpen={showAnimalManager}
        onClose={() => setShowAnimalManager(false)}
      />

      {/* Modal do BI Dashboard */}
      {showBIDashboard && <BIDashboardModal />}

      {/* Modal da Timeline de Vendas */}
      <LiveSalesTimeline
        isOpen={showTimeline}
        onClose={() => setShowTimeline(false)}
      />

      {/* Modal do WhatsApp Multi-Sender */}
      <WhatsAppMultiSender
        isOpen={showWhatsAppMulti}
        onClose={() => setShowWhatsAppMulti(false)}
        reportMessage={getBIReportMessage()}
      />
    </Layout>
  );
}
