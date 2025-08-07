// Página de usuários simplificada para teste
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function TestUsersPage() {
  const { user, checkPermission } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 TestUsersPage - Verificando usuário:', user);
    
    // Verificar se o usuário existe
    if (!user) {
      console.log('❌ Usuário não encontrado, redirecionando para login');
      router.push('/login');
      return;
    }

    // Verificar permissões
    const hasPermission = checkPermission('manage_users');
    console.log('🔐 Permissão manage_users:', hasPermission);

    if (!hasPermission) {
      console.log('❌ Usuário não tem permissão, redirecionando para home');
      setError('Você não tem permissão para acessar esta página.');
      setTimeout(() => {
        router.push('/');
      }, 3000);
      return;
    }

    console.log('✅ Usuário autorizado!');
    setLoading(false);
  }, [user, checkPermission, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Acesso Negado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Redirecionando em alguns segundos...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            👥 Gerenciamento de Usuários - TESTE
          </h1>
          
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ Acesso Autorizado!
              </h2>
              <p className="text-green-700 dark:text-green-300">
                Você tem permissão para acessar esta página.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Informações do Usuário:
              </h3>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li><strong>Nome:</strong> {user?.name || 'N/A'}</li>
                <li><strong>Username:</strong> {user?.username || 'N/A'}</li>
                <li><strong>Função:</strong> {user?.role || 'N/A'}</li>
                <li><strong>Permissões:</strong> {user?.permissions?.join(', ') || 'N/A'}</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Sistema de Usuários:
              </h3>
              <div className="text-yellow-700 dark:text-yellow-300 space-y-2">
                <p><strong>Zeca:</strong> Desenvolvedor - Acesso total</p>
                <p><strong>Bento:</strong> Consultor - Apenas visualização</p>
                <p><strong>Maurício:</strong> Consultor - Apenas visualização</p>
                <p><strong>Nilson:</strong> Consultor - Apenas visualização</p>
                <p><strong>Jorge:</strong> Consultor - Apenas visualização</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Ações Disponíveis:
              </h3>
              <div className="space-y-2">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={() => console.log('Adicionar usuário')}
                >
                  ➕ Adicionar Usuário
                </button>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={() => console.log('Listar usuários')}
                >
                  📋 Listar Usuários
                </button>
                <button 
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={() => console.log('Editar permissões')}
                >
                  ⚙️ Editar Permissões
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}