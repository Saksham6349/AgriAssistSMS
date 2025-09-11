
"use client";

import { UserManagement } from '@/components/UserManagement';
import { useTranslation } from '@/hooks/useTranslation';

export default function FarmerPage() {
  const { t } = useTranslation();
  return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="text-left mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                {t('dashboard.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                {t('dashboard.description')}
              </p>
            </div>
            <UserManagement />
        </div>
  );
}
