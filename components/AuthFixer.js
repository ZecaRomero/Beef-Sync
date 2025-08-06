import React, { useState } from 'react';
import { clearAuthData, setMockAuth, checkAuthStatus } from '../utils/authFix';

const AuthFixer = () => {
  const [authStatus, setAuthStatus] = useState(null);
  const [showFixer, setShowFixer] = useState(false);

  const handleCheckAuth = () => {
    const status = checkAuthStatus();
    setAuthStatus(status);
  };

  const handleClearAuth = () => {
    clearAuthData();
    setAuthStatus(checkAuthStatus());
    alert('✅ Dados de autenticação limpos! Recarregue a página.');
  };

  const handleSetMockAuth = () => {
    setMockAuth();
    setAuthStatus(checkAuthStatus());
    alert('✅ Autenticação mock configurada! Recarregue a página.');
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!showFixer) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowFixer(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
          title="Corrigir erro de autenticação"
        >
          🔧 Fix Auth
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            🔧 Corretor de Autenticação
          </h3>
          <button
            onClick={() => setShowFixer(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={handleCheckAuth}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              🔍 Verificar Status da Autenticação
            </button>
          </div>

          {authStatus && (
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
              <p><strong>Token:</strong> {authStatus.hasToken ? '✅ Presente' : '❌ Ausente'}</p>
              <p><strong>Usuário:</strong> {authStatus.hasUser ? '✅ Presente' : '❌ Ausente'}</p>
              {authStatus.user && (
                <p><strong>Nome:</strong> {authStatus.user.name}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={handleClearAuth}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              🧹 Limpar Dados de Auth
            </button>

            <button
              onClick={handleSetMockAuth}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              🎭 Configurar Auth Mock
            </button>

            <button
              onClick={handleReload}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              🔄 Recarregar Página
            </button>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 mt-4">
            <p><strong>Instruções:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Clique em "Limpar Dados de Auth"</li>
              <li>Clique em "Configurar Auth Mock"</li>
              <li>Clique em "Recarregar Página"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFixer;