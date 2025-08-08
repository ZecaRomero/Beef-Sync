import { useState, useEffect } from 'react'
import { 
  BellIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import notificationService from '../services/notificationService'

export default function GTANotificationCenter({ userId }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, read, resolved
  const [typeFilter, setTypeFilter] = useState('all') // all, GTA_FOLLOWUP, NASCIMENTO, VENDA, etc
  const [showModal, setShowModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [observacoes, setObservacoes] = useState('')

  useEffect(() => {
    loadNotifications()
  }, [filter, typeFilter])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (filter !== 'all') {
        filters.status = filter.toUpperCase()
      }
      if (typeFilter !== 'all') {
        filters.tipo = typeFilter
      }
      
      const data = await notificationService.getNotifications(filters)
      setNotifications(data)
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'LIDA', dataLida: new Date().toISOString() }
            : notif
        )
      )
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const markAsResolved = async (notificationId) => {
    try {
      await notificationService.markAsResolved(notificationId, observacoes)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'RESOLVIDA', dataResolvida: new Date().toISOString() }
            : notif
        )
      )
      setShowModal(false)
      setSelectedNotification(null)
      setObservacoes('')
    } catch (error) {
      console.error('Erro ao marcar como resolvida:', error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    } catch (error) {
      console.error('Erro ao excluir notificação:', error)
    }
  }

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'ALTA':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      case 'MEDIA':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'BAIXA':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-700'
    }
  }

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'GTA_FOLLOWUP':
        return '📞'
      case 'NASCIMENTO':
        return '🐄'
      case 'VENDA':
        return '💰'
      case 'GESTACAO':
        return '🤰'
      case 'PARTO':
        return '🐣'
      case 'VACINACAO':
        return '💉'
      case 'PESAGEM':
        return '⚖️'
      case 'SYSTEM_ALERT':
        return '🔔'
      default:
        return '📋'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'LIDA':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'RESOLVIDA':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora'
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)}d atrás`
  }

  const openResolveModal = (notification) => {
    setSelectedNotification(notification)
    setShowModal(true)
  }

  const handleCall = (notification) => {
    const dados = notification.dados ? JSON.parse(notification.dados) : {}
    const telefone = dados.compradorTelefone || ''
    if (telefone) {
      window.open(`tel:${telefone}`)
    } else {
      alert('Telefone do cliente não disponível')
    }
  }

  const handleWhatsApp = (notification) => {
    const dados = notification.dados ? JSON.parse(notification.dados) : {}
    const telefone = dados.compradorTelefone || ''
    if (telefone) {
      const mensagem = encodeURIComponent(`Olá! Estou entrando em contato sobre a GTA ${dados.gtaNumero}. ${notification.mensagem}`)
      window.open(`https://wa.me/${telefone.replace(/\D/g, '')}?text=${mensagem}`)
    } else {
      alert('Telefone do cliente não disponível')
    }
  }

  const unreadCount = notifications.filter(n => n.status === 'PENDENTE').length
  const highPriorityCount = notifications.filter(n => n.prioridade === 'ALTA' && n.status === 'PENDENTE').length

  const notificationTypes = [
    { value: 'all', label: 'Todas', icon: '📋' },
    { value: 'GTA_FOLLOWUP', label: 'GTAs', icon: '📞' },
    { value: 'NASCIMENTO', label: 'Nascimentos', icon: '🐄' },
    { value: 'VENDA', label: 'Vendas', icon: '💰' },
    { value: 'GESTACAO', label: 'Gestações', icon: '🤰' },
    { value: 'PARTO', label: 'Partos', icon: '🐣' },
    { value: 'VACINACAO', label: 'Vacinações', icon: '💉' },
    { value: 'PESAGEM', label: 'Pesagens', icon: '⚖️' },
    { value: 'SYSTEM_ALERT', label: 'Sistema', icon: '🔔' }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="relative">
            <BellIcon className="h-8 w-8 text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Notificações do Sistema
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unreadCount} pendente{unreadCount !== 1 ? 's' : ''} • {highPriorityCount} alta prioridade
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            {notificationTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="all">Todas</option>
            <option value="pending">Pendentes</option>
            <option value="read">Lidas</option>
            <option value="resolved">Resolvidas</option>
          </select>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando notificações...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center">
            <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' ? 'Nenhuma notificação encontrada' : `Nenhuma notificação ${filter}`}
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 sm:p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${
                  notification.status === 'PENDENTE' 
                    ? getPriorityColor(notification.prioridade)
                    : 'bg-gray-50 dark:bg-gray-700 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="text-2xl flex-shrink-0">
                      {getTypeIcon(notification.tipo)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {notification.titulo}
                        </h4>
                        {notification.status === 'PENDENTE' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {notification.mensagem}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatTimeAgo(notification.dataCriacao)}</span>
                        <span className={`px-2 py-1 rounded-full ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          notification.prioridade === 'ALTA' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          notification.prioridade === 'MEDIA' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {notification.prioridade}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    {notification.status === 'PENDENTE' && (
                      <>
                        {notification.tipo === 'GTA_FOLLOWUP' && (
                          <>
                            <button
                              onClick={() => handleCall(notification)}
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Ligar"
                            >
                              <PhoneIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleWhatsApp(notification)}
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="WhatsApp"
                            >
                              <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Marcar como lida"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openResolveModal(notification)}
                          className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Marcar como resolvida"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Resolver Notificação */}
      {showModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Resolver Notificação
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Título:</strong> {selectedNotification.titulo}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Mensagem:</strong> {selectedNotification.mensagem}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Adicione observações sobre a resolução..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedNotification(null)
                    setObservacoes('')
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => markAsResolved(selectedNotification.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✅ Resolver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
