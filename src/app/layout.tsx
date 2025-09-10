
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'SmartSMS',
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
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
