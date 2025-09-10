
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/AppContext';
import { MainContent } from '@/components/MainContent';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'AgriAssist SMS',
  description: 'Crop Advisory & Weather Alerts for Farmers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProvider>
          <div className="min-h-screen bg-background text-foreground">
            <MainContent>
              {children}
            </MainContent>
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
