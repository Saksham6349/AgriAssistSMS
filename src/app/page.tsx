
"use client";

import { useState } from 'react';
import { AdvisoryAlerts } from '@/components/AdvisoryAlerts';
import { Header } from '@/components/Header';
import { PestDiseaseIdentification } from '@/components/PestDiseaseIdentification';
import { UserManagement, FarmerData } from '@/components/UserManagement';
import { WeatherCard } from '@/components/WeatherCard';
import { SmsHistory, SmsMessage } from '@/components/SmsHistory';
import { Button } from '@/components/ui/button';
import { Sun, MessageSquareWarning, Stethoscope, History, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActiveView = 'dashboard' | 'weather' | 'advisory' | 'diagnosis' | 'history';

export default function Home() {
  const [registeredFarmer, setRegisteredFarmer] = useState<FarmerData | null>(null);
  const [smsHistory, setSmsHistory] = useState<SmsMessage[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const addSmsToHistory = (message: Omit<SmsMessage, 'timestamp'>) => {
    setSmsHistory(prev => [{ ...message, timestamp: new Date() }, ...prev]);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'weather':
        return <WeatherCard registeredFarmer={registeredFarmer} onSmsSent={addSmsToHistory} />;
      case 'advisory':
        return <AdvisoryAlerts registeredFarmer={registeredFarmer} onSmsSent={addSmsToHistory} />;
      case 'diagnosis':
        return <PestDiseaseIdentification />;
      case 'history':
        return <SmsHistory history={smsHistory} />;
      case 'dashboard':
      default:
        return (
            <div className="lg:col-span-2 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-gray-300 p-8">
                <div className="text-center">
                    <LayoutDashboard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Welcome to your Dashboard</h3>
                    <p className="mt-1 text-sm text-gray-500">Select a tool from the sidebar to get started.</p>
                </div>
            </div>
        )
    }
  };

  const NavButton = ({ view, label, icon: Icon }: { view: ActiveView, label: string, icon: React.ElementType }) => (
    <Button
      variant="ghost"
      onClick={() => setActiveView(view)}
      className={cn(
        "w-full justify-start text-left",
        activeView === view && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className="mr-2 h-5 w-5" />
      {label}
    </Button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1">
        <aside className="w-64 border-r p-4 hidden md:block">
          <nav className="flex flex-col space-y-2">
            <NavButton view="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavButton view="weather" label="Weather Forecast" icon={Sun} />
            <NavButton view="advisory" label="Advisory Alerts" icon={MessageSquareWarning} />
            <NavButton view="diagnosis" label="Crop Diagnosis" icon={Stethoscope} />
            <NavButton view="history" label="SMS History" icon={History} />
          </nav>
        </aside>
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
                <div className="lg:col-span-1 lg:row-span-3">
                    <UserManagement 
                        registeredFarmer={registeredFarmer} 
                        setRegisteredFarmer={setRegisteredFarmer} 
                    />
                </div>
                <div className="lg:col-span-2">
                  {renderActiveView()}
                </div>
                 {activeView !== 'history' && (
                    <div className="lg:col-span-3">
                      <SmsHistory history={smsHistory} />
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
}
