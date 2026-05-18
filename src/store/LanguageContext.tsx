import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { pt, Translations } from '@/locales/pt';
import { en } from '@/locales/en';
import { usePreferences } from '@/store/PreferencesContext';

export type Language = 'pt' | 'en';

const LOCALES: Record<Language, Translations> = { pt, en };

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolve(translations: Translations, key: string): string {
  const parts = key.split('.');
  let node: unknown = translations;
  for (const part of parts) {
    if (typeof node !== 'object' || node === null) return key;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { preferences, setPreference } = usePreferences();

  // Normaliza valores legados ('pt-BR') para 'pt'
  const language: Language = preferences.language === 'en' ? 'en' : 'pt';

  const setLanguage = useCallback(
    (lang: Language) => setPreference('language', lang),
    [setPreference],
  );

  const t = useCallback(
    (key: string): string => resolve(LOCALES[language], key),
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
