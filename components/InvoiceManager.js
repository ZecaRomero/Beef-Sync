import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function InvoiceManager({ isOpen, onClose }) {
  const [invoices, setInvoices] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [newInvoice, setNewInvoice] = useState({
    numero: "",
    compradorId: "",
    compradorNome: "",
    compradorCpfCnpj: "",
    compradorEndereco: "",
    compradorCidade: "",
    compradorEstado: "",
    compradorCep: "",
    animais: [],
    valorTotal: 0,
    dataVenda: new Date().toISOString().split("T")[0],
    observacoes: "",
    status: "PENDENTE",
  });

  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  useEffect(() => {
    if (isOpen) {
      loadInvoices();
      loadAnimals();
    }
  }, [isOpen]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/invoices");

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar notas fiscais:", error);
      setError("Erro ao carregar notas fiscais. Verifique sua conexão.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnimals = async () => {
    try {
      const response = await fetch("/api/animals-list");

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // Filtrar apenas animais ativos e com dados válidos
      const activeAnimals = Array.isArray(data)
        ? data.filter(
            (animal) =>
              animal &&
              animal.status === "ATIVO" &&
              animal.brinco &&
              animal.nome
          )
        : [];

      setAnimals(activeAnimals);
    } catch (error) {
      console.error("Erro ao carregar animais:", error);
      setAnimals([]);
    }
  };

  const handleSaveInvoice = async () => {
    try {
      // Validações mais robustas
      const validationErrors = [];

      if (!newInvoice.numero?.trim()) {
        validationErrors.push("Número da NF é obrigatório");
      }

      if (!newInvoice.compradorNome?.trim()) {
        validationErrors.push("Nome do comprador é obrigatório");
      }

      if (!newInvoice.animais || newInvoice.animais.length === 0) {
        validationErrors.push("Pelo menos um animal deve ser selecionado");
      }

      if (!newInvoice.dataVenda) {
        validationErrors.push("Data da venda é obrigatória");
      }

      if (validationErrors.length > 0) {
        alert("Erros de validação:\n" + validationErrors.join("\n"));
        return;
      }

      setLoading(true);

      const response = await fetch("/api/invoices", {
        method: editingInvoice ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newInvoice,
          id: editingInvoice?.id,
          // Garantir que valores numéricos estão corretos
          valorTotal: parseFloat(newInvoice.valorTotal) || 0,
          animais: newInvoice.animais.map((animal) => ({
            ...animal,
            preco: parseFloat(animal.preco) || 0,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      resetForm();
      await loadInvoices();
      alert(
        editingInvoice
          ? "Nota fiscal atualizada com sucesso!"
          : "Nota fiscal criada com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao salvar NF:", error);
      alert(`Erro ao salvar nota fiscal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewInvoice({
      numero: "",
      compradorId: "",
      compradorNome: "",
      compradorCpfCnpj: "",
      compradorEndereco: "",
      compradorCidade: "",
      compradorEstado: "",
      compradorCep: "",
      animais: [],
      valorTotal: 0,
      dataVenda: new Date().toISOString().split("T")[0],
      observacoes: "",
      status: "PENDENTE",
    });
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleAddAnimal = (animalId) => {
    const animal = animals.find((a) => a.id === parseInt(animalId));
    if (animal && !newInvoice.animais.find((a) => a.id === animal.id)) {
      const updatedAnimals = [
        ...newInvoice.animais,
        {
          id: animal.id,
          brinco: animal.brinco,
          nome: animal.nome,
          raca: animal.raca,
          sexo: animal.sexo,
          preco: animal.valorVenda || 0,
        },
      ];

      const valorTotal = updatedAnimals.reduce(
        (sum, a) => sum + (a.preco || 0),
        0
      );

      setNewInvoice({
        ...newInvoice,
        animais: updatedAnimals,
        valorTotal,
      });
    }
  };

  const handleRemoveAnimal = (animalId) => {
    const updatedAnimals = newInvoice.animais.filter((a) => a.id !== animalId);
    const valorTotal = updatedAnimals.reduce(
      (sum, a) => sum + (a.preco || 0),
      0
    );

    setNewInvoice({
      ...newInvoice,
      animais: updatedAnimals,
      valorTotal,
    });
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setNewInvoice(invoice);
    setShowForm(true);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir esta nota fiscal?\n\nEsta ação não pode ser desfeita e os animais voltarão ao status ATIVO."
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      await loadInvoices();
      await loadAnimals(); // Recarregar animais pois alguns podem ter voltado ao status ATIVO
      alert("Nota fiscal excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir NF:", error);
      alert(`Erro ao excluir nota fiscal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                📋 Gestão de Notas Fiscais
              </h2>
              <p className="text-blue-100">
                Controle de vendas, preços, compradores e estados
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setEditingInvoice(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nova NF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {showForm ? (
            /* Formulário de NF */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingInvoice ? "Editar Nota Fiscal" : "Nova Nota Fiscal"}
                </h3>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>

              {/* Dados da NF */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dados da Nota Fiscal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número da NF *
                    </label>
                    <input
                      type="text"
                      value={newInvoice.numero}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, numero: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="Ex: 001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data da Venda *
                    </label>
                    <input
                      type="date"
                      value={newInvoice.dataVenda}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          dataVenda: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={newInvoice.status}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    >
                      <option value="PENDENTE">Pendente</option>
                      <option value="EMITIDA">Emitida</option>
                      <option value="PAGA">Paga</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dados do Comprador */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Dados do Comprador
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome/Razão Social *
                    </label>
                    <input
                      type="text"
                      value={newInvoice.compradorNome}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          compradorNome: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="Nome do comprador"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CPF/CNPJ
                    </label>
                    <input
                      type="text"
                      value={newInvoice.compradorCpfCnpj}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");

                        // Formatação automática CPF/CNPJ
                        if (value.length <= 11) {
                          // CPF: 000.000.000-00
                          value = value.replace(/(\d{3})(\d)/, "$1.$2");
                          value = value.replace(/(\d{3})(\d)/, "$1.$2");
                          value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                        } else {
                          // CNPJ: 00.000.000/0000-00
                          value = value.replace(/(\d{2})(\d)/, "$1.$2");
                          value = value.replace(/(\d{3})(\d)/, "$1.$2");
                          value = value.replace(/(\d{3})(\d)/, "$1/$2");
                          value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
                        }

                        setNewInvoice({
                          ...newInvoice,
                          compradorCpfCnpj: value,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      maxLength="18"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={newInvoice.compradorEndereco}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          compradorEndereco: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="Rua, número, bairro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={newInvoice.compradorCidade}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          compradorCidade: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="Nome da cidade"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estado
                      </label>
                      <select
                        value={newInvoice.compradorEstado}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            compradorEstado: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      >
                        <option value="">Selecionar...</option>
                        {estados.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CEP
                      </label>
                      <input
                        type="text"
                        value={newInvoice.compradorCep}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          // Formatação CEP: 00000-000
                          value = value.replace(/(\d{5})(\d)/, "$1-$2");

                          setNewInvoice({
                            ...newInvoice,
                            compradorCep: value,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                        placeholder="00000-000"
                        maxLength="9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seleção de Animais */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🐄 Animais da Venda
                </h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adicionar Animal
                  </label>
                  {animals.length === 0 ? (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center text-yellow-800 dark:text-yellow-200">
                        <span className="text-xl mr-2">⚠️</span>
                        <span>Nenhum animal ativo disponível para venda</span>
                      </div>
                    </div>
                  ) : (
                    <select
                      onChange={(e) => handleAddAnimal(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    >
                      <option value="">
                        {animals.filter(
                          (animal) =>
                            !newInvoice.animais.find((a) => a.id === animal.id)
                        ).length === 0
                          ? "Todos os animais já foram selecionados"
                          : "Selecionar animal..."}
                      </option>
                      {animals
                        .filter(
                          (animal) =>
                            !newInvoice.animais.find((a) => a.id === animal.id)
                        )
                        .map((animal) => (
                          <option key={animal.id} value={animal.id}>
                            {animal.brinco || "S/N"} -{" "}
                            {animal.nome || "Sem nome"} -{" "}
                            {animal.raca || "Sem raça"} - {animal.sexo || "N/I"}{" "}
                            - R${" "}
                            {(animal.valorVenda || 0).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                {/* Lista de Animais Selecionados */}
                {newInvoice.animais.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      Animais Selecionados:
                    </h5>
                    {newInvoice.animais.map((animal) => (
                      <div
                        key={animal.id}
                        className="flex items-center justify-between bg-white dark:bg-gray-600 p-3 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="font-medium">{animal.brinco}</span>
                          <span className="text-gray-600 dark:text-gray-300 ml-2">
                            {animal.nome} - {animal.raca} - {animal.sexo}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={animal.preco}
                            onChange={(e) => {
                              const updatedAnimals = newInvoice.animais.map(
                                (a) =>
                                  a.id === animal.id
                                    ? {
                                        ...a,
                                        preco: parseFloat(e.target.value) || 0,
                                      }
                                    : a
                              );
                              const valorTotal = updatedAnimals.reduce(
                                (sum, a) => sum + (a.preco || 0),
                                0
                              );
                              setNewInvoice({
                                ...newInvoice,
                                animais: updatedAnimals,
                                valorTotal,
                              });
                            }}
                            className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Preço"
                          />
                          <button
                            onClick={() => handleRemoveAnimal(animal.id)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        Total: R${" "}
                        {newInvoice.valorTotal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Observações */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Observações
                </h4>
                <textarea
                  value={newInvoice.observacoes}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      observacoes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  rows="3"
                  placeholder="Observações adicionais sobre a venda..."
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveInvoice}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading && <span className="animate-spin mr-2">⏳</span>}
                  {editingInvoice ? "Atualizar NF" : "Criar NF"}
                </button>
              </div>
            </div>
          ) : (
            /* Lista de NFs */
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📋 Notas Fiscais ({invoices.length})
                  </h3>
                  <button
                    onClick={() => {
                      setEditingInvoice(null);
                      setShowForm(true);
                    }}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nova NF
                  </button>
                </div>

                {invoices.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="text-green-600 dark:text-green-400 font-semibold">
                        Valor Total
                      </div>
                      <div className="text-green-800 dark:text-green-200 font-bold">
                        R${" "}
                        {invoices
                          .reduce((sum, inv) => sum + (inv.valorTotal || 0), 0)
                          .toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-blue-600 dark:text-blue-400 font-semibold">
                        Animais Vendidos
                      </div>
                      <div className="text-blue-800 dark:text-blue-200 font-bold">
                        {invoices.reduce(
                          (sum, inv) => sum + (inv.animais?.length || 0),
                          0
                        )}
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        Pendentes
                      </div>
                      <div className="text-yellow-800 dark:text-yellow-200 font-bold">
                        {
                          invoices.filter((inv) => inv.status === "PENDENTE")
                            .length
                        }
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <div className="text-purple-600 dark:text-purple-400 font-semibold">
                        Emitidas
                      </div>
                      <div className="text-purple-800 dark:text-purple-200 font-bold">
                        {
                          invoices.filter((inv) => inv.status === "EMITIDA")
                            .length
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin text-2xl mb-2">⏳</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Carregando notas fiscais...
                  </div>
                </div>
              ) : invoices.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <div className="text-gray-600 dark:text-gray-400 mb-4">
                    Nenhuma nota fiscal cadastrada
                  </div>
                  <button
                    onClick={() => {
                      setEditingInvoice(null);
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Criar Primeira NF
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                          NF
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                          Comprador
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                          Estado
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                          Animais
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                          Valor Total
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                          Data
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="p-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              #{invoice.numero}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-900 dark:text-white font-medium">
                              {invoice.compradorNome || "Nome não informado"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {invoice.compradorCidade &&
                              invoice.compradorEstado
                                ? `${invoice.compradorCidade} - ${invoice.compradorEstado}`
                                : "Localização não informada"}
                            </div>
                            {invoice.compradorCpfCnpj && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {invoice.compradorCpfCnpj}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                              {invoice.compradorEstado}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-medium">
                              {invoice.animais?.length || 0}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="font-bold text-green-600 dark:text-green-400">
                              R${" "}
                              {invoice.valorTotal?.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              }) || "0,00"}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                invoice.status === "EMITIDA"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : invoice.status === "PAGA"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  : invoice.status === "CANCELADA"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                          <td className="p-4 text-center text-gray-600 dark:text-gray-400">
                            {new Date(invoice.dataVenda).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleEditInvoice(invoice)}
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                title="Editar NF"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                title="Excluir NF"
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
          )}
        </div>
      </div>
    </div>
  );
}
