'use client';
import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { saveBackendHistory, fetchHistory, clearHistory as clearBackendHistory } from '@/services/api.js';

export type HistoryItem = {
  id: string;
  type: 'crop' | 'mandi' | 'scheme';
  query: Record<string, any>;
  response: Record<string, any>;
  timestamp: string;
};

interface HistoryContextType {
  history: HistoryItem[];
  loading: boolean;
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  refreshHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);
const HISTORY_STORAGE_KEY = 'khet_ai_history';

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      let localData: HistoryItem[] = [];
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        localData = JSON.parse(storedHistory);
      }

      if (localStorage.getItem('token')) {
        const backendData = await fetchHistory();
        const parsedBackend: HistoryItem[] = backendData.map((d: any) => {
          try {
            return {
              id: d.id.toString(),
              type: d.type.toLowerCase(),
              query: typeof d.queryData === 'string' ? JSON.parse(d.queryData) : d.queryData,
              response: typeof d.responseData === 'string' ? JSON.parse(d.responseData) : d.responseData,
              timestamp: d.timestamp,
            };
          } catch (e) {
            return null; // Skip parsing errors
          }
        }).filter(Boolean);

        // Merge without duplicates based on strict matching is complicated, let's just use Backend as truth if logged in, plus local overrides
        setHistory(parsedBackend);
      } else {
        setHistory(localData);
      }
    } catch (error) {
      console.error('Failed to load history', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Also refresh whenever token changes in storage
    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newHistoryItem: HistoryItem = {
      ...item,
      id: new Date().toISOString() + Math.random(),
      timestamp: new Date().toISOString(),
    };

    // Optimistic UI update
    setHistory(prev => {
      const updated = [newHistoryItem, ...prev];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    if (localStorage.getItem('token')) {
      await saveBackendHistory(item.type, item.query, item.response);
      loadData(); // Sync exact ID from DB
    }
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    if (localStorage.getItem('token')) {
      await clearBackendHistory();
    }
  }, []);

  return (
    <HistoryContext.Provider value={{ history, loading, addHistoryItem, clearHistory, refreshHistory: loadData }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within a HistoryProvider');
  return context;
};
