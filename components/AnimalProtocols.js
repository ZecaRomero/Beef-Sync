import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

export default function AnimalProtocols({
  materials,
  animals,
  onUpdateMaterial,
  onCreateReminder,
}) {
  const [protocols, setProtocols] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [activeProtocol, setActiveProtocol] = useState(null);

  // Protocolos padrão baseados na idade
  const defaultProtocols = [
    {
      id: "brucelose",
      name: "Vacinação Brucelose",
      description: "Vacina obrigatória para fêmeas",
      ageRange: { min: 3, max: 8, unit: "months" },
      gender: "female",
      materials: ["vacina_brucelose"],
      frequency: "once",
      priority: "high",
      icon: "💉",
      color: "red",
    },
    {
      id: "brinco_identificacao",
      name: "Colocação de Brinco",
      description: "Identificação individual do animal",
      ageRange: { min: 8, max: 12, unit: "months" },
      gender: "both",
      materials: ["brinco_auricular"],
      frequency: "once",
      priority: "high",
      icon: "🏷️",
      color: "blue",
    },
    {
      id: "vermifugo_inicial",
      name: "Vermifugação Inicial",
      description: "Primeira aplicação de vermífugo",
      ageRange: { min: 2, max: 4, unit: "months" },
      gender: "both",
      materials: ["ivermectina", "vermifugo"],
      frequency: "once",
      priority: "medium",
      icon: "🐛",
      color: "green",
    },
    {
      id: "vermifugo_manutencao",
      name: "Vermifugação de Manutenção",
      description: "Aplicação periódica de vermífugo",
      ageRange: { min: 6, max: 999, unit: "months" },
      gender: "both",
      materials: ["ivermectina", "vermifugo"],
      frequency: "quarterly",
      priority: "medium",
      icon: "🔄",
      color: "yellow",
    },
    {
      id: "vacina_aftosa",
      name: "Vacinação Aftosa",
      description: "Vacina contra febre aftosa",
      ageRange: { min: 4, max: 999, unit: "months" },
      gender: "both",
      materials: ["vacina_aftosa"],
      frequency: "biannual",
      priority: "high",
      icon: "🦠",
      color: "purple",
    },
  ];

  useEffect(() => {
    setProtocols(defaultProtocols);
    checkPendingActions();
  }, [animals, materials]);

  // Função para calcular idade em meses
  const calculateAgeInMonths = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now - birth);
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
  };

  // Verificar ações pendentes baseadas na idade dos animais
  const checkPendingActions = () => {
    const pending = [];

    animals?.forEach((animal) => {
      const ageInMonths = calculateAgeInMonths(animal.birthDate);

      protocols.forEach((protocol) => {
        // Verificar se o animal está na faixa etária
        if (
          ageInMonths >= protocol.ageRange.min &&
          ageInMonths <= protocol.ageRange.max
        ) {
          // Verificar gênero
          if (
            protocol.gender === "both" ||
            (protocol.gender === "female" && animal.gender === "F") ||
            (protocol.gender === "male" && animal.gender === "M")
          ) {
            // Verificar se já foi aplicado (simulado)
            const alreadyApplied = animal.protocols?.includes(protocol.id);

            if (!alreadyApplied) {
              // Verificar disponibilidade de materiais
              const availableMaterials = protocol.materials
                .map((materialType) => {
                  return materials?.find(
                    (m) =>
                      m.category === materialType ||
                      m.name
                        .toLowerCase()
                        .includes(materialType.replace("_", " "))
                  );
                })
                .filter(Boolean);

              pending.push({
                id: `${animal.id}-${protocol.id}`,
                animalId: animal.id,
                animalName: animal.name || `Animal ${animal.id}`,
                animalAge: ageInMonths,
                protocol: protocol,
                availableMaterials,
                status:
                  availableMaterials.length > 0 ? "ready" : "waiting_materials",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
                urgency:
                  ageInMonths > protocol.ageRange.max - 1 ? "urgent" : "normal",
              });
            }
          }
        }
      });
    });

    setPendingActions(pending);
  };

  const executeProtocol = (action) => {
    // Consumir materiais do estoque
    action.availableMaterials.forEach((material) => {
      if (material && material.quantity > 0) {
        onUpdateMaterial(material.id, {
          ...material,
          quantity: material.quantity - 1,
          totalValue: (material.quantity - 1) * material.unitPrice,
        });
      }
    });

    // Criar lembrete para próxima aplicação se necessário
    if (action.protocol.frequency !== "once") {
      const nextDate = new Date();
      switch (action.protocol.frequency) {
        case "quarterly":
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case "biannual":
          nextDate.setMonth(nextDate.getMonth() + 6);
          break;
        case "annual":
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      onCreateReminder({
        title: `${action.protocol.name} - ${action.animalName}`,
        message: `Aplicar ${action.protocol.name} no animal ${action.animalName}`,
        date: nextDate,
        type: "protocol",
        priority: action.protocol.priority,
      });
    }

    // Remover da lista de pendentes
    setPendingActions((prev) => prev.filter((p) => p.id !== action.id));

    alert(`✅ ${action.protocol.name} aplicado em ${action.animalName}!`);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "normal":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "waiting_materials":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              🎯 Protocolos Sanitários Inteligentes
            </h2>
            <p className="opacity-90">
              Sistema automatizado baseado na idade dos animais
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{pendingActions.length}</div>
            <div className="text-sm opacity-90">Ações Pendentes</div>
          </div>
        </div>
      </Card>

      {/* Ações Pendentes */}
      {pendingActions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            ⏰ Ações Pendentes ({pendingActions.length})
          </h3>

          <div className="space-y-4">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className={`p-4 rounded-lg border-l-4 ${getUrgencyColor(
                  action.urgency
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{action.protocol.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {action.protocol.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            action.status
                          )}`}
                        >
                          {action.status === "ready"
                            ? "Pronto"
                            : "Aguardando Materiais"}
                        </span>
                        {action.urgency === "urgent" && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            🚨 Urgente
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Animal:</strong> {action.animalName} (
                        {action.animalAge} meses)
                      </p>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {action.protocol.description}
                      </p>

                      {/* Materiais Necessários */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Materiais necessários:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {action.protocol.materials.map(
                            (materialType, index) => {
                              const material = action.availableMaterials.find(
                                (m) =>
                                  m?.category === materialType ||
                                  m?.name
                                    .toLowerCase()
                                    .includes(materialType.replace("_", " "))
                              );

                              return (
                                <span
                                  key={index}
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    material && material.quantity > 0
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  }`}
                                >
                                  {material
                                    ? `${material.name} (${material.quantity})`
                                    : materialType}
                                </span>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Prazo: {action.dueDate.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {action.status === "ready" ? (
                      <Button
                        onClick={() => executeProtocol(action)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        ✅ Aplicar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        disabled
                      >
                        ⏳ Aguardando
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date();
                        newDate.setDate(newDate.getDate() + 7);
                        onCreateReminder({
                          title: `Lembrete: ${action.protocol.name}`,
                          message: `Lembrar de aplicar ${action.protocol.name} no animal ${action.animalName}`,
                          date: newDate,
                          type: "reminder",
                          priority: action.protocol.priority,
                        });
                        alert("🔔 Lembrete criado para 7 dias!");
                      }}
                    >
                      🔔 Lembrete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Protocolos Disponíveis */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📋 Protocolos Configurados
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.map((protocol) => (
            <div
              key={protocol.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{protocol.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {protocol.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {protocol.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>
                      <strong>Idade:</strong> {protocol.ageRange.min}-
                      {protocol.ageRange.max} meses
                    </div>
                    <div>
                      <strong>Gênero:</strong>{" "}
                      {protocol.gender === "both"
                        ? "Ambos"
                        : protocol.gender === "female"
                        ? "Fêmeas"
                        : "Machos"}
                    </div>
                    <div>
                      <strong>Frequência:</strong>{" "}
                      {protocol.frequency === "once"
                        ? "Uma vez"
                        : protocol.frequency === "quarterly"
                        ? "Trimestral"
                        : protocol.frequency === "biannual"
                        ? "Semestral"
                        : "Anual"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {pendingActions.filter((a) => a.urgency === "urgent").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Urgentes
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {pendingActions.filter((a) => a.status === "ready").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Prontos
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {
              pendingActions.filter((a) => a.status === "waiting_materials")
                .length
            }
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Aguardando
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {protocols.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Protocolos
          </div>
        </Card>
      </div>
    </div>
  );
}
