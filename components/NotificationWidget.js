
import { useState, useEffect } from 'react'
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import GTANotificationCenter from './GTANotificationCenter'

export default function NotificationWidget({ userId }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [highPriorityCount, setHighPriorityCount] = useState(0)

  useEffect(() => {
    loadNotificationCounts()
    // Atualizar contadores a cada 30 segundos
    const interval = setInterval(loadNotificationCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotificationCounts = async () => {
    try {
      const response = await fetch('/api/notifications?status=PENDENTE', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('beef_sync_token')}`
        }
      })

      if (response.ok) {
        const notifications = await response.json()
        setUnreadCount(notifications.length)
        setHighPriorityCount(notifications.filter(n => n.prioridade === 'ALTA').length)
      }
    } catch (error) {
      console.error('Erro ao carregar contadores de notificação:', error)
    }
  }

  return (
    <>
      {/* Botão de Notificações */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
        >
          <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />

          {/* Badge de notificações não lidas */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          {/* Badge de alta prioridade */}
          {highPriorityCount > 0 && unreadCount === 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold">
              {highPriorityCount}
            </span>
          )}
        </button>

        {/* Tooltip */}
        {unreadCount > 0 && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50 hidden sm:block">
            {unreadCount} notificação{unreadCount !== 1 ? 'es' : ''} pendente{unreadCount !== 1 ? 's' : ''}
            {highPriorityCount > 0 && (
              <span className="block text-orange-300">
                {highPriorityCount} de alta prioridade
              </span>
            )}
          </div>
        )}
      </div>

      {/* Modal de Notificações */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center space-x-3">
                <BellIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    🔔 Centro de Notificações
                  </h2>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Follow-up de GTAs e alertas do sistema
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-xl sm:text-2xl font-bold"
              >
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)]">
              <GTANotificationCenter userId={userId} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
