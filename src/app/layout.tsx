import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import { FirebaseClientProvider } from '@/firebase';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const APP_NAME = 'LookOnline Global';
const APP_DESCRIPTION = 'Fully Automated News, Job & Tender Portal with Autonomous SEO.';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    url: 'https://lookonline.in',
    siteName: APP_NAME,
    description: APP_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#dc2626',
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
          <LanguageProvider>
            <FirebaseClientProvider>
              <AuthProvider>
                <Navbar />
                <main className="min-h-screen bg-background text-foreground">
                  {children}
                </main>
                <Toaster />
              </AuthProvider>
            </FirebaseClientProvider>
          </LanguageProvider>
      </body>
    </html>
  );
}
