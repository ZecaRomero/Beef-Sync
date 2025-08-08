import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState(''); // 'developer' ou 'visitor'
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLoginTypeSelect = (type) => {
    setLoginType(type);
    setShowLoginModal(true);
    setError('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (loginType === 'developer') {
        if (password !== '123') {
          setError('Senha incorreta para desenvolvedor');
          setLoading(false);
          return;
        }
        result = await login('Zeca', password);
      } else if (loginType === 'visitor') {
        // Login como visitante - sem senha necessária
        result = { success: true, user: { name: 'Visitante', role: 'visitor' } };
        localStorage.setItem('user', JSON.stringify({ name: 'Visitante', role: 'visitor' }));
      }

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Erro no login');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="text-8xl mb-4">🐂</div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            Beef Sync
          </h2>
          <p className="text-xl text-blue-200">
            Sistema de Gestão Bovina
          </p>
        </div>

        {/* Seleção de Tipo de Login */}
        {!showLoginModal && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6">
                Como deseja acessar?
              </h3>
            </div>

            {/* Botão Desenvolvedor */}
            <button
              onClick={() => handleLoginTypeSelect('developer')}
              className="w-full group relative flex justify-center py-6 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">👨‍💻</div>
                <div className="text-left">
                  <div className="font-bold">DESENVOLVEDOR</div>
                  <div className="text-sm text-green-100">Zeca - Acesso Total</div>
                </div>
              </div>
            </button>

            {/* Botão Visitante */}
            <button
              onClick={() => handleLoginTypeSelect('visitor')}
              className="w-full group relative flex justify-center py-6 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">👤</div>
                <div className="text-left">
                  <div className="font-bold">VISITANTE</div>
                  <div className="text-sm text-blue-100">Acesso Limitado</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Modal de Login */}
        {showLoginModal && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">
                {loginType === 'developer' ? '👨‍💻' : '👤'}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {loginType === 'developer' ? 'Login Desenvolvedor' : 'Acesso Visitante'}
              </h3>
              <p className="text-blue-200 mt-2">
                {loginType === 'developer' 
                  ? 'Digite a senha para acessar como Zeca' 
                  : 'Clique em entrar para acessar como visitante'
                }
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {loginType === 'developer' && (
                <div>
                  <label htmlFor="password" className="sr-only">
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-white/30 placeholder-gray-400 text-white bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm text-lg"
                    placeholder="Digite a senha (123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {error && (
                <div className="text-red-300 text-sm text-center bg-red-500/20 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-transparent text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Informações do Sistema */}
        <div className="text-center text-blue-200 text-sm">
          <p className="mb-2">🔒 Sistema Seguro de Gestão Bovina</p>
          <p>Desenvolvido para controle completo da fazenda</p>
        </div>
      </div>
    </div>
  );
}
