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

  // Sistema de permissões atualizado
  const userRoles = {
    'Zeca': {
      name: 'Zeca',
      role: 'developer',
      permissions: [
        'read', 'write', 'delete', 'admin', 'manage_users',
        'dashboard_full', 'reports_full', 'animals_manage', 'sales_manage',
        'reproduction_manage', 'gestation_manage', 'settings_access',
        'export_import', 'feedback_system', 'invoice_manage'
      ],
      description: 'Desenvolvedor - Acesso completo'
    },
    'Bento': {
      name: 'Bento',
      role: 'consultant',
      permissions: [
        'read', 'dashboard_view', 'reports_view', 'animals_view',
        'sales_view', 'search_animals', 'feedback_system'
      ],
      description: 'Consultor - Visualização e relatórios'
    },
    'Nilson': {
      name: 'Nilson',
      role: 'consultant',
      permissions: [
        'read', 'dashboard_view', 'reports_view', 'animals_view',
        'sales_view', 'search_animals', 'feedback_system'
      ],
      description: 'Consultor - Visualização e relatórios'
    },
    'Mauricio': {
      name: 'Maurício',
      role: 'consultant',
      permissions: [
        'read', 'dashboard_view', 'reports_view', 'animals_view',
        'sales_view', 'search_animals', 'feedback_system'
      ],
      description: 'Consultor - Visualização e relatórios'
    },
    'Jorge': {
      name: 'Jorge',
      role: 'consultant',
      permissions: [
        'read', 'dashboard_view', 'reports_view', 'animals_view',
        'sales_view', 'search_animals', 'feedback_system'
      ],
      description: 'Consultor - Visualização e relatórios'
    }
  };

  const checkPermission = (permission) => {
    if (!user) return false;
    const userRole = userRoles[user.username] || userRoles['Bento'];
    return userRole.permissions.includes(permission);
  };

  const getUserRole = () => {
    if (!user) return null;
    return userRoles[user.username] || userRoles['Bento'];
  };

  // Verificar se é desenvolvedor
  const isDeveloper = () => {
    if (!user) return false;
    return user.role === 'developer';
  };

  // Verificar se é consultor
  const isConsultant = () => {
    if (!user) return false;
    return user.role === 'consultant';
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

    // Verificar se usuário existe
    if (!userRoles[username]) {
      setLoading(false);
      return { success: false, error: 'Usuário não encontrado' };
    }

    // Validar senha
    const validPassword = password === '123';
    if (!validPassword) {
      setLoading(false);
      return { success: false, error: 'Senha incorreta' };
    }

    // Login bem-sucedido
    const userData = {
      username,
      name: userRoles[username].name,
      role: userRoles[username].role,
      permissions: userRoles[username].permissions
    };

    setUser(userData);
    localStorage.setItem('beef-sync-user', JSON.stringify(userData));
    localStorage.setItem('beef_sync_user_name', userRoles[username].name);
    localStorage.setItem('beef_sync_user_role', userRoles[username].role === 'developer' ? 'Desenvolvedor' : 'Consultor');

    setLoading(false);
    return { success: true };
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
    isDeveloper,
    isConsultant,
    userRoles
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
