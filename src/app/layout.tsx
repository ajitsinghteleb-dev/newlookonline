import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const APP_NAME = 'LookOnline Global';
const APP_DESCRIPTION = 'Fully Automated News, Job & Tender Portal with Autonomous SEO.';

export const metadata: Metadata = {
  manifest: '/manifest.json',
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
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          'flex flex-col'
        )}
      >
        <FirebaseClientProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
