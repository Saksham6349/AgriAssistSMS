
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

    const navItems = [
        { href: '/', label: t('sidebar.dashboard'), icon: LayoutDashboard },
        { href: '/weather', label: t('sidebar.weather'), icon: Sun },
        { href: '/advisory', label: t('sidebar.advisory'), icon: MessageSquareWarning },
        { href: '/diagnosis', label: t('sidebar.diagnosis'), icon: Stethoscope },
        { href: '/market-prices', label: t('sidebar.market'), icon: TrendingUp },
        { href: '/chat', label: t('sidebar.chat'), icon: Bot },
        { href: '/history', label: t('sidebar.history'), icon: History },
        { href: '/help', label: t('sidebar.help'), icon: LifeBuoy },
    ];

    return (
        <aside className="w-64 border-r p-4 hidden md:block bg-card sticky top-16 h-[calc(100vh-4rem)]">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
                <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-left transition-colors duration-200 ease-in-out hover:bg-primary/20 hover:text-primary h-auto",
                        pathname === item.href && "bg-primary/20 text-primary-foreground font-semibold"
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
