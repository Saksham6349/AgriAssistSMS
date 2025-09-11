
"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { FarmerSidebar } from '@/components/FarmerSidebar';

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't render Header and Sidebar on the role selection page
  if (pathname === '/') {
    return <>{children}</>;
  }

  const isFarmerPortal = pathname.startsWith('/farmer');

  return (
    <>
      <Header />
      <div className="flex">
        {isFarmerPortal ? <FarmerSidebar /> : <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
