import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial da aplicação
const initialState = {
  user: null,
  animals: [],
  materials: [],
  sales: [],
  processes: [],
  notifications: [],
  loading: false,
  error: null,
  theme: 'light',
  filters: {
    dateRange: '30d',
    category: 'all',
    status: 'all'
  },
  stats: {
    totalAnimals: 0,
    totalValue: 0,
    monthlyProfit: 0,
    pendingTasks: 0
  }
};

// Actions
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_ANIMALS: 'SET_ANIMALS',
  ADD_ANIMAL: 'ADD_ANIMAL',
  UPDATE_ANIMAL: 'UPDATE_ANIMAL',
  DELETE_ANIMAL: 'DELETE_ANIMAL',
  SET_MATERIALS: 'SET_MATERIALS',
  ADD_MATERIAL: 'ADD_MATERIAL',
  UPDATE_MATERIAL: 'UPDATE_MATERIAL',
  DELETE_MATERIAL: 'DELETE_MATERIAL',
  SET_SALES: 'SET_SALES',
  ADD_SALE: 'ADD_SALE',
  SET_PROCESSES: 'SET_PROCESSES',
  ADD_PROCESS: 'ADD_PROCESS',
  UPDATE_PROCESS: 'UPDATE_PROCESS',
  DELETE_PROCESS: 'DELETE_PROCESS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  SET_FILTERS: 'SET_FILTERS',
  UPDATE_STATS: 'UPDATE_STATS',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_THEME: 'SET_THEME'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };

    case ACTIONS.SET_ANIMALS:
      return { ...state, animals: action.payload };

    case ACTIONS.ADD_ANIMAL:
      return { ...state, animals: [...state.animals, action.payload] };

    case ACTIONS.UPDATE_ANIMAL:
      return {
        ...state,
        animals: state.animals.map(animal =>
          animal.id === action.payload.id ? action.payload : animal
        )
      };

    case ACTIONS.DELETE_ANIMAL:
      return {
        ...state,
        animals: state.animals.filter(animal => animal.id !== action.payload)
      };

    case ACTIONS.SET_MATERIALS:
      return { ...state, materials: action.payload };

    case ACTIONS.ADD_MATERIAL:
      return { ...state, materials: [...state.materials, action.payload] };

    case ACTIONS.UPDATE_MATERIAL:
      return {
        ...state,
        materials: state.materials.map(material =>
          material.id === action.payload.id ? action.payload : material
        )
      };

    case ACTIONS.DELETE_MATERIAL:
      return {
        ...state,
        materials: state.materials.filter(material => material.id !== action.payload)
      };

    case ACTIONS.SET_SALES:
      return { ...state, sales: action.payload };

    case ACTIONS.ADD_SALE:
      return { ...state, sales: [...state.sales, action.payload] };

    case ACTIONS.SET_PROCESSES:
      return { ...state, processes: action.payload };

    case ACTIONS.ADD_PROCESS:
      return { ...state, processes: [...state.processes, action.payload] };

    case ACTIONS.UPDATE_PROCESS:
      return {
        ...state,
        processes: state.processes.map(process =>
          process.id === action.payload.id ? action.payload : process
        )
      };

    case ACTIONS.DELETE_PROCESS:
      return {
        ...state,
        processes: state.processes.filter(process => process.id !== action.payload)
      };

    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case ACTIONS.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };

    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ACTIONS.UPDATE_STATS:
      return { ...state, stats: { ...state.stats, ...action.payload } };

    case ACTIONS.TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';

      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);

        // Aplicar classe imediatamente
        const htmlElement = document.documentElement;

        if (newTheme === 'dark') {
          htmlElement.classList.add('dark');
        } else {
          htmlElement.classList.remove('dark');
        }

        // Aplicar esquema de cores
        htmlElement.style.colorScheme = newTheme;
      }

      return { ...state, theme: newTheme };

    case 'SET_THEME':
      if (typeof window !== 'undefined') {
        // Aplicar classe quando definir o tema
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { ...state, theme: action.payload };

    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar tema do localStorage após hidratação
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== state.theme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  // Aplicar classe dark no HTML quando o tema mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [state.theme]);

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Calcular estatísticas automaticamente
  useEffect(() => {
    calculateStats();
  }, [state.animals, state.materials, state.sales]);

  const loadInitialData = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      // Carregar dados reais da API
      const animalsResponse = await fetch('/api/animals-list');
      const animals = animalsResponse.ok ? await animalsResponse.json() : [];
      
      const salesResponse = await fetch('/api/sales-list');
      const sales = salesResponse.ok ? await salesResponse.json() : [];

      const mockMaterials = []; // Remover dados mockados de materiais também

      dispatch({ type: ACTIONS.SET_ANIMALS, payload: animals });
      dispatch({ type: ACTIONS.SET_MATERIALS, payload: mockMaterials });
      dispatch({ type: ACTIONS.SET_SALES, payload: sales });

    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const calculateStats = () => {
    const totalAnimals = state.animals.length;
    const totalValue = state.animals.reduce((sum, animal) => sum + (animal.value || 0), 0);
    const monthlyProfit = state.sales
      .filter(sale => {
        const saleDate = new Date(sale.date);
        const now = new Date();
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, sale) => sum + sale.totalValue, 0);

    const pendingTasks = state.materials.filter(m => m.quantity <= m.minStock).length;

    dispatch({
      type: ACTIONS.UPDATE_STATS,
      payload: { totalAnimals, totalValue, monthlyProfit, pendingTasks }
    });
  };

  // Actions para componentes
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    setUser: (user) => dispatch({ type: ACTIONS.SET_USER, payload: user }),

    // Animals
    addAnimal: (animal) => dispatch({ type: ACTIONS.ADD_ANIMAL, payload: animal }),
    updateAnimal: (animal) => dispatch({ type: ACTIONS.UPDATE_ANIMAL, payload: animal }),
    deleteAnimal: (id) => dispatch({ type: ACTIONS.DELETE_ANIMAL, payload: id }),

    // Materials
    addMaterial: (material) => dispatch({ type: ACTIONS.ADD_MATERIAL, payload: material }),
    updateMaterial: (material) => dispatch({ type: ACTIONS.UPDATE_MATERIAL, payload: material }),
    deleteMaterial: (id) => dispatch({ type: ACTIONS.DELETE_MATERIAL, payload: id }),

    // Sales
    addSale: (sale) => dispatch({ type: ACTIONS.ADD_SALE, payload: sale }),

    // Processes
    addProcess: (process) => dispatch({ type: ACTIONS.ADD_PROCESS, payload: process }),
    updateProcess: (process) => dispatch({ type: ACTIONS.UPDATE_PROCESS, payload: process }),
    deleteProcess: (id) => dispatch({ type: ACTIONS.DELETE_PROCESS, payload: id }),

    // Notifications
    addNotification: (notification) => dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification }),
    markNotificationRead: (id) => dispatch({ type: ACTIONS.MARK_NOTIFICATION_READ, payload: id }),

    // Filters
    setFilters: (filters) => dispatch({ type: ACTIONS.SET_FILTERS, payload: filters }),

    // Theme
    toggleTheme: () => dispatch({ type: ACTIONS.TOGGLE_THEME })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}

export { ACTIONS };
