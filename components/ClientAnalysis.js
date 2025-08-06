import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ClientAnalysis = ({ salesData = [] }) => {
  const [clientMetrics, setClientMetrics] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState('all');

  useEffect(() => {
    if (salesData.length === 0) return;

    // Agrupar vendas por cliente
    const clientGroups = salesData.reduce((acc, sale) => {
      const clientId = sale.client.id;
      if (!acc[clientId]) {
        acc[clientId] = {
          client: sale.client,
          sales: [],
          totalValue: 0,
          totalAnimals: 0,
          lastPurchase: null,
          frequency: 0
        };
      }
      
      acc[clientId].sales.push(sale);
      acc[clientId].totalValue += sale.totalValue;
      acc[clientId].totalAnimals += sale.animals.length;
      
      const saleDate = new Date(sale.saleDate);
      if (!acc[clientId].lastPurchase || saleDate > new Date(acc[clientId].lastPurchase)) {
        acc[clientId].lastPurchase = sale.saleDate;
      }
      
      return acc;
    }, {});

    // Calcular métricas por cliente
    const metrics = Object.values(clientGroups).map(group => {
      const daysSinceLastPurchase = Math.floor(
        (new Date() - new Date(group.lastPurchase)) / (1000 * 60 * 60 * 24)
      );
      
      const averageTicket = group.totalValue / group.sales.length;
      const purchaseFrequency = group.sales.length;
      
      // Calcular score de relacionamento (0-100)
      let relationshipScore = 0;
      
      // Frequência de compras (30 pontos)
      if (purchaseFrequency >= 5) relationshipScore += 30;
      else if (purchaseFrequency >= 3) relationshipScore += 20;
      else if (purchaseFrequency >= 2) relationshipScore += 10;
      
      // Valor total (25 pontos)
      if (group.totalValue >= 500000) relationshipScore += 25;
      else if (group.totalValue >= 200000) relationshipScore += 20;
      else if (group.totalValue >= 100000) relationshipScore += 15;
      else if (group.totalValue >= 50000) relationshipScore += 10;
      
      // Recência da última compra (25 pontos)
      if (daysSinceLastPurchase <= 30) relationshipScore += 25;
      else if (daysSinceLastPurchase <= 60) relationshipScore += 20;
      else if (daysSinceLastPurchase <= 90) relationshipScore += 15;
      else if (daysSinceLastPurchase <= 180) relationshipScore += 10;
      
      // Satisfação média (20 pontos)
      const avgSatisfaction = group.sales.reduce((sum, sale) => {
        const satisfactionScore = {
          'Excelente': 5,
          'Muito Bom': 4,
          'Bom': 3,
          'Regular': 2,
          'Ruim': 1
        };
        return sum + (satisfactionScore[sale.satisfaction] || 3);
      }, 0) / group.sales.length;
      
      relationshipScore += Math.floor((avgSatisfaction / 5) * 20);
      
      // Classificar cliente
      let classification = 'Bronze';
      let priority = 'Baixa';
      
      if (relationshipScore >= 80) {
        classification = 'Diamante';
        priority = 'Muito Alta';
      } else if (relationshipScore >= 60) {
        classification = 'Ouro';
        priority = 'Alta';
      } else if (relationshipScore >= 40) {
        classification = 'Prata';
        priority = 'Média';
      }
      
      // Determinar status de risco
      let riskStatus = 'Baixo';
      if (daysSinceLastPurchase > 180) riskStatus = 'Alto';
      else if (daysSinceLastPurchase > 90) riskStatus = 'Médio';
      
      return {
        ...group,
        averageTicket,
        purchaseFrequency,
        daysSinceLastPurchase,
        relationshipScore,
        classification,
        priority,
        riskStatus,
        avgSatisfaction: avgSatisfaction.toFixed(1)
      };
    });

    // Ordenar por score de relacionamento
    metrics.sort((a, b) => b.relationshipScore - a.relationshipScore);
    
    setClientMetrics(metrics);
  }, [salesData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getClassificationBadge = (classification) => {
    const badges = {
      'Diamante': <Badge className="bg-purple-600 text-white dark:bg-purple-500 dark:text-white">💎 Diamante</Badge>,
      'Ouro': <Badge className="bg-yellow-600 text-white dark:bg-yellow-500 dark:text-white">🥇 Ouro</Badge>,
      'Prata': <Badge className="bg-gray-600 text-white dark:bg-gray-500 dark:text-white">🥈 Prata</Badge>,
      'Bronze': <Badge className="bg-orange-600 text-white dark:bg-orange-500 dark:text-white">🥉 Bronze</Badge>
    };
    return badges[classification] || badges['Bronze'];
  };

  const getRiskBadge = (risk) => {
    const badges = {
      'Alto': <Badge className="bg-red-600 text-white dark:bg-red-500 dark:text-white">🚨 Alto Risco</Badge>,
      'Médio': <Badge className="bg-yellow-600 text-white dark:bg-yellow-500 dark:text-white">⚠️ Médio Risco</Badge>,
      'Baixo': <Badge className="bg-green-600 text-white dark:bg-green-500 dark:text-white">✅ Baixo Risco</Badge>
    };
    return badges[risk] || badges['Baixo'];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Muito Alta': 'border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20',
      'Alta': 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20',
      'Média': 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      'Baixa': 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20'
    };
    return colors[priority] || colors['Baixa'];
  };

  const filteredMetrics = selectedSegment === 'all' 
    ? clientMetrics 
    : clientMetrics.filter(metric => metric.client.segment === selectedSegment);

  const segments = [...new Set(clientMetrics.map(m => m.client.segment))];

  const topClients = clientMetrics.slice(0, 5);
  const riskClients = clientMetrics.filter(m => m.riskStatus === 'Alto');
  const diamondClients = clientMetrics.filter(m => m.classification === 'Diamante');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                👥 Análise de Clientes
              </h1>
              <p className="text-purple-100 text-lg">
                Classificação e relacionamento com clientes
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">🎯</div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {clientMetrics.length} clientes
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  Clientes Diamante
                </p>
                <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {diamondClients.length}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                <span className="text-3xl">💎</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  Alto Risco
                </p>
                <p className="text-3xl font-black text-red-600 dark:text-red-400">
                  {riskClients.length}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                <span className="text-3xl">🚨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  Ticket Médio
                </p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                  {formatCurrency(
                    clientMetrics.reduce((sum, m) => sum + m.averageTicket, 0) / 
                    (clientMetrics.length || 1)
                  )}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                <span className="text-3xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  Satisfação Média
                </p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {(clientMetrics.reduce((sum, m) => sum + parseFloat(m.avgSatisfaction), 0) / 
                    (clientMetrics.length || 1)).toFixed(1)}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                <span className="text-3xl">⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Top 5 Clientes (Por Score de Relacionamento)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div
                key={client.client.id}
                className={`p-4 rounded-lg ${getPriorityColor(client.priority)} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {client.client.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {client.client.address.city} - {client.client.address.state} • {client.client.segment}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex space-x-2 mb-2">
                      {getClassificationBadge(client.classification)}
                      {getRiskBadge(client.riskStatus)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Score: <span className="font-bold">{client.relationshipScore}/100</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(client.totalValue)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Compras</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {client.purchaseFrequency}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Frequência</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(client.averageTicket)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Ticket Médio</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {client.daysSinceLastPurchase}d
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Última Compra</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clientes de Alto Risco */}
      {riskClients.length > 0 && (
        <Card className="border-2 border-red-200 dark:border-red-600">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-300">
              🚨 Clientes de Alto Risco - Ação Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskClients.map((client) => (
                <div
                  key={client.client.id}
                  className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {client.client.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Última compra há {client.daysSinceLastPurchase} dias
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400 mb-1">
                        {formatCurrency(client.totalValue)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total histórico
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        alert(`Ação de retenção iniciada para ${client.client.name}!`);
                      }}
                    >
                      📞 Contatar Urgente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert(`Oferta especial preparada para ${client.client.name}!`);
                      }}
                    >
                      🎁 Oferta Especial
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtro por Segmento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>📊 Todos os Clientes</CardTitle>
            <div>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todos os Segmentos</option>
                {segments.map(segment => (
                  <option key={segment} value={segment}>{segment}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMetrics.map((client) => (
              <div
                key={client.client.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                      {client.client.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {client.client.address.city} - {client.client.address.state}
                    </p>
                  </div>
                  <div className="text-right">
                    {getClassificationBadge(client.classification)}
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(client.totalValue)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Frequência:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {client.purchaseFrequency} compras
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Score:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {client.relationshipScore}/100
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Risco:</span>
                    {getRiskBadge(client.riskStatus)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAnalysis;