
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AppProvider } from '@/context/AppContext';

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
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <div className="flex-1">
                {children}
              </div>
            </div>
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
