import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";
import PWARegistration from "./PWARegistration";
import { LanguageProvider } from '../context/LanguageContext';
import { Navbar } from '../components/Navbar';

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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <LanguageProvider>
          <PWARegistration />
          <Navbar session={session} />

          <main style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0' }}>
            {children}
          </main>

          <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '2rem 0', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} VamosJuntos. All rights reserved.</p>
          </footer>
        </LanguageProvider>

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
