
"use client";

import { LayoutDashboard } from 'lucide-react';
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <UserManagement />
                </div>
                <div className="lg:col-span-2">
                    <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-gray-300 p-8">
                        <div className="text-center">
                            <LayoutDashboard className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Welcome to your Dashboard</h3>
                            <p className="mt-1 text-sm text-gray-500">Select a tool from the sidebar to open it in a new tab.</p>
                            <p className="mt-1 text-sm text-gray-500">Register a farmer here to get started.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
  );
}
