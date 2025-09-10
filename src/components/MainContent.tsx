"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't render Header and Sidebar on the landing page or farmer page
  if (pathname === '/' || pathname === '/farmer') {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
