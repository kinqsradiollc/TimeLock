import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemeOption } from '../types/theme';
import { SettingsRepository } from '../repositories';

interface ThemeContextValue {
  theme: ThemeOption;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: ThemeOption) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemTheme = useColorScheme() ?? 'light';
  const [theme, setThemeState] = useState<ThemeOption>('system');

  // Load theme from settings on mount
  useEffect(() => {
    SettingsRepository.getAppSettings()
      .then((settings) => setThemeState(settings.theme))
      .catch((err) => console.error('Failed to load theme:', err));
  }, []);

  const effectiveTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme;

  const setTheme = async (newTheme: ThemeOption) => {
    setThemeState(newTheme);
    await SettingsRepository.updateAppSettings({ theme: newTheme });
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
