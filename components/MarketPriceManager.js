import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import AnimalForm from "./AnimalForm";
import InvoiceManager from "./InvoiceManager";
import AnimalBulkImport from "./AnimalBulkImport";
import GTAImporter from "./GTAImporter";

export default function MarketPriceManager({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("animals"); // "prices", "animals" ou "invoices"
  const [prices, setPrices] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showGTAImport, setShowGTAImport] = useState(false);
  const [newPrice, setNewPrice] = useState({
    produto: "",
    preco: "",
    unidade: "R$/arroba",
    mercado: "CEPEA/ESALQ",
    fonte: "Manual",
  });

  const produtos = [
    { value: "GARROTE", label: "Garrote" },
    { value: "NOVILHA", label: "Novilha" },
    { value: "BOI_GORDO", label: "Boi Gordo" },
    { value: "VACA_GORDA", label: "Vaca Gorda" },
    { value: "BEZERRO_MACHO", label: "Bezerro Macho" },
    { value: "BEZERRA", label: "Bezerra" },
  ];

  const unidades = ["R$/arroba", "R$/cabeça", "R$/kg"];

  const mercados = ["CEPEA/ESALQ", "Mercado Regional", "B3", "Local"];

  useEffect(() => {
    if (isOpen) {
      loadPrices();
      loadAnimals();
    }
  }, [isOpen]);

  const loadPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/market-prices");
      const data = await response.json();
      setPrices(data);
    } catch (error) {
      console.error("Erro ao carregar preços:", error);
      alert("Erro ao carregar preços");
    } finally {
      setLoading(false);
    }
  };

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/animals-list");
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error("Erro ao carregar animais:", error);
      alert("Erro ao carregar animais");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrice = async () => {
    try {
      if (!newPrice.produto || !newPrice.preco) {
        alert("Produto e preço são obrigatórios");
        return;
      }

      const response = await fetch("/api/market-prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPrice),
      });

      if (response.ok) {
        setNewPrice({
          produto: "",
          preco: "",
          unidade: "R$/arroba",
          mercado: "CEPEA/ESALQ",
          fonte: "Manual",
        });
        loadPrices();
        alert("Preço salvo com sucesso!");
      } else {
        alert("Erro ao salvar preço");
      }
    } catch (error) {
      console.error("Erro ao salvar preço:", error);
      alert("Erro ao salvar preço");
    }
  };

  const handleQuickUpdate = async () => {
    alert(
      "Função de atualização rápida removida. Use o formulário manual para adicionar preços reais."
    );
  };

  const handleSaveAnimal = async (animalData) => {
    try {
      const url = editingAnimal
        ? `/api/animals/${editingAnimal.id}`
        : "/api/animals";
      const method = editingAnimal ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brinco: `${animalData.serie} ${animalData.rg}`,
          serie: animalData.serie,
          nome: animalData.nome || `${animalData.serie} ${animalData.rg}`,
          raca: animalData.raca,
          sexo: animalData.sexo === "Macho" ? "MACHO" : "FEMEA",
          dataNascimento: animalData.dataNascimento,
          status:
            animalData.situacao === "Ativo"
              ? "ATIVO"
              : animalData.situacao.toUpperCase(),
          observacoes: animalData.observacoes,
          valorVenda: animalData.valorVenda,
        }),
      });

      if (response.ok) {
        loadAnimals();
        setShowAnimalForm(false);
        setEditingAnimal(null);
        alert(
          editingAnimal
            ? "Animal atualizado com sucesso!"
            : "Animal salvo com sucesso!"
        );
      } else {
        alert("Erro ao salvar animal");
      }
    } catch (error) {
      console.error("Erro ao salvar animal:", error);
      alert("Erro ao salvar animal");
    }
  };

  const handleEditAnimal = (animal) => {
    setEditingAnimal({
      ...animal,
      serie: animal.serie || animal.brinco?.split(" ")[0] || "",
      rg: animal.rg || animal.brinco?.split(" ")[1] || "",
      sexo: animal.sexo === "MACHO" ? "Macho" : "Fêmea",
      era: animal.era || "",
      preco: animal.valorVenda || "",
      observacoes: animal.observacoes || "",
    });
    setShowAnimalForm(true);
  };

  const handleDeleteAnimal = async (animalId) => {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      try {
        const response = await fetch(`/api/animals/${animalId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          loadAnimals();
          alert("Animal excluído com sucesso!");
        } else {
          alert("Erro ao excluir animal");
        }
      } catch (error) {
        console.error("Erro ao excluir animal:", error);
        alert("Erro ao excluir animal");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="flex items-center space-x-3">
            {activeTab === "prices" ? (
              <CurrencyDollarIcon className="h-8 w-8 text-white" />
            ) : activeTab === "animals" ? (
              <UserGroupIcon className="h-8 w-8 text-white" />
            ) : (
              <DocumentTextIcon className="h-8 w-8 text-white" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {activeTab === "prices"
                  ? "Gerenciar Preços de Mercado"
                  : activeTab === "animals"
                  ? "Gestão de Animais"
                  : "Notas Fiscais de Venda"}
              </h2>
              <p className="text-green-100">
                {activeTab === "prices"
                  ? "Atualize os preços reais do mercado"
                  : activeTab === "animals"
                  ? "Cadastre e edite informações dos animais"
                  : "Controle de vendas, preços, compradores e estados"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Abas */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("prices")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activeTab === "prices"
                    ? "bg-white text-green-600 font-semibold"
                    : "text-white hover:bg-white/20"
                }`}
              >
                💰 Preços
              </button>
              <button
                onClick={() => setActiveTab("animals")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activeTab === "animals"
                    ? "bg-white text-green-600 font-semibold"
                    : "text-white hover:bg-white/20"
                }`}
              >
                🐄 Animais
              </button>
              <button
                onClick={() => setActiveTab("invoices")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activeTab === "invoices"
                    ? "bg-white text-green-600 font-semibold"
                    : "text-white hover:bg-white/20"
                }`}
              >
                📋 NF
              </button>
            </div>

            {activeTab === "prices" && (
              <button
                onClick={handleQuickUpdate}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Atualização Rápida
              </button>
            )}

            {activeTab === "animals" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingAnimal(null);
                    setShowAnimalForm(true);
                  }}
                  className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Novo
                </button>
                <button
                  onClick={() => setShowBulkImport(true)}
                  className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center text-sm"
                >
                  📊 Lote/Excel
                </button>
                <button
                  onClick={() => setShowGTAImport(true)}
                  className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center text-sm"
                >
                  📄 GTA PDF
                </button>
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === "prices" ? (
            <>
              {/* Formulário para Novo Preço */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Adicionar/Atualizar Preço
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Produto *
                    </label>
                    <select
                      value={newPrice.produto}
                      onChange={(e) =>
                        setNewPrice({ ...newPrice, produto: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                    >
                      <option value="">Selecionar...</option>
                      {produtos.map((produto) => (
                        <option key={produto.value} value={produto.value}>
                          {produto.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preço *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPrice.preco}
                      onChange={(e) =>
                        setNewPrice({ ...newPrice, preco: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unidade
                    </label>
                    <select
                      value={newPrice.unidade}
                      onChange={(e) =>
                        setNewPrice({ ...newPrice, unidade: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                    >
                      {unidades.map((unidade) => (
                        <option key={unidade} value={unidade}>
                          {unidade}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mercado
                    </label>
                    <select
                      value={newPrice.mercado}
                      onChange={(e) =>
                        setNewPrice({ ...newPrice, mercado: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                    >
                      {mercados.map((mercado) => (
                        <option key={mercado} value={mercado}>
                          {mercado}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleSavePrice}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Salvar
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de Preços Atuais */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Preços Atuais
                  </h3>
                </div>

                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin text-2xl mb-2">⏳</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Carregando preços...
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                          <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                            Produto
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                            Preço
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                            Unidade
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                            Mercado
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                            Fonte
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                            Atualizado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {prices.map((price) => (
                          <tr
                            key={price.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="p-4">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {price.produto}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="font-bold text-green-600 dark:text-green-400">
                                R${" "}
                                {price.preco.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                            </td>
                            <td className="p-4 text-center text-gray-600 dark:text-gray-400">
                              {price.unidade}
                            </td>
                            <td className="p-4 text-center text-gray-600 dark:text-gray-400">
                              {price.mercado}
                            </td>
                            <td className="p-4 text-center text-gray-600 dark:text-gray-400">
                              {price.fonte}
                            </td>
                            <td className="p-4 text-center text-gray-600 dark:text-gray-400">
                              {new Date(price.data).toLocaleString("pt-BR")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Gestão de Animais */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🐄 Animais Cadastrados ({animals.length})
                  </h3>
                  <button
                    onClick={() => {
                      setEditingAnimal(null);
                      setShowAnimalForm(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Novo Animal
                  </button>
                </div>

                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin text-2xl mb-2">⏳</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Carregando animais...
                    </div>
                  </div>
                ) : animals.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">🐄</div>
                    <div className="text-gray-600 dark:text-gray-400 mb-4">
                      Nenhum animal cadastrado
                    </div>
                    <button
                      onClick={() => {
                        setEditingAnimal(null);
                        setShowAnimalForm(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Cadastrar Primeiro Animal
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                          <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                            Série
                          </th>
                          <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                            RG
                          </th>
                          <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">
                            Sexo
                          </th>
                          <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">
                            Era (meses)
                          </th>
                          <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">
                            Preço (R$)
                          </th>
                          <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">
                            Status
                          </th>
                          <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {animals.map((animal) => (
                          <tr
                            key={animal.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="p-3">
                              <div className="font-medium text-gray-900 dark:text-white text-lg">
                                {animal.serie || animal.brinco?.split(' ')[0]}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {animal.raca}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-gray-900 dark:text-white text-lg">
                                {animal.rg || animal.brinco?.split(' ')[1]}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {animal.brinco}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  animal.sexo === "MACHO"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                                }`}
                              >
                                {animal.sexo === "MACHO" ? "🐂 Macho" : "🐄 Fêmea"}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="text-gray-900 dark:text-white font-medium">
                                {animal.era ? `${animal.era} meses` : "Não informada"}
                              </div>
                            </td>
                            <td className="p-3 text-center"></td>
                              <div className="font-bold text-green-600 dark:text-green-400">
                                {animal.valorVenda 
                                  ? `R$ ${animal.valorVenda.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` 
                                  : "Não informado"
                                }
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  animal.status === "ATIVO"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : animal.status === "VENDIDO"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}
                              >
                                {animal.status}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <button
                                  onClick={() => handleEditAnimal(animal)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                  title="Editar animal"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAnimal(animal.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                  title="Excluir animal"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Aba de Notas Fiscais */}
              <InvoiceManager isOpen={true} onClose={() => {}} />
            </>
          )}
        </div>

        {/* Modal do Formulário de Animal */}
        <AnimalForm
          animal={editingAnimal}
          isOpen={showAnimalForm}
          onClose={() => {
            setShowAnimalForm(false);
            setEditingAnimal(null);
          }}
          onSave={handleSaveAnimal}
        />

        {/* Modal de Importação em Lote */}
        <AnimalBulkImport
          isOpen={showBulkImport}
          onClose={() => setShowBulkImport(false)}
          onSave={() => {
            setShowBulkImport(false);
            loadAnimals();
          }}
        />

        {/* Modal de Importação GTA */}
        <GTAImporter
          isOpen={showGTAImport}
          onClose={() => setShowGTAImport(false)}
          onSave={() => {
            setShowGTAImport(false);
            loadAnimals();
          }}
        />
      </div>
    </div>
  );
}
