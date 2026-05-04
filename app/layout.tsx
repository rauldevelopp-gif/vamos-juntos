import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";
import PWARegistration from "./PWARegistration";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get('session');

  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <PWARegistration />
        <header style={{
          borderBottom: '1px solid var(--border-glass)',
          background: 'rgba(5, 7, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'var(--transition-smooth)'
        }}>
          <div className="container header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }} className="text-gradient">VamosJuntos</h1>
            </Link>
            <nav className="nav-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/" className="nav-link">
                <span className="btn-text-mobile-hide">Home</span>
                <span className="mobile-only-icon" style={{ display: 'none' }}>🏠</span>
              </Link>
              <Link href="/packages" className="nav-link">
                <span className="btn-text-mobile-hide">Paquetes</span>
                <span className="mobile-only-icon" style={{ display: 'none' }}>📦</span>
              </Link>
              
              {session ? (
                <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
                  <button type="submit" className="nav-auth-btn">
                    <span className="btn-text-mobile-hide">Cerrar Sesión</span>
                    <span style={{ fontSize: '1.2rem' }}>🚪</span>
                  </button>
                </form>
              ) : (
                <Link href="/login" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  <span className="btn-text-mobile-hide">Entrar</span>
                  <span className="mobile-only-icon" style={{ display: 'none', fontSize: '1.2rem' }}>🔑</span>
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0' }}>
          {children}
        </main>

        <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '2rem 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} VamosJuntos. All rights reserved.</p>
        </footer>

        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .header-container {
              padding: 0.8rem 1rem !important;
            }
            .nav-menu {
              gap: 1.2rem !important;
            }
            .mobile-only-icon {
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
