
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { FarmerData } from '@/components/UserManagement';
import type { SmsMessage } from '@/components/SmsHistory';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

import en from '@/translations/en.json';

const translations: { [key: string]: any } = {
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
  language: string;
  setLanguage: (language: string) => void;
  translations: any;
  availableLanguages: { [key: string]: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Using a fixed ID for the single "active" farmer document for the UI
const ACTIVE_FARMER_DOC_ID = 'active-farmer-profile';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [registeredFarmer, setRegisteredFarmerState] = useState<FarmerData | null>(null);
  const [smsHistory, setSmsHistory] = useState<SmsMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // Admin portal language is always English
  const [language, setLanguage] = useState<string>('English');
  const [currentTranslations, setCurrentTranslations] = useState(translations.English);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedHistory = localStorage.getItem('smsHistory');
        if (storedHistory) {
          setSmsHistory(JSON.parse(storedHistory).map((sms: any) => ({ ...sms, timestamp: new Date(sms.timestamp) })));
        }

        if (db) {
            const farmerDocRef = doc(db, 'activeFarmer', ACTIVE_FARMER_DOC_ID);
            const docSnap = await getDoc(farmerDocRef);
            if (docSnap.exists()) {
                setRegisteredFarmerState(docSnap.data() as FarmerData);
            }
        }
      } catch (error) {
        console.error("Failed to load state from localStorage or Firestore", error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadData();
  }, []);

  const setRegisteredFarmer = async (farmer: FarmerData | null) => {
    if (!db) {
        console.warn("Firestore not available. Updating local state only.");
        setRegisteredFarmerState(farmer);
        return;
    };

    const farmerDocRef = doc(db, 'activeFarmer', ACTIVE_FARMER_DOC_ID);
    try {
      if (farmer) {
        await setDoc(farmerDocRef, farmer);
        setRegisteredFarmerState(farmer);
      } else {
        await deleteDoc(farmerDocRef);
        setRegisteredFarmerState(null);
      }
    } catch (error) {
      console.error("Failed to save active farmer to Firestore", error);
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
    isLoaded,
    language,
    setLanguage, // This setter will not be used in Admin portal but is part of the type
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
