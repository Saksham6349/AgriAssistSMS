
"use client";

import { useAppContext } from "@/context/AppContext";
import { useFarmerAppContext } from "@/context/FarmerAppContext";
import { usePathname } from "next/navigation";

/**
 * Custom hook for handling translations.
 * Conditionally uses FarmerAppContext if within the /farmer route,
 * otherwise falls back to the global AppContext.
 * @returns An object containing the `t` function for translating keys.
 */
export const useTranslation = () => {
  const pathname = usePathname();
  const isFarmerPortal = pathname.startsWith('/farmer');
  
  let translations: any;

  // This is a workaround to conditionally call hooks.
  // In a real app, you might structure your providers differently.
  const GlobalAppContext = useAppContext();
  
  try {
    // This will throw an error if not inside the FarmerAppProvider
    const FarmerContext = useFarmerAppContext();
    if(isFarmerPortal) {
        translations = FarmerContext.translations;
    } else {
        translations = GlobalAppContext.translations;
    }
  } catch (e) {
    translations = GlobalAppContext.translations;
  }


  /**
   * Translates a given key into the current language.
   * Traverses a nested object using a dot-separated key string.
   * @param key The key for the translation string (e.g., 'header.title').
   * @param defaultText A fallback string if the key is not found.
   * @returns The translated string, or the defaultText/key if not found.
   */
  const t = (key: string, defaultText?: string): string => {
    if (!translations) {
        return defaultText || key;
    }
    const keys = key.split('.');
    let result: any = translations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // If the key is not found, return the default text or the key itself as a fallback.
        return defaultText || key;
      }
    }

    return typeof result === 'string' ? result : (defaultText || key);
  };

  return { t };
};
