
"use client";

import { Leaf, Languages } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-muted-foreground" />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableLanguages).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
