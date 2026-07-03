import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "../globals.css";
import PWARegistration from "../PWARegistration";
import { LanguageProvider } from '../../context/LanguageContext';
import { CurrencyProvider } from '../../context/CurrencyContext';
import { Navbar } from '../../components/Navbar';
import { getLocalDB } from "@/lib/db-fallback";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import PublicTranslator from '../../components/PublicTranslator';
import { Toaster } from 'react-hot-toast';
import FloatingConcierge from '../../components/FloatingConcierge';

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "VamosJuntos Luxury Travel",
  description: "Premium travel packages, yachts, and VIP transport.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VamosJuntos",
  },
  alternates: {
    canonical: "/",
    languages: {
      es: "/es",
      en: "/en",
    },
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const username = cookieStore.get('username')?.value || null;
  const userRole = cookieStore.get('user_role')?.value || null;

  // Check if "Quiénes Somos" section is published
  const db = getLocalDB();
  const isAboutUsPublished = db.aboutUs?.status === 'PUBLISHED';

  // Load translations for SSR manually to guarantee 100% accurate locale matching and bypass any Next.js request context cache errors
  const activeLocale = locale === 'en' ? 'en' : 'es';
  const common = (await import(`../../locales/${activeLocale}/common.json`)).default;
  const home = (await import(`../../locales/${activeLocale}/home.json`)).default;
  const services = (await import(`../../locales/${activeLocale}/services.json`)).default;

  const messages = {
    ...common,
    ...home,
    ...services
  };

  return (
    <html lang={locale}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LanguageProvider>
            <CurrencyProvider>
              <PublicTranslator>
                <PWARegistration />
                <Navbar session={session} username={username} role={userRole} isAboutUsPublished={isAboutUsPublished} />
                <Toaster position="top-right" toastOptions={{ 
                  style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } 
                }} />

                <main style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0' }}>
                  {children}
                </main>

                <FloatingConcierge />

                <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '2rem 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} VamosJuntos. All rights reserved.</p>
                </footer>
              </PublicTranslator>
            </CurrencyProvider>
          </LanguageProvider>
        </NextIntlClientProvider>

        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .header-container {
              padding: 0.8rem 1rem !important;
            }
            .nav-menu {
              gap: 1.2rem !important;
            }
            .btn-text-mobile-hide {
              display: none !important;
            }
            .mobile-only-icon-lucide {
              display: inline-block !important;
            }
            h1 {
              font-size: 1.3rem !important;
            }
          }
        `}} />
      </body>
    </html>
  );
}
