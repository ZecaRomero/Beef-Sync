import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { reproductionService } from "../services/reproductionService";
import { useIsClient } from "../hooks/useLocalStorage";
import { useTheme } from "../hooks/useTheme";
import FaseColeta from "./reproduction/FaseColeta";
import FaseFIV from "./reproduction/FaseFIV";
import FaseTE from "./reproduction/FaseTE";
import FaseDG from "./reproduction/FaseDG";
import FaseSexagem from "./reproduction/FaseSexagem";
import FaseEntrega from "./reproduction/FaseEntrega";
import CostDashboard from "./reproduction/CostDashboard";
import CostSettings from "./reproduction/CostSettings";
import SemenManager from "./reproduction/SemenManager";
import SemenStockManager from "./reproduction/SemenStockManager";
import AuthFixer from "./AuthFixer";
import ApiStatusBanner from "./ApiStatusBanner";

const ReproductionManager = () => {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [financialReport, setFinancialReport] = useState(null);
  const [activeTab, setActiveTab] = useState("process");
  const [showCostSettings, setShowCostSettings] = useState(false);
  const isClient = useIsClient();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isClient) {
      loadData();
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [isClient]);

  const loadData = () => {
    try {
      const allProcesses = reproductionService.getAllProcesses();
      const currentAlerts = reproductionService.getAlerts();
      const report = reproductionService.getFinancialReport();

      setProcesses(allProcesses);
      setAlerts(currentAlerts);
      setFinancialReport(report);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      localStorage.removeItem("reproduction_processes");
      setProcesses([]);
      setAlerts([]);
    }
  };

  const createNewProcess = () => {
    const newProcess = reproductionService.createProcess();
    setProcesses(reproductionService.getAllProcesses());
    setSelectedProcess(newProcess);
    setActiveTab("process");
  };

  const updateProcess = (processId, updates) => {
    reproductionService.updateProcess(processId, updates);
    setProcesses(reproductionService.getAllProcesses());
    const updatedProcess = reproductionService.getProcess(processId);
    setSelectedProcess(updatedProcess);
    loadData();
  };

  const deleteProcess = (processId) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      reproductionService.deleteProcess(processId);
      setProcesses(reproductionService.getAllProcesses());
      if (selectedProcess?.id === processId) {
        setSelectedProcess(null);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  const getPhaseStatus = (process, phase) => {
    if (process[phase]?.realizada) return "completed";
    if (process[phase]) return "in-progress";
    return "pending";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  if (!isClient) {
    return (
      <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Carregando sistema de reprodução...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 text-gray-900 dark:text-gray-100">
      {/* Header Mobile-Friendly */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Sistema de Reprodução
          </h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={toggleTheme}
              size="sm"
              className="flex items-center"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCostSettings(true)}
              size="sm"
            >
              ⚙️
            </Button>
          </div>
        </div>

        {/* Tabs Mobile-Friendly */}
        <div className="flex flex-wrap gap-1 md:gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "process" ? "default" : "outline"}
            onClick={() => setActiveTab("process")}
            size="sm"
            className="whitespace-nowrap text-xs md:text-sm"
          >
            Processos
          </Button>
          <Button
            variant={activeTab === "semen" ? "default" : "outline"}
            onClick={() => setActiveTab("semen")}
            size="sm"
            className="whitespace-nowrap text-xs md:text-sm"
          >
            Doses de Sêmen
          </Button>
          <Button
            variant={activeTab === "semen-stock" ? "default" : "outline"}
            onClick={() => setActiveTab("semen-stock")}
            size="sm"
            className="whitespace-nowrap text-xs md:text-sm"
          >
            🧬 Estoque
          </Button>
          <Button
            variant={activeTab === "costs" ? "default" : "outline"}
            onClick={() => setActiveTab("costs")}
            size="sm"
            className="whitespace-nowrap text-xs md:text-sm"
          >
            <CurrencyDollarIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Custos
          </Button>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              className={`border-l-4 ${alert.priority === "high"
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : alert.priority === "medium"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                  : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                }`}
            >
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.title}</strong>: {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {showCostSettings ? (
        <CostSettings
          onClose={() => {
            setShowCostSettings(false);
            loadData();
          }}
        />
      ) : activeTab === "semen" ? (
        <SemenManager />
      ) : activeTab === "semen-stock" ? (
        <SemenStockManager />
      ) : activeTab === "costs" ? (
        <CostDashboard
          process={selectedProcess}
          financialReport={financialReport}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <div className="xl:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base md:text-lg font-medium">
                  Processos Ativos ({processes.length})
                </CardTitle>
                <Button onClick={createNewProcess} size="sm">
                  Novo Processo
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {processes.length === 0 ? (
                  <div className="text-center py-6 md:py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm md:text-base">
                      Nenhum processo ativo
                    </p>
                    <Button onClick={createNewProcess} size="sm">
                      Criar Primeiro Processo
                    </Button>
                  </div>
                ) : (
                  processes.map((process) => (
                    <div
                      key={process.id}
                      className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-colors ${selectedProcess?.id === process.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      onClick={() => setSelectedProcess(process)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm md:text-base">
                          Processo #{process.id}
                        </h3>
                        <Badge
                          variant={
                            process.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {process.status === "completed"
                            ? "Concluído"
                            : "Em Andamento"}
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Iniciado em{" "}
                        {new Date(process.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                      <div className="flex space-x-1 mb-2">
                        {["coleta", "fiv", "te", "dg", "sexagem", "entrega"].map(
                          (phase) => (
                            <div
                              key={phase}
                              className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${getStatusColor(
                                getPhaseStatus(process, phase)
                              )}`}
                              title={phase}
                            />
                          )
                        )}
                      </div>
                      <div className="text-xs md:text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Custo Total:{" "}
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(process.custoTotal || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-2">
            {selectedProcess ? (
              <ProcessDetails
                process={selectedProcess}
                onUpdate={(updates) =>
                  updateProcess(selectedProcess.id, updates)
                }
                onDelete={() => deleteProcess(selectedProcess.id)}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64 md:h-96">
                  <div className="text-center">
                    <div className="text-4xl md:text-6xl mb-4">🐄</div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Selecione um Processo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base">
                      Escolha um processo da lista para visualizar os detalhes
                      das fases
                    </p>
                    {processes.length === 0 && (
                      <Button onClick={createNewProcess} size="sm">
                        Criar Primeiro Processo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProcessDetails = ({ process, onUpdate, onDelete }) => {
  const [activePhase, setActivePhase] = useState("coleta");

  const phases = [
    { id: "coleta", name: "1ª Fase - Coleta", component: FaseColeta },
    { id: "fiv", name: "2ª Fase - FIV", component: FaseFIV },
    { id: "te", name: "3ª Fase - TE", component: FaseTE },
    { id: "dg", name: "4ª Fase - DG", component: FaseDG },
    { id: "sexagem", name: "5ª Fase - Sexagem", component: FaseSexagem },
    { id: "entrega", name: "6ª Fase - Entrega", component: FaseEntrega },
  ];

  const ActiveComponent = phases.find(
    (phase) => phase.id === activePhase
  )?.component;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-base md:text-lg">Processo #{process.id}</CardTitle>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Excluir Processo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <div className="font-semibold">
                {process.status === "completed" ? "Concluído" : "Em Andamento"}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Criado em:
              </span>
              <div className="font-semibold">
                {new Date(process.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <span className="text-gray-600 dark:text-gray-400">
                Custo Total:
              </span>
              <div className="font-semibold text-green-600 dark:text-green-400">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(process.custoTotal || 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-1 md:gap-2 overflow-x-auto pb-2">
            {phases.map((phase) => (
              <Button
                key={phase.id}
                variant={activePhase === phase.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePhase(phase.id)}
                className="whitespace-nowrap text-xs md:text-sm"
              >
                {phase.name}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {ActiveComponent && (
            <ActiveComponent process={process} onUpdate={onUpdate} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReproductionManager;
