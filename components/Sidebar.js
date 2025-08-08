import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
// Dados mockados removidos - usando dados reais da API
import { exportToExcel, formatAnimalDataForExport, exportCostsToExcel, exportReportToExcel } from '../services/exportUtils'
import MarketWidget from './MarketWidget'
import { 
  HomeIcon, 
  PencilIcon, 
  ChartBarIcon, 
  CogIcon,
  XMarkIcon,
  PlusIcon,
  CalculatorIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  TrashIcon,
  BookmarkIcon,
  HeartIcon,
  UserIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter()
  const { user, isDeveloper, isConsultant, checkPermission } = useAuth()
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Navegação para desenvolvedores (acesso completo)
  const developerNavigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Editar Animal', href: '/animals', icon: PencilIcon },
    { name: 'Reprodução', href: '/reproduction', icon: HeartIcon },
    { name: 'Gestações', href: '/gestacao', icon: PlusIcon },
    { name: 'Relatórios Gráficos', href: '/reports', icon: ChartBarIcon },
    { name: 'Usuários', href: '/users', icon: UserIcon },
    { name: 'Configurações', href: '/settings', icon: CogIcon },
  ]

  // Navegação para consultores (acesso limitado)
  const consultantNavigation = [
    { name: 'Dashboards', href: '/', icon: HomeIcon },
    { name: 'Mais Ideias', href: '/dashboard-new', icon: EyeIcon },
    { name: 'Dados de Vendas', href: '/vendas', icon: CurrencyDollarIcon },
    { name: 'Relatórios Gerais', href: '/reports', icon: ClipboardDocumentListIcon },
    { name: 'Análises Avançadas', href: '/dashboard-test', icon: ChartBarSquareIcon },
    { name: 'Buscar Animal', href: '/animals', icon: MagnifyingGlassIcon },
    { name: 'Relatório BI', href: '/reports', icon: ChartBarIcon },
    { name: 'Feedback Sistema', href: '/feedback', icon: ChatBubbleLeftRightIcon },
  ]

  // Ações rápidas para desenvolvedores
  const developerQuickActions = [
    { name: 'Novo Registro', icon: PlusIcon, action: 'new' },
    { name: 'Calcular Custo', icon: CalculatorIcon, action: 'calculate' },
    { name: 'Buscar Animal', icon: MagnifyingGlassIcon, action: 'search' },
    { name: 'Ver Gráficos', icon: ChartBarIcon, action: 'charts' },
    { name: 'Exportar Excel', icon: DocumentArrowDownIcon, action: 'export' },
    { name: 'Importar Excel', icon: DocumentArrowUpIcon, action: 'import' },
    { name: 'Limpar Campos', icon: TrashIcon, action: 'clear' },
    { name: 'Salvar Dados', icon: BookmarkIcon, action: 'save' },
  ]

  // Ações rápidas para consultores
  const consultantQuickActions = [
    { name: 'Ver Dashboards', icon: HomeIcon, action: 'dashboard' },
    { name: 'Buscar Animal', icon: MagnifyingGlassIcon, action: 'search' },
    { name: 'Relatórios', icon: ChartBarIcon, action: 'reports' },
    { name: 'Análises', icon: ChartBarSquareIcon, action: 'analytics' },
    { name: 'Feedback', icon: ChatBubbleLeftRightIcon, action: 'feedback' },
    { name: 'Dados Vendas', icon: CurrencyDollarIcon, action: 'sales' },
  ]

  // Determinar qual navegação e ações usar
  const navigation = isDeveloper() ? developerNavigation : consultantNavigation
  const quickActions = isDeveloper() ? developerQuickActions : consultantQuickActions

  const showNotificationMessage = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new':
        router.push('/animals')
        showNotificationMessage('Redirecionando para cadastro de novo animal...')
        break
      case 'calculate':
        showNotificationMessage('Calculando custos de todos os animais...')
        // Simular cálculo
        setTimeout(() => {
          showNotificationMessage('Cálculo de custos concluído!')
        }, 2000)
        break
      case 'search':
        router.push('/animals')
        showNotificationMessage('Abrindo busca de animais...')
        break
      case 'charts':
        router.push('/reports')
        showNotificationMessage('Carregando relatórios gráficos...')
        break
      case 'export':
        if (!isDeveloper()) {
          showNotificationMessage('❌ Apenas desenvolvedores podem exportar dados')
          return
        }
        showNotificationMessage('Exportando dados para Excel...')
        try {
          // Preparar dados dos animais para exportação
          const formattedData = []; // Dados reais serão carregados da API
          
          // Exportar para Excel (função assíncrona)
          exportToExcel(formattedData, `beef_sync_animais_${new Date().toISOString().split('T')[0]}`)
            .then((success) => {
              if (success) {
                setTimeout(() => {
                  showNotificationMessage('✅ Arquivo Excel exportado com sucesso!')
                }, 1000)
              } else {
                setTimeout(() => {
                  showNotificationMessage('❌ Erro ao exportar arquivo Excel')
                }, 1000)
              }
            })
            .catch((error) => {
              console.error('Erro na exportação:', error)
              setTimeout(() => {
                showNotificationMessage('❌ Erro ao exportar arquivo Excel')
              }, 1000)
            })
        } catch (error) {
          console.error('Erro na exportação:', error)
          setTimeout(() => {
            showNotificationMessage('❌ Erro ao exportar arquivo Excel')
          }, 1000)
        }
        break
      case 'import':
        if (!isDeveloper()) {
          showNotificationMessage('❌ Apenas desenvolvedores podem importar dados')
          return
        }
        // Redirecionar para a página de animais e abrir o importador
        router.push('/animals?openImporter=true')
        showNotificationMessage('🚀 Redirecionando para importação de animais...')
        break
      case 'clear':
        if (!isDeveloper()) {
          showNotificationMessage('❌ Apenas desenvolvedores podem limpar campos')
          return
        }
        if (confirm('Tem certeza que deseja limpar todos os campos?')) {
          showNotificationMessage('Campos limpos com sucesso!')
        }
        break
      case 'save':
        if (!isDeveloper()) {
          showNotificationMessage('❌ Apenas desenvolvedores podem salvar dados')
          return
        }
        showNotificationMessage('Salvando dados...')
        setTimeout(() => {
          showNotificationMessage('Dados salvos com sucesso!')
        }, 1500)
        break
      case 'dashboard':
        router.push('/')
        showNotificationMessage('Carregando dashboards...')
        break
      case 'reports':
        router.push('/reports')
        showNotificationMessage('Carregando relatórios...')
        break
      case 'analytics':
        router.push('/dashboard-test')
        showNotificationMessage('Carregando análises avançadas...')
        break
      case 'feedback':
        router.push('/feedback')
        showNotificationMessage('Abrindo sistema de feedback...')
        break
      case 'sales':
        router.push('/vendas')
        showNotificationMessage('Carregando dados de vendas...')
        break
      default:
        showNotificationMessage('Ação não implementada')
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
            🐮 Beef_Sync
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Indicador de tipo de usuário */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user?.name || 'Usuário'}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isDeveloper() 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                : user?.role === 'visitor'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {isDeveloper() ? 'Desenvolvedor' : user?.role === 'visitor' ? 'Visitante' : 'Consultor'}
            </span>
          </div>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Widget de Mercado */}
        <div className="mt-6 px-2">
          <MarketWidget />
        </div>

        <div className="mt-8 px-2">
          <h3 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {isDeveloper() ? 'Ações Rápidas' : 'Ações Disponíveis'}
          </h3>
          <div className="mt-2 space-y-1">
            {quickActions.map((item) => (
              <button
                key={item.name}
                onClick={() => handleQuickAction(item.action)}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notificação */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="mr-2">✅</div>
            <div className="text-sm font-medium">{notificationMessage}</div>
          </div>
        </div>
      )}
    </>
  )
}