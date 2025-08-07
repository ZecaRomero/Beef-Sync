// Utility to fix authentication issues
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    // Clear all authentication related data
    localStorage.removeItem('beef_sync_token');
    localStorage.removeItem('beef_sync_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    // Clear any other potential auth keys
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('token') || key.includes('auth') || key.includes('user')) {
        localStorage.removeItem(key);
      }
    });

    console.log('✅ Authentication data cleared');
  }
};

// Função removida - não usar dados mockados de autenticação

export const checkAuthStatus = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('beef_sync_token');
    const user = localStorage.getItem('beef_sync_user');

    console.log('🔍 Auth Status:', {
      hasToken: !!token,
      hasUser: !!user,
      token: token ? token.substring(0, 20) + '...' : null
    });

    return {
      hasToken: !!token,
      hasUser: !!user,
      token,
      user: user ? JSON.parse(user) : null
    };
  }

  return { hasToken: false, hasUser: false };
};

// Add this missing function
export const setMockAuth = () => {
  if (typeof window !== 'undefined') {
    const mockUser = {
      id: 1,
      name: 'Admin',
      email: 'admin@beefsync.com',
      role: 'admin'
    };

    const mockToken = 'mock-jwt-token-' + Date.now();

    localStorage.setItem('beef_sync_token', mockToken);
    localStorage.setItem('beef_sync_user', JSON.stringify(mockUser));

    console.log('✅ Mock authentication set');
  }
};
