import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const NotificationCenter = ({ notifications = [], onNotificationRead }) => {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
      market: '📈',
      protocol: '💉',
      fiv: '🧬',
      sale: '💰'
    };
    return icons[type] || 'ℹ️';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') {
      return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20';
    }
    
    const colors = {
      success: 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20',
      warning: 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      error: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20',
      info: 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      market: 'border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20',
      protocol: 'border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20',
      fiv: 'border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
      sale: 'border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
    };
    return colors[type] || colors.info;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: <Badge className="bg-red-600 text-white dark:bg-red-500 dark:text-white">🚨 Alta</Badge>,
      medium: <Badge className="bg-yellow-600 text-white dark:bg-yellow-500 dark:text-white">⚡ Média</Badge>,
      low: <Badge className="bg-blue-600 text-white dark:bg-blue-500 dark:text-white">📋 Baixa</Badge>
    };
    return badges[priority] || badges.low;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const displayedNotifications = showAll 
    ? filteredNotifications 
    : filteredNotifications.slice(0, 5);

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read && onNotificationRead) {
        onNotificationRead(notification.id);
      }
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            🔔 Central de Notificações
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {unreadCount} não lidas
              </Badge>
            )}
            {highPriorityCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white animate-pulse">
                🚨 {highPriorityCount} urgentes
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                ✅ Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { id: 'all', label: 'Todas', count: notifications.length },
            { id: 'unread', label: 'Não Lidas', count: unreadCount },
            { id: 'warning', label: 'Avisos', count: notifications.filter(n => n.type === 'warning').length },
            { id: 'success', label: 'Sucessos', count: notifications.filter(n => n.type === 'success').length },
            { id: 'market', label: 'Mercado', count: notifications.filter(n => n.type === 'market').length }
          ].map(filterOption => (
            <Button
              key={filterOption.id}
              variant={filter === filterOption.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.id)}
              className={`text-xs ${
                filter === filterOption.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <Badge className="ml-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {filterOption.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'unread' 
                ? 'Todas as notificações foram lidas!' 
                : 'Nenhuma notificação encontrada'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${getNotificationColor(notification.type, notification.priority)} ${
                  notification.read ? 'opacity-75' : ''
                } hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => {
                  if (!notification.read && onNotificationRead) {
                    onNotificationRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        {getPriorityBadge(notification.priority)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botão Ver Mais */}
            {filteredNotifications.length > 5 && !showAll && (
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(true)}
                  className="text-blue-600 dark:text-blue-400"
                >
                  Ver mais {filteredNotifications.length - 5} notificações
                </Button>
              </div>
            )}

            {showAll && filteredNotifications.length > 5 && (
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(false)}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Mostrar menos
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;