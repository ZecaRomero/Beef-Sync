import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  PlusIcon,
  CurrencyDollarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function LiveSaleEntry({ onSaleRegistered }) {
  const [saleData, setSaleData] = useState({
    animal: "",
    buyer: "",
    value: "",
    notes: ""
  });

  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Carregar vendas recentes
  useEffect(() => {
    loadRecentSales();
  }, []);

  const loadRecentSales = async () => {
    try {
      const response = await fetch('/api/sales-list');
      const sales = await response.json();

      // Pegar as 5 vendas mais recentes
      const recent = sales.slice(-5).reverse().map(sale => ({
        id: sale.id,
        animal: sale.animal?.brinco || sale.animalId,
        buyer: sale.nomeComprador || 'Comprador',
        value: parseFloat(sale.valorVenda) || 0,
        time: new Date(sale.dataVenda || sale.createdAt)
      }));

      setRecentSales(recent);
    } catch (error) {
      console.error('Erro ao carregar vendas recentes:', error);
    }
  };

  const handleQuickValue = (value) => {
    setSaleData(prev => ({ ...prev, value: value.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!saleData.animal || !saleData.value) {
      alert('Animal e valor são obrigatórios!');
      return;
    }

    setLoading(true);

    try {
      // Primeiro, buscar o animal pelo brinco
      const animalsResponse = await fetch('/api/animals-list');
      const animals = await animalsResponse.json();

      const animal = animals.find(a =>
        a.brinco?.toLowerCase().includes(saleData.animal.toLowerCase()) ||
        a.id === saleData.animal
      );

      if (!animal) {
        alert(`Animal ${saleData.animal} não encontrado!`);
        setLoading(false);
        return;
      }

      // Registrar a venda
      const saleResponse = await fetch('/api/sales-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          valorVenda: parseFloat(saleData.value),
          nomeComprador: saleData.buyer || 'Comprador do Leilão',
          dataVenda: new Date().toISOString(),
          observacoes: saleData.notes || `Venda registrada em tempo real - ${new Date().toLocaleTimeString('pt-BR')}`
        })
      });

      if (saleResponse.ok) {
        // Atualizar status do animal para VENDIDO
        // Garantir que o status seja sempre atualizado após a venda
        const updateAnimalStatus = async (animalId) => {
          await fetch(`/api/animals/${animalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'VENDIDO' })
          })
        }
        await fetch(`/api/animals/${animal.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'VENDIDO',
            valorVenda: parseFloat(saleData.value),
            dataVenda: new Date().toISOString()
          })
        });

        // Limpar formulário
        setSaleData({
          animal: "",
          buyer: "",
          value: "",
          notes: ""
        });

        // Mostrar sucesso
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);

        // Recarregar vendas recentes
        await loadRecentSales();

        // Notificar componente pai
        if (onSaleRegistered) {
          onSaleRegistered({
            animal: animal.brinco,
            buyer: saleData.buyer || 'Comprador do Leilão',
            value: parseFloat(saleData.value),
            time: new Date()
          });
        }

        console.log(`✅ Venda registrada: ${animal.brinco} por R$ ${saleData.value}`);
      } else {
        throw new Error('Erro ao registrar venda');
      }
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      alert('Erro ao registrar venda: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAnimal = (animalCode) => {
    setSaleData(prev => ({ ...prev, animal: animalCode }));
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Entrada Rápida */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-300 dark:border-green-600">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300 flex items-center justify-between">
            <div className="flex items-center">
              <PlusIcon className="h-6 w-6 mr-2" />
              🏛️ Registrar Venda em Tempo Real
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-semibold text-sm">AO VIVO</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Linha 1: Animal e Comprador */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🐄 Animal (Brinco/ID) *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: CJCJ 15556, 15556, etc."
                  value={saleData.animal}
                  onChange={(e) => setSaleData(prev => ({ ...prev, animal: e.target.value }))}
                  className="text-lg font-semibold"
                  required
                />

                {/* Botões de Animais Rápidos */}
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs text-gray-500">Rápido:</span>
                  {['15556', '16276', '16286', '16283', '15525'].map(code => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleQuickAnimal(`CJCJ ${code}`)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  👤 Comprador
                </label>
                <Input
                  type="text"
                  placeholder="Nome do comprador (opcional)"
                  value={saleData.buyer}
                  onChange={(e) => setSaleData(prev => ({ ...prev, buyer: e.target.value }))}
                />
              </div>
            </div>

            {/* Linha 2: Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                💰 Valor da Venda (R$) *
              </label>
              <Input
                type="number"
                placeholder="45000"
                value={saleData.value}
                onChange={(e) => setSaleData(prev => ({ ...prev, value: e.target.value }))}
                className="text-2xl font-bold text-green-600"
                required
              />

              {/* Valores Rápidos */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-gray-500">Valores rápidos:</span>
                {[25000, 30000, 35000, 40000, 45000, 50000, 60000, 75000].map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleQuickValue(value)}
                    className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-full"
                  >
                    R$ {(value / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Linha 3: Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📝 Observações
              </label>
              <Input
                type="text"
                placeholder="Observações sobre a venda (opcional)"
                value={saleData.notes}
                onChange={(e) => setSaleData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Botão de Envio */}
            <Button
              type="submit"
              disabled={loading || !saleData.animal || !saleData.value}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <ClockIcon className="h-5 w-5 mr-2 animate-spin" />
                  Registrando Venda...
                </>
              ) : (
                <>
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  🏛️ Registrar Venda
                </>
              )}
            </Button>
          </form>

          {/* Feedback de Sucesso */}
          {success && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-600 rounded-lg flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-700 dark:text-green-300 font-semibold">
                ✅ Venda registrada com sucesso!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🕐 Últimas Vendas Registradas</span>
            <Button
              onClick={loadRecentSales}
              size="sm"
              variant="outline"
            >
              🔄 Atualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSales.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <div>Nenhuma venda registrada ainda</div>
                <div className="text-sm mt-1">
                  Use o formulário acima para registrar a primeira venda
                </div>
              </div>
            ) : (
              recentSales.map((sale, index) => (
                <div
                  key={sale.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    index === 0
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <div className="font-bold text-lg">{sale.animal}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {sale.time.toLocaleTimeString('pt-BR')} - {sale.buyer}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      R$ {sale.value.toLocaleString('pt-BR')}
                    </div>
                    {index === 0 && (
                      <div className="text-xs text-green-500 font-semibold">
                        ✨ RECÉM ADICIONADA
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instruções Rápidas */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
            📋 Como Usar - Registro Rápido
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <strong>1. Digite o Animal:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• CJCJ 15556</li>
                <li>• Apenas 15556</li>
                <li>• Use botões rápidos</li>
              </ul>
            </div>
            <div>
              <strong>2. Valor da Venda:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Digite: 45000</li>
                <li>• Use botões rápidos</li>
                <li>• Sem pontos ou vírgulas</li>
              </ul>
            </div>
            <div>
              <strong>3. Comprador (Opcional):</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Nome do comprador</li>
                <li>• Deixe vazio se não souber</li>
              </ul>
            </div>
            <div>
              <strong>4. Registrar:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Clique "Registrar Venda"</li>
                <li>• Aparece nas vendas recentes</li>
                <li>• Atualiza timeline automaticamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
