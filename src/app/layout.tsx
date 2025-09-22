import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { BalanceProvider } from '@/contexts/balance-context';
import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'Firebase Studio App',
  description: 'Kiếm tiền bằng cách vượt link',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <BalanceProvider>
            <div className="flex min-h-screen flex-col">
              <AppHeader />
              <main className="flex-1">{children}</main>
              <AppFooter />
            </div>
            <Toaster />
          </BalanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
