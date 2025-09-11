
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { FarmerData } from '@/components/UserManagement';
import type { SmsMessage } from '@/components/SmsHistory';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

import en from '@/translations/en.json';
import hi from '@/translations/hi.json';
import bn from '@/translations/bn.json';
import te from '@/translations/te.json';
import mr from '@/translations/mr.json';
import ta from '@/translations/ta.json';
import ur from '@/translations/ur.json';
import gu from '@/translations/gu.json';
import kn from '@/translations/kn.json';
import pa from '@/translations/pa.json';

const translations: { [key: string]: any } = {
  English: en,
  Hindi: hi,
  Bengali: bn,
  Telugu: te,
  Marathi: mr,
  Tamil: ta,
  Urdu: ur,
  Gujarati: gu,
  Kannada: kn,
  Punjabi: pa,
};

const availableLanguages = {
  English: "English",
  Hindi: "हिन्दी",
  Bengali: "বাংলা",
  Telugu: "తెలుగు",
  Marathi: "मराठी",
  Tamil: "தமிழ்",
  Urdu: "اردو",
  Gujarati: "ગુજરાતી",
  Kannada: "ಕನ್ನಡ",
  Punjabi: "ਪੰਜਾਬੀ",
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
  const [language, setLanguageState] = useState<string>('English');
  const [currentTranslations, setCurrentTranslations] = useState(translations.English);

  const setLanguage = useCallback((lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      setCurrentTranslations(translations[lang]);
      try {
        localStorage.setItem('appLanguage', lang);
      } catch (error) {
        console.error("Failed to save language to localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load active farmer from Firestore
        if (db) {
          const farmerDocRef = doc(db, 'activeFarmer', ACTIVE_FARMER_DOC_ID);
          const farmerDocSnap = await getDoc(farmerDocRef);

          if (farmerDocSnap.exists()) {
            setRegisteredFarmerState(farmerDocSnap.data() as FarmerData);
          } else {
            setRegisteredFarmerState(null);
          }
        }

        // Load language and history from localStorage
        const storedLanguage = localStorage.getItem('appLanguage');
        if (storedLanguage && translations[storedLanguage]) {
          setLanguage(storedLanguage);
        } else {
          setLanguage('English');
        }
        
        const storedHistory = localStorage.getItem('smsHistory');
        if (storedHistory) {
          setSmsHistory(JSON.parse(storedHistory).map((sms: any) => ({ ...sms, timestamp: new Date(sms.timestamp) })));
        }
      } catch (error) {
        console.error("Failed to load state from Firestore/localStorage", error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadData();
  }, [setLanguage]);

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

    