import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (next: Theme) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    root.classList.toggle('dark', theme === 'dark');
    body.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    body.classList.toggle('light', theme === 'light');

    body.style.backgroundColor = theme === 'dark' ? '#181818' : '#fbfaf5';
    body.style.color = theme === 'dark' ? '#f3f4f6' : '#0f172a';

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#181818' : '#fbfaf5');
    }

    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setIsTransitioning(true);
    setThemeState(next);
    window.setTimeout(() => setIsTransitioning(false), 250);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
