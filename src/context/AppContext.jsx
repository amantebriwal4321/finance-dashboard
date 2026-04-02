import { createContext, useContext, useState, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || 'Viewer';
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) return JSON.parse(saved);
    return initialTransactions;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addTransaction = (transaction) => {
    if (role === 'Viewer') return;
    setTransactions(prev => [{ ...transaction, id: crypto.randomUUID() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    if (role === 'Viewer') return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const updateTransaction = (id, updated) => {
    if (role === 'Viewer') return;
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const contextState = {
    theme,
    toggleTheme,
    role,
    setRole,
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
  };

  return (
    <AppContext.Provider value={contextState}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
