import { Bars3Icon, SunIcon, MoonIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NotificationSystem from './NotificationSystem'

export default function Header({ darkMode, toggleDarkMode, setSidebarOpen, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    name: 'Usuário',
    role: 'Administrador',
    avatar: null
  })
  const router = useRouter()

  // Carregar dados do usuário apenas no cliente
  useEffect(() => {
    const loadUserData = () => {
      if (typeof window !== 'undefined') {
        setCurrentUser({
          name: localStorage.getItem('beef_sync_user_name') || 'Usuário',
          role: localStorage.getItem('beef_sync_user_role') || 'Administrador',
          avatar: null
        })
      }
    }

    // Carregar dados iniciais
    loadUserData()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'beef_sync_user_name' || e.key === 'beef_sync_user_role') {
        loadUserData()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Também escutar mudanças customizadas
    const handleCustomUpdate = () => loadUserData()
    window.addEventListener('userDataUpdated', handleCustomUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userDataUpdated', handleCustomUpdate)
    }
  }, [])

  const handleLogout = () => {
    console.log('🚪 Fazendo logout...')
    setUserMenuOpen(false)
    
    // Limpar todos os dados de autenticação
    localStorage.removeItem('beef-sync-user')
    localStorage.removeItem('beef_sync_user_name')
    localStorage.removeItem('beef_sync_user_role')
    localStorage.removeItem('beef_sync_user')
    sessionStorage.clear()
    
    console.log('✅ Logout realizado com sucesso')
    
    // Chamar função onLogout se fornecida
    if (onLogout) {
      onLogout()
    } else {
      // Redirecionar para login
      router.push('/login')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="ml-4 lg:ml-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sistema de Gestão Bovina
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications */}
          <NotificationSystem />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <UserCircleIcon className="h-8 w-8" />
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.role}
                </div>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setUserMenuOpen(false)
                    router.push('/profile')
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Perfil
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false)
                    router.push('/settings')
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Configurações
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
