import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Badge } from './ui/badge';

const QuickActions = ({ onActionComplete }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState('animal');
  const [loading, setLoading] = useState(false);

  const quickActions = [
    {
      id: 'add_animal',
      title: 'Adicionar Animal',
      description: 'Cadastrar novo animal no rebanho',
      icon: '🐄',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => handleQuickAdd('animal')
    },
    {
      id: 'new_protocol',
      title: 'Novo Protocolo',
      description: 'Iniciar protocolo sanitário',
      icon: '💉',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => handleQuickAdd('protocol')
    },
    {
      id: 'fiv_process',
      title: 'Processo FIV',
      description: 'Iniciar novo processo de FIV',
      icon: '🧬',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => handleQuickAdd('fiv')
    },
    {
      id: 'buy_material',
      title: 'Comprar Material',
      description: 'Registrar compra de materiais',
      icon: '🛒',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => handleQuickAdd('material')
    },
    {
      id: 'sell_animal',
      title: 'Vender Animal',
      description: 'Registrar venda de animal',
      icon: '💰',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      action: () => handleQuickAdd('sale')
    },
    {
      id: 'health_check',
      title: 'Check-up Sanitário',
      description: 'Agendar exame veterinário',
      icon: '🩺',
      color: 'bg-red-500 hover:bg-red-600',
      action: () => handleQuickAdd('health')
    }
  ];

  const handleQuickAdd = (type) => {
    setQuickAddType(type);
    setShowQuickAdd(true);
  };

  const handleSubmitQuickAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setShowQuickAdd(false);

    // Notificar conclusão
    if (onActionComplete) {
      onActionComplete();
    }

    // Mostrar feedback
    alert(`✅ ${getActionTitle(quickAddType)} adicionado com sucesso!`);
  };

  const getActionTitle = (type) => {
    const titles = {
      animal: 'Animal',
      protocol: 'Protocolo',
      fiv: 'Processo FIV',
      material: 'Material',
      sale: 'Venda',
      health: 'Check-up'
    };
    return titles[type] || 'Item';
  };

  const renderQuickAddForm = () => {
    const forms = {
      animal: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Identificação
              </label>
              <Input placeholder="Ex: BOI-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Raça
              </label>
              <Select>
                <option value="">Selecione...</option>
                <option value="nelore">Nelore</option>
                <option value="GIR">GIR</option>
                <option value="brahman">Brahman</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Peso (kg)
              </label>
              <Input type="number" placeholder="450" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data de Nascimento
              </label>
              <Input type="date" />
            </div>
          </div>
        </div>
      ),
      protocol: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Protocolo
            </label>
            <Select>
              <option value="">Selecione...</option>
              <option value="vacinacao">Vacinação</option>
              <option value="vermifugacao">Vermifugação</option>
              <option value="identificacao">Identificação</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Animal(is)
            </label>
            <Input placeholder="BOI-001, BOI-002..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data Programada
            </label>
            <Input type="date" />
          </div>
        </div>
      ),
      fiv: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Doadoras
            </label>
            <Input placeholder="Quantidade de doadoras" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data da Coleta
            </label>
            <Input type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Veterinário
            </label>
            <Input placeholder="Dr. Luciano Abramo Ciambelli" />
          </div>
        </div>
      ),
      material: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Material
              </label>
              <Input placeholder="Nome do material" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <Select>
                <option value="">Selecione...</option>
                <option value="medicamento">Medicamento</option>
                <option value="identificacao">Identificação</option>
                <option value="alimentacao">Alimentação</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantidade
              </label>
              <Input type="number" placeholder="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor Unitário
              </label>
              <Input type="number" step="0.01" placeholder="25.50" />
            </div>
          </div>
        </div>
      ),
      sale: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Animal
              </label>
              <Input placeholder="BOI-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comprador
              </label>
              <Input placeholder="Frigorífico XYZ" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Peso (kg)
              </label>
              <Input type="number" placeholder="520" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor Total
              </label>
              <Input type="number" step="0.01" placeholder="3500.00" />
            </div>
          </div>
        </div>
      ),
      health: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Exame
            </label>
            <Select>
              <option value="">Selecione...</option>
              <option value="geral">Check-up Geral</option>
              <option value="reprodutivo">Exame Reprodutivo</option>
              <option value="nutricional">Avaliação Nutricional</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Animal(is)
            </label>
            <Input placeholder="BOI-001, BOI-002..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data Agendada
            </label>
            <Input type="date" />
          </div>
        </div>
      )
    };

    return forms[quickAddType] || <div>Formulário não encontrado</div>;
  };

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            ⚡ Ações Rápidas
            <Badge className="ml-2 bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
              6 disponíveis
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                onClick={action.action}
                className={`${action.color} text-white h-auto p-2 sm:p-3 md:p-4 flex flex-col items-center space-y-1 sm:space-y-2 hover:scale-105 transition-transform`}
              >
                <span className="text-lg sm:text-xl md:text-2xl">{action.icon}</span>
                <div className="text-center">
                  <div className="font-semibold text-xs sm:text-sm">{action.title}</div>
                  <div className="text-xs opacity-90 hidden sm:block">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Adição Rápida */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ⚡ {getActionTitle(quickAddType)} Rápido
                </h2>
                <Button
                  onClick={() => setShowQuickAdd(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmitQuickAdd} className="p-6">
              {renderQuickAddForm()}

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuickAdd(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      ✅ Salvar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
