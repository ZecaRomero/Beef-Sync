import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import animalDataManager from '../services/animalDataManager';

const AuthCheck = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = animalDataManager.loadToken();
      
      if (!token) {
        // No token found, redirect to login
        router.push('/login');
        return;
      }

      // Token exists, assume user is authenticated
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        <p className="ml-4 text-lg text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você precisa fazer login para acessar esta página.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthCheck;