import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@preferences';

export type AppPreferences = {
  language: 'pt' | 'en';
  currency: string;
  theme: 'light' | 'dark';
  balanceVisible: boolean;
};

const DEFAULTS: AppPreferences = {
  language: 'pt',
  currency: 'BRL',
  theme: 'light',
  balanceVisible: true,
};

type PreferencesContextValue = {
  preferences: AppPreferences;
  setPreference: <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setPreferences({ ...DEFAULTS, ...JSON.parse(raw) });
        } catch {
          // ignore malformed data
        }
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const setPreference = useCallback(<K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo(() => ({ preferences, setPreference }), [preferences, setPreference]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside PreferencesProvider');
  return ctx;
}
