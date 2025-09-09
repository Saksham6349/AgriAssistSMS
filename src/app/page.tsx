import { AdvisoryAlerts } from '@/components/AdvisoryAlerts';
import { Header } from '@/components/Header';
import { UserManagement } from '@/components/UserManagement';
import { WeatherCard } from '@/components/WeatherCard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            Farming Dashboard
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Real-time weather, crop advisories, and pest warnings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeatherCard />
          </div>
          <div className="lg:row-span-2">
            <UserManagement />
          </div>
          <div className="lg:col-span-2">
            <AdvisoryAlerts />
          </div>
        </div>
      </main>
      <footer className="text-center p-6 text-sm text-muted-foreground border-t mt-12">
        © {new Date().getFullYear()} AgriAssist SMS. All rights reserved.
      </footer>
    </div>
  );
}
