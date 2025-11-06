"use client";

import { UserManagement } from '@/components/UserManagement';

export default function DashboardPage() {
  return (
    <div 
      className="w-full bg-no-repeat bg-cover bg-center min-h-[calc(100vh-4rem)] py-12 md:py-24 px-4" 
      style={{backgroundImage: "url('https://picsum.photos/seed/green-farm/1920/1080')"}}
      data-ai-hint="farm landscape"
    >
      <div className="bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto py-12">
              <div className="text-left mb-8 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  Farming Dashboard
                </h2>
                <p className="text-white/80 max-w-2xl">
                  Register farmers and send them real-time alerts.
                </p>
              </div>
              <div className="grid grid-cols-1">
                  <div className="lg:col-span-1">
                      <UserManagement isAdmin={true} />
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
