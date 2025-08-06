import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function SalesHistory({ salesData, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    dateFrom: "",
    dateTo: "",
    minValue: "",
    maxValue: "",
    status: ""
  });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedSales, setSelectedSales] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Expandir dados de exemplo para demonstração
  const allSales = [
    ...salesData.recentSales,
    { id: 6, nf: "006", buyer: "Roberto Silva", animals: 20, value: 125000, date: "2025-07-30", state: "PR", status: "Paga" },
    { id: 7, nf: "007", buyer: "Fernanda Costa", animals: 14, value: 89000, date: "2025-07-29", state: "SC", status: "Emitida" },
    { id: 8, nf: "008", buyer: "Marcos Oliveira", animals: 18, value: 108000, date: "2025-07-28", state: "RS", status: "Pendente" },
    { id: 9, nf: "009", buyer: "Luciana Santos", animals: 9, value: 67500, date: "2025-07-27", state: "BA", status: "Paga" },
    { id: 10, nf: "010", buyer: "Eduardo Lima", animals: 25, value: 162500, date: "2025-07-26", state: "CE", status: "Emitida" },
  ];

  const filteredSales = allSales.filter(sale => {
    const matchesSearch = sale.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.nf.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !filters.state || sale.state === filters.state;
    const matchesDateFrom = !filters.dateFrom || sale.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || sale.date <= filters.dateTo;
    const matchesMinValue = !filters.minValue || sale.value >= parseInt(filters.minValue);
    const matchesMaxValue = !filters.maxValue || sale.value <= parseInt(filters.maxValue);
    const matchesStatus = !filters.status || sale.status === filters.status;

    return matchesSearch && matchesState && matchesDateFrom && 
           matchesDateTo && matchesMinValue && matchesMaxValue && matchesStatus;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "date":
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case "value":
        aValue = a.value;
        bValue = b.value;
        break;
      case "buyer":
        aValue = a.buyer.toLowerCase();
        bValue = b.buyer.toLowerCase();
        break;
      case "animals":
        aValue = a.animals;
        bValue = b.animals;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectSale = (saleId) => {
    setSelectedSales(prev => 
      prev.includes(saleId) 
        ? prev.filter(id => id !== saleId)
        : [...prev, saleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSales.length === sortedSales.length) {
      setSelectedSales([]);
    } else {
      setSelectedSales(sortedSales.map(sale => sale.id));
    }
  };

  const clearFilters = () => {
    setFilters({
      state: "",
      dateFrom: "",
      dateTo: "",
      minValue: "",
      maxValue: "",
      status: ""
    });
    setSearchTerm("");
  };

  const exportSelected = () => {
    if (selectedSales.length === 0) {
      alert("Selecione pelo menos uma venda para exportar");
      return;
    }
    alert(`Exportando ${selectedSales.length} vendas selecionadas`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paga":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Emitida":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            📚 Histórico de Vendas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredSales.length} de {allSales.length} vendas
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportSelected}
            disabled={selectedSales.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Exportar ({selectedSales.length})
          </button>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por comprador ou NF..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                showFilters 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filtros
            </button>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="date-desc">Data (Mais recente)</option>
              <option value="date-asc">Data (Mais antiga)</option>
              <option value="value-desc">Valor (Maior)</option>
              <option value="value-asc">Valor (Menor)</option>
              <option value="buyer-asc">Comprador (A-Z)</option>
              <option value="buyer-desc">Comprador (Z-A)</option>
              <option value="animals-desc">Animais (Mais)</option>
              <option value="animals-asc">Animais (Menos)</option>
            </select>
          </div>
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({...filters, state: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todos</option>
                  <option value="SP">SP</option>
                  <option value="MG">MG</option>
                  <option value="GO">GO</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="PR">PR</option>
                  <option value="SC">SC</option>
                  <option value="RS">RS</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor Mín.
                </label>
                <input
                  type="number"
                  value={filters.minValue}
                  onChange={(e) => setFilters({...filters, minValue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="R$ 0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor Máx.
                </label>
                <input
                  type="number"
                  value={filters.maxValue}
                  onChange={(e) => setFilters({...filters, maxValue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="R$ 999999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todos</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Emitida">Emitida</option>
                  <option value="Paga">Paga</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resumo dos Filtros */}
      {filteredSales.length !== allSales.length && (
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-800 dark:text-blue-200">
                Mostrando {filteredSales.length} de {allSales.length} vendas
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
            >
              Remover filtros
            </button>
          </div>
        </div>
      )}

      {/* Tabela de Vendas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedSales.length === sortedSales.length && sortedSales.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">NF</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Data</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Comprador</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Estado</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Animais</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Valor</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedSales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedSales.includes(sale.id)}
                      onChange={() => handleSelectSale(sale.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      #{sale.nf}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {new Date(sale.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {sale.buyer}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                        {sale.state}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {sale.animals}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-bold text-green-600 dark:text-green-400">
                        R$ {sale.value.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => alert(`Visualizar venda ${sale.nf}`)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Editar venda ${sale.nf}`)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir venda ${sale.nf}?`)) {
                            alert(`Venda ${sale.nf} excluída`);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        title="Excluir"
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

        {sortedSales.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              Nenhuma venda encontrada com os filtros aplicados
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas dos Resultados */}
      {filteredSales.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📊 Estatísticas dos Resultados
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredSales.length}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                Vendas Filtradas
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filteredSales.reduce((sum, sale) => sum + sale.animals, 0)}
              </div>
              <div className="text-sm text-green-800 dark:text-green-200">
                Total de Animais
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                R$ {filteredSales.reduce((sum, sale) => sum + sale.value, 0).toLocaleString()}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-200">
                Receita Total
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                R$ {Math.round(filteredSales.reduce((sum, sale) => sum + sale.value, 0) / filteredSales.length).toLocaleString()}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-200">
                Valor Médio
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}