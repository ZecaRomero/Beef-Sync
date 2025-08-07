import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  PlusIcon, 
  TrashIcon, 
  EditIcon, 
  BeakerIcon,
  ArchiveBoxIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import SemenReports from './SemenReports';

const SemenStockManager = () => {
  const [activeTab, setActiveTab] = useState('estoque');
  const [semenStock, setSemenStock] = useState([]);
  const [containers, setContainers] = useState([]);
  const [movements, setMovements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('entrada');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterContainer, setFilterContainer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showReports, setShowReports] = useState(false);

  const [formData, setFormData] = useState({
    tipo: 'entrada',
    data: new Date().toISOString().split('T')[0],
    responsavel: '',
    observacoes: '',
    fornecedor: '',
    notaFiscal: '',
    valorTotal: '',
    nomeTouro: '',
    rg: '',
    raca: '',
    quantidadeDoses: '',
    valorUnitario: '',
    dataColeta: '',
    dataVencimento: '',
    botijaoNumero: '',
    canecaNumero: '',
    posicao: '',
    motivoSaida: '',
    destinatario: '',
    botijaoDestino: '',
    canecaDestino: '',
    posicaoDestino: '',
    quantidadeMovimentada: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stockResponse = await fetch('/api/semen-stock');
      const containersResponse = await fetch('/api/semen-containers');
      const movementsResponse = await fetch('/api/semen-movements');
      
      if (stockResponse.ok) {
        const stockData = await stockResponse.json();
        setSemenStock(Array.isArray(stockData) ? stockData : []);
      }
      
      if (containersResponse.ok) {
        const containersData = await containersResponse.json();
        setContainers(Array.isArray(containersData) ? containersData : []);
      }
      
      if (movementsResponse.ok) {
        const movementsData = await movementsResponse.json();
        setMovements(Array.isArray(movementsData) ? movementsData : []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      tipo: 'entrada',
      data: new Date().toISOString().split('T')[0],
      responsavel: '',
      observacoes: '',
      fornecedor: '',
      notaFiscal: '',
      valorTotal: '',
      nomeTouro: '',
      rg: '',
      raca: '',
      quantidadeDoses: '',
      valorUnitario: '',
      dataColeta: '',
      dataVencimento: '',
      botijaoNumero: '',
      canecaNumero: '',
      posicao: '',
      motivoSaida: '',
      destinatario: '',
      botijaoDestino: '',
      canecaDestino: '',
      posicaoDestino: '',
      quantidadeMovimentada: ''
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'reservado': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'usado': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'vencido': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredStock = semenStock.filter(item => {
    const matchesSearch = !searchTerm || 
      item.nomeTouro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rg?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.raca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesContainer = !filterContainer || 
      item.botijaoNumero === filterContainer;
    
    const matchesStatus = !filterStatus || 
      item.status === filterStatus;
    
    return matchesSearch && matchesContainer && matchesStatus;
  });

  const stockStats = {
    totalDoses: semenStock.reduce((sum, item) => sum + (item.quantidadeDisponivel || 0), 0),
    totalTouros: new Set(semenStock.map(item => item.nomeTouro)).size,
    totalBotijoes: new Set(semenStock.map(item => item.botijaoNumero)).size,
    valorTotal: semenStock.reduce((sum, item) => sum + ((item.quantidadeDisponivel || 0) * (item.valorUnitario || 0)), 0),
    dosesVencendo: 0,
    dosesVencidas: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🧬 Gestão de Estoque de Sêmen
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Controle completo com rastreabilidade por botijão e caneca
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setFormType('entrada');
              setFormData(prev => ({ ...prev, tipo: 'entrada' }));
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Entrada
          </Button>
          <Button
            onClick={() => setShowReports(true)}
            variant="outline"
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
          >
            <DocumentChartBarIcon className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stockStats.totalDoses}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Doses Disponíveis</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stockStats.totalTouros}
              </div>
              <div className="text-sm text-green-800 dark:text-green-200">Touros Diferentes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stockStats.totalBotijoes}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Botijões Ativos</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(stockStats.valorTotal)}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-200">Valor Total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensagem de dados em desenvolvimento */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-yellow-600 dark:text-yellow-400 mr-3">⚠️</div>
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
              Dados em Desenvolvimento
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              Esta funcionalidade será conectada aos dados reais da API em breve.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Relatórios */}
      {showReports && (
        <SemenReports onClose={() => setShowReports(false)} />
      )}
    </div>
  );
};

export default SemenStockManager;