
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sun, MessageSquareWarning, Stethoscope, History, LayoutDashboard, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/weather', label: 'Weather Forecast', icon: Sun },
    { href: '/advisory', label: 'Advisory Alerts', icon: MessageSquareWarning },
    { href: '/diagnosis', label: 'Crop Diagnosis', icon: Stethoscope },
    { href: '/chat', label: 'Chat Assistant', icon: Bot },
    { href: '/history', label: 'SMS History', icon: History },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r p-4 hidden md:block bg-card sticky top-16 h-[calc(100vh-4rem)]">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
                <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-left transition-colors duration-200 ease-in-out hover:bg-primary/10 hover:text-primary",
                        pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                >
                    <Link href={item.href}>
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                    </Link>
                </Button>
            ))}
          </nav>
        </aside>
    );
}
