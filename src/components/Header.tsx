
"use client";

import { Leaf, Languages } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';

export function Header() {
  const { language, setLanguage, availableLanguages } = useAppContext();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 py-4 px-6 bg-card border-b">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Leaf className="text-primary" size={24} />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {t('header.title')}
          </h1>
        </div>

      </div>
    </header>
  );
}
