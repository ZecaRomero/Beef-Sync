import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useApp } from '../contexts/AppContext'

export default function Layout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state, actions } = useApp()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          darkMode={state.theme === 'dark'}
          toggleDarkMode={actions.toggleTheme}
          setSidebarOpen={setSidebarOpen}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
