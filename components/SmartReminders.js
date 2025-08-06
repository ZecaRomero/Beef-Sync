import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default function SmartReminders({ animals, materials, onCreateNotification }) {
  const [reminders, setReminders] = useState([]);
  const [activeReminders, setActiveReminders] = useState([]);

  useEffect(() => {
    generateSmartReminders();
  }, [animals, materials]);

  const generateSmartReminders = () => {
    const newReminders = [];
    const today = new Date();

    animals?.forEach(animal => {
      const birthDate = new Date(animal.birthDate);
      const ageInMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
      
      // Lembrete para vacinação de brucelose (fêmeas 3-8 meses)
      if (animal.gender === 'F' && ageInMonths >= 3 && ageInMonths <= 8) {
        const hasVaccine = materials?.find(m => 
          m.name.toLowerCase().includes('brucelose') && m.quantity > 0
        );
        
        if (hasVaccine && !animal.protocols?.includes('brucelose')) {
          newReminders.push({
            id: `brucelose-${animal.id}`,
            type: 'vaccination',
            priority: 'high',
            title: `Vacina Brucelose - ${animal.name}`,
            description: `Animal com ${ageInMonths} meses precisa da vacina de brucelose`,
            animalId: animal.id,
            animalName: animal.name,
            materialNeeded: hasVaccine.name,
            materialId: hasVaccine.id,
            dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 dias
            icon: '💉',
            color: 'red'
          });
        }
      }

      // Lembrete para colocação de brinco (8-12 meses)
      if (ageInMonths >= 8 && ageInMonths <= 12) {
        const hasBrinco = materials?.find(m => 
          m.name.toLowerCase().includes('brinco') && m.quantity > 0
        );
        
        if (hasBrinco && !animal.protocols?.includes('brinco')) {
          newReminders.push({
            id: `brinco-${animal.id}`,
            type: 'identification',
            priority: 'high',
            title: `Colocar Brinco - ${animal.name}`,
            description: `Animal com ${ageInMonths} meses precisa de identificação`,
            animalId: animal.id,
            animalName: animal.name,
            materialNeeded: hasBrinco.name,
            materialId: hasBrinco.id,
            batchNumber: hasBrinco.batchNumber,
            dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            icon: '🏷️',
            color: 'blue'
          });
        }
      }

      // Lembrete para vermifugação (2-4 meses inicial)
      if (ageInMonths >= 2 && ageInMonths <= 4) {
        const hasVermifugo = materials?.find(m => 
          m.name.toLowerCase().includes('ivermectina') && m.quantity > 0
        );
        
        if (hasVermifugo && !animal.protocols?.includes('vermifugo_inicial')) {
          newReminders.push({
            id: `vermifugo-${animal.id}`,
            type: 'medication',
            priority: 'medium',
            title: `Vermifugação - ${animal.name}`,
            description: `Animal com ${ageInMonths} meses precisa de vermífugo`,
            animalId: animal.id,
            animalName: animal.name,
            materialNeeded: hasVermifugo.name,
            materialId: hasVermifugo.id,
            dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 dias
            icon: '🐛',
            color: 'green'
          });
        }
      }
    });

    // Lembretes de estoque baixo
    materials?.forEach(material => {
      if (material.quantity <= material.minStock) {
        newReminders.push({
          id: `stock-${material.id}`,
          type: 'stock',
          priority: material.quantity === 0 ? 'urgent' : 'medium',
          title: `Estoque Baixo - ${material.name}`,
          description: `Apenas ${material.quantity} ${material.unit} restantes (mín: ${material.minStock})`,
          materialId: material.id,
          materialName: material.name,
          supplier: material.supplier,
          dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 dias
          icon: '📦',
          color: 'yellow'
        });
      }
    });

    // Lembretes de vencimento próximo
    materials?.forEach(material => {
      if (material.expiryDate) {
        const expiryDate = new Date(material.expiryDate);
        const daysToExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysToExpiry <= 30 && daysToExpiry > 0) {
          newReminders.push({
            id: `expiry-${material.id}`,
            type: 'expiry',
            priority: daysToExpiry <= 7 ? 'urgent' : 'medium',
            title: `Vencimento Próximo - ${material.name}`,
            description: `Vence em ${daysToExpiry} dias (${expiryDate.toLocaleDateString('pt-BR')})`,
            materialId: material.id,
            materialName: material.name,
            expiryDate: material.expiryDate,
            dueDate: new Date(expiryDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 dias antes
            icon: '⏰',
            color: 'orange'
          });
        }
      }
    });

    setReminders(newReminders);
    setActiveReminders(newReminders.filter(r => r.dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)));
  };

  const executeReminder = (reminder) => {
    if (reminder.type === 'vaccination' || reminder.type === 'identification' || reminder.type === 'medication') {
      // Consumir material do estoque
      const material = materials.find(m => m.id === reminder.materialId);
      if (material && material.quantity > 0) {
        // Aqui você chamaria a função para atualizar o material
        console.log(`Aplicando ${reminder.materialNeeded} em ${reminder.animalName}`);
        
        // Criar notificação de sucesso
        onCreateNotification({
          title: `✅ ${reminder.title}`,
          message: `${reminder.materialNeeded} aplicado com sucesso em ${reminder.animalName}`,
          type: 'success',
          priority: 'low'
        });
      }
    } else if (reminder.type === 'stock') {
      // Criar lembrete para comprar
      onCreateNotification({
        title: `🛒 Comprar ${reminder.materialName}`,
        message: `Entrar em contato com ${reminder.supplier} para reposição`,
        type: 'reminder',
        priority: reminder.priority
      });
    }

    // Remover lembrete da lista ativa
    setActiveReminders(prev => prev.filter(r => r.id !== reminder.id));
  };

  const snoozeReminder = (reminder, days = 3) => {
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + days);
    
    setReminders(prev => prev.map(r => 
      r.id === reminder.id ? { ...r, dueDate: newDueDate } : r
    ));
    
    setActiveReminders(prev => prev.filter(r => r.id !== reminder.id));
    
    onCreateNotification({
      title: `⏰ Lembrete Adiado`,
      message: `${reminder.title} foi adiado para ${newDueDate.toLocaleDateString('pt-BR')}`,
      type: 'info',
      priority: 'low'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    };
    
    const labels = {
      urgent: '🚨 Urgente',
      high: '⚠️ Alta',
      medium: '📋 Média',
      low: '📝 Baixa'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🧠 Lembretes Inteligentes</h2>
            <p className="opacity-90">
              Sistema automatizado baseado na idade dos animais e estoque
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{activeReminders.length}</div>
            <div className="text-sm opacity-90">Lembretes Ativos</div>
          </div>
        </div>
      </Card>

      {/* Lembretes Ativos */}
      {activeReminders.length > 0 ? (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🔔 Lembretes Ativos ({activeReminders.length})
          </h3>
          
          <div className="space-y-4">
            {activeReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(reminder.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{reminder.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {reminder.title}
                        </h4>
                        {getPriorityBadge(reminder.priority)}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {reminder.description}
                      </p>

                      {reminder.materialNeeded && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                          <strong>Material:</strong> {reminder.materialNeeded}
                          {reminder.batchNumber && ` (Lote: ${reminder.batchNumber})`}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Prazo: {reminder.dueDate.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => executeReminder(reminder)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      ✅ Executar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => snoozeReminder(reminder)}
                    >
                      ⏰ +3 dias
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-lg font-medium">Nenhum lembrete ativo</p>
            <p className="text-sm mt-2">Todos os protocolos estão em dia!</p>
          </div>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {reminders.filter(r => r.priority === 'urgent').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Urgentes</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {reminders.filter(r => r.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Alta Prioridade</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {reminders.filter(r => r.type === 'vaccination').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Vacinações</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {reminders.filter(r => r.type === 'stock').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Estoque</div>
        </Card>
      </div>
    </div>
  );
}