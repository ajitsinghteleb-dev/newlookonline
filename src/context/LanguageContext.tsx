"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageContextType = {
  lang: string;
  setLang: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('app_lang');
    if (storedLang) {
      setLangState(storedLang);
    }
  }, []);

  const setLang = (newLang: string) => {
    localStorage.setItem('app_lang', newLang);
    setLangState(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
