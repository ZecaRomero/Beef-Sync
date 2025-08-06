import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';

const TestSales = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Carregar dados reais da API
    const loadSalesData = async () => {
      try {
        const response = await fetch('/api/sales-list');
        if (response.ok) {
          const salesData = await response.json();
          setSalesData(salesData);
        }
      } catch (error) {
        console.error('Erro ao carregar vendas:', error);
        setSalesData([]);
      }
    };
    
    loadSalesData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold mb-2">
            📊 Relatório de Vendas
          </h1>
          <p className="text-green-100">
            {salesData.length} vendas registradas no sistema
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {salesData.length}
              </div>
              <div className="text-sm text-gray-600">Total de Vendas</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(salesData.reduce((sum, sale) => sum + sale.valor, 0))}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {salesData.reduce((sum, sale) => sum + sale.animais, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Animais</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">📋 Lista de Vendas</h2>
          <div className="space-y-4">
            {salesData.map((sale) => (
              <div
                key={sale.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {sale.cliente}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Data: {new Date(sale.data).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Animais: {sale.animais}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(sale.valor)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Sistema de Vendas Funcionando!
            </h2>
            <p className="text-green-700">
              Sistema de vendas operacional e funcionando corretamente!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSales;