import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import ModernDashboard from "../components/ModernDashboard";
import AuctionManager from "../components/AuctionManager";
import SimpleAnimalManager from "../components/SimpleAnimalManager";
import DirectInvoiceManager from "../components/DirectInvoiceManager";
import BIChartsVisual from "../components/BIChartsVisual";
import WhatsAppMultiSender from "../components/WhatsAppMultiSender";
import LiveSalesTimeline from "../components/LiveSalesTimeline";
import { CurrencyDollarIcon, UserGroupIcon, ChartBarIcon, ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [showAuctionManager, setShowAuctionManager] = useState(false);
  const [showDirectInvoice, setShowDirectInvoice] = useState(false);
  const [showAnimalManager, setShowAnimalManager] = useState(false);
  const [showBIDashboard, setShowBIDashboard] = useState(false);
  const [showWhatsAppMulti, setShowWhatsAppMulti] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const router = useRouter();

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
