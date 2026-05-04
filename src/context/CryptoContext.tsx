import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CryptoAsset, PriceAlert } from '../types';
import { fetchMarketData } from '../api/cryptoApi';

interface CryptoContextType {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => void;
  removeAlert: (id: string) => void;
  refreshData: () => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const useCrypto = () => {
  const ctx = useContext(CryptoContext);
  if (!ctx) throw new Error('useCrypto must be used within CryptoProvider');
  return ctx;
};

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('crypto-alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMarketData();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    localStorage.setItem('crypto-alerts', JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <CryptoContext.Provider value={{ assets, loading, error, alerts, addAlert, removeAlert, refreshData }}>
      {children}
    </CryptoContext.Provider>
  );
};
