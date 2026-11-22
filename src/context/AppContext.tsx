"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { FarmerData } from '@/components/UserManagement';
import type { SmsMessage } from '@/components/SmsHistory';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

import en from '@/translations/en.json';

// Admin portal is always in English.
const translations = {
  English: en,
};

const availableLanguages = {
  English: "English",
};

interface AppContextType {
  registeredFarmer: FarmerData | null;
  setRegisteredFarmer: (farmer: FarmerData | null) => void;
  smsHistory: SmsMessage[];
  addSmsToHistory: (message: Omit<SmsMessage, 'timestamp'>) => void;
  isLoaded: boolean;
  language: string; // Stays as 'English' for admin
  setLanguage: (language: string) => void; // No-op for admin
  translations: any;
  availableLanguages: { [key: string]: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [registeredFarmer, setRegisteredFarmerState] = useState<FarmerData | null>(null);
  const [smsHistory, setSmsHistory] = useState<SmsMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Admin portal language is always English and cannot be changed.
  const language = 'English';
  const setLanguage = () => {}; // No-op function for the admin portal
  const currentTranslations = translations.English;

  useEffect(() => {
    // Restore session data from localStorage on reload
    try {
      const savedFarmer = localStorage.getItem('agri_registered_farmer');
      if (savedFarmer) {
        setRegisteredFarmerState(JSON.parse(savedFarmer));
      }
      const savedSms = localStorage.getItem('agri_sms_history');
      if (savedSms) {
        const parsed = JSON.parse(savedSms);
        setSmsHistory(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      }
    } catch (e) {
      console.warn('Could not load session from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setRegisteredFarmer = (farmer: FarmerData | null) => {
    setRegisteredFarmerState(farmer);
    try {
      if (farmer) {
        localStorage.setItem('agri_registered_farmer', JSON.stringify(farmer));
      } else {
        localStorage.removeItem('agri_registered_farmer');
      }
    } catch (e) {
      console.warn('Could not persist farmer to localStorage', e);
    }
  };

  const addSmsToHistory = (message: Omit<SmsMessage, 'timestamp'>) => {
    const newSms: SmsMessage = { ...message, timestamp: new Date() };
    setSmsHistory(prev => {
      const updated = [newSms, ...prev];
      try {
        localStorage.setItem('agri_sms_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist SMS to localStorage', e);
      }
      return updated;
    });
  };

  const value = {
    registeredFarmer,
    setRegisteredFarmer,
    smsHistory,
    addSmsToHistory,
    isLoaded,
    language,
    setLanguage,
    translations: currentTranslations,
    availableLanguages
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <FirebaseErrorListener />
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
