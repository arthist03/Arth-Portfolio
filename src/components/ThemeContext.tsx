import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: Theme = 'light';
  const isTransitioning = false;

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Remove dark class explicitly, add light
    root.classList.remove('dark');
    body.classList.remove('dark');
    root.classList.add('light');
    body.classList.add('light');
    
    // Force light Neo-brutalist palette colors on body
    body.style.backgroundColor = '#fbfaf5'; // Sand/Vanilla
    body.style.color = '#0f172a'; // Slate-905
    
    localStorage.setItem('theme', 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    // Locked to light mode: no action
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
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