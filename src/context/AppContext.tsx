
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { FarmerData } from '@/components/UserManagement';
import type { SmsMessage } from '@/components/SmsHistory';

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
    // We are no longer loading data from persistence layer on refresh.
    // The app will start fresh every time.
    setIsLoaded(true);
  }, []);

  const setRegisteredFarmer = (farmer: FarmerData | null) => {
    // This now only updates the state in memory for the current session.
    setRegisteredFarmerState(farmer);
  };

  const addSmsToHistory = (message: Omit<SmsMessage, 'timestamp'>) => {
    const newSms: SmsMessage = { ...message, timestamp: new Date() };
    // This now only updates the state in memory for the current session.
    setSmsHistory(prev => [newSms, ...prev]);
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
