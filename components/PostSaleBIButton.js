import { useState } from "react";
import { Button } from "./ui/button";
import { ChartBarIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function PostSaleBIButton({ salesData, onClose }) {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const handleSendWhatsApp = async () => {
    if (!whatsappNumber) {
      setShowWhatsAppModal(true);
      return;
    }

    const totalAnimals = salesData?.length || 0;
    const totalValue = salesData?.reduce((sum, sale) => sum + (sale.valor || 0), 0) || 0;
    const avgPrice = totalAnimals > 0 ? totalValue / totalAnimals : 0;

    const message = `
🐄 *RELATÓRIO FINAL DE VENDAS*

📊 *RESUMO GERAL*
• Total de Animais: ${totalAnimals}
• Animais Vendidos: ${totalAnimals}
• Taxa de Venda: 100.0%
• Receita Total: R$ ${totalValue.toLocaleString('pt-BR')}
• Preço Médio: R$ ${avgPrice.toLocaleString('pt-BR')}

📈 *ANÁLISE POR SÉRIE*
• CJCJ: ${salesData?.filter(s => s.serie === 'CJCJ').length || 0} animais
• BENT: ${salesData?.filter(s => s.serie === 'BENT').length || 0} animais
• CJCG: ${salesData?.filter(s => s.serie === 'CJCG').length || 0} animais

🏆 *DESTAQUES*
• Maior Lance: R$ ${Math.max(...(salesData?.map(s => s.valor) || [0])).toLocaleString('pt-BR')}
• Menor Lance: R$ ${Math.min(...(salesData?.map(s => s.valor) || [0])).toLocaleString('pt-BR')}

📅 *CRONOGRAMA CUMPRIDO*
• ✅ Abertura: 08:00
• ✅ Início dos Lances: 09:00
• ✅ Animais FIV: 15:00
• ✅ Encerramento: 17:00

🎉 *LEILÃO FINALIZADO COM SUCESSO!*

---
🤖 Beef Sync - Gestão Bovina Inteligente 🐄
    `.trim();

    try {
      const response = await fetch('/api/whatsapp/send-bi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: whatsappNumber,
          message: message
        })
      });

      if (response.ok) {
        alert('Relatório final enviado via WhatsApp com sucesso!');
        setShowWhatsAppModal(false);
        if (onClose) onClose();
      } else {
        alert('Erro ao enviar relatório via WhatsApp');
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      alert('Erro ao enviar relatório via WhatsApp');
    }
  };

  const WhatsAppModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          📱 Enviar Relatório Final do Leilão
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número do WhatsApp
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+55 11 99999-9999"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
          <p className="text-sm text-green-700 dark:text-green-300">
            📊 Relatório incluirá: {salesData?.length || 0} vendas, receita total de R$ {(salesData?.reduce((sum, sale) => sum + (sale.valor || 0), 0) || 0).toLocaleString('pt-BR')}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowWhatsAppModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendWhatsApp}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-xl shadow-2xl">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold mb-2">🎉 Leilão Finalizado!</h3>
          <p className="text-green-100">
            {salesData?.length || 0} animais vendidos com sucesso
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => setShowWhatsAppModal(true)}
            className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 text-lg font-semibold"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            📱 Enviar Relatório BI
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-green-600 px-6 py-3"
          >
            Fechar
          </Button>
        </div>
      </div>

      {/* Modal do WhatsApp */}
      {showWhatsAppModal && <WhatsAppModal />}
    </>
  );
}