import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AuctionCalculator({ currentSales = [] }) {
  const [customValue, setCustomValue] = useState("");
  const [installments, setInstallments] = useState(30);
  const [interestRate, setInterestRate] = useState(20); // 20% de juros
  
  // Calcular totais das vendas reais
  const totalSalesValue = currentSales.reduce((sum, sale) => sum + (sale.value || 0), 0);
  
  // Valor para cálculo (vendas reais ou valor customizado)
  const calculationValue = customValue ? parseFloat(customValue) || 0 : totalSalesValue;
  
  // Cálculos
  const cashValue = calculationValue;
  const installmentValue = calculationValue * (1 + interestRate / 100);
  const monthlyPayment = installmentValue / installments;
  
  const handleQuickValue = (value) => {
    setCustomValue(value.toString());
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-600">
      <CardHeader>
        <CardTitle className="text-green-700 dark:text-green-300 flex items-center justify-between">
          <span>🧮 Calculadora do Leilão</span>
          <div className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Parcelamento em {installments}x
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor para Cálculo
            </label>
            <Input
              type="number"
              placeholder="Digite um valor ou use vendas reais"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="text-lg font-semibold"
            />
            <div className="text-xs text-gray-500 mt-1">
              Deixe vazio para usar vendas reais: R$ {totalSalesValue.toLocaleString('pt-BR')}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Parcelas
            </label>
            <select
              value={installments}
              onChange={(e) => setInstallments(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={12}>12x</option>
              <option value={24}>24x</option>
              <option value={30}>30x</option>
              <option value={36}>36x</option>
              <option value={48}>48x</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Juros (%)
            </label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        {/* Valores Rápidos */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Valores rápidos:</span>
          {[10000, 25000, 45000, 50000, 75000, 100000].map(value => (
            <Button
              key={value}
              onClick={() => handleQuickValue(value)}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              R$ {(value / 1000).toFixed(0)}k
            </Button>
          ))}
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-600">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              💰 Valor à Vista
            </div>
            <div className="text-3xl font-bold text-green-600">
              R$ {cashValue.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Sem juros
            </div>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-600">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              📊 Valor Parcelado
            </div>
            <div className="text-3xl font-bold text-blue-600">
              R$ {installmentValue.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              +{interestRate}% juros
            </div>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-600">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              📅 Parcela Mensal
            </div>
            <div className="text-3xl font-bold text-purple-600">
              R$ {monthlyPayment.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {installments} parcelas
            </div>
          </div>
        </div>

        {/* Detalhamento */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            📋 Detalhamento do Financiamento
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Valor Principal:</span>
              <div className="font-semibold">R$ {cashValue.toLocaleString('pt-BR')}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Juros Total:</span>
              <div className="font-semibold text-red-600">
                R$ {(installmentValue - cashValue).toLocaleString('pt-BR')}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Taxa Mensal:</span>
              <div className="font-semibold">
                {(interestRate / installments).toFixed(2)}%
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Pago:</span>
              <div className="font-semibold text-blue-600">
                R$ {installmentValue.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Simulação de Parcelas */}
        {calculationValue > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              📊 Simulação de Parcelas
            </h4>
            <div className="max-h-32 overflow-y-auto">
              <div className="grid grid-cols-6 gap-2 text-xs">
                {Array.from({ length: Math.min(installments, 12) }, (_, i) => (
                  <div key={i} className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="font-semibold">{i + 1}ª</div>
                    <div className="text-green-600">
                      R$ {monthlyPayment.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
                {installments > 12 && (
                  <div className="text-center p-2 bg-gray-100 dark:bg-gray-600 rounded col-span-6">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      ... e mais {installments - 12} parcelas de R$ {monthlyPayment.toLocaleString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}