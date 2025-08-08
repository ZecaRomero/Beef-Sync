import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  HeartIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const ReceptorAlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [receptors, setReceptors] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    loadReceptorData();
    generateAlerts();
  }, []);

  const loadReceptorData = () => {
    // Simular dados de receptoras
    const mockReceptors = [
      {
        id: 1,
        name: 'Receptora 001',
        lastBirth: '2024-04-15',
        status: 'apta_te',
        daysAfterBirth: 65,
        pregnancyStatus: null,
        lastService: null,
        weaningDate: null,
        category: 'ativa'
      },
      {
        id: 2,
        name: 'Receptora 002',
        lastBirth: '2024-03-20',
        status: 'servico_pendente',
        daysAfterBirth: 95,
        pregnancyStatus: 'failed',
        lastService: '2024-06-15',
        weaningDate: '2024-06-10',
        category: 'descarte_candidata'
      },
      {
        id: 3,
        name: 'Receptora 003',
        lastBirth: '2024-02-10',
        status: 'inativa',
        daysAfterBirth: 125,
        pregnancyStatus: null,
        lastService: null,
        weaningDate: '2024-05-15',
        category: 'inativa'
      },
      {
        id: 4,
        name: 'Receptora 004',
        lastBirth: '2024-05-01',
        status: 'apta_te',
        daysAfterBirth: 45,
        pregnancyStatus: null,
        lastService: null,
        weaningDate: null,
        category: 'ativa'
      },
      {
        id: 5,
        name: 'Receptora 005',
        lastBirth: '2024-01-15',
        status: 'prenha',
        daysAfterBirth: 150,
        pregnancyStatus: 'confirmed',
        lastService: '2024-04-20',
        weaningDate: '2024-04-10',
        category: 'ativa'
      }
    ];

    setReceptors(mockReceptors);
  };

  const generateAlerts = () => {
    const today = new Date();
    const alertsGenerated = [];

    receptors.forEach(receptor => {
      const birthDate = new Date(receptor.lastBirth);
      const daysSinceBirth = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));

      // Alerta: 2 meses após parto - apta para nova TE
      if (daysSinceBirth >= 60 && daysSinceBirth <= 70 && !receptor.pregnancyStatus) {
        alertsGenerated.push({
          id: `te_ready_${receptor.id}`,
          type: 'te_ready',
          priority: 'medium',
          receptorId: receptor.id,
          receptorName: receptor.name,
          title: 'Apta para Nova TE',
          message: `${receptor.name} está apta para nova Transferência de Embrião (${daysSinceBirth} dias após parto)`,
          daysAfterBirth: daysSinceBirth,
          actionRequired: 'Agendar TE',
          createdAt: today.toISOString()
        });
      }

      // Alerta: Não emprenhou após serviço
      if (receptor.pregnancyStatus === 'failed' && receptor.lastService) {
        const serviceDate = new Date(receptor.lastService);
        const daysSinceService = Math.floor((today - serviceDate) / (1000 * 60 * 60 * 24));

        if (daysSinceService >= 30) {
          alertsGenerated.push({
            id: `pregnancy_failed_${receptor.id}`,
            type: 'pregnancy_failed',
            priority: 'high',
            receptorId: receptor.id,
            receptorName: receptor.name,
            title: 'Não Emprenhou - Candidata a Descarte',
            message: `${receptor.name} não emprenhou após serviço. Avaliar para descarte.`,
            daysSinceService: daysSinceService,
            actionRequired: 'Marcar como descarte',
            createdAt: today.toISOString()
          });
        }
      }

      // Alerta: Inatividade após desmama
      if (receptor.weaningDate && !receptor.lastService) {
        const weaningDate = new Date(receptor.weaningDate);
        const daysSinceWeaning = Math.floor((today - weaningDate) / (1000 * 60 * 60 * 24));

        if (daysSinceWeaning >= 60 && daysSinceWeaning <= 90) {
          alertsGenerated.push({
            id: `inactive_warning_${receptor.id}`,
            type: 'inactive_warning',
            priority: 'medium',
            receptorId: receptor.id,
            receptorName: receptor.name,
            title: 'Sem Serviço Após Desmama',
            message: `${receptor.name} está ${daysSinceWeaning} dias sem serviço após desmama`,
            daysSinceWeaning: daysSinceWeaning,
            actionRequired: 'Agendar serviço ou avaliar',
            createdAt: today.toISOString()
          });
        } else if (daysSinceWeaning > 90) {
          alertsGenerated.push({
            id: `inactive_critical_${receptor.id}`,
            type: 'inactive_critical',
            priority: 'high',
            receptorId: receptor.id,
            receptorName: receptor.name,
            title: 'Inativa - Mover para Lista de Inativos',
            message: `${receptor.name} está ${daysSinceWeaning} dias sem serviço. Mover para inativos.`,
            daysSinceWeaning: daysSinceWeaning,
            actionRequired: 'Marcar como inativa',
            createdAt: today.toISOString()
          });
        }
      }
    });

    setAlerts(alertsGenerated);
  };

  const handleAlertAction = (alertId, action) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    // Simular ação no backend
    console.log(`Executando ação: ${action} para ${alert.receptorName}`);

    // Atualizar status da receptora
    setReceptors(prev => prev.map(receptor => {
      if (receptor.id === alert.receptorId) {
        switch (action) {
          case 'mark_te_scheduled':
            return { ...receptor, status: 'te_agendada' };
          case 'mark_discard':
            return { ...receptor, category: 'descarte', status: 'descarte' };
          case 'mark_inactive':
            return { ...receptor, category: 'inativa', status: 'inativa' };
          case 'schedule_service':
            return { ...receptor, status: 'servico_agendado' };
          default:
            return receptor;
        }
      }
      return receptor;
    }));

    // Remover alerta
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-800';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'te_ready': return <HeartIcon className="h-5 w-5 text-blue-600" />;
      case 'pregnancy_failed': return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'inactive_warning': return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'inactive_critical': return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default: return <BellIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionButtons = (alert) => {
    switch (alert.type) {
      case 'te_ready':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleAlertAction(alert.id, 'mark_te_scheduled')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Agendar TE
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAlertAction(alert.id, 'dismiss')}
            >
              Dispensar
            </Button>
          </div>
        );
      case 'pregnancy_failed':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleAlertAction(alert.id, 'mark_discard')}
              className="bg-red-600 hover:bg-red-700"
            >
              Marcar Descarte
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAlertAction(alert.id, 'schedule_service')}
            >
              Nova Tentativa
            </Button>
          </div>
        );
      case 'inactive_warning':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleAlertAction(alert.id, 'schedule_service')}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Agendar Serviço
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAlertAction(alert.id, 'dismiss')}
            >
              Dispensar
            </Button>
          </div>
        );
      case 'inactive_critical':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleAlertAction(alert.id, 'mark_inactive')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Marcar Inativa
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAlertAction(alert.id, 'schedule_service')}
            >
              Agendar Serviço
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            🔔 Sistema de Alertas - Receptoras
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Monitoramento automático de receptoras e alertas de gestão
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {alerts.filter(a => a.priority === 'high').length} Críticos
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {alerts.filter(a => a.priority === 'medium').length} Médios
          </Badge>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Nenhum Alerta Ativo
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Todas as receptoras estão sendo monitoradas adequadamente.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${alert.priority === 'high' ? 'border-l-red-500' :
                alert.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {alert.title}
                        </h3>
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority === 'high' ? 'Crítico' :
                            alert.priority === 'medium' ? 'Médio' : 'Baixo'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {alert.receptorName}
                        </span>
                        {alert.daysAfterBirth && (
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {alert.daysAfterBirth} dias após parto
                          </span>
                        )}
                        {alert.daysSinceWeaning && (
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {alert.daysSinceWeaning} dias após desmama
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getActionButtons(alert)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-3 sm:pt-4 md:pt-6 p-3 sm:p-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {receptors.filter(r => r.status === 'apta_te').length}
              </div>
              <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">Aptas para TE</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-3 sm:pt-4 md:pt-6 p-3 sm:p-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {receptors.filter(r => r.pregnancyStatus === 'confirmed').length}
              </div>
              <div className="text-xs sm:text-sm text-green-800 dark:text-green-200">Prenhas</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-3 sm:pt-4 md:pt-6 p-3 sm:p-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                {receptors.filter(r => r.category === 'descarte' || r.category === 'descarte_candidata').length}
              </div>
              <div className="text-xs sm:text-sm text-red-800 dark:text-red-200">Descarte</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {receptors.filter(r => r.category === 'inativa').length}
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Inativas</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceptorAlertSystem;
