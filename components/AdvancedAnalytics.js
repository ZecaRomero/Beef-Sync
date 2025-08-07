import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const AdvancedAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [analytics, setAnalytics] = useState({
    fivVsIa: {
      fiv: { count: 0, avgPrice: 0, totalValue: 0 },
      ia: { count: 0, avgPrice: 0, totalValue: 0 },
    },
    byFather: [],
    byPeriod: [],
    trends: {
      priceGrowth: 0,
      volumeGrowth: 0,
      profitability: 0,
    },
  });

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      // Simular carregamento de dados reais da API
      const mockData = {
        fivVsIa: {
          fiv: {
            count: 15,
            avgPrice: 45000,
            totalValue: 675000,
            priceRange: { min: 35000, max: 65000 },
          },
          ia: {
            count: 85,
            avgPrice: 28500,
            totalValue: 2422500,
            priceRange: { min: 18000, max: 42000 },
          },
        },
        byFather: [
          {
            name: "Touro Alpha FIV",
            offspring: 8,
            avgPrice: 48000,
            totalValue: 384000,
            technique: "FIV",
          },
          {
            name: "Touro Beta IA",
            offspring: 12,
            avgPrice: 32000,
            totalValue: 384000,
            technique: "IA",
          },
          {
            name: "Touro Gamma FIV",
            offspring: 5,
            avgPrice: 52000,
            totalValue: 260000,
            technique: "FIV",
          },
          {
            name: "Touro Delta IA",
            offspring: 18,
            avgPrice: 29000,
            totalValue: 522000,
            technique: "IA",
          },
          {
            name: "Touro Epsilon FIV",
            offspring: 2,
            avgPrice: 58000,
            totalValue: 116000,
            technique: "FIV",
          },
        ],
        byPeriod: [
          { month: "Jan", fiv: 42000, ia: 26000, volume: 8 },
          { month: "Fev", fiv: 44000, ia: 27500, volume: 12 },
          { month: "Mar", fiv: 46000, ia: 28000, volume: 15 },
          { month: "Abr", fiv: 45000, ia: 29000, volume: 18 },
          { month: "Mai", fiv: 47000, ia: 30000, volume: 22 },
          { month: "Jun", fiv: 48000, ia: 31000, volume: 25 },
        ],
        trends: {
          priceGrowth: 12.5,
          volumeGrowth: 8.3,
          profitability: 15.7,
        },
      };

      setAnalytics(mockData);
    } catch (error) {
      console.error("Erro ao carregar análises:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateDifference = () => {
    const { fiv, ia } = analytics.fivVsIa;
    if (fiv.avgPrice === 0 || ia.avgPrice === 0) return 0;
    return (((fiv.avgPrice - ia.avgPrice) / ia.avgPrice) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            📊 Análises Avançadas de Vendas
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            Médias de preços, performance por pai e tendências
          </p>
        </div>
        <div className="flex space-x-2">
          {["3m", "6m", "1a", "all"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === "3m" && "3 Meses"}
              {period === "6m" && "6 Meses"}
              {period === "1a" && "1 Ano"}
              {period === "all" && "Todos"}
            </Button>
          ))}
        </div>
      </div>

      {/* FIV vs IA Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
              <BeakerIcon className="h-5 w-5 mr-2" />
              FIV (Fertilização in Vitro)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Animais Vendidos:
                </span>
                <span className="font-bold text-lg">
                  {analytics.fivVsIa.fiv.count}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Preço Médio:
                </span>
                <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                  {formatCurrency(analytics.fivVsIa.fiv.avgPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Valor Total:
                </span>
                <span className="font-bold text-lg">
                  {formatCurrency(analytics.fivVsIa.fiv.totalValue)}
                </span>
              </div>
              <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  Faixa:{" "}
                  {formatCurrency(analytics.fivVsIa.fiv.priceRange?.min || 0)} -{" "}
                  {formatCurrency(analytics.fivVsIa.fiv.priceRange?.max || 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
              <HeartIcon className="h-5 w-5 mr-2" />
              IA (Inseminação Artificial)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Animais Vendidos:
                </span>
                <span className="font-bold text-lg">
                  {analytics.fivVsIa.ia.count}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Preço Médio:
                </span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {formatCurrency(analytics.fivVsIa.ia.avgPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Valor Total:
                </span>
                <span className="font-bold text-lg">
                  {formatCurrency(analytics.fivVsIa.ia.totalValue)}
                </span>
              </div>
              <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Faixa:{" "}
                  {formatCurrency(analytics.fivVsIa.ia.priceRange?.min || 0)} -{" "}
                  {formatCurrency(analytics.fivVsIa.ia.priceRange?.max || 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              💰 Diferença de Preço Médio
            </h3>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              +{calculateDifference()}%
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              FIV tem preço médio {calculateDifference()}% maior que IA
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {analytics.fivVsIa.fiv.count + analytics.fivVsIa.ia.count}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Total Vendidos
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(
                    analytics.fivVsIa.fiv.totalValue +
                      analytics.fivVsIa.ia.totalValue
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Receita Total
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(
                    (analytics.fivVsIa.fiv.totalValue +
                      analytics.fivVsIa.ia.totalValue) /
                      (analytics.fivVsIa.fiv.count + analytics.fivVsIa.ia.count)
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Preço Médio Geral
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance by Father */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Performance por Pai/Touro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Touro
                  </th>
                  <th className="text-center py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Técnica
                  </th>
                  <th className="text-center py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Filhos
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Preço Médio
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.byFather.map((father, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-3">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {father.name}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          father.technique === "FIV"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {father.technique}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {father.offspring}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(father.avgPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold">
                      {formatCurrency(father.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Crescimento de Preços
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  +{analytics.trends.priceGrowth}%
                </p>
              </div>
              <TrendingUpIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Crescimento de Volume
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  +{analytics.trends.volumeGrowth}%
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Rentabilidade
                </p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  +{analytics.trends.profitability}%
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
