
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
  
  // We need to conditionally call hooks which is not allowed directly.
  // This approach uses a try-catch block to handle it gracefully.
  // The global context is always available as a fallback.
  const GlobalAppContext = useAppContext();
  let translations = GlobalAppContext.translations;

  if (isFarmerPortal) {
    try {
      // This will throw an error if not inside the FarmerAppProvider,
      // which is expected when we are outside the farmer portal.
      const FarmerContext = useFarmerAppContext();
      translations = FarmerContext.translations;
    } catch (e) {
      // Fallback to global context if FarmerContext is not available.
      // This is a safeguard, but the layout structure should prevent this.
      translations = GlobalAppContext.translations;
    }
  }

  /**
   * Translates a given key into the current language.
   * Traverses a nested object using a dot-separated key string.
   * @param key The key for the translation string (e.g., 'header.title').
   * @param defaultText A fallback string if the key is not found.
   * @returns The translated string, or the defaultText/key if not found.
   */
  const t = (key: string, defaultText?: string): string => {
    // If translations are not loaded for any reason, return the fallback.
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
