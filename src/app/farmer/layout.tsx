
"use client";

import { useEffect } from "react";
import { FarmerAppProvider } from "@/context/FarmerAppContext";
import { FarmerHeader } from "@/components/FarmerHeader";
import { Sidebar } from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setRegisteredFarmer } = useAppContext();

  // This effect will run when the component unmounts (i.e., when navigating away from the farmer portal)
  useEffect(() => {
    return () => {
      // Clear the registered farmer data when leaving the farmer portal
      setRegisteredFarmer(null);
    };
  }, [setRegisteredFarmer]);
  
  return (
    <FarmerAppProvider>
        <FarmerHeader />
        <div className="flex">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    </FarmerAppProvider>
  );
}
