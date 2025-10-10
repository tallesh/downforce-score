'use client';

import { useState, useEffect } from 'react';
import ptBR from '@/locales/pt-BR.json';
import en from '@/locales/en.json';

export type Locale = 'pt-BR' | 'en';

const translations = {
  'pt-BR': ptBR,
  'en': en,
};

export type Translations = typeof ptBR;

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'pt-BR';
  
  const browserLang = navigator.language;
  if (browserLang.startsWith('en')) return 'en';
  return 'pt-BR'; // Default
}

export function useTranslations(): Translations {
  const [locale, setLocale] = useState<Locale>('pt-BR');

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  return translations[locale];
}
