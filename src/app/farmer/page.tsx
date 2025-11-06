"use client";

import { UserManagement } from '@/components/UserManagement';
import { useTranslation } from '@/hooks/useTranslation';

export default function FarmerPage() {
  const { t } = useTranslation();
  return (
    <div 
      className="w-full bg-no-repeat bg-cover bg-center min-h-[calc(100vh-4rem)] py-12 md:py-24 px-4" 
      style={{backgroundImage: "url('https://picsum.photos/seed/green-farm/1920/1080')"}}
      data-ai-hint="farm field"
    >
      <div className="bg-black/40 backdrop-blur-sm">
          <div className="container mx-auto">
              <div className="max-w-4xl mx-auto py-12">
                   <div className="text-left mb-8 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">
                      {t('sidebar.dashboard', 'Dashboard')}
                    </h2>
                    <p className="text-white/80 max-w-2xl">
                      {t('dashboard.description')}
                    </p>
                  </div>
                  <UserManagement isAdmin={false} />
              </div>
          </div>
        </div>
    </div>
  );
}
