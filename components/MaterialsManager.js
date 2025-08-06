import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import AnimalProtocols from "./AnimalProtocols";
// import SmartReminders from "./SmartReminders"; // Componente não existe

export default function MaterialsManager({ userId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [materials, setMaterials] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    supplier: "all",
    dateRange: "30d",
  });

  // Carregar dados reais da API
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await fetch('/api/materials');
        if (response.ok) {
          const materialsData = await response.json();
          setMaterials(Array.isArray(materialsData) ? materialsData : []);
        } else {
          console.error('Erro ao carregar materiais');
          setMaterials([]);
        }
      } catch (error) {
        console.error('Erro ao carregar materiais:', error);
        setMaterials([]);
      }
    };
    
    loadMaterials();

    // Carregar animais reais da API
    const loadAnimals = async () => {
      try {
        const response = await fetch('/api/animals-list');
        if (response.ok) {
          const animalsData = await response.json();
          setAnimals(animalsData);
        }
      } catch (error) {
        console.error('Erro ao carregar animais:', error);
        setAnimals([]);
      }
    };
    
    loadAnimals();
  }, []);

  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "medicamento", label: "💊 Medicamentos" },
    { value: "identificacao", label: "🏷️ Identificação" },
    { value: "alimentacao", label: "🌾 Alimentação" },
    { value: "equipamento", label: "🔧 Equipamentos" },
    { value: "insumo", label: "⚗️ Insumos" },
    { value: "outros", label: "📦 Outros" },
  ];

  const suppliers = [
    { value: "all", label: "Todos os Fornecedores" },
    { value: "Agropecuária Silva", label: "Agropecuária Silva" },
    { value: "Vetfarma Ltda", label: "Vetfarma Ltda" },
    { value: "Nutrição Animal Pro", label: "Nutrição Animal Pro" },
  ];

  const tabs = [
    { id: "overview", label: "📊 Visão Geral", icon: "📊" },
    { id: "protocols", label: "🎯 Protocolos", icon: "🎯" },
    { id: "reminders", label: "🧠 Lembretes", icon: "🧠" },
    { id: "inventory", label: "📦 Estoque", icon: "📦" },
    { id: "purchases", label: "🛒 Compras", icon: "🛒" },
    { id: "reports", label: "📈 Relatórios", icon: "📈" },
  ];

  const filteredMaterials = materials.filter((material) => {
    if (filters.category !== "all" && material.category !== filters.category)
      return false;
    if (filters.supplier !== "all" && material.supplier !== filters.supplier)
      return false;
    return true;
  });

  const totalValue = filteredMaterials.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );
  const lowStockItems = materials.filter(
    (item) => item.quantity <= item.minStock
  );
  const expiringSoon = materials.filter((item) => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      medicamento: "💊",
      identificacao: "🏷️",
      alimentacao: "🌾",
      equipamento: "🔧",
      insumo: "⚗️",
      outros: "📦",
    };
    return icons[category] || "📦";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Funções de callback para o sistema de protocolos
  const handleUpdateMaterial = (materialId, updatedMaterial) => {
    setMaterials((prev) =>
      prev.map((material) =>
        material.id === materialId ? updatedMaterial : material
      )
    );
  };

  const handleCreateReminder = (reminder) => {
    const newReminder = {
      id: Date.now(),
      ...reminder,
      createdAt: new Date(),
      read: false,
    };
    setReminders((prev) => [...prev, newReminder]);

    // Aqui você pode integrar com o sistema de notificações
    console.log("Novo lembrete criado:", newReminder);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                Total em Estoque
              </p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                R${" "}
                {totalValue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="text-4xl bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              💰
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-green-800 dark:text-green-200">
                Itens Ativos
              </p>
              <p className="text-2xl font-black text-green-900 dark:text-green-100">
                {materials.length}
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </Card>

        <Card className="p-6 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                Estoque Baixo
              </p>
              <p className="text-2xl font-black text-yellow-900 dark:text-yellow-100">
                {lowStockItems.length}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </Card>

        <Card className="p-6 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-200">
                Vencendo
              </p>
              <p className="text-2xl font-black text-red-900 dark:text-red-100">
                {expiringSoon.length}
              </p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </Card>
      </div>

      {/* Protocolos Pendentes */}
      <Card className="p-6 border-2 border-gray-300 dark:border-gray-600">
        <h3 className="text-xl font-black text-black dark:text-white mb-6">
          🎯 Protocolos Inteligentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-400 dark:border-blue-600 shadow-lg">
            <div className="text-4xl mb-3 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg inline-block">
              💉
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {animals?.filter((a) => {
                const age = Math.floor(
                  (new Date() - new Date(a.birthDate)) /
                    (1000 * 60 * 60 * 24 * 30.44)
                );
                return (
                  a.gender === "F" &&
                  age >= 3 &&
                  age <= 8 &&
                  !a.protocols?.includes("brucelose")
                );
              }).length || 0}
            </div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Vacinação Brucelose
            </div>
          </div>

          <div className="text-center p-6 bg-green-200 dark:bg-green-800/50 rounded-lg border-2 border-green-400 dark:border-green-600">
            <div className="text-4xl mb-3">🏷️</div>
            <div className="text-2xl font-black text-green-900 dark:text-green-100">
              {animals?.filter((a) => {
                const age = Math.floor(
                  (new Date() - new Date(a.birthDate)) /
                    (1000 * 60 * 60 * 24 * 30.44)
                );
                return (
                  age >= 8 && age <= 12 && !a.protocols?.includes("brinco")
                );
              }).length || 0}
            </div>
            <div className="text-sm font-bold text-green-800 dark:text-green-200">
              Colocação de Brinco
            </div>
          </div>

          <div className="text-center p-6 bg-purple-200 dark:bg-purple-800/50 rounded-lg border-2 border-purple-400 dark:border-purple-600">
            <div className="text-4xl mb-3">🐛</div>
            <div className="text-2xl font-black text-purple-900 dark:text-purple-100">
              {animals?.filter((a) => {
                const age = Math.floor(
                  (new Date() - new Date(a.birthDate)) /
                    (1000 * 60 * 60 * 24 * 30.44)
                );
                return (
                  age >= 2 && age <= 4 && !a.protocols?.includes("vermifugo")
                );
              }).length || 0}
            </div>
            <div className="text-sm font-bold text-purple-800 dark:text-purple-200">
              Vermifugação
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button
            onClick={() => setActiveTab("protocols")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ver Todos os Protocolos
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderProtocols = () => (
    <AnimalProtocols
      materials={materials}
      animals={animals}
      onUpdateMaterial={handleUpdateMaterial}
      onCreateReminder={handleCreateReminder}
    />
  );

  const renderReminders = () => (
    <div className="p-6 text-center text-gray-500">
      <div className="text-4xl mb-4">🧠</div>
      <h3 className="text-lg font-semibold mb-2">Lembretes Inteligentes</h3>
      <p>Funcionalidade em desenvolvimento</p>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
            className="w-full sm:w-48"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>

          <Select
            value={filters.supplier}
            onValueChange={(value) =>
              setFilters({ ...filters, supplier: value })
            }
            className="w-full sm:w-48"
          >
            {suppliers.map((sup) => (
              <option key={sup.value} value={sup.value}>
                {sup.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            ➕ Novo Item
          </Button>
          <Button variant="outline">📤 Exportar</Button>
        </div>
      </div>

      {/* Tabela de Materiais */}
      <Card className="overflow-hidden border-2 border-gray-300 dark:border-gray-600">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Valor Unit.
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Lote
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMaterials.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getCategoryIcon(item.category)}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-black dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
                      {categories
                        .find((c) => c.value === item.category)
                        ?.label.replace(/.*\s/, "") || item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-black dark:text-white">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Mín: {item.minStock} {item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black dark:text-white">
                    R$ {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-black dark:text-white">
                    R${" "}
                    {item.totalValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black dark:text-white">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black dark:text-white">
                    {item.batchNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black dark:text-white">
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status === "active" ? "Ativo" : item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Usar Material"
                      >
                        📊
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resumo do Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {materials.length}
          </div>
          <div className="text-sm text-black dark:text-white">
            Total de Itens
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            R${" "}
            {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-black dark:text-white">Valor Total</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {lowStockItems.length}
          </div>
          <div className="text-sm text-black dark:text-white">
            Estoque Baixo
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {expiringSoon.length}
          </div>
          <div className="text-sm text-black dark:text-white">Vencendo</div>
        </Card>
      </div>
    </div>
  );

  const renderPurchases = () => {
    // Itens que precisam ser comprados (estoque baixo)
    const itemsToReorder = materials.filter(
      (item) => item.quantity <= item.minStock
    );

    // Carregar histórico de compras da API
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    
    useEffect(() => {
      const loadPurchaseHistory = async () => {
        try {
          const response = await fetch('/api/purchase-history');
          if (response.ok) {
            const historyData = await response.json();
            setPurchaseHistory(Array.isArray(historyData) ? historyData : []);
          } else {
            console.error('Erro ao carregar histórico de compras');
            setPurchaseHistory([]);
          }
        } catch (error) {
          console.error('Erro ao carregar histórico de compras:', error);
          setPurchaseHistory([]);
        }
      };
      
      loadPurchaseHistory();
    }, []);

    const getStatusColor = (status) => {
      switch (status) {
        case "entregue":
          return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
        case "pendente":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
        case "cancelado":
          return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case "entregue":
          return "✅ Entregue";
        case "pendente":
          return "⏳ Pendente";
        case "cancelado":
          return "❌ Cancelado";
        default:
          return status;
      }
    };

    return (
      <div className="space-y-6">
        {/* Alertas de Estoque Baixo */}
        {itemsToReorder.length > 0 && (
          <Card className="p-6 border-2 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20">
            <h3 className="text-xl font-black text-red-900 dark:text-red-100 mb-4 flex items-center">
              🚨 Itens com Estoque Baixo - Necessário Comprar
            </h3>

            <div className="space-y-4">
              {itemsToReorder.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-red-200 dark:border-red-700"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">
                      {getCategoryIcon(item.category)}
                    </span>
                    <div>
                      <h4 className="font-black text-black dark:text-white text-lg">
                        {item.name}
                      </h4>
                      <p className="text-sm font-bold text-red-700 dark:text-red-300">
                        Estoque atual:{" "}
                        <span className="font-black">
                          {item.quantity} {item.unit}
                        </span>{" "}
                        | Mínimo:{" "}
                        <span className="font-black">
                          {item.minStock} {item.unit}
                        </span>
                      </p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        Fornecedor: {item.supplier} | Último preço: R${" "}
                        {item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold"
                      onClick={() => {
                        const quantityNeeded = Math.max(
                          item.minStock * 2 - item.quantity,
                          item.minStock
                        );
                        alert(
                          `🛒 Sugestão de Compra:\n\nItem: ${
                            item.name
                          }\nQuantidade sugerida: ${quantityNeeded} ${
                            item.unit
                          }\nFornecedor: ${
                            item.supplier
                          }\nValor estimado: R$ ${(
                            quantityNeeded * item.unitPrice
                          ).toFixed(2)}`
                        );
                      }}
                    >
                      🛒 Comprar Agora
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50 font-bold"
                      onClick={() => {
                        alert(
                          `📞 Contato do Fornecedor:\n\n${
                            item.supplier
                          }\nTelefone: (11) 9999-9999\nEmail: vendas@${item.supplier
                            .toLowerCase()
                            .replace(/\s+/g, "")}.com.br`
                        );
                      }}
                    >
                      📞 Contatar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-300 dark:border-yellow-600">
              <h4 className="font-black text-yellow-900 dark:text-yellow-100 mb-2">
                💡 Sugestão Inteligente
              </h4>
              <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                Valor total estimado para reposição:{" "}
                <span className="font-black">
                  R${" "}
                  {itemsToReorder
                    .reduce((total, item) => {
                      const quantityNeeded = Math.max(
                        item.minStock * 2 - item.quantity,
                        item.minStock
                      );
                      return total + quantityNeeded * item.unitPrice;
                    }, 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </Card>
        )}

        {/* Histórico de Compras */}
        <Card className="p-6 border-2 border-gray-300 dark:border-gray-600">
          <h3 className="text-xl font-black text-black dark:text-white mb-6">
            📋 Histórico de Compras
          </h3>

          <div className="space-y-4">
            {purchaseHistory.map((purchase) => (
              <div
                key={purchase.id}
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-black text-black dark:text-white">
                      Compra #{purchase.id} -{" "}
                      {new Date(purchase.date).toLocaleDateString("pt-BR")}
                    </h4>
                    <p className="text-sm font-bold text-black dark:text-white">
                      Fornecedor: {purchase.supplier}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                        purchase.status
                      )}`}
                    >
                      {getStatusLabel(purchase.status)}
                    </span>
                    <p className="text-lg font-black text-black dark:text-white mt-1">
                      R${" "}
                      {purchase.totalValue.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {purchase.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📦</span>
                        <div>
                          <p className="font-bold text-black dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm font-semibold text-black dark:text-white">
                            {item.quantity} unidades × R${" "}
                            {item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-black dark:text-white">
                        R${" "}
                        {item.total.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Estatísticas de Compras */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 shadow-lg">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {purchaseHistory.length}
            </div>
            <div className="text-sm font-bold text-black dark:text-white">
              Total de Compras
            </div>
          </Card>

          <Card className="p-4 text-center border-2 border-green-300 dark:border-green-600">
            <div className="text-2xl font-black text-green-600 dark:text-green-400">
              R${" "}
              {purchaseHistory
                .reduce((sum, p) => sum + p.totalValue, 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm font-bold text-black dark:text-white">
              Valor Total Gasto
            </div>
          </Card>

          <Card className="p-4 text-center border-2 border-red-300 dark:border-red-600">
            <div className="text-2xl font-black text-red-600 dark:text-red-400">
              {itemsToReorder.length}
            </div>
            <div className="text-sm font-bold text-black dark:text-white">
              Itens p/ Comprar
            </div>
          </Card>

          <Card className="p-4 text-center border-2 border-purple-300 dark:border-purple-600">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {new Set(purchaseHistory.map((p) => p.supplier)).size}
            </div>
            <div className="text-sm font-bold text-black dark:text-white">
              Fornecedores
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Funções para mostrar itens por categoria e fornecedor
  const showCategoryItems = (category) => {
    const categoryItems = materials.filter(
      (item) => item.category === category.value
    );
    setSelectedCategory({ ...category, items: categoryItems });
  };

  const showSupplierItems = (supplier) => {
    const supplierItems = materials.filter(
      (item) => item.supplier === supplier.value
    );
    setSelectedSupplier({ ...supplier, items: supplierItems });
  };

  const renderReports = () => {
    return (
      <div className="space-y-6">
        {/* Modal para mostrar itens da categoria */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-black dark:text-white">
                    {selectedCategory.label} - {selectedCategory.items.length}{" "}
                    itens
                  </h2>
                  <Button
                    onClick={() => setSelectedCategory(null)}
                    variant="outline"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕ Fechar
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategory.items.map((item) => (
                    <Card
                      key={item.id}
                      className="p-6 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-600 p-3 rounded-lg">
                          <span className="text-3xl text-white">
                            {getCategoryIcon(item.category)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 dark:text-white text-lg">
                            {item.name}
                          </h3>
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            {item.location}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Estoque:
                            </span>
                            <span className="font-black text-blue-700 dark:text-blue-300 text-lg">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Valor Unit:
                            </span>
                            <span className="font-black text-gray-900 dark:text-white text-lg">
                              R$ {item.unitPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Valor Total:
                            </span>
                            <span className="font-black text-green-700 dark:text-green-300 text-lg">
                              R${" "}
                              {item.totalValue.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Lote:
                            </span>
                            <span className="font-black text-gray-900 dark:text-white">
                              {item.batchNumber}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Fornecedor:
                            </span>
                            <span className="font-black text-gray-900 dark:text-white">
                              {item.supplier}
                            </span>
                          </div>
                        </div>

                        {item.expiryDate && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-900 dark:text-white">
                                Vencimento:
                              </span>
                              <span className="font-black text-red-700 dark:text-red-300 text-lg">
                                {new Date(item.expiryDate).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para mostrar itens do fornecedor */}
        {selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-black dark:text-white">
                    {selectedSupplier.label} - {selectedSupplier.items.length}{" "}
                    itens
                  </h2>
                  <Button
                    onClick={() => setSelectedSupplier(null)}
                    variant="outline"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕ Fechar
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSupplier.items.map((item) => (
                    <Card
                      key={item.id}
                      className="p-6 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-600 p-3 rounded-lg">
                          <span className="text-3xl text-white">
                            {getCategoryIcon(item.category)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 dark:text-white text-lg">
                            {item.name}
                          </h3>
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            {item.location}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Categoria:
                            </span>
                            <span className="font-black text-gray-900 dark:text-white">
                              {categories
                                .find((c) => c.value === item.category)
                                ?.label.replace(/.*\s/, "") || item.category}
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Estoque:
                            </span>
                            <span className="font-black text-blue-700 dark:text-blue-300 text-lg">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Valor Total:
                            </span>
                            <span className="font-black text-green-700 dark:text-green-300 text-lg">
                              R${" "}
                              {item.totalValue.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Lote:
                            </span>
                            <span className="font-black text-gray-900 dark:text-white">
                              {item.batchNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-gray-300 dark:border-gray-600">
            <h3 className="text-xl font-black text-black dark:text-white mb-6">
              📊 Relatório por Categoria
            </h3>
            <div className="space-y-3">
              {categories.slice(1).map((category) => {
                const categoryItems = materials.filter(
                  (item) => item.category === category.value
                );
                const categoryValue = categoryItems.reduce(
                  (sum, item) => sum + item.totalValue,
                  0
                );
                return (
                  <button
                    key={category.value}
                    onClick={() => showCategoryItems(category)}
                    className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-400 bg-gray-900 dark:bg-gray-900 hover:border-blue-400 hover:bg-blue-900 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">
                        {getCategoryIcon(category.value)}
                      </span>
                      <div className="text-left">
                        <span className="font-black text-white block text-xl drop-shadow-lg">
                          {category.label.replace(/.*\s/, "")}
                        </span>
                        <span className="text-base font-bold text-gray-200 drop-shadow-lg">
                          {categoryItems.length} itens
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-green-400 block text-xl drop-shadow-lg">
                        R${" "}
                        {categoryValue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-base font-bold text-yellow-300 drop-shadow-lg">
                        👆 Clique para ver
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 border-2 border-gray-300 dark:border-gray-600">
            <h3 className="text-xl font-black text-black dark:text-white mb-6">
              🏪 Relatório por Fornecedor
            </h3>
            <div className="space-y-3">
              {suppliers.slice(1).map((supplier) => {
                const supplierItems = materials.filter(
                  (item) => item.supplier === supplier.value
                );
                const supplierValue = supplierItems.reduce(
                  (sum, item) => sum + item.totalValue,
                  0
                );
                return (
                  <button
                    key={supplier.value}
                    onClick={() => showSupplierItems(supplier)}
                    className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-400 bg-gray-900 dark:bg-gray-900 hover:border-green-400 hover:bg-green-900 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <div className="text-left">
                      <span className="font-black text-white block text-xl drop-shadow-lg">
                        {supplier.label}
                      </span>
                      <span className="text-base font-bold text-gray-200 drop-shadow-lg">
                        {supplierItems.length} itens
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-green-400 block text-xl drop-shadow-lg">
                        R${" "}
                        {supplierValue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-base font-bold text-yellow-300 drop-shadow-lg">
                        👆 Clique para ver
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center">
              <h3 className="text-xl font-black mb-2">📈 Resumo Mensal</h3>
            </div>

            <div className="text-center py-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                <div className="text-4xl font-black text-green-700 dark:text-green-300 mb-2">
                  R${" "}
                  {totalValue.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  Valor total em estoque
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white text-base">
                      💊 Medicamentos:
                    </span>
                    <span className="font-black text-red-700 dark:text-red-300 text-xl">
                      {
                        materials.filter((m) => m.category === "medicamento")
                          .length
                      }
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white text-base">
                      🏷️ Identificação:
                    </span>
                    <span className="font-black text-blue-700 dark:text-blue-300 text-xl">
                      {
                        materials.filter((m) => m.category === "identificacao")
                          .length
                      }
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white text-base">
                      🌾 Alimentação:
                    </span>
                    <span className="font-black text-green-700 dark:text-green-300 text-xl">
                      {
                        materials.filter((m) => m.category === "alimentacao")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Atualizar o renderContent para incluir as novas abas
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "protocols":
        return renderProtocols();
      case "reminders":
        return renderReminders();
      case "inventory":
        return renderInventory();
      case "purchases":
        return renderPurchases();
      case "reports":
        return renderReports();
      default:
        return renderOverview();
    }
  };

  // Modal para adicionar/editar materiais
  const AddEditModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      category: "medicamento",
      quantity: "",
      unit: "unidade",
      unitPrice: "",
      supplier: "",
      purchaseDate: "",
      expiryDate: "",
      batchNumber: "",
      location: "",
      minStock: "",
      notes: "",
    });

    useEffect(() => {
      if (editingItem) {
        setFormData({
          name: editingItem.name,
          category: editingItem.category,
          quantity: editingItem.quantity.toString(),
          unit: editingItem.unit,
          unitPrice: editingItem.unitPrice.toString(),
          supplier: editingItem.supplier,
          purchaseDate: editingItem.purchaseDate,
          expiryDate: editingItem.expiryDate || "",
          batchNumber: editingItem.batchNumber,
          location: editingItem.location,
          minStock: editingItem.minStock.toString(),
          notes: editingItem.notes || "",
        });
      }
    }, [editingItem]);

    const handleSubmit = (e) => {
      e.preventDefault();

      const newItem = {
        id: editingItem ? editingItem.id : Date.now(),
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        unitPrice: parseFloat(formData.unitPrice),
        totalValue:
          parseInt(formData.quantity) * parseFloat(formData.unitPrice),
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate || null,
        batchNumber: formData.batchNumber,
        location: formData.location,
        minStock: parseInt(formData.minStock),
        status: "active",
        notes: formData.notes,
      };

      if (editingItem) {
        setMaterials((prev) =>
          prev.map((item) => (item.id === editingItem.id ? newItem : item))
        );
      } else {
        setMaterials((prev) => [...prev, newItem]);
      }

      setShowAddModal(false);
      setEditingItem(null);
      setFormData({
        name: "",
        category: "medicamento",
        quantity: "",
        unit: "unidade",
        unitPrice: "",
        supplier: "",
        purchaseDate: "",
        expiryDate: "",
        batchNumber: "",
        location: "",
        minStock: "",
        notes: "",
      });
    };

    const units = [
      { value: "unidade", label: "Unidade" },
      { value: "frasco", label: "Frasco" },
      { value: "saco", label: "Saco" },
      { value: "kg", label: "Quilograma" },
      { value: "litro", label: "Litro" },
      { value: "ml", label: "Mililitro" },
      { value: "caixa", label: "Caixa" },
      { value: "pacote", label: "Pacote" },
      { value: "dose", label: "Dose" },
    ];

    if (!showAddModal && !editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              {editingItem ? "✏️ Editar Material" : "➕ Adicionar Material"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome do Material */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Nome do Material *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Brinco Auricular Numerado"
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Quantidade *
                </label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  placeholder="Ex: 500"
                  required
                />
              </div>

              {/* Unidade */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Unidade *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Valor Unitário */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Valor Unitário (R$) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, unitPrice: e.target.value })
                  }
                  placeholder="Ex: 2.50"
                  required
                />
              </div>

              {/* Fornecedor */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Fornecedor *
                </label>
                <Input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  placeholder="Ex: Agropecuária Silva"
                  required
                />
              </div>

              {/* Data da Compra */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Data da Compra *
                </label>
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  required
                />
              </div>

              {/* Data de Vencimento */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Data de Vencimento
                </label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </div>

              {/* Número do Lote */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Número do Lote *
                </label>
                <Input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, batchNumber: e.target.value })
                  }
                  placeholder="Ex: BR2024001"
                  required
                />
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Localização *
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Ex: Estoque Principal"
                  required
                />
              </div>

              {/* Estoque Mínimo */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Estoque Mínimo *
                </label>
                <Input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minStock: e.target.value })
                  }
                  placeholder="Ex: 100"
                  required
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Observações
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Informações adicionais sobre o material..."
                rows={3}
              />
            </div>

            {/* Valor Total Calculado */}
            {formData.quantity && formData.unitPrice && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Valor Total:
                  </span>
                  <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    R${" "}
                    {(
                      parseFloat(formData.quantity || 0) *
                      parseFloat(formData.unitPrice || 0)
                    ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingItem ? "Atualizar" : "Adicionar"} Material
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 flex items-center">
              📦 Gestão de Materiais & Custos
            </h1>
            <p className="text-lg opacity-90">
              Controle completo de estoque, medicamentos e custos operacionais
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <Button
              onClick={() => setShowAddModal(true)}
              className="border-l-indigo-500 text-purple-600 hover:bg-emerald-700 font-semibold px-6 py-3"
            >
              ➕ Adicionar Item
            </Button>
          </div>
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div className="bg-slate-500 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-red-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))} 
          </nav>
        </div>

        <div className="p-6">{renderTabContent()}</div>
      </div>

      {/* Modal de Adicionar/Editar */}
      <AddEditModal />
    </div>
  );
}
