
"use client";

import { UserManagement } from '@/components/UserManagement';

export default function Home() {
  return (
        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="text-left mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                Farming Dashboard
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Register farmers and send them real-time alerts.
              </p>
            </div>
            <div className="grid grid-cols-1">
                <div className="lg:col-span-1">
                    <UserManagement />
                </div>
            </div>
        </main>
  );
}
