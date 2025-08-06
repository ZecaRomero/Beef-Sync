import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  DocumentChartBarIcon,
  CalendarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const SemenReports = ({ onClose }) => {
  const [reportType, setReportType] = useState('estoque');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'estoque', name: 'Relatório de Estoque', icon: DocumentTextIcon },
    { id: 'movimentacoes', name: 'Movimentações', icon: ChartBarIcon },
    { id: 'vencimentos', name: 'Controle de Vencimentos', icon: CalendarIcon },
    { id: 'financeiro', name: 'Relatório Financeiro', icon: DocumentChartBarIcon }
  ];

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/semen-reports?type=${reportType}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // Implementar exportação para PDF
    alert('Funcionalidade de exportação PDF em desenvolvimento');
  };

  const exportToExcel = () => {
    // Implementar exportação para Excel
    alert('Funcionalidade de exportação Excel em desenvolvimento');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center space-x-3">
            <DocumentChartBarIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                📊 Relatórios de Sêmen
              </h2>
              <p className="text-purple-100">
                Análises e relatórios detalhados do estoque
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
          {/* Configurações do Relatório */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Tipo de Relatório */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tipo de Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportTypes.map((type) => (
                    <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="reportType"
                        value={type.id}
                        checked={reportType === type.id}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-blue-600"
                      />
                      <type.icon className="h-4 w-4" />
                      <span className="text-sm">{type.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Período */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Data Inicial</Label>
                    <Input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Data Final</Label>
                    <Input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={generateReport}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Gerando...' : 'Gerar Relatório'}
                  </Button>
                  {reportData && (
                    <>
                      <Button
                        onClick={exportToPDF}
                        variant="outline"
                        className="w-full"
                      >
                        <PrinterIcon className="h-4 w-4 mr-2" />
                        Exportar PDF
                      </Button>
                      <Button
                        onClick={exportToExcel}
                        variant="outline"
                        className="w-full"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Exportar Excel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resultados do Relatório */}
          {reportData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {reportTypes.find(t => t.id === reportType)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reportType === 'estoque' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {reportData.totalDoses || 0}
                        </div>
                        <div className="text-sm text-blue-800">Total de Doses</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {reportData.totalTouros || 0}
                        </div>
                        <div className="text-sm text-green-800">Touros Diferentes</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {formatCurrency(reportData.valorTotal || 0)}
                        </div>
                        <div className="text-sm text-purple-800">Valor Total</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {reportData.dosesVencendo || 0}
                        </div>
                        <div className="text-sm text-red-800">Vencendo</div>
                      </div>
                    </div>

                    {reportData.detalhes && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Touro</th>
                              <th className="text-left p-2">RG</th>
                              <th className="text-left p-2">Raça</th>
                              <th className="text-center p-2">Doses</th>
                              <th className="text-center p-2">Valor/Dose</th>
                              <th className="text-center p-2">Vencimento</th>
                              <th className="text-left p-2">Localização</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.detalhes.map((item, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{item.nomeTouro}</td>
                                <td className="p-2">{item.rg}</td>
                                <td className="p-2">{item.raca}</td>
                                <td className="text-center p-2">{item.quantidadeDisponivel}</td>
                                <td className="text-center p-2">{formatCurrency(item.valorUnitario)}</td>
                                <td className="text-center p-2">
                                  {item.dataVencimento ? new Date(item.dataVencimento).toLocaleDateString('pt-BR') : 'N/A'}
                                </td>
                                <td className="p-2">{item.botijaoNumero}-{item.canecaNumero}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {reportType === 'movimentacoes' && reportData.movimentacoes && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {reportData.totalEntradas || 0}
                        </div>
                        <div className="text-sm text-green-800">Entradas</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {reportData.totalSaidas || 0}
                        </div>
                        <div className="text-sm text-red-800">Saídas</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {reportData.totalTransferencias || 0}
                        </div>
                        <div className="text-sm text-blue-800">Transferências</div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Data</th>
                            <th className="text-left p-2">Tipo</th>
                            <th className="text-left p-2">Touro</th>
                            <th className="text-center p-2">Quantidade</th>
                            <th className="text-left p-2">Responsável</th>
                            <th className="text-left p-2">Motivo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.movimentacoes.map((mov, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{new Date(mov.data).toLocaleDateString('pt-BR')}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' :
                                  mov.tipo === 'SAIDA' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {mov.tipo}
                                </span>
                              </td>
                              <td className="p-2">{mov.nomeTouro}</td>
                              <td className="text-center p-2">{mov.quantidade}</td>
                              <td className="p-2">{mov.responsavel}</td>
                              <td className="p-2">{mov.motivo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {reportType === 'vencimentos' && reportData.vencimentos && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {reportData.vencendo30dias || 0}
                        </div>
                        <div className="text-sm text-yellow-800">Vencendo em 30 dias</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {reportData.vencendo7dias || 0}
                        </div>
                        <div className="text-sm text-orange-800">Vencendo em 7 dias</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {reportData.vencidas || 0}
                        </div>
                        <div className="text-sm text-red-800">Já Vencidas</div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Touro</th>
                            <th className="text-left p-2">RG</th>
                            <th className="text-center p-2">Doses</th>
                            <th className="text-center p-2">Vencimento</th>
                            <th className="text-center p-2">Dias Restantes</th>
                            <th className="text-left p-2">Localização</th>
                            <th className="text-center p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.vencimentos.map((item, index) => {
                            const diasRestantes = Math.ceil((new Date(item.dataVencimento) - new Date()) / (1000 * 60 * 60 * 24));
                            return (
                              <tr key={index} className="border-b">
                                <td className="p-2">{item.nomeTouro}</td>
                                <td className="p-2">{item.rg}</td>
                                <td className="text-center p-2">{item.quantidadeDisponivel}</td>
                                <td className="text-center p-2">
                                  {new Date(item.dataVencimento).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="text-center p-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    diasRestantes < 0 ? 'bg-red-100 text-red-800' :
                                    diasRestantes <= 7 ? 'bg-orange-100 text-orange-800' :
                                    diasRestantes <= 30 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {diasRestantes < 0 ? 'Vencido' : `${diasRestantes} dias`}
                                  </span>
                                </td>
                                <td className="p-2">{item.botijaoNumero}-{item.canecaNumero}</td>
                                <td className="text-center p-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    diasRestantes < 0 ? 'bg-red-100 text-red-800' :
                                    diasRestantes <= 30 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {diasRestantes < 0 ? 'VENCIDO' : 
                                     diasRestantes <= 30 ? 'ATENÇÃO' : 'OK'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {reportType === 'financeiro' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(reportData.valorTotalEstoque || 0)}
                        </div>
                        <div className="text-sm text-green-800">Valor em Estoque</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(reportData.valorCompras || 0)}
                        </div>
                        <div className="text-sm text-blue-800">Compras no Período</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {formatCurrency(reportData.valorVendas || 0)}
                        </div>
                        <div className="text-sm text-purple-800">Vendas no Período</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          {formatCurrency(reportData.valorMedio || 0)}
                        </div>
                        <div className="text-sm text-orange-800">Valor Médio/Dose</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SemenReports;