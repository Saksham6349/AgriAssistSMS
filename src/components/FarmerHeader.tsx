"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Languages, ArrowLeft, Shield, User, PhoneCall } from 'lucide-react';
import { useFarmerAppContext } from '@/context/FarmerAppContext';
import { useAppContext } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FarmerHeader() {
  const pathname = usePathname();
  const farmerContext = useFarmerAppContext();
  const { registeredFarmer } = useAppContext();
  const { language = 'English', setLanguage = () => {}, availableLanguages = {} } = farmerContext || {};
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 py-3 px-4 md:px-8 bg-card/80 backdrop-blur-md border-b border-border/80 shadow-sm transition-all">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Back */}
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Home</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to Landing</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link href="/farmer" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shadow-sm">
              <Leaf className="text-primary w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  AgriAssist
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-mono">
                  Farmer Portal
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Language Selector & Portal Switcher */}
        <div className="flex items-center gap-3">
          {/* Kisan Call Centre Toll-Free Button */}
          <a
            href="tel:18001801551"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold hover:bg-emerald-500/20 transition-all"
            title="National Kisan Call Centre (24x7 Toll Free)"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Kisan Helpline 1800-180-1551</span>
          </a>

          {/* Active Farmer Indicator */}
          {registeredFarmer && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground">Farmer:</span>
              <strong className="text-foreground font-semibold max-w-[120px] truncate">
                {registeredFarmer.name}
              </strong>
            </div>
          )}

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-muted/80 border border-border rounded-xl text-xs">
            <Languages className="h-3.5 w-3.5 text-primary" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-7 border-0 bg-transparent text-xs font-medium text-foreground shadow-none focus:ring-0 px-1.5 gap-1">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent align="end">
                {Object.entries(availableLanguages).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    {String(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Portal Switcher */}
          <div className="flex items-center p-1 bg-muted/80 rounded-xl border border-border text-xs font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            <Link
              href="/farmer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card text-foreground font-semibold shadow-sm transition-all"
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Farmer</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
