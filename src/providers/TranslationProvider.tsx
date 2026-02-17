import { createContext, useContext, useState, useCallback } from 'react';
import { useTranslations } from '@/hooks/queries/use-translations';
import { useQueryClient } from '@tanstack/react-query';

type Locale = 'ka' | 'en';

interface TranslationContextType {
  t: (key: string, fallback?: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key, fallback) => fallback ?? key,
  locale: 'ka',
  setLocale: () => {},
});

export const useT = () => useContext(TranslationContext);

const getInitialLocale = (): Locale => {
  const stored = localStorage.getItem('locale');
  return stored === 'en' ? 'en' : 'ka';
};

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const queryClient = useQueryClient();
  const { data: translations, isPending } = useTranslations(locale);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    setLocaleState(newLocale);
    // Invalidate all queries so content re-fetches in the new language
    queryClient.invalidateQueries();
  }, [queryClient]);

  const t = (key: string, fallback?: string): string => {
    if (translations && key in translations) {
      return translations[key];
    }
    return fallback ?? key;
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};
