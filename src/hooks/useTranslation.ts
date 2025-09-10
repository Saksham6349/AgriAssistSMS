
"use client";

import { useAppContext } from "@/context/AppContext";

/**
 * Custom hook for handling translations.
 * @returns An object containing the `t` function for translating keys.
 *
 * Example:
 * const { t } = useTranslation();
 * const translatedText = t('header.title');
 */
export const useTranslation = () => {
  const { translations } = useAppContext();

  /**
   * Translates a given key into the current language.
   * Traverses a nested object using a dot-separated key string.
   * @param key The key for the translation string (e.g., 'header.title').
   * @returns The translated string, or the key itself if not found.
   */
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // If the key is not found, return the key itself as a fallback.
        return key;
      }
    }

    return typeof result === 'string' ? result : key;
  };

  return { t };
};
