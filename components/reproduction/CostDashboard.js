import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
} from "@heroicons/react/24/outline";

const CostDashboard = ({ process, financialReport }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const getROIColor = (roi) => {
    if (roi > 20) return 'text-green-600';
    if (roi > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateROI = (lucro, custo) => {
    if (!custo || custo === 0) return 0;
    return ((lucro / custo) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Resumo Financeiro do Processo */}
      {process && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Custo Realizado</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(process.custoRealizado)}
                  </p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Custo Total Est.</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(process.custoTotal)}
                  </p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Lucro Estimado</p>
                  <p className={`text-2xl font-bold ${process.lucroEstimado > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(process.lucroEstimado)}
                  </p>
                </div>
                {process.lucroEstimado > 0 ? (
                  <TrendingUpIcon className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-8 w-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">ROI Estimado</p>
                  <p className={`text-2xl font-bold ${getROIColor(calculateROI(process.lucroEstimado, process.custoTotal))}`}>
                    {calculateROI(process.lucroEstimado, process.custoTotal)}%
                  </p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detalhamento de Custos por Fase */}
      {process && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento de Custos por Fase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">1ª Fase - Coleta</span>
                  {process.faseColeta?.realizada && (
                    <Badge variant="success">Concluída</Badge>
                  )}
                </div>
                <span className="font-medium">
                  {process.faseColeta?.realizada ? formatCurrency(1200) : formatCurrency(0)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">2ª Fase - FIV</span>
                  {process.faseFIV?.realizada && (
                    <Badge variant="success">Concluída</Badge>
                  )}
                </div>
                <span className="font-medium">
                  {process.faseFIV?.realizada ? formatCurrency(1700) : formatCurrency(0)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">3ª Fase - TE</span>
                  {process.faseTE?.realizada && (
                    <Badge variant="success">Concluída</Badge>
                  )}
                </div>
                <span className="font-medium">
                  {process.faseTE?.realizada ? formatCurrency(1000) : formatCurrency(0)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">4ª Fase - DG</span>
                  {process.faseDG?.realizada && (
                    <Badge variant="success">Concluída</Badge>
                  )}
                </div>
                <span className="font-medium">
                  {process.faseDG?.realizada ? formatCurrency(550) : formatCurrency(0)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">5ª Fase - Sexagem</span>
                  {process.faseSexagem?.realizada && (
                    <Badge variant="success">Concluída</Badge>
                  )}
                </div>
                <span className="font-medium">
                  {process.faseSexagem?.realizada ? formatCurrency(200) : formatCurrency(0)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">6ª Fase - Receptoras + Frete</span>
                  {process.faseEntrega?.realizada && (
                    <Badge variant="success">Concluída</Badge>
                  )}
                </div>
                <span className="font-medium">
                  {process.faseEntrega?.realizada ?
                    formatCurrency(
                      process.faseEntrega.receptoras.reduce((total, r) =>
                        total + (parseFloat(r.valorReceptora) || 0) + (parseFloat(r.valorFrete) || 0), 0
                      )
                    ) :
                    formatCurrency(0)
                  }
                </span>
              </div>

              <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(process.custoRealizado)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Geral */}
      {financialReport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Processos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {financialReport.processosAtivos}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                de {financialReport.totalProcessos} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Receptoras Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {financialReport.receptorasAtivas}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Prenhas confirmadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bezerros Esperados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {financialReport.bezerrosEsperados}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Próximos 9 meses
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cronograma de Partos */}
      {process?.faseSexagem?.receptoras && (
        <Card>
          <CardHeader>
            <CardTitle>Cronograma de Partos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {process.faseSexagem.receptoras.map((receptora, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <div>
                      <p className="font-medium">{receptora.codigo}</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sexo: {receptora.sexo || 'Não informado'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {receptora.previsaoParto ?
                        new Date(receptora.previsaoParto).toLocaleDateString() :
                        'Data não definida'
                      }
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {receptora.previsaoParto ?
                        `${Math.ceil((new Date(receptora.previsaoParto) - new Date()) / (1000 * 60 * 60 * 24))} dias` :
                        ''
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostDashboard;
