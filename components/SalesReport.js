import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import ClientAnalysis from "./ClientAnalysis";

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showClientDetails, setShowClientDetails] = useState(null);
  const [followUpNotes, setFollowUpNotes] = useState({});
  const [activeView, setActiveView] = useState("sales"); // 'sales', 'analysis' ou 'bi'
  const [showBICharts, setShowBICharts] = useState(false);

  // Carregar dados reais de vendas e animais
  useEffect(() => {
    loadRealSalesData();
  }, []);

  const loadRealSalesData = async () => {
    try {
      // Buscar vendas reais
      const salesResponse = await fetch('/api/sales-list');
      const realSales = await salesResponse.json();

      // Buscar animais reais
      const animalsResponse = await fetch('/api/animals-list');
      const realAnimals = await animalsResponse.json();

      console.log('Vendas carregadas:', realSales.length);
      console.log('Animais carregados:', realAnimals.length);

      // Se não há vendas reais, criar dados de exemplo baseados nos animais reais
      if (realSales.length === 0 && realAnimals.length > 0) {
        // Sem dados mockados - usar apenas dados reais
        setSalesData([]);
        setFilteredSales([]);
      } else {
        // Converter vendas reais para o formato esperado
        const convertedSales = convertRealSalesToFormat(realSales);
        setSalesData(convertedSales);
        setFilteredSales(convertedSales);
      }
    } catch (error) {
      console.error('Erro ao carregar dados reais:', error);
      // Fallback para dados mockados se houver erro
      loadMockData();
    }
  };

  const loadMockData = () => {
    // Removidos todos os dados fictícios - agora usa apenas dados reais
    setSalesData([]);
    setFilteredSales([]);
  };

  const convertRealSalesToFormat = (realSales) => {
    // Converter vendas reais do banco para o formato esperado pelo componente
    return realSales.map((sale, index) => ({
      id: sale.id,
      saleDate: sale.dataVenda,
      client: {
        id: `CLI${String(index + 1).padStart(3, '0')}`,
        name: sale.nomeComprador || `Cliente ${index + 1}`,
        cnpj: sale.cnpjComprador || '00.000.000/0001-00',
        contact: sale.contatoComprador || 'Não informado',
        phone: sale.telefoneComprador || 'Não informado',
        email: sale.emailComprador || 'nao-informado@email.com',
        address: {
          street: 'Não informado',
          city: sale.cidadeComprador || 'Não informado',
          state: sale.estadoComprador || 'SP',
          zipCode: '00000-000'
        },
        segment: 'Cliente Real',
        clientSince: sale.createdAt,
        totalPurchases: sale.valorVenda,
        averageTicket: sale.valorVenda,
        paymentTerms: '30 dias',
        creditLimit: 500000,
        lastPurchase: sale.dataVenda
      },
      animals: [{
        id: sale.animal?.brinco || sale.animalId,
        breed: sale.animal?.raca || 'Nelore',
        weight: sale.pesoVenda || 450,
        age: 24,
        gender: sale.animal?.sexo === 'MACHO' ? 'M' : 'F',
        unitPrice: sale.precoKg || 280,
        totalPrice: sale.valorVenda,
        category: sale.animal?.sexo === 'MACHO' ? 'Terminado' : 'Matriz',
        name: sale.animal?.nome
      }],
      totalValue: sale.valorVenda,
      totalWeight: sale.pesoVenda || 450,
      averagePrice: sale.precoKg || 280,
      paymentStatus: 'Pendente',
      paymentDate: null,
      deliveryDate: sale.dataVenda,
      transportCompany: 'Não informado',
      notes: sale.observacoes || 'Venda real do sistema',
      satisfaction: 'Bom',
      followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      followUpStatus: 'Pendente'
    }));
  };

  const loadMockData = () => {
    // Removidos todos os dados fictícios - agora usa apenas dados reais
    setSalesData([]);
    setFilteredSales([]);
  };

  // Filtrar vendas
  useEffect(() => {
    let filtered = salesData;

    if (selectedPeriod !== "all") {
      const now = new Date();
      const periodDays = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "180d": 180,
        "365d": 365,
      };

      const cutoffDate = new Date(
        now.getTime() - periodDays[selectedPeriod] * 24 * 60 * 60 * 1000
      );
      filtered = filtered.filter(
        (sale) => new Date(sale.saleDate) >= cutoffDate
      );
    }

    if (selectedState !== "all") {
      filtered = filtered.filter(
        (sale) => sale.client.address.state === selectedState
      );
    }

    if (selectedClient !== "all") {
      filtered = filtered.filter((sale) => sale.client.id === selectedClient);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (sale) =>
          sale.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.client.contact
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          sale.client.cnpj.includes(searchTerm)
      );
    }

    setFilteredSales(filtered);
  }, [salesData, selectedPeriod, selectedState, selectedClient, searchTerm]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      Pago: (
        <Badge className="bg-green-600 text-white dark:bg-green-500 dark:text-white">
          ✅ Pago
        </Badge>
      ),
      Pendente: (
        <Badge className="bg-yellow-600 text-white dark:bg-yellow-500 dark:text-white">
          ⏳ Pendente
        </Badge>
      ),
      Atrasado: (
        <Badge className="bg-red-600 text-white dark:bg-red-500 dark:text-white">
          🚨 Atrasado
        </Badge>
      ),
    };
    return badges[status] || badges["Pendente"];
  };

  const getSatisfactionBadge = (satisfaction) => {
    const badges = {
      Excelente: (
        <Badge className="bg-green-600 text-white dark:bg-green-500 dark:text-white">
          😍 Excelente
        </Badge>
      ),
      "Muito Bom": (
        <Badge className="bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
          😊 Muito Bom
        </Badge>
      ),
      Bom: (
        <Badge className="bg-yellow-600 text-white dark:bg-yellow-500 dark:text-white">
          🙂 Bom
        </Badge>
      ),
      Regular: (
        <Badge className="bg-orange-600 text-white dark:bg-orange-500 dark:text-white">
          😐 Regular
        </Badge>
      ),
      Ruim: (
        <Badge className="bg-red-600 text-white dark:bg-red-500 dark:text-white">
          😞 Ruim
        </Badge>
      ),
    };
    return badges[satisfaction] || badges["Bom"];
  };

  const getFollowUpStatusBadge = (status) => {
    const badges = {
      Realizado: (
        <Badge className="bg-green-600 text-white dark:bg-green-500 dark:text-white">
          ✅ Realizado
        </Badge>
      ),
      Pendente: (
        <Badge className="bg-yellow-600 text-white dark:bg-yellow-500 dark:text-white">
          📅 Pendente
        </Badge>
      ),
      Agendado: (
        <Badge className="bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
          📞 Agendado
        </Badge>
      ),
    };
    return badges[status] || badges["Pendente"];
  };

  const totalSales = filteredSales.reduce(
    (sum, sale) => sum + sale.totalValue,
    0
  );
  const totalAnimals = filteredSales.reduce(
    (sum, sale) => sum + sale.animals.length,
    0
  );
  const averageTicket =
    filteredSales.length > 0 ? totalSales / filteredSales.length : 0;

  const uniqueClients = [
    ...new Set(filteredSales.map((sale) => sale.client.id)),
  ];
  const states = [
    ...new Set(salesData.map((sale) => sale.client.address.state)),
  ];

  const handleFollowUpNote = (saleId, note) => {
    setFollowUpNotes((prev) => ({
      ...prev,
      [saleId]: note,
    }));
  };

  // Componente BI integrado
  const BIAnalytics = () => {
    const [biData, setBiData] = useState([]);
    const [timeRange, setTimeRange] = useState("30");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

    // Carregar dados reais para BI
    React.useEffect(() => {
      loadBIData();
    }, []);

    const loadBIData = async () => {
      try {
        const response = await fetch('/api/sales-data');
        const data = await response.json();

        if (data.hasRealSales) {
          setBiData(data.sales);
        } else {
          // Converter dados de vendas filtradas para formato BI
          const convertedData = filteredSales.map(sale => ({
            date: sale.saleDate,
            vendas: sale.animals.length,
            valor: sale.totalValue,
            categoria: sale.client.segment,
            regiao: sale.client.address.state,
            animal: sale.animals[0] // Primeiro animal da venda
          }));
          setBiData(convertedData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados BI:', error);
        // Fallback para dados filtrados
        const convertedData = filteredSales.map(sale => ({
          date: sale.saleDate,
          vendas: sale.animals.length,
          valor: sale.totalValue,
          categoria: sale.client.segment,
          regiao: sale.client.address.state
        }));
        setBiData(convertedData);
      }
    };

    const handleSendWhatsApp = async (message) => {
      if (!whatsappNumber) {
        setShowWhatsAppModal(true);
        return;
      }

      try {
        // Simular envio via WhatsApp
        console.log('Enviando relatório BI via WhatsApp:', {
          to: whatsappNumber,
          message: message.substring(0, 100) + '...'
        });

        alert('Relatório BI enviado via WhatsApp com sucesso!');
        setShowWhatsAppModal(false);
      } catch (error) {
        console.error('Erro ao enviar WhatsApp:', error);
        alert('Erro ao enviar relatório via WhatsApp');
      }
    };

    const generateBIReport = () => {
      const totalVendas = biData.reduce((sum, item) => sum + item.vendas, 0);
      const receitaTotal = biData.reduce((sum, item) => sum + item.valor, 0);
      const ticketMedio = totalVendas > 0 ? receitaTotal / totalVendas : 0;

      // Análise por categoria
      const categoryData = {};
      biData.forEach(item => {
        if (!categoryData[item.categoria]) {
          categoryData[item.categoria] = { vendas: 0, valor: 0 };
        }
        categoryData[item.categoria].vendas += item.vendas;
        categoryData[item.categoria].valor += item.valor;
      });

      const categorias = Object.entries(categoryData)
        .map(([categoria, data]) => ({
          categoria,
          vendas: data.vendas,
          valor: data.valor,
          participacao: (data.valor / receitaTotal * 100).toFixed(1)
        }))
        .sort((a, b) => b.valor - a.valor);

      const message = `
🐄 *RELATÓRIO BI - VENDAS DE GADO*
📅 Período: Últimos ${timeRange} dias

📊 *RESUMO EXECUTIVO*
• Total de Vendas: ${totalVendas} cabeças
• Receita Total: R$ ${(receitaTotal/1000).toFixed(0)}k
• Ticket Médio: R$ ${(ticketMedio/1000).toFixed(1)}k
• Vendas/Dia: ${Math.round(totalVendas / parseInt(timeRange))} cabeças

📈 *ANÁLISE POR SEGMENTO*
${categorias.map(cat =>
  `• ${cat.categoria}: ${cat.vendas} vendas (${cat.participacao}%)`
).join('\n')}

💡 *INSIGHTS*
• ${categorias.length > 0 ? categorias[0].categoria : 'N/A'} lidera com ${categorias.length > 0 ? categorias[0].participacao : '0'}% das vendas
• Performance ${totalVendas > 50 ? 'excelente' : totalVendas > 20 ? 'boa' : 'regular'} no período
• Ticket médio ${ticketMedio > 100000 ? 'alto' : ticketMedio > 50000 ? 'médio' : 'baixo'}

---
🤖 Relatório gerado automaticamente pelo BeefSync
📱 Sistema de Gestão de Leilão
      `.trim();

      return message;
    };

    const WhatsAppModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Enviar Relatório BI via WhatsApp
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número do WhatsApp
            </label>
            <Input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+55 11 99999-9999"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setShowWhatsAppModal(false)}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (whatsappNumber) {
                  handleSendWhatsApp(generateBIReport());
                }
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              📱 Enviar
            </Button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Controles BI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span>📊 Business Intelligence - Análise de Vendas</span>
                <Badge className={biData.length > 0 && biData[0].animal ? "bg-green-600" : "bg-yellow-600"}>
                  {biData.length > 0 && biData[0].animal ? "✅ Dados Reais" : "⚠️ Demo"}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={loadBIData}
                  size="sm"
                  variant="outline"
                >
                  🔄 Atualizar
                </Button>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="365">Último ano</option>
                </Select>
                <Button
                  onClick={() => setShowWhatsAppModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  📱 Enviar WhatsApp
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {biData.length > 0 && biData[0].animal
                ? `📊 Analisando ${biData.length} vendas reais com animais importados`
                : `⚠️ Usando dados de demonstração. Importe animais e registre vendas para ver dados reais.`
              }
            </div>
          </CardContent>
        </Card>

        {/* Métricas BI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {biData.reduce((sum, item) => sum + item.vendas, 0)}
                </div>
                <div className="text-green-100">Total de Vendas</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  R$ {(biData.reduce((sum, item) => sum + item.valor, 0) / 1000).toFixed(0)}k
                </div>
                <div className="text-blue-100">Receita Total</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  R$ {biData.length > 0 ? (biData.reduce((sum, item) => sum + item.valor, 0) / biData.reduce((sum, item) => sum + item.vendas, 0) / 1000).toFixed(1) : 0}k
                </div>
                <div className="text-purple-100">Ticket Médio</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {Math.round(biData.reduce((sum, item) => sum + item.vendas, 0) / Math.max(parseInt(timeRange), 1))}
                </div>
                <div className="text-orange-100">Vendas/Dia</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico Simples de Barras */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Evolução de Vendas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              {biData.slice(-10).map((item, index) => {
                const maxValue = Math.max(...biData.map(d => d.valor));
                const height = (item.valor / maxValue) * 200;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t w-8 transition-all duration-1000"
                      style={{ height: `${height}px` }}
                      title={`${new Date(item.date).toLocaleDateString('pt-BR')}: R$ ${item.valor.toLocaleString('pt-BR')}`}
                    />
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 transform -rotate-45">
                      {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Animais na Análise */}
        {biData.length > 0 && biData[0].animal && (
          <Card>
            <CardHeader>
              <CardTitle>🐄 Animais Incluídos na Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {biData.slice(0, 6).map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {item.animal.id}
                        </span>
                        <Badge className="ml-2 bg-blue-600 text-white">
                          {item.animal.raca}
                        </Badge>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        R$ {(item.valor / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Nome:</strong> {item.animal.nome || 'Não informado'}
                      <br />
                      <strong>Sexo:</strong> {item.animal.sexo}
                      <br />
                      <strong>Data:</strong> {new Date(item.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
              {biData.length > 6 && (
                <div className="text-center mt-4">
                  <Badge variant="outline">
                    +{biData.length - 6} animais adicionais na análise
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Análise por Segmento */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Análise por Segmento de Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const categoryData = {};
                biData.forEach(item => {
                  if (!categoryData[item.categoria]) {
                    categoryData[item.categoria] = { vendas: 0, valor: 0 };
                  }
                  categoryData[item.categoria].vendas += item.vendas;
                  categoryData[item.categoria].valor += item.valor;
                });

                const total = Object.values(categoryData).reduce((sum, cat) => sum + cat.valor, 0);

                return Object.entries(categoryData)
                  .sort(([,a], [,b]) => b.valor - a.valor)
                  .map(([categoria, data]) => {
                    const percentage = total > 0 ? (data.valor / total * 100) : 0;
                    return (
                      <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                          <span className="font-medium">{categoria}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {formatCurrency(data.valor)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {data.vendas} vendas ({percentage.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    );
                  });
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Preview do Relatório */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Preview do Relatório BI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <pre className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {generateBIReport()}
              </pre>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button
                onClick={() => setShowWhatsAppModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                📱 Enviar via WhatsApp
              </Button>
              <Button
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([generateBIReport()], {type: 'text/plain'});
                  element.href = URL.createObjectURL(file);
                  element.download = `relatorio-bi-${new Date().toISOString().split('T')[0]}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                variant="outline"
              >
                📥 Download TXT
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal do WhatsApp */}
        {showWhatsAppModal && <WhatsAppModal />}
      </div>
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Data Venda",
      "Cliente",
      "CNPJ",
      "Contato",
      "Telefone",
      "Email",
      "Cidade",
      "Estado",
      "Segmento",
      "Valor Total",
      "Qtd Animais",
      "Peso Total",
      "Preço Médio",
      "Status Pagamento",
      "Satisfação",
      "Follow-up",
      "Observações",
    ];

    const csvData = filteredSales.map((sale) => [
      formatDate(sale.saleDate),
      sale.client.name,
      sale.client.cnpj,
      sale.client.contact,
      sale.client.phone,
      sale.client.email,
      sale.client.address.city,
      sale.client.address.state,
      sale.client.segment,
      sale.totalValue,
      sale.animals.length,
      sale.totalWeight,
      sale.averagePrice.toFixed(2),
      sale.paymentStatus,
      sale.satisfaction,
      sale.followUpStatus,
      sale.notes,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_vendas_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                📊 Relatório de Vendas por Cliente
              </h1>
              <p className="text-blue-100 text-lg">
                Sistema completo para análise e pós-venda
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">🎯</div>
              <div className="flex space-x-2">
                <Button
                  variant={activeView === "sales" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView("sales")}
                  className={
                    activeView === "sales"
                      ? "bg-white text-blue-600"
                      : "bg-white/20 text-white border-white/30"
                  }
                >
                  📋 Vendas
                </Button>
                <Button
                  variant={activeView === "analysis" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView("analysis")}
                  className={
                    activeView === "analysis"
                      ? "bg-white text-blue-600"
                      : "bg-white/20 text-white border-white/30"
                  }
                >
                  👥 Análise Clientes
                </Button>
                <Button
                  variant={activeView === "bi" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView("bi")}
                  className={
                    activeView === "bi"
                      ? "bg-white text-blue-600"
                      : "bg-white/20 text-white border-white/30"
                  }
                >
                  📊 BI Analytics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Renderizar conteúdo baseado na view ativa */}
      {activeView === "analysis" ? (
        <ClientAnalysis salesData={salesData} />
      ) : activeView === "bi" ? (
        <BIAnalytics />
      ) : (
        <div className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Período
                  </label>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <option value="all">Todos os períodos</option>
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Últimos 90 dias</option>
                    <option value="180d">Últimos 6 meses</option>
                    <option value="365d">Último ano</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <Select
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <option value="all">Todos os estados</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cliente
                  </label>
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                  >
                    <option value="all">Todos os clientes</option>
                    {uniqueClients.map((clientId) => {
                      const client = salesData.find(
                        (s) => s.client.id === clientId
                      )?.client;
                      return (
                        <option key={clientId} value={clientId}>
                          {client?.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Buscar
                  </label>
                  <Input
                    placeholder="Nome, CNPJ ou contato..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-end space-x-2">
                  <Button
                    onClick={loadRealSalesData}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    🔄 Recarregar Dados
                  </Button>
                  <Button
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    📥 Exportar CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status dos Dados */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    📊 Status dos Dados
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {salesData.length > 0 && salesData[0].notes?.includes('animal real')
                      ? `✅ Dados baseados em ${salesData.reduce((sum, sale) => sum + sale.animals.length, 0)} animais reais importados`
                      : salesData.length > 0 && salesData[0].client?.name?.includes('Cliente Real')
                      ? `✅ ${salesData.length} vendas reais carregadas do sistema`
                      : `⚠️ Usando dados de demonstração (${salesData.length} vendas)`
                    }
                  </p>
                </div>
                <Button
                  onClick={loadRealSalesData}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  🔄 Atualizar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-600 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      Total Vendas
                    </p>
                    <p className="text-3xl font-black text-green-600 dark:text-green-400">
                      {formatCurrency(totalSales)}
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
                      Total Animais
                    </p>
                    <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                      {totalAnimals}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                    <span className="text-3xl">🐄</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-600 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      Ticket Médio
                    </p>
                    <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                      {formatCurrency(averageTicket)}
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                    <span className="text-3xl">📊</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-600 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      Clientes Únicos
                    </p>
                    <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                      {uniqueClients.length}
                    </p>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-lg">
                    <span className="text-3xl">👥</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Vendas */}
          <Card>
            <CardHeader>
              <CardTitle>
                📋 Vendas Detalhadas ({filteredSales.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-700"
                  >
                    {/* Header da Venda */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {sale.client.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Venda #{sale.id} • {formatDate(sale.saleDate)}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                          {formatCurrency(sale.totalValue)}
                        </div>
                        <div className="flex space-x-2">
                          {getPaymentStatusBadge(sale.paymentStatus)}
                          {getSatisfactionBadge(sale.satisfaction)}
                        </div>
                      </div>
                    </div>

                    {/* Informações do Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          📞 Contato
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Responsável:</strong> {sale.client.contact}
                          <br />
                          <strong>Telefone:</strong> {sale.client.phone}
                          <br />
                          <strong>Email:</strong> {sale.client.email}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          📍 Localização
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {sale.client.address.city} -{" "}
                          {sale.client.address.state}
                          <br />
                          <strong>CEP:</strong> {sale.client.address.zipCode}
                          <br />
                          <strong>Segmento:</strong> {sale.client.segment}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          💼 Histórico
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Cliente desde:</strong>{" "}
                          {formatDate(sale.client.clientSince)}
                          <br />
                          <strong>Total compras:</strong>{" "}
                          {formatCurrency(sale.client.totalPurchases)}
                          <br />
                          <strong>Ticket médio:</strong>{" "}
                          {formatCurrency(sale.client.averageTicket)}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          💳 Financeiro
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Prazo:</strong> {sale.client.paymentTerms}
                          <br />
                          <strong>Limite:</strong>{" "}
                          {formatCurrency(sale.client.creditLimit)}
                          <br />
                          <strong>CNPJ:</strong> {sale.client.cnpj}
                        </p>
                      </div>
                    </div>

                    {/* Animais Vendidos */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        🐄 Animais Vendidos ({sale.animals.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sale.animals.map((animal) => (
                          <div
                            key={animal.id}
                            className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {animal.id}
                                </span>
                                <Badge className="ml-2 bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
                                  {animal.category}
                                </Badge>
                              </div>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(animal.totalPrice)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Raça:</strong> {animal.breed} •{" "}
                              <strong>Peso:</strong> {animal.weight}kg
                              <br />
                              <strong>Idade:</strong> {animal.age} meses •{" "}
                              <strong>Sexo:</strong> {animal.gender}
                              <br />
                              <strong>Preço/kg:</strong> R${" "}
                              {animal.unitPrice.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resumo da Venda */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {sale.totalWeight}kg
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Peso Total
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          R$ {sale.averagePrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Preço Médio/kg
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {sale.animals.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Animais
                        </div>
                      </div>
                    </div>

                    {/* Logística e Entrega */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          🚛 Logística
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Transportadora:</strong>{" "}
                          {sale.transportCompany}
                          <br />
                          <strong>Data Entrega:</strong>{" "}
                          {formatDate(sale.deliveryDate)}
                          <br />
                          <strong>Status:</strong> Entregue
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          💰 Pagamento
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Status:</strong> {sale.paymentStatus}
                          <br />
                          <strong>Data Pagamento:</strong>{" "}
                          {sale.paymentDate
                            ? formatDate(sale.paymentDate)
                            : "Pendente"}
                          <br />
                          <strong>Prazo:</strong> {sale.client.paymentTerms}
                        </p>
                      </div>
                    </div>

                    {/* Pós-Venda */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          📞 Pós-Venda
                        </h4>
                        <div className="flex space-x-2">
                          {getFollowUpStatusBadge(sale.followUpStatus)}
                          <Badge className="bg-gray-600 text-white dark:bg-gray-500 dark:text-white">
                            📅 {formatDate(sale.followUpDate)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Observações da venda:</strong>
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                            {sale.notes}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Notas de follow-up:</strong>
                          </p>
                          <Textarea
                            placeholder="Adicionar notas do follow-up..."
                            value={followUpNotes[sale.id] || ""}
                            onChange={(e) =>
                              handleFollowUpNote(sale.id, e.target.value)
                            }
                            rows={3}
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(`tel:${sale.client.phone}`)
                          }
                        >
                          📞 Ligar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(`mailto:${sale.client.email}`)
                          }
                        >
                          📧 Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://wa.me/${sale.client.phone.replace(
                                /\D/g,
                                ""
                              )}`
                            )
                          }
                        >
                          💬 WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            alert(
                              `Follow-up agendado para ${sale.client.name}!`
                            );
                          }}
                        >
                          ✅ Marcar Follow-up
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
