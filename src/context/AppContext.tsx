
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { FarmerData } from '@/components/UserManagement';
import type { SmsMessage } from '@/components/SmsHistory';

interface AppContextType {
  registeredFarmer: FarmerData | null;
  setRegisteredFarmer: (farmer: FarmerData | null) => void;
  smsHistory: SmsMessage[];
  addSmsToHistory: (message: Omit<SmsMessage, 'timestamp'>) => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [registeredFarmer, setRegisteredFarmerState] = useState<FarmerData | null>(null);
  const [smsHistory, setSmsHistory] = useState<SmsMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load state from localStorage on initial render
    try {
        const storedFarmer = localStorage.getItem('registeredFarmer');
        if (storedFarmer) {
            setRegisteredFarmerState(JSON.parse(storedFarmer));
        }
        const storedHistory = localStorage.getItem('smsHistory');
        if (storedHistory) {
            setSmsHistory(JSON.parse(storedHistory).map((sms: any) => ({...sms, timestamp: new Date(sms.timestamp)})));
        }
    } catch (error) {
        console.error("Failed to load state from localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const setRegisteredFarmer = (farmer: FarmerData | null) => {
    setRegisteredFarmerState(farmer);
    try {
        if (farmer) {
            localStorage.setItem('registeredFarmer', JSON.stringify(farmer));
        } else {
            localStorage.removeItem('registeredFarmer');
        }
    } catch (error) {
        console.error("Failed to save farmer to localStorage", error);
    }
  };

  const addSmsToHistory = (message: Omit<SmsMessage, 'timestamp'>) => {
    const newSms: SmsMessage = { ...message, timestamp: new Date() };
    setSmsHistory(prev => {
        const newHistory = [newSms, ...prev];
        try {
            localStorage.setItem('smsHistory', JSON.stringify(newHistory));
        } catch (error) {
            console.error("Failed to save SMS history to localStorage", error);
        }
        return newHistory;
    });
  };

  const value = {
      registeredFarmer,
      setRegisteredFarmer,
      smsHistory,
      addSmsToHistory,
      isLoaded
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
