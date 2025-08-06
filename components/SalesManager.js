import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  PlusIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import InvoiceManager from "./InvoiceManager";

export default function SalesManager({ isOpen, onClose }) {
  const [activeView, setActiveView] = useState("menu"); // "menu", "invoice", "sales"
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const menuOptions = [
    {
      id: "invoice",
      title: "📋 Criar Nota Fiscal",
      description: "Emitir NF com dados do comprador, animais e preços",
      color: "from-blue-600 to-indigo-600",
      icon: DocumentTextIcon,
    },
    {
      id: "sales",
      title: "💰 Registrar Venda Direta",
      description: "Venda simples sem emissão de NF",
      color: "from-green-600 to-emerald-600", 
      icon: CurrencyDollarIcon,
    },
    {
      id: "history",
      title: "📊 Histórico de Vendas",
      description: "Ver todas as vendas e NFs emitidas",
      color: "from-purple-600 to-pink-600",
      icon: CalendarIcon,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center space-x-3">
            <CurrencyDollarIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                💰 Sistema de Vendas
              </h2>
              <p className="text-blue-100">
                Vendas, Notas Fiscais, Preços e Compradores
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
          {activeView === "menu" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  O que você deseja fazer?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Escolha uma das opções abaixo para gerenciar suas vendas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {menuOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveView(option.id)}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${option.color} text-white hover:scale-105 transform transition-all duration-200 shadow-xl`}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <option.icon className="h-12 w-12" />
                      <div>
                        <h4 className="text-xl font-bold mb-2">{option.title}</h4>
                        <p className="text-sm opacity-90">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Resumo Rápido */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mt-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📊 Resumo Rápido
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">NFs Emitidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Vendas Diretas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Animais Vendidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">R$ 0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Receita Total</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "invoice" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  📋 Sistema de Notas Fiscais
                </h3>
                <button
                  onClick={() => setActiveView("menu")}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Voltar ao Menu
                </button>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  📋 Sistema de Notas Fiscais
                </h4>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Dados da NF</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Número da NF"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        <option>Pendente</option>
                        <option>Emitida</option>
                        <option>Paga</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Dados do Comprador</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nome/Razão Social"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="CPF/CNPJ"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Cidade"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        <option value="">Estado...</option>
                        <option value="SP">SP</option>
                        <option value="MG">MG</option>
                        <option value="RJ">RJ</option>
                        <option value="GO">GO</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Animais da Venda</h5>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                      <option>Selecionar animal...</option>
                    </select>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Primeiro cadastre animais para poder selecioná-los aqui
                    </p>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      Cancelar
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Criar NF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "sales" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  💰 Vendas Diretas
                </h3>
                <button
                  onClick={() => setActiveView("menu")}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Voltar ao Menu
                </button>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  🚧 Em Desenvolvimento
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">
                  O sistema de vendas diretas (sem NF) está sendo desenvolvido. 
                  Por enquanto, use o sistema de Notas Fiscais para registrar suas vendas.
                </p>
              </div>
            </div>
          )}

          {activeView === "history" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  📊 Histórico de Vendas
                </h3>
                <button
                  onClick={() => setActiveView("menu")}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Voltar ao Menu
                </button>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  📈 Relatórios em Desenvolvimento
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  O histórico detalhado de vendas e relatórios estão sendo desenvolvidos. 
                  Em breve você poderá ver gráficos, estatísticas e exportar dados.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}