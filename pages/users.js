import { useAuth } from '../contexts/AuthContext';
import UserManager from '../components/UserManager';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function UsersPage() {
  const { user, checkPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário tem permissão para acessar esta página
    if (!user) {
      router.push('/login');
      return;
    }

    // Apenas desenvolvedores podem acessar a página de usuários
    if (!checkPermission('manage_users')) {
      router.push('/');
      return;
    }
  }, [user, checkPermission, router]);

  if (!user || !checkPermission('manage_users')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <UserManager />
    </Layout>
  );
}
