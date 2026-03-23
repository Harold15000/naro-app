import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { socket } from '../lib/socket';
import { WalletBalance } from '../types';
import { useAuth } from './AuthContext';

interface WalletContextType {
  balance: WalletBalance | null;
  isLoading: boolean;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBalance = async () => {
    try {
      const res = await api.get('/api/wallet/balance');
      setBalance(res.data);
    } catch (err) {
      console.error('Failed to fetch balance', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshBalance();

      const handleWalletUpdate = (data: { diamonds: number; coins: number }) => {
        setBalance(prev => prev ? { ...prev, diamonds: data.diamonds, coins: data.coins } : null);
      };

      socket.on('wallet:updated', handleWalletUpdate);

      return () => {
        socket.off('wallet:updated', handleWalletUpdate);
      };
    } else {
      setBalance(null);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <WalletContext.Provider value={{ balance, isLoading, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
