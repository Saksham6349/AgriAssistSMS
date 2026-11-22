"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, ArrowLeft, Shield, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAppContext } from '@/context/AppContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  const pathname = usePathname();
  const { registeredFarmer } = useAppContext();

  return (
    <header className="sticky top-0 z-50 py-3 px-4 md:px-8 bg-card/80 backdrop-blur-md border-b border-border/80 shadow-sm transition-all">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
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

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shadow-sm">
              <Leaf className="text-primary w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  AgriAssist
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 bg-primary/10 text-primary rounded-md font-mono">
                  SMS
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center/Right: Active Farmer Status & Portal Switcher */}
        <div className="flex items-center gap-3">
          {/* Registered Farmer Status Pill */}
          {registeredFarmer ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground">Active Farmer:</span>
              <strong className="text-foreground font-semibold max-w-[130px] truncate">
                {registeredFarmer.name}
              </strong>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/60 border border-border rounded-full text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>No Farmer Selected</span>
            </div>
          )}

          {/* Quick Portal Switcher Pills */}
          <div className="flex items-center p-1 bg-muted/80 rounded-xl border border-border text-xs font-medium">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !pathname.startsWith('/farmer')
                  ? 'bg-card text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Admin</span>
            </Link>

            <Link
              href="/farmer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                pathname.startsWith('/farmer')
                  ? 'bg-card text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
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
