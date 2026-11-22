"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sun,
  MessageSquareWarning,
  Stethoscope,
  History,
  LayoutDashboard,
  Bot,
  TrendingUp,
  LifeBuoy,
  Sprout,
  UserCheck,
  MapPin,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import React, { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { useAppContext } from '@/context/AppContext';

interface NavItem {
  href: string;
  labelKey: string;
  defaultLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  adminOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { registeredFarmer } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isFarmerPortal = pathname.startsWith('/farmer');

  // Categorized navigation items
  const navSections: NavSection[] = [
    {
      title: 'Core Services',
      items: [
        {
          href: isFarmerPortal ? '/farmer' : '/dashboard',
          labelKey: 'sidebar.dashboard',
          defaultLabel: 'Dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Machine Learning & AI',
      items: [
        {
          href: isFarmerPortal ? '/farmer/crop-recommendation' : '/crop-recommendation',
          labelKey: 'sidebar.cropRecommendation',
          defaultLabel: 'Crop Recommendation',
          icon: Sprout,
          badge: 'ML 99.5%',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        },
        {
          href: isFarmerPortal ? '/farmer/diagnosis' : '/diagnosis',
          labelKey: 'sidebar.diagnosis',
          defaultLabel: 'Crop Diagnosis',
          icon: Stethoscope,
          badge: 'CV Model',
          badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
        },
        {
          href: '/chat',
          labelKey: 'sidebar.chat',
          defaultLabel: 'Chat Assistant',
          icon: Bot,
          badge: 'Gemini',
          badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
          adminOnly: true,
        },
      ],
    },
    {
      title: 'Advisory & Field Insights',
      items: [
        {
          href: isFarmerPortal ? '/farmer/weather' : '/weather',
          labelKey: 'sidebar.weather',
          defaultLabel: 'Weather Forecast',
          icon: Sun,
        },
        {
          href: isFarmerPortal ? '/farmer/advisory' : '/advisory',
          labelKey: 'sidebar.advisory',
          defaultLabel: 'Advisory Alerts',
          icon: MessageSquareWarning,
        },
        {
          href: isFarmerPortal ? '/farmer/market-prices' : '/market-prices',
          labelKey: 'sidebar.market',
          defaultLabel: 'Market Prices',
          icon: TrendingUp,
          badge: 'Mandi',
          badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          href: isFarmerPortal ? '/farmer/history' : '/history',
          labelKey: 'sidebar.history',
          defaultLabel: 'SMS History',
          icon: History,
        },
        {
          href: isFarmerPortal ? '/farmer/help' : '/help',
          labelKey: 'sidebar.help',
          defaultLabel: 'Help Center',
          icon: LifeBuoy,
        },
      ],
    },
  ];

  if (!isMounted) {
    return (
      <aside className="w-64 border-r p-4 hidden md:block bg-card/60 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)]">
        <div className="flex flex-col space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-border/80 p-3 hidden md:flex flex-col justify-between bg-card/50 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Navigation Groups */}
      <div className="space-y-5">
        {navSections.map((section, sIdx) => {
          // Filter out admin-only items if in farmer portal
          const visibleItems = section.items.filter(
            item => !item.adminOnly || !isFarmerPortal
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-3">
                {section.title}
              </span>

              <nav className="space-y-0.5 pt-1">
                {visibleItems.map(item => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant="ghost"
                      className={cn(
                        'w-full justify-start text-left text-xs font-medium rounded-xl h-10 px-3 transition-all',
                        isActive
                          ? 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/95 hover:text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      )}
                    >
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                          <span className="truncate">{t(item.labelKey, item.defaultLabel)}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={cn(
                              'text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1 shrink-0',
                              isActive
                                ? 'bg-primary-foreground/20 text-primary-foreground'
                                : item.badgeColor
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Active Farmer Footer Card */}
      {registeredFarmer && (
        <div className="mt-4 p-3 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1 bg-primary text-primary-foreground rounded-full">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-foreground truncate">
              {registeredFarmer.name}
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-muted-foreground font-medium pl-1">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-primary shrink-0" />
              <span className="truncate">{registeredFarmer.district || registeredFarmer.village}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-primary shrink-0" />
              <span className="font-mono text-[10px]">{registeredFarmer.phone}</span>
            </div>
            {registeredFarmer.crop && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-background/80 border-primary/20 text-primary">
                  {registeredFarmer.crop}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
