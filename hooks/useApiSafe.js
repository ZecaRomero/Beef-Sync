import { useState, useEffect } from 'react';

// Hook para fazer chamadas de API de forma segura, com fallback para dados mock
export const useApiSafe = () => {
  const [isApiAvailable, setIsApiAvailable] = useState(false);

  useEffect(() => {
    // Verificar se as APIs estão disponíveis
    const checkApiHealth = async () => {
      try {
        const response = await fetch('/api/test', { 
          method: 'GET',
          timeout: 5000 
        });
        setIsApiAvailable(response.ok);
      } catch (error) {
        console.log('APIs não disponíveis, usando dados mock');
        setIsApiAvailable(false);
      }
    };

    checkApiHealth();
  }, []);

  const safeFetch = async (url, options = {}) => {
    if (!isApiAvailable) {
      // Retornar dados mock baseados na URL
      return getMockData(url);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('beef_sync_token')}`,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`API call failed for ${url}, using mock data:`, error.message);
      return getMockData(url);
    }
  };

  return { safeFetch, isApiAvailable };
};

// Função para retornar dados mock baseados na URL
const getMockData = (url) => {
  if (url.includes('/api/animals')) {
    return {
      animals: [],
      total: 0,
      message: 'Dados mock - API não disponível'
    };
  }

  if (url.includes('/api/sales')) {
    return {
      sales: [],
      totalSales: 0,
      totalRevenue: 0,
      averagePrice: 0,
      salesGrowth: 0,
      revenueGrowth: 0,
      priceGrowth: 0,
      salesByPeriod: [],
      topAnimals: [],
      salesByCategory: [],
      message: 'Dados mock - API não disponível'
    };
  }

  if (url.includes('/api/dashboard')) {
    return {
      totalAnimals: 0,
      activeAnimals: 0,
      totalInvested: 0,
      totalRevenue: 0,
      profitMargin: 0,
      monthlyGrowth: 0,
      message: 'Dados mock - API não disponível'
    };
  }

  // Fallback genérico
  return {
    data: [],
    message: 'Dados mock - API não disponível'
  };
};

export default useApiSafe;