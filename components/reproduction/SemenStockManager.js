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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint, payload;
      const method = editingItem ? 'PUT' : 'POST';
      
      if (formData.tipo === 'entrada') {
        endpoint = '/api/semen-stock';
        payload = {
          nomeTouro: formData.nomeTouro,
          rg: formData.rg,
          raca: formData.raca,
          fornecedor: formData.fornecedor,
          notaFiscal: formData.notaFiscal,
          quantidadeDoses: formData.quantidadeDoses,
          valorUnitario: formData.valorUnitario,
          dataColeta: formData.dataColeta,
          dataVencimento: formData.dataVencimento,
          botijaoNumero: formData.botijaoNumero,
          canecaNumero: formData.canecaNumero,
          posicao: formData.posicao,
          responsavel: formData.responsavel,
          observacoes: formData.observacoes
        };
      } else {
        endpoint = '/api/semen-movements';
        payload = {
          tipo: formData.tipo.toUpperCase(),
          responsavel: formData.responsavel,
          quantidade: formData.quantidadeMovimentada || 1,
          motivo: formData.motivoSaida,
          destinatario: formData.destinatario,
          observacoes: formData.observacoes,
          nomeTouro: formData.nomeTouro,
          rg: formData.rg
        };
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadData();
        resetForm();
        alert(`${formData.tipo === 'entrada' ? 'Entrada' : 'Movimentação'} registrada com sucesso!`);
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar dados: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar dados');
    }
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

  const getExpiryStatus = (dataVencimento) => {
    if (!dataVencimento) return 'sem-data';
    
    const today = new Date();
    const expiry = new Date(dataVencimento);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'vencido';
    if (diffDays <= 30) return 'vencendo';
    return 'ok';
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
    dosesVencendo: semenStock.filter(item => getExpiryStatus(item.dataVencimento) === 'vencendo').length,
    dosesVencidas: semenStock.filter(item => getExpiryStatus(item.dataVencimento) === 'vencido').length
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
            onClick={() => {
              setFormType('saida');
              setFormData(prev => ({ ...prev, tipo: 'saida' }));
              setShowForm(true);
            }}
            variant="outline"
          >
            <ArrowRightIcon className="h-4 w-4 mr-2" />
            Registrar Saída
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

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'estoque', name: 'Estoque Atual', icon: ArchiveBoxIcon },
            { id: 'botijoes', name: 'Botijões', icon: BeakerIcon },
            { id: 'movimentacoes', name: 'Movimentações', icon: DocumentTextIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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

        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stockStats.dosesVencendo}
              </div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">Vencendo (30d)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stockStats.dosesVencidas}
              </div>
              <div className="text-sm text-red-800 dark:text-red-200">Vencidas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      {activeTab === 'estoque' && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por touro, RG, raça..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterContainer}
              onChange={(e) => setFilterContainer(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os botijões</option>
              {[...new Set(semenStock.map(item => item.botijaoNumero))].map(botijao => (
                <option key={botijao} value={botijao}>Botijão {botijao}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os status</option>
              <option value="disponivel">Disponível</option>
              <option value="reservado">Reservado</option>
              <option value="usado">Usado</option>
              <option value="vencido">Vencido</option>
            </select>

            <Button
              onClick={() => {
                setSearchTerm('');
                setFilterContainer('');
                setFilterStatus('');
              }}
              variant="outline"
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>
      )}

      {/* Conteúdo das Tabs */}
      {activeTab === 'estoque' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStock.map((item) => {
            const expiryStatus = getExpiryStatus(item.dataVencimento);
            
            return (
              <Card key={item.id} className="relative">
                <CardContent className="pt-4">
                  {/* Status de vencimento */}
                  {expiryStatus === 'vencido' && (
                    <div className="absolute top-2 right-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                  {expiryStatus === 'vencendo' && (
                    <div className="absolute top-2 right-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Cabeçalho */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {item.nomeTouro}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.raca} • RG: {item.rg}
                        </p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>

                    {/* Localização */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <BeakerIcon className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Localização</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Botijão:</span>
                          <div className="font-medium">{item.botijaoNumero}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Caneca:</span>
                          <div className="font-medium">{item.canecaNumero}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Posição:</span>
                          <div className="font-medium">{item.posicao}</div>
                        </div>
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Doses:</span>
                        <div className="font-medium">{item.quantidadeDisponivel}/{item.quantidadeTotal}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Valor/Dose:</span>
                        <div className="font-medium">{formatCurrency(item.valorUnitario)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Fornecedor:</span>
                        <div className="font-medium truncate">{item.fornecedor}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Vencimento:</span>
                        <div className={`font-medium ${
                          expiryStatus === 'vencido' ? 'text-red-600' : 
                          expiryStatus === 'vencendo' ? 'text-yellow-600' : 
                          'text-gray-900 dark:text-white'
                        }`}>
                          {item.dataVencimento ? new Date(item.dataVencimento).toLocaleDateString('pt-BR') : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFormType('saida');
                            setFormData(prev => ({ 
                              ...prev, 
                              tipo: 'saida',
                              nomeTouro: item.nomeTouro,
                              rg: item.rg,
                              botijaoNumero: item.botijaoNumero,
                              canecaNumero: item.canecaNumero,
                              posicao: item.posicao
                            }));
                            setShowForm(true);
                          }}
                          className="text-xs"
                        >
                          <ArrowRightIcon className="h-3 w-3 mr-1" />
                          Usar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFormType('transferencia');
                            setFormData(prev => ({ 
                              ...prev, 
                              tipo: 'transferencia',
                              nomeTouro: item.nomeTouro,
                              rg: item.rg,
                              botijaoNumero: item.botijaoNumero,
                              canecaNumero: item.canecaNumero,
                              posicao: item.posicao
                            }));
                            setShowForm(true);
                          }}
                          className="text-xs"
                        >
                          <ArrowLeftIcon className="h-3 w-3 mr-1" />
                          Mover
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Entrada: {new Date(item.dataEntrada).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab Botijões */}
      {activeTab === 'botijoes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {containers.map((container) => (
            <Card key={container.id}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Botijão {container.botijaoNumero}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {container.marca} {container.modelo}
                      </p>
                    </div>
                    <Badge className={getStatusColor(container.status)}>
                      {container.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Capacidade:</span>
                      <div className="font-medium">{container.capacidade} doses</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Temperatura:</span>
                      <div className="font-medium">{container.temperatura}°C</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Nitrogênio:</span>
                      <div className="font-medium">{container.nivelNitrogeno}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Canecas:</span>
                      <div className="font-medium">{container.canecas?.length || 0}</div>
                    </div>
                  </div>

                  {container.canecas && container.canecas.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Canecas:</h4>
                      {container.canecas.map((caneca) => (
                        <div key={caneca.id} className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-xs">
                          <div className="flex justify-between">
                            <span>{caneca.numero}</span>
                            <span>{caneca.ocupacao}/{caneca.capacidade}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab Movimentações */}
      {activeTab === 'movimentacoes' && (
        <div className="space-y-4">
          {movements.map((movement) => (
            <Card key={movement.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        movement.tipo === 'entrada' ? 'bg-green-100 text-green-800' :
                        movement.tipo === 'saida' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {movement.tipo.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{movement.nomeTouro}</span>
                      <span className="text-sm text-gray-500">RG: {movement.rg}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{movement.quantidade}</span> doses • 
                      <span className="ml-1">{movement.responsavel}</span> • 
                      <span className="ml-1">{new Date(movement.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {movement.motivo && (
                      <div className="text-sm text-gray-500">
                        Motivo: {movement.motivo}
                      </div>
                    )}
                    {movement.observacoes && (
                      <div className="text-sm text-gray-500">
                        {movement.observacoes}
                      </div>
                    )}
                  </div>
                  {movement.valorUnitario > 0 && (
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(movement.valorUnitario)}</div>
                      <div className="text-sm text-gray-500">por dose</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formulário Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center space-x-3">
                <BeakerIcon className="h-8 w-8 text-white" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {formType === 'entrada' ? '📥 Nova Entrada de Sêmen' : 
                     formType === 'saida' ? '📤 Registrar Saída' : 
                     '🔄 Transferir Localização'}
                  </h2>
                  <p className="text-blue-100">
                    {formType === 'entrada' ? 'Registrar nova aquisição com localização' : 
                     formType === 'saida' ? 'Registrar uso ou saída do estoque' : 
                     'Mover doses para nova localização'}
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Gerais */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Dados Gerais
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data *
                      </Label>
                      <Input
                        type="date"
                        value={formData.data}
                        onChange={(e) => handleInputChange('data', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Responsável *
                      </Label>
                      <Input
                        value={formData.responsavel}
                        onChange={(e) => handleInputChange('responsavel', e.target.value)}
                        placeholder="Nome do responsável"
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de Operação
                      </Label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => handleInputChange('tipo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      >
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                        <option value="transferencia">Transferência</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Campos específicos para entrada */}
                {formData.tipo === 'entrada' && (
                  <>
                    {/* Dados da Compra */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Dados da Compra
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fornecedor *
                          </Label>
                          <Input
                            value={formData.fornecedor}
                            onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                            placeholder="Central de Sêmen XYZ"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nota Fiscal
                          </Label>
                          <Input
                            value={formData.notaFiscal}
                            onChange={(e) => handleInputChange('notaFiscal', e.target.value)}
                            placeholder="NF-123456"
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Valor Total (R$)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.valorTotal}
                            onChange={(e) => handleInputChange('valorTotal', e.target.value)}
                            placeholder="5000.00"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dados do Touro */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Dados do Touro
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nome do Touro *
                          </Label>
                          <Input
                            value={formData.nomeTouro}
                            onChange={(e) => handleInputChange('nomeTouro', e.target.value)}
                            placeholder="Touro Alpha"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            RG *
                          </Label>
                          <Input
                            value={formData.rg}
                            onChange={(e) => handleInputChange('rg', e.target.value)}
                            placeholder="123456789"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Raça *
                          </Label>
                          <Input
                            value={formData.raca}
                            onChange={(e) => handleInputChange('raca', e.target.value)}
                            placeholder="Nelore"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantidade de Doses *
                          </Label>
                          <Input
                            type="number"
                            value={formData.quantidadeDoses}
                            onChange={(e) => handleInputChange('quantidadeDoses', e.target.value)}
                            placeholder="50"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Valor por Dose (R$)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.valorUnitario}
                            onChange={(e) => handleInputChange('valorUnitario', e.target.value)}
                            placeholder="100.00"
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data da Coleta
                          </Label>
                          <Input
                            type="date"
                            value={formData.dataColeta}
                            onChange={(e) => handleInputChange('dataColeta', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data de Vencimento
                          </Label>
                          <Input
                            type="date"
                            value={formData.dataVencimento}
                            onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Localização */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <BeakerIcon className="h-5 w-5 mr-2" />
                    {formData.tipo === 'transferencia' ? 'Nova Localização' : 'Localização no Estoque'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número do Botijão *
                      </Label>
                      <Input
                        value={formData.tipo === 'transferencia' ? formData.botijaoDestino : formData.botijaoNumero}
                        onChange={(e) => handleInputChange(
                          formData.tipo === 'transferencia' ? 'botijaoDestino' : 'botijaoNumero', 
                          e.target.value
                        )}
                        placeholder="001"
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número da Caneca *
                      </Label>
                      <Input
                        value={formData.tipo === 'transferencia' ? formData.canecaDestino : formData.canecaNumero}
                        onChange={(e) => handleInputChange(
                          formData.tipo === 'transferencia' ? 'canecaDestino' : 'canecaNumero', 
                          e.target.value
                        )}
                        placeholder="A1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Posição na Caneca
                      </Label>
                      <Input
                        value={formData.tipo === 'transferencia' ? formData.posicaoDestino : formData.posicao}
                        onChange={(e) => handleInputChange(
                          formData.tipo === 'transferencia' ? 'posicaoDestino' : 'posicao', 
                          e.target.value
                        )}
                        placeholder="1-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Campos específicos para saída */}
                {formData.tipo === 'saida' && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Dados da Saída
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Motivo da Saída *
                        </Label>
                        <select
                          value={formData.motivoSaida}
                          onChange={(e) => handleInputChange('motivoSaida', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          required
                        >
                          <option value="">Selecionar motivo</option>
                          <option value="inseminacao">Inseminação</option>
                          <option value="venda">Venda</option>
                          <option value="descarte">Descarte</option>
                          <option value="transferencia">Transferência</option>
                          <option value="vencimento">Vencimento</option>
                          <option value="outros">Outros</option>
                        </select>
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Destinatário/Animal
                        </Label>
                        <Input
                          value={formData.destinatario}
                          onChange={(e) => handleInputChange('destinatario', e.target.value)}
                          placeholder="Nome do animal ou destinatário"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quantidade *
                        </Label>
                        <Input
                          type="number"
                          value={formData.quantidadeMovimentada}
                          onChange={(e) => handleInputChange('quantidadeMovimentada', e.target.value)}
                          placeholder="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Observações */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Observações
                  </h4>
                  <Textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Observações adicionais sobre a operação..."
                    rows="3"
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {formData.tipo === 'entrada' ? 'Registrar Entrada' : 
                     formData.tipo === 'saida' ? 'Registrar Saída' : 
                     'Confirmar Transferência'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

      {/* Modal de Relatórios */}
      {showReports && (
        <SemenReports onClose={() => setShowReports(false)} />
      )}
    </div>
  );
};

export default SemenStockManager;
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de Operação
                      </Label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => handleInputChange('tipo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      >
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                        <option value="transferencia">Transferência</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Campos específicos para entrada */}
                {formData.tipo === 'entrada' && (
                  <>
                    {/* Dados da Compra */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Dados da Compra
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fornecedor *
                          </Label>
                          <Input
                            value={formData.fornecedor}
                            onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                            placeholder="Central de Sêmen XYZ"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nota Fiscal
                          </Label>
                          <Input
                            value={formData.notaFiscal}
                            onChange={(e) => handleInputChange('notaFiscal', e.target.value)}
                            placeholder="NF-123456"
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Valor por Dose (R$)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.valorUnitario}
                            onChange={(e) => handleInputChange('valorUnitario', e.target.value)}
                            placeholder="120.00"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dados do Touro */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Dados do Touro
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nome do Touro *
                          </Label>
                          <Input
                            value={formData.nomeTouro}
                            onChange={(e) => handleInputChange('nomeTouro', e.target.value)}
                            placeholder="Touro Alpha"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            RG *
                          </Label>
                          <Input
                            value={formData.rg}
                            onChange={(e) => handleInputChange('rg', e.target.value)}
                            placeholder="123456789"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Raça *
                          </Label>
                          <Input
                            value={formData.raca}
                            onChange={(e) => handleInputChange('raca', e.target.value)}
                            placeholder="Nelore"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantidade de Doses *
                          </Label>
                          <Input
                            type="number"
                            value={formData.quantidadeDoses}
                            onChange={(e) => handleInputChange('quantidadeDoses', e.target.value)}
                            placeholder="50"
                            required
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data da Coleta
                          </Label>
                          <Input
                            type="date"
                            value={formData.dataColeta}
                            onChange={(e) => handleInputChange('dataColeta', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data de Vencimento
                          </Label>
                          <Input
                            type="date"
                            value={formData.dataVencimento}
                            onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Localização */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <BeakerIcon className="h-5 w-5 mr-2" />
                    {formData.tipo === 'transferencia' ? 'Nova Localização' : 'Localização no Estoque'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número do Botijão *
                      </Label>
                      <Input
                        value={formData.tipo === 'transferencia' ? formData.botijaoDestino : formData.botijaoNumero}
                        onChange={(e) => handleInputChange(
                          formData.tipo === 'transferencia' ? 'botijaoDestino' : 'botijaoNumero', 
                          e.target.value
                        )}
                        placeholder="001"
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número da Caneca *
                      </Label>
                      <Input
                        value={formData.tipo === 'transferencia' ? formData.canecaDestino : formData.canecaNumero}
                        onChange={(e) => handleInputChange(
                          formData.tipo === 'transferencia' ? 'canecaDestino' : 'canecaNumero', 
                          e.target.value
                        )}
                        placeholder="A1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Posição na Caneca
                      </Label>
                      <Input
                        value={formData.tipo === 'transferencia' ? formData.posicaoDestino : formData.posicao}
                        onChange={(e) => handleInputChange(
                          formData.tipo === 'transferencia' ? 'posicaoDestino' : 'posicao', 
                          e.target.value
                        )}
                        placeholder="1-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Campos específicos para saída */}
                {formData.tipo === 'saida' && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Dados da Saída
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Motivo da Saída *
                        </Label>
                        <select
                          value={formData.motivoSaida}
                          onChange={(e) => handleInputChange('motivoSaida', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          required
                        >
                          <option value="">Selecionar motivo</option>
                          <option value="inseminacao">Inseminação</option>
                          <option value="venda">Venda</option>
                          <option value="descarte">Descarte</option>
                          <option value="transferencia">Transferência</option>
                          <option value="vencimento">Vencimento</option>
                          <option value="outros">Outros</option>
                        </select>
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Destinatário/Animal
                        </Label>
                        <Input
                          value={formData.destinatario}
                          onChange={(e) => handleInputChange('destinatario', e.target.value)}
                          placeholder="Nome do animal ou destinatário"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quantidade *
                        </Label>
                        <Input
                          type="number"
                          value={formData.quantidadeMovimentada}
                          onChange={(e) => handleInputChange('quantidadeMovimentada', e.target.value)}
                          placeholder="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Campos específicos para transferência */}
                {formData.tipo === 'transferencia' && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Dados da Transferência
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quantidade a Transferir *
                        </Label>
                        <Input
                          type="number"
                          value={formData.quantidadeMovimentada}
                          onChange={(e) => handleInputChange('quantidadeMovimentada', e.target.value)}
                          placeholder="10"
                          required
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Motivo da Transferência
                        </Label>
                        <Input
                          value={formData.motivoSaida}
                          onChange={(e) => handleInputChange('motivoSaida', e.target.value)}
                          placeholder="Reorganização do estoque"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Observações */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Observações
                  </h4>
                  <Textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Observações adicionais sobre a operação..."
                    rows="3"
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {formData.tipo === 'entrada' ? 'Registrar Entrada' : 
                     formData.tipo === 'saida' ? 'Registrar Saída' : 
                     'Confirmar Transferência'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemenStockManager;