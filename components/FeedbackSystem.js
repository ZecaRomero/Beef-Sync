import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const FeedbackSystem = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [priority, setPriority] = useState('medium');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const feedbackTypes = [
    { id: 'suggestion', name: 'Sugestão', icon: LightBulbIcon, color: 'bg-blue-100 text-blue-800' },
    { id: 'bug', name: 'Bug/Problema', icon: ExclamationTriangleIcon, color: 'bg-red-100 text-red-800' },
    { id: 'improvement', name: 'Melhoria', icon: CheckCircleIcon, color: 'bg-green-100 text-green-800' },
    { id: 'feature', name: 'Nova Funcionalidade', icon: LightBulbIcon, color: 'bg-purple-100 text-purple-800' }
  ];

  const priorities = [
    { id: 'low', name: 'Baixa', color: 'bg-blue-100 text-blue-800' },
    { id: 'medium', name: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { id: 'critical', name: 'Crítica', color: 'bg-red-100 text-red-800' }
  ];

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      alert('Por favor, escreva seu feedback');
      return;
    }

    const newFeedback = {
      id: Date.now(),
      text: feedback,
      type: feedbackType,
      priority,
      user: user?.name || 'Usuário',
      date: new Date().toISOString(),
      status: 'pending'
    };

    // Salvar no localStorage (em produção seria enviado para o backend)
    const existingFeedbacks = JSON.parse(localStorage.getItem('beef-sync-feedbacks') || '[]');
    const updatedFeedbacks = [...existingFeedbacks, newFeedback];
    localStorage.setItem('beef-sync-feedbacks', JSON.stringify(updatedFeedbacks));

    setSubmittedFeedbacks(prev => [newFeedback, ...prev]);
    setFeedback('');
    setFeedbackType('suggestion');
    setPriority('medium');
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Carregar feedbacks existentes
  React.useEffect(() => {
    const existingFeedbacks = JSON.parse(localStorage.getItem('beef-sync-feedbacks') || '[]');
    setSubmittedFeedbacks(existingFeedbacks);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Análise';
      case 'completed': return 'Implementado';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sistema de Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compartilhe suas ideias, sugestões e reporte problemas
          </p>
        </div>
      </div>

      {/* Formulário de Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LightBulbIcon className="h-5 w-5" />
            <span>Novo Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo de Feedback */}
          <div>
            <Label className="text-sm font-medium">Tipo de Feedback</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFeedbackType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${feedbackType === type.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-blue-200 hover:border-blue-300'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <type.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{type.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <Label className="text-sm font-medium">Prioridade</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => setPriority(priority.id)}
                  className={`p-2 rounded-lg border-2 transition-all ${priority === priority.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <span className="text-sm font-medium">{priority.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Texto do Feedback */}
          <div>
            <Label htmlFor="feedback" className="text-sm font-medium">
              Seu Feedback
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Descreva sua sugestão, problema ou ideia..."
              className="mt-1 min-h-[120px]"
            />
          </div>

          {/* Botão de Envio */}
          <Button
            onClick={handleSubmitFeedback}
            className="w-full"
            disabled={!feedback.trim()}
          >
            Enviar Feedback
          </Button>
        </CardContent>
      </Card>

      {/* Feedbacks Enviados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5" />
            <span>Meus Feedbacks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submittedFeedbacks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum feedback enviado ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedFeedbacks.map((item) => {
                const type = feedbackTypes.find(t => t.id === item.type);
                const priorityItem = priorities.find(p => p.id === item.priority);

                return (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{item.user}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={type.color}>
                          {type.name}
                        </Badge>
                        <Badge className={priorityItem.color}>
                          {priorityItem.name}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notificação de Sucesso */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>Feedback enviado com sucesso!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSystem;
