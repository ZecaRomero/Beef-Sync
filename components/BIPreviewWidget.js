import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function BIPreviewWidget({ onOpenFullBI }) {
  const [previewData, setPreviewData] = useState({
    totalVendas: 0,
    receitaTotal: 0,
    crescimento: 0,
    topCategoria: '',
    tendencia: 'stable'
  });

  useEffect(() => {
    // Simular dados de preview
    setPreviewData({
      totalVendas: 156,
      receitaTotal: 2850000,
      crescimento: 12.5,
      topCategoria: 'Boi Gordo',
      tendencia: 'up'
    });
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTrendIcon = () => {
    return previewData.tendencia === 'up' ? 
      <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" /> :
      <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />;
  };

  const getTrendColor = () => {
    return previewData.tendencia === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-600">
      <CardHeader>
        <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center justify-between">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2" />
            📊 BI Analytics Preview
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenFullBI}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Ver Completo
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Métricas Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {previewData.totalVendas}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Vendas (30d)
              </div>
            </div>
            
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(previewData.receitaTotal).replace('R$', 'R$').replace(',00', '')}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Receita Total
              </div>
            </div>
          </div>

          {/* Tendência */}
          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
              {getTrendIcon()}
              <span className={`ml-2 font-semibold ${getTrendColor()}`}>
                {previewData.crescimento > 0 ? '+' : ''}{previewData.crescimento}%
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              vs mês anterior
            </div>
          </div>

          {/* Top Categoria */}
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Top Categoria:
              </span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                🏆 {previewData.topCategoria}
              </span>
            </div>
          </div>

          {/* Gráfico Mini Simulado */}
          <div className="h-16 bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 flex items-end justify-between">
            {[65, 45, 78, 52, 89, 67, 94, 73, 85, 91, 76, 88].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-sm flex-1 mx-0.5"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          {/* Botão de Ação */}
          <Button 
            onClick={onOpenFullBI}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            🚀 Abrir Dashboard BI Completo
          </Button>

          {/* Última Atualização */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}