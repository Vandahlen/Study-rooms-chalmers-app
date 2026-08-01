// study-rooms/i18n/I18nContext.tsx
/**
 * i18n/I18nContext.tsx
 *
 * Exposes the active translation dictionary and a toggleLang
 * function. Renders no language switcher of its own - a host app
 * calls toggleLang from wherever its own navigation places one.
 * Choice is persisted so it survives app restarts.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Translation, translations } from './translations';

const STORAGE_KEY = 'study-rooms.language';
const DEFAULT_LANGUAGE: Language = 'sv';

export interface I18nContextValue {
  t: Translation;
  lang: Language;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextValue>({
  t: translations[DEFAULT_LANGUAGE],
  lang: DEFAULT_LANGUAGE,
  toggleLang: () => {},
});

export interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [lang, setLang] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'en' || stored === 'sv') {
        setLang(stored);
      }
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Language = prev === 'en' ? 'sv' : 'en';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <I18nContext.Provider value={{ t: translations[lang], lang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
