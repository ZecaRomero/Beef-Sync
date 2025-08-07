import { useAuth } from '../contexts/AuthContext';
import FeedbackSystem from '../components/FeedbackSystem';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function FeedbackPage() {
  const { user, checkPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!user) {
      router.push('/login');
      return;
    }

    // Verificar se o usuário tem permissão para acessar o feedback
    if (!checkPermission('feedback_system')) {
      router.push('/');
      return;
    }
  }, [user, checkPermission, router]);

  if (!user || !checkPermission('feedback_system')) {
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
      <FeedbackSystem />
    </Layout>
  );
}
