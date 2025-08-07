import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sistema de permissões
  const userRoles = {
    'zeca': {
      name: 'Zeca',
      role: 'developer',
      permissions: ['read', 'write', 'delete', 'admin', 'manage_users'],
      description: 'Desenvolvedor - Acesso completo'
    },
    'bento': {
      name: 'Bento',
      role: 'consultant',
      permissions: ['read'],
      description: 'Consultor - Apenas visualização'
    },
    'nilson': {
      name: 'Nilson',
      role: 'consultant',
      permissions: ['read'],
      description: 'Consultor - Apenas visualização'
    },
    'mauricio': {
      name: 'Maurício',
      role: 'consultant',
      permissions: ['read'],
      description: 'Consultor - Apenas visualização'
    }
  };

  const checkPermission = (permission) => {
    if (!user) return false;
    const userRole = userRoles[user.username] || userRoles['bento'];
    return userRole.permissions.includes(permission);
  };

  const getUserRole = () => {
    if (!user) return null;
    return userRoles[user.username] || userRoles['bento'];
  };

  useEffect(() => {
    // Simular carregamento inicial
    const savedUser = localStorage.getItem('beef-sync-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    
    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userRoles[username]) {
      const userData = {
        username,
        name: userRoles[username].name,
        role: userRoles[username].role,
        permissions: userRoles[username].permissions
      };
      
      setUser(userData);
      localStorage.setItem('beef-sync-user', JSON.stringify(userData));
      return { success: true };
    } else {
      return { success: false, error: 'Usuário não encontrado' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('beef-sync-user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkPermission,
    getUserRole,
    userRoles
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;