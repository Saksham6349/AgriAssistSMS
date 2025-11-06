"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sun, MessageSquareWarning, Stethoscope, History, LayoutDashboard, Bot, TrendingUp, LifeBuoy } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

export function Sidebar() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const isFarmerPortal = pathname.startsWith('/farmer');
    
    const base = isFarmerPortal ? '/farmer' : '';

    const navItems = [
        { href: '/dashboard', label: t('sidebar.dashboard', 'Dashboard'), icon: LayoutDashboard, adminOnly: true },
        { href: '/weather', label: t('sidebar.weather', 'Weather Forecast'), icon: Sun },
        { href: '/advisory', label: t('sidebar.advisory', 'Advisory Alerts'), icon: MessageSquareWarning },
        { href: '/diagnosis', label: t('sidebar.diagnosis', 'Crop Diagnosis'), icon: Stethoscope },
        { href: '/market-prices', label: t('sidebar.market', 'Market Prices'), icon: TrendingUp },
        { href: '/chat', label: t('sidebar.chat', 'Chat Assistant'), icon: Bot, adminOnly: true },
        { href: '/history', label: t('sidebar.history', 'SMS History'), icon: History },
        { href: '/help', label: t('sidebar.help', 'Help Center'), icon: LifeBuoy },
    ];

    const filteredNavItems = isFarmerPortal 
        ? navItems.filter(item => !item.adminOnly).map(item => ({...item, href: item.href === '/dashboard' ? '/farmer' : `/farmer${item.href}`}))
        : navItems.map(item => ({...item, href: item.href}));
    
    // The farmer dashboard is at /farmer, not /farmer/dashboard.
    const finalNavItems = filteredNavItems.map(item => {
        if(isFarmerPortal && item.href === '/farmer/dashboard') {
            return {...item, href: '/farmer'};
        }
        return item;
    });


    return (
        <aside className="w-64 border-r p-4 hidden md:block bg-card sticky top-16 h-[calc(100vh-4rem)]">
          <nav className="flex flex-col space-y-2">
            {finalNavItems.map((item) => (
                <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-left transition-colors duration-200 ease-in-out h-auto",
                        // For exact match on farmer root, and startsWith for others
                        (pathname === item.href) && "bg-primary/10 text-primary font-semibold"
                    )}
                >
                    <Link href={item.href} className="flex items-center py-2">
                        <item.icon className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="whitespace-normal break-words">{item.label}</span>
                    </Link>
                </Button>
            ))}
          </nav>
        </aside>
    );
}
