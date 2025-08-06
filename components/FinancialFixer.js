import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { 
  CurrencyDollarIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function FinancialFixer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFixFinancial = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔧 Iniciando correção financeira...');
      
      const response = await fetch('/api/update-financial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        console.log('✅ Correção financeira concluída:', data);
      } else {
        setError(data.message || 'Erro desconhecido');
      }
    } catch (err) {
      console.error('❌ Erro na correção financeira:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-600">
      <CardHeader>
        <CardTitle className="text-orange-700 dark:text-orange-300 flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          🔧 Correção de Dados Financeiros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="mb-2">
            <strong>Problema identificado:</strong> Os valores financeiros estão zerados mesmo com animais vendidos.
          </p>
          <p className="mb-4">
            <strong>Solução:</strong> Este botão vai sincronizar os dados de vendas com o sistema financeiro.
          </p>
        </div>

        <Button
          onClick={handleFixFinancial}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Corrigindo Dados Financeiros...
            </>
          ) : (
            <>
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              🔧 Corrigir Dados Financeiros
            </>
          )}
        </Button>

        {/* Resultado da Correção */}
        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-800 dark:text-green-200">
                Correção Concluída!
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Animais Processados:</span>
                <span className="font-semibold">{result.stats.updatedAnimals}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Vendas:</span>
                <span className="font-semibold text-green-600">
                  R$ {result.stats.totalSalesValue.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quantidade Vendida:</span>
                <span className="font-semibold">{result.stats.totalSalesCount} animais</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Custos:</span>
                <span className="font-semibold text-red-600">
                  R$ {result.stats.totalCosts.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Lucro:</span>
                <span className={`font-bold ${result.stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {result.stats.profit.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-green-700 dark:text-green-300">
              ✅ {result.message}
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-semibold text-red-800 dark:text-red-200">
                Erro na Correção
              </span>
            </div>
            <div className="text-sm text-red-700 dark:text-red-300 mt-2">
              {error}
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            📋 O que esta correção faz:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Encontra todos os animais vendidos</li>
            <li>• Cria registros de custo para as vendas</li>
            <li>• Atualiza os valores financeiros</li>
            <li>• Calcula lucros e prejuízos</li>
            <li>• Sincroniza dados entre vendas e financeiro</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}