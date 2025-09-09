import { AdvisoryAlerts } from '@/components/AdvisoryAlerts';
import { Header } from '@/components/Header';
import { UserManagement } from '@/components/UserManagement';
import { WeatherCard } from '@/components/WeatherCard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">
            Your Farming Dashboard
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get real-time weather forecasts, crop advisories, and pest warnings tailored to your needs. Empowering you to make informed decisions for a better harvest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
